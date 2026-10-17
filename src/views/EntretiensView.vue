<template>
  <div class="px-0 sm:px-6 py-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    
    <!-- Top Bar -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Carnet d'Entretiens</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez la maintenance et les réparations de vos véhicules</p>
      </div>
      
      <div class="flex items-center gap-4 w-full md:w-auto">
        <!-- Tabs -->
        <div class="flex bg-gray-200 dark:bg-[#1E2330] p-1 rounded-lg">
          <button 
            @click="activeTab = 'historique'" 
            :class="activeTab === 'historique' ? 'bg-white dark:bg-[#2A3143] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
            class="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
          >
            Historique
          </button>
          <button 
            @click="activeTab = 'config'" 
            :class="activeTab === 'config' ? 'bg-white dark:bg-[#2A3143] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
            class="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
          >
            Types d'Entretien
          </button>
        </div>

        <button
          v-if="activeTab === 'historique'"
          @click="openAddModal"
          class="hidden md:flex px-4 py-2 bg-[#fa5b0f] text-white text-sm font-medium rounded-lg hover:bg-orange-500 transition-colors shadow-sm items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /></svg>
          Saisir Entretien
        </button>
      </div>
    </div>

    <!-- TAB 1: HISTORIQUE -->
    <div v-show="activeTab === 'historique'">
      <div class="mb-4 flex items-center justify-between">
        <div class="relative max-w-sm w-full">
          <input type="search" v-model="searchQuery" class="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]" placeholder="Rechercher Matricule, Type..." />
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <button @click="openAddModal" class="md:hidden p-2 bg-[#fa5b0f] text-white rounded-lg shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /></svg>
        </button>
      </div>

      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden w-full">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-max">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th class="p-4">Type</th>
                <th class="p-4">Matricule</th>
                <th class="p-4">Date</th>
                <th class="p-4">Détails de l'intervention</th>
                <th class="p-4 text-right">Montant</th>
                <th class="p-4 text-center">Facture</th>
                <th class="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                <td class="p-4">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 uppercase tracking-wide border border-blue-200 dark:border-blue-800/50">
                    {{ getTypeName(log.typeId) }}
                  </span>
                </td>
                <td class="p-4">
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-gray-900 dark:text-white uppercase">{{ getCarLicensePlate(log.carId) }}</span>
                    <span class="text-xs text-gray-500">{{ getCarModelName(log.carId) }}</span>
                  </div>
                </td>
                <td class="p-4 text-sm text-gray-900 dark:text-white">{{ formatDateOnly(log.date) }}</td>
                <td class="p-4">
                  <!-- Polymorphic Details Display -->
                  <div class="flex flex-col gap-1">
                    <span v-if="log.description" class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ log.description }}</span>
                    
                    <!-- Vidange Specifics -->
                    <div v-if="isVidange(log.typeId)" class="flex flex-wrap gap-1 mt-1">
                      <span class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">Huile {{ log.oilType }}km</span>
                      <span class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">Klm: {{ log.currentKm?.toLocaleString('en-US') }}</span>
                      <span class="px-2 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded">Prochain: {{ log.nextKm?.toLocaleString('en-US') }}</span>
                      <div v-if="log.filtersChanged?.length" class="w-full text-xs text-gray-500 mt-0.5">Filtres: {{ log.filtersChanged.join(', ') }}</div>
                    </div>
                    
                    <!-- Chaine Specifics -->
                    <div v-else-if="isChaine(log.typeId)" class="flex flex-wrap gap-1 mt-1">
                      <span class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">Klm: {{ log.currentKm?.toLocaleString('en-US') }}</span>
                      <span class="px-2 py-0.5 text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded">Changer à: {{ log.nextKm?.toLocaleString('en-US') }}</span>
                    </div>

                    <!-- Tolier Specifics -->
                    <div v-else-if="isTolier(log.typeId)" class="mt-1">
                      <span class="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded border border-purple-200 dark:border-purple-800">Cible: {{ log.tolierTarget }}</span>
                    </div>
                  </div>
                </td>
                <td class="p-4 text-sm text-gray-900 dark:text-white font-semibold text-right">{{ formatCurrency(log.price) }}</td>
                <td class="p-4 text-center">
                  <button v-if="log.fileFacture" @click="showImage(log.fileFacture, 'Facture Entretien')" class="text-emerald-500 hover:text-emerald-600 p-1" title="Voir Facture">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </button>
                  <span v-else class="text-xs text-gray-400">-</span>
                </td>
                <td class="p-4 text-center">
                  <button @click="deleteEntretien(log.id)" class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Supprimer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredLogs.length === 0">
                <td colspan="7" class="p-8 text-center text-gray-500 dark:text-gray-400">Aucun entretien enregistré.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: CONFIGURATION -->
    <div v-show="activeTab === 'config'">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Add Type Form -->
        <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 h-fit">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ editingTypeId ? "Modifier le type" : "Créer un type d'entretien" }}</h3>
          <form @submit.prevent="saveNewType" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du Type <span class="text-red-500">*</span></label>
              <input type="text" v-model="newTypeData.name" required placeholder="Ex: Remplacement plaquettes" class="w-full px-4 py-2 bg-gray-50 dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Calculer alerte par :</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input type="checkbox" v-model="newTypeData.alertKm" class="rounded border-gray-300 text-[#fa5b0f] focus:ring-[#fa5b0f]" />
                  Kilométrage
                </label>
                <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input type="checkbox" v-model="newTypeData.alertDate" class="rounded border-gray-300 text-[#fa5b0f] focus:ring-[#fa5b0f]" />
                  Date
                </label>
              </div>
            </div>
            <div class="flex gap-2">
              <button v-if="editingTypeId" @click="cancelEditType" type="button" class="w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Annuler</button>
              <button type="submit" class="w-full py-2 bg-[#fa5b0f] text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">{{ editingTypeId ? 'Mettre à jour' : 'Ajouter le type' }}</button>
            </div>
          </form>
        </div>

        <!-- Types List -->
        <div class="lg:col-span-2 bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Liste des Types configurés</h3>
          </div>
          <div class="overflow-x-auto w-full">
            <table class="w-full text-left border-collapse min-w-max">
              <thead>
                <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th class="p-4">Type</th>
                  <th class="p-4 text-center">Alert (KM)</th>
                  <th class="p-4 text-center">Alert (Date)</th>
                  <th class="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                <tr v-for="t in typeStore.types" :key="t.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                  <td class="p-4 text-sm font-bold text-gray-900 dark:text-white">{{ t.name }}</td>
                  <td class="p-4 text-center text-sm font-medium" :class="t.alertKm ? 'text-green-600 dark:text-green-400' : 'text-gray-400'">{{ t.alertKm ? 'Oui' : '-' }}</td>
                  <td class="p-4 text-center text-sm font-medium" :class="t.alertDate ? 'text-green-600 dark:text-green-400' : 'text-gray-400'">{{ t.alertDate ? 'Oui' : '-' }}</td>
                  <td class="p-4 text-center">
                    <button @click="editType(t)" class="text-blue-500 hover:text-blue-700 mr-2" title="Modifier">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5h.036z" /></svg>
                    </button>
                    <button @click="deleteType(t.id)" class="text-red-500 hover:text-red-700" title="Supprimer">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

    <!-- ADD LOG MODAL -->
    <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white dark:bg-[#1E2330] rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#1C1C1C]/50">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Saisir un Entretien</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-6 overflow-y-auto custom-scrollbar">
          <form @submit.prevent="saveEntretien" class="space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type d'Entretien <span class="text-red-500">*</span></label>
                <select v-model="formData.typeId" required class="w-full px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]">
                  <option value="" disabled>Sélectionner le type</option>
                  <option v-for="t in typeStore.types" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Véhicule (Matricule) <span class="text-red-500">*</span></label>
                <select v-model="formData.carId" required class="w-full px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]">
                  <option value="" disabled>Sélectionner un véhicule</option>
                  <option v-for="car in availableCars" :key="car.id" :value="car.id">
                    {{ car.licensePlate }} - {{ getModelNameDirect(car.modelId) }}
                  </option>
                </select>
              </div>
            </div>

            <!-- POLYMORPHIC SUB-PANELS based on TYPE -->
            
            <!-- VIDANGE PANEL -->
            <div v-if="isVidange(formData.typeId)" class="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl space-y-4">
              <h4 class="text-sm font-bold text-orange-800 dark:text-orange-400">Détails de Vidange</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Kilométrage Actuel</label>
                  <input type="number" v-model.number="formData.currentKm" required class="w-full px-3 py-1.5 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Type d'huile</label>
                  <select v-model="formData.oilType" required class="w-full px-3 py-1.5 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]">
                    <option :value="5000">5,000 KM</option>
                    <option :value="10000">10,000 KM</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Prochaine Vidange</label>
                  <input type="number" :value="calculatedNextVidange" readonly disabled class="w-full px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border-transparent rounded text-sm font-bold text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              <div class="flex flex-wrap gap-4 pt-2">
                <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" v-model="vidangeFilters.huile" class="rounded text-[#fa5b0f] focus:ring-[#fa5b0f] border-gray-300" /> Filtre Huile changé
                </label>
                <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" v-model="vidangeFilters.diesel" class="rounded text-[#fa5b0f] focus:ring-[#fa5b0f] border-gray-300" /> Filtre Diesel changé
                </label>
                <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" v-model="vidangeFilters.air" class="rounded text-[#fa5b0f] focus:ring-[#fa5b0f] border-gray-300" /> Filtre Air changé
                </label>
              </div>
            </div>

            <!-- CHAINE DE DISTRIBUTION PANEL -->
            <div v-if="isChaine(formData.typeId)" class="p-4 bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 rounded-xl space-y-4">
              <h4 class="text-sm font-bold text-teal-800 dark:text-teal-400">Détails Chaine de distribution</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Kilométrage Actuel</label>
                  <input type="number" v-model.number="formData.currentKm" required class="w-full px-3 py-1.5 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Prochain Changement (+50,000)</label>
                  <input type="number" :value="calculatedNextChaine" readonly disabled class="w-full px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border-transparent rounded text-sm font-bold text-gray-700 dark:text-gray-300" />
                </div>
              </div>
            </div>

            <!-- TOLIER PANEL -->
            <div v-if="isTolier(formData.typeId)" class="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl space-y-4">
              <h4 class="text-sm font-bold text-purple-800 dark:text-purple-400">Détails Tolier</h4>
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie de la réparation</label>
                <select v-model="formData.tolierTarget" required class="w-full px-3 py-1.5 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500">
                  <option value="Vitre">Vitre</option>
                  <option value="Pare-chocs">Pare-chocs</option>
                  <option value="Peinture">Peinture</option>
                  <option value="Stickage">Stickage</option>
                </select>
              </div>
            </div>

            <!-- Standard Universal Block -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date d'intervention <span class="text-red-500">*</span></label>
                <input type="date" v-model="formData.date" required class="w-full px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Montant (MAD) <span class="text-red-500">*</span></label>
                <input type="number" min="0" step="0.01" v-model.number="formData.price" required class="w-full px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paiement <span class="text-red-500">*</span></label>
                <select v-model="formData.paymentMethod" required class="w-full px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]">
                  <option value="espece">Espèce</option>
                  <option value="banque">Banque</option>
                </select>
              </div>

              <!-- Dynamic Alerts Based on Type Flags -->
              <div v-if="selectedTypeAlertOverrides.alertDate">
                <label class="block text-sm font-bold text-[#fa5b0f] mb-1">Prochaine Date (Alerte)</label>
                <input type="date" v-model="formData.nextDate" class="w-full px-4 py-2 bg-orange-50 dark:bg-[#1C1C1C] border border-orange-200 dark:border-orange-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]" />
              </div>
              <div v-if="selectedTypeAlertOverrides.alertKm && !isVidange(formData.typeId) && !isChaine(formData.typeId)">
                <label class="block text-sm font-bold text-[#fa5b0f] mb-1">Prochain Kilométrage (Alerte)</label>
                <input type="number" v-model.number="formData.nextKmFallback" placeholder="Ex: 120000" class="w-full px-4 py-2 bg-orange-50 dark:bg-[#1C1C1C] border border-orange-200 dark:border-orange-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]" />
              </div>

              <div class="md:col-span-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input type="text" v-model="formData.description" placeholder="Achat plaquettes..." class="w-full px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]">
              </div>
            </div>

            <!-- Upload Facture -->
            <div class="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Facture d'Entretien</label>
              <div class="flex items-center gap-3">
                <input type="file" @change="handleFileUpload($event, 'fileFacture')" accept="image/*,.pdf" class="hidden" ref="fileFactureInput" />
                <button type="button" @click="$refs.fileFactureInput.click()" class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Choisir...</button>
                <span class="text-xs text-gray-500 truncate max-w-[120px]">{{ formData.fileFacture ? 'Fichier chargé' : 'Aucun fichier' }}</span>
              </div>
              <div v-if="formData.fileFacture && isImage(formData.fileFacture)" class="mt-2 h-20 w-32 rounded border border-gray-200 dark:border-gray-700 overflow-hidden relative">
                <img :src="formData.fileFacture" class="w-full h-full object-cover" />
                <button @click.prevent="formData.fileFacture = ''" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg></button>
              </div>
            </div>
            
          </form>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-[#1C1C1C]/50">
          <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Annuler</button>
          <button @click="saveEntretien" :disabled="isSaving" class="px-6 py-2 bg-[#fa5b0f] text-white text-sm font-medium rounded-lg hover:bg-orange-500 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
            <svg v-if="isSaving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Enregistrer
          </button>
        </div>

      </div>
    </div>

    <!-- Image Viewer Modal -->
    <div v-if="imageViewer.show" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" @click="imageViewer.show = false">
      <div class="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
        <button @click="imageViewer.show = false" class="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <span class="absolute top-4 left-4 text-white font-bold bg-black/50 px-4 py-1.5 rounded-full">{{ imageViewer.title }}</span>
        <img v-if="isImage(imageViewer.url)" :src="imageViewer.url" class="max-h-[85vh] max-w-full object-contain shadow-2xl rounded-lg" @click.stop />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useEntretienStore } from '../stores/entretienStore'
import { useEntretienTypeStore } from '../stores/entretienTypeStore'
import { useCarStore } from '../stores/carStore'
import { useModelStore } from '../stores/modelStore'
import { useChargeStore } from '../stores/chargeStore'

const entretienStore = useEntretienStore()
const typeStore = useEntretienTypeStore()
const carStore = useCarStore()
const modelStore = useModelStore()
const chargeStore = useChargeStore()

// State
const activeTab = ref('historique')
const searchQuery = ref('')
const showAddModal = ref(false)
const isSaving = ref(false)
const editingTypeId = ref(null)

const imageViewer = ref({ show: false, url: '', title: '' })

const newTypeData = ref({
  name: '',
  alertKm: true,
  alertDate: false
})

const formData = ref({
  typeId: '',
  carId: '',
  date: '',
  nextDate: '',
  nextKmFallback: null,
  price: 0,
  paymentMethod: 'espece',
  description: '',
  currentKm: null,
  oilType: 10000,
  tolierTarget: 'Vitre',
  fileFacture: ''
})

const vidangeFilters = ref({
  huile: false,
  diesel: false,
  air: false
})

// Lifecycle
onMounted(() => {
  entretienStore.initializeFromStorage()
  typeStore.initializeFromStorage()
  carStore.initializeFromStorage()
  modelStore.initializeFromStorage()
  chargeStore.initializeFromStorage()
})

// Type Logic Helpers
const isVidange = (typeId) => {
  const t = typeStore.getTypeById(typeId)
  return t && t.name.toLowerCase().includes('vidange')
}
const isChaine = (typeId) => {
  const t = typeStore.getTypeById(typeId)
  return t && t.name.toLowerCase().includes('chaine')
}
const isTolier = (typeId) => {
  const t = typeStore.getTypeById(typeId)
  return t && t.name.toLowerCase().includes('tolier')
}

// Computeds
const availableCars = computed(() => carStore.filteredCars)

const filteredLogs = computed(() => {
  let list = entretienStore.filteredEntretiens || []
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(e => {
      const carMatricule = getCarLicensePlate(e.carId).toLowerCase()
      const tName = getTypeName(e.typeId).toLowerCase()
      return carMatricule.includes(q) || tName.includes(q)
    })
  }
  return list.sort((a,b) => new Date(b.date) - new Date(a.date))
})

const calculatedNextVidange = computed(() => {
  if (formData.value.currentKm == null) return ''
  return Number(formData.value.currentKm) + Number(formData.value.oilType)
})

const calculatedNextChaine = computed(() => {
  if (formData.value.currentKm == null) return ''
  return Number(formData.value.currentKm) + 50000
})

const selectedTypeAlertOverrides = computed(() => {
  if (!formData.value.typeId) return { alertKm: false, alertDate: false }
  const t = typeStore.getTypeById(formData.value.typeId)
  return t ? { alertKm: t.alertKm, alertDate: t.alertDate } : { alertKm: false, alertDate: false }
})

// Methods: Type Settings
const editType = (t) => {
  editingTypeId.value = t.id
  newTypeData.value = { ...t }
}

const cancelEditType = () => {
  editingTypeId.value = null
  newTypeData.value = { name: '', alertKm: true, alertDate: false }
}

const saveNewType = () => {
  if (!newTypeData.value.name.trim()) return
  
  if (editingTypeId.value) {
    typeStore.updateType({ ...newTypeData.value, name: newTypeData.value.name.trim() })
    editingTypeId.value = null
  } else {
    typeStore.addType({ ...newTypeData.value, name: newTypeData.value.name.trim() })
  }
  
  newTypeData.value = { name: '', alertKm: true, alertDate: false }
}

const deleteType = (id) => {
  if(confirm("Supprimer ce type bloquera la lecture des entretiens passés associés. Continuer ?")) {
    typeStore.deleteType(id)
  }
}

// Methods: Logs Modal
const openAddModal = () => {
  formData.value = {
    typeId: '',
    carId: '',
    date: new Date().toISOString().split('T')[0],
    nextDate: '',
    nextKmFallback: null,
    price: 0,
    paymentMethod: 'espece',
    description: '',
    currentKm: null,
    oilType: 10000,
    tolierTarget: 'Vitre',
    fileFacture: ''
  }
  vidangeFilters.value = { huile: false, diesel: false, air: false }
  showAddModal.value = true
}

const closeModal = () => { showAddModal.value = false }

const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => { formData.value[fieldName] = e.target.result }
  reader.readAsDataURL(file)
}

const saveEntretien = () => {
  if (!formData.value.typeId || !formData.value.carId || formData.value.price === null) return
  isSaving.value = true

  const logType = typeStore.getTypeById(formData.value.typeId).name
  
  // Polymorphic Construction
  const logInstance = {
    id: 'entret_' + Date.now(),
    typeId: formData.value.typeId,
    carId: formData.value.carId,
    date: formData.value.date,
    price: formData.value.price,
    description: formData.value.description,
    fileFacture: formData.value.fileFacture,
    createdAt: new Date().toISOString()
  }

  // Inject specific fields conditionally
  if (isVidange(formData.value.typeId)) {
    logInstance.currentKm = formData.value.currentKm
    logInstance.oilType = formData.value.oilType
    logInstance.nextKm = calculatedNextVidange.value
    
    let flt = []
    if (vidangeFilters.value.huile) flt.push('Huile')
    if (vidangeFilters.value.diesel) flt.push('Diesel')
    if (vidangeFilters.value.air) flt.push('Air')
    logInstance.filtersChanged = flt
  } else if (isChaine(formData.value.typeId)) {
    logInstance.currentKm = formData.value.currentKm
    logInstance.nextKm = calculatedNextChaine.value
  } else if (isTolier(formData.value.typeId)) {
    logInstance.tolierTarget = formData.value.tolierTarget
  }

  // Bind overrides for custom alerts
  if (selectedTypeAlertOverrides.value.alertDate && formData.value.nextDate) {
    logInstance.nextDate = formData.value.nextDate
  }
  if (selectedTypeAlertOverrides.value.alertKm && !isVidange(formData.value.typeId) && !isChaine(formData.value.typeId) && formData.value.nextKmFallback) {
    logInstance.nextKm = formData.value.nextKmFallback
  }

  // Auto update global car profile metrics
  const car = carStore.getCarById(logInstance.carId)
  if (car) {
    let carUpdated = false;

    // 1. Sync Current Mileage if the logged OM is higher
    if (logInstance.currentKm !== undefined && logInstance.currentKm !== null) {
      if (!car.currentMileage || logInstance.currentKm > car.currentMileage) {
        car.currentMileage = logInstance.currentKm;
        carUpdated = true;
      }
    }

    // 2. Sync specific hardcoded triggers (Vidange handles progress bars via lastVidangeKm)
    if (isVidange(formData.value.typeId)) {
      car.lastVidangeKm = logInstance.currentKm;
      car.nextVidangeKm = logInstance.nextKm;
      carUpdated = true;
    }

    if (carUpdated) {
      carStore.updateCar(car);
    }
  }

  // 1. Save Log
  entretienStore.addEntretien(logInstance)

  // 2. Accounting Integration
  if (logInstance.price > 0) {
    chargeStore.addCharge({
      id: 'charge_' + logInstance.id,
      type: 'car',
      chargeType: 'entretien',
      carId: logInstance.carId,
      agencyId: carStore.getCarById(logInstance.carId)?.agencyId,
      amount: logInstance.price,
      paymentMethod: formData.value.paymentMethod,
      date: logInstance.date,
      description: `Entretien (${logType}) - ${logInstance.description || ''}`.trim(),
      status: 'Paid'
    })
  }

  setTimeout(() => {
    isSaving.value = false
    closeModal()
  }, 400)
}

const deleteEntretien = (id) => {
  if (confirm("Voulez-vous vraiment supprimer cet entretien ?")) {
    entretienStore.deleteEntretien(id)
    chargeStore.deleteCharge('charge_' + id)
  }
}

// Helpers
const getCarLicensePlate = (id) => carStore.getCarById(id)?.licensePlate || 'Inconnu'
const getCarModelName = (id) => getModelNameDirect(carStore.getCarById(id)?.modelId)
const getModelNameDirect = (id) => modelStore.getModelById(id)?.name || 'Inconnu'
const getTypeName = (id) => typeStore.getTypeById(id)?.name || '-'
const formatDateOnly = (dStr) => dStr ? new Date(dStr).toLocaleDateString('fr-FR') : '-'
const formatCurrency = (v) => new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(v || 0)
const isImage = (ds) => ds && ds.startsWith('data:image/')
const showImage = (url, title) => { imageViewer.value = { show: true, url, title } }

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; }
</style>
