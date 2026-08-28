import { defineStore } from 'pinia'
import companyService from '../services/companyService'

export const useCompanyStore = defineStore('company', {
  state: () => ({
    companies: []
  }),

  getters: {
    getCompanyById: (state) => (id) => {
      return state.companies.find(c => c.id === id)
    },
    activeCompanies: (state) => {
      return state.companies.filter(c => c.status === 'Active')
    }
  },

  actions: {
    async initializeFromStorage() {
      await this.fetchCompanies()
    },

    async fetchCompanies() {
      try {
        const response = await companyService.getAll()
        this.companies = response.data
      } catch (error) {
        console.error('Failed to fetch companies:', error)
      }
    },

    async addCompany(companyData) {
      try {
        const response = await companyService.create(companyData)
        this.companies.push(response.data)
        return response.data
      } catch (error) {
         console.error('Failed to add company:', error)
         throw error
      }
    },

    async updateCompany(updatedCompany) {
      try {
        const response = await companyService.update(updatedCompany.id, updatedCompany)
        const index = this.companies.findIndex(c => c.id === updatedCompany.id)
        if (index !== -1) {
          this.companies[index] = { ...this.companies[index], ...response.data }
        }
      } catch (error) {
        console.error('Failed to update company:', error)
        throw error
      }
    },

    async deleteCompany(id) {
       // Optional: Add backend support if needed later. But usually companies aren't hard deleted.
       console.log('Delete company not yet mapped to API', id)
    }
  }
})
