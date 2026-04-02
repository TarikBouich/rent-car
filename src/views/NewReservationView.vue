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
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Nouvelle Location</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Créez une nouvelle location de véhicule</p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb Stepper -->
    <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 mb-6 overflow-x-auto without-scrollbar">
      <nav class="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
        <template v-for="(step, index) in steps" :key="step.id">
          <div 
            class="flex items-center cursor-pointer transition-colors"
            @click="goToStep(index)"
          >
            <span class="mr-2" :class="index < currentStep ? 'bg-[#fa5b0f] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs' : (index === currentStep ? 'text-[#fa5b0f] font-bold' : '')">
              <svg v-if="index < currentStep" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </span>
            <span :class="{'font-bold text-[#fa5b0f]': index === currentStep, 'text-[#fa5b0f]': index < currentStep}">{{ step.label }}</span>
          </div>
          <svg v-if="index < steps.length - 1" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mx-2 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </template>
      </nav>
    </div>

    <!-- Step Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Step 1: Véhicule -->
        <div v-show="currentStep === 0" class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sélectionner un véhicule</h2>
          
          <!-- Available Cars Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="car in availableCars" 
              :key="car.id"
              @click="selectCar(car)"
              class="border-2 rounded-lg p-4 cursor-pointer transition-all"
              :class="reservation.carId === car.id ? 'border-[#2563EB] bg-[#fa5b0f]/10' : 'border-gray-200 dark:border-gray-800 hover:border-gray-700'"
            >
              <div class="flex items-center gap-4">
                <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  <img v-if="car.images && car.images.length > 0" :src="car.images[0]" :alt="car.licensePlate" class="w-full h-full object-cover" />
                  <img v-else-if="car.image" :src="car.image" :alt="car.licensePlate" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.8a1 1 0 0 0-.8.4L2.3 11l-5.16.86A1 1 0 0 0 .84 12.99V16h3" />
                      <circle cx="6.5" cy="16.5" r="2.5" />
                      <circle cx="16.5" cy="16.5" r="2.5" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">{{ car.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ car.licensePlate }}</p>
                  <p class="text-sm font-medium text-[#fa5b0f] mt-1">{{ car.pricePerDay }} DH/jour</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="availableCars.length === 0" class="text-center py-8 text-gray-600 dark:text-gray-400">
            Aucun véhicule disponible
          </div>
        </div>

        <!-- Step 2: Client -->
        <div v-show="currentStep === 1" class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sélectionner un client</h2>
          
          <div class="space-y-4">
            <div 
              v-for="client in clients" 
              :key="client.nationalId"
              @click="selectClient(client)"
              class="border-2 rounded-lg p-4 cursor-pointer transition-all"
              :class="reservation.clientId === client.nationalId ? 'border-[#2563EB] bg-[#fa5b0f]/10' : 'border-gray-200 dark:border-gray-800 hover:border-gray-700'"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ client.firstName?.[0] }}{{ client.lastName?.[0] }}</span>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">{{ client.firstName }} {{ client.lastName }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ client.phoneNumber }}</p>
                  </div>
                </div>
                <span 
                  v-if="hasActiveReservation(client.nationalId)"
                  class="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"
                >
                  Location active
                </span>
              </div>
            </div>
          </div>

          <div v-if="clients.length === 0" class="text-center py-8 text-gray-600 dark:text-gray-400">
            Aucun client trouvé
          </div>
        </div>

        <!-- Step 3: Conducteur -->
        <div v-show="currentStep === 2" class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations du conducteur</h2>
          
          <div class="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              id="hasSecondDriver"
              v-model="reservation.hasSecondDriver"
              class="w-4 h-4 text-[#fa5b0f] border-gray-300 dark:border-gray-700 rounded focus:ring-[#fa5b0f]"
            />
            <label for="hasSecondDriver" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ajouter un deuxième conducteur
            </label>
          </div>

          <div v-if="reservation.hasSecondDriver" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input
                v-model="reservation.driver.firstName"
                type="text"
                class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
              />
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input
                v-model="reservation.driver.lastName"
                type="text"
                class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
              />
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">Numéro de permis</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input
                v-model="reservation.driver.license"
                type="text"
                class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
              />
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">Date de délivrance</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <input
                v-model="reservation.driver.licenseDate"
                type="date"
                class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
              />
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">Ville de délivrance</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input
                v-model="reservation.driver.licenseCity"
                type="text"
                class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
              />
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">CIN</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input
                v-model="reservation.driver.cin"
                type="text"
                class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
              />
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <input
                v-model="reservation.driver.phone"
                type="tel"
                class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
              />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Kilométrage/Carburant -->
        <div v-show="currentStep === 3" class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Kilométrage et Carburant</h2>
          
          <!-- Vehicle Damage Map -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">État du véhicule</label>
            <div class="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-[#1C1C1C] relative">
              <!-- Car SVG Outline -->
              <svg viewBox="0 0 400 200" class="w-full max-w-md mx-auto">
                <!-- Side Profile -->
                <path 
                  d="M50 140 Q50 100 100 90 L300 90 Q350 90 350 140 L350 150 L30 150 L30 140 Z" 
                  fill="none" 
                  stroke="#6B7280" 
                  stroke-width="1.5"
                />
                <!-- Windows -->
                <path d="M110 95 L160 95 L160 125 L100 125 Z" fill="none" stroke="#6B7280" stroke-width="1.5"/>
                <path d="M170 95 L240 95 L240 125 L170 125 Z" fill="none" stroke="#6B7280" stroke-width="1.5"/>
                <!-- Wheels -->
                <circle cx="100" cy="150" r="25" fill="none" stroke="#6B7280" stroke-width="1.5"/>
                <circle cx="280" cy="150" r="25" fill="none" stroke="#6B7280" stroke-width="1.5"/>
                <circle cx="100" cy="150" r="15" fill="none" stroke="#6B7280" stroke-width="1.5"/>
                <circle cx="280" cy="150" r="15" fill="none" stroke="#6B7280" stroke-width="1.5"/>
                <!-- Damage Markers -->
                <circle 
                  v-for="(damage, index) in damages" 
                  :key="index"
                  :cx="damage.x" 
                  :cy="damage.y" 
                  r="8" 
                  :fill="damage.type === 'existing' ? '#F59E0B' : '#EF4444'"
                  class="cursor-pointer"
                  @click="removeDamage(index)"
                />
              </svg>
              
              <!-- Click to add damage -->
              <p class="text-center text-xs text-gray-600 dark:text-gray-400 mt-2">Cliquez sur la carrosserie pour ajouter un dommage</p>
            </div>
            
            <!-- Legend -->
            <div class="flex items-center gap-4 mt-3">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                <span class="text-xs text-gray-600 dark:text-gray-400">Dommage existant</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-red-500"></span>
                <span class="text-xs text-gray-600 dark:text-gray-400">Nouveau dommage</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">Kilométrage de départ</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <input
                v-model="reservation.currentMileage"
                type="number"
                class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
                placeholder="Ex: 15000"
              />
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">Niveau de carburant</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </div>
                <select
                v-model="reservation.fuelLevel"
                class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
              >
                <option value="full">Plein</option>
                <option value="3/4">3/4</option>
                <option value="1/2">1/2</option>
                <option value="1/4">1/4</option>
                <option value="empty">Vide</option>
              </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: Tarification -->
        <div v-show="currentStep === 4" class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tarification</h2>
          
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">Date de départ</label>
                <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <input
                  v-model="reservation.startDate"
                  type="date"
                  class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
                  @change="calculateTotal"
                />
              </div>
              </div>
              <div>
                <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">Date de retour</label>
                <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <input
                  v-model="reservation.endDate"
                  type="date"
                  class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
                  :min="reservation.startDate"
                  @change="calculateTotal"
                />
              </div>
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">Prix journalier (DH)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <input
                v-model="reservation.pricePerDay"
                type="number"
                class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
              />
              </div>
            </div>
          </div>

          <!-- Pricing Table -->
          <div class="mt-6 border-t pt-4">
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Prix Journalier</span>
                <span class="font-medium">{{ reservation.pricePerDay || 0 }} DH</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Nombre de Jours</span>
                <span class="font-medium">{{ numberOfDays }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Sous-total</span>
                <span class="font-medium">{{ subtotal }} DH</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">TVA ({{ settingsStore.tvaRate }}%)</span>
                <span class="font-medium">{{ tva }} DH</span>
              </div>
              <div class="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total TTC</span>
                <span class="text-[#fa5b0f]">{{ total }} DH</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 6: Paiement -->
        <div v-show="currentStep === 5" class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Paiement</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">Montant avancé (DH)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <input
                v-model="reservation.advance"
                type="number"
                class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
              />
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">Mode de paiement</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </div>
                <select
                v-model="reservation.paymentMethod"
                class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
              >
                <option value="cash">Espèces</option>
                <option value="card">Carte bancaire</option>
                <option value="transfer">Virement</option>
              </select>
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-[Inter] font-medium text-gray-700 dark:text-gray-300 mb-1">Caution (DH)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <input
                v-model="reservation.deposit"
                type="number"
                class="w-full pl-10 pr-4 py-2.5  bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors"
                placeholder="Ex: 5000"
              />
              </div>
            </div>
          </div>

          <!-- Digital Signature Pad -->
          <div class="mt-6">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Signature du Client</label>
              <button 
                type="button"
                @click="clearSignature"
                class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-300"
              >
                Effacer
              </button>
            </div>
            <div 
              class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg h-40 bg-[#F9FAFB] cursor-pointer relative"
              @click="startSignature"
              @mousedown="drawSignature"
              @mousemove="drawSignature"
              @mouseup="stopSignature"
              @mouseleave="stopSignature"
            >
              <canvas ref="signatureCanvas" class="w-full h-full"></canvas>
              <p v-if="!hasSignature" class="absolute inset-0 flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm">
                Cliquez pour signer
              </p>
            </div>
          </div>
        </div>

        <!-- Step 7: Contrat -->
        <div v-show="currentStep === 6" class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contrat de location</h2>
          
          <!-- PDF Preview -->
          <div class="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-[#1C1C1C] mb-6">
            <div class="bg-white shadow-sm p-6 max-w-lg mx-auto text-xs">
              <div class="text-center border-b pb-2 mb-2">
                <h3 class="font-bold">CONTRAT DE LOCATION</h3>
                <p class="text-gray-600 dark:text-gray-400">N° {{ Date.now() }}</p>
              </div>
              <div class="space-y-2">
                <p><span class="font-medium">Véhicule:</span> {{ selectedCar?.name }} ({{ selectedCar?.licensePlate }})</p>
                <p><span class="font-medium">Client:</span> {{ selectedClient?.firstName }} {{ selectedClient?.lastName }}</p>
                <p><span class="font-medium">Période:</span> {{ formatDate(reservation.startDate) }} - {{ formatDate(reservation.endDate) }}</p>
                <p><span class="font-medium">Prix total:</span> {{ total }} DH</p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <button 
              type="button"
              class="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-[8px] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-[#1C1C1C]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sticky top-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Récapitulatif</h3>
          
          <div class="space-y-4">
            <!-- Selected Car -->
            <div v-if="selectedCar" class="flex items-center gap-3 pb-4 border-b">
              <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                <img v-if="selectedCar.images && selectedCar.images.length > 0" :src="selectedCar.images[0]" :alt="selectedCar.licensePlate" class="w-full h-full object-cover" />
                <img v-else-if="selectedCar.image" :src="selectedCar.image" :alt="selectedCar.licensePlate" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ selectedCar.name }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ selectedCar.licensePlate }}</p>
              </div>
            </div>

            <!-- Selected Client -->
            <div v-if="selectedClient" class="pb-4 border-b">
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Client</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ selectedClient.firstName }} {{ selectedClient.lastName }}</p>
            </div>

            <!-- Dates -->
            <div class="pb-4 border-b">
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Période</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ formatDate(reservation.startDate) }} - {{ formatDate(reservation.endDate) }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ numberOfDays }} jour(s)</p>
            </div>

            <!-- Total -->
            <div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Total TTC</span>
                <span class="text-xl font-bold text-[#fa5b0f]">{{ total }} DH</span>
              </div>
              <div v-if="reservation.advance > 0" class="flex justify-between items-center mt-2">
                <span class="text-gray-600 dark:text-gray-400">Avance</span>
                <span class="font-medium text-green-600">-{{ reservation.advance }} DH</span>
              </div>
              <div v-if="reservation.advance > 0" class="flex justify-between items-center mt-1 pt-2 border-t">
                <span class="font-medium">Reste à payer</span>
                <span class="font-bold">{{ total - reservation.advance }} DH</span>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="mt-6 space-y-3">
            <button
              v-if="currentStep > 0"
              @click="prevStep"
              class="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-[8px] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-[#1C1C1C]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Retour
            </button>
            <button
              v-if="currentStep < steps.length - 1"
              @click="nextStep"
              :disabled="!canProceed"
              class="w-full px-4 py-2 bg-[#fa5b0f] text-white rounded-[8px] text-sm font-medium hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
            <button
              v-if="currentStep === steps.length - 1"
              @click="submitReservation"
              class="w-full px-4 py-2 bg-[#fa5b0f] text-white rounded-[8px] text-sm font-medium hover:bg-orange-500"
            >
              Générer le Contrat
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientStore } from '../stores/clientStore'
import { useCarStore } from '../stores/carStore'
import { useUserStore } from '../stores/userStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useTransactionStore } from '../stores/transactionStore'
import { generateNextId } from '../utils/idGenerator'

export default {
  name: 'NewReservationView',
  setup() {
    const router = useRouter()
    const clientStore = useClientStore()
    const carStore = useCarStore()
    const userStore = useUserStore()
    const transactionStore = useTransactionStore()

    const currentStep = ref(0)
    const steps = [
      { id: 'vehicle', label: 'Véhicule' },
      { id: 'client', label: 'Client' },
      { id: 'driver', label: 'Conducteur' },
      { id: 'mileage', label: 'Kilométrage' },
      { id: 'pricing', label: 'Tarification' },
      { id: 'payment', label: 'Paiement' },
      { id: 'contract', label: 'Contrat' }
    ]

    const reservation = ref({
      carId: '',
      clientId: '',
      currentMileage: 0,
      fuelLevel: 'full',
      startDate: '',
      endDate: '',
      pricePerDay: 0,
      advance: 0,
      deposit: 0,
      paymentMethod: 'cash',
      hasSecondDriver: false,
      driver: {
        firstName: '',
        lastName: '',
        license: '',
        licenseDate: '',
        licenseCity: '',
        cin: '',
        phone: ''
      }
    })

    const damages = ref([])
    const hasSignature = ref(false)
    const signatureCanvas = ref(null)
    let isDrawing = false

    const clients = computed(() => clientStore.filteredClients)
    const availableCars = computed(() => carStore.filteredCars)
    const selectedCar = computed(() => carStore.filteredCars.find(c => c.licensePlate === reservation.value.carId))
    const selectedClient = computed(() => clients.value.find(c => c.nationalId === reservation.value.clientId))

    const settingsStore = useSettingsStore()

    onMounted(() => {
      userStore.initializeFromStorage()
      carStore.initializeFromStorage()
      clientStore.initializeFromStorage()
      settingsStore.initializeFromStorage()
      transactionStore.initializeFromStorage()
    })

    const numberOfDays = computed(() => {
      if (!reservation.value.startDate || !reservation.value.endDate) return 0
      const start = new Date(reservation.value.startDate)
      const end = new Date(reservation.value.endDate)
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    })

    const subtotal = computed(() => (reservation.value.pricePerDay || 0) * numberOfDays.value)
    const tva = computed(() => Math.round(subtotal.value * (settingsStore.tvaRate / 100)))
    const total = computed(() => subtotal.value + tva.value)

    const canProceed = computed(() => {
      switch (currentStep.value) {
        case 0: return !!reservation.value.carId
        case 1: return !!reservation.value.clientId
        case 2: return !reservation.value.hasSecondDriver || (reservation.value.driver.firstName && reservation.value.driver.lastName)
        case 3: return reservation.value.currentMileage > 0
        case 4: return reservation.value.startDate && reservation.value.endDate && numberOfDays.value > 0
        case 5: return reservation.value.advance >= 0
        default: return true
      }
    })

    const selectCar = (car) => {
      reservation.value.carId = car.licensePlate  // Use licensePlate as that's what the app expects
      reservation.value.pricePerDay = car.pricePerDay
      reservation.value.currentMileage = car.currentMileage
    }

    const selectClient = (client) => {
      reservation.value.clientId = client.nationalId
    }

    const goToStep = (index) => {
      if (index < currentStep.value) {
        currentStep.value = index
      }
    }

    const nextStep = () => {
      if (canProceed.value && currentStep.value < steps.length - 1) {
        currentStep.value++
      }
    }

    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--
      }
    }

    const calculateTotal = () => {
      // Auto-calculate when dates change
    }

    const startSignature = () => {
      if (signatureCanvas.value) {
        const ctx = signatureCanvas.value.getContext('2d')
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        isDrawing = true
      }
    }

    const drawSignature = (e) => {
      if (!isDrawing || !signatureCanvas.value) return
      const ctx = signatureCanvas.value.getContext('2d')
      const rect = signatureCanvas.value.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      ctx.lineTo(x, y)
      ctx.stroke()
      hasSignature.value = true
    }

    const stopSignature = () => {
      isDrawing = false
    }

    const clearSignature = () => {
      if (signatureCanvas.value) {
        const ctx = signatureCanvas.value.getContext('2d')
        ctx.clearRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height)
        hasSignature.value = false
      }
    }

    const formatDate = (date) => {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fr-FR')
    }

    const hasActiveReservation = (clientId) => {
      return carStore.filteredReservations.some(res => res.clientId === clientId && res.status === 'Active')
    }

    const submitReservation = () => {
      const newReservation = {
        id: generateNextId(carStore.reservations),
        clientId: reservation.value.clientId,
        carId: reservation.value.carId,
        currentMileage: parseInt(reservation.value.currentMileage),
        pricePerDay: parseFloat(reservation.value.pricePerDay),
        startDate: reservation.value.startDate,
        endDate: reservation.value.endDate,
        advance: parseFloat(reservation.value.advance) || 0,
        deposit: parseFloat(reservation.value.deposit) || 0,
        paymentMethod: reservation.value.paymentMethod,
        hasSecondDriver: reservation.value.hasSecondDriver,
        driver: reservation.value.hasSecondDriver ? { ...reservation.value.driver } : null,
        status: 'Active',
        createdAt: new Date().toISOString(),
        agencyId: userStore.currentAgencyId,
        clientName: selectedClient.value ? `${selectedClient.value.firstName} ${selectedClient.value.lastName}` : '',
        carName: selectedCar.value?.name || '',
        numberOfDays: numberOfDays.value,
        totalPrice: total.value,
        remaining: total.value - (reservation.value.advance || 0),
        damages: damages.value
      }

      carStore.addReservation(newReservation)

      // Post transactions if advance exists
      if (newReservation.advance > 0) {
        let mappedMethod = 'espece'
        if (newReservation.paymentMethod === 'card') mappedMethod = 'carte bancaire'
        if (newReservation.paymentMethod === 'transfer') mappedMethod = 'virement'

        transactionStore.addTransaction({
          amount: newReservation.advance,
          type: 'revenue',
          method: mappedMethod,
          reason: `Avance Location Num: ${newReservation.id} (Matricule: ${selectedCar.value?.licensePlate || ''})`,
          subType: mappedMethod,
          agencyId: userStore.currentAgencyId
        })
      }

      // Update car status to Rented
      if (selectedCar.value) {
        const carIndex = carStore.cars.findIndex(c => c.licensePlate === selectedCar.value.licensePlate)
        if (carIndex !== -1) {
          carStore.cars[carIndex].status = 'Rented'
          carStore.saveCars()
        }
      }

      router.push({ name: 'reservations' })
    }

    return {
      currentStep,
      steps,
      reservation,
      clients,
      availableCars,
      selectedCar,
      selectedClient,
      numberOfDays,
      subtotal,
      tva,
      total,
      settingsStore,
      canProceed,
      damages,
      hasSignature,
      signatureCanvas,
      selectCar,
      selectClient,
      goToStep,
      nextStep,
      prevStep,
      calculateTotal,
      startSignature,
      drawSignature,
      stopSignature,
      clearSignature,
      formatDate,
      hasActiveReservation,
      submitReservation,
      getStepClass: (index) => {
        if (index < currentStep.value) return 'bg-[#fa5b0f] text-white'
        if (index === currentStep.value) return 'bg-[#fa5b0f] text-white'
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
      }
    }
  }
}
</script>

