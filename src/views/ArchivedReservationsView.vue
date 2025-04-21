<template>
  <div>
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div class="bg-white dark:bg-dark-70 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Delete Archived Reservation</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-2">Are you sure you want to delete this archived reservation?</p>
        <p class="text-gray-600 dark:text-gray-300 mb-2">Client: <span class="font-bold">{{ getClientName(reservationToDelete?.clientId) }}</span></p>
        <p class="text-gray-600 dark:text-gray-300 mb-2">Car: <span class="font-bold">{{ reservationToDelete?.carName }}</span></p>
        <p class="text-gray-600 dark:text-gray-300 mb-6">This action cannot be undone.</p>
        <div class="flex justify-end gap-4">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-50 hover:bg-gray-200 dark:hover:bg-dark-60 transition-colors"
          >
            No, Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>

    <div class="p-4">
      <div
        class="rounded-xl shadow-card overflow-hidden"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white'"
      >
        <div
          class="px-4 py-2.5 border-b flex items-center justify-between"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <div class="flex items-center gap-4">
            <span class="text-lg font-bold leading-none">Archived Reservations</span>
          </div>
          <div class="flex items-center gap-4">
            <!-- Date Range Filter -->
            <div class="flex items-center gap-2">
              <input
                type="date"
                v-model="startDate"
                class="form-field"
                :max="endDate"
              />
              <span>to</span>
              <input
                type="date"
                v-model="endDate"
                class="form-field"
                :min="startDate"
              />
            </div>
            <!-- Search -->
            <div class="w-[500px]">
              <div class="relative flex items-center">
                <input
                  type="search"
                  class="form-field pl-10"
                  placeholder="Search for a reservation by client name or car name"
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
                <th class="py-4 cursor-pointer" @click="sortBy('displayId')">
                  ID
                  <span v-if="sortField === 'displayId'" class="ml-1">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th class="py-4 cursor-pointer" @click="sortBy('clientName')">
                  Client
                  <span v-if="sortField === 'clientName'" class="ml-1">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th class="py-4 cursor-pointer" @click="sortBy('carName')">
                  Car
                  <span v-if="sortField === 'carName'" class="ml-1">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th class="py-4 cursor-pointer" @click="sortBy('startDate')">
                  Rental Period
                  <span v-if="sortField === 'startDate'" class="ml-1">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th class="py-4 cursor-pointer" @click="sortBy('numberOfDays')">
                  Number of Days
                  <span v-if="sortField === 'numberOfDays'" class="ml-1">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th class="py-4 cursor-pointer" @click="sortBy('pricePerDay')">
                  Price/Day
                  <span v-if="sortField === 'pricePerDay'" class="ml-1">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th class="py-4 cursor-pointer" @click="sortBy('totalPrice')">
                  Total Price
                  <span v-if="sortField === 'totalPrice'" class="ml-1">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th class="py-4">Status</th>
                <th class="py-4">Actions</th>
              </tr>
            </thead>
            <tbody
              class="divide-y bg-opacity-40"
              :class="
                mode === 'dark'
                  ? 'bg-dark-70 divide-dark-50'
                  : 'bg-white divide-gray-100'
              "
            >
              <tr v-for="(reservation, index) in sortedAndFilteredReservations" :key="index" class="hover:bg-gray-50 dark:hover:bg-dark-60 transition-colors">
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-black dark:text-white">#{{ reservation.displayId }}</span>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex flex-col">
                    <span class="text-lg font-bold text-primary-100">{{ getClientName(reservation.clientId) }}</span>
                    <div class="flex flex-col mt-1">
                      <span class="text-sm text-black dark:text-white">Phone: {{ getClientPhone(reservation.clientId) }}</span>
                    </div>
                  </div>
                </td>
                <td class="p-2">
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
                      <div class="flex flex-col gap-1">
                        <div class="flex items-center gap-2 text-black dark:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1zM3 8a1 1 0 00-1.447.894l-2 1A1 1 0 000 10v4a1 1 0 001.447.894l2-1A1 1 0 003 13V8z" />
                          </svg>
                          <p class="text-sm">{{ reservation.carId }}</p>
                        </div>
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
                          <p class="text-sm">{{ reservation.currentMileage }} km</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2 text-black dark:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1zM3 8a1 1 0 00-1.447.894l-2 1A1 1 0 000 10v4a1 1 0 001.447.894l2-1A1 1 0 003 13V8z" />
                      </svg>
                      <p class="text-sm">Rented: {{ formatDate(reservation.startDate) }}</p>
                    </div>
                    <div class="flex items-center gap-2 text-black dark:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1zM3 8a1 1 0 00-1.447.894l-2 1A1 1 0 000 10v4a1 1 0 001.447.894l2-1A1 1 0 003 13V8z" />
                      </svg>
                      <p class="text-sm">Return: {{ formatDate(reservation.endDate) }}</p>
                    </div>
                    <div class="flex items-center gap-2 text-black dark:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                      </svg>
                      <p class="text-sm">Archived: {{ formatDate(reservation.archivedAt) }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-black dark:text-white">{{ reservation.numberOfDays }} days</span>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-black dark:text-white">{{ reservation.pricePerDay }} MAD</span>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-black dark:text-white">{{ reservation.totalPrice }} MAD</span>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span
                      class="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      Archived
                    </span>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <button
                      @click="deleteReservation(index)"
                      class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                      title="Delete Reservation"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 text-red-500"
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
  </div>
</template>

<script>
import { sortByIdDesc } from '../utils/idGenerator';

export default {
  name: "ArchivedReservationsView",
  data() {
    return {
      searchQuery: "",
      cars: [],
      clients: [],
      reservations: [],
      showDeleteModal: false,
      reservationToDelete: null,
      startDate: "",
      endDate: "",
      sortField: "displayId",
      sortOrder: "desc"
    };
  },
  computed: {
    mode() {
      return 'light'; // Default to light mode
    },
    filteredArchivedReservations() {
      let archivedReservations = this.reservations.filter(r => r.status === 'Archived');
      
      // Apply date range filter
      if (this.startDate && this.endDate) {
        archivedReservations = archivedReservations.filter(reservation => {
          const reservationDate = new Date(reservation.startDate);
          const start = new Date(this.startDate);
          const end = new Date(this.endDate);
          return reservationDate >= start && reservationDate <= end;
        });
      }
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        archivedReservations = archivedReservations.filter(reservation => {
          const client = this.clients.find(c => c.nationalId === reservation.clientId);
          const clientName = client ? `${client.firstName} ${client.lastName}`.toLowerCase() : '';
          const car = this.cars.find(c => c.licensePlate === reservation.carId);
          const carName = car ? car.name.toLowerCase() : '';
          
          return clientName.includes(query) || carName.includes(query);
        });
      }
      
      return archivedReservations;
    },
    sortedAndFilteredReservations() {
      const reservations = [...this.filteredArchivedReservations];
      
      return reservations.sort((a, b) => {
        let aValue = a[this.sortField];
        let bValue = b[this.sortField];
        
        // Special handling for client name and car name
        if (this.sortField === 'clientName') {
          const clientA = this.clients.find(c => c.nationalId === a.clientId);
          const clientB = this.clients.find(c => c.nationalId === b.clientId);
          aValue = clientA ? `${clientA.firstName} ${clientA.lastName}` : '';
          bValue = clientB ? `${clientB.firstName} ${clientB.lastName}` : '';
        } else if (this.sortField === 'carName') {
          const carA = this.cars.find(c => c.licensePlate === a.carId);
          const carB = this.cars.find(c => c.licensePlate === b.carId);
          aValue = carA ? carA.name : '';
          bValue = carB ? carB.name : '';
        }
        
        if (this.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
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
    deleteReservation(index) {
      const reservation = this.filteredArchivedReservations[index];
      this.reservationToDelete = reservation.id;
      this.showDeleteModal = true;
    },
    confirmDelete() {
      if (this.reservationToDelete !== null) {
        // Find the index in the original reservations array
        const index = this.reservations.findIndex(r => r.id === this.reservationToDelete);
        if (index !== -1) {
          this.reservations.splice(index, 1);
          localStorage.setItem('reservations', JSON.stringify(this.reservations));
        }
        this.showDeleteModal = false;
        this.reservationToDelete = null;
      }
    },
    sortBy(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortOrder = 'asc';
      }
    }
  },
  created() {
    this.loadReservations();
    this.loadClients();
    this.loadCars();
  }
};
</script> 