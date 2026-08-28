import { defineStore } from 'pinia'
import { loadStateJson, saveStateJson } from '../services/stateJsonService'

export const useAssuranceAgencyStore = defineStore('assuranceAgency', {
  state: () => ({
    agencies: []
  }),

  getters: {
    getAllAgencies: (state) => state.agencies,
    getAgencyById: (state) => (id) => state.agencies.find(a => a.id === id),
  },

  actions: {
    async initializeFromStorage() {
      this.agencies = await loadStateJson('assuranceAgencies', [])
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
      saveStateJson('assuranceAgencies', this.agencies)
    }
  }
})
