<template>
  <div v-if="agent" class="px-0 sm:px-6 py-6 min-h-[calc(100vh-4rem)] bg-[#F3F4F6] dark:bg-[#151923] font-[Inter]">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-4">
        <router-link to="/agents" class="p-2 text-gray-600 dark:text-gray-400 hover:text-white bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 shrink-0">
           <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </router-link>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ agent.name }}</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">Fiche de l'utilisateur</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="px-4 py-2 bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors shadow-sm">
          Réinitialiser le mot de passe
        </button>
        <button @click="saveChanges" class="px-4 py-2 bg-[#fa5b0f] text-white text-sm font-medium rounded-lg hover:bg-orange-500 transition-colors shadow-sm">
          Sauvegarder
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Profile Card -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-center">
          <div class="relative mb-4">
             <div class="w-24 h-24 rounded-full bg-yellow-500/20 border-4 border-[#1E2330] shadow-md flex items-center justify-center overflow-hidden text-[#fa5b0f] font-bold text-3xl">
               {{ getInitials(agent.name) }}
             </div>
             <!-- Status indicator on avatar -->
             <div class="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-[#1E2330]" :class="agent.isActive !== false ? 'bg-green-500' : 'bg-gray-500'"></div>
          </div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ agent.name }}</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">@{{ agent.email.split('@')[0] }}</p>
          
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border mb-6 text-center w-max"
            :class="getRoleBadgeClasses(agent.role)"
          >
            {{ getRoleName(agent.role) }}
          </span>

          <div class="w-full pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-900 dark:text-white">Statut du compte</span>
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ agent.isActive !== false ? 'Actif' : 'Inactif' }}</span>
            </div>
            <!-- Toggle -->
            <button 
              v-if="userStore.isAdmin"
              @click="toggleStatus"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none transition-colors duration-200 ease-in-out"
              :class="agent.isActive !== false ? 'bg-[#fa5b0f]' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <span 
                class="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="agent.isActive !== false ? 'translate-x-2.5' : '-translate-x-2.5'"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Details & Access -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- General Info (Editable) -->
        <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Informations personnelles</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Prénom</label>
              <input v-model="agent.firstName" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#151923] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Nom</label>
              <input v-model="agent.lastName" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#151923] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">CNE / Identifiant</label>
              <input v-model="agent.cne" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#151923] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Adresse E-mail</label>
              <input v-model="agent.email" type="email" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#151923] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Téléphone</label>
              <input v-model="agent.telephone" type="tel" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#151923] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f]" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Rôle</label>
              <select v-model="agent.role" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#151923] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f]">
                <option value="employé">Employé</option>
                <option value="gérant">Gérant</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Agence Affectée</label>
              <select v-model="agent.agencyId" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#151923] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f]">
                <option value="">Toutes les agences</option>
                <option v-for="ag in agencies" :key="ag.id" :value="ag.id">{{ ag.name }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- System Access -->
        <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <div class="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
             <h3 class="text-lg font-bold text-gray-900 dark:text-white">Accès au système</h3>
             <span class="text-xs text-gray-600 dark:text-gray-400">Modules autorisés : {{ getPermissions().filter(p => p.allowed).length }} / {{ getPermissions().length }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="perm in permissionsList" 
              :key="perm.name" 
              @click="togglePermission(perm.name)"
              class="flex items-center gap-3 p-3 rounded-lg border transition-colors relative"
              :class="[
                 perm.allowed ? 'border-[#fa5b0f]/30 bg-[#fa5b0f]/10' : 'border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-800/50 opacity-60',
                 userStore.isAdmin ? 'cursor-pointer hover:border-[#fa5b0f]/50' : 'cursor-default'
              ]"
            >
              <div 
                class="w-6 h-6 rounded flex items-center justify-center shrink-0"
                :class="perm.allowed ? 'bg-[#fa5b0f] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'"
              >
                <svg v-if="perm.allowed" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold" :class="perm.allowed ? 'text-[#fa5b0f]' : 'text-gray-600 dark:text-gray-400'">{{ perm.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ perm.desc }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  
  <div v-else class="p-6 flex items-center justify-center h-[calc(100vh-4rem)] bg-[#F3F4F6] dark:bg-[#151923]">
    <div class="animate-pulse w-8 h-8 rounded-full border-4 border-[#fa5b0f] border-t-transparent animate-spin"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useAgencyStore } from '../stores/agencyStore'

const route = useRoute()
const userStore = useUserStore()
const agencyStore = useAgencyStore()
const agent = ref(null)
const agencies = computed(() => agencyStore.agencies)

// Enforce default polyfill for older users without initialized permissions
const defaultModules = [
  'Tableau de bord', 'Agences', 'Clients', 'Voitures', 'Visites Techniques', 
  'Assurances', 'Entretiens', 'Tâches', 'Contrats', 'Réservations', 
  'Factures', 'Accidents', 'Versements', 'Financements', 'Traites', 'Comptabilité', 
  'Statistiques', 'Rapports généraux', 'Employés', 'Paramètres'
]

onMounted(async () => {
  const id = route.params.id
  
  // Ensure users are loaded
  if (!userStore.users.length) {
    await userStore.fetchUsers()
  }
  
  const found = userStore.getAllUsers.find(u => String(u.id) === String(id)) || null
  agent.value = found
  
  if (agent.value) {
    // Normalize permissions: MySQL may return JSON as string or object with numeric keys
    let perms = agent.value.permissions
    if (typeof perms === 'string') {
      try { perms = JSON.parse(perms) } catch(e) { perms = {} }
    }
    // Normalize boolean values (could be 0/1 or "true"/"false" from DB)
    if (perms && typeof perms === 'object' && !Array.isArray(perms)) {
      const normalized = {}
      for (const key of Object.keys(perms)) {
        normalized[key] = perms[key] === true || perms[key] === 1 || perms[key] === 'true'
      }
      agent.value.permissions = normalized
    } else {
      // Build default permissions
      agent.value.permissions = {}
      defaultModules.forEach(mod => {
        agent.value.permissions[mod] = agent.value.role === 'admin'
      })
    }
  }
})

const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getAgencyName = (id) => {
  const ag = agencies.value.find(a => a.id === id)
  return ag ? ag.name : 'Toutes les agences'
}

const getRoleName = (role) => {
  const map = {
    'admin': 'Administrateur',
    'gérant': 'Gérant',
    'gerant': 'Gérant',
    'employé': 'Employé',
    'agent': 'Employé'
  }
  return map[role] || role
}

const getRoleBadgeClasses = (role) => {
  if (role === 'admin') return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  if (role === 'gerant') return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
}

const toggleStatus = async () => {
  if (agent.value) {
    agent.value.isActive = agent.value.isActive === false ? true : false
    
    // Save locally to API instantly
    try {
      await userStore.updateUser({
         id: agent.value.id,
         isActive: agent.value.isActive
      })
    } catch(e) {
      console.error('Echec toggle status', e)
      alert("Erreur réseau")
    }
  }
}

const saveChanges = async () => {
  if (agent.value) {
    try {
       // Rebuild name from first + last name
       if (agent.value.firstName || agent.value.lastName) {
         agent.value.name = `${agent.value.firstName || ''} ${agent.value.lastName || ''}`.trim()
       }
       await userStore.updateUser(agent.value)
       alert('Profil utilisateur mis à jour avec succès')
    } catch(e) {
       console.error(e)
       alert('Erreur lors de la mise à jour')
    }
  }
}

// Mock descriptions to map against standard permissions dictionary
const MODULE_DESCRIPTIONS = {
  'Tableau de bord': 'Vue d\'ensemble', 'Agences': 'Gestion des agences', 'Clients': 'Base de données clients',
  'Voitures': 'Gestion de la flotte', 'Visites Techniques': 'Centre de visites', 'Assurances': 'Gestion assurances',
  'Entretiens': 'Maintenance', 'Tâches': 'Rappels et tâches', 'Contrats': 'Édition de contrats',
  'Réservations': 'Locations', 'Factures': 'Édition des factures', 'Accidents': 'Suivi des sinistres',
  'Versements': 'Paiements', 'Financements': 'Crédits et banques', 'Traites': 'Gestion des traites',
  'Comptabilité': 'Bilan financier', 'Statistiques': 'Analyses', 'Rapports généraux': 'Génération documents',
  'Employés': 'Accès au personnel', 'Paramètres': 'Configuration système'
}

const permissionsList = computed(() => {
  if (!agent.value || !agent.value.permissions) return []
  return Object.keys(agent.value.permissions).map(key => ({
    name: key,
    desc: MODULE_DESCRIPTIONS[key] || 'Accès au module',
    allowed: agent.value.permissions[key]
  }))
})

// Used inside template <h3 class="text-lg font-bold"> etc.
const getPermissions = () => permissionsList.value

const togglePermission = async (permName) => {
  // Only admins can click to change
  if (!userStore.isAdmin || !agent.value) return;

  agent.value.permissions[permName] = !agent.value.permissions[permName];

  try {
     await userStore.updateUser({ id: agent.value.id, permissions: agent.value.permissions })
  } catch(e) {
     console.error('Toggle perm error', e)
  }
}
</script>
