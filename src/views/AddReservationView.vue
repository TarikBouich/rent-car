<template>
  <div>
    <div class="p-4">
      <!-- Success Message -->
      <div v-if="showSuccess" class="mb-4 p-4 rounded-lg bg-success-50 text-success-100">
        Reservation added successfully! Redirecting...
      </div>
      
      <div
        class="rounded-xl shadow-card overflow-hidden"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white-100'"
      >
        <div
          class="p-4 border-b flex items-center justify-between"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <span class="text-lg font-bold leading-none">Add Reservation</span>
          <div class="flex items-center gap-2">
            <RouterLink
              :to="{ name: 'reservations' }"
              class="button primary-button small-button whitespace-nowrap"
            >
              Reservations
            </RouterLink>
          </div>
        </div>
        <div class="p-4">
          <div class="grid gap-4">
            <div>
              <label class="block text-sm mb-1">Client</label>
              <div class="flex items-center relative">
                <select
                  class="form-field appearance-none"
                  v-model="reservation.clientId"
                  required
                >
                  <option value="" disabled>Select a client</option>
                  <option
                    v-for="client in clients"
                    :key="client.nationalId"
                    :value="client.nationalId"
                    :disabled="hasActiveReservation(client.nationalId)"
                    :class="{ 'bg-gray-100 text-gray-400': hasActiveReservation(client.nationalId) }"
                  >
                    {{ client.firstName }} {{ client.lastName }}
                    <span v-if="hasActiveReservation(client.nationalId)" class="text-sm">(Has active reservation)</span>
                  </option>
                </select>
                <span class="absolute right-3 pointer-events-none">
                  <svg
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
                    ></path>
                  </svg>
                </span>
              </div>
            </div>

            <!-- Second Driver Section -->
            <div class="border-t pt-4">
              <div class="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="hasSecondDriver"
                  v-model="reservation.hasSecondDriver"
                  class="form-checkbox h-4 w-4 text-primary-100 rounded border-gray-300"
                />
                <label for="hasSecondDriver" class="ml-2 text-[15px] font-medium">
                  Add Second Driver
                </label>
              </div>

              <!-- Second Driver Fields -->
              <div v-if="reservation.hasSecondDriver" class="grid gap-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-[15px] mb-1 block font-medium">First Name</label>
                    <input
                      v-model="reservation.secondDriver.firstName"
                      type="text"
                      class="form-field"
                      required
                    />
                  </div>
                  <div>
                    <label class="text-[15px] mb-1 block font-medium">Last Name</label>
                    <input
                      v-model="reservation.secondDriver.lastName"
                      type="text"
                      class="form-field"
                      required
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-[15px] mb-1 block font-medium">License Number</label>
                    <input
                      v-model="reservation.secondDriver.license"
                      type="text"
                      class="form-field"
                      required
                    />
                  </div>
                  <div>
                    <label class="text-[15px] mb-1 block font-medium">License Date</label>
                    <input
                      v-model="reservation.secondDriver.licenseDate"
                      type="date"
                      class="form-field"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label class="text-[15px] mb-1 block font-medium">License City</label>
                  <input
                    v-model="reservation.secondDriver.licenseCity"
                    type="text"
                    class="form-field"
                    required
                  />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-[15px] mb-1 block font-medium">CIN</label>
                    <input
                      v-model="reservation.secondDriver.cin"
                      type="text"
                      class="form-field"
                      required
                    />
                  </div>
                  <div>
                    <label class="text-[15px] mb-1 block font-medium">Phone</label>
                    <input
                      v-model="reservation.secondDriver.phone"
                      type="tel"
                      class="form-field"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm mb-1">Car</label>
              <div class="flex items-center relative">
                <select
                  class="form-field appearance-none"
                  v-model="reservation.carId"
                  @change="handleCarSelect"
                  required
                >
                  <option value="">Select a car</option>
                  <option v-for="car in availableCars" :key="car.licensePlate" :value="car.licensePlate">
                    {{ car.name }} ({{ car.licensePlate }})
                  </option>
                </select>
                <span class="absolute right-3 pointer-events-none">
                  <svg
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
                    ></path>
                  </svg>
                </span>
              </div>
            </div>
            <div v-if="selectedCar" class="grid gap-4 border-t pt-4" :class="mode === 'dark' ? 'border-dark-50' : 'border-gray-200'">
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0 w-[100px] h-[100px]">
                  <img :src="selectedCar.image" :alt="selectedCar.name" class="w-full h-full rounded-lg object-contain">
                </div>
                <div class="flex flex-col">
                  <p class="text-lg font-bold text-primary-100">{{ selectedCar.name }}</p>
                  <p class="text-black dark:text-white">{{ selectedCar.licensePlate }}</p>
                  <div class="flex items-center gap-2 mt-2">
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
                    <p class="text-black dark:text-white">Current: {{ selectedCar.currentMileage }} km</p>
                  </div>
                </div>
              </div>

              <div>
                <label class="text-[15px] mb-1 block font-medium">Current Mileage</label>
                <input
                  v-model="reservation.currentMileage"
                  type="number"
                  class="form-field"
                  placeholder="Enter current mileage"
                  required
                  @input="updateCarMileage"
                />
              </div>

              <div>
                <label class="text-[15px] mb-1 block font-medium">Price per Day</label>
                <input
                  :value="selectedCar ? selectedCar.pricePerDay : ''"
                  type="number"
                  class="form-field bg-gray-50 dark:bg-dark-50"
                />
              </div>

              <div>
                <label class="text-[15px] mb-1 block font-medium">Advance Payment</label>
                <input
                  v-model="reservation.advance"
                  type="number"
                  class="form-field"
                  placeholder="Enter advance amount"
                  required
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[15px] mb-1 block font-medium">Start Date</label>
                  <input
                    v-model="reservation.startDate"
                    type="date"
                    class="form-field"
                    required
                    @change="calculateDays"
                  />
                </div>
                <div>
                  <label class="text-[15px] mb-1 block font-medium">End Date</label>
                  <input
                    v-model="reservation.endDate"
                    type="date"
                    class="form-field"
                    :min="reservation.startDate"
                    required
                    @change="calculateDays"
                  />
                </div>
              </div>

              <div v-if="numberOfDays > 0" class="text-sm text-gray-500">
                <div class="mb-4">
                  <div class="font-medium text-lg">Rental Details</div>
                  <div class="mt-1">Rental period: {{ numberOfDays }} day{{ numberOfDays > 1 ? 's' : '' }}</div>
                  <div class="mt-1">Rented: {{ formatDate(reservation.startDate) }}</div>
                  <div>Return: {{ formatDate(reservation.endDate) }}</div>
                </div>

                <div class="border-t pt-4">
                  <div class="font-medium text-lg mb-2">Payment Details</div>
                  <div class="grid gap-4">
                    <div>
                      <div class="font-medium">Total Price: {{ reservation.pricePerDay * numberOfDays }} MAD</div>
                    </div>
                    <div>
                      <div class="font-medium">Remaining Amount: {{ (reservation.pricePerDay * numberOfDays) - (reservation.advance || 0) }} MAD</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="border-t-4 rounded-bl-xl rounded-br-xl bg-white-100 p-4">
          <div class="flex items-center justify-end">
            <button 
              @click="addReservation" 
              class="button primary-button"
              :disabled="!isFormValid"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import { carStore, clientStore } from "../store";

export default {
  components: {
    RouterLink,
  },
  props: {
    mode: String,
  },
  data() {
    return {
      reservation: {
        clientId: "",
        carId: "",
        currentMileage: "",
        pricePerDay: "",
        startDate: "",
        endDate: "",
        advance: 0,
        hasSecondDriver: false,
        secondDriver: {
          firstName: "",
          lastName: "",
          license: "",
          licenseDate: "",
          licenseCity: "",
          cin: "",
          phone: "",
        },
      },
      selectedCar: null,
      showSuccess: false,
      numberOfDays: 0,
    };
  },
  computed: {
    clients() {
      return clientStore.clients;
    },
    availableCars() {
      return carStore.cars.filter(car => car.status === 'Available');
    },
    isFormValid() {
      const baseValidation = this.selectedCar && 
             this.reservation.currentMileage > 0 && 
             this.reservation.pricePerDay > 0 && 
             this.reservation.startDate && 
             this.reservation.endDate &&
             this.numberOfDays > 0;

      // If second driver is enabled, validate their fields
      if (this.reservation.hasSecondDriver) {
        return baseValidation &&
          this.reservation.secondDriver.firstName &&
          this.reservation.secondDriver.lastName &&
          this.reservation.secondDriver.license &&
          this.reservation.secondDriver.licenseDate &&
          this.reservation.secondDriver.licenseCity &&
          this.reservation.secondDriver.cin &&
          this.reservation.secondDriver.phone;
      }

      return baseValidation;
    }
  },
  methods: {
    getTodayDate() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    },
    calculateDays() {
      if (this.reservation.startDate && this.reservation.endDate) {
        const start = new Date(this.reservation.startDate);
        const end = new Date(this.reservation.endDate);
        const diffTime = Math.abs(end - start);
        this.numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      } else {
        this.numberOfDays = 0;
      }
    },
    handleCarSelect() {
      this.selectedCar = this.availableCars.find(car => car.licensePlate === this.reservation.carId);
      if (this.selectedCar) {
        // Set price per day to car's current price and make it read-only
        this.reservation.pricePerDay = this.selectedCar.pricePerDay;
      }
    },
    addReservation() {
      if (!this.reservation.clientId || !this.reservation.carId) {
        alert('Please select both client and car');
        return;
      }

      const client = clientStore.clients.find(c => c.nationalId === this.reservation.clientId);
      const car = carStore.cars.find(c => c.licensePlate === this.reservation.carId);

      if (car) {
        car.status = 'Rented';
        carStore.saveCars();
      }

      // Format second driver dates if they exist
      let secondDriverInfo = null;
      if (this.reservation.hasSecondDriver) {
        secondDriverInfo = {
          ...this.reservation.secondDriver,
          licenseDate: this.formatDate(this.reservation.secondDriver.licenseDate),
          cin: this.reservation.secondDriver.cin,
          phone: this.reservation.secondDriver.phone
        };
      }

      const totalPrice = this.reservation.pricePerDay * this.numberOfDays;
      const advance = parseInt(this.reservation.advance) || 0;

      const newReservation = {
        ...this.reservation,
        clientName: client ? `${client.firstName} ${client.lastName}` : 'Unknown Client',
        clientPhone: client ? client.phoneNumber : '',
        carName: car ? car.name : 'Unknown Car',
        numberOfDays: this.numberOfDays,
        totalPrice: totalPrice,
        advance: advance,
        remaining: totalPrice - advance,
        status: 'Active',
        // Include second driver info if it exists
        hasSecondDriver: this.reservation.hasSecondDriver,
        secondDriver: secondDriverInfo
      };

      carStore.reservations.push(newReservation);
      carStore.saveReservations();

      this.showSuccess = true;
      setTimeout(() => {
        this.$router.push({ name: 'reservations' });
      }, 1500);
    },
    resetForm() {
      this.reservation = {
        clientId: "",
        carId: "",
        currentMileage: "",
        pricePerDay: "",
        startDate: "",
        endDate: "",
        advance: 0,
        hasSecondDriver: false,
        secondDriver: {
          firstName: "",
          lastName: "",
          license: "",
          licenseDate: "",
          licenseCity: "",
          cin: "",
          phone: "",
        },
      };
      this.selectedCar = null;
      this.numberOfDays = 0;
    },
    updateCarMileage() {
      if (this.selectedCar && this.reservation.currentMileage) {
        // Update the selected car's current mileage
        this.selectedCar.currentMileage = parseInt(this.reservation.currentMileage);
        
        // Update the car in the store
        const carIndex = carStore.cars.findIndex(car => car.licensePlate === this.selectedCar.licensePlate);
        if (carIndex !== -1) {
          carStore.cars[carIndex].currentMileage = parseInt(this.reservation.currentMileage);
          carStore.saveCars();
        }
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
    hasActiveReservation(clientId) {
      return carStore.reservations.some(reservation => 
        reservation.clientId === clientId && reservation.status === 'Active'
      );
    },
  },
};
</script>

