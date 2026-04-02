<template>
  <div class="relative">
    <button
      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
      @click="showNotifications = !showNotifications"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-primary-100"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
        />
      </svg>
      <span
        v-if="todayReturnCars.length > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
      >
        {{ todayReturnCars.length }}
      </span>
    </button>
    <!-- Notifications Dropdown -->
    <div
      v-if="showNotifications"
      class="absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50"
      :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white'"
    >
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2 text-white-100">Today's Returns</h3>
        <div v-if="todayReturnCars.length === 0" class="text-gray-500 dark:text-gray-400 text-white-100">
          No cars need to be returned today
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="reservation in todayReturnCars"
            :key="reservation.carId"
            class="p-3 rounded-lg border"
            :class="mode === 'dark' ? 'border-dark-50' : 'border-gray-200'"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="font-semibold text-primary-100">
                  {{ reservation.carName }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 text-white-100">
                  Needs to be returned today
                </p>
                <div class="mt-2">
                  <p class="text-sm text-white-100">
                    <span class="font-medium">Client:</span> {{ reservation.clientName }}
                  </p>
                  <p class="text-sm text-white-100">
                    <span class="font-medium">Phone:</span> {{ reservation.clientPhone }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2">
                <RouterLink
                  :to="{ name: 'clients' }"
                  class="text-sm text-blue-500 hover:underline text-white-100"
                  @click="showNotifications = false"
                >
                  View Client Info
                </RouterLink>
                <button
                  @click="makeCarAvailable(reservation)"
                  class="text-sm text-green-500 hover:underline text-white-100"
                >
                  Mark as Returned
                </button>
              </div>
            </div>
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
  name: 'Notifications',
  components: {
    RouterLink
  },
  props: {
    mode: String,
  },
  data() {
    return {
      showNotifications: false,
    };
  },
  computed: {
    todayReturnCars() {
      const today = new Date().toISOString().split('T')[0];
      return carStore.reservations.filter(reservation => {
        return reservation.endDate && reservation.endDate.split('T')[0] === today;
      });
    }
  },
  methods: {
    getClientPhone(clientId) {
      const client = clientStore.clients.find(c => c.nationalId === clientId);
      return client ? client.phone : 'N/A';
    },
    makeCarAvailable(reservation) {
      const car = carStore.cars.find(c => c.licensePlate === reservation.carId);
      
      if (car) {
        car.status = 'Available';
        carStore.saveCars();
        
        // Create completed reservation
        const completedReservation = {
          ...reservation,
          status: 'Completed',
          completedAt: new Date().toISOString()
        };
        
        // Remove from active reservations and add to completed
        const index = carStore.reservations.indexOf(reservation);
        if (index > -1) {
          carStore.reservations.splice(index, 1);
          carStore.completedReservations.push(completedReservation);
          carStore.saveReservations();
          carStore.saveCompletedReservations();
        }
      }
    }
  }
};
</script> 