<template>
  <div>
    <div class="bg-primary-50 p-4 rounded-md">
      <form @submit.prevent="addCar">
        <div class="grid grid-cols-2 gap-2">
          <div class="mb-4 grid gap-2">
            <label class="block text-white text-md">Car Name</label>
            <input v-model="newCar.name" class="w-full px-3 py-2 border rounded text-white bg-primary-90 border-primary-50" required />
          </div>
          <div class="mb-4 grid gap-2">
            <label class="block text-white text-md">License Plate</label>
            <input v-model="newCar.licensePlate" class="w-full px-3 py-2 border rounded text-white bg-primary-90 border-primary-50" required />
          </div>
          <div class="mb-4 grid gap-2">
            <label class="block text-white text-md">Price Per Day</label>
            <input v-model="newCar.pricePerDay" type="number" class="w-full px-3 py-2 border rounded text-white bg-primary-90 border-primary-50" required />
          </div>
          <div class="mb-4 grid gap-2">
            <label class="block text-white text-md">Status</label>
            <select v-model="newCar.status" class="w-full px-3 py-2 border rounded text-white bg-primary-90 border-primary-50">
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end">
          <button type="reset" @click="resetForm" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { carStore } from '../store'; // Import the store

export default {
  data() {
    return {
      newCar: {
        name: '',
        licensePlate: '',
        pricePerDay: 0,
        status: 'Available',
      },
    };
  },
  methods: {
    addCar() {
      // Add the new car to the global store
      carStore.addCar({ ...this.newCar });
      this.resetForm();
    },
    resetForm() {
      this.newCar = {
        name: '',
        licensePlate: '',
        pricePerDay: 0,
        status: 'Available',
      };
    },
  },
};
</script>
