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
              <tr v-for="(client, index) in filteredClients" :key="index" 
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
                  <div class="flex items-center gap-3">
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
                      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
          <div class="grid gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-500">First Name</label>
                <p class="text-lg font-semibold" :class="{'text-gray-400': !selectedClient.firstName}">
                  {{ selectedClient.firstName || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm text-gray-500">Last Name</label>
                <p class="text-lg font-semibold" :class="{'text-gray-400': !selectedClient.lastName}">
                  {{ selectedClient.lastName || 'Not provided' }}
                </p>
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-500">National ID</label>
              <p class="text-lg font-semibold" :class="{'text-gray-400': !selectedClient.nationalId}">
                {{ selectedClient.nationalId || 'Not provided' }}
              </p>
            </div>
            <div>
              <label class="block text-sm text-gray-500">Phone Number</label>
              <p class="text-lg font-semibold" :class="{'text-gray-400': !selectedClient.phoneNumber}">
                {{ selectedClient.phoneNumber || 'Not provided' }}
              </p>
            </div>
            <div>
              <label class="block text-sm text-gray-500">Nationality</label>
              <p class="text-lg font-semibold" :class="{'text-gray-400': !selectedClient.nationality}">
                {{ selectedClient.nationality || 'Not provided' }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-500">Birth Date</label>
                <p class="text-lg font-semibold" :class="{'text-gray-400': !selectedClient.birthDate}">
                  {{ formatDisplayDate(selectedClient.birthDate) }}
                </p>
              </div>
              <div>
                <label class="block text-sm text-gray-500">Profession</label>
                <p class="text-lg font-semibold" :class="{'text-gray-400': !selectedClient.profession}">
                  {{ selectedClient.profession || 'Not provided' }}
                </p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-500">License Number</label>
                <p class="text-lg font-semibold" :class="{'text-gray-400': !selectedClient.licenseNumber}">
                  {{ selectedClient.licenseNumber || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm text-gray-500">License Issue Date</label>
                <p class="text-lg font-semibold" :class="{'text-gray-400': !selectedClient.licenseDate}">
                  {{ formatDisplayDate(selectedClient.licenseDate) }}
                </p>
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-500">Address</label>
              <p class="text-lg font-semibold" :class="{'text-gray-400': !selectedClient.address}">
                {{ selectedClient.address || 'Not provided' }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-500">ID Card Front</label>
                <div v-if="selectedClient.idCardFront" class="mt-2">
                  <img 
                    :src="selectedClient.idCardFront" 
                    class="w-full h-48 object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    @click="showImage(selectedClient.idCardFront)"
                    alt="ID Card Front"
                  />
                </div>
                <p v-else class="text-gray-400 mt-2">No image provided</p>
              </div>
              <div>
                <label class="block text-sm text-gray-500">ID Card Back</label>
                <div v-if="selectedClient.idCardBack" class="mt-2">
                  <img 
                    :src="selectedClient.idCardBack" 
                    class="w-full h-48 object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    @click="showImage(selectedClient.idCardBack)"
                    alt="ID Card Back"
                  />
                </div>
                <p v-else class="text-gray-400 mt-2">No image provided</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-500">Driver's License Front</label>
                <div v-if="selectedClient.driverLicenseFront" class="mt-2">
                  <img 
                    :src="selectedClient.driverLicenseFront" 
                    class="w-full h-48 object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    @click="showImage(selectedClient.driverLicenseFront)"
                    alt="Driver's License Front"
                  />
                </div>
                <p v-else class="text-gray-400 mt-2">No image provided</p>
              </div>
              <div>
                <label class="block text-sm text-gray-500">Driver's License Back</label>
                <div v-if="selectedClient.driverLicenseBack" class="mt-2">
                  <img 
                    :src="selectedClient.driverLicenseBack" 
                    class="w-full h-48 object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    @click="showImage(selectedClient.driverLicenseBack)"
                    alt="Driver's License Back"
                  />
                </div>
                <p v-else class="text-gray-400 mt-2">No image provided</p>
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
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="editFirstName" class="block text-sm mb-1">First Name</label>
                <input
                  type="text"
                  class="form-field"
                  id="editFirstName"
                  v-model="currentClient.firstName"
                  required
                />
              </div>
              <div>
                <label for="editLastName" class="block text-sm mb-1">Last Name</label>
                <input
                  type="text"
                  class="form-field"
                  id="editLastName"
                  v-model="currentClient.lastName"
                  required
                />
              </div>
            </div>
            <div>
              <label for="editNationalId" class="block text-sm mb-1">National ID</label>
              <input
                type="text"
                class="form-field"
                id="editNationalId"
                v-model="currentClient.nationalId"
                required
              />
            </div>
            <div>
              <label for="editPhoneNumber" class="block text-sm mb-1">Phone Number</label>
              <input
                type="tel"
                class="form-field"
                id="editPhoneNumber"
                v-model="currentClient.phoneNumber"
                required
              />
            </div>
            <div>
              <label for="editNationality" class="block text-sm mb-1">Nationality</label>
              <input
                type="text"
                class="form-field"
                id="editNationality"
                v-model="currentClient.nationality"
                required
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="editBirthDate" class="block text-sm mb-1">Birth Date</label>
                <input
                  type="date"
                  class="form-field"
                  id="editBirthDate"
                  v-model="currentClient.birthDate"
                  required
                />
              </div>
              <div>
                <label for="editProfession" class="block text-sm mb-1">Profession</label>
                <input
                  type="text"
                  class="form-field"
                  id="editProfession"
                  v-model="currentClient.profession"
                  required
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="editLicenseNumber" class="block text-sm mb-1">License Number</label>
                <input
                  type="text"
                  class="form-field"
                  id="editLicenseNumber"
                  v-model="currentClient.licenseNumber"
                  required
                />
              </div>
              <div>
                <label for="editLicenseDate" class="block text-sm mb-1">License Issue Date</label>
                <input
                  type="date"
                  class="form-field"
                  id="editLicenseDate"
                  v-model="currentClient.licenseDate"
                  required
                />
              </div>
            </div>
            <div>
              <label for="editAddress" class="block text-sm mb-1">Address</label>
              <textarea
                class="form-field"
                id="editAddress"
                v-model="currentClient.address"
                rows="2"
                required
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm mb-1">ID Card Front</label>
                <input
                  type="file"
                  class="form-field"
                  @change="handleFileUpload($event, 'idCardFront')"
                  accept="image/*"
                />
                <div v-if="currentClient.idCardFront" class="mt-2">
                  <img :src="currentClient.idCardFront" class="w-32 h-32 object-cover rounded-lg" />
                </div>
              </div>
              <div>
                <label class="block text-sm mb-1">ID Card Back</label>
                <input
                  type="file"
                  class="form-field"
                  @change="handleFileUpload($event, 'idCardBack')"
                  accept="image/*"
                />
                <div v-if="currentClient.idCardBack" class="mt-2">
                  <img :src="currentClient.idCardBack" class="w-32 h-32 object-cover rounded-lg" />
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm mb-1">Driver's License Front</label>
                <input
                  type="file"
                  class="form-field"
                  @change="handleFileUpload($event, 'driverLicenseFront')"
                  accept="image/*"
                />
                <div v-if="currentClient.driverLicenseFront" class="mt-2">
                  <img :src="currentClient.driverLicenseFront" class="w-32 h-32 object-cover rounded-lg" />
                </div>
              </div>
              <div>
                <label class="block text-sm mb-1">Driver's License Back</label>
                <input
                  type="file"
                  class="form-field"
                  @change="handleFileUpload($event, 'driverLicenseBack')"
                  accept="image/*"
                />
                <div v-if="currentClient.driverLicenseBack" class="mt-2">
                  <img :src="currentClient.driverLicenseBack" class="w-32 h-32 object-cover rounded-lg" />
                </div>
              </div>
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
import TopBar from "../components/TopBar.vue";
import { clientStore } from "../store";
import { generateNextId, sortByIdDesc } from '../utils/idGenerator';

export default {
  components: {
    TopBar,
  },
  props: {
    mode: String,
  },
  data() {
    return {
      searchQuery: '',
      showDetailsModal: false,
      showEditModal: false,
      showImageModal: false,
      currentImage: '',
      selectedClient: {
        firstName: '',
        lastName: '',
        nationalId: '',
        phoneNumber: '',
        nationality: '',
        birthDate: '',
        profession: '',
        licenseNumber: '',
        licenseDate: '',
        address: '',
        idCardFront: '',
        idCardBack: '',
        driverLicenseFront: '',
        driverLicenseBack: ''
      },
      currentClient: {
        firstName: '',
        lastName: '',
        nationalId: '',
        phoneNumber: '',
        nationality: '',
        birthDate: '',
        profession: '',
        licenseNumber: '',
        licenseDate: '',
        address: '',
        idCardFront: '',
        idCardBack: '',
        driverLicenseFront: '',
        driverLicenseBack: ''
      },
      currentClientIndex: -1,
      error: null,
      loading: false,
      reservations: [],
      newClient: {
        firstName: '',
        lastName: '',
        nationalId: '',
        phoneNumber: '',
        email: '',
        address: '',
        licenseNumber: '',
        licenseDate: '',
        licenseCity: '',
      },
      showAddModal: false,
    };
  },
  computed: {
    clients() {
      return clientStore.clients;
    },
    filteredClients() {
      const sortedClients = sortByIdDesc(this.clients);
      if (!this.searchQuery) return sortedClients;
      
      const query = this.searchQuery.toLowerCase();
      return sortedClients.filter(client => 
        client.firstName.toLowerCase().includes(query) ||
        client.lastName.toLowerCase().includes(query) ||
        client.nationalId.toLowerCase().includes(query) ||
        client.phoneNumber.toLowerCase().includes(query)
      );
    }
  },
  created() {
    // Initialize the store
    this.initializeStore();
    // Load reservations
    this.loadReservations();
  },
  methods: {
    initializeStore() {
      try {
        // Load clients from localStorage
        const savedClients = localStorage.getItem('clients');
        if (savedClients) {
          clientStore.clients = JSON.parse(savedClients);
        }
      } catch (error) {
        console.error('Error initializing store:', error);
        this.error = 'Error loading client data. Please refresh the page.';
      }
    },
    loadReservations() {
      try {
        const savedReservations = localStorage.getItem('reservations');
        if (savedReservations) {
          this.reservations = JSON.parse(savedReservations);
        }
      } catch (error) {
        console.error('Error loading reservations:', error);
      }
    },
    needsToReturnCarToday(clientId) {
      const today = new Date().toDateString();
      return this.reservations.some(reservation => 
        reservation.clientId === clientId && 
        reservation.status === 'Active' &&
        new Date(reservation.endDate).toDateString() === today
      );
    },
    showImage(image) {
      this.currentImage = image;
      this.showImageModal = true;
    },
    showClientDetails(client, index) {
      try {
        this.selectedClient = { ...this.clients[index] };
        this.showDetailsModal = true;
      } catch (error) {
        console.error('Error loading client details:', error);
        this.error = 'Error loading client details. Please try again.';
      }
    },
    editClient(client, index) {
      try {
        this.currentClient = { ...this.clients[index] };
        this.currentClientIndex = index;
        this.showEditModal = true;
      } catch (error) {
        console.error('Error loading client for edit:', error);
        this.error = 'Error loading client for edit. Please try again.';
      }
    },
    closeEditModal() {
      this.showEditModal = false;
      this.currentClient = {
        firstName: '',
        lastName: '',
        nationalId: '',
        phoneNumber: '',
        nationality: '',
        birthDate: '',
        profession: '',
        licenseNumber: '',
        licenseDate: '',
        address: '',
        idCardFront: '',
        idCardBack: '',
        driverLicenseFront: '',
        driverLicenseBack: ''
      };
      this.currentClientIndex = -1;
      this.error = null;
    },
    handleFileUpload(event, field) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.currentClient[field] = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    saveClient() {
      if (this.currentClientIndex > -1) {
        this.loading = true;
        this.error = null;
        try {
          // Format dates before saving
          const clientToSave = {
            ...this.currentClient,
            birthDate: this.formatDateForStorage(this.currentClient.birthDate),
            licenseDate: this.formatDateForStorage(this.currentClient.licenseDate)
          };
          
          // Update the client in the store
          clientStore.clients[this.currentClientIndex] = clientToSave;
          // Save to localStorage
          localStorage.setItem('clients', JSON.stringify(clientStore.clients));
          this.closeEditModal();
        } catch (error) {
          this.error = 'Error saving client. Please try again.';
          console.error('Error saving client:', error);
        } finally {
          this.loading = false;
        }
      }
    },
    formatDateForStorage(dateString) {
      if (!dateString) return '';
      
      try {
        // Convert the date to YYYY-MM-DD format for storage
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date:', dateString);
          return dateString;
        }
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.error('Error formatting date for storage:', error);
        return dateString;
      }
    },
    deleteClient(index) {
      if (confirm('Are you sure you want to delete this client?')) {
        try {
          clientStore.clients.splice(index, 1);
          localStorage.setItem('clients', JSON.stringify(clientStore.clients));
        } catch (error) {
          console.error('Error deleting client:', error);
          this.error = 'Error deleting client. Please try again.';
        }
      }
    },
    hasActiveReservation(clientId) {
      return this.reservations.some(reservation => 
        reservation.clientId === clientId && 
        reservation.status === 'Active'
      );
    },
    getRentedCarInfo(clientId) {
      const reservation = this.reservations.find(r => 
        r.clientId === clientId && 
        r.status === 'Active'
      );
      if (reservation) {
        return `${reservation.carName} (${reservation.carId}) - Return: ${this.formatDate(reservation.endDate)}`;
      }
      return '';
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
    addClient() {
      const nextId = generateNextId(this.clients);
      const newClient = {
        id: nextId,
        firstName: this.newClient.firstName,
        lastName: this.newClient.lastName,
        nationalId: this.newClient.nationalId,
        phoneNumber: this.newClient.phoneNumber,
        email: this.newClient.email,
        address: this.newClient.address,
        licenseNumber: this.newClient.licenseNumber,
        licenseDate: this.newClient.licenseDate,
        licenseCity: this.newClient.licenseCity,
        createdAt: new Date().toISOString()
      };
      
      this.clients.push(newClient);
      localStorage.setItem('clients', JSON.stringify(this.clients));
      this.showAddModal = false;
      this.resetNewClient();
    },
    resetNewClient() {
      this.newClient = {
        firstName: '',
        lastName: '',
        nationalId: '',
        phoneNumber: '',
        email: '',
        address: '',
        licenseNumber: '',
        licenseDate: '',
        licenseCity: '',
      };
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
