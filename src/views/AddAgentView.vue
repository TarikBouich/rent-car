<template>
<div class="p-6 min-h-[calc(100vh-4rem)] bg-[#F3F4F6] dark:bg-[#151923] font-[Inter]">

    <!-- Header with Back Button -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-4">
        <router-link to="/agents" class="p-2 text-gray-600 dark:text-gray-400 hover:text-white bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </router-link>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Nouvel Utilisateur</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">Ajouter un membre du personnel au système</p>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      
      <!-- Stepper Sidebar -->
      <div class="w-full lg:w-64 shrink-0">
        <div class="bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider">Étapes</h3>
          <ol class="relative border-l border-gray-200 dark:border-gray-800 ml-3">                  
            <li class="mb-8 ml-6">            
              <span class="absolute flex items-center justify-center w-6 h-6 bg-white dark:bg-[#1E2330] rounded-full -left-3 ring-4 ring-[#1E2330]" :class="currentStep >= 1 ? 'text-[#fa5b0f]' : 'text-gray-600'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
              </span>
              <h3 class="font-medium text-sm" :class="currentStep >= 1 ? 'text-white' : 'text-gray-600 dark:text-gray-400'">1. Identité</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Nom et informations de base</p>
            </li>
            <li class="mb-8 ml-6">
              <span class="absolute flex items-center justify-center w-6 h-6 bg-white dark:bg-[#1E2330] rounded-full -left-3 ring-4 ring-[#1E2330]" :class="currentStep >= 2 ? 'text-[#fa5b0f]' : 'text-gray-600'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </span>
              <h3 class="font-medium text-sm" :class="currentStep >= 2 ? 'text-white' : 'text-gray-600 dark:text-gray-400'">2. Coordonnées</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">E-mail et contacts de l'utilisateur</p>
            </li>
            <li class="ml-6">
              <span class="absolute flex items-center justify-center w-6 h-6 bg-white dark:bg-[#1E2330] rounded-full -left-3 ring-4 ring-[#1E2330]" :class="currentStep >= 3 ? 'text-[#fa5b0f]' : 'text-gray-600'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
              </span>
              <h3 class="font-medium text-sm" :class="currentStep >= 3 ? 'text-white' : 'text-gray-600 dark:text-gray-400'">3. Accès</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Rôle, agence et affectation système</p>
            </li>
          </ol>
        </div>
      </div>

      <!-- Main Form Area -->
      <div class="flex-1">
        <div class="bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
          
          <form @submit.prevent="saveAgent">
            <!-- Step 1: Identité -->
            <div v-show="currentStep === 1" class="p-6">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Informations d'identité</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom (Last Name)</label>
                  <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input type="text" v-model="form.lastName" required placeholder="Ex: Dupont" class="w-full form-input border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:bg-transparent bg-white">
              </div>
                </div>
                <div class="md:col-span-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom (First Name)</label>
                  <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input type="text" v-model="form.firstName" required placeholder="Ex: Jean" class="w-full form-input border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:bg-transparent bg-white">
              </div>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNE (Carte Nationale)</label>
                  <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <input type="text" v-model="form.cne" required placeholder="Ex: AB123456" class="w-full form-input border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:bg-transparent bg-white">
              </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Coordonnées -->
            <div v-show="currentStep === 2" class="p-6">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Coordonnées de l'utilisateur</h2>
              <div class="grid grid-cols-1 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse E-mail</label>
                  <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
                <input type="email" v-model="form.email" required placeholder="jean.dupont@rentcar.com" class="w-full form-input border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:bg-transparent bg-white">
              </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Accès -->
            <div v-show="currentStep === 3" class="p-6">
               <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Droits d'accès et Sécurité</h2>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <!-- Rôle -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rôle Système</label>
                    <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </div>
                <select v-model="form.role" required class="w-full form-select border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white dark:bg-transparent">
                      <option value="employé">Employé</option>
                      <option value="gérant">Gérant</option>
                      <option value="admin">Administrateur</option>
                    </select>
              </div>
                  </div>

                  <!-- Agence -->
                  <div v-if="form.role !== 'admin'">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Affectation d'Agence</label>
                    <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </div>
                <select v-model="form.agencyId" required class="w-full form-select border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white dark:bg-transparent">
                      <option value="" disabled>Sélectionner une Agence</option>
                      <option v-for="agency in agencies" :key="agency.id" :value="agency.id">
                        {{ agency.name }}
                      </option>
                    </select>
              </div>
                  </div>
               </div>

               <div class="grid grid-cols-1 gap-6">
                 <!-- Password -->
                 <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
                    <div class="flex items-center gap-3">
                      <div class="relative flex-1">
                        <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required placeholder="Saisir ou générer un mot de passe" class="w-full form-input border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:bg-transparent bg-white">
                        <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-600 focus:outline-none">
                          <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        </button>
                      </div>
                      <button type="button" @click="generatePassword" class="px-4 py-2 bg-[#fa5b0f] text-white text-sm font-medium rounded-lg hover:bg-orange-500 transition-colors shadow-sm whitespace-nowrap">
                        Générer
                      </button>
                    </div>
                 </div>
               </div>
            </div>

            <!-- Footer Controls -->
            <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1C1C1C] flex items-center justify-between rounded-b">
              <button 
                type="button" 
                @click="currentStep > 1 ? currentStep-- : null" 
                class="px-5 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white rounded-lg text-sm font-medium hover:bg-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] transition-colors"
                :class="currentStep === 1 ? 'opacity-0 pointer-events-none' : ''"
              >
                Précédent
              </button>
              
              <button 
                v-if="currentStep < 3"
                type="button" 
                @click="nextStep"
                class="px-5 py-2 bg-[#fa5b0f] text-white rounded-lg text-sm font-medium hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] shadow-sm transition-colors"
              >
                Continuer
              </button>

              <button 
                v-if="currentStep === 3"
                type="submit" 
                class="px-5 py-2 bg-[#22C55E] text-white rounded-lg text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors"
              >
                Créer le Profil
              </button>
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
import { useUserStore } from '../stores/userStore'
import { useAgencyStore } from '../stores/agencyStore'
import { useCompanyStore } from '../stores/companyStore'
import { SAAS_PLANS } from '../utils/planConstants'
import { generateNextId } from '../utils/idGenerator'

const router = useRouter()
const userStore = useUserStore()
const agencyStore = useAgencyStore()
const currentStep = ref(1)

const form = ref({
  lastName: '',
  firstName: '',
  cne: '',
  email: '',
  role: 'employé',
  agencyId: '',
  password: '',
  isActive: true
})

const showPassword = ref(false)
const agencies = computed(() => agencyStore.agencies)

onMounted(() => {
})

const nextStep = () => {
  // basic validation depending on step
  if (currentStep.value === 1 && (!form.value.lastName || !form.value.firstName || !form.value.cne)) return alert('Nom, Prénom et CNE requis')
  if (currentStep.value === 2 && !form.value.email) return alert('E-mail requis')
  currentStep.value++
}

const generatePassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%"
  let pass = ""
  for (let i = 0; i < 12; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  form.value.password = pass
  showPassword.value = true
}

const saveAgent = async () => {
  if (!form.value.password || (form.value.role !== 'admin' && !form.value.agencyId)) return alert('Détails d\'accès requis')

  // Generate Default Permissions Map corresponding to the Sidebar layout
  const defaultModules = [
    'Tableau de bord', 'Agences', 'Clients', 'Voitures', 'Visites Techniques', 
    'Assurances', 'Entretiens', 'Tâches', 'Contrats', 'Réservations', 
    'Factures', 'Accidents', 'Versements', 'Financements', 'Traites', 'Comptabilité', 
    'Statistiques', 'Rapports généraux', 'Employés', 'Paramètres'
  ];
  const permissionsMap = {};
  defaultModules.forEach(mod => {
    // If admin, everything is active by default. If employee/gerant, enable most by default.
    permissionsMap[mod] = true; 
  });

  try {
    const users = userStore.getAllUsers;
    const companyStore = useCompanyStore()
    const comp = companyStore.getCompanyById(userStore.userCompanyId)
    
    // Enforcement logic
    if (comp && comp.planId) {
       const plan = SAAS_PLANS[comp.planId]
       const userEmployees = users.filter(u => u.companyId === userStore.userCompanyId).length
       if (userEmployees >= plan.limits.users) {
          alert(`Limite Atteinte ! Votre forfait '${plan.name}' autorise un maximum de ${plan.limits.users} collaborateurs/utilisateurs.`)
          return
       }
    }

    const newUser = {
      ...form.value,
      agencyId: form.value.role === 'admin' ? null : form.value.agencyId,
      companyId: userStore.userCompanyId, 
      permissions: permissionsMap
    }
    
    await userStore.addUser(newUser)
    
    router.push('/agents')
  } catch (e) {
    console.error('Failed to create user', e)
    alert('Erreur lors de la création de l\'utilisateur')
  }
}
</script>
