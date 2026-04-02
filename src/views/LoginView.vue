<template>
  <div class="shadow-xl rounded-lg p-8 w-full mx-4" :class="mode === 'dark' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white'">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold" :class="mode === 'dark' ? 'text-white' : 'text-gray-900'">Welcome Back</h2>
      <p class="mt-2" :class="mode === 'dark' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600'">Sign in to your account</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label class="block text-sm font-medium" :class="mode === 'dark' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700'">
          Email
        </label>
        <input
          type="email"
          v-model="email"
          required
          class="mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          :class="mode === 'dark' ? 'bg-gray-200 dark:bg-gray-700 border-gray-600 text-gray-900 dark:text-white placeholder-gray-400' : 'border-gray-300 text-gray-900'"
        />
      </div>

      <div>
        <label class="block text-sm font-medium" :class="mode === 'dark' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700'">
          Password
        </label>
        <input
          type="password"
          v-model="password"
          required
          class="mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          :class="mode === 'dark' ? 'bg-gray-200 dark:bg-gray-700 border-gray-600 text-gray-900 dark:text-white placeholder-gray-400' : 'border-gray-300 text-gray-900'"
        />
      </div>

      <div v-if="error" class="text-red-600 text-sm">
        {{ error }}
      </div>

      <button
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        :class="mode === 'dark' ? 'focus:ring-offset-gray-800' : ''"
      >
        Sign in
      </button>
    </form>
  </div>
</template>

<script>
import { useUserStore } from '../stores/userStore'

export default {
  name: 'LoginView',
  props: {
    mode: String
  },
  data() {
    return {
      email: '',
      password: '',
      error: '',
      userStore: useUserStore()
    }
  },
  methods: {
    async handleLogin() {
      try {
        await this.userStore.login(this.email, this.password)
        if (this.userStore.isSuperAdmin) {
          this.$router.push('/super-admin')
        } else {
          this.$router.push('/dashboard')
        }
      } catch (error) {
        this.error = error.message || 'Invalid email or password'
        console.error('Login error:', error)
      }
    }
  },
  created() {
    // If user is already logged in, redirect to dashboard or super-admin
    if (this.userStore.isAuthenticated) {
      if (this.userStore.isSuperAdmin) {
        this.$router.push('/super-admin')
      } else {
        this.$router.push('/dashboard')
      }
    }
  }
}
</script> 