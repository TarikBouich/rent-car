import { defineStore } from 'pinia'
import { generateNextId } from '../utils/idGenerator'
import { useUserStore } from './userStore'
import { useAlertStore } from './alertStore'

export const useChargeStore = defineStore('charge', {
  state: () => ({
    charges: JSON.parse(localStorage.getItem('charges') || '[]')
  }),

  getters: {
    getAllCharges: (state) => state.charges,
    getChargeById: (state) => (id) => state.charges.find(charge => charge.id === id),
    getChargesByAgencyId: (state) => (agencyId) => state.charges.filter(charge => charge.agencyId === agencyId),

    // Get charges filtered by agency (for agents to only see their agency's charges)
    filteredCharges: (state) => {
      const userStore = useUserStore()
      return userStore.filterByAgency(state.charges)
    }
  },

  actions: {
    // Initialize data from localStorage
    initializeFromStorage() {
      this.charges = JSON.parse(localStorage.getItem('charges') || '[]')
    },

    // Add a new charge
    addCharge(charge) {
      const userStore = useUserStore()
      charge.companyId = userStore.userCompanyId
      
      // Auto-generate ID if not provided
      if (!charge.id) {
        charge.id = 'charge_' + Date.now()
      }
      this.charges.push(charge)
      this.saveCharges()
      
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    // Update a charge
    updateCharge(updatedCharge) {
      const index = this.charges.findIndex(c => c.id === updatedCharge.id)
      if (index !== -1) {
        this.charges[index] = { ...this.charges[index], ...updatedCharge }
        this.saveCharges()
        
        const alertStore = useAlertStore()
        alertStore.checkAlerts()
      }
    },

    // Delete a charge
    deleteCharge(chargeId) {
      this.charges = this.charges.filter(c => c.id !== chargeId)
      this.saveCharges()
      
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    // Save to localStorage
    saveCharges() {
      localStorage.setItem('charges', JSON.stringify(this.charges))
    }
  }
})
