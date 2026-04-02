<template>
  <div class="px-6 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Disponibilité des Véhicules</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Recherchez les véhicules libres pour votre prochaine location</p>
      </div>
    </div>
    
    <!-- Filters Card -->
    <div class="bg-white dark:bg-[#151923] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
      <!-- Date Range & Search -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
         <!-- Start Date -->
         <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de Départ</label>
            <input type="datetime-local" v-model="searchParams.startDate" class="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#fa5b0f] focus:outline-none">
         </div>
         <!-- End Date -->
         <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de Retour</label>
            <input type="datetime-local" v-model="searchParams.endDate" class="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#fa5b0f] focus:outline-none">
         </div>
         <!-- Search text -->
         <div class="col-span-1 md:col-span-2 relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recherche (Matricule, Modèle)</label>
            <div class="relative">
               <input type="text" v-model="searchParams.query" placeholder="Ex: Renault Clio, 1234-A-50..." class="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg pl-11 pr-4 py-2.5 focus:ring-2 focus:ring-[#fa5b0f] focus:outline-none">
               <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
               </div>
            </div>
         </div>
      </div>
      
      <!-- Sub Filters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
         <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transmission</label>
            <select v-model="searchParams.transmission" class="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#fa5b0f] focus:outline-none">
               <option value="toutes">Toutes</option>
               <option value="Manuelle">Manuelle</option>
               <option value="Automatique">Automatique</option>
            </select>
         </div>
         <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Carburant</label>
            <select v-model="searchParams.fuel" class="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#fa5b0f] focus:outline-none">
               <option value="toutes">Tous</option>
               <option value="Diesel">Diesel</option>
               <option value="Essence">Essence</option>
               <option value="Hybride">Hybride</option>
               <option value="Électrique">Électrique</option>
            </select>
         </div>
         <div class="flex items-end gap-2">
            <!-- Add Admin Agency selection -->
            <div v-if="userStore.isAdmin" class="w-full">
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agence</label>
               <select v-model="searchParams.agencyId" class="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#fa5b0f] focus:outline-none">
                  <option value="all">Toutes les agences</option>
                  <option v-for="agency in agencyStore.agencies" :key="agency.id" :value="agency.id">
                     {{ agency.name }}
                  </option>
               </select>
            </div>
            
            <button @click="resetFilters" class="w-full py-2.5 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
               Réinitialiser
            </button>
         </div>
      </div>
    </div>
    
    <!-- Results Info -->
    <div class="mb-4 flex items-center justify-between">
       <h2 class="text-lg font-bold text-gray-900 dark:text-white">Véhicules Disponibles (<span class="text-[#fa5b0f]">{{ availableCars.length }}</span>)</h2>
       <div v-if="!isValidDateRange" class="text-red-500 text-sm font-medium flex items-center gap-1">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          La date de retour doit être ultérieure à la date de départ.
       </div>
    </div>
    
    <!-- Results Grid -->
    <div v-if="availableCars.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
       <!-- Card -->
       <div v-for="car in availableCars" :key="car.id" class="bg-white dark:bg-[#151923] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
          <div class="h-48 bg-gray-100 dark:bg-gray-800 relative w-full overflow-hidden">
             <img v-if="car.images && car.images[0]" :src="car.images[0]" class="w-full h-full object-cover" />
             <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             </div>
             <div class="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white">
                {{ formatCurrency(car.pricePerDay || 0) }}/j
             </div>
             <span v-if="car.status !== 'Disponible'" class="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-md">
                {{ car.status }}
             </span>
          </div>
          <div class="p-5 flex-1 flex flex-col">
             <div class="flex justify-between items-start mb-2">
                <div>
                   <h3 class="text-base font-bold text-gray-900 dark:text-white uppercase">{{ getBrand(car.brandId) }}</h3>
                   <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ getModel(car.modelId) }}</p>
                </div>
                <!-- Matricule Badge -->
                <div class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-xs font-mono font-bold">
                   {{ car.licensePlate }}
                </div>
             </div>
             
             <!-- Tech Specs -->
             <div class="flex flex-wrap gap-2 mt-3 mb-6">
                <span class="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-700/50">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2"/></svg>
                  {{ car.transmission || 'Manuel' }}
                </span>
                <span class="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-700/50">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                  {{ car.fuel || 'Diesel' }}
                </span>
             </div>
             
             <!-- Actions & Agency Footer -->
             <div class="mt-auto flex flex-col gap-3">
                <div v-if="userStore.isAdmin" class="flex gap-2 items-center px-1 text-xs font-semibold text-gray-500">
                   <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                   {{ agencyStore.getAgencyById(car.agencyId)?.name || 'Agence Inconnue' }}
                </div>
                <!-- Only keep Contrat button and make it full width -->
                <button @click="createContratFor(car)" class="w-full py-2.5 bg-[#fa5b0f] hover:bg-[#eb4b05] text-white font-bold rounded-lg text-sm transition-colors shadow-sm text-center border border-transparent">
                   Créer un Contrat
                </button>
             </div>
          </div>
       </div>
    </div>
    
    <div v-else-if="isValidDateRange && searchParams.startDate" class="py-20 flex flex-col items-center justify-center text-center">
       <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
         <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
       </div>
       <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucun Véhicule Trouvé</h3>
       <p class="text-gray-500 max-w-md">Réduisez vos filtres ou modifiez la plage de dates pour trouver des véhicules libres.</p>
    </div>
    <div v-else-if="!searchParams.startDate" class="py-20 flex flex-col items-center justify-center text-center">
       <div class="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 text-blue-500">
         <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
       </div>
       <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Sélectionnez des Dates</h3>
       <p class="text-gray-500 max-w-md">Veuillez renseigner une date de départ détaillée pour lancer la recherche.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCarStore } from '../stores/carStore'
import { useContratStore } from '../stores/contratStore'
import { useBrandStore } from '../stores/brandStore'
import { useModelStore } from '../stores/modelStore'
import { useUserStore } from '../stores/userStore'
import { useAgencyStore } from '../stores/agencyStore'

const router = useRouter()
const carStore = useCarStore()
const contratStore = useContratStore()
const brandStore = useBrandStore()
const modelStore = useModelStore()
const userStore = useUserStore()
const agencyStore = useAgencyStore()

const getBrand = (id) => {
   const b = brandStore.getBrandById(id)
   return b ? b.name : 'Inconnu'
}
const getModel = (id) => {
   const m = modelStore.getModelById(id)
   return m ? m.name : 'Inconnu'
}

const now = new Date()
now.setMinutes(0, 0, 0)
const tomorrow = new Date(now)
tomorrow.setDate(tomorrow.getDate() + 1)

const formatDateForInput = (d) => {
   const pad = (n) => n.toString().padStart(2, '0')
   return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const searchParams = ref({
   startDate: formatDateForInput(now),
   endDate: formatDateForInput(tomorrow),
   query: '',
   transmission: 'toutes',
   fuel: 'toutes',
   agencyId: 'all'
})

const resetFilters = () => {
   searchParams.value.query = ''
   searchParams.value.transmission = 'toutes'
   searchParams.value.fuel = 'toutes'
   searchParams.value.agencyId = 'all'
}

const isValidDateRange = computed(() => {
   if (!searchParams.value.startDate || !searchParams.value.endDate) return false
   const s = new Date(searchParams.value.startDate).getTime()
   const e = new Date(searchParams.value.endDate).getTime()
   return s < e
})

const checkOverlap = (searchStart, searchEnd, rangeStart, rangeEnd) => {
   return searchStart < rangeEnd && rangeStart < searchEnd
}

const availableCars = computed(() => {
   if (!isValidDateRange.value) return []
   
   const sTime = new Date(searchParams.value.startDate).getTime()
   const eTime = new Date(searchParams.value.endDate).getTime()
   const q = searchParams.value.query.toLowerCase()

   return (carStore.filteredCars || []).filter(car => {
      // 1. Static Filters
      if (car.status === 'En maintenance' || car.status === 'Indisponible') return false
      if (userStore.isAdmin && searchParams.value.agencyId !== 'all' && car.agencyId !== searchParams.value.agencyId) return false
      
      if (searchParams.value.transmission !== 'toutes' && car.transmission !== searchParams.value.transmission) return false
      if (searchParams.value.fuel !== 'toutes' && car.fuel !== searchParams.value.fuel) return false
      
      if (q) {
         const searchTxt = `${car.licensePlate} ${getBrand(car.brandId)} ${getModel(car.modelId)}`.toLowerCase()
         if (!searchTxt.includes(q)) return false
      }

      // 2. Dynamic Unavailability Checks
      
      // Contrats that are 'En cours' meaning the car is on the road
      const contrats = contratStore.filteredContrats || []
      const hasOverlappingContrat = contrats.some(c => {
         if (c.carId !== car.id) return false
         if (c.etat !== 'En cours') return false // Only ongoing contracts block availability
         
         const cStart = new Date(c.dateSortie || c.createdAt).getTime()
         const cEnd = new Date(c.dateRetourPrevoyue).getTime()
         return checkOverlap(sTime, eTime, cStart, cEnd)
      })
      if (hasOverlappingContrat) return false

      // Active Reservations
      const reservations = carStore.reservations || [] 
      const hasOverlappingReservation = reservations.some(r => {
         if (r.carId !== car.id) return false
         if (r.status === 'Completed' || r.status === 'Cancelled') return false
         const rStart = new Date(r.startDate).getTime()
         const rEnd = new Date(r.endDate).getTime()
         return checkOverlap(sTime, eTime, rStart, rEnd)
      })
      if (hasOverlappingReservation) return false

      return true
   })
})

const formatCurrency = (val) => new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(val)

const createContratFor = (car) => {
   router.push({ 
      path: '/contrats/add', 
      query: { 
         carId: car.id,
         agencyId: car.agencyId,
         startDate: searchParams.value.startDate,
         endDate: searchParams.value.endDate
      } 
   })
}

// Keeping it defined in case we want to revert, though button is removed.
const createReservationFor = (car) => {
   router.push({ 
      path: '/reservations/add', 
      query: { 
         carId: car.id,
         startDate: searchParams.value.startDate,
         endDate: searchParams.value.endDate
      } 
   })
}
</script>
