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
          <span class="text-lg font-bold leading-none">Agents</span>
          <div class="flex items-center gap-2">
            <div class="w-[500px]">
              <div class="relative flex items-center">
                <input
                  type="search"
                  class="form-field pl-10"
                  placeholder="Search for an agent by name or email"
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
              Add Agent
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
                <th class="p-4 text-left">Email</th>
                <th class="p-4 text-left">Role</th>
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
              <tr v-for="(agent, index) in filteredAgents" :key="agent.id" 
                class="hover:bg-gray-50 dark:hover:bg-dark-60 transition-colors"
              >
                <td class="p-4">
                  <div class="flex flex-col">
                    <button 
                      @click="showAgentDetails(agent)"
                      class="text-lg font-bold text-primary-100 hover:text-primary-200 transition-colors text-left"
                    >
                      {{ agent.name }}
                    </button>
                  </div>
                </td>
                <td class="p-4">
                  <span class="text-black dark:text-white">{{ agent.email }}</span>
                </td>
                 <td class="p-4">
                  <span class="text-black dark:text-white">{{ agent.role }}</span>
                </td>
                 <td class="p-4">
                  <span class="text-black dark:text-white">{{ getAgencyName(agent.agencyId) }}</span>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <button
                      @click="editAgent(agent, index)"
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
                      @click="deleteAgent(index)"
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

    <!-- Agent Details Modal -->
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
          <h5 class="font-semibold leading-none">Agent Details</h5>
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
              <p class="text-lg font-semibold">{{ selectedAgent.name }}</p>
            </div>
            <div>
              <label class="block text-sm text-gray-500">Email</label>
              <p class="text-lg font-semibold">{{ selectedAgent.email }}</p>
            </div>
             <div>
              <label class="block text-sm text-gray-500">Role</label>
              <p class="text-lg font-semibold">{{ selectedAgent.role }}</p>
            </div>
             <div>
              <label class="block text-sm text-gray-500">Agency</label>
              <p class="text-lg font-semibold">{{ getAgencyName(selectedAgent.agencyId) }}</p>
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

    <!-- Add/Edit Agent Modal -->
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
          <h5 class="font-semibold leading-none">{{ showEditModal ? 'Edit Agent' : 'Add Agent' }}</h5>
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
          <form @submit.prevent="saveAgent" class="grid gap-4">
            <div>
              <label for="agentName" class="block text-sm mb-1">Name</label>
              <input
                type="text"
                class="form-field"
                id="agentName"
                v-model="currentAgent.name"
                required
              />
            </div>
            <div>
              <label for="agentEmail" class="block text-sm mb-1">Email</label>
              <input
                type="email"
                class="form-field"
                id="agentEmail"
                v-model="currentAgent.email"
                required
              />
            </div>
             <div>
              <label for="agentRole" class="block text-sm mb-1">Role</label>
               <select
                class="form-field"
                id="agentRole"
                v-model="currentAgent.role"
                required
              >
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
             <div>
              <label for="agentAgency" class="block text-sm mb-1">Agency</label>
               <select
                class="form-field"
                id="agentAgency"
                v-model="currentAgent.agencyId"
                required
              >
                 <option value="">Select Agency</option>
                 <option v-for="agency in agencies" :key="agency.id" :value="agency.id">{{ agency.name }}</option>
              </select>
            </div>
             <div v-if="!showEditModal">
               <label for="agentPassword" class="block text-sm mb-1">Password</label>
               <input
                type="password"
                class="form-field"
                id="agentPassword"
                v-model="currentAgent.password"
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
                {{ showEditModal ? 'Save Changes' : 'Add Agent' }}
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
  name: 'AgentsView',
  props: {
    mode: String,
  },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const agencies = JSON.parse(localStorage.getItem('agencies') || '[]');
    
    // Filter for only agent and admin users
    const agentsAndAdmins = users.filter(user => user.role === 'agent' || user.role === 'admin');

    return {
      searchQuery: '',
      showDetailsModal: false,
      showAddModal: false,
      showEditModal: false,
      selectedAgent: {},
      currentAgent: {
        name: '',
        email: '',
        role: 'agent',
        agencyId: '',
        password: ''
      },
      currentAgentIndex: -1,
      agents: agentsAndAdmins,
      agencies: agencies // Available agencies for dropdown
    };
  },
  computed: {
    filteredAgents() {
      const sortedAgents = sortByIdDesc(this.agents);
      if (!this.searchQuery) return sortedAgents;
      
      const query = this.searchQuery.toLowerCase();
      return sortedAgents.filter(agent => 
        agent.name.toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query) ||
        this.getAgencyName(agent.agencyId).toLowerCase().includes(query)
      );
    }
  },
  methods: {
    getAgencyName(agencyId) {
      const agency = this.agencies.find(a => a.id === agencyId);
      return agency ? agency.name : 'Unknown Agency';
    },
    showAgentDetails(agent) {
      this.selectedAgent = { ...agent };
      this.showDetailsModal = true;
    },
    editAgent(agent, index) {
      this.currentAgent = { ...agent };
      this.currentAgentIndex = this.agents.findIndex(a => a.id === agent.id);
      this.showEditModal = true;
    },
    closeModal() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.currentAgent = {
        name: '',
        email: '',
        role: 'agent',
        agencyId: '',
        password: '' // Clear password on close
      };
      this.currentAgentIndex = -1;
    },
    saveAgent() {
      if (this.showEditModal && this.currentAgentIndex > -1) {
        // Update existing agent
        // Retain original password if not changed in the modal
        const originalAgent = this.agents[this.currentAgentIndex];
        this.agents[this.currentAgentIndex] = {
          ...this.currentAgent,
          id: originalAgent.id,
          password: this.currentAgent.password || originalAgent.password // Keep old password if new one is empty
        };
      } else {
        // Add new agent
        const newAgent = {
          ...this.currentAgent,
          id: generateNextId(this.agents),
          // In a real app, password should be hashed before saving
        };
        this.agents.push(newAgent);
      }
      
      // Save updated users array to localStorage
      localStorage.setItem('users', JSON.stringify(this.agents)); // Save updated agents (which are part of users)
      this.closeModal();
    },
    deleteAgent(index) {
      if (confirm('Are you sure you want to delete this agent?')) {
         const agentToDelete = this.filteredAgents[index];
         
         // Find the original index in the full agents array
         const originalIndex = this.agents.findIndex(agent => agent.id === agentToDelete.id);
         
         if (originalIndex > -1) {
            this.agents.splice(originalIndex, 1);
            // Save updated users array to localStorage
            localStorage.setItem('users', JSON.stringify(this.agents)); // Save updated agents (which are part of users)
         }
      }
    }
  },
  mounted() {
    // Initial load might happen before agencies are in localStorage
    // Re-parse agencies to ensure they are available for getAgencyName
    this.agencies = JSON.parse(localStorage.getItem('agencies') || '[]');
    // Filter users to get only agents and admins
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    this.agents = users.filter(user => user.role === 'agent' || user.role === 'admin');
  }
};
</script> 