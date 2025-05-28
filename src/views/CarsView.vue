<template>
  <div>
    <div class="p-4">
      <div
        class="rounded-xl shadow-card overflow-hidden"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white'"
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
        <div class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="(car, index) in filteredCars" 
                 :key="index" 
                 class="bg-white dark:bg-dark-70 rounded-xl overflow-hidden shadow-md relative group h-[500px]"
                 :class="{'bg-black/50 dark:bg-black/50': hasExpiredItems(car)}">
              <!-- Car Image -->
              <img :src="car.image" 
                   :alt="car.name"
                   class="w-full h-full object-cover" />
              
              <!-- Car Info Overlay -->
              <div class="absolute top-0 left-0 right-0 h-[80%] bg-black/50 p-4 overflow-y-auto z-10">
                <div class="mb-2">
                  <h3 class="text-xl font-bold text-white">{{ car.name }}</h3>
                  <p class="text-sm text-white/90">{{ car.licensePlate }}</p>
                </div>
                
                <!-- Features -->
                <div class="flex flex-col gap-1.5 mb-2">
                  <!-- Assurance -->
                  <div v-if="car.assuranceEndDate" class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span class="text-sm font-semibold" :class="getDateColor(car.assuranceEndDate) || 'text-white'">
                      Assurance: {{ formatDate(car.assuranceEndDate) }}
                    </span>
                  </div>

                  <!-- Visite Technique -->
                  <div v-if="car.visiteTechniqueEndDate" class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-sm font-semibold" :class="getDateColor(car.visiteTechniqueEndDate) || 'text-white'">
                      Visite Technique: {{ formatDate(car.visiteTechniqueEndDate) }}
                    </span>
                  </div>

                  <!-- Vidange -->
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-sm font-semibold text-white">
                      {{ car.currentMileage }} km
                      <span v-if="car.nextVidangeKm" class="text-sm ml-1" :class="car.currentMileage >= car.nextVidangeKm ? 'text-red-500' : 'text-white'">
                        (Next: {{ car.nextVidangeKm }} km)
                      </span>
                    </span>
                  </div>

                  <!-- Transmission -->
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path v-if="car.transmission === 'manual'" d="M1.5 6.75v-3a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0m2.85-.45-2.25-3a.75.75 0 1 0-1.2.9l2.25 3a.75.75 0 1 0 1.2-.9m18.9 13.95h-3L21 21v-.75A2.25 2.25 0 0 1 23.25 18l-.75-.75v6a.75.75 0 0 0 1.5 0v-6a.75.75 0 0 0-.75-.75 3.75 3.75 0 0 0-3.75 3.75V21c0 .414.336.75.75.75h3a.75.75 0 0 0 0-1.5M18.024 2.056A.75.75 0 1 1 18.75 3v1.5a.75.75 0 1 1-.722.95.75.75 0 1 0-1.446.4A2.25 2.25 0 1 0 18.75 3c-1 0-1 1.5 0 1.5a2.25 2.25 0 1 0-2.174-2.832.75.75 0 0 0 1.448.388M12 18.75a.75.75 0 0 1 1.5 0c0 .315-.107.622-.304.868l-2.532 3.163A.75.75 0 0 0 11.25 24h3a.75.75 0 0 0 0-1.5h-3l.586 1.219 2.532-3.164c.41-.513.632-1.15.632-1.805a2.25 2.25 0 0 0-4.5 0 .75.75 0 0 0 1.5 0M8.25 1.5H9v5.25a.75.75 0 0 0 1.5 0V1.5A1.5 1.5 0 0 0 9 0h-.75a.75.75 0 0 0 0 1.5m0 6h3a.75.75 0 0 0 0-1.5h-3a.75.75 0 0 0 0 1.5m-6-7.5H.75A.75.75 0 0 0 0 .75v3c0 .414.336.75.75.75h1.5a2.25 2.25 0 0 0 0-4.5m0 1.5a.75.75 0 0 1 0 1.5H.75l.75.75v-3l-.75.75zm8.25 11.25v-3a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0m1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5a.75.75 0 0 0-1.5 0m7.5 0v-3a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0m3 1.5A2.25 2.25 0 0 0 20.25 12h-15A2.25 2.25 0 0 1 3 9.75a.75.75 0 0 0-1.5 0 3.75 3.75 0 0 0 3.75 3.75h15a.75.75 0 0 1 .75.75.75.75 0 0 0 1.5 0"/>
                      <path v-else d="M19.25 14.25v-4.5l-1.374.416 3 4.5c.412.617 1.374.326 1.374-.416v-4.5a.75.75 0 0 0-1.5 0v4.5l1.374-.416-3-4.5c-.412-.617-1.374-.326-1.374.416v4.5a.75.75 0 0 0 1.5 0m3 6a3.75 3.75 0 0 0-3.75-3.75.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75a3.75 3.75 0 0 0 3.75-3.75m-1.5 0a2.25 2.25 0 0 1-2.25 2.25l.75.75v-6l-.75.75a2.25 2.25 0 0 1 2.25 2.25M18.5 4.5H20A2.25 2.25 0 0 0 20 0h-1.5a.75.75 0 0 0-.75.75v6a.75.75 0 0 0 1.5 0v-6l-.75.75H20A.75.75 0 0 1 20 3h-1.5a.75.75 0 0 0 0 1.5M4.25 6.75v4.5A2.25 2.25 0 0 0 6.5 13.5H8a.75.75 0 0 1 .75.75v4.5A2.25 2.25 0 0 0 11 21h3a.75.75 0 0 0 0-1.5h-3a.75.75 0 0 1-.75-.75v-4.5A2.25 2.25 0 0 0 8 12H6.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-1.5 0m3-3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0m1.5 0a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0"/>
                    </svg>
                    <span class="text-sm text-white font-semibold">{{ car.transmission === 'manual' ? 'Manual' : 'Automatic' }}</span>
                  </div>
                </div>

                <!-- Status and Price -->
                <div class="flex items-center justify-between">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="{
                      'bg-green-500/20 text-white': car.status === 'Available',
                      'bg-red-500/20 text-white': car.status === 'Rented',
                    }"
                  >
                    <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="{
                      'bg-green-400': car.status === 'Available',
                      'bg-red-400': car.status === 'Rented'
                    }"></span>
                    {{ car.status }}
                  </span>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-white">{{ car.pricePerDay }} MAD</p>
                    <p class="text-sm text-white/80">per day</p>
                  </div>
                </div>
              </div>
              
              <!-- Hover Overlay for Actions -->
              <div class="absolute bottom-0 left-0 right-0 h-[20%] bg-black/50 flex items-center justify-center gap-4">
                <button
                  @click="editCar(car)"
                  class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                  title="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-white"
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
                  class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-white"
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
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Edit Car Modal -->
    <div
      v-if="showModal"
      class="bg-opacity-40 fixed inset-0 z-[9999] flex items-center justify-center p-4"
      :class="mode === 'dark' ? 'bg-white' : 'bg-body-100'"
    >
      <div
        class="max-w-2xl rounded-xl w-full mx-auto bg-white"
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
            <div>
              <label class="block text-sm mb-1">Transmission</label>
              <div class="flex items-center relative">
                <select
                  class="form-field appearance-none"
                  v-model="currentCar.transmission"
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
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
        nextVidangeKm: 0,
        transmission: "manual"
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
      
      if (diffDays < 0) {
        return 'text-red-500'; // Expired dates
      } else if (diffDays <= 1 && diffDays >= 0) {
        return 'text-red-500'; // Due today or tomorrow
      } else if (diffDays <= 3 && diffDays >= 0) {
        return 'text-orange-500'; // Due within 3 days
      }
      return '';
    },
    hasExpiredItems(car) {
      const today = new Date();
      
      // Check assurance
      if (car.assuranceEndDate) {
        const assuranceDate = new Date(car.assuranceEndDate);
        if (assuranceDate < today) return true;
      }
      
      // Check visite technique
      if (car.visiteTechniqueEndDate) {
        const visiteDate = new Date(car.visiteTechniqueEndDate);
        if (visiteDate < today) return true;
      }
      
      // Check vidange
      if (car.currentMileage && car.nextVidangeKm && car.currentMileage >= car.nextVidangeKm) {
        return true;
      }
      
      return false;
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
