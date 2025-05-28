import { defineStore } from 'pinia'

// Define the store
export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    currentAgency: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    userAgencyId: (state) => state.currentUser?.agencyId,
    isAdmin: (state) => state.currentUser?.role === 'admin',
    currentAgencyId: (state) => state.currentAgency?.id,
  },

  actions: {
    async login(email, password) {
      try {
        // In a real app, this would be an API call
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const user = users.find(u => u.email === email && u.password === password)
        
        if (!user) {
          throw new Error('Invalid credentials')
        }

        // Get agency details
        const agencies = JSON.parse(localStorage.getItem('agencies') || '[]')
        const agency = agencies.find(a => a.id === user.agencyId)
        
        if (!user.agencyId || !agency) {
          throw new Error('User not associated with an agency')
        }

        // Set user session
        this.currentUser = {
          id: user.id,
          email: user.email,
          role: user.role,
          agencyId: user.agencyId,
          name: user.name
        }
        this.currentAgency = agency

        // Store in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
        localStorage.setItem('currentAgency', JSON.stringify(this.currentAgency))

        return true
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    logout() {
      this.currentUser = null
      this.currentAgency = null
      localStorage.removeItem('currentUser')
      localStorage.removeItem('currentAgency')
    },

    initializeFromStorage() {
      const storedUser = localStorage.getItem('currentUser')
      const storedAgency = localStorage.getItem('currentAgency')
      
      if (storedUser && storedAgency) {
        this.currentUser = JSON.parse(storedUser)
        this.currentAgency = JSON.parse(storedAgency)
      }
    },

    // Helper method to filter data based on agency
    filterByAgency(items) {
      if (!this.currentUser) return [] // No user means no access
      if (this.isAdmin) return items // Admin sees all items
      return items.filter(item => item.agencyId === this.currentUser.agencyId)
    }
  }
}) 