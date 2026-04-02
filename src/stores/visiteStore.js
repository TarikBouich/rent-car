import { defineStore } from 'pinia'
import { useUserStore } from './userStore'
import { useAlertStore } from './alertStore'

export const useVisiteStore = defineStore('visiteTechnique', {
  state: () => ({
    visites: JSON.parse(localStorage.getItem('visitesTechniques') || '[]')
  }),

  getters: {
    getAllVisites: (state) => state.visites,
    getVisiteById: (state) => (id) => state.visites.find(visite => visite.id === id),
    getVisitesByCarId: (state) => (carId) => state.visites.filter(visite => visite.carId === carId),

    // Get visites filtered by agency (for agents to only see their agency's vehicles' visits)
    filteredVisites: (state) => {
      const userStore = useUserStore()
      return userStore.filterByAgency(state.visites)
    }
  },

  actions: {
    // Initialize data from localStorage
    initializeFromStorage() {
      this.visites = JSON.parse(localStorage.getItem('visitesTechniques') || '[]')
    },

    // Add a new visite
    addVisite(visite) {
      const userStore = useUserStore()
      this.visites.push({
        ...visite,
        companyId: userStore.userCompanyId,
        id: visite.id || 'v_tech_' + Date.now()
      })
      this.saveVisites()
      
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    // Update a visite
    updateVisite(updatedVisite) {
      const index = this.visites.findIndex(v => v.id === updatedVisite.id)
      if (index !== -1) {
        this.visites[index] = { ...this.visites[index], ...updatedVisite }
        this.saveVisites()
        
        const alertStore = useAlertStore()
        alertStore.checkAlerts()
      }
    },

    // Delete a visite
    deleteVisite(visiteId) {
      this.visites = this.visites.filter(v => v.id !== visiteId)
      this.saveVisites()
      
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    // Save to localStorage
    saveVisites() {
      localStorage.setItem('visitesTechniques', JSON.stringify(this.visites))
    }
  }
})
