<template>
  <div class="p-4">
    <div class="max-w-4xl mx-auto bg-white dark:bg-dark-70 rounded-lg shadow-sm">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Add New Client</h2>
      </div>
      <form @submit.prevent="handleSubmit" class="p-4 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- First Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
            <input
              v-model="clientData.firstName"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
            <input
              v-model="clientData.lastName"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
            <input
              v-model="clientData.phone"
              type="tel"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              v-model="clientData.email"
              type="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <!-- Address -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <textarea
              v-model="clientData.address"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            ></textarea>
          </div>

          <!-- ID Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">ID Number</label>
            <input
              v-model="clientData.idNumber"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <!-- License Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Driver's License Number</label>
            <input
              v-model="clientData.licenseNumber"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$router.back()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-300 dark:hover:bg-dark-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Client
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AddClientView',
  setup() {
    const router = useRouter()
    const clientData = ref({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      idNumber: '',
      licenseNumber: ''
    })

    const handleSubmit = () => {
      // Get existing clients from localStorage
      const existingClients = JSON.parse(localStorage.getItem('clients') || '[]')
      
      // Add new client
      existingClients.push({
        id: Date.now(),
        ...clientData.value,
        createdAt: new Date().toISOString()
      })
      
      // Save back to localStorage
      localStorage.setItem('clients', JSON.stringify(existingClients))
      
      // Navigate back to clients list
      router.push({ name: 'clients' })
    }

    return {
      clientData,
      handleSubmit
    }
  }
}
</script>
