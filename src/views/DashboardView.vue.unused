<script>
import AppCard from "../components/AppCard.vue";
import TopBar from "../components/TopBar.vue";
import VueApexCharts from "vue3-apexcharts";
import { useUserStore } from "../stores/userStore";
import { useCarStore } from "../stores/carStore";
import { useClientStore } from "../stores/clientStore";
import { useAlertStore } from "../stores/alertStore";

export default {
  name: 'DashboardView',
  components: {
    AppCard,
    TopBar,
    apexchart: VueApexCharts,
  },
  props: {
    mode: String,
  },
  setup() {
    const userStore = useUserStore();
    const carStore = useCarStore();
    const clientStore = useClientStore();
    const alertStore = useAlertStore();

    return {
      userStore,
      carStore,
      clientStore,
      alertStore
    };
  },
  data() {
    return {
      mode: localStorage.getItem("mode") || "light",
      chartOptions: {
        chart: {
          id: "vuechart-example",
          toolbar: {
            show: false,
          },
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          categories: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ],
        },
        yaxis: {
          title: {
            text: "Earnings (د.م.)"
          }
        },
        tooltip: {
          y: {
            formatter: function(value) {
              return value + " د.م.";
            }
          }
        }
      },
      series: [],
    };
  },
  computed: {
    totalReservations() {
      return this.carStore.filteredReservations.length;
    },
    totalClients() {
      return this.clientStore.filteredClients.length;
    },
    totalCars() {
      return this.carStore.filteredCars.length;
    },
    totalAgents() {
      // Only show agents for admin users
      if (!this.userStore.isAdmin) return 0;
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users.filter(user => user.role === 'agent').length;
    },
    totalAgencies() {
      // Only show agencies for admin users
      if (!this.userStore.isAdmin) return 0;
      const agencies = JSON.parse(localStorage.getItem('agencies') || '[]');
      return agencies.length;
    },
    totalAlerts() {
      return this.alertStore.totalAlerts;
    },
    alerts() {
      return this.alertStore.filteredAlerts;
    }
  },
  mounted() {
    this.alertStore.initialize();
    this.calculateCarEarnings();
  },
  methods: {
    calculateCarEarnings() {
      try {
        const cars = this.carStore.filteredCars;
        const reservations = this.carStore.filteredReservations;
        
        console.log('Cars:', cars);
        console.log('Reservations:', reservations);

        if (!cars.length) {
          console.log('No cars found');
          this.series = [{
            name: 'No Data',
            data: Array(12).fill(0)
          }];
          return;
        }

        // Initialize monthly earnings for each car
        const monthlyEarnings = {};
        cars.forEach(car => {
          if (car && car.licensePlate) {
            monthlyEarnings[car.licensePlate] = Array(12).fill(0);
          }
        });

        // Calculate earnings for each reservation
        reservations.forEach(reservation => {
          if (!reservation || !reservation.startDate || !reservation.endDate || !reservation.carId) {
            console.log('Invalid reservation:', reservation);
            return;
          }

          const startDate = new Date(reservation.startDate);
          const endDate = new Date(reservation.endDate);
          const month = startDate.getMonth();
          const carId = reservation.carId;
          
          // Calculate number of days
          const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          
          // Find the car's daily rate
          const car = cars.find(c => c && c.licensePlate === carId);
          if (car && car.pricePerDay) {
            const earnings = days * car.pricePerDay;
            if (monthlyEarnings[carId]) {
              monthlyEarnings[carId][month] += earnings;
            }
          }
        });

        // Convert to series format for the chart
        const seriesData = cars
          .filter(car => car && car.licensePlate && car.name)
          .map(car => ({
            name: `${car.name}${car.model ? ' ' + car.model : ''}`,
            data: monthlyEarnings[car.licensePlate] || Array(12).fill(0)
          }));

        console.log('Series Data:', seriesData);

        if (seriesData.length === 0) {
          this.series = [{
            name: 'No Data',
            data: Array(12).fill(0)
          }];
        } else {
          this.series = seriesData;
        }
      } catch (error) {
        console.error('Error calculating car earnings:', error);
        this.series = [{
          name: 'Error',
          data: Array(12).fill(0)
        }];
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="p-5">
      <div class="grid gap-5">
        <div class="grid grid-cols-6 gap-5">
          <!-- Reservations -->
          <div class="rounded-xl shadow-card overflow-hidden bg-white dark:bg-dark-70 p-6 flex items-center justify-center flex-col">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-[45px] h-[45px]" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" class="fill-indigo-50"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path class="fill-indigo-200" d="M8 14h8v4H8z"></path>
              </svg>
            </span>
            <span class="text-lg font-semibold block my-2 dark:text-white">Reservations</span>
            <span class="text-4xl font-bold dark:text-white">{{ totalReservations }}</span>
          </div>

          <!-- Clients -->
          <div class="rounded-xl shadow-card overflow-hidden bg-white dark:bg-dark-70 p-6 flex items-center justify-center flex-col">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-[45px] h-[45px]" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" class="fill-emerald-50"></path>
                <circle cx="9" cy="7" r="4" class="fill-emerald-100"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" class="fill-emerald-50"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" class="fill-emerald-100"></path>
              </svg>
            </span>
            <span class="text-lg font-semibold block my-2 dark:text-white">Clients</span>
            <span class="text-4xl font-bold dark:text-white">{{ totalClients }}</span>
          </div>

          <!-- Agents -->
          <div class="rounded-xl shadow-card overflow-hidden bg-white dark:bg-dark-70 p-6 flex items-center justify-center flex-col">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-[45px] h-[45px]" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" class="fill-red-50"></path>
                <circle cx="12" cy="7" r="4" class="fill-red-100"></circle>
                <path class="fill-red-200" d="M12 11l4 4H8l4-4z"></path>
              </svg>
            </span>
            <span class="text-lg font-semibold block my-2 dark:text-white">Agents</span>
            <span class="text-4xl font-bold dark:text-white">{{ totalAgents }}</span>
          </div>

          <!-- Cars -->
          <div class="rounded-xl shadow-card overflow-hidden bg-white dark:bg-dark-70 p-6 flex items-center justify-center flex-col">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-[45px] h-[45px]" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.8a1 1 0 0 0-.8.4L2.3 11l-5.16.86a1 1 0 0 0-.84.99V16h3" class="fill-amber-50"></path>
                <circle cx="6.5" cy="16.5" r="2.5" class="fill-amber-100"></circle>
                <circle cx="16.5" cy="16.5" r="2.5" class="fill-amber-100"></circle>
              </svg>
            </span>
            <span class="text-lg font-semibold block my-2 dark:text-white">Cars</span>
            <span class="text-4xl font-bold dark:text-white">{{ totalCars }}</span>
          </div>

          <!-- Agencies -->
          <div class="rounded-xl shadow-card overflow-hidden bg-white dark:bg-dark-70 p-6 flex items-center justify-center flex-col">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-[45px] h-[45px]" viewBox="0 0 24 24" fill="none" stroke="#0891B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" class="fill-cyan-50"></path>
                <polyline points="9 22 9 12 15 12 15 22" class="fill-cyan-100"></polyline>
              </svg>
            </span>
            <span class="text-lg font-semibold block my-2 dark:text-white">Agencies</span>
            <span class="text-4xl font-bold dark:text-white">{{ totalAgencies }}</span>
          </div>

          <!-- Alerts -->
          <div class="rounded-xl shadow-card overflow-hidden bg-white dark:bg-dark-70 p-6 flex items-center justify-center flex-col">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-[45px] h-[45px]" viewBox="0 0 24 24" fill="none" stroke="#BE185D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" class="fill-pink-50"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" class="fill-pink-100"></path>
                <circle cx="12" cy="8" r="1" class="fill-pink-200"></circle>
              </svg>
            </span>
            <span class="text-lg font-semibold block my-2 dark:text-white">Alerts</span>
            <span class="text-4xl font-bold dark:text-white">{{ totalAlerts }}</span>
          </div>
        </div>

        <!-- Earnings Chart -->
        <div class="rounded-xl shadow-card overflow-hidden bg-white">
          <div class="p-4 border-b flex items-center justify-between xs:flex-col xs:items-start xs:gap-2"
               :class="mode === 'dark' ? 'border-dark-50' : ''">
            <span class="text-lg font-bold leading-none">Earnings</span>
          </div>
          <div>
            <apexchart type="line" height="500" :options="chartOptions" :series="series"></apexchart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>