<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-6">Car Rental Information</h1>
     <!-- Table -->
      <div
          class="inline-block min-w-full shadow-md rounded-lg overflow-hidden"
        >
          <table class="min-w-full leading-normal">
            <thead>
              <tr>
                <th class="px-5 py-3 border-b-2 border-secondary-100 bg-primary-50 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Voiture
                </th>
                <th class="px-5 py-3 border-b-2 border-secondary-100 bg-primary-50 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Prix
                </th>
                <th class="px-5 py-3 border-b-2 border-secondary-100 bg-primary-50 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Status
                </th>
                <th class="px-5 py-3 border-b-2 border-secondary-100 bg-primary-50 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Loop through the cars data -->
              <tr v-for="(car, index) in cars" :key="index">
                <td class="px-5 py-5 bg-primary-70 text-sm">
                  <div class="flex">
                    <div class="flex-shrink-0 w-10 h-10">
                      <img class="w-full h-full rounded-full" :src="car.image" alt="Car Image" />
                    </div>
                    <div class="ml-3">
                      <p class="text-white whitespace-no-wrap">{{ car.name }}</p>
                      <p class="text-white whitespace-no-wrap">{{ car.licensePlate }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-5 bg-primary-70 text-sm">
                  <p class="text-white whitespace-no-wrap">{{ car.pricePerDay }}</p>
                  <p class="text-white whitespace-no-wrap">MAD</p>
                </td>
                <td class="px-5 py-5 bg-primary-70 text-sm">
                  <span
                    class="relative inline-block px-3 py-1 font-semibold leading-tight"
                    :class="{'text-green-900': car.status === 'Available', 'text-red-900': car.status === 'Rented'}"
                  >
                    <span
                      aria-hidden
                      class="absolute inset-0 rounded-full opacity-50"
                      :class="{'bg-green-200': car.status === 'Available', 'bg-red-200': car.status === 'Rented'}"
                    ></span>
                    <span class="relative">{{ car.status }}</span>
                  </span>
                </td>
                <td class="px-5 py-5 bg-primary-70 text-sm">
                  <button @click="editCar(car, index)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">Edit</button>
                  <button @click="deleteCar(index)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ml-2">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
      </div>
       <!-- Edit Car Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 class="text-2xl mb-4">Edit Car</h2>
        <form @submit.prevent="updateCar">
          <div class="mb-4">
            <label class="block text-gray-700">Car Name</label>
            <input v-model="currentCar.name" class="w-full px-3 py-2 border rounded text-gray-700" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">License Plate</label>
            <input v-model="currentCar.licensePlate" class="w-full px-3 py-2 border rounded text-gray-700" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Price Per Day</label>
            <input v-model="currentCar.pricePerDay" type="number" class="w-full px-3 py-2 border rounded text-gray-700" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Status</label>
            <select v-model="currentCar.status" class="w-full px-3 py-2 border rounded text-gray-700">
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
            </select>
          </div>
          <div class="flex justify-end">
            <button type="button" @click="showModal = false" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cars: [
        {
          name: 'Toyota Corolla',
          licensePlate: 'ABC-1234',
          pricePerDay: 500,
          status: 'Available',
          image: 'https://via.placeholder.com/80',
        },
        {
          name: 'Honda Accord',
          licensePlate: 'DEF-5678',
          pricePerDay: 500,
          status: 'Rented',
          image: 'https://via.placeholder.com/80',
        },
        {
          name: 'Ford Mustang',
          licensePlate: 'GHI-9101',
          pricePerDay: 600,
          status: 'Available',
          image: 'https://via.placeholder.com/80',
        },
        {
          name: 'Tesla Model 3',
          licensePlate: 'JKL-2345',
          pricePerDay: 1000,
          status: 'Rented',
          image: 'https://via.placeholder.com/80',
        },
      ],
      showModal: false,
      currentCar: {
        name: '',
        licensePlate: '',
        pricePerDay: 0,
        status: 'Available',
      },
      currentCarIndex: -1,
    };
  },
  methods: {
    editCar(car, index) {
      this.currentCar = { ...car }; // Copy the car data to the currentCar
      this.currentCarIndex = index;
      this.showModal = true;
    },
    updateCar() {
      if (this.currentCarIndex > -1) {
        this.cars[this.currentCarIndex] = { ...this.currentCar };
        this.showModal = false; // Close modal after saving
      }
    },
    deleteCar(index) {
      this.cars.splice(index, 1); // Remove the car from the array
    },
  },
};
</script>


