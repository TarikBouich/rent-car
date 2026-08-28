<template>
  <div>
    <div class="p-4">
      <div
        class="rounded-xl shadow-card overflow-hidden"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white'"
      >
        <div
          class="px-4 py-2.5 border-b flex items-center justify-between"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <span class="text-lg font-bold leading-none">Clients</span>
          <div class="flex items-center gap-2">
            <div v-if="userStore.isAdmin" class="w-[280px]">
              <select
                v-model="selectedAgencyFilter"
                class="form-field"
              >
                <option value="">Toutes les agences</option>
                <option
                  v-for="agency in agencies"
                  :key="agency.id"
                  :value="agency.id"
                >
                  {{ agency.name }}
                </option>
              </select>
            </div>
            <div class="w-[500px]">
              <div class="relative flex items-center">
                <input
                  type="search"
                  class="form-field pl-10"
                  placeholder="Search for a client by name or ID"
                  v-model="searchQuery"
                />
                <div
                  class="absolute left-0 top-0 bottom-0 flex items-center justify-center w-11 text-gray-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    class="w-5 h-5"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.323 13.383a5.5 5.5 0 1 1 1.06-1.06l2.897 2.897a.75.75 0 1 1-1.06 1.06l-2.897-2.897Zm.677-4.383a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <RouterLink
              :to="{ name: 'clients-add' }"
              class="button primary-button small-button whitespace-nowrap"
            >
              Add Client
            </RouterLink>
          </div>
        </div>
        <div class="p-4 space-y-4">
          <div
            v-for="group in clientGroupsForDisplay"
            :key="group.id"
            class="rounded-xl border shadow-sm overflow-hidden"
            :class="mode === 'dark' ? 'border-dark-50 bg-dark-70' : 'border-gray-100 bg-white'"
          >
            <div
              v-if="userStore.isAdmin"
              class="px-4 py-2.5 border-b text-sm font-bold"
              :class="mode === 'dark' ? 'border-dark-50 bg-dark-1' : 'border-gray-100 bg-gray-50'"
            >
              Agence: {{ group.name }} ({{ group.clients.length }})
            </div>
            <div class="w-full overflow-x-auto without-scrollbar">
              <table class="w-full form-table">
            <thead
              class="border-b-2"
              :class="mode === 'dark' ? 'border-dark-50' : ''"
            >
              <tr :class="mode === 'dark' ? 'bg-dark-1' : 'bg-gray-1'">
                <th class="p-4 text-left">Name</th>
                <th class="p-4 text-left">National ID</th>
                <th class="p-4 text-left">Phone Number</th>
                <th class="p-4 text-left">Agency</th>
                <th class="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody
              class="divide-y bg-opacity-40"
              :class="
                mode === 'dark'
                  ? 'bg-dark-70 divide-dark-50'
                  : 'bg-white divide-gray-100'
              "
            >
              <tr v-for="(client, index) in group.clients" :key="client.id || index" 
                class="hover:bg-gray-50 dark:hover:bg-dark-60 transition-colors"
                :class="{'bg-red-50': needsToReturnCarToday(client.nationalId)}"
              >
                <td class="p-4">
                  <div class="flex flex-col">
                    <button 
                      @click="showClientDetails(client, index)"
                      class="text-lg font-bold text-primary-100 hover:text-primary-200 transition-colors text-left"
                    >
                      {{ client.firstName }} {{ client.lastName }}
                    </button>
                  </div>
                </td>
                <td class="p-4">
                  <span class="text-black dark:text-white">{{ client.nationalId }}</span>
                </td>
                <td class="p-4">
                  <span class="text-black dark:text-white">{{ client.phoneNumber }}</span>
                </td>
                <td class="p-4">
                  <span class="text-black dark:text-white">{{ getAgencyName(client.agencyId) }}</span>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <button
                      @click="showClientDetails(client, index)"
                      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
                      title="View Details"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      v-if="hasActiveReservation(client.nationalId)"
                      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors group relative"
                      title="Rented Car Information"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 1 1-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {{ getRentedCarInfo(client.nationalId) }}
                      </div>
                    </button>
                    <button
                      @click="editClient(client, index)"
                      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="deleteClient(index)"
                      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Client Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      :class="mode === 'dark' ? 'bg-white' : 'text-body-100'"
    >
      <div
        class="max-w-2xl rounded-xl w-full mx-auto flex flex-col"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white'"
        style="max-height: 90vh;"
      >
        <div
          class="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <h5 class="font-semibold leading-none">Client Details</h5>
          <svg
            @click="showDetailsModal = false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="cursor-pointer w-6 h-6 -mr-1"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M368 368L144 144M368 144L144 368"
            ></path>
          </svg>
        </div>
        <div
          class="overflow-y-auto p-4"
          :class="mode === 'dark' ? 'bg-dark-70' : 'bg-gray-20 bg-opacity-30'"
        >
                    <div class="space-y-6">
            <!-- Identité -->
            <div>
              <h6 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 border-b pb-1">Identité</h6>
              <div class="grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <label class="block text-xs text-gray-400">Nom Complet</label>
                  <p class="font-medium">{{ selectedClient.civility || '' }} {{ selectedClient.firstName }} {{ selectedClient.lastName }}</p>
                </div>
                <div>
                  <label class="block text-xs text-gray-400">Nom Complet (Arabe)</label>
                  <p class="font-medium text-right" dir="rtl">{{ selectedClient.firstNameAR }} {{ selectedClient.lastNameAR }}</p>
                </div>
                <div>
                  <label class="block text-xs text-gray-400">Nationalité</label>
                  <p class="font-medium">{{ selectedClient.nationality || '-' }}</p>
                </div>
                <div>
                  <label class="block text-xs text-gray-400">Date et lieu de naissance</label>
                  <p class="font-medium">{{ formatDisplayDate(selectedClient.birthDate) }} à {{ selectedClient.birthPlace || selectedClient.birthPlaceAR }}</p>
                </div>
                <div>
                  <label class="block text-xs text-gray-400">Type de Client</label>
                  <p class="font-medium">{{ selectedClient.clientType || 'Particulier' }}</p>
                </div>
              </div>
            </div>

            <!-- Professionnel -->
            <div v-if="selectedClient.clientType === 'Professionnel'">
              <h6 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 border-b pb-1">Informations Professionnelles</h6>
              <div class="grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <label class="block text-xs text-gray-400">Société</label>
                  <p class="font-medium">{{ selectedClient.companyName || '-' }}</p>
                </div>
                <div>
                  <label class="block text-xs text-gray-400">Contact</label>
                  <p class="font-medium">{{ selectedClient.companyContact || '-' }}</p>
                </div>
                <div>
                  <label class="block text-xs text-gray-400">ICE</label>
                  <p class="font-medium">{{ selectedClient.ice || '-' }}</p>
                </div>
                <div>
                  <label class="block text-xs text-gray-400">IF</label>
                  <p class="font-medium">{{ selectedClient.if || '-' }}</p>
                </div>
                <div class="col-span-2">
                  <label class="block text-xs text-gray-400">Adresse</label>
                  <p class="font-medium">{{ selectedClient.companyAddress || '-' }} ({{ selectedClient.companyCity || '-' }})</p>
                </div>
              </div>
            </div>

            <!-- Documents -->
            <div>
              <h6 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 border-b pb-1">Pièces d'Identité</h6>
              <div class="grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <label class="block text-xs text-gray-400">N° CNIE / ID</label>
                  <p class="font-medium">{{ selectedClient.nationalId || '-' }}</p>
                </div>
                <div>
                  <label class="block text-xs text-gray-400">Date de Validité</label>
                  <p class="font-medium" :class="(selectedClient.cnieExpiryDate && new Date() > new Date(selectedClient.cnieExpiryDate)) ? 'text-red-500' : '' ">
                    {{ formatDisplayDate(selectedClient.cnieExpiryDate) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Coordonnées -->
            <div>
              <h6 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 border-b pb-1">Contact & Adresse</h6>
              <div class="grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <label class="block text-xs text-gray-400">Téléphone Principal</label>
                  <p class="font-medium">{{ selectedClient.phoneNumber || '-' }}</p>
                </div>
                <div>
                  <label class="block text-xs text-gray-400">Téléphone Secondaire</label>
                  <p class="font-medium">{{ selectedClient.phoneNumber2 || '-' }}</p>
                </div>
                <div class="col-span-2">
                  <label class="block text-xs text-gray-400">Adresse Résidence</label>
                  <p class="font-medium">{{ selectedClient.address || '-' }} {{ selectedClient.residenceCity ? '('+selectedClient.residenceCity+')' : '' }}</p>
                </div>
                <div class="col-span-2" v-if="selectedClient.foreignAddress">
                  <label class="block text-xs text-gray-400">Adresse Étranger</label>
                  <p class="font-medium">{{ selectedClient.foreignAddress }}</p>
                </div>
              </div>
            </div>

            <!-- Fichiers Attachés -->
            <div>
              <h6 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 border-b pb-1">Fichiers (Aperçus)</h6>
              <div class="grid grid-cols-2 gap-4">
               
              <div v-if="selectedClient.idCardFront">
                <label class="block text-xs text-gray-400 mb-1">CNIE Recto</label>
                <img :src="selectedClient.idCardFront" class="w-full h-32 object-contain rounded-lg cursor-pointer border" @click="showImage(selectedClient.idCardFront)" />
              </div>
              <div v-if="selectedClient.idCardBack">
                <label class="block text-xs text-gray-400 mb-1">CNIE Verso</label>
                <img :src="selectedClient.idCardBack" class="w-full h-32 object-contain rounded-lg cursor-pointer border" @click="showImage(selectedClient.idCardBack)" />
              </div>

              <div v-if="selectedClient.driverLicenseFront">
                <label class="block text-xs text-gray-400 mb-1">Permis Recto</label>
                <img :src="selectedClient.driverLicenseFront" class="w-full h-32 object-contain rounded-lg cursor-pointer border" @click="showImage(selectedClient.driverLicenseFront)" />
              </div>
              <div v-if="selectedClient.driverLicenseBack">
                <label class="block text-xs text-gray-400 mb-1">Permis Verso</label>
                <img :src="selectedClient.driverLicenseBack" class="w-full h-32 object-contain rounded-lg cursor-pointer border" @click="showImage(selectedClient.driverLicenseBack)" />
              </div>

              <div v-if="selectedClient.passportFront">
                <label class="block text-xs text-gray-400 mb-1">Passeport Recto</label>
                <img :src="selectedClient.passportFront" class="w-full h-32 object-contain rounded-lg cursor-pointer border" @click="showImage(selectedClient.passportFront)" />
              </div>
              <div v-if="selectedClient.passportBack">
                <label class="block text-xs text-gray-400 mb-1">Passeport Verso</label>
                <img :src="selectedClient.passportBack" class="w-full h-32 object-contain rounded-lg cursor-pointer border" @click="showImage(selectedClient.passportBack)" />
              </div>

              </div>
            </div>

          </div>
        </div>
        <div
          class="flex items-center justify-end p-4 border-t flex-shrink-0"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <button
            type="button"
            class="button close-button small-button"
            @click="showDetailsModal = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Client Modal -->
    <div
      v-if="showEditModal"
      class="bg-opacity-40 fixed inset-0 z-[9999] flex items-center justify-center p-4"
      :class="mode === 'dark' ? 'bg-white' : 'text-body-100'"
    >
      <div
        class="max-w-2xl rounded-xl w-full mx-auto flex flex-col"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white'"
        style="max-height: 90vh;"
      >
        <div
          class="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <h5 class="font-semibold leading-none">Edit Client</h5>
          <svg
            @click="closeEditModal"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="cursor-pointer w-6 h-6 -mr-1"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M368 368L144 144M368 144L144 368"
            ></path>
          </svg>
        </div>
        <div
          class="overflow-y-auto p-4"
          :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white'"
        >
          <div v-if="error" class="text-red-500 mb-4">
            {{ error }}
          </div>
          <div v-if="loading" class="text-gray-500 mb-4">
            Processing images and saving client data...
          </div>
          <form @submit.prevent="saveClient" class="grid gap-4">

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
                <select v-model="currentClient.civility" class="input-field !pl-10 !pr-4">
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
                <select v-model="currentClient.clientType" class="input-field !pl-10 !pr-4">
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
                <input v-model="currentClient.lastName" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الإسم العائلي</label>
              <div class="relative">
                <input v-model="currentClient.lastNameAR" type="text" dir="rtl" class="input-field placeholder-left !pl-10 text-right" />
                <button type="button" @click="activeKeyboard = 'lastNameAR'" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#fa5b0f] transition-colors p-1 z-10 bg-white dark:bg-transparent">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" ry="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M7 16h10"/></svg>
                </button>
              </div>
              <ArabicKeyboard :is-open="activeKeyboard === 'lastNameAR'" v-model="currentClient.lastNameAR" @close="activeKeyboard = null" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="currentClient.firstName" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الإسم الشخصي</label>
              <div class="relative">
                <input v-model="currentClient.firstNameAR" type="text" dir="rtl" class="input-field placeholder-left !pl-10 text-right" />
                <button type="button" @click="activeKeyboard = 'firstNameAR'" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#fa5b0f] transition-colors p-1 z-10 bg-white dark:bg-transparent">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" ry="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M7 16h10"/></svg>
                </button>
              </div>
              <ArabicKeyboard :is-open="activeKeyboard === 'firstNameAR'" v-model="currentClient.firstNameAR" @close="activeKeyboard = null" />
            </div>
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مكان الإزدياد</label>
              <div class="relative">
                <input v-model="currentClient.birthPlaceAR" type="text" dir="rtl" class="input-field placeholder-left !pl-10 text-right" />
                <button type="button" @click="activeKeyboard = 'birthPlaceAR'" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#fa5b0f] transition-colors p-1 z-10 bg-white dark:bg-transparent">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" ry="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M7 16h10"/></svg>
                </button>
              </div>
              <ArabicKeyboard :is-open="activeKeyboard === 'birthPlaceAR'" v-model="currentClient.birthPlaceAR" @close="activeKeyboard = null" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville de naissance</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="currentClient.birthPlace" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de naissance</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <input v-model="currentClient.birthDate" type="date" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nationalité</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="currentClient.nationality" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville de résidence</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="currentClient.residenceCity" type="text" class="input-field !pl-10 !pr-4" />
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
        <section v-if="currentClient.clientType === 'Professionnel'">
          <h3 class="text-md font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Informations professionnelles</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Raison social / Société</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="currentClient.companyName" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville société</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="currentClient.companyCity" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact société</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="currentClient.companyContact" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ICE</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="currentClient.ice" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IF</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input v-model="currentClient.if" type="text" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse société</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <textarea v-model="currentClient.companyAddress" rows="2" class="input-field !pl-10 !pr-4"></textarea>
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
                <input v-model="currentClient.nationalId" type="text" required class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Délivrée le</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <input v-model="currentClient.cnieIssueDate" type="date" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Validité</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <input v-model="currentClient.cnieExpiryDate" type="date" class="input-field !pl-10 !pr-4" />
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
                <input v-model="currentClient.phoneNumber" type="tel" required class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone 2</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <input v-model="currentClient.phoneNumber2" type="tel" class="input-field !pl-10 !pr-4" />
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <textarea v-model="currentClient.address" rows="2" class="input-field !pl-10 !pr-4"></textarea>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse à l'étranger</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <textarea v-model="currentClient.foreignAddress" rows="2" class="input-field !pl-10 !pr-4"></textarea>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <textarea v-model="currentClient.notes" rows="3" class="input-field !pl-10 !pr-4"></textarea>
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
              <div v-if="currentClient.driverLicenseFront" class="mt-2 text-center">
                <img :src="currentClient.driverLicenseFront" class="h-32 object-contain mx-auto rounded-lg shadow" />
              </div>
            </div>

            <div class="file-upload-block">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Permis Verso</label>
              <input type="file" @change="handleFileUpload($event, 'driverLicenseBack')" accept="image/*" class="file-input" />
              <div v-if="currentClient.driverLicenseBack" class="mt-2 text-center">
                <img :src="currentClient.driverLicenseBack" class="h-32 object-contain mx-auto rounded-lg shadow" />
              </div>
            </div>

            <div class="file-upload-block">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">CNIE Recto</label>
              <input type="file" @change="handleFileUpload($event, 'idCardFront')" accept="image/*" class="file-input" />
              <div v-if="currentClient.idCardFront" class="mt-2 text-center">
                <img :src="currentClient.idCardFront" class="h-32 object-contain mx-auto rounded-lg shadow" />
              </div>
            </div>

            <div class="file-upload-block">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">CNIE Verso</label>
              <input type="file" @change="handleFileUpload($event, 'idCardBack')" accept="image/*" class="file-input" />
              <div v-if="currentClient.idCardBack" class="mt-2 text-center">
                <img :src="currentClient.idCardBack" class="h-32 object-contain mx-auto rounded-lg shadow" />
              </div>
            </div>

            <div class="file-upload-block">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Passeport Recto</label>
              <input type="file" @change="handleFileUpload($event, 'passportFront')" accept="image/*" class="file-input" />
              <div v-if="currentClient.passportFront" class="mt-2 text-center">
                <img :src="currentClient.passportFront" class="h-32 object-contain mx-auto rounded-lg shadow" />
              </div>
            </div>

            <div class="file-upload-block">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Passeport Verso</label>
              <input type="file" @change="handleFileUpload($event, 'passportBack')" accept="image/*" class="file-input" />
              <div v-if="currentClient.passportBack" class="mt-2 text-center">
                <img :src="currentClient.passportBack" class="h-32 object-contain mx-auto rounded-lg shadow" />
              </div>
            </div>

          </div>
        </section>

        

<!-- Agency Location -->
            <div v-if="userStore.isAdmin">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Agency</label>
              <select
                v-model="currentClient.agencyId"
                class="form-field"
              >
                <option value="">Select Agency</option>
                <option v-for="agency in agencies" :key="agency.id" :value="agency.id">
                  {{ agency.name }} ({{ agency.location }})
                </option>
              </select>
            </div>
            <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="button close-button small-button"
                @click="closeEditModal"
          >
                Cancel
          </button>
          <button
            type="submit"
            class="button primary-button small-button"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div
      v-if="showImageModal"
      class="bg-opacity-40 fixed inset-0 z-[9999] flex items-center justify-center p-4"
      :class="mode === 'dark' ? 'bg-white' : 'text-body-100'"
    >
      <div
        class="max-w-4xl rounded-xl w-full mx-auto flex flex-col"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white'"
        style="max-height: 90vh;"
      >
        <div
          class="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <h5 class="font-semibold leading-none">Image Preview</h5>
          <svg
            @click="showImageModal = false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="cursor-pointer w-6 h-6 -mr-1"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M368 368L144 144M368 144L144 368"
            ></path>
          </svg>
        </div>
        <div class="p-4 overflow-y-auto">
          <img :src="currentImage" class="w-full h-auto rounded-lg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import ArabicKeyboard from "../components/ArabicKeyboard.vue";
import TopBar from "../components/TopBar.vue";
import { useClientStore } from '../stores/clientStore'
import { useCarStore } from '../stores/carStore'
import { useUserStore } from '../stores/userStore'
import { useAgencyStore } from '../stores/agencyStore'
import { sortByIdDesc } from '../utils/idGenerator'
import { computed, onMounted } from 'vue'

export default {
  components: {
    TopBar,
    ArabicKeyboard,
  },
  props: {
    mode: String,
  },
  setup() {
    const clientStore = useClientStore()
    const carStore = useCarStore()
    const userStore = useUserStore()
    const agencyStore = useAgencyStore()
    const agencies = computed(() => agencyStore.agencies || [])
    
    onMounted(async () => {
      await agencyStore.initializeFromStorage()
    });

    return { clientStore, carStore, userStore, agencyStore, agencies }
  },
  data() {
    return {
      searchQuery: '',
      selectedAgencyFilter: '',
      showDetailsModal: false,
      showEditModal: false,
      showImageModal: false,
      currentImage: '',
      selectedClient: {},
      currentClient: {
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
        passportBack: ''
      },
      currentClientIndex: -1,
      error: null,
      activeKeyboard: null,
      loading: false,
    }
  },
  computed: {
    filteredClients() {
      let sortedClients = sortByIdDesc(this.clientStore.filteredClients)

      if (this.selectedAgencyFilter) {
        sortedClients = sortedClients.filter(client => client.agencyId === this.selectedAgencyFilter)
      }

      if (!this.searchQuery) return sortedClients
      
      const query = this.searchQuery.toLowerCase()
      return sortedClients.filter(client => 
        client.firstName?.toLowerCase().includes(query) ||
        client.lastName?.toLowerCase().includes(query) ||
        client.nationalId?.toLowerCase().includes(query) ||
        client.phoneNumber?.toLowerCase().includes(query)
      )
    },
    clientGroupsForDisplay() {
      const clients = this.filteredClients || []

      if (!this.userStore.isAdmin) {
        return [{ id: 'all-clients', name: 'Tous les clients', clients }]
      }

      const groups = new Map()
      clients.forEach(client => {
        const agencyId = client.agencyId || 'unassigned'
        const agencyName = this.getAgencyName(client.agencyId) || 'Non Assignée'
        if (!groups.has(agencyId)) {
          groups.set(agencyId, {
            id: agencyId,
            name: agencyName,
            clients: []
          })
        }
        groups.get(agencyId).clients.push(client)
      })

      return Array.from(groups.values()).sort((a, b) =>
        a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
      )
    }
  },
  async mounted() {
    // Initialize stores
    await this.clientStore.initializeFromStorage()
    await this.carStore.initializeFromStorage()
  },
  methods: {
    getEmptyClient() {
      return {
        id: '',
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
        agencyId: '',
      }
    },
    normalizeDateForInput(dateString) {
      if (!dateString) return ''
      const raw = String(dateString)
      if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
      const d = new Date(raw)
      if (Number.isNaN(d.getTime())) return ''
      return d.toISOString().split('T')[0]
    },
    normalizeClientForForm(client) {
      const normalized = { ...this.getEmptyClient(), ...(client || {}) }
      Object.keys(normalized).forEach(key => {
        if (normalized[key] === null || normalized[key] === undefined) {
          normalized[key] = ''
        }
      })
      normalized.birthDate = this.normalizeDateForInput(normalized.birthDate)
      normalized.cnieIssueDate = this.normalizeDateForInput(normalized.cnieIssueDate)
      normalized.cnieExpiryDate = this.normalizeDateForInput(normalized.cnieExpiryDate)
      return normalized
    },
    getAgencyName(agencyId) {
      const agency = this.agencies.find(a => a.id === agencyId);
      return agency ? agency.name : 'Unknown Agency';
    },
    needsToReturnCarToday(clientId) {
      const today = new Date().toDateString()
      return this.carStore.filteredReservations.some(reservation => 
        reservation.clientId === clientId && 
        reservation.status === 'Active' &&
        new Date(reservation.endDate).toDateString() === today
      )
    },
    showImage(image) {
      this.currentImage = image
      this.showImageModal = true
    },
    showClientDetails(client, index) {
      try {
        this.selectedClient = { ...client }
        this.currentClientIndex = index
        this.showDetailsModal = true
      } catch (error) {
        console.error('Error loading client details:', error)
        this.error = 'Error loading client details. Please try again.'
      }
    },
    async editClient(client, index) {
      this.loading = true
      this.error = null
      try {
        const fullClient = await this.clientStore.fetchClientById(client.id)
        this.currentClient = this.normalizeClientForForm(fullClient || client)
      } catch (error) {
        console.error('Error loading full client for edit:', error)
        this.currentClient = this.normalizeClientForForm(client)
      } finally {
        this.currentClientIndex = index
        if (!this.currentClient.agencyId && this.userStore.userAgencyId) {
          this.currentClient.agencyId = this.userStore.userAgencyId
        }
        this.showEditModal = true
        this.loading = false
      }
    },
    closeEditModal() {
      this.showEditModal = false
      this.currentClient = this.getEmptyClient()
      this.error = null
    },
    handleFileUpload(event, field) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.currentClient[field] = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async saveClient() {
      this.loading = true
      this.error = null
      try {
        // Format dates before saving
        const clientToSave = {
          ...this.currentClient,
          birthDate: this.formatDateForStorage(this.currentClient.birthDate),
          cnieIssueDate: this.formatDateForStorage(this.currentClient.cnieIssueDate),
          cnieExpiryDate: this.formatDateForStorage(this.currentClient.cnieExpiryDate),
        }
        
        // Update the client in the store using its ID
        await this.clientStore.updateClient(this.currentClient.id, clientToSave)
        this.closeEditModal()
      } catch (error) {
        this.error = 'Error saving client. Please try again.'
        console.error('Error saving client:', error)
      } finally {
        this.loading = false
      }
    },
    formatDateForStorage(dateString) {
      if (!dateString) return null
      const trimmed = String(dateString).trim()
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(trimmed)) return null
      const date = new Date(`${trimmed}T00:00:00`)
      if (Number.isNaN(date.getTime())) return null
      const normalized = date.toISOString().split('T')[0]
      return normalized === trimmed ? trimmed : null
    },
    async deleteClient(index) {
      if (confirm('Are you sure you want to delete this client?')) {
        try {
          await this.clientStore.deleteClient(this.currentClient.id)
        } catch (error) {
          console.error('Error deleting client:', error)
          this.error = 'Error deleting client. Please try again.'
        }
      }
    },
    hasActiveReservation(clientId) {
       // Use the carStore to check for active reservations
      return this.carStore.filteredReservations.some(reservation => 
        reservation.clientId === clientId && 
        reservation.status === 'Active'
      )
    },
    getRentedCarInfo(clientId) {
      const reservation = this.carStore.filteredReservations.find(r => 
        r.clientId === clientId && 
        r.status === 'Active'
      )
      if (reservation) {
        // Assuming formatDate is a utility or a method in this component
        return `${reservation.carName} (${reservation.carId}) - Return: ${this.formatDate(reservation.endDate)}`
      }
      return ''
    },
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      return `${day}/${month}/${year}`
    },
    formatDisplayDate(dateString) {
      if (!dateString) return 'Not provided';
      
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date:', dateString);
          return 'Invalid date';
        }
        return this.formatDate(dateString);
      } catch (error) {
        console.error('Error formatting date for display:', error);
        return 'Invalid date';
      }
    },
  }
};
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors;
}

.file-input {
  @apply block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F3F4F6] dark:file:bg-[#1C1C1C] file:text-gray-800 dark:file:text-white hover:file:bg-gray-200 dark:file:bg-gray-800 file:border file:border-gray-200 dark:file:border-gray-700 transition-colors cursor-pointer;
}

.file-upload-block {
  @apply bg-gray-50 dark:bg-[#1C1F2B] p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700;
}
</style>
