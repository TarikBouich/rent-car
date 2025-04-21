<template>
  <div class="p-4">
    <div class="max-w-4xl mx-auto bg-white dark:bg-dark-70 rounded-lg shadow-sm">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Add New Car</h2>
      </div>
      <form @submit.prevent="handleSubmit" class="p-4 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <!-- Registration Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Number</label>
            <input
              v-model="carData.registrationNumber"
              type="text"
              required
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

export default {
  name: 'AddCarView',
  setup() {
    const router = useRouter()
    const carData = ref({
      name: '',
      registrationNumber: '',
      currentMileage: null,
      nextVidangeKm: null,
      assuranceEndDate: '',
      visiteTechniqueEndDate: '',
    })

    const handleSubmit = () => {
      // Get existing cars from localStorage
      const existingCars = JSON.parse(localStorage.getItem('cars') || '[]')
      
      // Add new car
      existingCars.push({
        id: Date.now(), // Simple way to generate unique ID
        ...carData.value
      })
      
      // Save back to localStorage
      localStorage.setItem('cars', JSON.stringify(existingCars))
      
      // Navigate back to cars list
      router.push({ name: 'cars' })
    }

    return {
      carData,
      handleSubmit
    }
  }
}
</script>
