import { defineStore } from 'pinia'
import { useUserStore } from './userStore'
import { loadStateJson, saveStateJson } from '../services/stateJsonService'

export const useCentreVisiteStore = defineStore('centreVisite', {
  state: () => ({
    centres: []
  }),

  getters: {
    getAllCentres: (state) => state.centres,
    getCentreById: (state) => (id) => state.centres.find(c => c.id === id),
  },

  actions: {
    async initializeFromStorage() {
      this.centres = await loadStateJson('centresVisite', [])
    },

    addCentre(centre) {
      if(!this.centres.length) this.initializeFromStorage()
      const userStore = useUserStore()
        
      const newCentre = {
        id: `ctv_${Date.now()}`,
        companyId: userStore.userCompanyId,
        ...centre
      }
      this.centres.push(newCentre)
      this.saveCentres()
      return newCentre
    },

    updateCentre(updated) {
      const index = this.centres.findIndex(c => c.id === updated.id)
      if (index !== -1) {
        this.centres[index] = { ...this.centres[index], ...updated }
        this.saveCentres()
      }
    },

    deleteCentre(id) {
      this.centres = this.centres.filter(c => c.id !== id)
      this.saveCentres()
    },

    saveCentres() {
      saveStateJson('centresVisite', this.centres)
    }
  }
})
