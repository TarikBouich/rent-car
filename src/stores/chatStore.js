import { defineStore } from 'pinia'
import { loadStateJson, saveStateJson } from '../services/stateJsonService'
import { subscribeStateEvents } from '../services/stateStreamService'

const extractEpochFromId = (id) => {
  const match = String(id || '').match(/\d{10,13}/)
  if (!match) return 0
  const parsed = Number(match[0])
  return Number.isFinite(parsed) ? parsed : 0
}

const toEpochMs = (raw, fallback = 0) => {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) return raw
  if (typeof raw === 'string') {
    const numeric = Number(raw)
    if (Number.isFinite(numeric) && numeric > 0) return numeric
    const parsed = Date.parse(raw)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

const normalizeConversation = (conv) => {
  const fallbackMs = extractEpochFromId(conv?.id) || Date.now()
  const updatedAtMs = toEpochMs(conv?.updatedAtMs, toEpochMs(conv?.updatedAt, fallbackMs))
  return {
    ...conv,
    updatedAtMs,
    updatedAt: conv?.updatedAt || new Date(updatedAtMs).toISOString()
  }
}

const normalizeMessage = (msg) => {
  const fallbackMs = extractEpochFromId(msg?.id) || Date.now()
  const timestampMs = toEpochMs(msg?.timestampMs, toEpochMs(msg?.timestamp, fallbackMs))
  return {
    ...msg,
    timestampMs,
    timestamp: msg?.timestamp || new Date(timestampMs).toISOString()
  }
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    isDrawerOpen: false,
    conversations: [],
    messages: [],
    isSyncing: false,
    isInitialized: false,
    stopStream: null,
  }),
  getters: {
    getUnreadCount: (state) => (userId) => {
      if (!userId) return 0
      return state.conversations.reduce((acc, conv) => {
         const count = conv.unreadCounts?.[userId] || 0
         return acc + count
      }, 0)
    },
    getUserConversations: (state) => (userId) => {
      // Return conversations where userId is a participant, sorted by recently updated
      return state.conversations
        .filter(c => c.participants.includes(userId))
        .sort((a, b) => {
          const delta = (b.updatedAtMs || 0) - (a.updatedAtMs || 0)
          if (delta !== 0) return delta
          return String(b.id || '').localeCompare(String(a.id || ''))
        })
    },
    getConversationMessages: (state) => (convId) => {
      return state.messages
        .filter(m => m.conversationId === convId)
        .sort((a, b) => {
          const delta = (a.timestampMs || 0) - (b.timestampMs || 0)
          if (delta !== 0) return delta
          return String(a.id || '').localeCompare(String(b.id || ''))
        })
    }
  },
  actions: {
    async initializeFromStorage() {
      const conversations = await loadStateJson('chat_conversations', [])
      const messages = await loadStateJson('chat_messages', [])

      this.conversations = Array.isArray(conversations) ? conversations.map(normalizeConversation) : []
      this.messages = Array.isArray(messages) ? messages.map(normalizeMessage) : []
      this.isInitialized = true
      this.connectLiveUpdates()
    },
    connectLiveUpdates() {
      if (this.stopStream) return

      this.stopStream = subscribeStateEvents({
        onMessage: async (event) => {
          if (!event || !event.key) return
          if (event.key === 'chat_conversations') {
            const remoteConversations = await loadStateJson('chat_conversations', this.conversations)
            if (Array.isArray(remoteConversations)) {
              this.conversations = remoteConversations.map(normalizeConversation)
            }
            return
          }
          if (event.key === 'chat_messages') {
            const remoteMessages = await loadStateJson('chat_messages', this.messages)
            if (Array.isArray(remoteMessages)) {
              this.messages = remoteMessages.map(normalizeMessage)
            }
          }
        },
        onError: () => {
          // EventSource auto-reconnects by itself; no manual loop here.
        }
      })
    },
    disconnectLiveUpdates() {
      if (this.stopStream) {
        this.stopStream()
        this.stopStream = null
      }
    },
    async syncFromDatabase() {
      if (this.isSyncing) return
      this.isSyncing = true
      try {
        // Keep existing data as fallback to avoid clearing UI on temporary network issues.
        const remoteConversations = await loadStateJson('chat_conversations', this.conversations)
        const remoteMessages = await loadStateJson('chat_messages', this.messages)

        if (Array.isArray(remoteConversations)) {
          const normalizedRemoteConversations = remoteConversations.map(normalizeConversation)
          const localConv = JSON.stringify(this.conversations)
          const remoteConv = JSON.stringify(normalizedRemoteConversations)
          if (localConv !== remoteConv) {
            this.conversations = normalizedRemoteConversations
          }
        }

        if (Array.isArray(remoteMessages)) {
          const normalizedRemoteMessages = remoteMessages.map(normalizeMessage)
          const localMsgs = JSON.stringify(this.messages)
          const remoteMsgs = JSON.stringify(normalizedRemoteMessages)
          if (localMsgs !== remoteMsgs) {
            this.messages = normalizedRemoteMessages
          }
        }
      } finally {
        this.isSyncing = false
      }
    },
    async toggleDrawer() {
      if (!this.isInitialized) {
        await this.initializeFromStorage()
      }
      this.isDrawerOpen = !this.isDrawerOpen
      if (this.isDrawerOpen) {
        await this.syncFromDatabase()
      }
    },
    async saveConversations() {
      await saveStateJson('chat_conversations', this.conversations)
    },
    async saveMessages() {
      await saveStateJson('chat_messages', this.messages)
    },
    async saveAll() {
      await Promise.all([this.saveConversations(), this.saveMessages()])
    },
    async getOrCreateConversation(userA, userB) {
      if (!userA || !userB) return null
      // Find existing
      let conv = this.conversations.find(c => 
         c.participants.includes(userA) && c.participants.includes(userB) && c.participants.length === 2
      )
      if (!conv) {
         const now = Date.now()
         conv = {
            id: `conv_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,
            participants: [userA, userB],
            updatedAt: new Date(now).toISOString(),
            updatedAtMs: now,
            unreadCounts: { [userA]: 0, [userB]: 0 }
         }
         this.conversations.unshift(conv)
         await this.saveConversations()
      }
      return conv
    },
    async sendMessage(conversationId, senderId, text, file = null) {
      const conv = this.conversations.find(c => c.id === conversationId)
      if (!conv) return

      const now = Date.now()
      const msg = {
         id: `msg_${Date.now()}`,
         conversationId,
         senderId,
         text,
         file, // { name, type, dataURL }
         timestamp: new Date(now).toISOString(),
         timestampMs: now
      }
      this.messages.push(normalizeMessage(msg))

      // Update unread count for the OTHER participant(s)
      conv.updatedAt = new Date(now).toISOString()
      conv.updatedAtMs = now
      conv.participants.forEach(pId => {
         if (pId !== senderId) {
            conv.unreadCounts[pId] = (conv.unreadCounts[pId] || 0) + 1
         }
      })
      await this.saveAll()
    },
    async markAsRead(conversationId, userId) {
      const conv = this.conversations.find(c => c.id === conversationId)
      if (conv && conv.unreadCounts[userId]) {
         conv.unreadCounts[userId] = 0
         await this.saveConversations()
      }
    }
  }
})
