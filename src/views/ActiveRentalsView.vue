<template>
  <div>
    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-dark-70 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">Confirm Early Return</h3>
        <p class="mb-4">This car is scheduled to return on {{ formatDate(selectedReservation?.endDate) }}. Do you want to update the return date to today and make it available?</p>
        <div class="flex justify-end gap-4">
          <button 
            @click="showConfirmationModal = false" 
            class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-dark-50 hover:bg-gray-300 dark:hover:bg-dark-60"
          >
            Cancel
          </button>
          <button 
            @click="confirmMakeCarAvailable" 
            class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>

    <div class="p-4">
      <div
        class="rounded-xl shadow-card overflow-hidden"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white-100'"
      >
        <div
          class="px-4 py-2.5 border-b flex items-center justify-between"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <span class="text-lg font-bold leading-none">Active Rentals</span>
          <div class="flex items-center gap-2">
            <div class="w-[500px]">
              <div class="relative flex items-center">
                <input
                  type="search"
                  class="form-field pl-10"
                  placeholder="Search for a client by name or ID"
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
          </div>
        </div>
        <div class="w-full overflow-x-auto without-scrollbar">
          <table class="w-full form-table">
            <thead
              class="border-b-2"
              :class="mode === 'dark' ? 'border-dark-50' : ''"
            >
              <tr :class="mode === 'dark' ? 'bg-dark-1' : 'bg-gray-1'">
                <th class="p-4 text-left">Client</th>
                <th class="p-4 text-left">Rented Car</th>
                <th class="p-4 text-left">Rental Period</th>
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
              <tr v-for="(reservation, index) in filteredActiveReservations" :key="index" 
                class="hover:bg-gray-50 dark:hover:bg-dark-60 transition-colors"
                :class="{
                  'bg-red-50': isEndDateToday(reservation.endDate),
                  'bg-red-100': isEndDatePast(reservation.endDate)
                }"
              >
                <td class="p-4">
                  <div class="flex flex-col">
                    <span class="text-lg font-bold text-primary-100">{{ getClientName(reservation.clientId) }}</span>
                    <div class="flex flex-col mt-1">
                      <span class="text-sm text-black dark:text-white">ID: {{ reservation.clientId }}</span>
                      <span class="text-sm text-black dark:text-white">Phone: {{ getClientPhone(reservation.clientId) }}</span>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-[100px] h-[100px] mr-4">
                      <img
                        class="w-full h-full rounded-lg object-contain"
                        :src="getCarImage(reservation.carId)"
                        alt="Car Image"
                      />
                    </div>
                    <div class="flex flex-col">
                      <p class="text-lg font-bold text-primary-100 mb-2">
                        {{ reservation.carName }}
                      </p>
                      <div class="flex items-center gap-2 text-black dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1zM3 8a1 1 0 00-1.447.894l-2 1A1 1 0 000 10v4a1 1 0 001.447.894l2-1A1 1 0 003 13V8z" />
                        </svg>
                        <p class="text-sm">{{ reservation.carId }}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                      </svg>
                      <span class="text-sm font-medium text-black dark:text-white">Rented: {{ formatDate(reservation.startDate) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                      </svg>
                      <span 
                        class="text-sm font-medium"
                        :class="{
                          'text-red-500': isEndDateToday(reservation.endDate),
                          'text-red-700 bg-red-100 px-2 py-1 rounded': isEndDatePast(reservation.endDate)
                        }"
                      >
                        Return: {{ formatDate(reservation.endDate) }}
                        <span v-if="isEndDatePast(reservation.endDate)" class="ml-2">(Overdue)</span>
                      </span>
                      <a 
                        v-if="isEndDateToday(reservation.endDate) || isEndDatePast(reservation.endDate)"
                        :href="'tel:' + getClientPhone(reservation.clientId)"
                        class="ml-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
                        title="Call Client"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <button
                      @click="makeCarAvailable(index)"
                      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
                      title="Make Car Available"
                      v-if="reservation.status === 'Active'"
                    >
                      <img 
                        src="https://cdn-icons-png.flaticon.com/128/7867/7867059.png" 
                        alt="Make Available" 
                        class="w-5 h-5"
                      />
                    </button>
                  </div>
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
import { clientStore } from "../store";

export default {
  props: {
    mode: String,
  },
  data() {
    return {
      searchQuery: '',
      reservations: [],
      clients: [],
      cars: [],
      showConfirmationModal: false,
      selectedReservationIndex: null,
      selectedReservation: null
    };
  },
  computed: {
    activeReservations() {
      return this.reservations.filter(reservation => reservation.status === 'Active');
    },
    filteredActiveReservations() {
      if (!this.searchQuery) return this.activeReservations;
      const query = this.searchQuery.toLowerCase();
      return this.activeReservations.filter(reservation => {
        const client = this.clients.find(c => c.nationalId === reservation.clientId);
        if (!client) return false;
        return (
          client.firstName.toLowerCase().includes(query) ||
          client.lastName.toLowerCase().includes(query) ||
          client.nationalId.toLowerCase().includes(query)
        );
      });
    }
  },
  created() {
    this.loadReservations();
    this.loadClients();
    this.loadCars();
  },
  methods: {
    loadReservations() {
      try {
        const savedReservations = localStorage.getItem('reservations');
        if (savedReservations) {
          this.reservations = JSON.parse(savedReservations);
        }
      } catch (error) {
        console.error('Error loading reservations:', error);
      }
    },
    loadClients() {
      try {
        const savedClients = localStorage.getItem('clients');
        if (savedClients) {
          this.clients = JSON.parse(savedClients);
        }
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    },
    loadCars() {
      try {
        const savedCars = localStorage.getItem('cars');
        if (savedCars) {
          this.cars = JSON.parse(savedCars);
        }
      } catch (error) {
        console.error('Error loading cars:', error);
      }
    },
    getClientName(clientId) {
      const client = this.clients.find(c => c.nationalId === clientId);
      return client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
    },
    getClientPhone(clientId) {
      const client = this.clients.find(c => c.nationalId === clientId);
      return client ? client.phoneNumber : 'Unknown Phone';
    },
    getCarImage(carId) {
      const car = this.cars.find(c => c.licensePlate === carId);
      return car ? car.image : '';
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
    isEndDateToday(endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      return today.getTime() === end.getTime();
    },
    isEndDatePast(endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      return today.getTime() > end.getTime();
    },
    needsToReturnCarToday(clientId) {
      const today = new Date().toDateString();
      return this.reservations.some(reservation => 
        reservation.clientId === clientId && 
        reservation.status === 'Active' &&
        new Date(reservation.endDate).toDateString() === today
      );
    },
    makeCarAvailable(index) {
      const reservation = this.filteredActiveReservations[index];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const returnDate = new Date(reservation.endDate);
      returnDate.setHours(0, 0, 0, 0);
      
      // Only show confirmation modal if return date is in the future
      if (returnDate > today) {
        this.selectedReservationIndex = index;
        this.selectedReservation = reservation;
        this.showConfirmationModal = true;
      } else {
        this.processCarReturn(reservation);
      }
    },
    confirmMakeCarAvailable() {
      if (this.selectedReservation) {
        this.processCarReturn(this.selectedReservation);
        this.showConfirmationModal = false;
        this.selectedReservationIndex = null;
        this.selectedReservation = null;
      }
    },
    processCarReturn(reservation) {
      const car = this.cars.find(c => c.licensePlate === reservation.carId);
      
      if (car) {
        // Update car status to Available
        car.status = 'Available';
        
        // Update the reservation with today's date and Archived status
        const today = new Date().toISOString().split('T')[0];
        const startDate = new Date(reservation.startDate);
        const endDate = new Date(today);
        const timeDiff = endDate.getTime() - startDate.getTime();
        const numberOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
        
        // Find the highest existing ID and increment it
        const archivedReservations = this.reservations.filter(r => r.status === 'Archived');
        const maxId = archivedReservations.reduce((max, r) => Math.max(max, r.id || 0), 0);
        const nextId = maxId + 1;
        
        const updatedReservations = this.reservations.map(r => {
          if (r.clientId === reservation.clientId && 
              r.carId === reservation.carId &&
              r.startDate === reservation.startDate) {
            return { 
              ...r, 
              status: 'Archived',
              endDate: today,
              numberOfDays: numberOfDays,
              totalPrice: numberOfDays * r.pricePerDay,
              id: nextId,
              updatedAt: new Date().toISOString(),
              archivedAt: new Date().toISOString()
            };
          }
          return r;
        });
        
        // Save changes to localStorage
        this.reservations = updatedReservations;
        localStorage.setItem('cars', JSON.stringify(this.cars));
        localStorage.setItem('reservations', JSON.stringify(updatedReservations));
        
        // Force reload of data
        this.loadCars();
        this.loadReservations();
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('reservation-updated', {
          detail: {
            type: 'car-returned',
            reservation: updatedReservations.find(r => 
              r.clientId === reservation.clientId && 
              r.carId === reservation.carId &&
              r.startDate === reservation.startDate
            )
          }
        }));
        
        // Show success message
        this.$toast.success('Car has been made available and reservation archived successfully');
        
        // Close the confirmation modal
        this.showConfirmationModal = false;
        this.selectedReservationIndex = null;
        this.selectedReservation = null;
      }
    }
  }
};
</script> 