import { defineStore } from 'pinia'
import { generateNextId } from '../utils/idGenerator'
import { useUserStore } from './userStore'
import { useAlertStore } from './alertStore'

export const useAssuranceStore = defineStore('assurance', {
  state: () => ({
    assurances: JSON.parse(localStorage.getItem('assurances') || '[]')
  }),

  getters: {
    getAllAssurances: (state) => state.assurances,
    getAssuranceById: (state) => (id) => state.assurances.find(assur => assur.id === id),
    getAssurancesByCarId: (state) => (carId) => state.assurances.filter(assur => assur.carId === carId),

    // Get assurances filtered by agency
    filteredAssurances: (state) => {
      const userStore = useUserStore()
      return userStore.filterByAgency(state.assurances)
    }
  },

  actions: {
    initializeFromStorage() {
      this.assurances = JSON.parse(localStorage.getItem('assurances') || '[]')
    },

    addAssurance(assurance) {
      const userStore = useUserStore()
      this.assurances.push({
        ...assurance,
        companyId: userStore.userCompanyId,
        id: `ass_${Date.now()}`
      })
      this.saveAssurances()
      
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    updateAssurance(updatedAssurance) {
      const index = this.assurances.findIndex(a => a.id === updatedAssurance.id)
      if (index !== -1) {
        this.assurances[index] = { ...this.assurances[index], ...updatedAssurance }
        this.saveAssurances()
        
        const alertStore = useAlertStore()
        alertStore.checkAlerts()
      }
    },

    deleteAssurance(assuranceId) {
      this.assurances = this.assurances.filter(a => a.id !== assuranceId)
      this.saveAssurances()
      
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    saveAssurances() {
      localStorage.setItem('assurances', JSON.stringify(this.assurances))
    }
  }
})
