<template>
  <div class="shadow-xl rounded-lg p-8 w-full mx-4" :class="mode === 'dark' ? 'bg-gray-800' : 'bg-white'">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold" :class="mode === 'dark' ? 'text-white' : 'text-gray-900'">Welcome Back</h2>
      <p class="mt-2" :class="mode === 'dark' ? 'text-gray-300' : 'text-gray-600'">Sign in to your account</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label class="block text-sm font-medium" :class="mode === 'dark' ? 'text-gray-300' : 'text-gray-700'">
          Email
        </label>
        <input
          type="email"
          v-model="email"
          required
          class="mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          :class="mode === 'dark' 
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
            : 'border-gray-300 text-gray-900'"
        />
      </div>

      <div>
        <label class="block text-sm font-medium" :class="mode === 'dark' ? 'text-gray-300' : 'text-gray-700'">
          Password
        </label>
        <input
          type="password"
          v-model="password"
          required
          class="mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          :class="mode === 'dark' 
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
            : 'border-gray-300 text-gray-900'"
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
export default {
  name: 'LoginView',
  props: {
    mode: String
  },
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        // For demo purposes - replace with your actual authentication logic
        if (this.email === 'admin@location.com' && this.password === 'password') {
          localStorage.setItem('currentUser', JSON.stringify({
            email: this.email,
            role: 'admin'
          }));
          this.$router.push('/dashboard');
        } else {
          this.error = 'Invalid email or password';
        }
      } catch (error) {
        this.error = 'An error occurred during login';
        console.error('Login error:', error);
      }
    }
  },
  created() {
    // If user is already logged in, redirect to dashboard
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.$router.push('/dashboard');
    }
  }
}
</script> 