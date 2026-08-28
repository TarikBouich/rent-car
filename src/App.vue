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
import LandingLayout from './layouts/LandingLayout.vue'
import { useUserStore } from './stores/userStore'
import { useCarStore } from './stores/carStore'
import { useClientStore } from './stores/clientStore'
import { useAlertStore } from './stores/alertStore'
import { useChargeStore } from './stores/chargeStore'
import { useAgencyStore } from './stores/agencyStore'
import { useCompanyStore } from './stores/companyStore'
import { useUserStore as useUsersStoreForList } from './stores/userStore'
import { useAssuranceStore } from './stores/assuranceStore'
import { useAssuranceAgencyStore } from './stores/assuranceAgencyStore'
import { useCentreVisiteStore } from './stores/centreVisiteStore'
import { useEntretienTypeStore } from './stores/entretienTypeStore'
import { useEntretienStore } from './stores/entretienStore'
import { useTransactionStore } from './stores/transactionStore'
import { useVisiteStore } from './stores/visiteStore'
import { useContratStore } from './stores/contratStore'
import { useChatStore } from './stores/chatStore'
import { useSettingsStore } from './stores/settingsStore'

export default {
  name: 'App',
  components: {
    AuthLayout,
    NewDefaultLayout,
    PrintLayout,
    LandingLayout
  },
  setup() {
    const userStore = useUserStore()
    const carStore = useCarStore()
    const clientStore = useClientStore()
    const alertStore = useAlertStore()
    const chargeStore = useChargeStore()
    const agencyStore = useAgencyStore()
    const companyStore = useCompanyStore()
    const usersStoreForList = useUsersStoreForList()
    const assuranceStore = useAssuranceStore()
    const assuranceAgencyStore = useAssuranceAgencyStore()
    const centreVisiteStore = useCentreVisiteStore()
    const entretienTypeStore = useEntretienTypeStore()
    const entretienStore = useEntretienStore()
    const transactionStore = useTransactionStore()
    const visiteStore = useVisiteStore()
    const contratStore = useContratStore()
    const chatStore = useChatStore()
    const settingsStore = useSettingsStore()

    return {
      userStore,
      carStore,
      clientStore,
      alertStore,
      chargeStore,
      agencyStore,
      companyStore,
      usersStoreForList,
      assuranceStore,
      assuranceAgencyStore,
      centreVisiteStore,
      entretienTypeStore,
      entretienStore,
      transactionStore,
      visiteStore,
      contratStore,
      chatStore,
      settingsStore
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
      if (layout === 'landing') return LandingLayout
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
    purgeStaleLocalStorage() {
      // Keys to KEEP (auth + UI preferences)
      const KEEP_KEYS = new Set(['token', 'currentUser', 'companyId', 'mode', 'currentAgency'])
      const DATA_PURGE_VERSION = 'db_purge_v2'

      if (!localStorage.getItem(DATA_PURGE_VERSION)) {
        const allKeys = Object.keys(localStorage)
        allKeys.forEach(key => {
          if (!KEEP_KEYS.has(key)) {
            localStorage.removeItem(key)
          }
        })
        localStorage.setItem(DATA_PURGE_VERSION, 'true')
        console.log('[App] Stale localStorage data purged. Now using MySQL backend.')
      }
    },
    async initializeStores() {
      try {
        // Initialize user store first
        await this.userStore.initializeFromStorage();

        // Only initialize other stores if user is authenticated
        if (this.userStore.isAuthenticated) {
          // Superadmin should load only SaaS supervision data to avoid heavy/unneeded calls.
          if (this.userStore.isSuperAdmin) {
            await this.companyStore.fetchCompanies()
            return
          }

          await this.agencyStore.initializeFromStorage()
          await this.companyStore.fetchCompanies()
          await this.usersStoreForList.fetchUsers()

          await this.carStore.initializeFromStorage();
          await this.clientStore.initializeFromStorage();
          await this.chargeStore.initializeFromStorage();
          await this.assuranceStore.initializeFromStorage();
          await this.assuranceAgencyStore.initializeFromStorage();
          await this.centreVisiteStore.initializeFromStorage();
          await this.entretienTypeStore.initializeFromStorage();
          await this.entretienStore.initializeFromStorage();
          await this.transactionStore.initializeFromStorage();
          await this.visiteStore.initializeFromStorage();
          await this.contratStore.initializeFromStorage();
          await this.chatStore.initializeFromStorage();
          await this.settingsStore.initializeFromStorage();

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
    
    // Purge all stale localStorage data, keep only auth & UI preferences
    this.purgeStaleLocalStorage()
    
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
