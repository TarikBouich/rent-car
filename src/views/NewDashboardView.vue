<script>
import VueApexCharts from "vue3-apexcharts";
import { useUserStore } from "../stores/userStore";
import { useCarStore } from "../stores/carStore";
import { useClientStore } from "../stores/clientStore";
import { useAlertStore } from "../stores/alertStore";

export default {
  name: 'NewDashboardView',
  components: {
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
      chartOptions: {
        chart: {
          id: "revenue-chart",
          toolbar: { show: false },
          fontFamily: 'Inter, sans-serif',
          background: 'transparent'
        },
        colors: ['#fa5b0f'],

        theme: {
          mode: 'dark'
        },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
          categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
          labels: { style: { colors: '#6B7280' } },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: {
          labels: { 
            style: { colors: '#6B7280' },
            formatter: (val) => val.toLocaleString() + ' DH'
          }
        },
        grid: { borderColor: '#374151', strokeDashArray: 4, yaxis: { lines: { show: true } }, xaxis: { lines: { show: false } } },
        tooltip: {
          y: { formatter: (val) => val.toLocaleString() + ' DH' }
        }
      },
      series: [
        { name: 'Revenus', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
      ],
      // Notes state
      notes: [],
      newNote: ''
    };
  },
  computed: {
    totalCars() {
      return this.carStore.filteredCars.length;
    },
    activeRentals() {
      return this.carStore.filteredReservations.filter(r => r.status === 'Active' || r.status === 'En cours').length;
    },
    newClients() {
      return this.clientStore.filteredClients.length;
    },
    monthlyRevenue() {
      // Calculate revenue from current month reservations
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const reservations = this.carStore.filteredReservations;
      
      return reservations
        .filter(res => {
          if (!res.startDate) return false;
          const startDate = new Date(res.startDate);
          return startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear;
        })
        .reduce((total, res) => {
          const car = this.carStore.filteredCars.find(c => c.id === res.carId);
          if (car && car.pricePerDay) {
            const days = res.duration || 1;
            return total + (days * car.pricePerDay);
          }
          return total;
        }, 0);
    },
    voituresAlerts() {
      const userStore = this.userStore;
      return userStore.filterByAgency(this.alertStore.alerts).filter(alert => alert.category === 'voitures');
    },
    locationsAlerts() {
      const activeRentals = this.carStore.filteredReservations.filter(r => r.status === 'Active' || r.status === 'En cours');
      const alerts = [];
      
      activeRentals.forEach(reservation => {
        if (!reservation.endDate) return;
        
        if (this.isEndDatePast(reservation.endDate)) {
          alerts.push({
            id: 'past_' + reservation.id,
            type: 'En retard',
            urgent: true,
            reservation: reservation,
            message: `Le retour était prévu le ${this.formatDateOnly(reservation.endDate)}`
          });
        } else if (this.isEndDateToday(reservation.endDate)) {
          alerts.push({
            id: 'today_' + reservation.id,
            type: 'Retour aujourd\'hui',
            urgent: false,
            reservation: reservation,
            message: `Le retour est prévu pour aujourd'hui`
          });
        }
      });
      
      return alerts;
    }
  },
  mounted() {
    this.loadNotes();
    this.alertStore.initialize();
    this.calculateRevenue();
  },
  methods: {
    calculateRevenue() {
      try {
        const cars = this.carStore.filteredCars;
        const reservations = this.carStore.filteredReservations;
        
        if (!cars.length) return;

        const monthlyRevenue = Array(12).fill(0);

        reservations.forEach(reservation => {
          if (!reservation || !reservation.startDate || !reservation.carId) return;

          const startDate = new Date(reservation.startDate);
          const month = startDate.getMonth();
          const car = cars.find(c => c.id === reservation.carId);
          
          if (car && car.pricePerDay) {
            const days = reservation.duration || 1;
            monthlyRevenue[month] += days * car.pricePerDay;
          }
        });

        this.series = [{ name: 'Revenus', data: monthlyRevenue }];
      } catch (error) {
        console.error('Error calculating revenue:', error);
      }
    },

    // Notes methods
    loadNotes() {
      try {
        const saved = localStorage.getItem('dashboardNotes');
        if (saved) {
          this.notes = JSON.parse(saved);
        }
      } catch (e) {
        console.error('Error loading notes:', e);
        this.notes = [];
      }
    },

    saveNotes() {
      try {
        localStorage.setItem('dashboardNotes', JSON.stringify(this.notes));
      } catch (e) {
        console.error('Error saving notes:', e);
      }
    },

    addNote() {
      if (!this.newNote.trim()) return;
      
      const note = {
        id: Date.now().toString(),
        author: this.userStore.currentUser?.name || 'Utilisateur',
        agency: this.userStore.currentAgency?.name || 'Agence inconnue',
        content: this.newNote.trim(),
        timestamp: new Date().toISOString()
      };
      
      this.notes.unshift(note);
      this.newNote = '';
      this.saveNotes();
    },

    deleteNote(id) {
      this.notes = this.notes.filter(note => note.id !== id);
      this.saveNotes();
    },

    clearAllNotes() {
      if (confirm('Supprimer toutes les notes ? Cette action est irréversible.')) {
        this.notes = [];
        this.saveNotes();
      }
    },

    dismissAlert(alertId) {
      // Simple dismiss: remove from store alerts (could persist dismissed alerts)
      this.alertStore.alerts = this.alertStore.alerts.filter(a => a.id !== alertId);
    },

    formatDate(isoString) {
      return new Date(isoString).toLocaleString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    isEndDateToday(endDate) {
      if (!endDate) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      return today.getTime() === end.getTime();
    },
    isEndDatePast(endDate) {
      if (!endDate) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      return today.getTime() > end.getTime();
    },
    formatDateOnly(date) {
      if (!date) return '';
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }
};
</script>

<template>
  <div>
    <!-- Page Title -->
    <div class="mb-6 flex justify-between items-end">
      <div>
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-[#fa5b0f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Dernière mise à jour: 25/01/2026 15:19 (UTC +0)</p>
      </div>
      <div>
        <button class="p-2 text-[#fa5b0f] hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.26l5.08-5.08" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- New Clients -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 relative overflow-hidden border-l-[4px] border-l-[#fa5b0f]">
        <div class="flex flex-col gap-4">
          <div class="flex items-start justify-between">
            <div class="w-12 h-12 rounded-full bg-[#fa5b0f] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span class="px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/50 rounded-full border border-gray-300 dark:border-gray-700">Ce mois</span>
          </div>
          <div>
            <p class="text-3xl font-bold text-[#fa5b0f]">{{ newClients }}</p>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Nouveaux clients</p>
          </div>
        </div>
      </div>

      <!-- Active Rentals -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 relative overflow-hidden border-l-[4px] border-l-[#10B981]">
        <div class="flex flex-col gap-4">
          <div class="flex items-start justify-between">
            <div class="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.8a1 1 0 0 0-.8.4L2.3 11l-5.16.86A1 1 0 0 0 .84 12.99V16h3" />
                <circle cx="6.5" cy="16.5" r="2.5" />
                <circle cx="16.5" cy="16.5" r="2.5" />
              </svg>
            </div>
            <span class="px-2.5 py-1 text-xs font-medium text-[#10B981] bg-emerald-900/20 rounded-full border border-emerald-800/30">Ce mois</span>
          </div>
          <div>
            <p class="text-3xl font-bold text-[#10B981]">{{ activeRentals }}</p>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Locations</p>
          </div>
        </div>
      </div>

      <!-- Reservations -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 relative overflow-hidden border-l-[4px] border-l-[#3B82F6]">
        <div class="flex flex-col gap-4">
          <div class="flex items-start justify-between">
            <div class="w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span class="px-2.5 py-1 text-xs font-medium text-[#3B82F6] bg-blue-900/20 rounded-full border border-blue-800/30">Ce mois</span>
          </div>
          <div>
            <p class="text-3xl font-bold text-[#3B82F6]">0</p>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Réservations</p>
          </div>
        </div>
      </div>

      <!-- Revenue/Expenses -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 relative overflow-hidden border-l-[4px] border-l-[#10B981]">
        <div class="flex flex-col gap-4">
          <div class="flex items-start justify-between">
            <div class="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span class="px-2.5 py-1 text-xs font-medium text-[#10B981] bg-emerald-900/20 rounded-full border border-emerald-800/30">Ce mois</span>
          </div>
          <div class="flex justify-between items-end">
            <div>
              <p class="text-lg font-bold text-[#10B981]">******</p>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Revenus</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-red-500">******</p>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Dépenses</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lower Alerts & Notes -->
    <div class="mb-6 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#fa5b0f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <h2 class="text-lg font-bold text-gray-900 dark:text-white">Alertes & Notes</h2>
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500 dark:text-gray-400 ml-auto cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </div>

    <!-- Alerts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- Alertes Voitures -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 min-h-[250px] flex flex-col">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-full bg-[#fa5b0f] flex items-center justify-center flex-shrink-0">

            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.8a1 1 0 0 0-.8.4L2.3 11l-5.16.86A1 1 0 0 0 .84 12.99V16h3" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">Alertes Voitures</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Documents, traites et maintenance</p>
          </div>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto space-y-3">
          <template v-if="voituresAlerts.length > 0">
            <div 
              v-for="alert in voituresAlerts" 
              :key="alert.id"
              class="p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-l-4 border-orange-400 rounded-lg group"
            >
              <div class="flex items-start justify-between mb-1">
                <span class="text-xs font-medium px-2 py-1 rounded-full bg-orange-500/20 text-orange-500 border border-orange-400/50">
                  {{ alert.type.toUpperCase() }}
                </span>
                <button 
                  @click="dismissAlert(alert.id)"
                  class="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-full transition-all ml-2"
                  title="Ignorer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p class="text-sm text-gray-900 dark:text-white font-medium leading-relaxed">{{ alert.message }}</p>
            </div>
            <div class="pt-2 pb-4 border-t border-gray-300 dark:border-gray-700/50">
              <p class="text-xs text-gray-600 dark:text-gray-400 text-center">
                {{ voituresAlerts.length }} alerte{{ voituresAlerts.length > 1 ? 's' : '' }} • 
                <a href="#" class="text-orange-400 hover:text-orange-300 font-medium">Gérer toutes les alertes</a>
              </p>
            </div>
          </template>
          <div v-else class="flex flex-col items-center justify-center py-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-emerald-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">Aucune alerte pour le moment</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Votre flotte est à jour. Vérifiez régulièrement les documents.</p>
          </div>
        </div>
      </div>

      <!-- Alertes Locations -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 min-h-[250px] flex flex-col">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">Alertes Locations</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Retours en retard et impayés</p>
          </div>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto space-y-3">
          <template v-if="locationsAlerts.length > 0">
            <div 
              v-for="alert in locationsAlerts" 
              :key="alert.id"
              class="p-3 border-l-4 rounded-lg group transition-colors"
              :class="alert.urgent ? 'bg-red-900/30 border-red-500 hover:bg-red-900/40' : 'bg-red-900/20 border-red-400 hover:bg-red-900/30'"
            >
              <div class="flex items-start justify-between mb-1">
                <span class="text-xs font-medium px-2 py-1 rounded-full border"
                      :class="alert.urgent ? 'bg-red-500/20 text-red-500 border-red-400/50' : 'bg-orange-500/20 text-orange-500 border-orange-400/50'">
                  {{ alert.type.toUpperCase() }}
                </span>
                <router-link to="/active-rentals" class="text-xs text-black hover:underline mt-1 dark:text-white">
                  Voir location
                </router-link>
              </div>
              <p class="text-sm text-gray-900 dark:text-white font-semibold mt-2">{{ alert.reservation.carName || alert.reservation.carId }}</p>
              <p class="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed mt-1">{{ alert.message }}</p>
            </div>
            <div class="pt-2 pb-4 border-t border-gray-300 dark:border-gray-700/50">
              <p class="text-xs text-gray-600 dark:text-gray-400 text-center">
                {{ locationsAlerts.length }} alerte{{ locationsAlerts.length > 1 ? 's' : '' }} • 
                <router-link to="/active-rentals" class="text-orange-400 hover:text-orange-300 font-medium">Gérer les locations</router-link>
              </p>
            </div>
          </template>
          <div v-else class="flex flex-col items-center justify-center py-8 text-center h-full">
            <div class="bg-emerald-900/20 px-4 py-2 rounded-full flex items-center gap-2 border border-emerald-800/30">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span class="text-sm text-[#10B981] font-medium">Aucune alerte location</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 min-h-[250px] flex flex-col relative">
        <button class="absolute top-6 right-6 w-6 h-6 rounded-full bg-[#3B82F6] flex items-center justify-center text-white hover:bg-[#fa5b0f] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div>
            <h3 class="text-gray-900 dark:text-white font-semibold">Notes</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Gérez vos tâches et rappels</p>
          </div>
        </div>
        <!-- Notes Input -->
        <div class="p-4 bg-gray-100 dark:bg-gray-800/30 rounded-lg border border-gray-300 dark:border-gray-700 mb-4">
          <div class="flex flex-col min-[993px]:flex-row gap-2">
            <input
              v-model="newNote"
              @keyup.enter="addNote"
              placeholder="Tapez une note rapide (Entrée pour ajouter)..."
              class="w-full min-w-0 flex-1 bg-white dark:bg-transparent border border-gray-600 focus:border-blue-500 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
            >
            <button
              @click="addNote"
              :disabled="!newNote.trim()"
              class="w-full min-[993px]:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#fa5b0f] text-[#fff] rounded-[8px] transition-colors font-bold border border-[#fa5b0f] hover:bg-transparent hover:text-[#fa5b0f] disabled:bg-gray-600 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Ajouter
            </button>
          </div>
        </div>

        <!-- Notes List -->
        <div class="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2">
          <template v-if="notes.length > 0">
            <div
              v-for="note in notes"
              :key="note.id"
              class="group relative p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <!-- Delete Button -->
              <button
                @click="deleteNote(note.id)"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                title="Supprimer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <!-- Note Content -->
              <p class="text-sm leading-relaxed text-white/95 break-words mb-3">{{ note.content }}</p>
              <div class="flex items-center justify-between text-xs text-blue-300/70 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20">
                <span>{{ note.author }} | {{ note.agency }}</span>
                <span class="font-mono ml-2">{{ formatDate(note.timestamp) }}</span>
              </div>
            </div>
          </template>
          <div v-else class="flex flex-col items-center justify-center py-12 text-center opacity-60">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-blue-400 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="text-lg font-medium text-gray-600 dark:text-gray-400 mb-1">Aucune note</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Commencez à ajouter des notes pour organiser votre journée.</p>
          </div>
        </div>

        <!-- Notes Count -->
        <div v-if="notes.length > 0" class="pt-3 mt-4 border-t border-gray-300 dark:border-gray-700/50">
          <p class="text-xs text-gray-600 dark:text-gray-400 text-center">
            {{ notes.length }} note{{ notes.length > 1 ? 's' : '' }} • 
            <button @click="clearAllNotes" class="text-red-400 hover:text-red-300 font-medium underline">Tout effacer</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

