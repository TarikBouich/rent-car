<template>
  <div class="p-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)]">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Voitures</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Gérez votre flotte de véhicules</p>
      </div>
      <router-link
        :to="{ name: 'cars-add' }"
        class="flex items-center gap-2 px-4 py-2 bg-[#fa5b0f] text-[#fff] rounded-[8px] transition-colors font-bold border border-[#fa5b0f] hover:bg-transparent hover:text-[#fa5b0f]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm font-bold">Ajouter une voiture</span>
      </router-link>
    </div>

    <!-- Controls Bar -->
    <div class="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <!-- Show entries -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
        <select class="px-2 py-1.5 bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
      </div>

      <!-- Search & Filters -->
      <div class="flex flex-1 max-w-2xl justify-end gap-3 w-full">
        <div v-if="userStore.isAdmin" class="relative w-full max-w-xs flex items-center justify-end gap-2">
          <label class="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Agence:</label>
          <select
            v-model="selectedAgencyFilter"
            class="w-full px-3 py-1.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f]"
          >
            <option value="">Toutes les agences</option>
            <option
              v-for="agency in agencyStore.agencies"
              :key="agency.id"
              :value="agency.id"
            >
              {{ agency.name }}
            </option>
          </select>
        </div>
        <div class="relative w-full max-w-xs flex items-center justify-end gap-2">
          <label class="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Rechercher:</label>
          <input
            type="text"
            v-model="searchQuery"
            class="w-full px-3 py-1.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f]"
          />
        </div>

        <!-- <div class="relative w-48">
          <select
            v-model="categoryFilter"
            class="w-full appearance-none pl-4 pr-10 py-2 bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-[8px] text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f] focus:border-transparent cursor-pointer"
          >
            <option value="">Toutes les catégories</option>
            <option value="Citadine">Citadine</option>
            <option value="SUV">SUV</option>
            <option value="Berline">Berline</option>
            <option value="Luxe">Luxe</option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div> -->
      </div>
    </div>

    <!-- Fleet Data Tables -->
    <div
      v-for="group in carGroupsForDisplay"
      :key="group.id"
      class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-6"
    >
      <div
        v-if="userStore.isAdmin"
        class="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1C1C1C]"
      >
        <h3 class="text-sm font-bold text-gray-900 dark:text-white">
          Agence: {{ group.name }} ({{ group.cars.length }})
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr class="bg-white dark:bg-[#1C1C1C] border-b border-gray-200 dark:border-gray-800">
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Photo</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Modèle/Marque</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Matricule</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Couleur</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Agence</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Prix/Jour</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Statut</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr v-for="car in group.cars" :key="car.id" class="hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors">
              <!-- Photo -->
              <td class="px-4 py-3">
                <div class="h-10 w-14 rounded overflow-hidden bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                  <img v-if="car.images && car.images.length > 0" :src="car.images[0]" :alt="car.licensePlate" class="w-full h-full object-cover" />
                  <img v-else-if="car.image" :src="car.image" :alt="car.licensePlate" class="w-full h-full object-cover" />
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              </td>
              <!-- Modèle/Marque -->
              <td class="px-4 py-3">
                <div class="flex flex-col">
                  <span class="text-[13px] font-semibold text-gray-900 dark:text-white">{{ getModelName(car.modelId) }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ getBrandName(car.brandId) }}</span>
                </div>
              </td>
              <!-- Matricule (License Plate Styling) -->
              <td class="px-4 py-3">
                <div class="inline-flex items-center border border-gray-300 dark:border-gray-700 rounded shadow-sm overflow-hidden bg-white dark:bg-[#1C1C1C]">
                  <div class="bg-[#fa5b0f] px-1 py-0.5 flex items-center justify-center">
                    <span class="text-[7px] font-bold text-gray-900 dark:text-white uppercase tracking-tighter">MA</span>
                  </div>
                  <span class="px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 tracking-wider">{{ car.licensePlate }}</span>
                </div>
              </td>
              <!-- Couleur -->
              <td class="px-4 py-3">
                <div 
                  class="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                  :style="{ backgroundColor: car.color || '#000000' }"
                  :title="car.color || '#000000'"
                ></div>
              </td>
              <!-- Agence -->
              <td class="px-4 py-3">
                <span class="text-[13px] text-gray-700 dark:text-gray-300">{{ getAgencyName(car.agencyId) }}</span>
              </td>
              <!-- Catégorie -->
              <!-- <td class="px-4 py-3">
                <span class="text-[13px] text-gray-600 dark:text-gray-400">{{ car.category || 'N/A' }}</span>
              </td> -->
              <!-- Prix/Jour -->
              <td class="px-4 py-3">
                <span class="text-[13px] font-medium text-[#fa5b0f]">{{ car.pricePerDay }} DH</span>
              </td>
              <!-- Statut -->
              <td class="px-4 py-3">
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium border"
                  :class="getStatusClass(car.status)"
                >
                  {{ getStatusLabel(car.status) }}
                </span>
              </td>
              <!-- Actions -->
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link
                    :to="`/cars/${car.id}`"
                    class="w-8 h-8 flex items-center justify-center rounded-full text-[#3B82F6] hover:bg-blue-900/20 hover:text-blue-400 transition-colors"
                    title="Détails"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link>
                  <button
                    @click="editCar(car)"
                    class="w-8 h-8 flex items-center justify-center rounded-full text-[#10B981] hover:bg-emerald-900/20 hover:text-emerald-400 transition-colors"
                    title="Modifier"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteCar(car)"
                    class="w-8 h-8 flex items-center justify-center rounded-full text-[#EF4444] hover:bg-red-900/20 hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                    v-if="car.status !== 'Vendu'"
                    @click="openSellModal(car)"
                    class="w-8 h-8 flex items-center justify-center rounded-full text-[#EAB308] hover:bg-yellow-900/20 hover:text-yellow-400 transition-colors"
                    title="Vendre"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredCars.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.8a1 1 0 0 0-.8.4L2.3 11l-5.16.86A1 1 0 0 0 .84 12.99V16h3" />
        <circle cx="6.5" cy="16.5" r="2.5" />
        <circle cx="16.5" cy="16.5" r="2.5" />
      </svg>
      <p class="mt-4 text-gray-500 dark:text-gray-400">Aucune voiture trouvée</p>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="showModal = false"
    >
      <div class="bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Modifier la voiture</h3>
          <button @click="showModal = false" class="p-1 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[60vh] without-scrollbar">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Car Image Gallery -->
            <div class="md:col-span-2">
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Photos de la voiture (Galerie)</label>
              <div class="flex flex-col gap-4">
                <label class="cursor-pointer inline-block w-full">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    @change="handleImageUpload"
                    class="hidden"
                  />
                  <div class="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center hover:border-[#fa5b0f] transition-colors">
                    <div class="text-center p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mx-auto text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="text-xs text-gray-600 dark:text-gray-400 mt-2 block">Cliquez pour ajouter des images</span>
                    </div>
                  </div>
                </label>
                <!-- Gallery Preview -->
                <div v-if="currentCar.images && currentCar.images.length > 0" class="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  <div v-for="(img, idx) in currentCar.images" :key="idx" class="relative min-w-[120px] w-[120px] h-[120px] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group">
                    <img :src="img" alt="Preview" class="w-full h-full object-cover" />
                    <button type="button" @click="removeImage(idx)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section: Identifiants -->
            <div class="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800">
               <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Identifiants du véhicule</h3>
            </div>

            <!-- Numéro de chassis -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Numéro de chassis</label>
              <input v-model="currentCar.chassisNumber" type="text" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" placeholder="Ex: WBA0000000000" />
            </div>

            <!-- Matricule WWW -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Matricule WWW</label>
              <input v-model="currentCar.matriculeWWW" type="text" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" placeholder="Ex: WWW-12345" />
            </div>

            <!-- Matricule -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Matricule</label>
              <input v-model="currentCar.licensePlate" type="text" required class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" />
            </div>

            <!-- Section: Informations Générales -->
            <div class="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800">
               <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Informations Générales</h3>
            </div>

            <!-- Marque -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Marque</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                </div>
                <select
                  v-model="currentCar.brandId"
                  @change="currentCar.modelId = ''"
                  required
                  class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
                >
                  <option value="" disabled>Sélectionner une marque</option>
                  <option v-for="brand in brandStore.brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                </select>
              </div>
            </div>

            <!-- Modèle -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Modèle</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                </div>
                <select
                  v-model="currentCar.modelId"
                  :disabled="!currentCar.brandId"
                  required
                  class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] disabled:opacity-50"
                >
                  <option value="" disabled>Sélectionner un modèle</option>
                  <option v-for="model in filteredModalModels" :key="model.id" :value="model.id">{{ model.name }}</option>
                </select>
              </div>
            </div>
            
            <!-- Date Mise en circulation -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Date Mise en circulation</label>
              <input v-model="currentCar.circulationDate" type="date" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] transition-colors" />
            </div>

            <!-- Nombre de place -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre de places</label>
              <input v-model.number="currentCar.seats" type="number" min="1" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] transition-colors" />
            </div>

            <!-- Type de carburant -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Type de carburant</label>
              <select v-model="currentCar.fuelType" class="w-full px-4 py-2.5 bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]">
                <option value="Diesel">Diésel</option>
                <option value="Essence">Essence</option>
                <option value="Hybride">Hybride</option>
                <option value="Electrique">Electrique</option>
              </select>
            </div>

            <!-- Couleur -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Couleur de la voiture</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                </div>
                <input
                  v-model="currentCar.color"
                  type="color"
                  class="w-full pl-10 pr-4 py-1.5 h-[42px] bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] cursor-pointer"
                />
              </div>
            </div>

            <!-- Price Per Day -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Prix par jour (DH)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <input
                  v-model.number="currentCar.pricePerDay"
                  type="number"
                  min="0"
                  class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
                />
              </div>
            </div>

            <!-- Section: Kilométrage & Entretien -->
            <div class="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800">
               <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Kilométrage & Entretien</h3>
            </div>

            <!-- Current Mileage -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Kilométrage actuel (km)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <input
                  v-model.number="currentCar.currentMileage"
                  type="number"
                  min="0"
                  class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
                />
              </div>
            </div>

            <!-- Kilométrage huile -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Kilométrage huile</label>
              <input v-model.number="currentCar.oilMileage" type="number" min="0" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" />
            </div>

            <!-- Next Oil Change -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Prochaine vidange (km)</label>
              <div class="relative">
                <input v-model.number="currentCar.nextVidangeKm" type="number" readonly class="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none cursor-not-allowed opacity-70" />
              </div>
            </div>

            <!-- Kilometrage moyen/jour -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Kilométrage moyen/jour</label>
              <input v-model.number="currentCar.averageMileagePerDay" type="number" min="0" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" />
            </div>

            <!-- Insurance End Date -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Date d'expiration de l'assurance</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <input
                  v-model="currentCar.assuranceEndDate"
                  type="date"
                  class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
                />
              </div>
            </div>

            <!-- Technical Visit End Date -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Date de visite technique</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <input
                  v-model="currentCar.visiteTechniqueEndDate"
                  type="date"
                  class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
                />
              </div>
            </div>

            <!-- Transmission -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Transmission</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <select
                  v-model="currentCar.transmission"
                  class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
                >
                  <option value="manual">Manuelle</option>
                  <option value="automatic">Automatique</option>
                </select>
              </div>
            </div>

            <!-- Section: Equipements / Accessoires -->
            <div class="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800">
               <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Equipements & Accessoires</h3>
               <div class="flex flex-wrap gap-6" v-if="currentCar.equipments">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="currentCar.equipments.climatisation" class="w-4 h-4 text-[#fa5b0f] rounded border-gray-300 focus:ring-[#fa5b0f]">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Climatisation</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="currentCar.equipments.cric" class="w-4 h-4 text-[#fa5b0f] rounded border-gray-300 focus:ring-[#fa5b0f]">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Cric</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="currentCar.equipments.documents" class="w-4 h-4 text-[#fa5b0f] rounded border-gray-300 focus:ring-[#fa5b0f]">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Documents</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="currentCar.equipments.extincteur" class="w-4 h-4 text-[#fa5b0f] rounded border-gray-300 focus:ring-[#fa5b0f]">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Extincteur</span>
                  </label>
               </div>
            </div>

            <!-- Observation -->
            <div class="md:col-span-2">
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Observation</label>
              <textarea v-model="currentCar.observation" rows="3" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"></textarea>
            </div>

            <!-- Statut -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Statut</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <select
                  v-model="currentCar.status"
                  class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
                >
                  <option value="Available">Disponible (En Parc)</option>
                  <option value="Rented">Louée</option>
                  <option value="Sold">Vendue</option>
                </select>
              </div>
            </div>

            <!-- Section: Information de Vente (Conditional) -->
            <template v-if="currentCar.status === 'Sold'">
              <div class="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                 <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Informations de vente</h3>
              </div>
              
              <!-- Acheteur -->
              <div>
                <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Acheteur</label>
                <input v-model="currentCar.buyerName" type="text" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" />
              </div>

              <!-- Prix de vente -->
              <div>
                <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Prix de vente (DH)</label>
                <input v-model.number="currentCar.salePrice" type="number" min="0" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" />
              </div>

              <!-- Date autorisation retrait -->
              <div>
                <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Date d'autorisation de retrait</label>
                <input v-model="currentCar.withdrawalAuthDate" type="date" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" />
              </div>

              <!-- Date vente -->
              <div>
                <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Date de vente</label>
                <input v-model="currentCar.saleDate" type="date" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" />
              </div>

              <!-- Fichiers Acheteur -->
              <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div>
                   <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">CNE Acheteur (Recto)</label>
                   <input type="file" @change="e => handleSingleFileUpload(e, 'buyerCneFront')" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                </div>
                <div>
                   <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">CNE Acheteur (Verso)</label>
                   <input type="file" @change="e => handleSingleFileUpload(e, 'buyerCneBack')" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                </div>
                <div>
                   <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Autorisation de retrait</label>
                   <input type="file" @change="e => handleSingleFileUpload(e, 'withdrawalAuthFile')" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                </div>
                <div>
                   <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Document Roulage</label>
                   <input type="file" @change="e => handleSingleFileUpload(e, 'roulageFile')" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                </div>
              </div>
            </template>

            <!-- Agency Assignment -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Agence Assignée</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <select
                  v-model="currentCar.agencyId"
                  class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
                >
                  <option value="" disabled>Sélectionner une agence</option>
                  <option v-for="agency in agencyStore.agencies" :key="agency.id" :value="agency.id">
                    {{ agency.name }} {{ agency.location ? `(${agency.location})` : '' }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Achat à Crédit Toggle -->
            <div class="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              <label class="flex items-center gap-3 cursor-pointer select-none">
                <div class="relative">
                  <input type="checkbox" v-model="currentCar.isCreditPurchase" class="sr-only" />
                  <div class="block bg-gray-200 dark:bg-gray-700 w-10 h-6 rounded-full transition-colors" :class="{ 'bg-[#fa5b0f]': currentCar.isCreditPurchase }"></div>
                  <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform" :class="{ 'translate-x-4': currentCar.isCreditPurchase }"></div>
                </div>
                <span class="text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300">Achat à crédit (Traites mensuelles)</span>
              </label>
            </div>

            <!-- Credit Fields -->
            <template v-if="currentCar.isCreditPurchase">
              <div>
                <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Montant d'avance (DH)</label>
                <div class="relative">
                  <input v-model.number="currentCar.initialAdvance" type="number" min="0" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" placeholder="0" />
                </div>
              </div>
              <div>
                <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Mensualité Traite (DH)</label>
                <div class="relative">
                  <input v-model.number="currentCar.monthlyTraite" type="number" min="1" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" />
                </div>
              </div>
              <div>
                <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Durée (Mois)</label>
                <div class="relative">
                  <input v-model.number="currentCar.traiteDuration" type="number" min="1" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" />
                </div>
              </div>
              <div>
                <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Date début crédit</label>
                <div class="relative">
                  <input v-model="currentCar.creditStartDate" type="date" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" />
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E2330]">
          <button
            @click="showModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-[8px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="updateCar"
            class="px-4 py-2 text-sm font-bold text-[#1C1C1C] bg-[#fa5b0f] rounded-[8px] hover:bg-yellow-500 transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>

    <!-- Sell Modal -->
    <div
      v-if="showSellModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="showSellModal = false"
    >
      <div class="bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Vendre le Véhicule</h3>
          <button @click="showSellModal = false" class="p-1 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submitSellForm">
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Montant de vente (DH)</label>
              <input
                type="number"
                v-model.number="sellForm.amount"
                required
                min="1"
                class="w-full px-4 py-2 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[8px] text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mode de paiement</label>
              <select
                v-model="sellForm.paymentMethod"
                required
                class="w-full px-4 py-2 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[8px] text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
              >
                <option value="espece">Espèces</option>
                <option value="virement">Virement Bancaire</option>
                <option value="carte bancaire">Carte Bancaire</option>
                <option value="cheque">Chèque</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du client</label>
              <input
                type="text"
                v-model="sellForm.buyerName"
                required
                class="w-full px-4 py-2 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[8px] text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNE du client</label>
              <input
                type="text"
                v-model="sellForm.buyerCNE"
                class="w-full px-4 py-2 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[8px] text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
              />
            </div>
          </div>
          
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E2330]">
            <button
              type="button"
              @click="showSellModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-[8px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-[8px] hover:bg-green-500 transition-colors"
            >
              Confirmer Vente
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useCarStore } from "../stores/carStore";
import { useUserStore } from "../stores/userStore";
import { useAgencyStore } from "../stores/agencyStore";
import { useBrandStore } from "../stores/brandStore";
import { useModelStore } from "../stores/modelStore";
import { useTransactionStore } from "../stores/transactionStore";

export default {
  name: 'NewCarsView',
  setup() {
    const carStore = useCarStore();
    const userStore = useUserStore();
    const agencyStore = useAgencyStore();
    const brandStore = useBrandStore();
    const modelStore = useModelStore();
    const transactionStore = useTransactionStore();

    agencyStore.initializeFromStorage();
    brandStore.initializeFromStorage();
    modelStore.initializeFromStorage();
    
    return {
      carStore,
      userStore,
      agencyStore,
      brandStore,
      modelStore,
      transactionStore
    };
  },
  data() {
    return {
      searchQuery: '',
      selectedAgencyFilter: '',
      categoryFilter: '',
      showModal: false,
      showSellModal: false,
      carToSell: null,
      sellForm: {
        amount: 0,
        paymentMethod: 'espece',
        buyerName: '',
        buyerCNE: ''
      },
      currentCar: {
        brandId: '',
        modelId: '',
        licensePlate: '',
        chassisNumber: '',
        matriculeWWW: '',
        circulationDate: '',
        seats: 5,
        oilMileage: 10000,
        averageMileagePerDay: 0,
        observation: '',
        equipments: {
          climatisation: false,
          cric: false,
          documents: false,
          extincteur: false
        },
        fuelType: 'Diesel',
        images: [],
        image: '',
        pricePerDay: 0,
        currentMileage: 0,
        nextVidangeKm: 0,
        lastVidangeKm: 0,
        needsVidange: false,
        assuranceEndDate: '',
        visiteTechniqueEndDate: '',
        transmission: 'manual',
        status: 'Available',
        buyerName: '',
        salePrice: 0,
        withdrawalAuthDate: '',
        saleDate: '',
        buyerCneFront: '',
        buyerCneBack: '',
        withdrawalAuthFile: '',
        roulageFile: '',
        agencyId: '',
        color: '#000000',
        isCreditPurchase: false,
        initialAdvance: 0,
        advanceMethod: 'espece',
        monthlyTraite: 0,
        traiteDuration: 0,
        creditStartDate: ''
      }
    };
  },
  computed: {
    filteredCars() {
      let cars = this.carStore.filteredCars;

      if (this.selectedAgencyFilter) {
        cars = cars.filter(car => car.agencyId === this.selectedAgencyFilter);
      }
      
      if (this.categoryFilter) {
        cars = cars.filter(car => car.category === this.categoryFilter);
      }

      if (!this.searchQuery) return cars;
      
      const query = this.searchQuery.toLowerCase();
      return cars.filter(car => {
        const bName = this.getBrandName(car.brandId).toLowerCase();
        const mName = this.getModelName(car.modelId).toLowerCase();
        return (
          bName.includes(query) ||
          mName.includes(query) ||
          car.licensePlate?.toLowerCase().includes(query)
        );
      });
    },
    carGroupsForDisplay() {
      const cars = this.filteredCars || [];

      if (!this.userStore.isAdmin) {
        return [{ id: 'all-cars', name: 'Toutes les voitures', cars }];
      }

      const groups = new Map();
      cars.forEach(car => {
        const agencyId = car.agencyId || 'unassigned';
        const agencyName = this.getAgencyName(car.agencyId);
        if (!groups.has(agencyId)) {
          groups.set(agencyId, {
            id: agencyId,
            name: agencyName,
            cars: []
          });
        }
        groups.get(agencyId).cars.push(car);
      });

      return Array.from(groups.values()).sort((a, b) =>
        a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
      );
    },
    filteredModalModels() {
      if (!this.currentCar.brandId) return [];
      return this.modelStore.getModelsByBrandId(this.currentCar.brandId);
    }
  },
  watch: {
    'currentCar.currentMileage'(val) {
      this.currentCar.nextVidangeKm = (val || 0) + (this.currentCar.oilMileage || 0);
    },
    'currentCar.oilMileage'(val) {
      this.currentCar.nextVidangeKm = (this.currentCar.currentMileage || 0) + (val || 0);
    }
  },
  methods: {
    editCar(car) {
      // Deep clone to avoid mutating store
      this.currentCar = JSON.parse(JSON.stringify(car));
      
      // Ensure arrays/objects are initialized (store normalizes but just in case)
      if (!Array.isArray(this.currentCar.images)) this.currentCar.images = [];
      if (!this.currentCar.equipments || typeof this.currentCar.equipments !== 'object') {
        this.currentCar.equipments = { climatisation: false, cric: false, documents: false, extincteur: false };
      }
      if (!this.currentCar.oilMileage) this.currentCar.oilMileage = 10000;
      this.showModal = true;
    },
    handleImageUpload(event) {
      const files = event.target.files
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader()
          reader.onload = (e) => {
            this.currentCar.images.push(e.target.result)
          }
          reader.readAsDataURL(files[i])
        }
      }
    },
    removeImage(index) {
      this.currentCar.images.splice(index, 1)
    },
    handleSingleFileUpload(event, field) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.currentCar[field] = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async updateCar() {
      try {
        // Rebuild name from brandId/modelId
        const brand = this.brandStore.getBrandById(this.currentCar.brandId);
        const model = this.modelStore.getModelById(this.currentCar.modelId);
        if (brand && model) {
          this.currentCar.name = `${brand.name} ${model.name}`.trim();
        }
        await this.carStore.updateCar(this.currentCar);
        this.showModal = false;
      } catch(e) {
        console.error('Car update failed:', e);
        alert('Erreur lors de la mise à jour.');
      }
    },
    async deleteCar(car) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
        await this.carStore.deleteCar(car.id);
      }
    },
    openSellModal(car) {
      this.carToSell = car;
      this.sellForm = {
        amount: 0,
        paymentMethod: 'espece',
        buyerName: '',
        buyerCNE: ''
      };
      this.showSellModal = true;
    },
    async submitSellForm() {
      if (!this.sellForm.amount || !this.sellForm.buyerName) return;

      // Log transaction
      this.transactionStore.addTransaction({
        amount: this.sellForm.amount,
        type: 'revenue',
        method: this.sellForm.paymentMethod,
        reason: `Vente Véhicule: ${this.carToSell.licensePlate} à ${this.sellForm.buyerName}`,
        subType: this.sellForm.paymentMethod,
        agencyId: this.carToSell.agencyId
      });

      // Update car status via API
      await this.carStore.updateCar({ id: this.carToSell.id, status: 'Vendu' });

      this.showSellModal = false;
    },
    getBrandName(brandId) {
      if (!brandId) return 'Marque Inconnue';
      const brand = this.brandStore.getBrandById(brandId);
      return brand ? brand.name : 'Marque Inconnue';
    },
    getModelName(modelId) {
      if (!modelId) return 'Modèle Inconnu';
      const model = this.modelStore.getModelById(modelId);
      return model ? model.name : 'Modèle Inconnu';
    },
    getAgencyName(agencyId) {
      if (!agencyId) return 'Non Assignée';
      const agency = this.agencyStore.getAgencyById(agencyId);
      return agency ? agency.name : 'Agence Inconnue';
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('fr-FR');
    },
    getDateColor(date) {
      if (!date) return 'text-gray-500 dark:text-gray-400';
      const today = new Date();
      const checkDate = new Date(date);
      const diffDays = Math.ceil((checkDate - today) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'text-red-600';
      if (diffDays <= 7) return 'text-orange-500';
      return 'text-gray-500 dark:text-gray-400';
    },
    normalizeStatus(status) {
      const s = String(status || '').trim().toLowerCase();
      if (s === 'disponile' || s === 'disponible' || s === 'available') return 'Available';
      if (s === 'louée' || s === 'loue' || s === 'rented') return 'Rented';
      if (s === 'maintenance' || s === 'outofservice' || s === 'out_of_service' || s === 'en maintenance' || s === 'indisponible') return 'Maintenance';
      if (s === 'vendu' || s === 'sold') return 'Vendu';
      return status;
    },
    getStatusClass(status) {
      status = this.normalizeStatus(status);
      if (status === 'Available') return 'bg-emerald-900/20 border-emerald-800/30 text-[#10B981]';
      if (status === 'Rented') return 'bg-blue-900/20 border-blue-800/30 text-[#3B82F6]';
      if (status === 'Maintenance' || status === 'OutOfService') return 'bg-red-900/20 border-red-800/30 text-[#EF4444]';
      return 'bg-gray-100/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400';
    },
    getStatusLabel(status) {
      status = this.normalizeStatus(status);
      if (status === 'Available') return 'Disponible';
      if (status === 'Rented') return 'Louée';
      if (status === 'Maintenance' || status === 'OutOfService') return 'En Panne';
      if (status === 'Vendu') return 'Vendu';
      return status || 'Inconnu';
    }
  }
}
</script>
