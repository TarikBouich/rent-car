<template>
  <component 
    :is="layout" 
    :mode="mode"
    @toggle-mode="toggleMode"
  >
    <router-view :mode="mode"></router-view>
  </component>
</template>

<script>
import DefaultLayout from './layouts/DefaultLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import { initializeDefaultData } from './utils/initDefaultData'
import { useUserStore } from './stores/userStore'
import { useCarStore } from './stores/carStore'
import { useClientStore } from './stores/clientStore'
import { useAlertStore } from './stores/alertStore'

export default {
  name: 'App',
  components: {
    DefaultLayout,
    AuthLayout
  },
  setup() {
    const userStore = useUserStore()
    const carStore = useCarStore()
    const clientStore = useClientStore()
    const alertStore = useAlertStore()

    return {
      userStore,
      carStore,
      clientStore,
      alertStore
    }
  },
  data() {
    return {
      mode: localStorage.getItem('mode') || 'light'
    }
  },
  computed: {
    layout() {
      // Get the layout from the route meta, default to DefaultLayout if not specified
      const layout = this.$route.meta.layout || 'default'
      return layout === 'auth' ? AuthLayout : DefaultLayout
    }
  },
  methods: {
    toggleMode() {
      this.mode = this.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem('mode', this.mode)
    },
    async initializeStores() {
      try {
        // Initialize user store first
        await this.userStore.initializeFromStorage();

        // Only initialize other stores if user is authenticated
        if (this.userStore.isAuthenticated) {
          await this.carStore.initializeFromStorage();
          await this.clientStore.initializeFromStorage();
          await this.alertStore.initialize();
          console.log('All stores initialized successfully');
        }
      } catch (error) {
        console.error('Error initializing stores:', error);
      }
    }
  },
  created() {
    // Initialize default data
    initializeDefaultData()
    
    // Initialize stores
    this.initializeStores()
    
    // Check if user is authenticated and not on login page
    if (!this.userStore.isAuthenticated && this.$route.name !== 'login') {
      this.$router.push('/login')
    }
  }
}
</script>

<style>
@import './assets/main.css';

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.text-primary {
  color: #3B82F6;
}

.bg-primary {
  background-color: #3B82F6;
}

.bg-primary-dark {
  background-color: #2563EB;
}

.focus\:ring-primary:focus {
  --tw-ring-color: #3B82F6;
}

.focus\:border-primary:focus {
  border-color: #3B82F6;
}

.dark .dark\:bg-dark-200 {
  background-color: #1A1A1A;
}

.dark .dark\:bg-dark-100 {
  background-color: #2A2A2A;
}

.dark .dark\:bg-dark-50 {
  background-color: #3A3A3A;
}

.dark .dark\:text-white {
  color: #FFFFFF;
}

.dark .dark\:text-gray-400 {
  color: #9CA3AF;
}

.dark .dark\:text-gray-300 {
  color: #D1D5DB;
}

.dark .dark\:border-dark-50 {
  border-color: #3A3A3A;
}
</style>
