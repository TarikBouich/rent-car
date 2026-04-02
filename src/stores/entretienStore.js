import { defineStore } from 'pinia'
import { generateNextId } from '../utils/idGenerator'
import { useUserStore } from './userStore'
import { useAlertStore } from './alertStore'

export const useEntretienStore = defineStore('entretien', {
  state: () => ({
    entretiens: JSON.parse(localStorage.getItem('entretiens') || '[]')
  }),

  getters: {
    getAllEntretiens: (state) => state.entretiens,
    getEntretienById: (state) => (id) => state.entretiens.find(e => e.id === id),
    getEntretiensByCarId: (state) => (carId) => state.entretiens.filter(e => e.carId === carId),

    // Get entretiens filtered by agency
    filteredEntretiens: (state) => {
      const userStore = useUserStore()
      return userStore.filterByAgency(state.entretiens)
    }
  },

  actions: {
    initializeFromStorage() {
      this.entretiens = JSON.parse(localStorage.getItem('entretiens') || '[]')
    },

    addEntretien(entretien) {
      if(!this.entretiens.length) this.initializeFromStorage()
      const userStore = useUserStore()
        
      const newEntretien = {
        id: `ent_${Date.now()}`,
        companyId: userStore.userCompanyId,
        ...entretien
      }
      this.entretiens.push(newEntretien)
      this.saveEntretiens()
      
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    updateEntretien(updatedEntretien) {
      const index = this.entretiens.findIndex(e => e.id === updatedEntretien.id)
      if (index !== -1) {
        this.entretiens[index] = { ...this.entretiens[index], ...updatedEntretien }
        this.saveEntretiens()
        
        const alertStore = useAlertStore()
        alertStore.checkAlerts()
      }
    },

    deleteEntretien(entretienId) {
      this.entretiens = this.entretiens.filter(e => e.id !== entretienId)
      this.saveEntretiens()
      
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    saveEntretiens() {
      localStorage.setItem('entretiens', JSON.stringify(this.entretiens))
    }
  }
})
