<template>
  <div>
    <!-- Widget Container -->
    <div 
      class="fixed bottom-6 right-6 h-[550px] max-h-[80vh] w-[360px] bg-white dark:bg-[#151923] sm:rounded-2xl shadow-2xl z-50 transform transition-all duration-300 flex flex-col border border-gray-200 dark:border-gray-800 overflow-hidden"
      :class="chatStore.isDrawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'"
    >
      
      <!-- HEADER -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 shrink-0">
        <div class="flex items-center gap-3">
           <button v-if="activeConversation || showNewChat" @click="goBack" class="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors">
             <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
           </button>
           <h2 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
             {{ activeUserTarget ? activeUserTarget.name : 'Messagerie Interne' }}
           </h2>
        </div>
        <button @click="chatStore.toggleDrawer()" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- VIEW 1: CONVERSATION LIST -->
      <div v-if="!activeConversation && !showNewChat" class="flex-1 overflow-y-auto relative flex flex-col">
         <!-- Empty Default List -->
         <div v-if="userConversations.length === 0" class="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gray-50/50 dark:bg-transparent">
            <div class="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-3">
               <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </div>
            <h3 class="text-sm text-gray-900 dark:text-white font-bold mb-1">Aucune discussion</h3>
            <p class="text-xs text-gray-500 mb-6">Communiquez avec vos collègues en temps réel.</p>
         </div>

         <div v-else class="flex-1 overflow-y-auto">
            <div 
               v-for="conv in userConversations" :key="conv.id"
               @click="openConversation(conv)"
               class="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex gap-3 transition-colors"
            >
               <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold shrink-0">
                  {{ getOtherUser(conv)?.name?.charAt(0) || '?' }}
               </div>
               <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start mb-1">
                     <h4 class="font-bold text-gray-900 dark:text-white truncate pr-2 text-sm">{{ getOtherUser(conv)?.name || 'Utilisateur inconnu' }}</h4>
                     <span class="text-xs text-gray-400 whitespace-nowrap">{{ formatDate(conv.updatedAt) }}</span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                     <span v-if="hasLastMessageFile(conv)" class="mr-1">📎</span>
                     {{ getLastMessage(conv) }}
                  </p>
               </div>
               <div v-if="conv.unreadCounts[currentUser.id]" class="w-5 h-5 bg-[#fa5b0f] text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 self-center">
                  {{ conv.unreadCounts[currentUser.id] }}
               </div>
            </div>
         </div>

         <!-- Floating New Chat Button -->
         <button 
           @click="showNewChat = true" 
           class="absolute bottom-6 right-6 w-14 h-14 bg-[#fa5b0f] hover:bg-[#eb4b05] text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105"
         >
           <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
         </button>
      </div>

      <!-- VIEW 1B: NEW CHAT DIRECTORY -->
      <div v-else-if="showNewChat" class="flex-1 overflow-y-auto flex flex-col bg-gray-50 dark:bg-[#151923]">
         <div class="p-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E2330] sticky top-0">
            <input v-model="searchColleague" type="text" placeholder="Chercher un employé..." class="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#fa5b0f]">
         </div>
         <div class="flex-1">
            <h4 class="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Annuaire Employés</h4>
            <div 
               v-for="user in filteredColleagues" :key="user.id"
               @click="startChatWith(user)"
               class="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            >
               <div class="w-10 h-10 bg-[#fa5b0f]/10 text-[#fa5b0f] rounded-full flex items-center justify-center font-bold text-sm">
                  {{ user.name?.charAt(0) }}
               </div>
               <div>
                  <div class="text-sm font-bold text-gray-900 dark:text-white">{{ user.name }}</div>
                  <div class="text-xs text-gray-500">{{ user.role }}</div>
               </div>
            </div>
         </div>
      </div>

      <!-- VIEW 2: ACTIVE CONVERSATION -->
      <div v-else class="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/30 dark:bg-transparent">
         <!-- Messages Area -->
         <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3" ref="messagesContainer">
            <div v-for="msg in activeMessages" :key="msg.id" class="flex flex-col w-full" :class="msg.senderId === currentUser.id ? 'items-end' : 'items-start'">
               
               <!-- Msg Content -->
               <div 
                  class="max-w-[85%] rounded-2xl text-sm overflow-hidden"
                  :class="msg.senderId === currentUser.id ? 'bg-[#fa5b0f] text-white rounded-tr-sm' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm'"
               >
                  <!-- Optional File Attachment -->
                  <div v-if="msg.file" class="p-2 border-b border-black/10 dark:border-white/10">
                     <!-- Image block -->
                     <img v-if="msg.file.type.startsWith('image/')" :src="msg.file.dataURL" class="w-full h-auto max-w-[200px] rounded-lg cursor-pointer" @click="downloadFile(msg.file)" title="Télécharger l'image" />
                     <!-- Document block -->
                     <a v-else :href="msg.file.dataURL" :download="msg.file.name" class="flex items-center gap-2 px-3 py-2 bg-black/5 dark:bg-white/5 rounded-lg hover:bg-black/10 transition-colors">
                        <svg class="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span class="truncate text-xs font-bold">{{ msg.file.name }}</span>
                     </a>
                  </div>
                  
                  <!-- Optional Text -->
                  <div v-if="msg.text" class="px-3 py-2">
                     {{ msg.text }}
                  </div>
               </div>
               
               <!-- Timestamp -->
               <span class="text-[10px] text-gray-400 mt-1 mx-1">{{ formatTime(msg.timestamp) }}</span>
            </div>
         </div>
         
         <!-- Input Area -->
         <div class="p-3 bg-white dark:bg-[#1E2330] border-t border-gray-100 dark:border-gray-800 shrink-0">
            <!-- File Preview Attachment -->
            <div v-if="pendingFile" class="mb-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between border border-gray-200 dark:border-gray-700">
               <div class="flex items-center gap-2 overflow-hidden">
                  <svg class="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                  <span class="text-xs text-gray-600 dark:text-gray-300 truncate font-semibold">{{ pendingFile.name }}</span>
               </div>
               <button @click="pendingFile = null" class="text-red-500 hover:text-red-700 ml-2 shrink-0">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
               </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="sendMessage" class="flex items-end gap-2">
               <!-- Hidden File Input -->
               <input type="file" ref="fileInput" class="hidden" @change="onFileSelected" />
               <button type="button" @click="$refs.fileInput.click()" class="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors shrink-0 mb-0.5">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
               </button>

               <textarea 
                  v-model="newMessage" 
                  placeholder="Écrivez un message..." 
                  rows="1"
                  class="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#fa5b0f] dark:text-white outline-none resize-none overflow-hidden max-h-[100px]"
                  ref="msgInput"
                  @keydown.enter.prevent="sendMessage"
                  @input="autoResize"
               ></textarea>
               
               <button 
                  type="submit" 
                  :disabled="!newMessage.trim() && !pendingFile"
                  class="w-9 h-9 bg-[#fa5b0f] hover:bg-[#eb4b05] disabled:bg-gray-300 disabled:dark:bg-gray-700 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center shrink-0 transition-colors mb-0.5"
               >
                  <svg class="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
               </button>
            </form>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useChatStore } from '../stores/chatStore'
import { useUserStore } from '../stores/userStore'

const chatStore = useChatStore()
const userStore = useUserStore()

const currentUser = computed(() => userStore.currentUser || {})
const allUsers = computed(() => userStore.users || [])

const activeConversation = ref(null)
const showNewChat = ref(false)
const searchColleague = ref('')
const newMessage = ref('')
const messagesContainer = ref(null)
const msgInput = ref(null)
const fileInput = ref(null)
const pendingFile = ref(null)

const userConversations = computed(() => chatStore.getUserConversations(currentUser.value.id))

const filteredColleagues = computed(() => {
   return allUsers.value.filter(u => 
      u.id !== currentUser.value.id && 
      u.name.toLowerCase().includes(searchColleague.value.toLowerCase())
   )
})

const activeMessages = computed(() => {
   if (!activeConversation.value) return []
   return chatStore.getConversationMessages(activeConversation.value.id)
})

const activeUserTarget = computed(() => {
   if (!activeConversation.value) return null
   return getOtherUser(activeConversation.value)
})

const getOtherUser = (conv) => {
   const otherId = conv.participants.find(id => id !== currentUser.value.id)
   return allUsers.value.find(u => u.id === otherId) || null
}

const hasLastMessageFile = (conv) => {
   const msgs = chatStore.getConversationMessages(conv.id)
   if (!msgs || msgs.length === 0) return false
   return !!msgs[msgs.length - 1].file
}

const getLastMessage = (conv) => {
   const msgs = chatStore.getConversationMessages(conv.id)
   if (!msgs || msgs.length === 0) return 'Nouvelle discussion'
   const msg = msgs[msgs.length - 1]
   return msg.text || (msg.file ? `Fichier: ${msg.file.name}` : '...')
}

const formatDate = (isoStr) => {
   if (!isoStr) return ''
   const d = new Date(isoStr)
   const today = new Date()
   if(d.toDateString() === today.toDateString()){
      return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
   }
   return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

const formatTime = (isoStr) => {
   if (!isoStr) return ''
   return new Date(isoStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const goBack = () => {
   activeConversation.value = null
   showNewChat.value = false
}

const scrollToBottom = async () => {
   await nextTick()
   if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
   }
}

const openConversation = (conv) => {
   activeConversation.value = conv
   showNewChat.value = false
   chatStore.markAsRead(conv.id, currentUser.value.id)
   scrollToBottom()
   setTimeout(() => msgInput.value?.focus(), 100)
}

const startChatWith = (targetUser) => {
   const conv = chatStore.getOrCreateConversation(currentUser.value.id, targetUser.id)
   openConversation(conv)
}

const autoResize = () => {
   if (!msgInput.value) return
   msgInput.value.style.height = 'auto'
   msgInput.value.style.height = msgInput.value.scrollHeight + 'px'
}

const onFileSelected = (event) => {
   const file = event.target.files[0]
   if (!file) return
   
   // Limit to ~2MB to protect LocalStorage in this simulated phase
   if (file.size > 2 * 1024 * 1024) {
      alert("Le fichier est trop volumineux. La limite est de 2Mo dans cette version de démonstration.")
      fileInput.value.value = ''
      return
   }

   const reader = new FileReader()
   reader.onload = (e) => {
      pendingFile.value = {
         name: file.name,
         type: file.type || 'unknown',
         dataURL: e.target.result
      }
   }
   reader.readAsDataURL(file)
   fileInput.value.value = '' // reset
}

const downloadFile = (fileObj) => {
   const a = document.createElement('a')
   a.href = fileObj.dataURL
   a.download = fileObj.name
   document.body.appendChild(a)
   a.click()
   document.body.removeChild(a)
}

const sendMessage = () => {
   if ((!newMessage.value.trim() && !pendingFile.value) || !activeConversation.value) return
   
   chatStore.sendMessage(
      activeConversation.value.id, 
      currentUser.value.id, 
      newMessage.value.trim(),
      pendingFile.value
   )
   
   newMessage.value = ''
   pendingFile.value = null
   if (msgInput.value) {
      msgInput.value.style.height = 'auto' // resize textarea back
   }
   scrollToBottom()
}

// Watch drawer state to auto-close sub-views and mark lists when closed
watch(() => chatStore.isDrawerOpen, (isOpen) => {
   if (!isOpen) {
      goBack()
   }
})

// Scroll on new layout updates
watch(activeMessages, () => {
   if (chatStore.isDrawerOpen && activeConversation.value) {
      chatStore.markAsRead(activeConversation.value.id, currentUser.value.id)
      scrollToBottom()
   }
}, { deep: true })

</script>
