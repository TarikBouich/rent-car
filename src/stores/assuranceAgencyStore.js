import { defineStore } from 'pinia'

export const useAssuranceAgencyStore = defineStore('assuranceAgency', {
  state: () => ({
    agencies: JSON.parse(localStorage.getItem('assuranceAgencies') || '[]')
  }),

  getters: {
    getAllAgencies: (state) => state.agencies,
    getAgencyById: (state) => (id) => state.agencies.find(a => a.id === id),
  },

  actions: {
    initializeFromStorage() {
      this.agencies = JSON.parse(localStorage.getItem('assuranceAgencies') || '[]')
    },

    addAgency(agency) {
      if (!agency.id) {
        agency.id = 'assur_agc_' + Date.now()
      }
      this.agencies.push(agency)
      this.saveAgencies()
      return agency // Return it so it can be assigned conditionally after creation
    },

    updateAgency(updatedAgency) {
      const index = this.agencies.findIndex(a => a.id === updatedAgency.id)
      if (index !== -1) {
        this.agencies[index] = { ...this.agencies[index], ...updatedAgency }
        this.saveAgencies()
      }
    },

    deleteAgency(agencyId) {
      this.agencies = this.agencies.filter(a => a.id !== agencyId)
      this.saveAgencies()
    },

    saveAgencies() {
      localStorage.setItem('assuranceAgencies', JSON.stringify(this.agencies))
    }
  }
})
