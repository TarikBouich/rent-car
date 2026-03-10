<template>
  <div class="px-6 py-4 border-b border-gray-200 bg-white text-gray-900">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">
          {{ title }}
        </h2>
        <p class="text-sm mt-1 text-gray-500">
          {{ userStore.currentAgency?.name }} - {{ userStore.currentUser?.role }}
        </p>
      </div>
      <div class="flex items-center gap-4">
        <!-- Alert Icon -->
        <div class="relative">
        <button
            class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-dark-70 dark:text-gray-200"
            @click="toggleNotifications"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
                  class="w-6 h-6"
                >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              <path d="M12 2v1"></path>
                </svg>
            <span
              v-if="unreadCount > 0"
              class="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full"
            >
              {{ unreadCount }}
            </span>
          </button>
          <div
            v-if="showNotifications"
            ref="notificationMenu"
            class="absolute right-0 w-80 mt-2 bg-white dark:bg-dark-90 rounded-lg shadow-lg z-50"
          >
            <div class="p-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold dark:text-gray-200">Notifications</h3>
                <button
                  class="text-sm text-primary-100 hover:text-primary-200"
                  @click="markAllAsRead"
                >
                  Mark all as read
                </button>
              </div>
              <div class="space-y-2 max-h-[400px] overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="flex items-start p-4 border-b border-gray-200 dark:border-gray-700 gap-2.5"
                  :class="{
                    'bg-red-50 dark:bg-red-900/20': notification.priority === 'high',
                    'bg-yellow-50 dark:bg-yellow-900/20': notification.priority === 'medium'
                  }"
                >
                  <div class="flex-1">
                    <p class="text-sm font-medium dark:text-gray-200" v-html="notification.message"></p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ notification.type }}
                    </p>
                  </div>
                </div>
                <div v-if="notifications.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
                  No notifications
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- <button 
          @click="$emit('toggle-mode')"
          class="px-3 py-1 rounded-md text-sm"
          :class="mode === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'"
        >
          {{ mode === 'dark' ? '☀️ Light' : '🌙 Dark' }}
        </button> -->

        <div class="relative">
          <button 
            type="button"
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-2 focus:outline-none"
          >
            <span class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              {{ userInitials }}
            </span>
          </button>
          <!-- User Menu Dropdown -->
          <div 
            v-if="showUserMenu"
            ref="dropdownMenu"
            class="absolute right-0 mt-2 w-48 rounded-md shadow-lg"
            :class="mode === 'dark' ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white'"
          >
            <div class="py-1">
              <div class="px-4 py-2 text-sm" :class="mode === 'dark' ? 'text-gray-300' : 'text-gray-700'">
                {{ userStore.currentUser?.email }}
              </div>
              <div class="px-4 py-2 text-sm" :class="mode === 'dark' ? 'text-gray-300' : 'text-gray-700'">
                {{ userStore.currentAgency?.name }}
              </div>
              <hr :class="mode === 'dark' ? 'border-gray-700' : 'border-gray-200'">
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm"
                :class="mode === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-100'"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/userStore';
import { useAlertStore } from '../stores/alertStore';

export default {
  name: 'TopBar',
  props: {
    mode: {
      type: String,
      default: 'light'
    },
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    const userStore = useUserStore();
    const alertStore = useAlertStore();
    return { userStore, alertStore };
  },
  data() {
    return {
      showNotifications: false,
      showUserMenu: false,
    };
  },
  computed: {
    notifications() {
      return this.alertStore?.filteredAlerts || [];
    },
    unreadCount() {
      return this.alertStore?.totalAlerts || 0;
    },
    userInitials() {
      const email = this.userStore.currentUser?.email;
      if (!email) return 'U';
      return email
        .split('@')[0]
        .split('.')
        .map(part => part && part[0] ? part[0].toUpperCase() : '')
        .join('');
    }
  },
  async mounted() {
    try {
      // Initialize alerts if not already initialized
      if (this.alertStore && (!this.notifications || this.notifications.length === 0)) {
        await this.alertStore.initialize();
      }
      
      // Check for new alerts every hour
      setInterval(() => {
        if (this.alertStore) {
          this.alertStore.checkAlerts();
        }
      }, 3600000);
    } catch (error) {
      console.error('Error initializing alerts:', error);
    }
    
    // Add click outside listener
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    // Remove click outside listener
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      this.showUserMenu = false;
    },
    markAllAsRead() {
      // For now, just close the notifications
      this.showNotifications = false;
    },
    handleLogout() {
      this.userStore.logout();
      this.$router.push('/login');
    },
    handleClickOutside(event) {
      const dropdownMenu = this.$refs.dropdownMenu;
      const notificationMenu = this.$refs.notificationMenu;
      const userButton = event.target.closest('button[type="button"]');
      const notificationButton = event.target.closest('button[class*="hover:bg-gray-100"]');
      
      if (dropdownMenu && !dropdownMenu.contains(event.target) && !userButton?.closest('.relative')) {
        this.showUserMenu = false;
      }
      
      if (notificationMenu && !notificationMenu.contains(event.target) && !notificationButton) {
        this.showNotifications = false;
      }
    }
  }
};
</script>
