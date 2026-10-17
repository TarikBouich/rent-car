<template>
  <div class="px-0 sm:px-6 py-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Liste des utilisateurs</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Gérez les accès et le personnel de votre système</p>
      </div>
<router-link to="/agents/add" class="inline-flex items-center gap-2 px-4 py-2 bg-[#fa5b0f] text-white text-sm font-medium rounded-lg hover:bg-orange-500 transition-colors shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un utilisateur
      </router-link>

    </div>

    <!-- Table Container -->
    <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <!-- Controls Bar -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1E2330]">
        <!-- Show Entries -->
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Show</span>
          <select 
            v-model="itemsPerPage" 
            class="border border-gray-200 dark:border-gray-800 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#fa5b0f] bg-white dark:bg-transparent text-gray-700 dark:text-white"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span>entries</span>
        </div>

        <!-- Search -->
        <div class="relative">
          <input
            type="search"
            v-model="searchQuery"
            placeholder="Rechercher..."
            class="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-[#fa5b0f] focus:ring-1 focus:ring-[#fa5b0f] bg-white dark:bg-transparent text-gray-900 dark:text-white"
          />
          <div class="absolute left-3 top-2.5 text-gray-600 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white dark:bg-[#1C1C1C] border-b border-gray-200 dark:border-gray-800 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold">
              <th class="px-6 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Utilisateur</th>
              <th class="px-6 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Nom d'utilisateur</th>
              <th class="px-6 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Rôle</th>
              <th class="px-6 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Agence</th>
              <th class="px-6 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800 bg-white dark:bg-[#1E2330]">
            <tr v-for="agent in paginatedAgents" :key="agent.id" class="hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors group">
              
              <!-- Avatar & Name -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-yellow-500/20 border-[2px] border-gray-300 dark:border-gray-700 shadow-sm flex items-center justify-center shrink-0 overflow-hidden text-[#fa5b0f] font-bold text-sm">
                    {{ getInitials(agent.name) }}
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ agent.name }}</span>
                    <span class="text-xs text-gray-600 dark:text-gray-400">{{ agent.email }}</span>
                  </div>
                </div>
              </td>

              <!-- Username (generated from email for display if none exists) -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">@{{ agent.email.split('@')[0] }}</span>
              </td>

              <!-- Role Badges -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                  :class="getRoleBadgeClasses(agent.role)"
                >
                  {{ getRoleName(agent.role) }}
                </span>
              </td>

              <!-- Agence -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ getAgencyName(agent.agencyId) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-2 transition-opacity">
                  <button 
                    @click="viewDetails(agent.id)"
                    class="p-1.5 bg-blue-900/20 text-[#3B82F6] hover:bg-blue-900/40 rounded-full transition-colors shrink-0 outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-1"
                    title="Détails"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    @click="viewDetails(agent.id)"
                    class="p-1.5 bg-blue-900/20 text-[#3B82F6] hover:bg-blue-900/40 rounded-full transition-colors shrink-0 outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-1"
                    title="Modifier"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <!-- Empty State -->
            <tr v-if="paginatedAgents.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-600 dark:text-gray-400 text-sm">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination Controls -->
      <div v-if="filteredAgents.length > itemsPerPage" class="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1C1C1C]">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          Affichage de {{ (currentPage - 1) * itemsPerPage + 1 }} à {{ Math.min(currentPage * itemsPerPage, filteredAgents.length) }} sur {{ filteredAgents.length }} entrées
        </span>
        <div class="flex items-center gap-1">
          <button 
            @click="currentPage > 1 ? currentPage-- : null"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-[#1C1C1C] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            class="px-3 py-1 border rounded text-sm font-medium focus:outline-none"
            :class="currentPage === page ? 'bg-[#fa5b0f] text-white border-[#fa5b0f]' : 'bg-white dark:bg-[#1C1C1C] text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800'"
          >
            {{ page }}
          </button>

          <button 
            @click="currentPage < totalPages ? currentPage++ : null"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-[#1C1C1C] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useAgencyStore } from '../stores/agencyStore'

const router = useRouter()
const userStore = useUserStore()
const agencyStore = useAgencyStore()

const searchQuery = ref('')
const itemsPerPage = ref(10)
const currentPage = ref(1)

const agents = computed(() => {
  const usersData = [...userStore.getAllUsers]
  return usersData.filter(user => user.role === 'employé' || user.role === 'agent' || user.role === 'admin' || user.role === 'gérant' || user.role === 'gerant')
})
const agencies = computed(() => agencyStore.agencies)

onMounted(async () => {
  // We no longer need to manually copy users into a ref since we use computed
  // The fetch logic is now managed implicitly inside initializeFromStorage
  // However, forcing a fetch here ensures hot reload safety
  try {
    await userStore.fetchUsers()
  } catch(e) {
    console.error(e)
  }
})

const getAgencyName = (id) => {
  const ag = agencies.value.find(a => a.id === id)
  return ag ? ag.name : 'Toutes les agences'
}

const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getRoleName = (role) => {
  const map = {
    'admin': 'Admin',
    'gerant': 'Gérant',
    'agent': 'Agent'
  }
  return map[role] || role
}

const getRoleBadgeClasses = (role) => {
  if (role === 'admin') return 'bg-blue-100 text-blue-700 border-blue-200'
  if (role === 'gerant') return 'bg-purple-100 text-purple-700 border-purple-200'
  return 'bg-gray-100 text-gray-700 border-gray-200'
}

const viewDetails = (id) => {
  router.push(`/agents/${id}`)
}

const filteredAgents = computed(() => {
  if (!searchQuery.value) return agents.value
  const q = searchQuery.value.toLowerCase()
  return agents.value.filter(a => 
    a.name?.toLowerCase().includes(q) || 
    a.email?.toLowerCase().includes(q) ||
    getAgencyName(a.agencyId).toLowerCase().includes(q)
  )
})

const totalPages = computed(() => {
  if(filteredAgents.value.length === 0) return 1
  return Math.ceil(filteredAgents.value.length / itemsPerPage.value)
})

const paginatedAgents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredAgents.value.slice(start, end)
})
</script>