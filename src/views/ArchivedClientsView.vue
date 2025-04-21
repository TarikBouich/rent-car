<template>
  <div class="p-4">
    <div
      class="rounded-xl shadow-card overflow-hidden"
      :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white-100'"
    >
      <div
        class="px-4 py-2.5 border-b flex items-center justify-between"
        :class="mode === 'dark' ? 'border-dark-50' : ''"
      >
        <span class="text-lg font-bold leading-none">Archived Clients</span>
      </div>
      <div class="p-4">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr
                class="text-left text-sm font-medium"
                :class="mode === 'dark' ? 'text-gray-300' : 'text-gray-500'"
              >
                <th class="pb-3">Name</th>
                <th class="pb-3">Email</th>
                <th class="pb-3">Phone</th>
                <th class="pb-3">Address</th>
                <th class="pb-3">Archive Date</th>
                <th class="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="client in archivedClients"
                :key="client.id"
                class="border-t"
                :class="mode === 'dark' ? 'border-dark-50' : ''"
              >
                <td class="py-3">{{ client.name }}</td>
                <td class="py-3">{{ client.email }}</td>
                <td class="py-3">{{ client.phone }}</td>
                <td class="py-3">{{ client.address }}</td>
                <td class="py-3">{{ formatDate(client.archiveDate) }}</td>
                <td class="py-3">
                  <button
                    @click="restoreClient(client)"
                    class="text-blue-500 hover:text-blue-600"
                  >
                    Restore
                  </button>
                </td>
              </tr>
              <tr v-if="archivedClients.length === 0">
                <td
                  colspan="6"
                  class="py-4 text-center text-gray-500"
                >
                  No archived clients found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArchivedClientsView',
  props: {
    mode: {
      type: String,
      default: 'light'
    }
  },
  data() {
    return {
      archivedClients: []
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    loadArchivedClients() {
      const clients = JSON.parse(localStorage.getItem('clients') || '[]')
      this.archivedClients = clients.filter(client => client.status === 'archived')
    },
    restoreClient(client) {
      const clients = JSON.parse(localStorage.getItem('clients') || '[]')
      const index = clients.findIndex(c => c.id === client.id)
      if (index !== -1) {
        clients[index].status = 'active'
        localStorage.setItem('clients', JSON.stringify(clients))
        this.loadArchivedClients()
      }
    }
  },
  mounted() {
    this.loadArchivedClients()
  }
}
</script> 