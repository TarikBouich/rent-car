import { defineStore } from 'pinia'
import { useUserStore } from './userStore'
import { useAlertStore } from './alertStore'
import { loadStateJson, saveStateJson } from '../services/stateJsonService'

export const useEntretienStore = defineStore('entretien', {
  state: () => ({
    entretiens: []
  }),

  getters: {
    getAllEntretiens: (state) => state.entretiens,
    getEntretienById: (state) => (id) => state.entretiens.find(e => e.id === id),
    getEntretiensByCarId: (state) => (carId) => state.entretiens.filter(e => e.carId === carId),
    filteredEntretiens: (state) => {
      const userStore = useUserStore()
      return userStore.filterByAgency(state.entretiens)
    }
  },

  actions: {
    async initializeFromStorage() {
      this.entretiens = await loadStateJson('entretiens', [])
    },

    addEntretien(entretien) {
      const userStore = useUserStore()
      const newEntretien = {
        id: `ent_${Date.now()}`,
        companyId: userStore.userCompanyId,
        ...entretien
      }
      this.entretiens.push(newEntretien)
      saveStateJson('entretiens', this.entretiens)
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    updateEntretien(updatedEntretien) {
      const index = this.entretiens.findIndex(e => e.id === updatedEntretien.id)
      if (index !== -1) {
        this.entretiens[index] = { ...this.entretiens[index], ...updatedEntretien }
        saveStateJson('entretiens', this.entretiens)
        const alertStore = useAlertStore()
        alertStore.checkAlerts()
      }
    },

    deleteEntretien(entretienId) {
      this.entretiens = this.entretiens.filter(e => e.id !== entretienId)
      saveStateJson('entretiens', this.entretiens)
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    }
  }
})
