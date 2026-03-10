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
              class="form-field"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
            <input
              v-model="clientData.lastName"
              type="text"
              required
              class="form-field"
            />
          </div>

          <!-- National ID -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">National ID</label>
            <input
              v-model="clientData.nationalId"
              type="text"
              required
              class="form-field"
            />
          </div>

          <!-- Agency Location -->
          <div v-if="userStore.isAdmin">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Agency Location</label>
            <select
              v-model="clientData.agencyId"
              required
              class="form-field"
            >
              <option value="">Select Agency</option>
              <option v-for="agency in agencies" :key="agency.id" :value="agency.id">
                {{ agency.name }} ({{ agency.location }})
              </option>
            </select>
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
            <input
              v-model="clientData.phoneNumber"
              type="tel"
              required
              class="form-field"
               />
          </div>

          <!-- Nationality -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nationality</label>
            <input
              v-model="clientData.nationality"
              type="text"
              required
              class="form-field"
            />
          </div>

          <!-- Birth Date -->
          <!-- <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Birth Date</label>
            <input
              v-model="clientData.birthDate"
              type="date"
              required
              class="form-field"
            />
          </div> -->

          <!-- Profession -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Profession</label>
            <input
              v-model="clientData.profession"
              type="text"
              required
              class="form-field"
            />
          </div>

          <!-- License Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">License Number</label>
            <input
              v-model="clientData.licenseNumber"
              type="text"
              required
              class="form-field"
            />
          </div>

          <!-- License Issue Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">License Issue Date</label>
            <input
              v-model="clientData.licenseDate"
              type="date"
              required
              class="form-field"
            />
          </div>

          <!-- Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <textarea
              v-model="clientData.address"
              rows="3"
              required
              class="form-field"
              ></textarea>
          </div>

          <!-- ID Card Front -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">ID Card Front</label>
            <input
              type="file"
              @change="handleFileUpload($event, 'idCardFront')"
              accept="image/*"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-dark-60 dark:file:text-gray-100"
            />
            <div v-if="clientData.idCardFront" class="mt-2">
              <img :src="clientData.idCardFront" class="w-32 h-32 object-cover rounded-lg" />
            </div>
          </div>

          <!-- ID Card Back -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">ID Card Back</label>
            <input
              type="file"
              @change="handleFileUpload($event, 'idCardBack')"
              accept="image/*"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-dark-60 dark:file:text-gray-100"
            />
            <div v-if="clientData.idCardBack" class="mt-2">
              <img :src="clientData.idCardBack" class="w-32 h-32 object-cover rounded-lg" />
            </div>
          </div>

          <!-- Driver's License Front -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Driver's License Front</label>
            <input
              type="file"
              @change="handleFileUpload($event, 'driverLicenseFront')"
              accept="image/*"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-dark-60 dark:file:text-gray-100"
            />
            <div v-if="clientData.driverLicenseFront" class="mt-2">
              <img :src="clientData.driverLicenseFront" class="w-32 h-32 object-cover rounded-lg" />
            </div>
          </div>

          <!-- Driver's License Back -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Driver's License Back</label>
            <input
              type="file"
              @change="handleFileUpload($event, 'driverLicenseBack')"
              accept="image/*"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-dark-60 dark:file:text-gray-100"
            />
            <div v-if="clientData.driverLicenseBack" class="mt-2">
              <img :src="clientData.driverLicenseBack" class="w-32 h-32 object-cover rounded-lg" />
            </div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientStore } from '../stores/clientStore'
import { useUserStore } from '../stores/userStore'
import { generateNextId } from '../utils/idGenerator'

export default {
  name: 'AddClientView',
  setup() {
    const router = useRouter()
    const clientStore = useClientStore()
    const userStore = useUserStore()
    const agencies = ref([])

    const clientData = ref({
      firstName: '',
      lastName: '',
      nationalId: '',
      phoneNumber: '',
      nationality: '',
      birthDate: '',
      profession: '',
      licenseNumber: '',
      licenseDate: '',
      address: '',
      idCardFront: '',
      idCardBack: '',
      driverLicenseFront: '',
      driverLicenseBack: '',
      agencyId: userStore.isAdmin ? '' : userStore.currentAgencyId
    })

    const loadAgencies = () => {
      try {
        const savedAgencies = localStorage.getItem('agencies')
        if (savedAgencies) {
          agencies.value = JSON.parse(savedAgencies)
        }
      } catch (error) {
        console.error('Error loading agencies:', error)
      }
    }

    onMounted(() => {
      loadAgencies()
    })

    const handleFileUpload = (event, field) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          clientData.value[field] = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const formatDateForStorage = (dateString) => {
      if (!dateString) return ''
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
          console.warn('Invalid date:', dateString)
          return dateString
        }
        return date.toISOString().split('T')[0]
      } catch (error) {
        console.error('Error formatting date for storage:', error)
        return dateString
      }
    }

    const handleSubmit = () => {
      const clientToSave = {
        id: generateNextId(clientStore.clients),
        ...clientData.value,
        birthDate: formatDateForStorage(clientData.value.birthDate),
        licenseDate: formatDateForStorage(clientData.value.licenseDate),
        createdAt: new Date().toISOString()
      }
      clientStore.addClient(clientToSave)
      router.push({ name: 'clients' })
    }

    return {
      clientData,
      agencies,
      userStore,
      handleSubmit,
      handleFileUpload
    }
  }
}
</script> 