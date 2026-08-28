import { defineStore } from 'pinia'
import { generateNextId } from '../utils/idGenerator'
import { useUserStore } from './userStore'
import { useAlertStore } from './alertStore'
import { loadStateJson, saveStateJson } from '../services/stateJsonService'

export const useChargeStore = defineStore('charge', {
  state: () => ({
    charges: []
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
    async initializeFromStorage() {
      this.charges = await loadStateJson('charges', [])
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
      saveStateJson('charges', this.charges)

      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    // Update a charge
    updateCharge(updatedCharge) {
      const index = this.charges.findIndex(c => c.id === updatedCharge.id)
      if (index !== -1) {
        this.charges[index] = { ...this.charges[index], ...updatedCharge }
        saveStateJson('charges', this.charges)

        const alertStore = useAlertStore()
        alertStore.checkAlerts()
      }
    },

    // Delete a charge
    deleteCharge(chargeId) {
      this.charges = this.charges.filter(c => c.id !== chargeId)
      saveStateJson('charges', this.charges)

      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    }
  }
})
