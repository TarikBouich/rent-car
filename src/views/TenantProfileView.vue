<template>
  <div class="p-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    
    <!-- Top Bar -->
    <div class="flex items-center gap-4 mb-8">
      <router-link to="/super-admin" class="p-2 text-gray-600 dark:text-gray-400 hover:text-white bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 shrink-0">
         <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </router-link>
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white capitalize">
          {{ company?.name || 'Chargement...' }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          ID: {{ company?.id }} • Contact: {{ company?.email }}
        </p>
      </div>
    </div>

    <!-- MAIN Content -->
    <div v-if="company" class="space-y-8">
      
      <!-- Section 1: Utilisation & Limites du plan -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Utilisation & Limites du plan</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Stockage -->
          <div class="p-4 bg-gray-50 dark:bg-[#151923] rounded-lg border border-gray-200 dark:border-gray-800">
             <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
                   <svg class="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                   Stockage
                </div>
                <!-- Logic for Stockage is mocked to 0.04 Go for demonstration as we don't have real media files weight measured -->
                <span class="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{{ (0.04 / currentPlan.limits.storage * 100).toFixed(1) }}%</span>
             </div>
             <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                <div class="bg-gray-400 h-1.5 rounded-full" :style="`width: ${(0.04 / currentPlan.limits.storage * 100)}%`"></div>
             </div>
             <div class="flex justify-between text-xs text-gray-500">
                <span>0.04 Go utilisé</span>
                <span>/ {{ currentPlan.limits.storage }}.00 Go</span>
             </div>
          </div>

          <!-- Véhicules -->
          <div class="p-4 bg-gray-50 dark:bg-[#151923] rounded-lg border border-gray-200 dark:border-gray-800">
             <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
                   <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                   Véhicules
                </div>
                <span :class="carsPercentage >= 100 ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100'" class="text-xs font-bold px-2 py-0.5 rounded">
                   {{ carsPercentage.toFixed(0) }}%
                </span>
             </div>
             <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                <div :class="carsPercentage >= 100 ? 'bg-red-500' : 'bg-blue-500'" class="h-1.5 rounded-full transition-all" :style="`width: ${Math.min(carsPercentage, 100)}%`"></div>
             </div>
             <div class="flex justify-between text-xs text-gray-500">
                <span>{{ usage.cars }} utilisé</span>
                <span>/ {{ currentPlan.limits.cars }}</span>
             </div>
          </div>

          <!-- Utilisateurs -->
          <div class="p-4 bg-gray-50 dark:bg-[#151923] rounded-lg border border-gray-200 dark:border-gray-800">
             <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
                   <svg class="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                   Utilisateurs
                </div>
                <span :class="usersPercentage >= 100 ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100'" class="text-xs font-bold px-2 py-0.5 rounded">
                   {{ usersPercentage.toFixed(0) }}%
                </span>
             </div>
             <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                <div :class="usersPercentage >= 100 ? 'bg-red-500' : 'bg-blue-500'" class="h-1.5 rounded-full transition-all" :style="`width: ${Math.min(usersPercentage, 100)}%`"></div>
             </div>
             <div class="flex justify-between text-xs text-gray-500">
                <span>{{ usage.users }} utilisé</span>
                <span>/ {{ currentPlan.limits.users }}</span>
             </div>
          </div>

          <!-- Agences -->
          <div class="p-4 bg-gray-50 dark:bg-[#151923] rounded-lg border border-gray-200 dark:border-gray-800">
             <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
                   <svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                   Agences
                </div>
                <span :class="agenciesPercentage >= 100 ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100'" class="text-xs font-bold px-2 py-0.5 rounded">
                   {{ agenciesPercentage.toFixed(0) }}%
                </span>
             </div>
             <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                <div :class="agenciesPercentage >= 100 ? 'bg-red-500' : 'bg-blue-500'" class="h-1.5 rounded-full transition-all" :style="`width: ${Math.min(agenciesPercentage, 100)}%`"></div>
             </div>
             <div class="flex justify-between text-xs text-gray-500">
                <span>{{ usage.agencies }} utilisé</span>
                <span>/ {{ currentPlan.limits.agencies }}</span>
             </div>
          </div>
          
        </div>
      </div>

      <!-- Section 2: Comparer les plans -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
         <div class="flex items-center gap-3 mb-6">
          <svg class="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Comparer les plans</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div 
             v-for="(plan, key) in SAAS_PLANS" 
             :key="key" 
             class="border-2 rounded-xl p-6 text-center relative transition-all"
             :class="company.planId === key ? 'border-green-500 shadow-md transform scale-105' : 'border-gray-200 dark:border-gray-800 opacity-75 hover:opacity-100'"
           >
              <!-- Current Badge indicator -->
              <div v-if="company.planId === key" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-4 py-1 rounded-full w-4/5">
                 ✓ Actuel
              </div>

              <!-- Icon -->
              <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4 mt-2">
                 <svg v-if="key === 'demo'" class="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                 <svg v-if="key === 'starter'" class="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 <svg v-if="key === 'pro'" class="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                 <svg v-if="key === 'entreprise'" class="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>

              <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-1">{{ plan.name }}</h3>
              <div v-if="plan.price > 0" class="text-xs text-gray-500 font-bold mb-4">
                 MAD <span class="text-2xl text-[#1e40af] dark:text-[#60a5fa]">{{ plan.price }}</span> /mois
                 <div class="text-[10px] text-green-500 bg-green-50 dark:bg-green-900/30 w-max mx-auto px-2 py-0.5 rounded mt-1">{{ (plan.price * 10).toFixed(0) }} MAD/an</div>
              </div>
              <div v-else class="text-xl text-gray-400 font-bold mb-4 py-2">
                 Gratuit
              </div>

              <ul class="text-left space-y-2 mb-6">
                 <li v-for="(feat, idx) in plan.features" :key="idx" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-if="!(feat.startsWith('Pas') || feat.startsWith('0'))"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    <svg class="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-else><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    {{ feat }}
                 </li>
              </ul>
              
              <div class="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2 text-left mb-6">
                 <li class="flex items-center gap-2 text-xs text-gray-500"><svg class="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" stroke-width="2"/></svg> Accès HTTPS sécurisé</li>
                 <li class="flex items-center gap-2 text-xs text-gray-500"><svg class="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke-width="2"/></svg> Clients & locations illimités</li>
              </div>

              <button 
                v-if="company.planId !== key" 
                @click="changePlan(key)"
                class="w-full py-2 border-2 border-[#fa5b0f] text-[#fa5b0f] font-bold rounded-lg hover:bg-[#fa5b0f] hover:text-white transition-colors"
               >
                 Appliquer Plan
              </button>
           </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { SAAS_PLANS } from '../utils/planConstants'
import { useCompanyStore } from '../stores/companyStore'

const route = useRoute()
const companyStore = useCompanyStore()
const company = ref(null)

const usage = ref({
   cars: 0,
   users: 0,
   agencies: 0
})

onMounted(() => {
   companyStore.initializeFromStorage()
   const companyId = route.params.id
   company.value = companyStore.getCompanyById(companyId)

   if (company.value) {
      calculateUsage(company.value.id)
   }
})

const currentPlan = computed(() => {
   if (!company.value) return SAAS_PLANS['pro']
   return SAAS_PLANS[company.value.planId] || SAAS_PLANS['pro']
})

const carsPercentage = computed(() => (usage.value.cars / currentPlan.value.limits.cars) * 100)
const usersPercentage = computed(() => (usage.value.users / currentPlan.value.limits.users) * 100)
const agenciesPercentage = computed(() => (usage.value.agencies / currentPlan.value.limits.agencies) * 100)

const calculateUsage = (cid) => {
   // Directly parse localStorage for exact unfiltered DB arrays to scan
   const allCars = JSON.parse(localStorage.getItem('cars') || '[]')
   const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
   const allAgencies = JSON.parse(localStorage.getItem('agencies') || '[]')

   usage.value.cars = allCars.filter(c => c.companyId === cid).length
   usage.value.users = allUsers.filter(u => u.companyId === cid).length
   usage.value.agencies = allAgencies.filter(a => a.companyId === cid).length
}

const changePlan = (newPlanId) => {
   if (confirm(`Êtes-vous sûr de vouloir appliquer le plan ${SAAS_PLANS[newPlanId].name} à cette entreprise ?`)) {
      companyStore.updateCompany({
         id: company.value.id,
         planId: newPlanId
      })
      company.value.planId = newPlanId
   }
}

</script>
