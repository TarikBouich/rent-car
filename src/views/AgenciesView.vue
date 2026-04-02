<template>
    <div class="p-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-screen font-[Inter]">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Agences</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ filteredAgencies.length }} agence(s) enregistrée(s)</p>
          </div>
        </div>
        <button 
          @click="showAddModal = true" 
          class="flex items-center gap-2 px-4 py-2 bg-[#fa5b0f] text-[#fff] rounded-[8px] transition-colors font-bold border border-[#fa5b0f] hover:bg-transparent hover:text-[#fa5b0f]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nouvelle agence
        </button>
      </div>

      <!-- Search Bar -->
      <div class="bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-800 rounded-xl p-2 mb-8 shadow-sm flex items-center">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Nom de l'agence, email, ville..."
            class="w-full pl-11 pr-4 py-2 bg-transparent text-gray-900 dark:text-white outline-none text-sm placeholder-gray-400"
          >
        </div>
        <button class="flex items-center gap-2 px-4 py-2 bg-[#fa5b0f] text-[#fff] rounded-[8px] transition-colors font-bold border border-[#fa5b0f] hover:bg-transparent hover:text-[#fa5b0f] ml-2 shrink-0">
          Rechercher
        </button>
      </div>

      <!-- Grid Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="(agency, index) in filteredAgencies" :key="agency.id" 
          class="bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md"
        >
          <div class="p-5">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-[#F3F4F6] dark:bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                  <span class="text-xl font-bold text-gray-600 dark:text-gray-300">{{ agency.name.substring(0, 2).toUpperCase() }}</span>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 dark:text-white text-base">{{ agency.name }}</h3>
                  <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <svg class="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    {{ agency.location }}
                  </div>
                </div>
              </div>
              <span class="text-xs font-bold text-[#2563EB] bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded">#{{ index + 1 }}</span>
            </div>

            <div class="border-t border-gray-100 dark:border-gray-800/50 pt-4 pb-4">
               <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  {{ agency.email || agency.phone || 'Non spécifié' }}
               </div>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-2">
               <!-- Espèces Badge -->
               <div class="bg-green-50 dark:bg-green-900/10 rounded-lg p-3 text-center border border-green-100 dark:border-green-900/30">
                 <div class="flex items-center justify-center gap-1.5 text-[10px] font-bold text-green-600 dark:text-green-500 uppercase tracking-wider mb-1">
                   <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                   Espèces
                 </div>
                 <div class="text-sm font-bold text-green-600 dark:text-green-500">
                    {{ agencyStore.getAgencyTotalEspece(agency.id).toFixed(2).replace('.', ',') }} DH
                 </div>
               </div>
               
               <!-- Banque Badge -->
               <div class="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3 text-center border border-blue-100 dark:border-blue-900/30">
                 <div class="flex items-center justify-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-500 uppercase tracking-wider mb-1">
                   <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                   Banque
                 </div>
                 <div class="text-sm font-bold text-blue-600 dark:text-blue-500">
                    {{ agencyStore.getAgencyTotalBanque(agency.id).toFixed(2).replace('.', ',') }} DH
                 </div>
               </div>
            </div>
          </div>
          
          <div class="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1C1F2B] p-3 flex justify-end items-center gap-2">
            <button @click="goToProfile(agency.id)" class="px-3 py-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-700 rounded-md hover:text-[#2563EB] hover:border-[#2563EB] transition-colors flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              Fiche
            </button>
            <button @click="goToProfile(agency.id)" class="px-2 py-1.5 text-blue-500 bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-700 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            </button>
            <button @click="deleteAgency(agency.id)" class="px-2 py-1.5 text-red-500 bg-white dark:bg-[#1C1F2B] border border-red-100 dark:border-red-900/30 rounded-md hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Missing Agency View -->
      <div v-if="filteredAgencies.length === 0" class="text-center py-20 bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-800 rounded-xl mt-4 shadow-sm">
        <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Aucune agence trouvée</h3>
        <p class="text-gray-500 mt-1">Essayez de modifier votre recherche ou ajoutez une nouvelle agence.</p>
      </div>

      <!-- Custom Add Modal -->
      <div v-if="showAddModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nouvelle agence</h2>
            <button @click="showAddModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Nom de l'agence</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <input v-model="newAgency.name" type="text" class="w-full pl-9 pr-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 outline-none focus:border-[#2563EB] dark:text-white text-sm">
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Ville</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <input v-model="newAgency.location" type="text" class="w-full pl-9 pr-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 outline-none focus:border-[#2563EB] dark:text-white text-sm">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Email</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <input v-model="newAgency.email" type="email" class="w-full pl-9 pr-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 outline-none focus:border-[#2563EB] dark:text-white text-sm">
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Téléphone</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <input v-model="newAgency.phone" type="tel" class="w-full pl-9 pr-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 outline-none focus:border-[#2563EB] dark:text-white text-sm">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">IF</label>
                <input v-model="newAgency.if" type="text" class="w-full px-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 outline-none focus:border-[#2563EB] dark:text-white text-sm">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">RC</label>
                <input v-model="newAgency.rc" type="text" class="w-full px-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 outline-none focus:border-[#2563EB] dark:text-white text-sm">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Patente</label>
                <input v-model="newAgency.patente" type="text" class="w-full px-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 outline-none focus:border-[#2563EB] dark:text-white text-sm">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">ICE</label>
                <input v-model="newAgency.ice" type="text" class="w-full px-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 outline-none focus:border-[#2563EB] dark:text-white text-sm">
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
              <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Gérant Assigné</label>
              <select v-model="newAgency.gerantId" class="w-full px-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 outline-none focus:border-[#2563EB] dark:text-white text-sm">
                <option value="">Sélectionner un gérant...</option>
                <option v-for="user in eligibleGerants" :key="user.id" :value="user.id">
                  {{ user.firstName }} {{ user.lastName }} ({{ user.role }})
                </option>
              </select>
            </div>

            <!-- Balances -->
            <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-4">Soldes Initiaux</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Solde Espèce</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-green-500 text-sm font-bold">DH</span>
                    </div>
                    <input v-model="newAgency.initialEspece" type="number" step="0.01" class="w-full pl-10 pr-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 outline-none focus:border-green-500 dark:text-white text-sm">
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Solde Banque</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-blue-500 text-sm font-bold">DH</span>
                    </div>
                    <input v-model="newAgency.initialBanque" type="number" step="0.01" class="w-full pl-10 pr-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 outline-none focus:border-blue-500 dark:text-white text-sm">
                  </div>
                </div>
              </div>
            </div>


          </div>
          
          <div class="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1A1E29] flex gap-3">
            <button @click="handleCreate" class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#fa5b0f] text-[#fff] rounded-[8px] transition-colors font-bold border border-[#fa5b0f] hover:bg-transparent hover:text-[#fa5b0f]">Créer l'agence</button>
            <button @click="showAddModal = false" class="py-2.5 px-6 bg-white dark:bg-[#1C1F2B] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm font-medium">Annuler</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAgencyStore } from '../stores/agencyStore';
import { useTransactionStore } from '../stores/transactionStore';
import { useUserStore } from '../stores/userStore';

const router = useRouter();
const agencyStore = useAgencyStore();
const transactionStore = useTransactionStore();
const userStore = useUserStore();

const showAddModal = ref(false);
const searchQuery = ref('');
const newAgency = ref({ name: '', location: '', email: '', phone: '', initialEspece: 0, initialBanque: 0, if: '', rc: '', patente: '', ice: '', gerantId: '' });

const eligibleGerants = computed(() => {
  return userStore.users.filter(u => u.role === 'gérant' || u.role === 'employé' || u.role === 'agent');
});

const filteredAgencies = computed(() => {
  return agencyStore.agencies.filter(a => {
    // Hide distinct agencies if user is not admin
    if (!userStore.isAdmin && a.id !== userStore.currentAgencyId) return false;

    const q = String(searchQuery.value || '').toLowerCase();
    const name = String(a?.name || '').toLowerCase();
    const loc = String(a?.location || '').toLowerCase();
    const email = String(a?.email || '').toLowerCase();
    return name.includes(q) || loc.includes(q) || email.includes(q);
  });
});



const handleCreate = () => {
  if (!newAgency.value.name || !newAgency.value.location) return;

  const createdAgency = agencyStore.addAgency(
    newAgency.value.name, 
    newAgency.value.location,
    [],
    newAgency.value.initialEspece,
    newAgency.value.initialBanque
  );
  
  if(createdAgency) {
      createdAgency.email = newAgency.value.email;
      createdAgency.phone = newAgency.value.phone;
      createdAgency.if = newAgency.value.if;
      createdAgency.rc = newAgency.value.rc;
      createdAgency.patente = newAgency.value.patente;
      createdAgency.ice = newAgency.value.ice;
      createdAgency.gerantId = newAgency.value.gerantId;
      agencyStore.updateAgency(createdAgency);
      
      showAddModal.value = false;
      newAgency.value = { name: '', location: '', email: '', phone: '', initialEspece: 0, initialBanque: 0, if: '', rc: '', patente: '', ice: '', gerantId: '' };
      router.push(`/agencies/${createdAgency.id}`);
      return;
  }

  showAddModal.value = false;
  newAgency.value = { name: '', location: '', email: '', phone: '', initialEspece: 0, initialBanque: 0, if: '', rc: '', patente: '', ice: '', gerantId: '' };
};

const goToProfile = (id) => {
  router.push(`/agencies/${id}`);
};

const deleteAgency = (id) => {
   if(confirm("Êtes-vous sûr de vouloir supprimer cette agence ?")) {
       agencyStore.deleteAgency(id);
   }
}

onMounted(() => {
  agencyStore.initializeFromStorage();
  transactionStore.initializeFromStorage();
  userStore.initializeFromStorage();
});
</script>