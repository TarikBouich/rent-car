<template>
  <div class="p-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    <div class="max-w-4xl mx-auto bg-white dark:bg-[#1E2330] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
      <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Nouveau Client</h2>
      </div>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-8">
        
        <!-- Identité -->
        <section>
          <h3 class="text-md font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Identité</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Civilité</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </div>
                <select v-model="clientData.civility" required class="input-field !pl-10 !pr-4">
                <option value="Monsieur">Monsieur</option>
                <option value="Madame">Madame</option>
                <option value="Mlle">Mlle</option>
              </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </div>
                <select v-model="clientData.clientType" required class="input-field !pl-10 !pr-4">
                <option value="Particulier">Particulier</option>
                <option value="Professionnel">Professionnel</option>
              </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="clientData.lastName" type="text" required class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الإسم العائلي</label>
              <div class="relative">
                <input v-model="clientData.lastNameAR" type="text" dir="rtl" class="input-field placeholder-left !pl-10 text-right" />
                <button type="button" @click="activeKeyboard = 'lastNameAR'" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#fa5b0f] transition-colors p-1 z-10 bg-white dark:bg-transparent">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" ry="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M7 16h10"/></svg>
                </button>
              </div>
              <ArabicKeyboard :is-open="activeKeyboard === 'lastNameAR'" v-model="clientData.lastNameAR" @close="activeKeyboard = null" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="clientData.firstName" type="text" required class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الإسم الشخصي</label>
              <div class="relative">
                <input v-model="clientData.firstNameAR" type="text" dir="rtl" class="input-field placeholder-left !pl-10 text-right" />
                <button type="button" @click="activeKeyboard = 'firstNameAR'" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#fa5b0f] transition-colors p-1 z-10 bg-white dark:bg-transparent">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" ry="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M7 16h10"/></svg>
                </button>
              </div>
              <ArabicKeyboard :is-open="activeKeyboard === 'firstNameAR'" v-model="clientData.firstNameAR" @close="activeKeyboard = null" />
            </div>
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مكان الإزدياد</label>
              <div class="relative">
                <input v-model="clientData.birthPlaceAR" type="text" dir="rtl" class="input-field placeholder-left !pl-10 text-right" />
                <button type="button" @click="activeKeyboard = 'birthPlaceAR'" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#fa5b0f] transition-colors p-1 z-10 bg-white dark:bg-transparent">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" ry="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M7 16h10"/></svg>
                </button>
              </div>
              <ArabicKeyboard :is-open="activeKeyboard === 'birthPlaceAR'" v-model="clientData.birthPlaceAR" @close="activeKeyboard = null" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville de naissance</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="clientData.birthPlace" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de naissance</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <input v-model="clientData.birthDate" type="date" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nationalité</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="clientData.nationality" type="text" required class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville de résidence</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="clientData.residenceCity" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
          </div>
        <!-- OCR Scanner (Hidden / Commented out per user request) -->
        <!--
        <section class="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
          ...
        </section>
        -->

        </section>

        <!-- Informations professionnelles -->
        <section v-if="clientData.clientType === 'Professionnel'">
          <h3 class="text-md font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Informations professionnelles</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Raison social / Société</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="clientData.companyName" type="text" required class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville société</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="clientData.companyCity" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact société</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="clientData.companyContact" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ICE</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="clientData.ice" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IF</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="clientData.if" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse société</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <textarea v-model="clientData.companyAddress" rows="2" class="input-field !pl-10 !pr-4"></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- Documents -->
        <section>
          <h3 class="text-md font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Documents</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">N° CNIE</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="clientData.nationalId" type="text" required class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Délivrée le</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <input v-model="clientData.cnieIssueDate" type="date" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Validité</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <input v-model="clientData.cnieExpiryDate" type="date" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
          </div>
        </section>

        <!-- Coordonnées -->
        <section>
          <h3 class="text-md font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Coordonnées</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone 1</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <input v-model="clientData.phoneNumber" type="tel" required class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone 2</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <input v-model="clientData.phoneNumber2" type="tel" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <textarea v-model="clientData.address" rows="2" class="input-field !pl-10 !pr-4"></textarea>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse à l'étranger</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <textarea v-model="clientData.foreignAddress" rows="2" class="input-field !pl-10 !pr-4"></textarea>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <textarea v-model="clientData.notes" rows="3" class="input-field !pl-10 !pr-4"></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- Documents Scannées -->
        <section>
          <h3 class="text-md font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Documents Scannées</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div class="file-upload-block">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Permis Recto</label>
              <input type="file" @change="handleFileUpload($event, 'driverLicenseFront')" accept="image/*" class="file-input" />
              <div v-if="clientData.driverLicenseFront" class="mt-2 text-center">
                <img :src="clientData.driverLicenseFront" class="h-32 object-contain mx-auto rounded-lg shadow" />
              </div>
            </div>

            <div class="file-upload-block">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Permis Verso</label>
              <input type="file" @change="handleFileUpload($event, 'driverLicenseBack')" accept="image/*" class="file-input" />
              <div v-if="clientData.driverLicenseBack" class="mt-2 text-center">
                <img :src="clientData.driverLicenseBack" class="h-32 object-contain mx-auto rounded-lg shadow" />
              </div>
            </div>

            <div class="file-upload-block">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">CNIE Recto</label>
              <input type="file" @change="handleFileUpload($event, 'idCardFront')" accept="image/*" class="file-input" />
              <div v-if="clientData.idCardFront" class="mt-2 text-center">
                <img :src="clientData.idCardFront" class="h-32 object-contain mx-auto rounded-lg shadow" />
              </div>
            </div>

            <div class="file-upload-block">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">CNIE Verso</label>
              <input type="file" @change="handleFileUpload($event, 'idCardBack')" accept="image/*" class="file-input" />
              <div v-if="clientData.idCardBack" class="mt-2 text-center">
                <img :src="clientData.idCardBack" class="h-32 object-contain mx-auto rounded-lg shadow" />
              </div>
            </div>

            <div class="file-upload-block">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Passeport Recto</label>
              <input type="file" @change="handleFileUpload($event, 'passportFront')" accept="image/*" class="file-input" />
              <div v-if="clientData.passportFront" class="mt-2 text-center">
                <img :src="clientData.passportFront" class="h-32 object-contain mx-auto rounded-lg shadow" />
              </div>
            </div>

            <div class="file-upload-block">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Passeport Verso</label>
              <input type="file" @change="handleFileUpload($event, 'passportBack')" accept="image/*" class="file-input" />
              <div v-if="clientData.passportBack" class="mt-2 text-center">
                <img :src="clientData.passportBack" class="h-32 object-contain mx-auto rounded-lg shadow" />
              </div>
            </div>

          </div>
        </section>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            @click="$router.back()"
            class="px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-6 py-2.5 text-sm font-bold text-white bg-[#fa5b0f] text-white border border-transparent rounded-lg shadow-sm hover:bg-orange-500 focus:outline-none transition-colors"
          >
            Valider
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import Tesseract from 'tesseract.js'
import ArabicKeyboard from '../components/ArabicKeyboard.vue'
import { useRouter } from 'vue-router'
import { useClientStore } from '../stores/clientStore'
import { useUserStore } from '../stores/userStore'
import { generateNextId } from '../utils/idGenerator'

export default {
  name: 'AddClientView',
  components: { ArabicKeyboard },
  setup() {
    const router = useRouter()
    const clientStore = useClientStore()
    const userStore = useUserStore()

    const clientData = ref({
      civility: 'Monsieur',
      clientType: 'Particulier',
      firstName: '',
      lastName: '',
      lastNameAR: '',
      firstNameAR: '',
      birthDate: '',
      birthPlace: '',
      birthPlaceAR: '',
      nationality: '',
      residenceCity: '',

      companyName: '',
      companyCity: '',
      companyContact: '',
      ice: '',
      if: '',
      companyAddress: '',

      nationalId: '',
      cnieIssueDate: '',
      cnieExpiryDate: '',

      phoneNumber: '',
      phoneNumber2: '',
      address: '',
      foreignAddress: '',
      notes: '',

      driverLicenseFront: '',
      driverLicenseBack: '',
      idCardFront: '',
      idCardBack: '',
      passportFront: '',
      passportBack: '',

      agencyId: userStore.isAdmin ? '' : userStore.currentAgencyId
    })

    const handleFileUpload = (event, field) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          clientData.value[field] = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const formatDateForStorage = (dateString) => {
      if (!dateString) return ''
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return dateString
        return date.toISOString().split('T')[0]
      } catch (error) {
        return dateString
      }
    }

    const isOcrLoading = ref(false)
    const ocrResult = ref('')

    const activeKeyboard = ref(null)

    const handleOCR = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      isOcrLoading.value = true
      ocrResult.value = ""
      try {
        const result = await Tesseract.recognize(
          file,
          'ara+fra', 
          { logger: m => {
              if (m.status === 'recognizing text') {
                console.log(m.progress)
              }
            } 
          }
        )
        ocrResult.value = result.data.text
      } catch (error) {
        console.error("OCR Failed:", error)
        ocrResult.value = "Erreur lors de l'extraction du texte. Assurez-vous d'avoir une connexion internet."
      } finally {
        isOcrLoading.value = false
      }
    }

    const handleSubmit = () => {
      const clientToSave = {
        id: generateNextId(clientStore.clients),
        ...clientData.value,
        birthDate: formatDateForStorage(clientData.value.birthDate),
        cnieIssueDate: formatDateForStorage(clientData.value.cnieIssueDate),
        cnieExpiryDate: formatDateForStorage(clientData.value.cnieExpiryDate),
        createdAt: new Date().toISOString()
      }
      clientStore.addClient(clientToSave)
      router.push({ name: 'clients' })
    }

    return {
      clientData,
      userStore,
      isOcrLoading,
      ocrResult,
      activeKeyboard,
      handleOCR,
      handleSubmit,
      handleFileUpload
    }
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors;
}

.file-input {
  @apply block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F3F4F6] dark:file:bg-[#1C1C1C] file:text-gray-800 dark:file:text-white hover:file:bg-gray-200 dark:hover:file:bg-gray-800 file:border file:border-gray-200 dark:file:border-gray-700 transition-colors cursor-pointer;
}

.file-upload-block {
  @apply bg-gray-50 dark:bg-[#1C1F2B] p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700;
}
</style>