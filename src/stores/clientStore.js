import { defineStore } from 'pinia'
import { useUserStore } from './userStore'

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [],
    archivedClients: []
  }),

  getters: {
    // Get clients filtered by agency
    filteredClients: (state) => {
      const userStore = useUserStore()
      if (userStore.isAdmin) {
        return state.clients
      }
      return state.clients.filter(client => client.agencyId === userStore.currentAgencyId)
    },

    // Get archived clients filtered by agency
    filteredArchivedClients: (state) => {
      const userStore = useUserStore()
      if (userStore.isAdmin) {
        return state.archivedClients
      }
      return state.archivedClients.filter(client => client.agencyId === userStore.currentAgencyId)
    }
  },

  actions: {
    // Initialize data from localStorage
    initializeFromStorage() {
      const storedClients = localStorage.getItem('clients')
      const storedArchivedClients = localStorage.getItem('archivedClients')

      if (storedClients) this.clients = JSON.parse(storedClients)
      if (storedArchivedClients) this.archivedClients = JSON.parse(storedArchivedClients)
    },

    // Add a new client
    addClient(client) {
      const userStore = useUserStore()
      this.clients.push(client)
      this.saveClients()
    },

    // Update a client
    updateClient(clientId, updates) {
      const index = this.clients.findIndex(c => c.id === clientId)
      if (index !== -1) {
        this.clients[index] = { ...this.clients[index], ...updates }
        this.saveClients()
      }
    },

    // Archive a client
    archiveClient(clientId) {
      const index = this.clients.findIndex(c => c.id === clientId)
      if (index !== -1) {
        const archivedClient = { ...this.clients[index], archived: true }
        this.archivedClients.push(archivedClient)
        this.clients.splice(index, 1)
        this.saveAll()
      }
    },

    // Restore an archived client
    restoreClient(clientId) {
      const index = this.archivedClients.findIndex(c => c.id === clientId)
      if (index !== -1) {
        const restoredClient = { ...this.archivedClients[index], archived: false }
        this.clients.push(restoredClient)
        this.archivedClients.splice(index, 1)
        this.saveAll()
      }
    },

    // Delete a client permanently
    deleteClient(clientId, isArchived = false) {
      if (isArchived) {
        this.archivedClients = this.archivedClients.filter(c => c.id !== clientId)
        this.saveArchivedClients()
      } else {
        this.clients = this.clients.filter(c => c.id !== clientId)
        this.saveClients()
      }
    },

    // Save methods
    saveClients() {
      localStorage.setItem('clients', JSON.stringify(this.clients))
    },

    saveArchivedClients() {
      localStorage.setItem('archivedClients', JSON.stringify(this.archivedClients))
    },

    saveAll() {
      this.saveClients()
      this.saveArchivedClients()
    }
  }
}) 