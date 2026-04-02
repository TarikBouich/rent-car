<template>
  <div class="px-6 py-8 h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dégâts et État des Véhicules</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Gérez visuellement les anomalies et les réparations de votre parc</p>
      </div>
    </div>
    
    <!-- Main Split Layout -->
    <div class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Cars List -->
      <div class="bg-white dark:bg-[#151923] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-[calc(100vh-180px)]">
         <!-- Search -->
         <div class="p-4 border-b border-gray-100 dark:border-gray-800">
            <div class="relative">
               <input type="text" v-model="searchQuery" placeholder="Rechercher matricule, modèle..." class="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#fa5b0f] focus:outline-none">
               <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
               </div>
            </div>
         </div>
         
         <!-- List -->
         <div class="flex-1 overflow-y-auto p-2">
            <div 
               v-for="car in filteredCarsList" 
               :key="car.id" 
               @click="selectCar(car)"
               class="p-3 mb-2 rounded-xl cursor-pointer transition-colors border group"
               :class="selectedCar?.id === car.id ? 'bg-[#fa5b0f]/10 border-[#fa5b0f]/30' : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'"
            >
               <div class="flex gap-3 items-center">
                  <!-- Car Thumbnail -->
                  <div class="w-14 h-10 rounded-md bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0 relative">
                     <img v-if="car.images && car.images[0]" :src="car.images[0]" class="w-full h-full object-cover" />
                     <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                     </div>
                  </div>
                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                     <div class="flex items-center justify-between mb-0.5">
                        <h4 class="text-sm font-bold text-gray-900 dark:text-white truncate" :class="selectedCar?.id === car.id ? 'text-[#fa5b0f]' : ''">
                           {{ getBrand(car.brandId) }} {{ getModel(car.modelId) }}
                        </h4>
                     </div>
                     <div class="text-xs text-gray-500 font-mono">{{ car.licensePlate }}</div>
                  </div>
                  <!-- Damage Badge -->
                  <div v-if="getUnrepairedDamageCount(car) > 0" class="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0">
                     {{ getUnrepairedDamageCount(car) }}
                  </div>
                  <div v-else>
                     <svg class="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
               </div>
            </div>
            <div v-if="filteredCarsList.length === 0" class="p-8 text-center text-gray-400 text-sm">
               Aucun véhicule trouvé.
            </div>
         </div>
      </div>
      
      <!-- Right Column: Damage Editor -->
      <div class="lg:col-span-2 bg-white dark:bg-[#151923] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-[calc(100vh-180px)]">
         <template v-if="selectedCar">
            <!-- Details Header -->
            <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
               <div class="flex items-center gap-4">
                  <div class="w-20 h-14 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0">
                     <img v-if="selectedCar.images && selectedCar.images[0]" :src="selectedCar.images[0]" class="w-full h-full object-cover" />
                  </div>
                  <div>
                     <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ getBrand(selectedCar.brandId) }} {{ getModel(selectedCar.modelId) }}</h2>
                     <div class="flex items-center gap-2 mt-1">
                        <span class="px-2 py-0.5 rounded border border-gray-300 dark:border-gray-700 text-xs font-mono bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">{{ selectedCar.licensePlate }}</span>
                        <!-- Status Badge -->
                        <span class="px-2 py-0.5 text-xs font-medium rounded-md" 
                              :class="{
                                 'bg-emerald-100 text-emerald-800': selectedCar.status === 'Disponible',
                                 'bg-amber-100 text-amber-800': selectedCar.status === 'En maintenance',
                                 'bg-blue-100 text-blue-800': selectedCar.status === 'En location',
                                 'bg-gray-100 text-gray-800': selectedCar.status === 'Indisponible'
                              }">
                           {{ selectedCar.status }}
                        </span>
                     </div>
                  </div>
               </div>
               
               <button @click="saveDamages" :disabled="!hasUnsavedChanges" class="px-4 py-2 bg-[#fa5b0f] hover:bg-[#eb4b05] text-white text-sm font-bold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                  <svg v-if="hasUnsavedChanges" class="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                  Sauvegarder
               </button>
            </div>
            
            <!-- Workspace -->
            <div class="flex-1 overflow-y-auto p-6 flex flex-col items-center">
               
               <!-- Summary Counters -->
               <div class="w-full max-w-2xl flex justify-center gap-8 mb-6">
                  <div class="text-center px-6 py-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                     <div class="text-3xl font-black text-red-500 mb-1">{{ currentDamages.filter(d => !d.type || d.type === 'x').length }}</div>
                     <div class="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Dégâts Actifs</div>
                  </div>
                  <div class="text-center px-6 py-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
                     <div class="text-3xl font-black text-green-500 mb-1">{{ currentDamages.filter(d => d.type === 'v').length }}</div>
                     <div class="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">Réparés Récemment</div>
                  </div>
               </div>

               <!-- Interactive Map -->
               <div class="w-full max-w-2xl bg-gray-50/50 dark:bg-gray-800/20 rounded-xl p-4 border border-dashed border-gray-200 dark:border-gray-700">
                  <CarDamageMap v-model="currentDamages" :readonly="false" />
               </div>
               
            </div>
         </template>
         
         <!-- Empty State -->
         <div v-else class="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
               <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Sélectionnez un véhicule</h3>
            <p class="text-gray-500 max-w-sm">Choisissez un véhicule dans la liste de gauche pour visualiser et modifier son état physique.</p>
         </div>
         
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import CarDamageMap from '../components/CarDamageMap.vue'
import { useCarStore } from '../stores/carStore'
import { useBrandStore } from '../stores/brandStore'
import { useModelStore } from '../stores/modelStore'

const carStore = useCarStore()
const brandStore = useBrandStore()
const modelStore = useModelStore()

const searchQuery = ref('')
const selectedCar = ref(null)
const currentDamages = ref([])
const hasUnsavedChanges = ref(false)

const getBrand = (id) => brandStore.getBrandById(id)?.name || 'Inconnu'
const getModel = (id) => modelStore.getModelById(id)?.name || 'Inconnu'

const getUnrepairedDamageCount = (car) => {
   const damages = car.damages || []
   return damages.filter(d => !d.type || d.type === 'x').length
}

const filteredCarsList = computed(() => {
   const q = searchQuery.value.toLowerCase()
   const list = carStore.filteredCars || []
   if (!q) return list
   
   return list.filter(car => {
      const searchTxt = `${car.licensePlate} ${getBrand(car.brandId)} ${getModel(car.modelId)}`.toLowerCase()
      return searchTxt.includes(q)
   })
})

const selectCar = (car) => {
   if (hasUnsavedChanges.value) {
      if (!confirm("Vous avez des modifications non enregistrées. Voulez-vous continuer sans sauvegarder ?")) {
         return;
      }
   }
   selectedCar.value = car
   // Deep clone current damages to avoid reactivity mutations before save
   currentDamages.value = JSON.parse(JSON.stringify(car.damages || []))
   // Reset watch tracker
   setTimeout(() => { hasUnsavedChanges.value = false; }, 50)
}

// Watch deep on currentDamages to activate save button
watch(currentDamages, () => {
   if(selectedCar.value) {
      hasUnsavedChanges.value = true
   }
}, { deep: true })

const saveDamages = async () => {
   if (!selectedCar.value) return
   
   // Apply to the car object
   const updatedCar = { 
      ...selectedCar.value, 
      damages: JSON.parse(JSON.stringify(currentDamages.value)) 
   }
   
   carStore.updateCar(updatedCar)
   hasUnsavedChanges.value = false
   alert("Les modifications sur l'état du véhicule ont été enregistrées avec succès.")
}
</script>
