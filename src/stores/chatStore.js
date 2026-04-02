import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    isDrawerOpen: false,
    conversations: JSON.parse(localStorage.getItem('chat_conversations') || '[]'),
    messages: JSON.parse(localStorage.getItem('chat_messages') || '[]'),
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
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    },
    getConversationMessages: (state) => (convId) => {
      return state.messages
        .filter(m => m.conversationId === convId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    }
  },
  actions: {
    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen
    },
    saveToStorage() {
      localStorage.setItem('chat_conversations', JSON.stringify(this.conversations))
      localStorage.setItem('chat_messages', JSON.stringify(this.messages))
    },
    getOrCreateConversation(userA, userB) {
      if (!userA || !userB) return null
      // Find existing
      let conv = this.conversations.find(c => 
         c.participants.includes(userA) && c.participants.includes(userB) && c.participants.length === 2
      )
      if (!conv) {
         conv = {
            id: `conv_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,
            participants: [userA, userB],
            updatedAt: new Date().toISOString(),
            unreadCounts: { [userA]: 0, [userB]: 0 }
         }
         this.conversations.unshift(conv)
         this.saveToStorage()
      }
      return conv
    },
    sendMessage(conversationId, senderId, text, file = null) {
      const conv = this.conversations.find(c => c.id === conversationId)
      if (!conv) return

      const msg = {
         id: `msg_${Date.now()}`,
         conversationId,
         senderId,
         text,
         file, // { name, type, dataURL }
         timestamp: new Date().toISOString()
      }
      this.messages.push(msg)

      // Update unread count for the OTHER participant(s)
      conv.updatedAt = new Date().toISOString()
      conv.participants.forEach(pId => {
         if (pId !== senderId) {
            conv.unreadCounts[pId] = (conv.unreadCounts[pId] || 0) + 1
         }
      })
      this.saveToStorage()
    },
    markAsRead(conversationId, userId) {
      const conv = this.conversations.find(c => c.id === conversationId)
      if (conv && conv.unreadCounts[userId]) {
         conv.unreadCounts[userId] = 0
         this.saveToStorage()
      }
    }
  }
})
