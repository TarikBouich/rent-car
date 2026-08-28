import { defineStore } from 'pinia'
import { useUserStore } from './userStore'
import api from '../services/api'

export const useFactureStore = defineStore('facture', {
  state: () => ({
    factures: []
  }),

  getters: {
    getFactureById: (state) => (id) => state.factures.find(f => f.id === id),
    filteredFactures: (state) => {
      const userStore = useUserStore()
      return userStore.filterByAgency(state.factures)
    }
  },

  actions: {
    async initializeFromStorage() {
      try {
        const response = await api.get('/factures')
        this.factures = response.data || []
      } catch (error) {
        console.error('Failed to load factures:', error)
      }
    },

    async addFacture(factureData) {
      const userStore = useUserStore()
      const newFacture = {
        ...factureData,
        id: factureData.id || `facture_${Date.now()}`,
        companyId: factureData.companyId || userStore.userCompanyId,
        createdAt: factureData.createdAt || new Date().toISOString()
      }

      try {
        const response = await api.post('/factures', newFacture)
        this.factures.unshift(response.data)
        return response.data
      } catch (error) {
        console.error('Failed to save facture:', error)
        throw error
      }
    },

    async updateFacture(updatedFacture) {
      try {
        const response = await api.put(`/factures/${updatedFacture.id}`, {
          ...this.factures[index],
          ...updatedFacture,
          updatedAt: new Date().toISOString()
        })
        this.factures[index] = response.data
      } catch (error) {
        console.error('Failed to update facture:', error)
        throw error
      }
    },

    async deleteFacture(factureId) {
      try {
        await api.delete(`/factures/${factureId}`)
        this.factures = this.factures.filter(f => f.id !== factureId)
      } catch (error) {
        console.error('Failed to delete facture:', error)
        throw error
      }
    }
  }
})
