<template>
  <div class="flex min-h-screen bg-[#F3F4F6] dark:bg-[#151923]">
    <!-- Mobile Overlay -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="isMobileMenuOpen = false" 
      class="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
    ></div>

    <!-- Sidebar -->
    <NewSidebar :isOpen="isMobileMenuOpen" @close="isMobileMenuOpen = false" />

    <!-- Main Content -->
    <div class="flex-1 transition-all duration-300 md:ml-[260px] min-w-0 flex flex-col">
      <!-- Header -->
      <header class="h-16 bg-white dark:bg-[#1E2330] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
        <!-- Search & Hamburger Menu -->
        <div class="flex items-center gap-3 flex-1 min-w-0 max-w-md">
          <!-- Mobile Hamburger -->
          <button 
            @click="isMobileMenuOpen = true"
            class="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div class="relative w-full">
            <input
              type="text"
              placeholder="Rechercher..."
              class="w-full pl-10 pr-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-4">
          <!-- Theme Toggle -->
          <button @click="$emit('toggle-mode')" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-200" title="Toggle Theme">
            <svg v-if="mode === 'dark'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>

          <!-- Internal Messenger (Chat) -->
          <button @click="chatStore.toggleDrawer()" class="relative p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-200" title="Messagerie Interne">
             <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
             </svg>
             <span v-if="unreadChatCount > 0" class="absolute top-0 right-0 w-4 h-4 bg-[#fa5b0f] text-white flex items-center justify-center text-[10px] font-bold rounded-full border-2 border-white dark:border-[#1E2330]">
                {{ unreadChatCount }}
             </span>
          </button>

          <!-- Notifications -->
          <button class="relative p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-gray-200 transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span class="absolute top-1 right-1 w-2 h-2 bg-[#fa5b0f] rounded-full"></span>
          </button>

          <!-- User Profile -->
          <div class="relative">
            <button @click="showDropdown = !showDropdown" class="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800 focus:outline-none">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ userName }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ userRole }}</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-[#fa5b0f] flex items-center justify-center text-white font-medium shadow-sm">
                {{ userInitial }}
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showDropdown }" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div v-if="showDropdown" class="absolute right-0 mt-3 w-48 bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden z-50">
              <button @click="handleLogout" class="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot></slot>
      </main>
    </div>

    <!-- Inject Global Chat Drawer here so it spans over everything -->
    <ChatDrawer />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useChatStore } from '../stores/chatStore'
import NewSidebar from '../components/NewSidebar.vue'
import ChatDrawer from '../components/ChatDrawer.vue'

export default {
  name: 'NewDefaultLayout',
  components: {
    NewSidebar,
    ChatDrawer
  },
  props: {
    mode: {
      type: String,
      default: 'light'
    }
  },
  emits: ['toggle-mode'],
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const chatStore = useChatStore()
    
    // Initialize user store if not done
    userStore.initializeFromStorage()

    const showDropdown = ref(false)
    const isMobileMenuOpen = ref(false)
    const userName = computed(() => userStore.currentUser?.name || '')
    const userRole = computed(() => userStore.currentUser?.role === 'admin' ? 'Administrateur' : 'Agent')
    const userInitial = computed(() => userName.value?.charAt(0).toUpperCase() || 'T')
    
    const unreadChatCount = computed(() => chatStore.getUnreadCount(userStore.currentUser?.id))

    const handleLogout = () => {
      showDropdown.value = false
      if (userStore.logout) {
        userStore.logout()
      }
      router.push('/login')
    }

    return {
      showDropdown,
      isMobileMenuOpen,
      userName,
      userRole,
      userInitial,
      handleLogout,
      chatStore,
      unreadChatCount
    }
  }
}
</script>
