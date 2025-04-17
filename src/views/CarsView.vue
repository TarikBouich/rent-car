<template>
  <div>
    <div class="p-4">
      <div
        class="rounded-xl shadow-card overflow-hidden"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white-100'"
      >
        <div
          class="px-4 py-2.5 border-b flex items-center justify-between"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <span class="text-lg font-bold leading-none">Cars</span>
          <div class="flex items-center gap-2">
            <div class="w-[500px]">
              <div class="relative flex items-center">
                <input
                  type="search"
                  class="form-field pl-10"
                  placeholder="Search for a car by name"
                  v-model="searchQuery"
                />
                <div
                  class="absolute left-0 top-0 bottom-0 flex items-center justify-center w-11 text-gray-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    class="w-5 h-5"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.323 13.383a5.5 5.5 0 1 1 1.06-1.06l2.897 2.897a.75.75 0 1 1-1.06 1.06l-2.897-2.897Zm.677-4.383a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <RouterLink
              :to="{ name: 'cars-add' }"
              class="button primary-button small-button whitespace-nowrap"
            >
              Add Car
            </RouterLink>
          </div>
        </div>
        <div class="w-full overflow-x-auto without-scrollbar">
          <table class="w-full form-table">
            <thead
              class="border-b-2"
              :class="mode === 'dark' ? 'border-dark-50' : ''"
            >
              <tr :class="mode === 'dark' ? 'bg-dark-1' : 'bg-gray-1'">
                <th class="p-4 text-left">Voiture</th>
                <th class="p-4 text-left">Prix</th>
                <th class="p-4 text-left">Status</th>
                <th class="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody
              class="divide-y bg-opacity-40"
              :class="
                mode === 'dark'
                  ? 'bg-dark-70 divide-dark-50'
                  : 'bg-white-100 divide-gray-100'
              "
            >
              <tr v-for="(car, index) in filteredCars" :key="index" class="hover:bg-gray-50 dark:hover:bg-dark-60 transition-colors">
                <td class="py-6">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-[150px] h-[150px] mr-4">
                      <img
                        class="w-full h-full rounded-lg object-contain"
                        :src="car.image"
                        alt="Car Image"
                      />
                    </div>
                    <div class="flex flex-col">
                      <p class="text-xl font-bold text-primary-100 mb-2">
                        {{ car.name }}
                      </p>
                      <div class="flex flex-col gap-1 mb-2">
                        <div v-if="car.assuranceEndDate" class="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                          </svg>
                          <span :class="getDateColor(car.assuranceEndDate)">
                            Assurance: {{ formatDate(car.assuranceEndDate) }}
                          </span>
                        </div>
                        <div v-if="car.visiteTechniqueEndDate" class="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                          </svg>
                          <span :class="getDateColor(car.visiteTechniqueEndDate)">
                            Visite Technique: {{ formatDate(car.visiteTechniqueEndDate) }}
                          </span>
                        </div>
                      </div>
                      <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-2 text-black dark:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="9" stroke-width="2"/>
                            <path d="M12 8v1" stroke-width="2"/>
                            <path d="M12 15v1" stroke-width="2"/>
                            <path d="M8 12h1" stroke-width="2"/>
                            <path d="M15 12h1" stroke-width="2"/>
                            <path d="M12 12L9 7" stroke-width="2.5" stroke-linecap="round"/>
                            <path d="M12 12l4 1" stroke-width="1.5" stroke-linecap="round"/>
                            <circle cx="12" cy="12" r="1" fill="currentColor"/>
                          </svg>
                          <p class="text-lg">{{ car.currentMileage }} km</p>
                          <span v-if="car.nextVidangeKm" class="text-sm" :class="car.currentMileage >= car.nextVidangeKm ? 'text-red-500' : 'text-gray-500'">
                            (Next vidange: {{ car.nextVidangeKm }} km)
                          </span>
                        </div>
                        <div class="flex items-center gap-2 text-black dark:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1zM3 8a1 1 0 00-1.447.894l-2 1A1 1 0 000 10v4a1 1 0 001.447.894l2-1A1 1 0 003 13V8z" />
                          </svg>
                          <p class="text-lg">
                        {{ car.licensePlate }}
                      </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="py-6">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl font-bold text-primary-100">{{ car.pricePerDay }}</span>
                    <span class="text-black dark:text-white">MAD</span>
                  </div>
                  <p class="text-sm text-black dark:text-white">per day</p>
                </td>
                <td class="py-6">
                  <span
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                    :class="{
                      'text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-100':
                        car.status === 'Available',
                      'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-100': car.status === 'Rented',
                    }"
                  >
                    <span class="w-2 h-2 rounded-full mr-2" :class="{
                      'bg-green-500': car.status === 'Available',
                      'bg-red-500': car.status === 'Rented'
                    }"></span>
                    {{ car.status }}
                  </span>
                </td>
                <td class="py-6">
                  <div class="flex items-center gap-3">
                    <button
                      @click="editCar(car)"
                      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="deleteCar(car)"
                      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Edit Car Modal -->
    <div
      v-if="showModal"
      class="bg-opacity-40 fixed inset-0 z-[9999] flex items-center justify-center p-4"
      :class="mode === 'dark' ? 'bg-white-100' : 'bg-body-100'"
    >
      <div
        class="max-w-2xl rounded-xl w-full mx-auto bg-white-100"
      >
        <div
          class="flex items-center justify-between px-4 py-3 border-b"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <h5 class="font-semibold leading-none">Edit Car</h5>
          <svg
            @click="showModal = !showModal"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="cursor-pointer w-6 h-6 -mr-1"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M368 368L144 144M368 144L144 368"
            ></path>
          </svg>
        </div>
        <div
          class="without-scrollbar max-h-modal overflow-y-auto p-4 rounded-bl-xl rounded-br-xl bg-white"
        >
          <div class="grid gap-4">
            <div>
              <label for="image" class="block text-sm mb-1">Car Image</label>
              <input
                type="file"
                class="form-field"
                id="image"
                accept="image/*"
                @change="handleImageUpload"
                ref="fileInput"
              />
              <div v-if="currentCar.image" class="mt-2">
                <img :src="currentCar.image" alt="Car Preview" class="w-32 h-32 object-cover rounded-lg">
              </div>
            </div>
            <div>
              <label for="name" class="block text-sm mb-1">Name</label>
              <input
                type="text"
                class="form-field"
                id="name"
                v-model="currentCar.name"
                placeholder=""
              />
            </div>
            <div>
              <label for="license-plate" class="block text-sm mb-1"
                >Perks</label
              >
              <input
                type="text"
                class="form-field"
                id="license-plate"
                v-model="currentCar.licensePlate"
                placeholder=""
              />
            </div>
            <div>
              <label class="block text-sm mb-1">Price Per Day</label>
              <input
                v-model="currentCar.pricePerDay"
                type="number"
                class="form-field"
              />
            </div>
            <div>
              <label class="block text-sm mb-1">Assurance End Date</label>
              <input
                type="date"
                class="form-field"
                v-model="currentCar.assuranceEndDate"
              />
            </div>
            <div>
              <label class="block text-sm mb-1">Visite Technique End Date</label>
              <input
                type="date"
                class="form-field"
                v-model="currentCar.visiteTechniqueEndDate"
              />
            </div>
            <div>
              <label class="block text-sm mb-1">Current Mileage</label>
              <input
                type="number"
                class="form-field"
                v-model="currentCar.currentMileage"
                @change="updateVidangeInfo"
              />
            </div>
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="needsVidange"
                v-model="currentCar.needsVidange"
                class="form-checkbox"
              />
              <label for="needsVidange" class="text-sm">Needs Vidange</label>
            </div>
            <div v-if="currentCar.needsVidange">
              <label class="block text-sm mb-1">Last Vidange Mileage</label>
              <input
                type="number"
                class="form-field"
                v-model="currentCar.lastVidangeKm"
                @change="calculateNextVidange"
              />
              <div v-if="currentCar.nextVidangeKm" class="mt-2 text-sm text-gray-500">
                Next Vidange at: {{ currentCar.nextVidangeKm }} km
              </div>
            </div>
            <div>
              <label class="block text-sm mb-1">Status</label>
              <div class="flex items-center relative">
                <select
                  class="form-field appearance-none"
                  v-model="currentCar.status"
                >
                  <option value="Available">Available</option>
                  <option value="Rented">Rented</option>
                </select>
                <span class="absolute right-3 pointer-events-none"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="w-4 rotate-90 transform"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="48"
                      d="M184 112l144 144-144 144"
                    ></path></svg
                ></span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex items-center justify-end p-4 border-t space-x-2"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <button
            type="button"
            class="button close-button small-button"
            @click="showModal = !showModal"
          >
            Close
          </button>
          <button
            type="submit"
            class="button primary-button small-button"
            @click="updateCar"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import { carStore } from "../store";
import { generateNextId, sortByIdDesc } from '../utils/idGenerator';

export default {
  components: {
    RouterLink,
  },
  props: {
    mode: String,
  },
  data() {
    return {
      searchQuery: '',
      showModal: false,
      currentCar: {
        name: "",
        licensePlate: "",
        pricePerDay: 0,
        status: "Available",
        image: "",
        assuranceEndDate: "",
        visiteTechniqueEndDate: "",
        currentMileage: 0,
        needsVidange: false,
        lastVidangeKm: 0,
        nextVidangeKm: 0
      },
      currentCarIndex: -1,
      fileInput: null,
    };
  },
  computed: {
    cars() {
      return carStore.cars;
    },
    filteredCars() {
      const sortedCars = sortByIdDesc(this.cars);
      if (!this.searchQuery) return sortedCars;
      
      const query = this.searchQuery.toLowerCase();
      return sortedCars.filter(car => 
        car.name.toLowerCase().includes(query) ||
        car.licensePlate.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.currentCar.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    editCar(car) {
      this.currentCar = { ...car };
      this.currentCarIndex = this.cars.findIndex(c => c.licensePlate === car.licensePlate);
      this.showModal = true;
      // Reset file input when opening modal
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    updateCar() {
      const index = this.cars.findIndex(c => c.licensePlate === this.currentCar.licensePlate);
      if (index > -1) {
        this.cars[index] = { ...this.currentCar };
        localStorage.setItem('cars', JSON.stringify(this.cars));
        this.showModal = false; // Close modal after saving
      }
    },
    deleteCar(car) {
      const index = this.cars.findIndex(c => c.licensePlate === car.licensePlate);
      if (index > -1) {
        carStore.cars.splice(index, 1);
        localStorage.setItem('cars', JSON.stringify(carStore.cars));
      }
    },
    updateVidangeInfo() {
      if (this.currentCar.nextVidangeKm && this.currentCar.currentMileage >= this.currentCar.nextVidangeKm) {
        this.currentCar.needsVidange = true;
      }
    },
    calculateNextVidange() {
      if (this.currentCar.lastVidangeKm) {
        this.currentCar.nextVidangeKm = parseInt(this.currentCar.lastVidangeKm) + 9500;
      }
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
    getDateColor(date) {
      if (!date) return '';
      const today = new Date();
      const checkDate = new Date(date);
      const diffTime = checkDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1 && diffDays >= 0) {
        return 'text-red-500';
      } else if (diffDays <= 3 && diffDays >= 0) {
        return 'text-orange-500';
      }
      return '';
    },
    addCar() {
      const nextId = generateNextId(this.cars);
      const newCar = {
        id: nextId,
        name: this.newCar.name,
        brand: this.newCar.brand,
        model: this.newCar.model,
        year: this.newCar.year,
        color: this.newCar.color,
        licensePlate: this.newCar.licensePlate,
        pricePerDay: this.newCar.pricePerDay,
        status: 'Available',
        image: this.newCar.image,
        currentMileage: this.newCar.currentMileage,
        createdAt: new Date().toISOString()
      };
      
      this.cars.push(newCar);
      localStorage.setItem('cars', JSON.stringify(this.cars));
      this.showAddModal = false;
      this.resetNewCar();
    }
  },
};
</script>
