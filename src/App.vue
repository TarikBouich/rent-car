<template>
  <component 
    :is="layoutComponent" 
    :mode="mode"
    @toggle-mode="toggleMode"
  >
    <router-view :mode="mode"></router-view>
  </component>
</template>

<script>
import AuthLayout from './layouts/AuthLayout.vue'
import NewDefaultLayout from './layouts/NewDefaultLayout.vue'
import PrintLayout from './layouts/PrintLayout.vue'
import { initializeDefaultData } from './utils/initDefaultData'
import { useUserStore } from './stores/userStore'
import { useCarStore } from './stores/carStore'
import { useClientStore } from './stores/clientStore'
import { useAlertStore } from './stores/alertStore'
import { useChargeStore } from './stores/chargeStore'

export default {
  name: 'App',
  components: {
    AuthLayout,
    NewDefaultLayout,
    PrintLayout
  },
  setup() {
    const userStore = useUserStore()
    const carStore = useCarStore()
    const clientStore = useClientStore()
    const alertStore = useAlertStore()
    const chargeStore = useChargeStore()

    return {
      userStore,
      carStore,
      clientStore,
      alertStore,
      chargeStore
    }
  },
  data() {
    return {
      mode: localStorage.getItem('mode') || 'light'
    }
  },
  computed: {
    layoutComponent() {
      // Get the layout from the route meta
      const layout = this.$route.meta.layout || 'new-default'
      if (layout === 'auth') return AuthLayout
      if (layout === 'print') return PrintLayout
      return NewDefaultLayout
    }
  },
  methods: {
    toggleMode() {
      this.mode = this.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem('mode', this.mode)
      this.applyTheme()
    },
    applyTheme() {
      if (this.mode === 'dark') {
        document.documentElement.classList.add('dark', 'is-dark')
      } else {
        document.documentElement.classList.remove('dark', 'is-dark')
      }
    },
    async initializeStores() {
      try {
        // Initialize user store first
        await this.userStore.initializeFromStorage();

        // Only initialize other stores if user is authenticated
        if (this.userStore.isAuthenticated) {
          await this.carStore.initializeFromStorage();
          await this.clientStore.initializeFromStorage();
          this.chargeStore.initializeFromStorage();
          await this.alertStore.initialize();
          console.log('All stores initialized successfully');
        }
      } catch (error) {
        console.error('Error initializing stores:', error);
      }
    }
  },
  created() {
    // Apply current theme first
    this.applyTheme()
    
    // Initialize default data
    initializeDefaultData()
    
    // Initialize stores
    this.initializeStores()
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
