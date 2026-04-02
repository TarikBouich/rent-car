<template>
  <div class="p-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-inter">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Financial Statistics</h1>
      <div class="flex gap-4 items-center">
        <!-- Admin Agency Filter -->
        <div v-if="userStore.isAdmin" class="relative">
          <select v-model="selectedAgency" class="appearance-none bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#fa5b0f] cursor-pointer">
            <option value="all">Toutes les agences</option>
            <option v-for="agency in agencyStore.agencies" :key="agency.id" :value="agency.id">{{ agency.name }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
        <!-- Time Filter -->
        <div class="relative">
          <select class="appearance-none bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#fa5b0f] cursor-pointer">
            <option>12 derniers mois</option>
            <option>Ce mois-ci</option>
            <option>7 derniers jours</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex space-x-8 mb-6 border-b border-gray-200 dark:border-gray-800">
      <button @click="activeTab = 'statistiques'" :class="activeTab === 'statistiques' ? 'pb-2 text-sm font-semibold border-b-2 border-[#fa5b0f] text-[#fa5b0f]' : 'pb-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-300'">Statistiques</button>
      <button @click="activeTab = 'revenus'" :class="activeTab === 'revenus' ? 'pb-2 text-sm font-semibold border-b-2 border-[#fa5b0f] text-[#fa5b0f]' : 'pb-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-300'">Revenus</button>
      <button @click="activeTab = 'agences'" :class="activeTab === 'agences' ? 'pb-2 text-sm font-semibold border-b-2 border-[#fa5b0f] text-[#fa5b0f]' : 'pb-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-300'">Charges Agences</button>
      <button @click="activeTab = 'voitures'" :class="activeTab === 'voitures' ? 'pb-2 text-sm font-semibold border-b-2 border-[#fa5b0f] text-[#fa5b0f]' : 'pb-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-300'">Charges Voitures</button>
      <button @click="activeTab = 'tresorerie'" :class="activeTab === 'tresorerie' ? 'pb-2 text-sm font-semibold border-b-2 border-[#fa5b0f] text-[#fa5b0f]' : 'pb-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-300'">Trésorerie</button>
    </div>

    <!-- Financial Summary -->
    <div v-if="activeTab === 'statistiques'" class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <!-- Revenu Card -->
        <div class="bg-white dark:bg-[#1E2330] rounded-xl p-6 border-l-4 border-green-500 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <span class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Total Revenu</span>
          <span class="text-4xl font-bold text-green-500 tracking-tight">{{ formatCurrency(totalRevenue) }}</span>
        </div>
        <!-- Dépenses Card -->
        <div class="bg-white dark:bg-[#1E2330] rounded-xl p-6 border-l-4 border-red-500 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <span class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Total Dépenses</span>
          <span class="text-4xl font-bold text-red-500 tracking-tight">{{ formatCurrency(totalAgencyCharges + totalCarCharges) }}</span>
        </div>
      </div>
      <!-- Net Profit -->
      <div class="bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex items-center justify-between">
        <span class="text-base font-semibold text-gray-700 dark:text-gray-300">Net Profit (Revenu - Dépenses)</span>
        <span class="text-3xl font-bold text-[#fa5b0f] tracking-tight">{{ formatCurrency(netProfit) }}</span>
      </div>
    </div>

    <!-- Charts Row -->
    <div v-if="activeTab === 'statistiques'" class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Area Chart -->
      <div class="lg:col-span-3 bg-white dark:bg-[#1E2330] rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Revenu vs Dépenses</h2>
          <div class="relative">
            <select class="appearance-none bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-md px-3 py-1 pr-6 text-xs text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer focus:outline-none">
              <option>12 mois</option>
              <option>6 mois</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500 dark:text-gray-400">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
        <VueApexCharts type="area" height="300" :options="areaOptions" :series="areaSeries"></VueApexCharts>
      </div>

      <!-- Donut Chart -->
      <!-- <div class="bg-white dark:bg-[#1E2330] rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Répartition des Charges</h2>
        <div class="flex-1 flex items-center justify-center relative">
          <VueApexCharts type="donut" width="100%" height="300" :options="donutOptions" :series="donutSeries"></VueApexCharts>
        </div>
      </div> -->
    </div>

    <!-- Table Section -->
    <div v-if="activeTab === 'revenus'" class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col mb-6">
      <div class="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">Liste des Revenus</h2>
        <div class="relative w-64">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input type="text" placeholder="Rechercher" class="bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 rounded-lg focus:ring-[#fa5b0f] focus:border-[#fa5b0f] block w-full pl-9 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
        </div>
      </div>
      
      <div class="overflow-x-auto without-scrollbar pb-6 w-full">
        <table class="w-full text-left border-collapse min-w-max">
          <thead>
            <tr class="bg-white dark:bg-[#1C1C1C]">
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Référence</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Client</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Date</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Montant</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Mode de Paiement</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Statut</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Matricule</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr v-for="row in tableData" :key="row.ref" class="hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors">
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{{ row.ref }}</td>
              <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{{ row.client }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{{ row.date }}</td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{{ row.montant }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center text-sm text-gray-700 dark:text-gray-300 gap-2">
                  <component :is="row.paymentIcon" class="w-4 h-4"></component>
                  {{ row.paymentMode }}
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-2.5 py-1 text-xs font-medium rounded-full" :class="row.statusClass">{{ row.status }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{{ row.matricule }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Charges Agences Section -->
    <div v-if="activeTab === 'agences'" class="space-y-6">
      <!-- Form to Add -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ editingChargeId ? "Modifier la charge d'agence" : "Ajouter une charge d'agence" }}</h2>
        <form @submit.prevent="submitAgencyCharge" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agence</label>
            <select v-model="agencyChargeForm.agencyId" required class="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-[#fa5b0f] focus:border-[#fa5b0f]">
              <option value="" disabled selected>Sélectionner une agence</option>
              <option v-for="agency in agencyStore.agencies" :key="agency.id" :value="agency.id">{{ agency.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Montant (DH)</label>
            <input type="number" v-model.number="agencyChargeForm.amount" required min="0" step="0.01" class="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-[#fa5b0f] focus:border-[#fa5b0f]">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paiement</label>
            <select v-model="agencyChargeForm.paymentMethod" required class="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-[#fa5b0f] focus:border-[#fa5b0f]">
              <option value="espece">Espèces</option>
              <option value="virement">Virement</option>
              <option value="carte bancaire">Carte Bancaire</option>
              <option value="cheque">Chèque</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input type="text" v-model="agencyChargeForm.description" required placeholder="Loyer, électricité, eau..." class="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-[#fa5b0f] focus:border-[#fa5b0f]">
          </div>
          <div class="md:col-span-3 flex items-center justify-end gap-3">
            <button v-if="editingChargeId" type="button" @click="cancelAgencyEdit" class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">Annuler</button>
            <button type="submit" class="px-6 py-2 bg-[#fa5b0f] text-white rounded-[8px] text-sm font-medium hover:bg-orange-600 transition-colors">{{ editingChargeId ? 'Enregistrer' : 'Ajouter la charge' }}</button>
          </div>
        </form>
      </div>

      <!-- List -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-gray-200 dark:border-gray-800"><h2 class="text-base font-semibold text-gray-900 dark:text-white">Historique des charges d'agences</h2></div>
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse min-w-max">
            <thead>
              <tr class="bg-white dark:bg-[#1C1C1C]">
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Date</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Agence</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Description</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Montant</th>
                <th v-if="userStore.isAdmin" class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              <tr v-for="charge in agencyChargesList" :key="charge.id" class="hover:bg-gray-200 dark:hover:bg-gray-800/50">
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ new Date(charge.date).toLocaleDateString() }}</td>
                <td class="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{{ agencyStore.getAgencyById(charge.agencyId)?.name || charge.agencyId }}</td>
                <td class="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{{ charge.description }}</td>
                <td class="px-4 py-3 text-sm font-medium text-amber-500">{{ formatCurrency(charge.amount) }}</td>
                <td v-if="userStore.isAdmin" class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="editAgencyCharge(charge)" class="text-blue-500 hover:text-blue-700 mx-2 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button @click="deleteAgencyCharge(charge.id)" class="text-red-500 hover:text-red-700 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
              <tr v-if="agencyChargesList.length === 0">
                <td :colspan="userStore.isAdmin ? 5 : 4" class="px-4 py-8 text-center text-gray-500">Aucune charge d'agence trouvée.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Charges Voitures Section -->
    <div v-if="activeTab === 'voitures'" class="space-y-6">
      <!-- Form to Add -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ajouter une charge de voiture</h2>
        <form @submit.prevent="submitCarCharge" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type de charge</label>
            <select v-model="carChargeForm.chargeType" required class="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-[#fa5b0f] focus:border-[#fa5b0f]">
              <option value="panne">Panne</option>
              <option value="visite technique">Visite technique</option>
              <option value="vidange">Vidange</option>
              <option value="other">Autre / Global</option>
            </select>
          </div>
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Voiture concernée</label>
            <div 
              @click="isCarDropdownOpen = !isCarDropdownOpen"
              class="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-[#fa5b0f] focus:border-[#fa5b0f] cursor-pointer flex items-center justify-between"
              tabindex="0"
              @blur="closeCarDropdown"
            >
              <div v-if="carChargeForm.carId" class="flex items-center gap-2">
                <span class="truncate">{{ getFullCarName(carStore.getCarById(carChargeForm.carId)) }}</span>
                <span 
                  class="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm block shrink-0"
                  :style="{ backgroundColor: carStore.getCarById(carChargeForm.carId)?.color || '#000000' }"
                ></span>
              </div>
              <span v-else class="text-gray-500">Sélectionner voiture</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div 
              v-if="isCarDropdownOpen" 
              class="absolute z-[60] w-full mt-1 bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <div 
                class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-sm text-gray-500"
                @mousedown.prevent="carChargeForm.carId = ''; isCarDropdownOpen = false"
              >
                Aucune (Optionnel pour Global)
              </div>
              <div 
                v-for="car in carStore.cars" 
                :key="car.id"
                @mousedown.prevent="carChargeForm.carId = car.id; isCarDropdownOpen = false"
                class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center gap-2 text-sm text-gray-900 dark:text-white"
              >
                <span class="truncate">{{ getFullCarName(car) }}</span>
                <span 
                  class="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm block shrink-0"
                  :style="{ backgroundColor: car.color || '#000000' }"
                ></span>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Montant (DH)</label>
            <input type="number" v-model.number="carChargeForm.amount" required min="0" step="0.01" class="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-[#fa5b0f] focus:border-[#fa5b0f]">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paiement</label>
            <select v-model="carChargeForm.paymentMethod" required class="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-[#fa5b0f] focus:border-[#fa5b0f]">
              <option value="espece">Espèces</option>
              <option value="virement">Virement</option>
              <option value="carte bancaire">Carte Bancaire</option>
              <option value="cheque">Chèque</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input type="text" v-model="carChargeForm.description" required placeholder="Réparation moteur..." class="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-[#fa5b0f] focus:border-[#fa5b0f]">
          </div>
          <div class="md:col-span-4 flex justify-end">
            <button type="submit" class="px-6 py-2 bg-[#fa5b0f] text-white rounded-[8px] text-sm font-medium hover:bg-orange-600 transition-colors">Ajouter la charge</button>
          </div>
        </form>
      </div>

      <!-- List -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-gray-200 dark:border-gray-800"><h2 class="text-base font-semibold text-gray-900 dark:text-white">Historique des charges de voitures</h2></div>
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse min-w-max">
            <thead>
              <tr class="bg-white dark:bg-[#1C1C1C]">
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Date</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Type</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Voiture</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Description</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Montant</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              <tr v-for="charge in carChargesList" :key="charge.id" class="hover:bg-gray-200 dark:hover:bg-gray-800/50">
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ new Date(charge.date).toLocaleDateString() }}</td>
                <td class="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 uppercase font-bold" :class="charge.chargeType === 'panne' ? 'text-red-500' : 'text-blue-500'">{{ charge.chargeType === 'other' ? 'Global' : charge.chargeType }}</td>
                <td class="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                  <div v-if="charge.carId" class="flex items-center gap-2">
                    <span>{{ getFullCarName(carStore.getCarById(charge.carId)) }}</span>
                    <span 
                      class="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm block shrink-0"
                      :style="{ backgroundColor: carStore.getCarById(charge.carId)?.color || '#000000' }"
                    ></span>
                  </div>
                  <span v-else>Global</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{{ charge.description }}</td>
                <td class="px-4 py-3 text-sm font-medium text-rose-500">{{ formatCurrency(charge.amount) }}</td>
              </tr>
              <tr v-if="carChargesList.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-gray-500">Aucune charge de voiture trouvée.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div> <!-- Close activeTab === voitures -->

    <!-- Trésorerie Section -->
    <div v-if="activeTab === 'tresorerie'" class="space-y-6">
      <!-- Global Insight -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white dark:bg-[#1E2330] rounded-xl p-6 border-t-4 border-[#10B981] shadow-sm flex flex-col items-center justify-center text-center">
          <span class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Total Solde Caisse (Espèces)</span>
          <span class="text-3xl font-bold text-[#10B981]">{{ formatCurrency(treasuryTotals.especes) }}</span>
        </div>
        <div class="bg-white dark:bg-[#1E2330] rounded-xl p-6 border-t-4 border-[#3B82F6] shadow-sm flex flex-col items-center justify-center text-center">
          <span class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Total Solde Banque</span>
          <span class="text-3xl font-bold text-[#3B82F6]">{{ formatCurrency(treasuryTotals.banque) }}</span>
        </div>
        <div class="bg-white dark:bg-[#1E2330] rounded-xl p-6 border-t-4 border-[#fa5b0f] shadow-sm flex flex-col items-center justify-center text-center">
          <span class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Disponibilité Globale</span>
          <span class="text-4xl font-bold text-[#fa5b0f]">{{ formatCurrency(treasuryTotals.total) }}</span>
        </div>
      </div>

      <!-- Breakdown Table -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-6">
        <div class="p-5 border-b border-gray-200 dark:border-gray-800"><h2 class="text-base font-semibold text-gray-900 dark:text-white">Répartition par Agence</h2></div>
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse min-w-max">
            <thead>
              <tr class="bg-gray-50 dark:bg-[#1C1C1C]">
                <th class="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">Agence</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 text-right">Solde Caisse (Net Espèces)</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 text-right">Solde Compte (Net Banque)</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 text-right">Trésorerie Agence</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <template v-for="t in treasuryData" :key="t.id">
                <tr class="hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer transition-colors" @click="toggleAgencyDetails(t.id)">
                  <td class="px-6 py-5 text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg :class="{'rotate-90': expandedAgencies.includes(t.id)}" class="w-4 h-4 transition-transform text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    {{ t.name }}
                  </td>
                  <td class="px-6 py-5 text-sm text-right font-medium" :class="t.netEspeces >= 0 ? 'text-[#10B981]' : 'text-rose-500'">{{ formatCurrency(t.netEspeces) }}</td>
                  <td class="px-6 py-5 text-sm text-right font-medium" :class="t.netBanque >= 0 ? 'text-[#3B82F6]' : 'text-rose-500'">{{ formatCurrency(t.netBanque) }}</td>
                  <td class="px-6 py-5 text-base text-right font-bold text-[#fa5b0f]">{{ formatCurrency(t.totalNet) }}</td>
                </tr>
                
                <!-- Expanded Details Row -->
                <tr v-if="expandedAgencies.includes(t.id)" class="bg-gray-50/80 dark:bg-[#151923]/50">
                  <td colspan="4" class="px-6 py-6 border-b border-gray-200 dark:border-gray-800">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm max-w-4xl">
                      <!-- Espèce Details -->
                      <div class="space-y-4">
                        <h4 class="font-bold text-gray-400 dark:text-gray-500 uppercase text-[11px] tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          Décomposition Caisse (Espèces)
                        </h4>
                        <div class="flex justify-between text-gray-600 dark:text-gray-300">
                          <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-emerald-300"></div> Solde Initial Assigné</span> 
                          <span class="font-medium">{{ formatCurrency(t.details.initialEspece) }}</span>
                        </div>
                        <div class="flex justify-between text-gray-600 dark:text-gray-300">
                          <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> (+) Réservations Payées en Espèce</span> 
                          <span class="font-medium text-emerald-600 dark:text-emerald-400">{{ formatCurrency(t.details.reservationsEspece) }}</span>
                        </div>
                        <div class="flex justify-between text-gray-600 dark:text-gray-300">
                          <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-teal-500"></div> (+) Contrats Payés en Espèce</span> 
                          <span class="font-medium text-emerald-600 dark:text-emerald-400">{{ formatCurrency(t.details.contratsEspece) }}</span>
                        </div>
                        <div class="flex justify-between text-gray-600 dark:text-gray-300">
                          <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-rose-500"></div> (-) Dépenses de Flotte (Entretiens...)</span> 
                          <span class="font-bold text-rose-500">-{{ formatCurrency(t.details.chargesVoituresEspece) }}</span>
                        </div>
                        <div class="flex justify-between text-gray-600 dark:text-gray-300">
                          <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-red-400"></div> (-) Dépenses de l'Agence</span> 
                          <span class="font-bold text-rose-500">-{{ formatCurrency(t.details.chargesAgenceEspece) }}</span>
                        </div>
                        
                        <div class="pt-2 border-t border-gray-200 dark:border-gray-700/50 flex justify-between">
                           <span class="text-xs font-bold text-gray-500">TOTAL CAISSE</span>
                           <span class="font-black" :class="t.netEspeces >= 0 ? 'text-[#10B981]' : 'text-rose-500'">{{ formatCurrency(t.netEspeces) }}</span>
                        </div>
                      </div>
                      
                      <!-- Banque Details -->
                      <div class="space-y-4">
                        <h4 class="font-bold text-gray-400 dark:text-gray-500 uppercase text-[11px] tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                          Décomposition Compte (Banque)
                        </h4>
                        <div class="flex justify-between text-gray-600 dark:text-gray-300">
                          <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-blue-300"></div> Solde Initial Bancaire</span> 
                          <span class="font-medium">{{ formatCurrency(t.details.initialBanque) }}</span>
                        </div>
                        <div class="flex justify-between text-gray-600 dark:text-gray-300">
                          <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> (+) Réservations CB/Virement</span> 
                          <span class="font-medium text-blue-600 dark:text-blue-400">{{ formatCurrency(t.details.reservationsBanque) }}</span>
                        </div>
                        <div class="flex justify-between text-gray-600 dark:text-gray-300">
                          <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> (+) Contrats CB/Virement</span> 
                          <span class="font-medium text-blue-600 dark:text-blue-400">{{ formatCurrency(t.details.contratsBanque) }}</span>
                        </div>
                        <div class="flex justify-between text-gray-600 dark:text-gray-300">
                          <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-orange-500"></div> (-) Dépenses de Flotte en Banque</span> 
                          <span class="font-bold text-rose-500">-{{ formatCurrency(t.details.chargesVoituresBanque) }}</span>
                        </div>
                        <div class="flex justify-between text-gray-600 dark:text-gray-300">
                          <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-orange-400"></div> (-) Dépenses de l'Agence en Banque</span> 
                          <span class="font-bold text-rose-500">-{{ formatCurrency(t.details.chargesAgenceBanque) }}</span>
                        </div>

                        <div class="pt-2 border-t border-gray-200 dark:border-gray-700/50 flex justify-between">
                           <span class="text-xs font-bold text-gray-500">TOTAL BANQUE</span>
                           <span class="font-black" :class="t.netBanque >= 0 ? 'text-[#3B82F6]' : 'text-rose-500'">{{ formatCurrency(t.netBanque) }}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="treasuryData.length === 0">
                <td colspan="4" class="px-6 py-10 text-center text-gray-500">Aucune donnée de trésorerie disponible.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { Cash, CreditCard } from '@iconoir/vue'
import { useCarStore } from '../stores/carStore'
import { useChargeStore } from '../stores/chargeStore'
import { useClientStore } from '../stores/clientStore'
import { useAgencyStore } from '../stores/agencyStore'
import { useUserStore } from '../stores/userStore'
import { useBrandStore } from '../stores/brandStore'
import { useModelStore } from '../stores/modelStore'
import { useTransactionStore } from '../stores/transactionStore'
import { useContratStore } from '../stores/contratStore'

const carStore = useCarStore()
const chargeStore = useChargeStore()
const clientStore = useClientStore()
const contratStore = useContratStore()
const agencyStore = useAgencyStore()
const userStore = useUserStore()
const brandStore = useBrandStore()
const modelStore = useModelStore()
const transactionStore = useTransactionStore()

const expandedAgencies = ref([])
const toggleAgencyDetails = (id) => {
  if (expandedAgencies.value.includes(id)) {
    expandedAgencies.value = expandedAgencies.value.filter(aid => aid !== id)
  } else {
    expandedAgencies.value.push(id)
  }
}

onMounted(() => {
  agencyStore.initializeFromStorage()
  userStore.initializeFromStorage()
  brandStore.initializeFromStorage()
  modelStore.initializeFromStorage()
  transactionStore.initializeFromStorage()
})

const colorNamesMap = {
  '#000000': 'Noir',
  '#ffffff': 'Blanc',
  '#ff0000': 'Rouge',
  '#00ff00': 'Vert',
  '#0000ff': 'Bleu',
  '#ffff00': 'Jaune',
  '#ffa500': 'Orange',
  '#808080': 'Gris',
  '#c0c0c0': 'Argent',
  '#800080': 'Violet',
  '#a52a2a': 'Marron',
  '#ffc0cb': 'Rose',
  '#000': 'Noir',
  '#fff': 'Blanc',
  '#f00': 'Rouge',
  '#0f0': 'Vert',
  '#00f': 'Bleu'
}

const getColorName = (hex) => {
  if (!hex) return 'Inconnue'
  const normalized = hex.toLowerCase()
  return colorNamesMap[normalized] || hex
}

const getFullCarName = (car) => {
  if (!car) return 'Voiture Introuvable'
  const brand = brandStore.getBrandById(car.brandId)
  const model = modelStore.getModelById(car.modelId)
  const brandName = brand ? brand.name : ''
  const modelName = model ? model.name : ''
  return `${brandName} ${modelName}(${car.licensePlate || 'Sans Matricule'})`
}

const formatCurrency = (val) => new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(val)

const activeTab = ref('statistiques')
const selectedAgency = ref('all') // Admin specific agency filter

const isCarDropdownOpen = ref(false)

const closeCarDropdown = () => {
  setTimeout(() => {
    isCarDropdownOpen.value = false
  }, 150)
}

// Local Filtered Arrays
const localReservations = computed(() => {
   const res = carStore.filteredReservations || []
   if (selectedAgency.value === 'all') return res
   const cars = carStore.cars.filter(c => c.agencyId === selectedAgency.value).map(c => c.id)
   return res.filter(r => cars.includes(r.carId))
})

const localCompletedReservations = computed(() => {
   const res = carStore.filteredCompletedReservations || []
   if (selectedAgency.value === 'all') return res
   const cars = carStore.cars.filter(c => c.agencyId === selectedAgency.value).map(c => c.id)
   return res.filter(r => cars.includes(r.carId))
})

const localContrats = computed(() => {
   const contrats = contratStore.filteredContrats || []
   if (selectedAgency.value === 'all') return contrats
   return contrats.filter(c => c.agencyId === selectedAgency.value)
})

const localCharges = computed(() => {
   const charges = chargeStore.filteredCharges || []
   if (selectedAgency.value === 'all') return charges
   return charges.filter(c => {
      if (c.type === 'agency') return c.agencyId === selectedAgency.value
      // If car charge, verify car belongs to agency
      if (c.type === 'car' && c.carId) {
         const car = carStore.getCarById(c.carId)
         return car && car.agencyId === selectedAgency.value
      }
      return false
   })
})

// Agency state
const editingChargeId = ref(null)
const agencyChargeForm = ref({
  agencyId: '',
  amount: null,
  description: '',
  paymentMethod: 'espece'
})

const carChargeForm = ref({
  chargeType: 'panne',
  carId: '',
  amount: null,
  description: '',
  paymentMethod: 'espece'
})

const submitAgencyCharge = () => {
  if (!agencyChargeForm.value.agencyId || !agencyChargeForm.value.amount || !agencyChargeForm.value.description) return
  
  if (editingChargeId.value) {
    chargeStore.updateCharge({
      id: editingChargeId.value,
      agencyId: agencyChargeForm.value.agencyId,
      amount: agencyChargeForm.value.amount,
      description: agencyChargeForm.value.description
    })
    editingChargeId.value = null
  } else {
    chargeStore.addCharge({
      type: 'agency',
      agencyId: agencyChargeForm.value.agencyId,
      amount: agencyChargeForm.value.amount,
      description: agencyChargeForm.value.description,
      paymentMethod: agencyChargeForm.value.paymentMethod,
      date: new Date().toISOString()
    })
    
    // Auto-Log transaction
    transactionStore.addTransaction({
      amount: agencyChargeForm.value.amount,
      type: 'expense',
      method: agencyChargeForm.value.paymentMethod,
      reason: `Charge Agence: ${agencyChargeForm.value.description}`,
      subType: agencyChargeForm.value.paymentMethod,
      agencyId: agencyChargeForm.value.agencyId
    })
  }
  
  agencyChargeForm.value = { agencyId: '', amount: null, description: '', paymentMethod: 'espece' }
}

const editAgencyCharge = (charge) => {
  editingChargeId.value = charge.id
  agencyChargeForm.value = {
    agencyId: charge.agencyId,
    amount: charge.amount,
    description: charge.description,
    paymentMethod: 'espece'
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelAgencyEdit = () => {
  editingChargeId.value = null
  agencyChargeForm.value = { agencyId: '', amount: null, description: '', paymentMethod: 'espece' }
}

const deleteAgencyCharge = (id) => {
  if (confirm('Voulez-vous vraiment supprimer cette charge ?')) {
    chargeStore.deleteCharge(id)
  }
}

const submitCarCharge = () => {
  if (!carChargeForm.value.amount || !carChargeForm.value.description) return
  
  chargeStore.addCharge({
    type: 'car',
    chargeType: carChargeForm.value.chargeType,
    carId: carChargeForm.value.carId || null,
    amount: carChargeForm.value.amount,
    description: carChargeForm.value.description,
    paymentMethod: carChargeForm.value.paymentMethod,
    date: new Date().toISOString()
  })

  // Determine Agency for Transaction based on selected Car or Active User Default fallback
  const cTarget = carChargeForm.value.carId ? carStore.getCarById(carChargeForm.value.carId) : null
  const fallbackId = cTarget ? cTarget.agencyId : (agencyStore.agencies[0]?.id || '')

  transactionStore.addTransaction({
    amount: carChargeForm.value.amount,
    type: 'expense',
    method: carChargeForm.value.paymentMethod,
    reason: `Charge Voiture (${carChargeForm.value.chargeType}): ${carChargeForm.value.description}`,
    subType: carChargeForm.value.paymentMethod,
    agencyId: fallbackId
  })

  carChargeForm.value = { chargeType: 'panne', carId: '', amount: null, description: '', paymentMethod: 'espece' }
}

const agencyChargesList = computed(() => {
  return localCharges.value.filter(c => c.type === 'agency').sort((a, b) => new Date(b.date) - new Date(a.date))
})

const carChargesList = computed(() => {
  return localCharges.value.filter(c => c.type === 'car').sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Computations for metric cards
const totalRevenue = computed(() => {
  const activeRes = localReservations.value
  const completedRes = localCompletedReservations.value
  const resRevenu = [...activeRes, ...completedRes].reduce((sum, res) => sum + (res.totalPrice || 0), 0)

  const contratsRevenu = localContrats.value.reduce((sum, c) => {
      if (c.etat === 'En cours') return sum + (c.avance || 0)
      if (c.etat === 'Retournée') return sum + (c.total || 0)
      return sum
  }, 0)

  return resRevenu + contratsRevenu
})

const totalAgencyCharges = computed(() => {
  return localCharges.value.filter(c => c.type === 'agency').reduce((sum, c) => sum + (c.amount || 0), 0)
})

const totalCarCharges = computed(() => {
  return localCharges.value.filter(c => c.type === 'car').reduce((sum, c) => sum + (c.amount || 0), 0)
})

const netProfit = computed(() => {
  return totalRevenue.value - totalAgencyCharges.value - totalCarCharges.value
})

const metrics = computed(() => [
  { title: 'Total Revenu', value: formatCurrency(totalRevenue.value), valueClass: 'text-green-500', trend: 'up', trendClass: 'text-green-500 bg-green-50' },
  { title: 'Charges Agences', value: formatCurrency(totalAgencyCharges.value), valueClass: 'text-amber-500', trend: 'up', trendClass: 'text-amber-500 bg-amber-50' },
  { title: 'Charges Voitures', value: formatCurrency(totalCarCharges.value), valueClass: 'text-rose-500', trend: 'down', trendClass: 'text-rose-500 bg-rose-50' },
  { title: 'Bénéfice Net', value: formatCurrency(netProfit.value), valueClass: 'text-blue-500', trend: 'up', trendClass: 'text-blue-500 bg-blue-50' }
])

// Monthly Aggregation for Area Chart
const areaSeries = computed(() => {
  const revByMonth = Array(12).fill(0)
  const expByMonth = Array(12).fill(0)

  const allRes = [...localReservations.value, ...localCompletedReservations.value]
  allRes.forEach(res => {
    if (res.startDate) {
      const month = new Date(res.startDate).getMonth()
      revByMonth[month] += (res.totalPrice || 0)
    }
  })

  localContrats.value.forEach(c => {
      const d = c.createdAt || c.dateSortie
      if (d) {
         const month = new Date(d).getMonth()
         if (c.etat === 'En cours') revByMonth[month] += (c.avance || 0)
         else if (c.etat === 'Retournée') revByMonth[month] += (c.total || 0)
      }
  })

  localCharges.value.forEach(charge => {
    if (charge.date) {
      const month = new Date(charge.date).getMonth()
      expByMonth[month] += (charge.amount || 0)
    }
  })

  return [
    { name: 'Revenue', data: revByMonth },
    { name: 'Expenses', data: expByMonth }
  ]
})

const areaOptions = ref({
  chart: {
    type: 'area',
    fontFamily: 'Inter, sans-serif',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  colors: ['#3B82F6', '#94A3B8'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 90, 100]
    }
  },
  xaxis: {
    categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#64748B', fontSize: '11px' } }
  },
  yaxis: {
    labels: {
      style: { colors: '#64748B', fontSize: '11px' },
      formatter: (value) => value.toLocaleString('en-US')
    }
  },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 0,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } }
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    markers: { radius: 12 },
    itemMargin: { horizontal: 10, vertical: 5 }
  },
  tooltip: {
    theme: 'dark',
    y: { formatter: (val) => val + " MAD" }
  }
})

const donutSeries = computed(() => {
  return [totalAgencyCharges.value, totalCarCharges.value]
})

const donutOptions = ref({
  chart: {
    type: 'donut',
    fontFamily: 'Inter, sans-serif',
  },
  labels: ['Agences (Amber)', 'Vehicle maintenances (Rose)'],
  colors: ['#F59E0B', '#F43F5E'],
  plotOptions: {
    pie: {
      donut: {
        size: '60%',
        labels: { show: false }
      }
    }
  },
  dataLabels: { enabled: false },
  stroke: { show: true, colors: ['#fff'], width: 3 },
  legend: {
    position: 'bottom',
    markers: { radius: 12 },
    itemMargin: { horizontal: 10, vertical: 5 }
  },
  tooltip: {
    theme: 'dark',
    y: { formatter: (val) => val.toLocaleString('en-US') + " MAD" }
  }
})

const tableData = computed(() => {
  const allRes = [...localReservations.value, ...localCompletedReservations.value]
  
  const mappedRes = allRes.map(res => {
    let client = clientStore.getClientById(res.clientId) || clientStore.clients.find(c => c.nationalId === res.clientId) || {}
    let car = carStore.getCarById(res.carId) || carStore.cars.find(c => c.licensePlate === res.carId) || {}
    
    let statusClass = 'text-gray-700 bg-gray-100'
    const statusText = res.status || 'Inconnu'
    if (statusText === 'Completed') statusClass = 'text-green-700 bg-green-100'
    if (statusText === 'Active') statusClass = 'text-blue-700 bg-blue-100'

    return {
      ref: res.id,
      client: `${client.firstName || ''} ${client.lastName || 'Unknown'}`,
      date: new Date(res.startDate).toLocaleDateString(),
      montant: formatCurrency(res.totalPrice || 0),
      paymentMode: res.advance >= res.totalPrice ? 'Payé' : 'Cash',
      paymentIcon: res.advance >= res.totalPrice ? CreditCard : Cash,
      status: statusText === 'Completed' ? 'Validé' : (statusText === 'Active' ? 'En cours' : statusText),
      statusClass: statusClass,
      matricule: car.licensePlate || 'N/A',
      rawDate: new Date(res.startDate).getTime()
    }
  })

  const mappedContrats = localContrats.value.map(c => {
    let client = clientStore.getClientById(c.clientId) || clientStore.clients.find(x => x.id === c.clientId) || {}
    let car = carStore.getCarById(c.carId) || carStore.cars.find(x => x.id === c.carId) || {}

    const isPartial = c.etat === 'En cours'
    const statusText = isPartial ? 'Partiel' : 'Payé'
    const statusClass = isPartial ? 'text-amber-700 bg-amber-100' : 'text-green-700 bg-green-100'
    const montantStr = isPartial ? `${formatCurrency(c.avance)} (Reste: ${formatCurrency(c.reste)})` : `${formatCurrency(c.total)}`

    return {
      ref: c.numero,
      client: `${client.firstName || ''} ${client.lastName || 'Inconnu'}`,
      date: new Date(c.createdAt || c.dateSortie).toLocaleDateString(),
      montant: montantStr,
      paymentMode: c.typePaiement || 'Espèces',
      paymentIcon: c.typePaiement === 'Espèces' ? Cash : CreditCard,
      status: statusText,
      statusClass: statusClass,
      matricule: car.licensePlate || 'N/A',
      rawDate: new Date(c.createdAt || c.dateSortie).getTime()
    }
  })

  return [...mappedRes, ...mappedContrats].sort((a, b) => b.rawDate - a.rawDate)
})

const treasuryData = computed(() => {
  const result = {}
  agencyStore.agencies.forEach(ag => {
    // Hide it if filtering and it's not the selected agency
    if (selectedAgency.value !== 'all' && ag.id !== selectedAgency.value) return;
    
    result[ag.id] = { 
      id: ag.id, 
      name: ag.name, 
      revEspeces: Number(ag.initialEspece) || 0, 
      revBanque: Number(ag.initialBanque) || 0, 
      expEspeces: 0, 
      expBanque: 0,
      details: {
        initialEspece: Number(ag.initialEspece) || 0,
        initialBanque: Number(ag.initialBanque) || 0,
        reservationsEspece: 0,
        reservationsBanque: 0,
        contratsEspece: 0,
        contratsBanque: 0,
        chargesAgenceEspece: 0,
        chargesAgenceBanque: 0,
        chargesVoituresEspece: 0,
        chargesVoituresBanque: 0
      }
    }
  })

  // Revenues - Reservs
  const allRes = [...localReservations.value, ...localCompletedReservations.value]
  allRes.forEach(res => {
    const car = carStore.getCarById(res.carId)
    if (car && result[car.agencyId]) {
      const amount = res.totalPrice || 0
      const pm = (res.paymentMode || '').toLowerCase()
      // Usually defaults to Cash if unstated
      if (pm === 'virement' || pm === 'carte bancaire' || pm === 'cheque' || pm.includes('bank')) {
        result[car.agencyId].revBanque += amount
        result[car.agencyId].details.reservationsBanque += amount
      } else {
        result[car.agencyId].revEspeces += amount
        result[car.agencyId].details.reservationsEspece += amount
      }
    }
  })

  // Revenues - Contrats
  localContrats.value.forEach(c => {
    if (result[c.agencyId]) {
      const amount = (c.etat === 'En cours') ? (c.avance || 0) : (c.etat === 'Retournée' ? (c.total || 0) : 0)
      if (amount > 0) {
        if (c.typePaiement === 'Virement' || c.typePaiement === 'Carte bancaire' || c.typePaiement === 'Chèque') {
          result[c.agencyId].revBanque += amount
          result[c.agencyId].details.contratsBanque += amount
        } else {
          result[c.agencyId].revEspeces += amount
          result[c.agencyId].details.contratsEspece += amount
        }
      }
    }
  })

  // Expenditures - Charges
  localCharges.value.forEach(charge => {
    let agencyId = charge.agencyId
    if (charge.type === 'car' && charge.carId) {
       const car = carStore.getCarById(charge.carId)
       if (car) agencyId = car.agencyId
    }
    
    if (agencyId && result[agencyId]) {
      if (charge.paymentMethod === 'espece') {
        result[agencyId].expEspeces += (charge.amount || 0)
        if (charge.type === 'car') result[agencyId].details.chargesVoituresEspece += (charge.amount || 0)
        else result[agencyId].details.chargesAgenceEspece += (charge.amount || 0)
      } else {
        result[agencyId].expBanque += (charge.amount || 0)
        if (charge.type === 'car') result[agencyId].details.chargesVoituresBanque += (charge.amount || 0)
        else result[agencyId].details.chargesAgenceBanque += (charge.amount || 0)
      }
    }
  })

  return Object.values(result).map(r => ({
    ...r,
    netEspeces: r.revEspeces - r.expEspeces,
    netBanque: r.revBanque - r.expBanque,
    totalNet: (r.revEspeces - r.expEspeces) + (r.revBanque - r.expBanque)
  }))
})

const treasuryTotals = computed(() => {
   return treasuryData.value.reduce((acc, curr) => {
      acc.especes += curr.netEspeces
      acc.banque += curr.netBanque
      acc.total += curr.totalNet
      return acc
   }, { especes: 0, banque: 0, total: 0 })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Force ApexCharts text colors in dark mode */
:deep(body.dark .apexcharts-legend-text),
:deep(.dark .apexcharts-legend-text),
html.dark :deep(.apexcharts-legend-text) {
  color: #ffffff !important;
}

html.dark :deep(.apexcharts-text tspan) {
  fill: #9ca3af !important;
}
</style>
