import { defineStore } from 'pinia'
import { useUserStore } from './userStore'
import clientService from '../services/clientService'

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [],
    archivedClients: []
  }),

  getters: {
    getClientById: (state) => (id) => state.clients.find(client => client.id === id) || state.archivedClients.find(client => client.id === id),
    // Get clients filtered by agency
    filteredClients: (state) => {
      const userStore = useUserStore()
      if (userStore.isAdmin) {
        return state.clients
      }
      const agencyId = userStore.userAgencyId || userStore.currentAgencyId
      return state.clients.filter(client => client.agencyId === agencyId)
    },

    // Get archived clients filtered by agency
    filteredArchivedClients: (state) => {
      const userStore = useUserStore()
      if (userStore.isAdmin) {
        return state.archivedClients
      }
      const agencyId = userStore.userAgencyId || userStore.currentAgencyId
      return state.archivedClients.filter(client => client.agencyId === agencyId)
    }
  },

  actions: {
    _setClients(clients = []) {
      this.archivedClients = clients.filter(c => c.archived === true)
      this.clients = clients.filter(c => c.archived !== true)
    },

    async initializeFromStorage() {
      try {
        const response = await clientService.getAll()
        this._setClients(response.data || [])
      } catch (error) {
        console.error('Failed to fetch clients:', error)
      }
    },

    async addClient(client) {
      try {
        const response = await clientService.create(client)
        const created = response.data
        if (created.archived) {
          this.archivedClients.unshift(created)
        } else {
          this.clients.unshift(created)
        }
        return created
      } catch (error) {
        console.error('Failed to add client:', error)
        throw error
      }
    },

    async fetchClientById(clientId) {
      try {
        const response = await clientService.getById(clientId)
        return response.data
      } catch (error) {
        console.error('Failed to fetch client by id:', error)
        throw error
      }
    },

    async updateClient(clientId, updates) {
      try {
        const response = await clientService.update(clientId, updates)
        const updated = response.data

        this.clients = this.clients.filter(c => c.id !== clientId)
        this.archivedClients = this.archivedClients.filter(c => c.id !== clientId)

        if (updated.archived) {
          this.archivedClients.unshift(updated)
        } else {
          this.clients.unshift(updated)
        }
        return updated
      } catch (error) {
        console.error('Failed to update client:', error)
        throw error
      }
    },

    async archiveClient(clientId) {
      return this.updateClient(clientId, { archived: true, status: 'Archivé' })
    },

    async restoreClient(clientId) {
      return this.updateClient(clientId, { archived: false, status: 'Actif' })
    },

    async deleteClient(clientId) {
      try {
        await clientService.delete(clientId)
        this.clients = this.clients.filter(c => c.id !== clientId)
        this.archivedClients = this.archivedClients.filter(c => c.id !== clientId)
      } catch (error) {
        console.error('Failed to delete client:', error)
        throw error
      }
    }
  }
})
