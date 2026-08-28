<template>
  <div v-if="company && currentPlan" class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm mb-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
       <div class="flex items-center gap-3">
         <svg class="w-5 h-5 text-[#fa5b0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
         </svg>
         <div>
           <h2 class="text-lg font-bold text-gray-900 dark:text-white">Abonnement & Limites ({{ currentPlan.name }})</h2>
           <p class="text-xs text-gray-500 mt-1">Limites en vigueur pour le Tenant : {{ company.id }}</p>
         </div>
       </div>
       <div>
         <span class="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-transparent">
            Plan Actif
         </span>
       </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      
      <!-- Véhicules -->
      <div class="p-3 bg-gray-50 dark:bg-[#151923] rounded-lg border border-gray-200 dark:border-gray-800">
         <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-bold">
               <svg class="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
               Véhicules
            </div>
            <span :class="carsPercentage >= 100 ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100'" class="text-[10px] font-bold px-1.5 py-0.5 rounded">
               {{ carsPercentage.toFixed(0) }}%
            </span>
         </div>
         <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-1">
            <div :class="carsPercentage >= 100 ? 'bg-red-500' : 'bg-blue-500'" class="h-1 rounded-full transition-all" :style="`width: ${Math.min(carsPercentage, 100)}%`"></div>
         </div>
         <div class="flex justify-between text-[10px] text-gray-500">
            <span>{{ usage.cars }} utilisé</span>
            <span>/ {{ currentPlan.limits.cars }}</span>
         </div>
      </div>

      <!-- Utilisateurs -->
      <div class="p-3 bg-gray-50 dark:bg-[#151923] rounded-lg border border-gray-200 dark:border-gray-800">
         <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-bold">
               <svg class="w-3.5 h-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
               Utilisateurs
            </div>
            <span :class="usersPercentage >= 100 ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100'" class="text-[10px] font-bold px-1.5 py-0.5 rounded">
               {{ usersPercentage.toFixed(0) }}%
            </span>
         </div>
         <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-1">
            <div :class="usersPercentage >= 100 ? 'bg-red-500' : 'bg-blue-500'" class="h-1 rounded-full transition-all" :style="`width: ${Math.min(usersPercentage, 100)}%`"></div>
         </div>
         <div class="flex justify-between text-[10px] text-gray-500">
            <span>{{ usage.users }} utilisé</span>
            <span>/ {{ currentPlan.limits.users }}</span>
         </div>
      </div>

      <!-- Agences -->
      <div class="p-3 bg-gray-50 dark:bg-[#151923] rounded-lg border border-gray-200 dark:border-gray-800">
         <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-bold">
               <svg class="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
               Agences
            </div>
            <span :class="agenciesPercentage >= 100 ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100'" class="text-[10px] font-bold px-1.5 py-0.5 rounded">
               {{ agenciesPercentage.toFixed(0) }}%
            </span>
         </div>
         <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-1">
            <div :class="agenciesPercentage >= 100 ? 'bg-red-500' : 'bg-blue-500'" class="h-1 rounded-full transition-all" :style="`width: ${Math.min(agenciesPercentage, 100)}%`"></div>
         </div>
         <div class="flex justify-between text-[10px] text-gray-500">
            <span>{{ usage.agencies }} utilisé</span>
            <span>/ {{ currentPlan.limits.agencies }}</span>
         </div>
      </div>
      
      <!-- Action -->
      <div class="flex flex-col items-center justify-center p-3 gap-1">
         <a :href="`mailto:${supportContact.email}`" class="text-[#fa5b0f] text-xs font-bold hover:underline">
            Demander une extension (Contactez le support)
         </a>
         <span v-if="supportContact.phone" class="text-[11px] text-gray-500 dark:text-gray-400">
            Tél: {{ supportContact.phone }}
         </span>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { SAAS_PLANS } from '../utils/planConstants'
import { useCompanyStore } from '../stores/companyStore'
import { useUserStore } from '../stores/userStore'
import { useCarStore } from '../stores/carStore'
import { useAgencyStore } from '../stores/agencyStore'
import { useClientStore } from '../stores/clientStore'
import companyService from '../services/companyService'

const companyStore = useCompanyStore()
const userStore = useUserStore()
const carStore = useCarStore()
const agencyStore = useAgencyStore()
const clientStore = useClientStore()

const company = ref(null)

const usage = ref({
   cars: 0,
   users: 0,
   agencies: 0
})

const supportContact = ref({
   email: 'superadmin@rentcar.com',
   phone: ''
})

onMounted(async () => {
   await Promise.all([
     companyStore.initializeFromStorage(),
     carStore.initializeFromStorage(),
     userStore.fetchUsers(),
     agencyStore.initializeFromStorage(),
     clientStore.initializeFromStorage()
   ])

   company.value = companyStore.getCompanyById(userStore.userCompanyId)

   if (company.value) {
      calculateUsage(company.value.id)
   }

   loadSupportContact()
})

const currentPlan = computed(() => {
   if (!company.value) return SAAS_PLANS['pro']
   return SAAS_PLANS[company.value.planId] || SAAS_PLANS['pro']
})

const carsPercentage = computed(() => (usage.value.cars / currentPlan.value.limits.cars) * 100)
const usersPercentage = computed(() => (usage.value.users / currentPlan.value.limits.users) * 100)
const agenciesPercentage = computed(() => (usage.value.agencies / currentPlan.value.limits.agencies) * 100)

const calculateUsage = (cid) => {
   const allCars = carStore.cars || []
   const allUsers = userStore.users || []
   const allAgencies = agencyStore.agencies || []

   usage.value.cars = allCars.filter(c => c.companyId === cid).length
   usage.value.users = allUsers.filter(u => u.companyId === cid).length
   usage.value.agencies = allAgencies.filter(a => a.companyId === cid).length
}

const loadSupportContact = async () => {
   try {
      const { data } = await companyService.getSupportContact()
      supportContact.value = {
         email: data?.email || 'superadmin@rentcar.com',
         phone: data?.phone || ''
      }
   } catch (error) {
      console.error('Failed loading support contact:', error)
   }
}
</script>
