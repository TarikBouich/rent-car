<template>
  <div class="px-0 sm:px-6 py-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    <div class="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          SaaS Super Admin
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Dashboard clients SaaS et revenus</p>
      </div>
      <div class="hidden sm:block">
        <button @click="showAddCompanyModal = true" class="px-5 py-2.5 bg-[#fa5b0f] text-white rounded-lg text-sm font-medium hover:bg-[#e04f0b] shadow-md transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nouveau Client (Locataire)
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-[#1e2330] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-end gap-4">
        <div class="w-full md:w-56">
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Filtre période</label>
          <select v-model="periodFilter" class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-[#151923] text-sm text-gray-800 dark:text-gray-200">
            <option value="this_month">Ce mois</option>
            <option value="this_quarter">Ce trimestre</option>
            <option value="this_year">Cette année</option>
            <option value="all">Toute période</option>
            <option value="custom">Personnalisée</option>
          </select>
        </div>
        <div v-if="periodFilter === 'custom'" class="flex flex-col sm:flex-row gap-3 w-full">
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Du</label>
            <input v-model="customFrom" type="date" class="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-[#151923] text-sm text-gray-800 dark:text-gray-200" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Au</label>
            <input v-model="customTo" type="date" class="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-[#151923] text-sm text-gray-800 dark:text-gray-200" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <div class="bg-white dark:bg-[#1e2330] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between relative overflow-hidden">
         <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-xl"></div>
         <div>
            <div class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Clients (Filtrés)</div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ filteredCompanies.length }}</div>
         </div>
      </div>
      <div class="bg-white dark:bg-[#1e2330] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between relative overflow-hidden">
         <div class="absolute -right-4 -top-4 w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full blur-xl"></div>
         <div>
            <div class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Clients Actifs</div>
            <div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ activeCompanies.length }}</div>
         </div>
      </div>
      <div class="bg-white dark:bg-[#1e2330] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between relative overflow-hidden">
         <div class="absolute -right-4 -top-4 w-24 h-24 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-xl"></div>
         <div>
            <div class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Clients Payants</div>
            <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">{{ payingCompanies.length }}</div>
         </div>
      </div>
      <div class="bg-white dark:bg-[#1e2330] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between relative overflow-hidden">
         <div class="absolute -right-4 -top-4 w-24 h-24 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-xl"></div>
         <div>
            <div class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Revenu Total</div>
            <div class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{{ formatMoney(totalRevenue) }}</div>
            <div class="text-xs text-gray-500 mt-1">MAD / mois</div>
         </div>
      </div>
    </div>

    <div class="bg-white dark:bg-[#1e2330] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-6">
      <div class="p-4 border-b border-gray-200 dark:border-gray-800">
         <h2 class="text-lg font-bold text-gray-900 dark:text-white">Paiement Clients Basé Sur Le Plan</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-[#1A1F2B] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-gray-800">
              <th class="p-4">Plan</th>
              <th class="p-4">Prix Plan</th>
              <th class="p-4">Clients</th>
              <th class="p-4">Revenu Plan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <tr v-for="row in planBreakdown" :key="row.planId">
              <td class="p-4 font-semibold text-gray-900 dark:text-white">{{ row.planName }}</td>
              <td class="p-4 text-sm text-gray-600 dark:text-gray-400">{{ formatMoney(row.planPrice) }} MAD/mois</td>
              <td class="p-4 text-sm text-gray-600 dark:text-gray-400">{{ row.clientCount }}</td>
              <td class="p-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400">{{ formatMoney(row.revenue) }} MAD/mois</td>
            </tr>
            <tr v-if="planBreakdown.length === 0">
              <td colspan="4" class="p-8 text-center text-gray-500">Aucune donnée de paiement pour cette période.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-white dark:bg-[#1e2330] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
         <h2 class="text-lg font-bold text-gray-900 dark:text-white">Liste Clients SaaS (Filtrée)</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-[#1A1F2B] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-gray-800">
              <th class="p-4">Tenant ID</th>
              <th class="p-4">Raison Sociale</th>
              <th class="p-4">Forfait (Plan)</th>
              <th class="p-4">Statut</th>
              <th class="p-4">Paiement</th>
              <th class="p-4">Contact (E-mail Admin)</th>
              <th class="p-4">Création</th>
              <th class="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <tr v-for="company in filteredCompanies" :key="company.id" class="hover:bg-gray-50 dark:hover:bg-[#1c222e] transition-colors">
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
                <span :class="String(company.status).toLowerCase() === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'" class="px-2.5 py-1 rounded-full text-xs font-bold border border-transparent">
                  {{ company.status }}
                </span>
              </td>
              <td class="p-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {{ formatMoney(monthlyPayment(company)) }} MAD/mois
              </td>
              <td class="p-4 text-sm text-gray-600 dark:text-gray-400">{{ company.email }}</td>
              <td class="p-4 text-sm text-gray-600 dark:text-gray-400">{{ formatDate(company.createdAt) }}</td>
              <td class="p-4 text-center">
                <router-link :to="`/super-admin/client/${company.id}`" class="inline-flex text-blue-500 hover:text-blue-700" title="Voir et mettre à jour le plan">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </router-link>
              </td>
            </tr>
            <tr v-if="filteredCompanies.length === 0">
              <td colspan="8" class="p-8 text-center text-gray-500">Aucun client trouvé pour cette période.</td>
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
import { useCompanyStore } from '../stores/companyStore'
import { generateNextId } from '../utils/idGenerator'
import { SAAS_PLANS } from '../utils/planConstants'
import api from '../services/api'

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

const periodFilter = ref('this_month')
const customFrom = ref('')
const customTo = ref('')

const visibleCompanies = computed(() => {
   return (companyStore.companies || []).filter(company => company.id !== 'COMP-SUPERADMIN')
})

const activeCompanies = computed(() => {
   return filteredCompanies.value.filter(c => String(c.status).toLowerCase() === 'active')
})

const formatDate = (isoString) => {
   if (!isoString) return '-'
   return new Date(isoString).toLocaleDateString('fr-FR')
}

const startOfDay = (value) => {
   const d = new Date(value)
   d.setHours(0, 0, 0, 0)
   return d
}

const endOfDay = (value) => {
   const d = new Date(value)
   d.setHours(23, 59, 59, 999)
   return d
}

const activeRange = computed(() => {
   const now = new Date()

   if (periodFilter.value === 'all') {
      return { from: null, to: null }
   }

   if (periodFilter.value === 'this_month') {
      return {
         from: new Date(now.getFullYear(), now.getMonth(), 1),
         to: endOfDay(now)
      }
   }

   if (periodFilter.value === 'this_quarter') {
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3
      return {
         from: new Date(now.getFullYear(), quarterStartMonth, 1),
         to: endOfDay(now)
      }
   }

   if (periodFilter.value === 'this_year') {
      return {
         from: new Date(now.getFullYear(), 0, 1),
         to: endOfDay(now)
      }
   }

   if (periodFilter.value === 'custom' && customFrom.value && customTo.value) {
      return {
         from: startOfDay(customFrom.value),
         to: endOfDay(customTo.value)
      }
   }

   return { from: null, to: null }
})

const isInSelectedPeriod = (company) => {
   const { from, to } = activeRange.value
   if (!from || !to) return true
   const created = new Date(company.createdAt || company.updatedAt || Date.now())
   return created >= from && created <= to
}

const filteredCompanies = computed(() => {
   return visibleCompanies.value.filter(isInSelectedPeriod)
})

const monthlyPayment = (company) => {
   const isActive = String(company.status).toLowerCase() === 'active'
   if (!isActive) return 0
   return SAAS_PLANS[company.planId]?.price || 0
}

const payingCompanies = computed(() => {
   return activeCompanies.value.filter(c => monthlyPayment(c) > 0)
})

const totalRevenue = computed(() => {
   return activeCompanies.value.reduce((sum, company) => sum + monthlyPayment(company), 0)
})

const planBreakdown = computed(() => {
   const map = {}

   activeCompanies.value.forEach(company => {
      const planId = company.planId || 'pro'
      const plan = SAAS_PLANS[planId] || SAAS_PLANS.pro
      if (!map[planId]) {
         map[planId] = {
            planId,
            planName: plan.name,
            planPrice: plan.price || 0,
            clientCount: 0,
            revenue: 0
         }
      }
      map[planId].clientCount += 1
      map[planId].revenue += plan.price || 0
   })

   return Object.values(map).sort((a, b) => b.revenue - a.revenue)
})

const formatMoney = (value) => {
   return new Intl.NumberFormat('fr-MA', {
      maximumFractionDigits: 0
   }).format(value || 0)
}

const createTenantContext = async () => {
   try {
      // 1. Create Company first
      const companyId = `COMP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      const newCompany = await companyStore.addCompany({
         id: companyId,
         name: form.value.companyName,
         email: form.value.adminEmail,
         planId: form.value.planId
      })

      // 2. Create Tenant Admin User in Database
      try {
         const response = await api.post(`/companies/${companyId}/create-admin`, {
            companyId: newCompany.id,
            email: form.value.adminEmail,
            password: form.value.adminPassword,
            name: `Admin ${form.value.companyName}`
         })
         console.log('User created:', response.data)
      } catch (userError) {
         console.error('User creation error:', userError.response?.data || userError.message)
         throw userError
      }

      alert(`✓ Espace SaaS déployé!\n\nTenant ID: ${newCompany.id}\n\nIdentifiants:\nEmail: ${form.value.adminEmail}\nMot de passe: ${form.value.adminPassword}`)

      form.value = { companyName: '', adminEmail: '', adminPassword: '', planId: 'pro' }
      showAddCompanyModal.value = false

      // Refresh companies list
      await companyStore.fetchCompanies()
   } catch (error) {
      console.error('Tenant creation failed:', error)
      const errorMsg = error.response?.data?.message || error.message
      alert(`✗ Erreur:\n${errorMsg}`)
   }
}

const deleteTenant = (id) => {
   if (id === 'COMP-001' || id === 'COMP-SUPERADMIN') {
      alert("Cette compagnie système ne peut être supprimée.");
      return;
   }
   if (confirm("ATTENTION: Êtes-vous sûr de vouloir supprimer ce client et TOUT l'accès à son espace de travail ? (Ses données resteront en DB mais inaccessibles).")) {
      companyStore.deleteCompany(id)
   }
}
</script>
