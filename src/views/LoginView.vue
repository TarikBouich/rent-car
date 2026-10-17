<template>
  <div class="shadow-xl rounded-2xl p-8 w-full mx-4" :class="mode === 'dark' ? 'bg-[#1e2330]' : 'bg-white'">
    <div class="text-center mb-8">
      <div class="mx-auto w-14 h-14 rounded-2xl bg-[#fa5b0f] flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.8a1 1 0 0 0-.8.4L2.3 11l-5.16.86A1 1 0 0 0 .84 12.99V16h3" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold" :class="mode === 'dark' ? 'text-white' : 'text-gray-900'">Welcome Back</h2>
      <p class="mt-1 text-sm" :class="mode === 'dark' ? 'text-gray-400' : 'text-gray-500'">Sign in to your account</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <div>
        <label class="block text-sm font-medium mb-1.5" :class="mode === 'dark' ? 'text-gray-300' : 'text-gray-700'">
          Email
        </label>
        <input
          type="email"
          v-model="email"
          required
          placeholder="you@example.com"
          class="block w-full px-4 py-2.5 rounded-xl text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]/40 focus:border-[#fa5b0f]"
          :class="mode === 'dark'
            ? 'bg-[#151923] border border-[#2a2f3e] text-white placeholder-gray-500 hover:border-[#3a3f4e]'
            : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 hover:border-gray-300'"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5" :class="mode === 'dark' ? 'text-gray-300' : 'text-gray-700'">
          Password
        </label>
        <input
          type="password"
          v-model="password"
          required
          placeholder="••••••••"
          class="block w-full px-4 py-2.5 rounded-xl text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]/40 focus:border-[#fa5b0f]"
          :class="mode === 'dark'
            ? 'bg-[#151923] border border-[#2a2f3e] text-white placeholder-gray-500 hover:border-[#3a3f4e]'
            : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 hover:border-gray-300'"
        />
      </div>

      <div v-if="error" class="text-red-500 text-sm flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ error }}
      </div>

      <button
        type="submit"
        class="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#fa5b0f] hover:bg-[#e5500a] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]/40 focus:ring-offset-2"
        :class="mode === 'dark' ? 'focus:ring-offset-[#1e2330]' : 'focus:ring-offset-white'"
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
        } else if (this.userStore.isAdmin) {
          this.$router.push('/dashboard')
        } else {
          // Non-admin users should land on cars directly to avoid dashboard permission bounce.
          this.$router.push('/cars')
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
