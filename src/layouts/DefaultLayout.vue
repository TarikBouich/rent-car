<template>
  <div class="flex h-screen" :class="mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100'">
    <!-- Sidebar -->
    <aside class="w-64 shadow-lg" :class="mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'">
      <div class="p-4">
        <h1 class="text-2xl font-bold" :class="mode === 'dark' ? 'text-white' : 'text-primary'">Rent Car</h1>
      </div>
      <nav class="mt-4">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center px-4 py-2"
          :class="[
            $route.path === item.path 
              ? 'bg-primary text-white' 
              : mode === 'dark' 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <span class="w-5 h-5 mr-2">{{ item.icon }}</span>
          {{ item.name }}
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <div class="p-4 border-b" :class="mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold" :class="mode === 'dark' ? 'text-white' : 'text-gray-900'">
            {{ currentPageTitle }}
          </h2>
          <div class="flex items-center gap-4">
            <button 
              @click="$emit('toggle-mode')"
              class="px-3 py-1 rounded-md text-sm"
              :class="mode === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'"
            >
              {{ mode === 'dark' ? '☀️ Light' : '🌙 Dark' }}
            </button>
            <div class="relative">
              <button 
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
                class="absolute right-0 mt-2 w-48 rounded-md shadow-lg"
                :class="mode === 'dark' ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white'"
              >
                <div class="py-1">
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
      <main class="p-6" :class="mode === 'dark' ? 'bg-gray-900' : 'bg-gray-100'">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  props: {
    mode: {
      type: String,
      default: 'light'
    }
  },
  data() {
    return {
      showUserMenu: false,
      menuItems: [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Calendar', path: '/car-events', icon: '📅' },
        { name: 'Cars', path: '/cars', icon: '🚗' },
        { name: 'Reservations', path: '/reservations', icon: '📝' },
        { name: 'Clients', path: '/clients', icon: '👥' },
        { name: 'Archived Reservations', path: '/archived-reservations', icon: '📁' },
        { name: 'Archived Clients', path: '/archived-clients', icon: '🗄️' }
      ]
    }
  },
  computed: {
    currentUser() {
      const user = localStorage.getItem('currentUser')
      return user ? JSON.parse(user) : null
    },
    userInitials() {
      if (!this.currentUser?.email) return 'U'
      return this.currentUser.email
        .split('@')[0]
        .split('.')
        .map(part => part[0].toUpperCase())
        .join('')
    },
    currentPageTitle() {
      const currentRoute = this.$route.name
      return currentRoute ? currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1) : 'Dashboard'
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('currentUser')
      this.$router.push('/login')
    }
  },
  mounted() {
    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.relative')) {
        this.showUserMenu = false
      }
    })
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script> 