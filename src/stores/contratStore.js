import { defineStore } from 'pinia'
import { useUserStore } from './userStore'

export const useContratStore = defineStore('contrat', {
  state: () => ({
    contrats: JSON.parse(localStorage.getItem('contrats') || '[]')
  }),

  getters: {
    // Get all contracts globally (for admins) or filter securely by agency
    filteredContrats: (state) => {
      const userStore = useUserStore()
      return userStore.filterByAgency(state.contrats)
    },
    
    getContratById: (state) => {
      return (id) => state.contrats.find(c => c.id === id)
    }
  },

  actions: {
    addContrat(contratData) {
      const userStore = useUserStore()
      const newContrat = {
        ...contratData,
        id: Date.now().toString(), // Safe fallback ID 
        agencyId: contratData.agencyId || userStore.currentAgencyId,
        companyId: userStore.userCompanyId,
        createdAt: new Date().toISOString()
      }
      
      this.contrats.push(newContrat)
      this.saveToStorage()
      return newContrat
    },

    updateContrat(updatedContrat) {
      const index = this.contrats.findIndex(c => c.id === updatedContrat.id)
      if (index !== -1) {
        this.contrats[index] = {
          ...this.contrats[index],
          ...updatedContrat,
          updatedAt: new Date().toISOString()
        }
        this.saveToStorage()
      }
    },

    deleteContrat(id) {
      this.contrats = this.contrats.filter(c => c.id !== id)
      this.saveToStorage()
    },

    saveToStorage() {
      localStorage.setItem('contrats', JSON.stringify(this.contrats))
    }
  }
})
