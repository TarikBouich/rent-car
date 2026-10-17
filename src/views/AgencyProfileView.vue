<template>
    <div class="px-0 sm:px-6 py-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-screen text-gray-800 dark:text-gray-200">

      <!-- Toast Notification -->
      <transition name="slide-down">
        <div v-if="notification.show" :class="[
          'fixed top-6 right-6 z-[100] px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md animate-fadeIn',
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        ]">
          <svg v-if="notification.type === 'success'" class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <span class="flex-1 font-medium">{{ notification.message }}</span>
          <button @click="notification.show = false" class="text-white hover:opacity-75">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </transition>

      <!-- Document Viewer Modal -->
      <div v-if="showDocModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
        <div class="relative bg-white dark:bg-[#1C1F2B] w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
          <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ viewingDocument?.agencyType }}</h3>
            <button @click="showDocModal = false" class="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="p-4 flex-1 overflow-auto flex items-center justify-center bg-gray-100 dark:bg-[#151923]">
            <img v-if="isImage(viewingDocument?.type)" :src="viewingDocument?.dataUrl" class="max-w-full max-h-[70vh] object-contain rounded" />
            <iframe v-else-if="viewingDocument?.type?.toUpperCase() === 'PDF'" :src="viewingDocument?.dataUrl" class="w-full h-[75vh] border-0 rounded bg-white"></iframe>
            <div v-else class="text-center text-gray-500 p-8">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <p>Aperçu non disponible pour ce type de fichier ({{ viewingDocument?.type }}).</p>
              <button @click="downloadDocument(viewingDocument?.agencyType)" class="mt-4 px-6 py-2 bg-[#fa5b0f] text-white rounded-lg hover:bg-orange-600 transition-colors">
                Télécharger le fichier
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div class="flex items-center gap-4">
          <button
            v-if="!isAgencyRestrictedRole"
            @click="router.push('/agencies')"
            class="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 class="text-2xl font-bold">Fiche d'Agence : <span class="text-blue-500">{{ agency?.name }}</span></h1>
        </div>
        <div v-if="!isAgencyRestrictedRole" class="flex gap-3">
          <button @click="updateAgency" class="flex items-center gap-2 px-4 py-2 bg-[#fa5b0f] text-[#fff] rounded-[8px] transition-colors font-bold border border-[#fa5b0f] hover:bg-transparent hover:text-[#fa5b0f]">Enregistrer</button>
          <button class="px-6 py-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-600 hover:text-white transition-all">Supprimer</button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 overflow-x-auto">
        
        <div :class="isAgencyRestrictedRole ? 'lg:col-span-12 space-y-6' : 'lg:col-span-7 space-y-6'">
          <div v-if="!isAgencyRestrictedRole" class="bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div class="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
              <h2 class="text-lg font-semibold">Informations Générales</h2>
              <span class="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs font-bold uppercase">Active</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Nom de l'agence</label>
                <input v-model="agency.name" type="text" class="w-full bg-[#F3F4F6] dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none dark:text-white">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Ville</label>
                <input v-model="agency.location" type="text" class="w-full bg-[#F3F4F6] dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none dark:text-white">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Téléphone</label>
                <input v-model="agencyForm.phone" type="text" class="w-full bg-[#F3F4F6] dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none dark:text-white">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Email</label>
                <input v-model="agencyForm.email" type="email" class="w-full bg-[#F3F4F6] dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none dark:text-white">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">IDENTIFIANT FISCAL (IF)</label>
                <input v-model="agencyForm.if" type="text" class="w-full bg-[#F3F4F6] dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none dark:text-white">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">REGISTRE DE COMMERCE (RC)</label>
                <input v-model="agencyForm.rc" type="text" class="w-full bg-[#F3F4F6] dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none dark:text-white">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Numéro Patente</label>
                <input v-model="agencyForm.patente" type="text" class="w-full bg-[#F3F4F6] dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none dark:text-white">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Numéro ICE</label>
                <input v-model="agencyForm.ice" type="text" class="w-full bg-[#F3F4F6] dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none dark:text-white">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase font-bold text-green-500">Solde Initial Espèce (DH)</label>
                <input v-model.number="agencyForm.initialEspece" type="number" step="0.01" class="w-full bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50 rounded-lg px-4 py-2.5 focus:border-green-500 outline-none dark:text-white font-bold text-green-700 dark:text-green-400">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase font-bold text-blue-500">Solde Initial Banque (DH)</label>
                <input v-model.number="agencyForm.initialBanque" type="number" step="0.01" class="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none dark:text-white font-bold text-blue-700 dark:text-blue-400">
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Gérant Assigné</label>
                <select v-model="agencyForm.managerId" class="w-full bg-[#F3F4F6] dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none dark:text-white appearance-none">
                  <option value="">-- Sélectionner un gérant --</option>
                  <option v-for="user in userStore.users" :key="user.id" :value="user.id">{{ user.name }} ({{ user.role }})</option>
                </select>
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Adresse Complète</label>
                <textarea v-model="agencyForm.address" rows="2" class="w-full bg-[#F3F4F6] dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none dark:text-white"></textarea>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 class="text-lg font-semibold mb-4">Documents de l'agence</h2>
            <div class="space-y-3">
              <div v-for="docType in ['Logo', 'Cachet', 'Conditions Générales', 'En-tête']" :key="docType" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-[#F3F4F6] dark:bg-[#151923] border border-gray-200 dark:border-gray-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium">{{ docType }}</span>
                  <span v-if="getDocumentByType(docType)" class="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded truncate max-w-[120px]">
                    {{ getDocumentByType(docType).name }}
                  </span>
                  <span v-else class="text-xs text-gray-500 dark:text-gray-400 italic">Aucun fichier</span>
                </div>
                <div class="flex gap-2 relative">
                  <!-- Hidden File Input -->
                  <input 
                    type="file" 
                    :id="'file-' + docType"
                    class="hidden" 
                    @change="(e) => handleSpecificFileUpload(e, docType)"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  >
                  <!-- Upload Button -->
                  <button @click="triggerFileInput(docType)" class="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded tooltip-wrapper" title="Importer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  </button>
                  <!-- View Button (Only if exists) -->
                  <button v-if="getDocumentByType(docType)" @click="viewDocument(docType)" class="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded tooltip-wrapper" title="Voir">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                  <!-- Download Button (Only if exists) -->
                  <button v-if="getDocumentByType(docType)" @click="downloadDocument(docType)" class="p-1.5 hover:bg-emerald-500/10 text-emerald-500 rounded tooltip-wrapper" title="Télécharger">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  </button>
                  <!-- Delete Button (Only if exists) -->
                  <button v-if="getDocumentByType(docType)" @click="deleteDocument(docType)" class="p-1.5 hover:bg-red-500/10 text-red-500 rounded tooltip-wrapper" title="Supprimer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isAgencyRestrictedRole" class="lg:col-span-5 space-y-6">
          
          <div class="bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 class="text-lg font-semibold mb-6">Rentabilité & Statistiques</h2>
            
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="text-center p-3 bg-[#F3F4F6] dark:bg-[#151923] rounded-lg">
                <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Clients</p>
                <p class="text-xl font-bold">{{ agencyClientsCount }}</p>
              </div>
              <div class="text-center p-3 bg-[#F3F4F6] dark:bg-[#151923] rounded-lg">
                <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Locations</p>
                <p class="text-xl font-bold">{{ agencyContratsCount }}</p>
              </div>
              <div class="text-center p-3 bg-[#F3F4F6] dark:bg-[#151923] rounded-lg">
                <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Voitures</p>
                <p class="text-xl font-bold">{{ agencyCars.length }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                <span class="text-sm font-medium text-emerald-500">Revenus Totaux</span>
                <span class="text-lg font-black text-emerald-500">{{ agencyRevenue.toLocaleString() }} DH</span>
              </div>
              <div class="flex justify-between items-center p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                <span class="text-sm font-medium text-red-500">Dépenses Totales</span>
                <span class="text-lg font-black text-red-500">{{ agencyExpenses.toLocaleString() }} DH</span>
              </div>
              <div class="p-4 bg-[#fa5b0f] rounded-xl text-center">
                <p class="text-xs text-white dark:text-white uppercase font-bold mb-1">Bénéfice Net</p>
                <p class="text-2xl font-black text-white dark:text-white">{{ (agencyRevenue - agencyExpenses).toLocaleString() }} DH</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div v-for="section in ['Employés', 'Voitures']" :key="section" class="bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <button @click="toggleSection(section)" class="w-full flex items-center justify-between p-4 hover:bg-[#252a3a] transition-colors">
                <span class="font-bold">{{ section }} [{{ getCount(section) }}]</span>
                <svg :class="{'rotate-180': openSections.includes(section)}" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div v-if="openSections.includes(section)" class="p-4 border-t border-gray-200 dark:border-gray-800 bg-[#F3F4F6] dark:bg-[#151923]">
                 <div v-if="getCount(section) > 0" class="text-xs text-gray-600 dark:text-gray-400">
                    <div v-for="item in getItems(section)" :key="item.id" class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800 last:border-0">
                      <span>{{ item.name || item.brand }}</span>
                      <span class="text-blue-500 font-medium">Détails</span>
                    </div>
                 </div>
                 <p v-else class="text-center py-4 text-xs text-gray-500 dark:text-gray-400">Aucun(e) {{ section.toLowerCase() }} associé(e)</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import { useCarStore } from '../stores/carStore';
import { useAgencyStore } from '../stores/agencyStore';
import { useClientStore } from '../stores/clientStore';
import { useContratStore } from '../stores/contratStore';
import { useTransactionStore } from '../stores/transactionStore';
import NewDefaultLayout from '../layouts/NewDefaultLayout.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const carStore = useCarStore();
const agencyStore = useAgencyStore();
const clientStore = useClientStore();
const contratStore = useContratStore();
const transactionStore = useTransactionStore();

const agency = ref({ name: '', location: '' });
const agencyForm = ref({ address: '', phone: '', email: '', if: '', rc: '', patente: '', ice: '', managerId: '', initialEspece: 0, initialBanque: 0 });
const openSections = ref(['Voitures']); // Keep Voitures open by default
const showDocModal = ref(false);
const viewingDocument = ref(null);
const notification = ref({ show: false, message: '', type: 'success' });
const normalizeRole = (role) =>
  String(role || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const isAgencyRestrictedRole = computed(() => {
  const role = normalizeRole(userStore.currentUser?.role);
  return role === 'gerant' || role === 'employe' || role === 'agent';
});

const agencyCars = computed(() => carStore.filteredCars.filter(car => car.agencyId === route.params.id));
const agencyAgents = computed(() => userStore.users.filter(user => user.agencyId === route.params.id));

const agencyClientsCount = computed(() => {
  return clientStore.clients.filter(c => c.agencyId === route.params.id).length;
});

const agencyContratsCount = computed(() => {
  return contratStore.contrats.filter(c => c.agencyId === route.params.id).length;
});

const agencyRevenue = computed(() => {
  return transactionStore.transactions
    .filter(t => t.agencyId === route.params.id && t.type === 'revenue')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const agencyExpenses = computed(() => {
  return transactionStore.transactions
    .filter(t => t.agencyId === route.params.id && t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const toggleSection = (section) => {
  if (openSections.value.includes(section)) {
    openSections.value = openSections.value.filter(s => s !== section);
  } else {
    openSections.value.push(section);
  }
};

const getCount = (section) => {
  if (section === 'Voitures') return agencyCars.value.length;
  if (section === 'Employés') return agencyAgents.value.length;
  return 0;
};

const getItems = (section) => {
    if (section === 'Voitures') return agencyCars.value;
    return agencyAgents.value;
}

const loadAgency = () => {
  const ownAgencyId = userStore.userAgencyId;
  if (isAgencyRestrictedRole.value) {
    if (!ownAgencyId) {
      router.replace('/cars');
      return;
    }
    if (route.params.id !== ownAgencyId) {
      router.replace(`/agencies/${ownAgencyId}`);
      return;
    }
  }

  const found = agencyStore.getAgencyById(route.params.id);
  if (found) {
    agency.value = found;
    agencyForm.value = { 
        address: found.address || '', 
        phone: found.phone || '',
        email: found.email || '',
        if: found.if || '',
        rc: found.rc || '',
        patente: found.patente || '',
        ice: found.ice || '',
        managerId: found.managerId || '',
        initialEspece: found.initialEspece || 0,
        initialBanque: found.initialBanque || 0
    };
  } else {
    if (isAgencyRestrictedRole.value && ownAgencyId) {
      router.replace(`/agencies/${ownAgencyId}`);
      return;
    }
    router.push('/agencies');
  }
};

const updateAgency = () => {
  try {
    const updated = { ...agency.value, ...agencyForm.value };
    agencyStore.updateAgency(updated);
    agency.value = { ...updated };

    // Show success notification
    notification.value = {
      show: true,
      message: 'Agence mise à jour avec succès',
      type: 'success'
    };

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      notification.value.show = false;
    }, 3000);
  } catch (error) {
    // Show error notification
    notification.value = {
      show: true,
      message: error.message || 'Une erreur est survenue lors de la mise à jour',
      type: 'error'
    };

    // Auto-hide notification after 4 seconds
    setTimeout(() => {
      notification.value.show = false;
    }, 4000);
  }
};

// Document Management Handlers
const getDocumentByType = (type) => {
  if (!agency.value.documents || !Array.isArray(agency.value.documents)) return null;
  // Look for a document matching the pseudo-type or filename tag
  return agency.value.documents.find(doc => doc.agencyType === type);
};

const triggerFileInput = (docType) => {
  const fileInput = document.getElementById('file-' + docType);
  if (fileInput) fileInput.click();
};

const handleSpecificFileUpload = (event, docType) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    if (!Array.isArray(agency.value.documents)) {
      agency.value.documents = [];
    }

    // Remove existing file of this type if it already exists
    agency.value.documents = agency.value.documents.filter(doc => doc.agencyType !== docType);

    // Add new document
    const newDoc = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.name.split('.').pop().toUpperCase(),
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
      date: new Date().toLocaleDateString('fr-FR'),
      dataUrl: e.target.result,
      agencyType: docType // Tags this as 'Logo', 'Cachet', etc.
    };
    
    agency.value.documents.push(newDoc);
    
    // Auto-save the agency after a document is uploaded
    updateAgency();
    
    // Clear the input so the same file could be uploaded again if needed
    event.target.value = null;
  };
  reader.readAsDataURL(file);
};

const downloadDocument = (docType) => {
  const doc = getDocumentByType(docType);
  if (!doc) return;

  const link = document.createElement('a');
  link.href = doc.dataUrl;
  link.download = doc.name || `${docType}_document.${doc.type.toLowerCase()}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const viewDocument = (docType) => {
  const doc = getDocumentByType(docType);
  if (doc) {
    viewingDocument.value = doc;
    showDocModal.value = true;
  }
};

const isImage = (type) => {
  if (!type) return false;
  return ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF'].includes(type.toUpperCase());
};

const deleteDocument = (docType) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${docType}?`)) {
    if (agency.value.documents) {
      agency.value.documents = agency.value.documents.filter(doc => doc.agencyType !== docType);
      updateAgency();
    }
  }
};

onMounted(async () => {
  await Promise.all([
    agencyStore.initializeFromStorage(),
    carStore.initializeFromStorage(),
    userStore.initializeFromStorage()
  ]);
  loadAgency();
});
</script>

<style scoped>
@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.slide-down-enter-active {
  animation: slideDown 0.3s ease-out;
}

.slide-down-leave-active {
  animation: slideDown 0.3s ease-out reverse;
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
