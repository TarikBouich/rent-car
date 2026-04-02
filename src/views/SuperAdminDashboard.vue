<template>
  <div class="p-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    
    <!-- Top Bar -->
    <div class="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          SaaS Super Admin
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Supervision globale des locataires et abonnements</p>
      </div>
      <div>
        <button @click="showAddCompanyModal = true" class="px-5 py-2.5 bg-[#fa5b0f] text-white rounded-lg text-sm font-medium hover:bg-[#e04f0b] shadow-md transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nouveau Client (Locataire)
        </button>
      </div>
    </div>

    <!-- Stats summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-[#1e2330] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between relative overflow-hidden">
         <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-xl"></div>
         <div>
            <div class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Total Entreprises</div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ companyStore.companies.length }}</div>
         </div>
      </div>
      <div class="bg-white dark:bg-[#1e2330] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between relative overflow-hidden">
         <div class="absolute -right-4 -top-4 w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full blur-xl"></div>
         <div>
            <div class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Locataires Actifs</div>
            <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ activeCompanies.length }}</div>
         </div>
      </div>
    </div>

    <!-- Tenants Table -->
    <div class="bg-white dark:bg-[#1e2330] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
         <h2 class="text-lg font-bold text-gray-900 dark:text-white">Liste des Entreprises SaaS</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-[#1A1F2B] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-gray-800">
              <th class="p-4">Tenant ID</th>
              <th class="p-4">Raison Sociale</th>
              <th class="p-4">Forfait (Plan)</th>
              <th class="p-4">Statut</th>
              <th class="p-4">Contact (E-mail Admin)</th>
              <th class="p-4">Création</th>
              <th class="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <tr v-for="company in companyStore.companies" :key="company.id" class="hover:bg-gray-50 dark:hover:bg-[#1c222e] transition-colors">
              <td class="p-4">
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-xs font-mono font-medium">{{ company.id }}</span>
              </td>
              <td class="p-4 font-bold text-gray-900 dark:text-white capitalize">{{ company.name }}</td>
              <td class="p-4">
                <span class="px-2.5 py-1 rounded-md text-xs font-bold border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E2330] text-gray-700 dark:text-gray-300">
                  {{ SAAS_PLANS[company.planId]?.name || 'Pro' }}
                </span>
              </td>
              <td class="p-4">
                <span :class="company.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'" class="px-2.5 py-1 rounded-full text-xs font-bold border border-transparent">
                  {{ company.status }}
                </span>
              </td>
              <td class="p-4 text-sm text-gray-600 dark:text-gray-400">{{ company.email }}</td>
              <td class="p-4 text-sm text-gray-600 dark:text-gray-400">{{ formatDate(company.createdAt) }}</td>
              <td class="p-4 text-center">
                 <div class="flex items-center justify-center gap-3">
                   <router-link :to="`/super-admin/client/${company.id}`" class="text-blue-500 hover:text-blue-700 mx-auto" title="Statistiques & Forfait">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                   </router-link>
                   <button @click="deleteTenant(company.id)" class="text-red-500 hover:text-red-700 mx-auto" title="Supprimer">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                 </div>
              </td>
            </tr>
            <tr v-if="companyStore.companies.length === 0">
              <td colspan="6" class="p-8 text-center text-gray-500">Aucune entreprise locataire trouvée.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create SaaS Tenant Modal -->
    <div v-if="showAddCompanyModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-[#1E2330] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-[#1A1F2B]">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nouvel Abonnement SaaS</h2>
          <button @click="showAddCompanyModal = false" class="text-gray-500 hover:text-gray-700 dark:hover:text-white">
            X
          </button>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="createTenantContext">
            <!-- Company Info -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Raison Sociale de l'entreprise</label>
              <input type="text" v-model="form.companyName" required placeholder="LuxuryRentals SARL" class="w-full form-input border border-gray-300 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#151923]">
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail de l'Administrateur (Root Tenant)</label>
              <input type="email" v-model="form.adminEmail" required placeholder="admin@luxuryrentals.com" class="w-full form-input border border-gray-300 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#151923]">
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe de l'Administrateur</label>
              <input type="text" v-model="form.adminPassword" required placeholder="Saisir un mot de passe sécurisé" class="w-full form-input border border-gray-300 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#151923]">
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Forfait d'Abonnement (Plan)</label>
              <select v-model="form.planId" required class="w-full form-select border border-gray-300 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#151923]">
                <option v-for="(plan, key) in SAAS_PLANS" :key="key" :value="key">
                   {{ plan.name }} - {{ plan.priceStr }} (V: {{ plan.limits.cars }}, A: {{ plan.limits.agencies }}, U: {{ plan.limits.users }})
                </option>
              </select>
            </div>

            <div class="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800 mt-4">
              <button type="button" @click="showAddCompanyModal = false" class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white text-sm font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700">Annuler</button>
              <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700">Déployer l'Espace</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '../stores/companyStore'
import { generateNextId } from '../utils/idGenerator'
import { SAAS_PLANS } from '../utils/planConstants'

const router = useRouter()
const companyStore = useCompanyStore()

const showAddCompanyModal = ref(false)
const form = ref({
   companyName: '',
   adminEmail: '',
   adminPassword: '',
   planId: 'pro'
})

onMounted(() => {
   companyStore.initializeFromStorage()
})

const activeCompanies = computed(() => {
   return companyStore.activeCompanies || []
})

const formatDate = (isoString) => {
   if (!isoString) return '-'
   return new Date(isoString).toLocaleDateString('fr-FR')
}

const createTenantContext = () => {
   // 1. Create Company
   const newCompany = companyStore.addCompany({
      name: form.value.companyName,
      email: form.value.adminEmail,
      planId: form.value.planId
   })

   // 2. Provision Tenant Admin User Account associated to this Company
   const users = JSON.parse(localStorage.getItem('users') || '[]')
   const safeNextId = generateNextId(users) + Date.now().toString().slice(-4)
   
   // Giving full access permissions to this new admin
   const defaultModules = [
      'Tableau de bord', 'Agences', 'Clients', 'Voitures', 'Visites Techniques', 
      'Assurances', 'Entretiens', 'Tâches', 'Contrats', 'Réservations', 
      'Factures', 'Accidents', 'Versements', 'Financements', 'Traites', 'Comptabilité', 
      'Statistiques', 'Rapports généraux', 'Employés', 'Paramètres'
   ]
   const permissionsMap = {}
   defaultModules.forEach(mod => { permissionsMap[mod] = true })

   users.push({
      id: `usr_${safeNextId}`,
      email: form.value.adminEmail,
      password: form.value.adminPassword,
      name: `Admin ${form.value.companyName}`,
      role: 'admin', // This role signifies "Tenant Admin" under a companyId
      companyId: newCompany.id,
      agencyId: null, // Admin commands all agencies in his company
      permissions: permissionsMap,
      isActive: true
   })

   localStorage.setItem('users', JSON.stringify(users))
   alert(`L'espace SaaS de ${form.value.companyName} a bien été déployé. \nTenant ID: ${newCompany.id}`)
   
   form.value = { companyName: '', adminEmail: '', adminPassword: '' }
   showAddCompanyModal.value = false
}

const deleteTenant = (id) => {
   if (id === 'COMP-001') {
      alert("La compagnie par défaut ne peut être supprimée.");
      return;
   }
   if (confirm("ATTENTION: Êtes-vous sûr de vouloir supprimer ce client et TOUT l'accès à son espace de travail ? (Ses données resteront en DB mais inaccessibles).")) {
      companyStore.deleteCompany(id)
   }
}
</script>
