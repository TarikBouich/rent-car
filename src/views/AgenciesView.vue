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
          <span class="text-lg font-bold leading-none">Agencies</span>
          <div class="flex items-center gap-2">
            <div class="w-[500px]">
              <div class="relative flex items-center">
                <input
                  type="search"
                  class="form-field pl-10"
                  placeholder="Search for an agency by name or location"
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
            <button
              @click="showAddModal = true"
              class="button primary-button small-button whitespace-nowrap"
            >
              Add Agency
            </button>
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
                <th class="p-4 text-left">Location</th>
                <th class="p-4 text-left">Contact</th>
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
              <tr v-for="(agency, index) in filteredAgencies" :key="agency.id" 
                class="hover:bg-gray-50 dark:hover:bg-dark-60 transition-colors"
              >
                <td class="p-4">
                  <div class="flex flex-col">
                    <button 
                      @click="showAgencyDetails(agency)"
                      class="text-lg font-bold text-primary-100 hover:text-primary-200 transition-colors text-left"
                    >
                      {{ agency.name }}
                    </button>
                  </div>
                </td>
                <td class="p-4">
                  <span class="text-black dark:text-white">{{ agency.location }}</span>
                </td>
                <td class="p-4">
                  <span class="text-black dark:text-white">{{ agency.contact }}</span>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <button
                      @click="editAgency(agency, index)"
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
                      @click="deleteAgency(index)"
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

    <!-- Agency Details Modal -->
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
          <h5 class="font-semibold leading-none">Agency Details</h5>
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
            <div>
              <label class="block text-sm text-gray-500">Name</label>
              <p class="text-lg font-semibold">{{ selectedAgency.name }}</p>
            </div>
            <div>
              <label class="block text-sm text-gray-500">Location</label>
              <p class="text-lg font-semibold">{{ selectedAgency.location }}</p>
            </div>
            <div>
              <label class="block text-sm text-gray-500">Contact</label>
              <p class="text-lg font-semibold">{{ selectedAgency.contact }}</p>
            </div>
            <div>
              <label class="block text-sm text-gray-500">Agents</label>
              <div class="mt-2 space-y-2">
                <div v-for="agent in agencyAgents" :key="agent.id" class="p-3 bg-gray-50 dark:bg-dark-60 rounded-lg">
                  <p class="font-medium">{{ agent.name }}</p>
                  <p class="text-sm text-gray-500">{{ agent.email }}</p>
                </div>
                <p v-if="agencyAgents.length === 0" class="text-gray-500">No agents assigned</p>
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

    <!-- Add/Edit Agency Modal -->
    <div
      v-if="showAddModal || showEditModal"
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
          <h5 class="font-semibold leading-none">{{ showEditModal ? 'Edit Agency' : 'Add Agency' }}</h5>
          <svg
            @click="closeModal"
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
          <form @submit.prevent="saveAgency" class="grid gap-4">
            <div>
              <label for="agencyName" class="block text-sm mb-1">Name</label>
              <input
                type="text"
                class="form-field"
                id="agencyName"
                v-model="currentAgency.name"
                required
              />
            </div>
            <div>
              <label for="agencyLocation" class="block text-sm mb-1">Location</label>
              <input
                type="text"
                class="form-field"
                id="agencyLocation"
                v-model="currentAgency.location"
                required
              />
            </div>
            <div>
              <label for="agencyContact" class="block text-sm mb-1">Contact</label>
              <input
                type="tel"
                class="form-field"
                id="agencyContact"
                v-model="currentAgency.contact"
                required
              />
            </div>
            <div class="flex items-center justify-end gap-2">
              <button
                type="button"
                class="button close-button small-button"
                @click="closeModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="button primary-button small-button"
              >
                {{ showEditModal ? 'Save Changes' : 'Add Agency' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/userStore';
import { generateNextId, sortByIdDesc } from '../utils/idGenerator';

export default {
  name: 'AgenciesView',
  props: {
    mode: String,
  },
  setup() {
    const userStore = useUserStore();
    console.log('AgenciesView setup:', {
      isAuthenticated: userStore.isAuthenticated,
      isAdmin: userStore.isAdmin,
      user: userStore.currentUser
    });
    return { userStore };
  },
  data() {
    console.log('AgenciesView data initialization');
    const agencies = JSON.parse(localStorage.getItem('agencies') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    return {
      searchQuery: '',
      showDetailsModal: false,
      showAddModal: false,
      showEditModal: false,
      selectedAgency: {
        name: '',
        location: '',
        contact: ''
      },
      currentAgency: {
        name: '',
        location: '',
        contact: ''
      },
      currentAgencyIndex: -1,
      agencies,
      users
    };
  },
  mounted() {
    console.log('AgenciesView mounted');
    // If no agencies exist, initialize with default data
    if (this.agencies.length === 0) {
      console.log('No agencies found, initializing default data');
      const defaultAgencies = [
        {
          id: 'agency1',
          name: 'Premium Cars Agency',
          location: 'Downtown',
          contact: '+1234567890'
        },
        {
          id: 'agency2',
          name: 'Luxury Rentals',
          location: 'Uptown',
          contact: '+1234567891'
        }
      ];
      this.agencies = defaultAgencies;
      localStorage.setItem('agencies', JSON.stringify(defaultAgencies));
    }
  },
  computed: {
    filteredAgencies() {
      const sortedAgencies = sortByIdDesc(this.agencies);
      if (!this.searchQuery) return sortedAgencies;
      
      const query = this.searchQuery.toLowerCase();
      return sortedAgencies.filter(agency => 
        agency.name.toLowerCase().includes(query) ||
        agency.location.toLowerCase().includes(query) ||
        agency.contact.toLowerCase().includes(query)
      );
    },
    agencyAgents() {
      if (!this.selectedAgency) return [];
      return this.users.filter(user => 
        user.role === 'agent' && 
        user.agencyId === this.selectedAgency.id
      );
    }
  },
  methods: {
    showAgencyDetails(agency) {
      this.selectedAgency = { ...agency };
      this.showDetailsModal = true;
    },
    editAgency(agency, index) {
      this.currentAgency = { ...agency };
      this.currentAgencyIndex = index;
      this.showEditModal = true;
    },
    closeModal() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.currentAgency = {
        name: '',
        location: '',
        contact: ''
      };
      this.currentAgencyIndex = -1;
    },
    saveAgency() {
      if (this.showEditModal && this.currentAgencyIndex > -1) {
        // Update existing agency
        this.agencies[this.currentAgencyIndex] = {
          ...this.currentAgency,
          id: this.agencies[this.currentAgencyIndex].id
        };
      } else {
        // Add new agency
        const newAgency = {
          ...this.currentAgency,
          id: generateNextId(this.agencies)
        };
        this.agencies.push(newAgency);
      }
      
      // Save to localStorage
      localStorage.setItem('agencies', JSON.stringify(this.agencies));
      this.closeModal();
    },
    deleteAgency(index) {
      if (confirm('Are you sure you want to delete this agency? This will also remove all associated agents.')) {
        const agencyId = this.agencies[index].id;
        
        // Remove agency
        this.agencies.splice(index, 1);
        localStorage.setItem('agencies', JSON.stringify(this.agencies));
        
        // Remove associated agents
        const updatedUsers = this.users.filter(user => user.agencyId !== agencyId);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        this.users = updatedUsers;
      }
    }
  }
};
</script> 