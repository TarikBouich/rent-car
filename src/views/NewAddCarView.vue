<template>
  <div class="p-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center gap-4 mb-2">
        <button @click="$router.back()" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ajouter une voiture</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Ajoutez un nouveau véhicule à votre flotte</p>
        </div>
      </div>
    </div>

    <!-- Validation Error Banner -->
    <div v-if="validationErrors.length > 0" class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p class="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Veuillez corriger les erreurs suivantes :</p>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="err in validationErrors" :key="err" class="text-sm text-red-600 dark:text-red-300">{{ err }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
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
                    <span class="text-xs text-gray-600 dark:text-gray-400 mt-2 block">Cliquez pour uploader des images</span>
                  </div>
                </div>
              </label>
              <!-- Gallery Preview -->
              <div v-if="carData.images && carData.images.length > 0" class="flex gap-4 overflow-x-auto pb-2">
                <div v-for="(img, idx) in carData.images" :key="idx" class="relative min-w-[120px] w-[120px] h-[120px] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group">
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
            <input v-model="carData.chassisNumber" type="text" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" placeholder="Ex: WBA0000000000" />
          </div>

          <!-- Matricule WWW -->
          <div>
            <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Matricule WWW</label>
            <input v-model="carData.matriculeWWW" type="text" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" placeholder="Ex: WWW-12345" />
          </div>

          <!-- Matricule -->
          <div>
            <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Matricule</label>
            <input v-model="carData.licensePlate" type="text" required class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" placeholder="Ex: 12345-A-1" />
          </div>

          <!-- Section: Informations Générales -->
          <div class="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800">
             <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Informations Générales</h3>
          </div>

<!-- Marque -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300">Marque</label>
              <button
                type="button"
                @click="openBrandModal"
                class="text-xs font-semibold text-[#fa5b0f] hover:text-orange-600"
              >
                + Nouvelle marque
              </button>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              </div>
              <select
                v-model="carData.brandId"
                @change="carData.modelId = ''"
                required
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
              >
                <option value="" disabled>Sélectionner une marque</option>
                <option v-for="brand in brandStore.brands" :key="brand.id" :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Modèle -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300">Modèle</label>
              <button
                type="button"
                @click="openModelModal"
                :disabled="!carData.brandId"
                class="text-xs font-semibold text-[#fa5b0f] hover:text-orange-600 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                + Nouveau modèle
              </button>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              </div>
              <select
                v-model="carData.modelId"
                :disabled="!carData.brandId"
                required
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors disabled:opacity-50"
              >
                <option value="" disabled>Sélectionner un modèle</option>
                <option v-for="model in filteredModels" :key="model.id" :value="model.id">
                  {{ model.name }}
                </option>
              </select>
            </div>
            <!-- Model default photo: one click to reuse it for this car -->
            <div v-if="selectedModel?.image" class="mt-2 flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-lg">
              <img :src="selectedModel.image" alt="Modèle" class="w-16 h-12 object-cover rounded" @error="$event.target.style.display = 'none'" />
              <button type="button" @click="useModelImage" class="text-xs font-semibold text-[#fa5b0f] hover:text-orange-600">
                Utiliser la photo du modèle
              </button>
            </div>
          </div>

        <!-- License Plate -->
          <div>
            <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Plaque d'immatriculation</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
              </div>
              <input
                v-model="carData.licensePlate"
                type="text"
                required
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
                placeholder="Ex: ABC-1234"
              />
            </div>
          </div>

          <!-- Date Mise en circulation -->
          <div>
            <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Date Mise en circulation</label>
            <input v-model="carData.circulationDate" type="date" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" />
          </div>

          <!-- Nombre de place -->
          <div>
            <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre de places</label>
            <input v-model.number="carData.seats" type="number" min="1" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" placeholder="Ex: 5" />
          </div>

          <!-- Type de carburant -->
          <div>
            <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Type de carburant</label>
            <select v-model="carData.fuelType" class="w-full px-4 py-2.5 bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors">
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
                v-model="carData.color"
                type="color"
                required
                class="w-full pl-10 pr-4 py-1.5 h-[42px] bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors cursor-pointer"
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
                v-model.number="carData.pricePerDay"
                id="car-price-per-day"
                name="car_price_per_day"
                type="number"
                required
                min="0"
                step="1"
                inputmode="numeric"
                autocomplete="off"
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
                placeholder="Ex: 500"
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
                v-model.number="carData.currentMileage"
                id="car-current-mileage"
                name="car_current_mileage"
                type="number"
                required
                min="0"
                step="1"
                inputmode="numeric"
                autocomplete="off"
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
                placeholder="Ex: 15000"
              />
            </div>
          </div>

          <!-- Kilométrage huile -->
          <div>
            <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Kilométrage huile (Durée de vie)</label>
            <input v-model.number="carData.oilMileage" type="number" min="0" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" placeholder="Ex: 10000" />
          </div>

          <!-- Next Oil Change -->
          <div>
            <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Prochaine vidange (km)</label>
            <div class="relative">
              <input v-model.number="carData.nextVidangeKm" type="number" readonly class="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none cursor-not-allowed opacity-70" />
            </div>
            <p class="text-xs text-gray-500 mt-1">Calculé automatiquement</p>
          </div>

          <!-- Kilometrage moyen/jour -->
          <div>
            <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Kilométrage moyen/jour</label>
            <input v-model.number="carData.averageMileagePerDay" type="number" min="0" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" placeholder="Ex: 150" />
          </div>

          <!-- Insurance End Date -->
          <div>
            <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Date d'expiration de l'assurance</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <input
                v-model="carData.assuranceEndDate"
                type="date"
                required
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
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
                v-model="carData.visiteTechniqueEndDate"
                type="date"
                required
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
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
                v-model="carData.transmission"
                required
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
              >
                <option value="manual">Manuelle</option>
                <option value="automatic">Automatique</option>
              </select>
            </div>
          </div>

          <!-- Section: Equipements / Accessoires -->
          <div class="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800">
             <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Equipements & Accessoires</h3>
             <div class="flex flex-wrap gap-6">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="carData.equipments.climatisation" class="w-4 h-4 text-[#fa5b0f] rounded border-gray-300 focus:ring-[#fa5b0f]">
                  <span class="text-sm text-gray-700 dark:text-gray-300">Climatisation</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="carData.equipments.cric" class="w-4 h-4 text-[#fa5b0f] rounded border-gray-300 focus:ring-[#fa5b0f]">
                  <span class="text-sm text-gray-700 dark:text-gray-300">Cric</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="carData.equipments.documents" class="w-4 h-4 text-[#fa5b0f] rounded border-gray-300 focus:ring-[#fa5b0f]">
                  <span class="text-sm text-gray-700 dark:text-gray-300">Documents</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="carData.equipments.extincteur" class="w-4 h-4 text-[#fa5b0f] rounded border-gray-300 focus:ring-[#fa5b0f]">
                  <span class="text-sm text-gray-700 dark:text-gray-300">Extincteur</span>
                </label>
             </div>
          </div>

          <!-- Observation -->
          <div class="md:col-span-2">
            <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Observation</label>
            <textarea v-model="carData.observation" rows="3" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" placeholder="Notes supplémentaires..."></textarea>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Statut</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <select
                v-model="carData.status"
                required
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
              >
                <option value="Available">Disponible (En Parc)</option>
                <option value="Rented">Louée</option>
                <option value="Sold">Vendue</option>
              </select>
            </div>
          </div>
          
          <!-- Section: Information de Vente (Conditional) -->
          <template v-if="carData.status === 'Sold'">
            <div class="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800">
               <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Informations de vente</h3>
            </div>
            
            <!-- Acheteur -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Acheteur</label>
              <input v-model="carData.buyerName" type="text" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" placeholder="Nom de l'acheteur" />
            </div>

            <!-- Prix de vente -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Prix de vente (DH)</label>
              <input v-model.number="carData.salePrice" type="number" min="0" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" />
            </div>

            <!-- Date autorisation retrait -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Date d'autorisation de retrait</label>
              <input v-model="carData.withdrawalAuthDate" type="date" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" />
            </div>

            <!-- Date vente -->
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Date de vente</label>
              <input v-model="carData.saleDate" type="date" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" />
            </div>

            <!-- Fichiers Acheteur -->
            <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div>
                 <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">CNE Acheteur (Recto)</label>
                 <input type="file" @change="e => handleSingleFileUpload(e, 'buyerCneFront')" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-gray-800 dark:file:text-white" />
              </div>
              <div>
                 <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">CNE Acheteur (Verso)</label>
                 <input type="file" @change="e => handleSingleFileUpload(e, 'buyerCneBack')" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-gray-800 dark:file:text-white" />
              </div>
              <div>
                 <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Autorisation de retrait</label>
                 <input type="file" @change="e => handleSingleFileUpload(e, 'withdrawalAuthFile')" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-gray-800 dark:file:text-white" />
              </div>
              <div>
                 <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Document Roulage</label>
                 <input type="file" @change="e => handleSingleFileUpload(e, 'roulageFile')" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-gray-800 dark:file:text-white" />
              </div>
            </div>
          </template>

          <!-- Agency Assignment -->
          <div>
            <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Agence</label>
            <div v-if="isGerant" class="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm">
              {{ userAgencyName || 'Agence non assignée' }}
            </div>
            <div v-else class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <select
                v-model="carData.agencyId"
                required
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
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
                <input type="checkbox" v-model="carData.isCreditPurchase" class="sr-only" />
                <div class="block bg-gray-200 dark:bg-gray-700 w-10 h-6 rounded-full transition-colors" :class="{ 'bg-[#fa5b0f]': carData.isCreditPurchase }"></div>
                <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform" :class="{ 'translate-x-4': carData.isCreditPurchase }"></div>
              </div>
              <span class="text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300">Achat à crédit (Traites mensuelles)</span>
            </label>
          </div>

          <!-- Credit Fields -->
          <template v-if="carData.isCreditPurchase">
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Montant d'avance (DH)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-sm text-gray-400 font-bold">DH</span>
                </div>
                <input v-model.number="carData.initialAdvance" type="number" min="0" class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" placeholder="0" />
              </div>
            </div>

            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Paiement Avance</label>
              <div class="relative">
                <select v-model="carData.advanceMethod" class="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors">
                  <option value="espece">Espèces</option>
                  <option value="virement">Virement Bancaire</option>
                  <option value="carte bancaire">Carte Bancaire</option>
                  <option value="cheque">Chèque</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Mensualité Traite (DH)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-sm text-gray-400 font-bold">DH</span>
                </div>
                <input v-model.number="carData.monthlyTraite" type="number" required min="1" class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" placeholder="Ex: 2500" />
              </div>
            </div>

            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Durée (Mois)</label>
              <div class="relative">
                <input v-model.number="carData.traiteDuration" type="number" required min="1" class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" placeholder="Ex: 48" />
              </div>
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-2">Date début crédit</label>
              <div class="relative">
                <input v-model="carData.creditStartDate" type="date" required class="w-full pl-4 pr-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors" />
              </div>
            </div>
          </template>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            @click="$router.back()"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-[8px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-[#fa5b0f] rounded-[8px] hover:bg-orange-500"
          >
            Ajouter la voiture
          </button>
        </div>
      </form>
    </div>

    <!-- Add Brand Modal -->
    <div
      v-if="showBrandModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="closeBrandModal"
    >
      <div class="bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-xl w-full max-w-md shadow-2xl">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Ajouter une marque</h3>
          <button @click="closeBrandModal" class="p-1 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom de la marque</label>
          <input
            v-model.trim="newBrandName"
            type="text"
            placeholder="Ex: BMW"
            class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
          />
          <p v-if="brandModalError" class="mt-2 text-sm text-red-500">{{ brandModalError }}</p>
        </div>
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <button @click="closeBrandModal" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-[8px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">Annuler</button>
          <button @click="saveBrandFromModal" class="px-4 py-2 text-sm font-medium text-white bg-[#fa5b0f] rounded-[8px] hover:bg-orange-500">Ajouter</button>
        </div>
      </div>
    </div>

    <!-- Add Model Modal -->
    <div
      v-if="showModelModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="closeModelModal"
    >
      <div class="bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-xl w-full max-w-md shadow-2xl">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Ajouter un modèle</h3>
          <button @click="closeModelModal" class="p-1 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Marque</label>
            <input :value="selectedBrandName" type="text" readonly class="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm opacity-80" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom du modèle</label>
            <input
              v-model.trim="newModelName"
              type="text"
              placeholder="Ex: Série 3"
              class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photo par défaut <span class="font-normal text-gray-500">(lien net, réutilisée à chaque voiture)</span></label>
            <input
              v-model.trim="newModelImage"
              type="url"
              placeholder="Ex: https://.../clio.jpg"
              class="w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
            />
          </div>
          <p v-if="modelModalError" class="text-sm text-red-500">{{ modelModalError }}</p>
        </div>
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <button @click="closeModelModal" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-[8px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">Annuler</button>
          <button @click="saveModelFromModal" class="px-4 py-2 text-sm font-medium text-white bg-[#fa5b0f] rounded-[8px] hover:bg-orange-500">Ajouter</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCarStore } from '../stores/carStore'
import { useUserStore } from '../stores/userStore'
import { useAgencyStore } from '../stores/agencyStore'
import { useBrandStore } from '../stores/brandStore'
import { useModelStore } from '../stores/modelStore'
import { useTransactionStore } from '../stores/transactionStore'

export default {
  name: 'NewAddCarView',
  setup() {
    const router = useRouter()
    const carStore = useCarStore()
    const userStore = useUserStore()
    const agencyStore = useAgencyStore()
    const brandStore = useBrandStore()
    const modelStore = useModelStore()
    const transactionStore = useTransactionStore()

    // Ensure agencies are loaded if not already
    agencyStore.initializeFromStorage()
    brandStore.initializeFromStorage()
    modelStore.initializeFromStorage()
    transactionStore.initializeFromStorage()

    const carData = ref({
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
    })
    
    // Auto-calculate prochaine vidange when currentMileage or oilMileage changes
    watch([() => carData.value.currentMileage, () => carData.value.oilMileage], ([current, oil]) => {
      carData.value.nextVidangeKm = (current || 0) + (oil || 0)
    })

    const normalizeRole = (role) =>
      String(role || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()

    const isGerant = computed(() => normalizeRole(userStore.currentUser?.role) === 'gerant')

    const userAgencyName = computed(() => {
      if (!carData.value.agencyId) return ''
      const agency = agencyStore.agencies.find(a => a.id === carData.value.agencyId)
      return agency?.name || ''
    })

    if (isGerant.value) {
      carData.value.agencyId = userStore.currentUser?.agencyId || ''
    }

    const handleImageUpload = (event) => {
      const files = event.target.files
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader()
          reader.onload = (e) => {
            carData.value.images.push(e.target.result)
          }
          reader.readAsDataURL(files[i])
        }
      }
    }
    
    const removeImage = (index) => {
      carData.value.images.splice(index, 1)
    }

    const handleSingleFileUpload = (event, field) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          carData.value[field] = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const filteredModels = computed(() => {
      if (!carData.value.brandId) return []
      return modelStore.getModelsByBrandId(carData.value.brandId)
    })

    const selectedModel = computed(() => {
      if (!carData.value.modelId) return null
      return modelStore.getModelById(carData.value.modelId) || null
    })

    // Auto-fill car photo from model default when the car has no photo yet
    watch(() => carData.value.modelId, () => {
      const img = selectedModel.value?.image
      if (img && (!carData.value.images || carData.value.images.length === 0)) {
        carData.value.images = [img]
        carData.value.image = img
      }
    })

    const useModelImage = () => {
      const img = selectedModel.value?.image
      if (!img) return
      if (!carData.value.images.includes(img)) carData.value.images.unshift(img)
      carData.value.image = img
    }

    const validationErrors = ref([])
    const showBrandModal = ref(false)
    const newBrandName = ref('')
    const brandModalError = ref('')
    const showModelModal = ref(false)
    const newModelName = ref('')
    const newModelImage = ref('')
    const modelModalError = ref('')

    const selectedBrandName = computed(() => {
      const brand = brandStore.brands.find(b => b.id === carData.value.brandId)
      return brand?.name || ''
    })

    const openBrandModal = () => {
      brandModalError.value = ''
      newBrandName.value = ''
      showBrandModal.value = true
    }

    const closeBrandModal = () => {
      showBrandModal.value = false
      brandModalError.value = ''
    }

    const saveBrandFromModal = async () => {
      const name = newBrandName.value.trim()
      if (!name) {
        brandModalError.value = 'Le nom de la marque est obligatoire.'
        return
      }

      const exists = brandStore.brands.some(b => b.name?.trim().toLowerCase() === name.toLowerCase())
      if (exists) {
        brandModalError.value = 'Cette marque existe déjà.'
        return
      }

      const created = await brandStore.addBrand(name)
      if (!created?.id) {
        brandModalError.value = "Impossible d'ajouter la marque."
        return
      }

      carData.value.brandId = created.id
      carData.value.modelId = ''
      closeBrandModal()
    }

    const openModelModal = () => {
      if (!carData.value.brandId) {
        modelModalError.value = 'Veuillez sélectionner une marque avant d’ajouter un modèle.'
        return
      }
      modelModalError.value = ''
      newModelName.value = ''
      newModelImage.value = ''
      showModelModal.value = true
    }

    const closeModelModal = () => {
      showModelModal.value = false
      modelModalError.value = ''
    }

    const saveModelFromModal = async () => {
      const name = newModelName.value.trim()
      if (!carData.value.brandId) {
        modelModalError.value = 'Marque manquante.'
        return
      }
      if (!name) {
        modelModalError.value = 'Le nom du modèle est obligatoire.'
        return
      }

      const exists = modelStore
        .getModelsByBrandId(carData.value.brandId)
        .some(m => m.name?.trim().toLowerCase() === name.toLowerCase())
      if (exists) {
        modelModalError.value = 'Ce modèle existe déjà pour cette marque.'
        return
      }

      const created = await modelStore.addModel(carData.value.brandId, name, '', newModelImage.value.trim() || null)
      if (!created?.id) {
        modelModalError.value = "Impossible d'ajouter le modèle."
        return
      }

      carData.value.modelId = created.id
      closeModelModal()
    }

    const handleSubmit = async () => {
      validationErrors.value = []

      if (isGerant.value) {
        carData.value.agencyId = userStore.currentUser?.agencyId || ''
      }

      // Validate required fields
      if (!carData.value.brandId) validationErrors.value.push('La marque est obligatoire')
      if (!carData.value.modelId) validationErrors.value.push('Le modèle est obligatoire')
      if (!carData.value.licensePlate?.trim()) validationErrors.value.push('La plaque d\'immatriculation est obligatoire')
      if (!carData.value.agencyId) validationErrors.value.push('L\'agence est obligatoire')
      if (!carData.value.pricePerDay || carData.value.pricePerDay <= 0) validationErrors.value.push('Le prix par jour est obligatoire')
      if (!carData.value.assuranceEndDate) validationErrors.value.push('La date d\'expiration de l\'assurance est obligatoire')
      if (!carData.value.visiteTechniqueEndDate) validationErrors.value.push('La date de visite technique est obligatoire')

      if (validationErrors.value.length > 0) {
        // Scroll to top to show errors
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      const brandName = brandStore.brands.find(b => b.id === carData.value.brandId)?.name || ''
      const modelName = modelStore.getModelsByBrandId(carData.value.brandId).find(m => m.id === carData.value.modelId)?.name || ''

      try {
        await carStore.addCar({
          ...carData.value,
          name: `${brandName} ${modelName}`.trim() || carData.value.licensePlate,
          id: Date.now().toString()
        })
        
        // Inject transaction if advance exists
        if (carData.value.isCreditPurchase && carData.value.initialAdvance > 0) {
          transactionStore.addTransaction({
             amount: carData.value.initialAdvance,
             type: 'expense',
             method: carData.value.advanceMethod,
             reason: 'Avance Achat Véhicule: ' + carData.value.licensePlate,
             agencyId: carData.value.agencyId,
             subType: carData.value.advanceMethod
          })
        }
        
        // Navigate back to cars list only on success
        router.push({ name: 'cars' })
      } catch(e) {
        validationErrors.value.push('Erreur serveur : ' + (e.response?.data?.message || e.message))
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    return {
      carData,
      agencyStore,
      brandStore,
      modelStore,
      filteredModels,
      selectedModel,
      useModelImage,
      showBrandModal,
      newBrandName,
      brandModalError,
      showModelModal,
      newModelName,
      newModelImage,
      modelModalError,
      selectedBrandName,
      openBrandModal,
      closeBrandModal,
      saveBrandFromModal,
      openModelModal,
      closeModelModal,
      saveModelFromModal,
      isGerant,
      userAgencyName,
      handleImageUpload,
      removeImage,
      handleSingleFileUpload,
      handleSubmit,
      validationErrors
    }
  }
}
</script>
