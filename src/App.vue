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

export default {
  name: 'App',
  components: {
    DefaultLayout,
    AuthLayout
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
    }
  },
  created() {
    // Check authentication on app start
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser && this.$route.path !== '/login') {
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
