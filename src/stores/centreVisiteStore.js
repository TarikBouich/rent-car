import { defineStore } from 'pinia'
import { generateNextId } from '../utils/idGenerator'
import { useUserStore } from './userStore'

export const useCentreVisiteStore = defineStore('centreVisite', {
  state: () => ({
    centres: JSON.parse(localStorage.getItem('centresVisite') || '[]')
  }),

  getters: {
    getAllCentres: (state) => state.centres,
    getCentreById: (state) => (id) => state.centres.find(c => c.id === id),
  },

  actions: {
    initializeFromStorage() {
      this.centres = JSON.parse(localStorage.getItem('centresVisite') || '[]')
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
      localStorage.setItem('centresVisite', JSON.stringify(this.centres))
    }
  }
})
