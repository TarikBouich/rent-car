<template>
  <div v-if="car" class="px-0 sm:px-6 py-6 min-h-[calc(100vh-4rem)] bg-[#F3F4F6] dark:bg-[#151923] font-[Inter]">
    <!-- Header with Back Button -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-4">
        <router-link to="/cars" class="p-2 text-gray-600 dark:text-gray-400 hover:text-white bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </router-link>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ getBrandName(car.brandId) }} {{ getModelName(car.modelId) }}</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ car.category || 'N/A' }} &bull; Fiche Véhicule</p>
          
          <!-- Navigation Tabs (Moved directly under car name) -->
          <nav class="-mb-px flex space-x-6">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              class="whitespace-nowrap pb-2 px-1 border-b-[3px] font-medium text-sm transition-colors"
              :class="activeTab === tab.id ? 'border-[#fa5b0f] text-[#fa5b0f]' : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-600 hover:border-gray-600'"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>
      <div class="flex items-center gap-3 self-start md:self-auto">
        <span class="inline-flex items-center border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden bg-white dark:bg-[#1E2330] rounded-md h-9">
          <div class="bg-[#fa5b0f] px-2 h-full flex items-center justify-center">
            <span class="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-tighter">MA</span>
          </div>
          <span class="px-4 text-sm font-bold text-gray-900 dark:text-white tracking-wider">{{ car.licensePlate }}</span>
        </span>
        <button class="px-4 py-2 bg-[#fa5b0f] text-white text-sm font-medium rounded-lg hover:bg-orange-500 transition-colors shadow-sm whitespace-nowrap">
          Modifier la Fiche
        </button>
      </div>
    </div>

    <!-- Tab Contents -->
    <div class="tab-content">
      <!-- Informations Tab (Main View) -->
      <div v-show="activeTab === 'informations'">
        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left Column: Hero & Specs -->
          <div class="lg:col-span-2 space-y-6">
        
        <!-- Hero Image Card -->
        <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-6">
          <div class="w-full h-[500px] lg:h-[700px] bg-white dark:bg-[#1C1C1C] relative group overflow-hidden">
            <template v-if="car.images && car.images.length > 0 && !imgError">
              <img :src="car.images[currentImageIndex]" @error="imgError = true" :alt="car.licensePlate" class="w-full h-full object-cover transition-all duration-300" />
              <!-- Slider Controls -->
              <button v-if="car.images.length > 1" @click.stop="prevImage" class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button v-if="car.images.length > 1" @click.stop="nextImage" class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
              <!-- Indicators -->
              <div v-if="car.images.length > 1" class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                <button v-for="(img, idx) in car.images" :key="idx" @click="currentImageIndex = idx" class="w-2.5 h-2.5 rounded-full transition-colors" :class="currentImageIndex === idx ? 'bg-[#fa5b0f]' : 'bg-white/50 hover:bg-white/80'"></button>
              </div>
            </template>
            <template v-else-if="car.image && !imgError">
              <img :src="car.image" @error="imgError = true" :alt="car.licensePlate" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </template>
            <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mb-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span class="text-sm font-medium">Image non disponible</span>
            </div>
          </div>
        </div>

        <!-- Statistiques Financières -->
        <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Statistiques Financières</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <!-- Total Revenu -->
            <div class="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Total Revenu</p>
              <p class="text-3xl font-bold text-green-500 block">
                {{ formatCurrency(totalRevenue) }}
              </p>
            </div>
            
            <!-- Total Dépenses -->
            <div class="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Total Dépenses</p>
              <p class="text-3xl font-bold text-red-500 block">
                {{ formatCurrency(totalCharges) }}
              </p>
            </div>
          </div>

          <!-- Optional Bar Chart Comparison (Kept from V1) -->
          <div class="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6">
             <VueApexCharts type="bar" height="150" :options="profitChartOptions" :series="profitSeries"></VueApexCharts>
          </div>
        </div>

      </div>

      <!-- Right Column: Specs Side-card  -->
      <div class="space-y-6">
        
        <!-- Technical Specs Side-card -->
        <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Spécifications</h3>
          </div>
          
          <div class="flex flex-wrap gap-2">
            <!-- Technical Tags -->
            <span v-if="car.agencyId" class="px-3 py-1.5 border border-indigo-500/30 rounded-[6px] text-xs text-indigo-400 bg-indigo-500/10 shadow-sm font-bold flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              {{ agencyStore.getAgencyById(car.agencyId)?.name || 'Agence Inconnue' }}
            </span>
            <span class="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-[6px] text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] shadow-sm font-medium">
              Prix: {{ car.pricePerDay }} MAD/Jr
            </span>
            <span v-if="car.category" class="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-[6px] text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] shadow-sm font-medium">
              {{ car.category }}
            </span>
            <span class="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-[6px] text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] shadow-sm font-medium">
              {{ car.fuelType || car.fuel || 'Carburant N/A' }}
            </span>
            <span class="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-[6px] text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] shadow-sm font-medium">
              {{ car.transmission === 'manual' ? 'Manuelle' : car.transmission === 'automatic' ? 'Automatique' : car.transmission || 'Transmission N/A' }}
            </span>
            <span v-if="car.seats" class="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-[6px] text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] shadow-sm font-medium">
              {{ car.seats }} Places
            </span>
            <span class="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-[6px] text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] shadow-sm font-medium flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-500 block" :style="{ backgroundColor: car.color || '#000000' }"></span>
              Couleur
            </span>
            <span class="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-[6px] text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] shadow-sm font-medium">
              {{ car.currentMileage ? car.currentMileage.toLocaleString() + ' km' : '0 km' }}
            </span>
            <span v-if="car.firstRegistrationDate" class="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-[6px] text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] shadow-sm font-medium">
              MEC: {{ formatDateOnly(car.firstRegistrationDate) }}
            </span>
          </div>

          <!-- Add secondary info underneath like chassis & matricule WW (since these are important identifiers) -->
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 gap-4">
            <div v-if="car.chassisNumber">
              <span class="block text-xs text-gray-500 dark:text-gray-400">Numéro de chassis</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ car.chassisNumber }}</span>
            </div>
            <div v-if="car.matriculeWWW">
              <span class="block text-xs text-gray-500 dark:text-gray-400">Matricule WWW</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ car.matriculeWWW }}</span>
            </div>
          </div>

          <!-- Equipements / Accessoires -->
          <div v-if="car.equipments && (car.equipments.climatisation || car.equipments.cric || car.equipments.documents || car.equipments.extincteur)" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <span class="block text-xs text-gray-500 dark:text-gray-400 mb-2">Équipements inclus</span>
            <div class="flex flex-wrap gap-2">
               <span v-if="car.equipments?.climatisation" class="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">Climatisation</span>
               <span v-if="car.equipments?.cric" class="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">Cric et manivelle</span>
               <span v-if="car.equipments?.documents" class="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">Documents</span>
               <span v-if="car.equipments?.extincteur" class="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">Extincteur</span>
            </div>
          </div>
        </div>

        <!-- Add-ons & Options Management (Moved to right column) -->
        <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Options de Voiture</h3>
            <button @click="openAddOptionModal" class="text-xs font-medium text-[#fa5b0f] hover:text-orange-500">+ Ajouter Option</button>
          </div>
          
          <div v-if="car.options && car.options.length" class="flex flex-wrap gap-2">
            <div v-for="(option, index) in car.options" :key="option.id" class="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] flex items-center gap-2">
              <span>{{ option.name }}</span>
              <button @click="removeOption(index)" class="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full p-0.5 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
              </button>
            </div>
          </div>
          
          <div v-else class="text-center py-4 text-gray-600 dark:text-gray-400 text-sm">
            Aucune option.
          </div>
        </div>

      </div>
    </div>
  </div> <!-- End Informations Tab -->

    <!-- Contrats Tab -->
    <div v-show="activeTab === 'contrats'" class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-6">
      <div class="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Contrats de Location</h3>
      </div>
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse min-w-max">
          <thead>
            <tr class="bg-gray-50 dark:bg-[#1C1C1C]">
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Référence</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Période</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Montant</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-transparent">
            <tr v-for="res in carReservations" :key="res.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ res.id }}</td>
              <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ getClientName(res.clientId) }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ formatDateOnly(res.startDate) }} - {{ formatDateOnly(res.endDate) }}</td>
              <td class="px-4 py-3 text-sm font-medium text-[#10B981]">{{ formatCurrency(res.totalPrice) }}</td>
              <td class="px-4 py-3"><span class="px-2.5 py-1 text-xs font-medium rounded-full" :class="res.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'">{{ res.status === 'Completed' ? 'Terminé' : 'En cours' }}</span></td>
            </tr>
            <tr v-if="!carReservations.length">
              <td colspan="5" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">Aucun contrat associé à ce véhicule.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Charges Tab -->
    <div v-show="activeTab === 'charges'" class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-6">
      <div class="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Historique des Charges</h3>
      </div>
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse min-w-max">
          <thead>
            <tr class="bg-gray-50 dark:bg-[#1C1C1C]">
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Montant</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-transparent">
            <tr v-for="charge in carCharges" :key="charge.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ formatDateOnly(charge.date) }}</td>
              <td class="px-4 py-3 text-sm font-bold uppercase" :class="charge.chargeType === 'panne' ? 'text-red-500' : 'text-blue-500'">{{ charge.chargeType || 'Global' }}</td>
              <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ charge.description }}</td>
              <td class="px-4 py-3 text-sm font-medium text-red-500">{{ formatCurrency(charge.amount) }}</td>
            </tr>
            <tr v-if="!carCharges.length">
              <td colspan="4" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">Aucune charge associée à ce véhicule.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-show="activeTab === 'maintenance'" class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-6">
      <div class="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Suivi d'Alertes et Maintenance</h3>
      </div>
      <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Vidange AlertCard -->
        <div class="bg-white dark:bg-[#1C1C1C] border rounded-xl p-5" :class="getVidangeStatus().borderClass">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="getVidangeStatus().bgClass">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="getVidangeStatus().iconClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-gray-900 dark:text-white">Vidange</h4>
              <p class="text-xs font-medium" :class="getVidangeStatus().textClass">{{ getVidangeStatus().label }}</p>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Actuel:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ car.currentMileage?.toLocaleString() || 0 }} km</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Prochain:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ car.nextVidangeKm?.toLocaleString() || 0 }} km</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div class="h-2 rounded-full" :class="getVidangeStatus().progressClass" :style="{ width: getVidangeStatus().progress + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- Visite Technique AlertCard -->
        <div class="bg-white dark:bg-[#1C1C1C] border rounded-xl p-5" :class="getDateStatus(car.visiteTechniqueEndDate, settingsStore.alertThresholds?.finVisiteTechnique || 7).borderClass">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="getDateStatus(car.visiteTechniqueEndDate, settingsStore.alertThresholds?.finVisiteTechnique || 7).bgClass">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="getDateStatus(car.visiteTechniqueEndDate, settingsStore.alertThresholds?.finVisiteTechnique || 7).iconClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-gray-900 dark:text-white">Visite Technique</h4>
              <p class="text-xs font-medium" :class="getDateStatus(car.visiteTechniqueEndDate, settingsStore.alertThresholds?.finVisiteTechnique || 7).textClass">{{ getDateStatus(car.visiteTechniqueEndDate, settingsStore.alertThresholds?.finVisiteTechnique || 7).label }}</p>
            </div>
          </div>
          <div class="space-y-2">
             <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Échéance:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ formatDateOnly(car.visiteTechniqueEndDate) || 'Non définie' }}</span>
            </div>
          </div>
        </div>

        <!-- Assurance AlertCard -->
        <div class="bg-white dark:bg-[#1C1C1C] border rounded-xl p-5" :class="getDateStatus(car.assuranceEndDate, settingsStore.alertThresholds?.finAssurance || 7).borderClass">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="getDateStatus(car.assuranceEndDate, settingsStore.alertThresholds?.finAssurance || 7).bgClass">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="getDateStatus(car.assuranceEndDate, settingsStore.alertThresholds?.finAssurance || 7).iconClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-gray-900 dark:text-white">Assurance</h4>
              <p class="text-xs font-medium" :class="getDateStatus(car.assuranceEndDate, settingsStore.alertThresholds?.finAssurance || 7).textClass">{{ getDateStatus(car.assuranceEndDate, settingsStore.alertThresholds?.finAssurance || 7).label }}</p>
            </div>
          </div>
          <div class="space-y-2">
             <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">Échéance:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ formatDateOnly(car.assuranceEndDate) || 'Non définie' }}</span>
            </div>
          </div>
        </div>

        <!-- Dynamic Custom Types from Entretiens -->
        <div v-for="alert in customMaintenanceAlerts" :key="alert.id" class="bg-white dark:bg-[#1C1C1C] border rounded-xl p-5" :class="getCustomStatus(alert).borderClass">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="getCustomStatus(alert).bgClass">
              <!-- Generic Wrench Icon for Custom Maintenance -->
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="getCustomStatus(alert).iconClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-gray-900 dark:text-white capitalize">{{ alert.config?.name || 'Entretien' }}</h4>
              <p class="text-xs font-medium" :class="getCustomStatus(alert).textClass">{{ getCustomStatus(alert).label }}</p>
            </div>
          </div>
          <div class="space-y-2">
            <template v-if="alert.triggerMode === 'km'">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Actuel:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ car.currentMileage?.toLocaleString() || 0 }} km</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Limite:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ alert.nextKm?.toLocaleString() || 0 }} km</span>
              </div>
            </template>
            <template v-else>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">Échéance:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatDateOnly(alert.nextDate) || 'Non définie' }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div v-show="activeTab === 'dommages'" class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 text-center mt-6">
      <div class="w-12 h-12 bg-white dark:bg-[#1C1C1C] rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Déclaration de Dommages</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">Aucun dommage technique ou esthétique n'est actuellement signalé sur ce véhicule.</p>
    </div>

    </div> <!-- End Tab Contents -->
  </div>
  
  <div v-else class="p-6 flex items-center justify-center h-[calc(100vh-4rem)] bg-[#F3F4F6] dark:bg-[#151923]">
    <div class="animate-pulse w-8 h-8 rounded-full border-4 border-[#fa5b0f] border-t-transparent animate-spin"></div>
  </div>

  <!-- Add Option Modal -->
  <div v-if="showAddOptionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showAddOptionModal = false"></div>
    <div class="relative bg-white dark:bg-[#1E2330] rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
      <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Ajouter des options</h3>
        <button @click="showAddOptionModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </button>
      </div>
      <div class="p-4 overflow-y-auto space-y-4">
        <div v-for="(opt, index) in newOptions" :key="opt.id" class="flex items-center gap-2">
          <input 
            v-model="opt.name" 
            type="text" 
            placeholder="Nom de l'option (ex: Siège Bébé)" 
            class="flex-1 px-4 py-2 bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
            @keyup.enter="index === newOptions.length - 1 ? addOptionField() : null"
          />
          <button 
            v-if="newOptions.length > 1"
            @click="removeOptionField(index)" 
            class="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
          </button>
        </div>
        <button @click="addOptionField" class="text-sm font-medium text-[#fa5b0f] hover:text-orange-500 flex items-center gap-1">+ Ajouter une autre option</button>
      </div>
      <div class="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1C1C1C] flex justify-end gap-3">
        <button @click="showAddOptionModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Annuler</button>
        <button @click="confirmAddOptions" class="px-4 py-2 bg-[#fa5b0f] hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">Enregistrer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'
import { useCarStore } from '../stores/carStore'
import { useChargeStore } from '../stores/chargeStore'
import { useAgencyStore } from '../stores/agencyStore'
import { useClientStore } from '../stores/clientStore'
import { useBrandStore } from '../stores/brandStore'
import { useModelStore } from '../stores/modelStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useEntretienStore } from '../stores/entretienStore'
import { useEntretienTypeStore } from '../stores/entretienTypeStore'
import { useContratStore } from '../stores/contratStore'

const route = useRoute()
const carStore = useCarStore()
const chargeStore = useChargeStore()
const agencyStore = useAgencyStore()
const clientStore = useClientStore()
const brandStore = useBrandStore()
const modelStore = useModelStore()
const settingsStore = useSettingsStore()
const entretienStore = useEntretienStore()
const typeStore = useEntretienTypeStore()
const contratStore = useContratStore()

// Initialize agency and client store to fetch mappings
agencyStore.initializeFromStorage()
clientStore.initializeFromStorage()
brandStore.initializeFromStorage()
modelStore.initializeFromStorage()
settingsStore.initializeFromStorage()
entretienStore.initializeFromStorage()
typeStore.initializeFromStorage()

const carId = route.params.id
const car = ref(null)
const imgError = ref(false)
const activeTab = ref('informations')

const tabs = [
  { id: 'informations', label: 'Informations' },
  { id: 'contrats', label: 'Contrats' },
  { id: 'charges', label: 'Charges' },
  { id: 'maintenance', label: 'Maintenance' },
  //{ id: 'dommages', label: 'Dommages' }
]

const currentImageIndex = ref(0)

const nextImage = () => {
  if (car.value && car.value.images && car.value.images.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % car.value.images.length
  }
}

const prevImage = () => {
  if (car.value && car.value.images && car.value.images.length > 0) {
    currentImageIndex.value = currentImageIndex.value === 0 
      ? car.value.images.length - 1 
      : currentImageIndex.value - 1
  }
}

onMounted(() => {
  // Wait to ensure stores are hydrated before fetching logic
  setTimeout(() => {
    car.value = carStore.getCarById(carId) || null
    currentImageIndex.value = 0
  }, 100)
})

// Options logic
const showAddOptionModal = ref(false)
const newOptions = ref([{ id: Date.now(), name: '' }])

const openAddOptionModal = () => {
  newOptions.value = [{ id: Date.now(), name: '' }]
  showAddOptionModal.value = true
}

const addOptionField = () => {
  newOptions.value.push({ id: Date.now() + Math.random(), name: '' })
}

const removeOptionField = (index) => {
  newOptions.value.splice(index, 1)
}

const confirmAddOptions = () => {
  const validOptions = newOptions.value.filter(o => o.name.trim() !== '')
  if (validOptions.length > 0) {
    if (!car.value.options) {
      car.value.options = []
    }
    validOptions.forEach(opt => {
      car.value.options.push({
        id: opt.id,
        name: opt.name.trim(),
        enabled: true,
        price: 0
      })
    })
    saveCar()
  }
  showAddOptionModal.value = false
}

const removeOption = (index) => {
  if (car.value && car.value.options) {
    car.value.options.splice(index, 1)
    saveCar()
  }
}

const saveCar = () => {
  if (car.value) {
    carStore.updateCar(car.value)
  }
}

// Formatting
const formatCurrency = (val) => new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(val || 0)

const formatDateOnly = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR');
};

const getClientName = (clientId) => {
  if (!clientId) return 'Unknown';
  const client = clientStore.getClientById(clientId) || clientStore.clients.find(c => c.nationalId === clientId);
  return client ? `${client.firstName} ${client.lastName}` : clientId;
};

const getBrandName = (brandId) => {
  if (!brandId) return 'Marque Inconnue';
  const brand = brandStore.getBrandById(brandId);
  return brand ? brand.name : 'Marque Inconnue';
};

const getModelName = (modelId) => {
  if (!modelId) return 'Modèle Inconnu';
  const model = modelStore.getModelById(modelId);
  return model ? model.name : 'Modèle Inconnu';
};

// Alert Logic Processors
const getVidangeStatus = () => {
  if (!car.value) return {};
  const current = car.value.currentMileage || 0;
  const next = car.value.nextVidangeKm || 0;
  const last = car.value.lastVidangeKm || 0;
  
  const totalInterval = next - last;
  const elapsed = current - last;
  let progress = totalInterval > 0 ? (elapsed / totalInterval) * 100 : 0;
  progress = Math.min(Math.max(progress, 0), 100);
  
  const remaining = next - current;

  if (next === 0 && last === 0) return { label: 'Pas de données', borderClass: 'border-gray-200 dark:border-gray-800', bgClass: 'bg-gray-100 dark:bg-gray-800', textClass: 'text-gray-500', iconClass: 'text-gray-500', progress: 0, progressClass: 'bg-gray-400' };

  const kmThreshold = settingsStore.alertThresholds?.kmAvantEntretien || 1000;

  if (remaining <= 0) {
    return { label: 'Dépassement de ' + Math.abs(remaining) + 'km', borderClass: 'border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-900/10', bgClass: 'bg-red-100 dark:bg-red-900/30', textClass: 'text-red-600 dark:text-red-400', iconClass: 'text-red-600 dark:text-red-400', progress: 100, progressClass: 'bg-red-500' };
  } else if (remaining <= kmThreshold) {
    return { label: 'Bientôt: ' + remaining + 'km', borderClass: 'border-amber-200 dark:border-amber-900/40', bgClass: 'bg-amber-100 dark:bg-amber-900/30', textClass: 'text-amber-600 dark:text-amber-400', iconClass: 'text-amber-600 dark:text-amber-400', progress, progressClass: 'bg-amber-500' };
  } else {
    return { label: 'À jour', borderClass: 'border-emerald-200 dark:border-emerald-900/40', bgClass: 'bg-emerald-100 dark:bg-emerald-900/30', textClass: 'text-emerald-600 dark:text-emerald-400', iconClass: 'text-emerald-600 dark:text-emerald-400', progress, progressClass: 'bg-emerald-500' };
  }
};

const getDateStatus = (dateStr, thresholdDays) => {
  if (!dateStr) return { label: 'Manquant', borderClass: 'border-gray-200 dark:border-gray-800', bgClass: 'bg-gray-100 dark:bg-gray-800', textClass: 'text-gray-500', iconClass: 'text-gray-500' };
  
  const end = new Date(dateStr);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: 'Expiré (depuis ' + Math.abs(diffDays) + 'j)', borderClass: 'border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-900/10', bgClass: 'bg-red-100 dark:bg-red-900/30', textClass: 'text-red-600 dark:text-red-400', iconClass: 'text-red-600 dark:text-red-400' };
  } else if (diffDays <= thresholdDays) {
    return { label: 'Expire dans ' + diffDays + 'j', borderClass: 'border-amber-200 dark:border-amber-900/40', bgClass: 'bg-amber-100 dark:bg-amber-900/30', textClass: 'text-amber-600 dark:text-amber-400', iconClass: 'text-amber-600 dark:text-amber-400' };
  } else {
    return { label: 'Valide (' + diffDays + 'j)', borderClass: 'border-emerald-200 dark:border-emerald-900/40', bgClass: 'bg-emerald-100 dark:bg-emerald-900/30', textClass: 'text-emerald-600 dark:text-emerald-400', iconClass: 'text-emerald-600 dark:text-emerald-400' };
  }
};

const carReservations = computed(() => {
  const allRes = [...(carStore.reservations || []), ...(carStore.completedReservations || [])].map(r => ({
     ...r,
     isContrat: false
  }))
  const allContrats = (contratStore.filteredContrats || []).map(c => ({
     ...c,
     id: c.id || c.numero, 
     startDate: c.dateSortie,
     endDate: c.dateRetour,
     totalPrice: c.total,
     status: c.etat === 'En cours' ? 'En cours' : (c.etat === 'Retournée' ? 'Completed' : 'Annulé'),
     isContrat: true
  }))
  const combined = [...allRes, ...allContrats]
  return combined.filter(r => r.carId === carId || r.carId === car.value?.licensePlate)
})

const carCharges = computed(() => {
  return (chargeStore.getAllCharges || []).filter(c => c.carId === carId || c.carId === car.value?.licensePlate).sort((a,b) => new Date(b.date) - new Date(a.date))
})

const customMaintenanceAlerts = computed(() => {
  if (!car.value) return [];
  const list = [];
  const allLogs = entretienStore.filteredEntretiens.filter(e => e.carId === car.value.id || e.carId === car.value.licensePlate);
  
  // Find latest log per type mathematically
  const latestLogs = {};
  allLogs.forEach(log => {
     if (!latestLogs[log.typeId] || new Date(log.date) > new Date(latestLogs[log.typeId].date)) {
       latestLogs[log.typeId] = log;
     }
  });

  Object.values(latestLogs).forEach(log => {
    const tConfig = typeStore.getTypeById(log.typeId);
    if (!tConfig) return;
    if (tConfig.name.toLowerCase().includes('vidange')) return; // Already handled by hardcoded Vidange block
    
    // Check if it's an actionable alert type
    if (tConfig.alertKm && log.nextKm) {
        list.push({ ...log, config: tConfig, triggerMode: 'km' })
    } else if (tConfig.alertDate && log.nextDate) {
        list.push({ ...log, config: tConfig, triggerMode: 'date' })
    }
  });

  return list;
});

const getCustomStatus = (alert) => {
  if (alert.triggerMode === 'km') {
      const current = car.value?.currentMileage || 0;
      const next = alert.nextKm || 0;
      const remaining = next - current;
      const kmThreshold = settingsStore.alertThresholds?.kmAvantEntretien || 1000;
      
      if (remaining <= 0) {
        return { label: 'Dépassement de ' + Math.abs(remaining) + 'km', borderClass: 'border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-900/10', bgClass: 'bg-red-100 dark:bg-red-900/30', textClass: 'text-red-600 dark:text-red-400', iconClass: 'text-red-600 dark:text-red-400' };
      } else if (remaining <= kmThreshold) {
        return { label: 'Bientôt: ' + remaining + 'km', borderClass: 'border-amber-200 dark:border-amber-900/40', bgClass: 'bg-amber-100 dark:bg-amber-900/30', textClass: 'text-amber-600 dark:text-amber-400', iconClass: 'text-amber-600 dark:text-amber-400' };
      } else {
        return { label: 'À jour: ' + remaining + 'km restants', borderClass: 'border-emerald-200 dark:border-emerald-900/40', bgClass: 'bg-emerald-100 dark:bg-emerald-900/30', textClass: 'text-emerald-600 dark:text-emerald-400', iconClass: 'text-emerald-600 dark:text-emerald-400' };
      }
  } else {
      // Date mode
      const res = getDateStatus(alert.nextDate, settingsStore.alertThresholds?.entretienParDate || 15);
      // Clean up negative days logic from default getDateStatus if needed, but it works fine natively
      return res;
  }
}

const totalRevenue = computed(() => {
  return carReservations.value.reduce((sum, res) => sum + (res.totalPrice || 0), 0)
})

const totalCharges = computed(() => {
  return carCharges.value.reduce((sum, charge) => sum + (charge.amount || 0), 0)
})

const netProfit = computed(() => totalRevenue.value - totalCharges.value)

// Profitability Chart Config
const profitSeries = computed(() => [{
  name: 'Montant',
  data: [totalRevenue.value, totalCharges.value]
}])

const profitChartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif'
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '45%',
      distributed: true,
    }
  },
  colors: ['#22C55E', '#EF4444'], // Green for Revenue, Red for Charges
  dataLabels: { enabled: false },
  legend: { show: false },
  xaxis: {
    categories: ['Total Revenus', 'Total Charges'],
    labels: { style: { colors: '#64748B', fontSize: '12px', fontWeight: 500 } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { 
      style: { colors: '#94A3B8' },
      formatter: (val) => val.toLocaleString()
    }
  },
  grid: {
    borderColor: '#1E2330',
    strokeDashArray: 4
  },
  tooltip: {
    theme: 'dark',
    y: { formatter: (val) => val.toLocaleString() + " MAD" }
  }
})
</script>

<style scoped>
/* Optional minimal styling overrides */
</style>
