<template>
  <div class="px-0 sm:px-6 py-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-screen font-[Inter]">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Contrats de Location</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ filteredContrats.length }} contrat(s) géré(s)</p>
        </div>
      </div>
      <router-link 
        to="/contrats/add" 
        class="flex items-center gap-2 px-4 py-2 bg-[#fa5b0f] text-[#fff] rounded-[8px] transition-colors font-bold border border-[#fa5b0f] hover:bg-transparent hover:text-[#fa5b0f]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Nouveau Contrat
      </router-link>
    </div>

    <!-- Controls Bar -->
    <div class="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <!-- Show entries -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
        <select v-model.number="itemsPerPage" @change="currentPage = 1" class="px-2 py-1.5 bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
        <span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
      </div>

      <!-- Search -->
      <div class="flex flex-1 max-w-2xl justify-end gap-3 w-full">
        <div class="relative w-full max-w-xs flex items-center justify-end gap-2">
          <label class="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Rechercher:</label>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="N°, Client, Voiture..."
            class="w-full px-3 py-1.5 bg-white dark:bg-[#1E2330] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f]"
          />
        </div>
      </div>
    </div>

    <div
      v-for="group in contratGroupsForDisplay"
      :key="group.id"
      class="bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm mb-6"
    >
      <div
        v-if="userStore.isAdmin"
        class="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#151923]"
      >
        <h3 class="text-sm font-bold text-gray-900 dark:text-white">
          Agence: {{ group.name }} ({{ group.contrats.length }})
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-[#151923] border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="px-6 py-4 font-bold">N° Contrat</th>
              <th class="px-6 py-4 font-bold">Client</th>
              <th class="px-6 py-4 font-bold">Véhicule</th>
              <th class="px-6 py-4 font-bold">Dates (Sortie - Retour)</th>
              <th class="px-6 py-4 font-bold">Total / Reste</th>
              <th class="px-6 py-4 font-bold">État</th>
              <th class="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contrat in group.contrats" :key="contrat.id" class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#151923]/50 transition-colors">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {{ contrat.numero }}
              </td>
              <td class="px-6 py-4 text-gray-600 dark:text-gray-300">
                <div class="font-medium text-gray-900 dark:text-white">{{ getClientName(contrat.clientId) }}</div>
              </td>
              <td class="px-6 py-4 text-gray-600 dark:text-gray-300">
                <div class="font-medium text-gray-900 dark:text-white">{{ getCarName(contrat.carId) }}</div>
              </td>
              <td class="px-6 py-4 text-gray-600 dark:text-gray-300">
                <div class="whitespace-nowrap">Du: {{ formatDate(contrat.dateSortie) }}</div>
                <div class="whitespace-nowrap">Au: {{ formatDate(contrat.dateRetour) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="font-bold text-gray-900 dark:text-white">{{ contrat.total }} DH</div>
                <div v-if="contrat.reste > 0" class="text-xs text-red-500 font-medium mt-1">Reste: {{ contrat.reste }} DH</div>
                <div v-else class="text-xs text-green-500 font-medium mt-1">Réglé</div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 text-xs font-bold rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500': contrat.etat === 'En cours',
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500': contrat.etat === 'Retournée',
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500': contrat.etat === 'Annulé'
                  }"
                >
                  {{ contrat.etat }}
                </span>
              </td>
              <td class="px-6 py-4 flex items-center justify-end gap-2">
                <button @click="printContrat(contrat.id)" class="px-2 py-1.5 text-blue-500 bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-700 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors whitespace-nowrap text-xs font-bold flex items-center gap-1">
                   <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                   Imprimer
                </button>
                <button v-if="contrat.etat === 'En cours'" @click="cloturerContrat(contrat)" class="px-2 py-1.5 text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 rounded-md hover:bg-[#10B981] hover:text-white transition-colors whitespace-nowrap text-xs font-bold flex items-center gap-1">
                   <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                   Clôturer & Encaisser
                </button>
                <button v-if="contrat.etat === 'En cours'" @click="openProlongation(contrat)" class="px-2 py-1.5 text-blue-600 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap text-xs font-bold flex items-center gap-1">
                   <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   Prolonger
                </button>
                <button @click="deleteContrat(contrat.id)" class="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="paginatedContrats.length === 0" class="bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm mb-6">
      <div class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
        <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        Aucun contrat ne correspond à votre recherche.
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="px-6 py-4 flex items-center justify-between border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#1C1F2B]">
      <span class="text-sm text-gray-600 dark:text-gray-400">
        Affichage {{ (currentPage - 1) * itemsPerPage + 1 }} à {{ Math.min(currentPage * itemsPerPage, filteredContrats.length) }} sur {{ filteredContrats.length }} entrées
      </span>
      <div class="flex items-center gap-1">
        <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded disabled:opacity-50 transition-colors">Précédent</button>
        <button
          v-for="page in totalPages" :key="page"
          @click="currentPage = page"
          class="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded transition-colors"
          :class="currentPage === page ? 'bg-[#fa5b0f] text-white border-[#fa5b0f]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'"
        >
          {{ page }}
        </button>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded disabled:opacity-50 transition-colors">Suivant</button>
      </div>
    </div>
    </div>

    <!-- Return Modal -->
    <div v-if="showReturnModal && selectedReturnContrat" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
       <div class="bg-white dark:bg-[#1E2330] rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 flex flex-col">
          <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-[#1E2330] z-10">
             <h3 class="text-xl font-bold dark:text-white">Clôturer Contrat {{ selectedReturnContrat.numero }}</h3>
             <button @click="closeReturnModal" class="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
             </button>
          </div>
          
          <div class="p-6 flex-1">
             <!-- Return Telemetry Grid -->
             <div class="grid grid-cols-2 gap-6 mb-6">
                <div>
                   <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kilométrage de Retour</label>
                   <input v-model.number="returnForm.kmRetour" type="number" class="w-full px-4 py-2 bg-[#F3F4F6] dark:bg-[#151923] dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg text-sm" />
                </div>
                <div>
                   <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Carburant de Retour</label>
                   <select v-model="returnForm.carburantRetour" class="w-full px-4 py-2 bg-[#F3F4F6] dark:bg-[#151923] dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg text-sm">
                      <option value="reserve">Réserve</option>
                      <option value="1/4">1/4</option>
                      <option value="1/2">1/2</option>
                      <option value="3/4">3/4</option>
                      <option value="plein">Plein</option>
                   </select>
                </div>
             </div>

             <!-- Vehicle Return Damage Map -->
             <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">État du Véhicule au Retour</h4>
             <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">Pointez sur la carrosserie pour identifier de potentiels nouveaux dégâts (Le schéma initial sera conservé à part pour comparaison).</p>
             <div class="bg-gray-50 flex justify-center py-4 border border-gray-200 rounded-lg max-w-lg mx-auto mb-6">
                <CarDamageMap v-model="returnForm.retourDamages" />
             </div>
             
             <!-- Early return billing choice -->
             <div v-if="returnIsEarly" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
                <h4 class="text-sm font-bold text-gray-800 dark:text-white mb-2">Retour anticipé</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">
                   La date de retour prévue ({{ formatReturnDateDisplay(selectedReturnContrat.dateRetour) }}) est postérieure à aujourd'hui.
                   Choisissez la période à facturer :
                </p>
                <div class="space-y-3">
                   <label class="flex items-start gap-2 cursor-pointer">
                      <input type="radio" value="full" v-model="returnMode" class="mt-1" />
                      <span class="text-sm text-gray-700 dark:text-gray-300">
                         <span class="font-bold">Période complète du contrat</span>
                         <span class="block text-xs text-gray-500 dark:text-gray-400">Total {{ selectedReturnContrat.total }} DH — reste à payer {{ selectedReturnContrat.reste }} DH</span>
                      </span>
                   </label>
                   <label class="flex items-start gap-2 cursor-pointer">
                      <input type="radio" value="today" v-model="returnMode" class="mt-1" />
                      <span class="text-sm text-gray-700 dark:text-gray-300">
                         <span class="font-bold">Clôturer aujourd'hui</span>
                         <span class="block text-xs text-gray-500 dark:text-gray-400">{{ returnUsedDays }} jour(s) × {{ returnDailyRate }} DH = {{ returnRecalculatedTotal }} DH — reste à payer {{ returnTodayReste }} DH</span>
                      </span>
                   </label>
                </div>
             </div>

             <!-- Financial Sum up -->
             <div class="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-500/20 rounded-lg">
                <p class="font-bold text-gray-800 dark:text-white">Reste à payer : <span class="text-[#fa5b0f] text-xl">{{ returnAmountToCollect }} DH</span></p>
                <p v-if="returnIsEarly && returnMode === 'today'" class="text-xs text-gray-600 dark:text-gray-400 mt-1">Total recalculé pour {{ returnUsedDays }} jour(s). La date de retour sera fixée à aujourd'hui.</p>
                <p v-else class="text-xs text-gray-600 dark:text-gray-400 mt-1">L'encaissement de ce solde sera généré automatiquement.</p>
             </div>
          </div>
          
           <div class="p-4 bg-gray-50 dark:bg-[#151923] flex justify-end gap-3 border-t border-gray-200 dark:border-gray-800 mt-auto">
             <button @click="closeReturnModal" class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg text-sm font-bold">Annuler</button>
             <button @click="executeReturn" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">Valider & Encaisser</button>
          </div>
       </div>
    </div>

    <!-- Prolongation Modal -->
    <div v-if="showProlongationModal && selectedProlongationContrat" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
       <div class="bg-white dark:bg-[#1E2330] rounded-xl shadow-2xl max-w-lg w-full flex flex-col border border-gray-200 dark:border-gray-800">
          <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
             <h3 class="text-xl font-bold dark:text-white">Prolonger Contrat {{ selectedProlongationContrat.numero }}</h3>
             <button @click="closeProlongationModal" class="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          <div class="p-6 space-y-4">
             <!-- Current Info -->
             <div class="p-3 bg-gray-50 dark:bg-black/20 rounded-lg text-sm mb-4">
                <div class="flex justify-between mb-1">
                   <span class="text-gray-500 dark:text-gray-400">Date de Retour Actuelle</span>
                   <span class="font-bold dark:text-gray-300">{{ formatReturnDateDisplay(selectedProlongationContrat.dateRetour) }}</span>
                </div>
                <div class="flex justify-between">
                   <span class="text-gray-500 dark:text-gray-400">Reste à payer actuel</span>
                   <span class="font-bold dark:text-gray-300">{{ selectedProlongationContrat.reste }} DH</span>
                </div>
             </div>

             <!-- Form -->
             <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nouvelle Date de Retour</label>
                <input v-model="prolongationForm.nouvelleDate" type="datetime-local" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-[#fa5b0f] focus:outline-none" />
             </div>
             <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix Journalier de Prolongation (DH)</label>
                <input v-model.number="prolongationForm.prixParJour" type="number" step="10" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-[#fa5b0f] focus:outline-none" />
             </div>

             <!-- Summary Calculations -->
             <div v-if="prolongationDays > 0" class="mt-6 p-4 border border-[#fa5b0f]/30 bg-[#fa5b0f]/5 rounded-lg">
                <h4 class="text-sm font-bold text-[#fa5b0f] mb-3">Résumé de la Prolongation</h4>
                <div class="flex justify-between text-sm mb-2">
                   <span class="text-gray-600 dark:text-gray-400">Jours ajoutés</span>
                   <span class="font-bold dark:text-white">+ {{ prolongationDays }} jours</span>
                </div>
                <div class="flex justify-between text-sm mb-2">
                   <span class="text-gray-600 dark:text-gray-400">Coût de la prolongation</span>
                   <span class="font-bold dark:text-white">+ {{ prolongationCost }} DH</span>
                </div>
                <div class="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                <div class="flex justify-between text-base">
                   <span class="font-bold text-gray-800 dark:text-white">Nouveau Reste à Payer</span>
                   <span class="font-bold text-[#fa5b0f]">{{ newResteTotal }} DH</span>
                </div>
             </div>
             <div v-else-if="prolongationForm.nouvelleDate" class="text-sm text-red-500 text-center font-bold">
                La nouvelle date doit être ultérieure à la date de retour actuelle.
             </div>
          </div>
          
          <div class="p-4 bg-gray-50 dark:bg-[#151923] flex justify-end gap-3 rounded-b-xl border-t border-gray-200 dark:border-gray-800">
             <button @click="closeProlongationModal" class="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg text-sm font-bold shadow-sm">Annuler</button>
             <button @click="submitProlongation" :disabled="prolongationDays <= 0" class="px-5 py-2.5 bg-[#fa5b0f] hover:bg-[#eb4b05] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold shadow-sm transition-colors">Valider la Prolongation</button>
          </div>
       </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useContratStore } from '../stores/contratStore'
import { useClientStore } from '../stores/clientStore'
import { useCarStore } from '../stores/carStore'
import { useTransactionStore } from '../stores/transactionStore'
import { useAgencyStore } from '../stores/agencyStore'
import { useUserStore } from '../stores/userStore'
import CarDamageMap from '../components/CarDamageMap.vue'

const router = useRouter()
const contratStore = useContratStore()
const clientStore = useClientStore()
const carStore = useCarStore()
const transactionStore = useTransactionStore()
const agencyStore = useAgencyStore()
const userStore = useUserStore()

const searchQuery = ref('')
const itemsPerPage = ref(10)
const currentPage = ref(1)

const filteredContrats = computed(() => {
   let result = [...contratStore.filteredContrats].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
   
   if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(c => {
         const clientName = (getClientName(c.clientId) || '').toLowerCase()
         const carName = (getCarName(c.carId) || '').toLowerCase()
         const num = (c.numero || '').toLowerCase()
         return num.includes(q) || clientName.includes(q) || carName.includes(q)
      })
   }
   
   return result
})

const totalPages = computed(() => Math.ceil(filteredContrats.value.length / itemsPerPage.value))

const paginatedContrats = computed(() => {
   const start = (currentPage.value - 1) * itemsPerPage.value
   const end = start + itemsPerPage.value
   return filteredContrats.value.slice(start, end)
})

const contratGroupsForDisplay = computed(() => {
   const contrats = paginatedContrats.value || []

   if (!userStore.isAdmin) {
      return [{ id: 'all-contrats', name: 'Tous les contrats', contrats }]
   }

   const groups = new Map()
   contrats.forEach(contrat => {
      const agencyId = contrat.agencyId || 'unassigned'
      const agencyName = getAgencyName(contrat.agencyId)
      if (!groups.has(agencyId)) {
         groups.set(agencyId, {
            id: agencyId,
            name: agencyName,
            contrats: []
         })
      }
      groups.get(agencyId).contrats.push(contrat)
   })

   return Array.from(groups.values()).sort((a, b) =>
      a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
   )
})

const getClientName = (clientId) => {
   const c = clientStore.clients.find(x => x.id === clientId || x.nationalId === clientId)
   return c ? `${c.firstName} ${c.lastName}` : 'Client inconnu'
}

const getCarName = (carId) => {
   const c = carStore.cars.find(x => x.id === carId)
   return c ? `${c.licensePlate} (${c.name})` : 'Véhicule supprimé'
}

const getAgencyName = (agencyId) => {
   const agency = agencyStore.agencies.find(a => a.id === agencyId)
   return agency ? agency.name : 'Agence non assignée'
}

const formatDate = (dateStr) => {
   if (!dateStr) return '';
   return new Date(dateStr).toLocaleString('fr-FR', { 
     day: '2-digit', month: '2-digit', year: 'numeric',
     hour: '2-digit', minute: '2-digit'
   })
}

const printContrat = (id) => {
   router.push(`/contrats/${id}/print`)
}

const deleteContrat = (id) => {
   if (confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) {
      contratStore.deleteContrat(id)
   }
}

const showReturnModal = ref(false)
const selectedReturnContrat = ref(null)
const returnForm = ref({
   kmRetour: 0,
   carburantRetour: 'reserve',
   retourDamages: []
})
const returnMode = ref('full')        // 'full' = whole contracted period, 'today' = close today
const returnClosedAt = ref(new Date()) // stable "today" timestamp for this closure

const DAY_MS = 24 * 60 * 60 * 1000

const returnIsEarly = computed(() => {
   const end = selectedReturnContrat.value?.dateRetour
   if (!end) return false
   const endTime = new Date(end).getTime()
   if (Number.isNaN(endTime)) return false
   return returnClosedAt.value.getTime() < endTime
})

const returnDailyRate = computed(() => {
   const contrat = selectedReturnContrat.value
   if (!contrat) return 0
   const rate = Number(contrat.prixParJour)
   if (rate > 0) return rate
   const duree = Number(contrat.duree)
   return duree > 0 ? (Number(contrat.total) || 0) / duree : 0
})

const returnUsedDays = computed(() => {
   const contrat = selectedReturnContrat.value
   if (!contrat) return 0
   const startTime = new Date(contrat.dateSortie).getTime()
   if (Number.isNaN(startTime)) return Number(contrat.duree) || 0
   const diff = returnClosedAt.value.getTime() - startTime
   if (diff <= 0) return 0
   return Math.ceil(diff / DAY_MS)
})

const returnRecalculatedTotal = computed(() => returnUsedDays.value * returnDailyRate.value)

const returnTodayReste = computed(() => {
   const contrat = selectedReturnContrat.value
   if (!contrat) return 0
   return Math.max(0, returnRecalculatedTotal.value - (Number(contrat.avance) || 0))
})

const returnAmountToCollect = computed(() => {
   const contrat = selectedReturnContrat.value
   if (!contrat) return 0
   if (returnIsEarly.value && returnMode.value === 'today') {
      return returnTodayReste.value
   }
   return Number(contrat.reste) || 0
})

const cloturerContrat = (contrat) => {
   selectedReturnContrat.value = contrat
   returnClosedAt.value = new Date()
   returnMode.value = 'full'
   const defaultDamages = Array.isArray(contrat.departDamages) ? [...contrat.departDamages] : []
   returnForm.value = {
      kmRetour: contrat.kmDepart || 0,
      carburantRetour: "reserve",
      retourDamages: (Array.isArray(contrat.retourDamages) && contrat.retourDamages.length > 0) 
                     ? [...contrat.retourDamages] 
                     : defaultDamages
   }
   showReturnModal.value = true
}

const closeReturnModal = () => {
   showReturnModal.value = false
   selectedReturnContrat.value = null
}

const executeReturn = async () => {
   const contrat = selectedReturnContrat.value
   const closeToday = returnIsEarly.value && returnMode.value === 'today'
   const amountToCollect = returnAmountToCollect.value
   const settledTotal = closeToday ? returnRecalculatedTotal.value : (Number(contrat.total) || 0)
   
   if (amountToCollect > 0) {
       transactionStore.addTransaction({
           agencyId: contrat.agencyId,
           type: 'revenue',
           amount: amountToCollect,
           method: contrat.typePaiement === 'Espèces' ? 'espece' : 'banque',
           description: `Solde Final Restant - Contrat ${contrat.numero}`
       })
   }
   
   const updated = {
       ...contrat,
       etat: 'Retournée',
       avance: settledTotal,
       reste: 0,
       kmRetour: returnForm.value.kmRetour,
       carburantRetour: returnForm.value.carburantRetour,
       retourDamages: returnForm.value.retourDamages,
       ...(closeToday
          ? {
               dateRetour: returnClosedAt.value.toISOString(),
               duree: returnUsedDays.value,
               total: returnRecalculatedTotal.value
            }
          : {})
   }
   
   // Sync the vehicle's permanent damage state and mileage
   if (contrat.carId) {
       const car = carStore.cars.find(c => c.id === contrat.carId)
       if (car) {
           await carStore.updateCar({
               ...car,
               damages: [...returnForm.value.retourDamages],
               currentDamages: [...returnForm.value.retourDamages], // keeping for retro-compatibility if needed anywhere
               currentMileage: Math.max(car.currentMileage || car.mileage || 0, returnForm.value.kmRetour),
               mileage: Math.max(car.mileage || car.currentMileage || 0, returnForm.value.kmRetour),
               status: 'Available'
           })
       }
   }
   
   contratStore.updateContrat(updated)
   closeReturnModal()
}

// ==== PROLONGATION LOGIC ====
const formatReturnDateDisplay = (isoStr) => {
   if (!isoStr) return ''
   return new Date(isoStr).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
}

const showProlongationModal = ref(false)
const selectedProlongationContrat = ref(null)
const prolongationForm = ref({
   nouvelleDate: '',
   prixParJour: 0
})

const openProlongation = (contrat) => {
   selectedProlongationContrat.value = contrat
   
   // Default date to +1 day from current return date (fallback to today if invalid)
   const parsedReturnDate = new Date(contrat.dateRetour)
   const fallback = new Date()
   const currentDate = isNaN(parsedReturnDate.getTime()) ? fallback : parsedReturnDate
   currentDate.setDate(currentDate.getDate() + 1)
   
   // Keep local timezone formatting for datetime-local input
   const tzOffset = currentDate.getTimezoneOffset() * 60000
   const localISOTime = (new Date(currentDate - tzOffset)).toISOString().slice(0, 16)
   
   prolongationForm.value = {
      nouvelleDate: localISOTime,
      prixParJour: contrat.prixParJour || 0
   }
   showProlongationModal.value = true
}

const closeProlongationModal = () => {
   showProlongationModal.value = false
   selectedProlongationContrat.value = null
}

const prolongationDays = computed(() => {
   if (!selectedProlongationContrat.value || !prolongationForm.value.nouvelleDate) return 0
   const oldDate = new Date(selectedProlongationContrat.value.dateRetour)
   if (isNaN(oldDate.getTime())) return 0
   const oldTime = oldDate.getTime()
   const newTime = new Date(prolongationForm.value.nouvelleDate).getTime()
   if (isNaN(newTime) || newTime <= oldTime) return 0
   
   return Math.ceil((newTime - oldTime) / (1000 * 3600 * 24))
})

const prolongationCost = computed(() => {
   return prolongationDays.value * (prolongationForm.value.prixParJour || 0)
})

const newResteTotal = computed(() => {
   if (!selectedProlongationContrat.value) return 0
   return (Number(selectedProlongationContrat.value.reste) || 0) + prolongationCost.value
})

const submitProlongation = () => {
   if (prolongationDays.value <= 0) return
   
   const contrat = selectedProlongationContrat.value
   const prolongationsExistantes = Array.isArray(contrat.prolongations) ? [...contrat.prolongations] : []
   
   // Append audit record
   prolongationsExistantes.push({
      dateAction: new Date().toISOString(),
      oldDateRetour: contrat.dateRetour,
      newDateRetour: prolongationForm.value.nouvelleDate,
      joursAjoutes: prolongationDays.value,
      prixJournalier: prolongationForm.value.prixParJour,
      coutTotal: prolongationCost.value
   })

   const updated = {
      ...contrat,
      dateRetour: prolongationForm.value.nouvelleDate,
      duree: (Number(contrat.duree) || 0) + prolongationDays.value,
      total: (Number(contrat.total) || 0) + prolongationCost.value,
      reste: newResteTotal.value,
      prolongations: prolongationsExistantes
   }
   
   contratStore.updateContrat(updated)
   closeProlongationModal()
}

agencyStore.initializeFromStorage()
</script>
