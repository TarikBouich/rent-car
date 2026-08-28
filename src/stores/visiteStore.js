import { defineStore } from 'pinia'
import { useUserStore } from './userStore'
import { useAlertStore } from './alertStore'
import { loadStateJson, saveStateJson } from '../services/stateJsonService'

export const useVisiteStore = defineStore('visiteTechnique', {
  state: () => ({
    visites: []
  }),

  getters: {
    getAllVisites: (state) => state.visites,
    getVisiteById: (state) => (id) => state.visites.find(visite => visite.id === id),
    getVisitesByCarId: (state) => (carId) => state.visites.filter(visite => visite.carId === carId),
    filteredVisites: (state) => {
      const userStore = useUserStore()
      return userStore.filterByAgency(state.visites)
    }
  },

  actions: {
    async initializeFromStorage() {
      this.visites = await loadStateJson('visites', [])
    },

    addVisite(visite) {
      const userStore = useUserStore()
      this.visites.push({
        ...visite,
        companyId: userStore.userCompanyId,
        id: visite.id || 'v_tech_' + Date.now()
      })
      saveStateJson('visites', this.visites)
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    updateVisite(updatedVisite) {
      const index = this.visites.findIndex(v => v.id === updatedVisite.id)
      if (index !== -1) {
        this.visites[index] = { ...this.visites[index], ...updatedVisite }
        saveStateJson('visites', this.visites)
        const alertStore = useAlertStore()
        alertStore.checkAlerts()
      }
    },

    deleteVisite(visiteId) {
      this.visites = this.visites.filter(v => v.id !== visiteId)
      saveStateJson('visites', this.visites)
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    }
  }
})
