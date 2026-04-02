import { defineStore } from 'pinia'
import { generateNextId } from '../utils/idGenerator'

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
    initializeFromStorage() {
      const stored = localStorage.getItem('companies')
      if (stored) {
        this.companies = JSON.parse(stored)
      } else {
        // Migration: If no companies exist, define the default one for existing data
        this.companies = [
          {
            id: 'COMP-001',
            name: 'Rent a Car par défaut',
            email: 'contact@rentcar.com',
            status: 'Active',
            planId: 'entreprise',
            createdAt: new Date().toISOString()
          }
        ]
        this.saveCompanies()
      }
    },

    saveCompanies() {
      localStorage.setItem('companies', JSON.stringify(this.companies))
    },

    addCompany(companyData) {
      const newCompany = {
        id: `COMP-${Date.now().toString(36).toUpperCase()}`,
        name: companyData.name,
        email: companyData.email,
        status: companyData.status || 'Active',
        planId: companyData.planId || 'pro',
        createdAt: new Date().toISOString(),
        ...companyData
      }
      this.companies.push(newCompany)
      this.saveCompanies()
      return newCompany
    },

    updateCompany(updatedCompany) {
      const index = this.companies.findIndex(c => c.id === updatedCompany.id)
      if (index !== -1) {
        this.companies[index] = { ...this.companies[index], ...updatedCompany }
        this.saveCompanies()
      }
    },

    deleteCompany(id) {
      this.companies = this.companies.filter(c => c.id !== id)
      this.saveCompanies()
    }
  }
})
