<template>
  <div class="p-4">
    <div class="max-w-4xl mx-auto bg-white dark:bg-dark-70 rounded-lg shadow-sm">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Add New Car</h2>
      </div>
      <form @submit.prevent="handleSubmit" class="p-4 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Car Image -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Car Image</label>
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              required
              class="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-dark-60 dark:file:text-blue-400"
            />
            <div v-if="carData.image" class="mt-2">
              <img :src="carData.image" alt="Car Preview" class="w-32 h-32 object-cover rounded-lg">
            </div>
          </div>

          <!-- Car Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Car Name</label>
            <input
              v-model="carData.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <!-- License Plate -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">License Plate</label>
            <input
              v-model="carData.licensePlate"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <!-- Price Per Day -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Per Day (MAD)</label>
            <input
              v-model.number="carData.pricePerDay"
              type="number"
              required
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <!-- Current Mileage -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Mileage (km)</label>
            <input
              v-model.number="carData.currentMileage"
              type="number"
              required
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <!-- Next Oil Change -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Next Oil Change (km)</label>
            <input
              v-model.number="carData.nextVidangeKm"
              type="number"
              required
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <!-- Insurance End Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Insurance End Date</label>
            <input
              v-model="carData.assuranceEndDate"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <!-- Technical Visit End Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Technical Visit End Date</label>
            <input
              v-model="carData.visiteTechniqueEndDate"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <!-- Transmission -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Transmission</label>
            <select
              v-model="carData.transmission"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            >
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              v-model="carData.status"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-dark-60 dark:border-dark-50 dark:text-gray-100 sm:text-sm"
            >
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
            </select>
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
            Add Car
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCarStore } from '../stores/carStore'
import { useUserStore } from '../stores/userStore'

export default {
  name: 'AddCarView',
  setup() {
    const router = useRouter()
    const carStore = useCarStore()
    const userStore = useUserStore()

    const carData = ref({
      name: '',
      licensePlate: '',
      image: '',
      pricePerDay: 0,
      currentMileage: 0,
      nextVidangeKm: 0,
      lastVidangeKm: 0,
      needsVidange: false,
      assuranceEndDate: '',
      visiteTechniqueEndDate: '',
      transmission: 'manual',
      status: 'Available',
      agencyId: userStore.currentAgency?.id
    })

    const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          carData.value.image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const handleSubmit = () => {
      // Add new car using the store
      carStore.addCar({
        ...carData.value,
        id: Date.now() // Simple way to generate unique ID
      })
      
      // Navigate back to cars list
      router.push({ name: 'cars' })
    }

    return {
      carData,
      handleImageUpload,
      handleSubmit
    }
  }
}
</script>
