<template>
  <div class="flex h-screen" :class="mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100'">
    <!-- Sidebar -->
    <aside class="w-64 shadow-lg" :class="mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'">
      <div class="p-4">
        <h1 class="text-2xl font-bold" :class="mode === 'dark' ? 'text-white' : 'text-primary'">Rent Car</h1>
        <div class="mt-2 text-sm" :class="mode === 'dark' ? 'text-gray-300' : 'text-gray-600'">
          {{ userStore.currentAgency?.name || 'Loading...' }}
        </div>
      </div>
      <nav class="mt-4">
        <router-link 
          v-for="item in filteredMenuItems" 
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
      <TopBar 
        :mode="mode"
        :title="currentPageTitle"
        @toggle-mode="$emit('toggle-mode')"
      />
      <main class="p-6" :class="mode === 'dark' ? 'bg-gray-900' : 'bg-gray-100'">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../stores/userStore'
import { useCarStore } from '../stores/carStore'
import TopBar from '../components/TopBar.vue'

export default {
  name: 'DefaultLayout',
  components: {
    TopBar
  },
  props: {
    mode: {
      type: String,
      default: 'light'
    }
  },
  data() {
    const userStore = useUserStore()
    const carStore = useCarStore()
    return {
      showUserMenu: false,
      userStore,
      carStore,
      allMenuItems: [
        { name: 'Dashboard', path: '/dashboard', icon: '📊', requiresAdmin: true },
        { name: 'Calendar', path: '/car-events', icon: '📅', requiresAdmin: false },
        { name: 'Cars', path: '/cars', icon: '🚗', requiresAdmin: false },
        { name: 'Reservations', path: '/reservations', icon: '📝', requiresAdmin: false },
        { name: 'Clients', path: '/clients', icon: '👥', requiresAdmin: false },
        { name: 'Archived Reservations', path: '/archived-reservations', icon: '📁', requiresAdmin: false },
        { name: 'Archived Clients', path: '/archived-clients', icon: '🗄️', requiresAdmin: false },
        { name: 'Agents', path: '/agents', icon: '👤', requiresAdmin: true },
        { name: 'Agencies', path: '/agencies', icon: '🏢', requiresAdmin: true }
      ]
    }
  },
  computed: {
    totalAlerts() {
      const cars = this.carStore.filteredCars
      let count = 0

      cars.forEach(car => {
        // Check insurance expiration
        if (car.assuranceEndDate) {
          const insuranceDate = new Date(car.assuranceEndDate)
          const today = new Date()
          const daysUntilExpiration = Math.ceil((insuranceDate - today) / (1000 * 60 * 60 * 24))
          if (daysUntilExpiration <= 30) count++
        }

        // Check technical inspection expiration
        if (car.visiteTechniqueEndDate) {
          const inspectionDate = new Date(car.visiteTechniqueEndDate)
          const today = new Date()
          const daysUntilExpiration = Math.ceil((inspectionDate - today) / (1000 * 60 * 60 * 24))
          if (daysUntilExpiration <= 30) count++
        }
      })

      // Check active reservations
      const reservations = this.carStore.filteredReservations
      reservations.forEach(reservation => {
        if (reservation.status === 'Active') {
          const returnDate = new Date(reservation.returnDate)
          const today = new Date()
          const daysUntilReturn = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24))
          if (daysUntilReturn <= 3) count++
        }
      })

      return count
    },
    filteredMenuItems() {
      return this.allMenuItems.filter(item => 
        !item.requiresAdmin || this.userStore.isAdmin
      )
    },
    userInitials() {
      const email = this.userStore.currentUser?.email;
      if (!email) return 'U';  // Return a default value if email is not available
      return email
        .split('@')[0]
        .split('.')
        .map(part => part && part[0] ? part[0].toUpperCase() : '')
        .join('');
    },
    currentPageTitle() {
      const currentRoute = this.$route.name
      return currentRoute ? currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1) : 'Dashboard'
    }
  },
  methods: {
    handleLogout() {
      this.userStore.logout()
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