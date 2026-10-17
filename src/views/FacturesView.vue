<template>
  <div class="px-0 sm:px-6 py-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Factures</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Créez, consultez et téléchargez vos factures</p>
      </div>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2 bg-[#fa5b0f] text-white rounded-[8px] transition-colors font-bold border border-[#fa5b0f] hover:bg-transparent hover:text-[#fa5b0f]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Nouvelle Facture
      </button>
    </div>

    <div class="mb-6 flex justify-end">
      <div class="relative w-full max-w-sm flex items-center gap-2">
        <label class="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Rechercher:</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="N°, client, véhicule"
          class="w-full px-3 py-2 bg-white dark:bg-[#1E2330] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]"
        />
      </div>
    </div>

    <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 dark:bg-[#151923] border-b border-gray-200 dark:border-gray-800 text-xs uppercase text-gray-600 dark:text-gray-400">
            <tr>
              <th class="px-4 py-3 font-bold">N° Facture</th>
              <th class="px-4 py-3 font-bold">Client</th>
              <th class="px-4 py-3 font-bold">Véhicule</th>
              <th class="px-4 py-3 font-bold">Agence</th>
              <th class="px-4 py-3 font-bold">Date</th>
              <th class="px-4 py-3 font-bold text-right">Total TTC</th>
              <th class="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="facture in filteredFactures"
              :key="facture.id"
              class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#151923]/40"
            >
              <td class="px-4 py-3 font-semibold text-gray-900 dark:text-white">{{ facture.numero }}</td>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ getFactureClientName(facture) }}</td>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ getFactureCarName(facture) }}</td>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ getFactureAgencyName(facture) }}</td>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-300">{{ formatDateTime(facture.issueDate) }}</td>
              <td class="px-4 py-3 text-right font-bold text-[#1d4ed8]">{{ formatMAD(facture.totals?.totalTTC || 0) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openPreview(facture)" class="px-2 py-1.5 text-xs font-bold rounded border border-blue-200 text-blue-600 hover:bg-blue-50">Voir</button>
                  <button @click="downloadFacture(facture)" class="px-2 py-1.5 text-xs font-bold rounded border border-emerald-200 text-emerald-600 hover:bg-emerald-50">Télécharger</button>
                  <button @click="deleteFacture(facture.id)" class="px-2 py-1.5 text-xs font-bold rounded border border-red-200 text-red-600 hover:bg-red-50">Supprimer</button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredFactures.length === 0">
              <td colspan="7" class="px-4 py-10 text-center text-gray-500 dark:text-gray-400">Aucune facture disponible.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="isCreateModalOpen" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-5xl max-h-[92vh] overflow-y-auto">
        <div class="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Créer une Facture</h3>
          <button @click="isCreateModalOpen = false" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div class="p-5 space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contrat (optionnel)</label>
              <select v-model="form.contratId" class="input-field">
                <option value="">Aucun contrat</option>
                <option v-for="c in contratsOptions" :key="c.id" :value="c.id">{{ c.numero }} - {{ getClientName(c.clientId) }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
              <select v-model="form.clientId" class="input-field" required>
                <option value="" disabled>Sélectionner client</option>
                <option v-for="c in clientsOptions" :key="c.id" :value="c.id">{{ c.firstName }} {{ c.lastName }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Véhicule</label>
              <select v-model="form.carId" class="input-field" required>
                <option value="" disabled>Sélectionner véhicule</option>
                <option v-for="c in carsOptions" :key="c.id" :value="c.id">{{ c.licensePlate }} ({{ c.name }})</option>
              </select>
            </div>
            <div v-if="isAdmin">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agence</label>
              <select v-model="form.agencyId" class="input-field" required>
                <option value="" disabled>Sélectionner agence</option>
                <option v-for="a in agenciesOptions" :key="a.id" :value="a.id">{{ a.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Facture</label>
              <input v-model="form.issueDate" type="datetime-local" class="input-field" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lieu</label>
              <input v-model="form.issueLocation" type="text" class="input-field" placeholder="Casablanca">
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-md font-bold text-gray-900 dark:text-white">Lignes de facturation</h4>
              <button @click="addLine" type="button" class="text-sm font-bold text-[#fa5b0f]">+ Ajouter ligne</button>
            </div>
            <div class="space-y-2">
              <div v-for="(line, idx) in form.lines" :key="idx" class="grid grid-cols-12 gap-2 items-end bg-gray-50 dark:bg-[#151923] p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <div class="col-span-12 md:col-span-4">
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                  <input v-model="line.description" type="text" class="input-field" placeholder="Location véhicule">
                </div>
                <div class="col-span-6 md:col-span-2">
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Durée</label>
                  <input v-model.number="line.duration" type="number" min="0" step="1" class="input-field">
                </div>
                <div class="col-span-6 md:col-span-2">
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Prix unitaire</label>
                  <input v-model.number="line.unitPrice" type="number" min="0" step="0.01" class="input-field">
                </div>
                <div class="col-span-6 md:col-span-2">
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">TVA</label>
                  <select v-model="line.taxable" class="input-field">
                    <option :value="true">Soumis TVA</option>
                    <option :value="false">Sans TVA</option>
                  </select>
                </div>
                <div class="col-span-6 md:col-span-1 text-right">
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Total HT</label>
                  <div class="text-sm font-bold text-gray-900 dark:text-white">{{ formatMAD(lineTotal(line)) }}</div>
                </div>
                <div class="col-span-12 md:col-span-1 text-right">
                  <button type="button" @click="removeLine(idx)" class="text-red-500 text-xs font-bold hover:underline" :disabled="form.lines.length === 1">Suppr.</button>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Montant en lettres</label>
              <textarea v-model="form.totalInWords" rows="3" class="input-field" placeholder="Deux mille ..."></textarea>
            </div>
            <div class="bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/30 p-4 space-y-1">
              <div class="flex justify-between text-sm"><span>Sous-total Location HT:</span><span class="font-bold">{{ formatMAD(formTotals.rentalHT) }}</span></div>
              <div class="flex justify-between text-sm"><span>TVA ({{ tvaRate }}%):</span><span class="font-bold">{{ formatMAD(formTotals.tvaAmount) }}</span></div>
              <div class="flex justify-between text-sm text-[#1d4ed8]"><span class="font-bold">Sous-total Location TTC:</span><span class="font-black">{{ formatMAD(formTotals.rentalTTC) }}</span></div>
              <div class="flex justify-between text-sm"><span>Autres services (sans TVA):</span><span class="font-bold">{{ formatMAD(formTotals.servicesNoTax) }}</span></div>
              <div class="h-px bg-blue-200 dark:bg-blue-800 my-2"></div>
              <div class="flex justify-between text-base text-[#1d4ed8]"><span class="font-bold">TOTAL TTC:</span><span class="font-black">{{ formatMAD(formTotals.totalTTC) }}</span></div>
            </div>
          </div>
        </div>

        <div class="p-5 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
          <button @click="isCreateModalOpen = false" class="px-4 py-2 border border-gray-300 rounded-lg">Annuler</button>
          <button @click="saveFacture" :disabled="isSaving" class="px-4 py-2 bg-[#fa5b0f] text-white rounded-lg font-bold disabled:opacity-60">
            {{ isSaving ? 'Enregistrement...' : 'Enregistrer la facture' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="isPreviewModalOpen && selectedFacture" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#1E2330] z-20">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Aperçu Facture {{ selectedFacture.numero }}</h3>
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-3">
               <span class="font-bold text-gray-700 dark:text-gray-300 text-sm">Format d'En-tête :</span>
               <label class="flex items-center gap-1 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                  <input type="radio" v-model="headerType" value="texte" class="w-4 h-4 text-[#fa5b0f] focus:ring-[#fa5b0f]" />
                  <span>Standard</span>
               </label>
               <label v-if="agencyHeaderDoc" class="flex items-center gap-1 cursor-pointer text-blue-600 text-sm">
                  <input type="radio" v-model="headerType" value="image" class="w-4 h-4 text-blue-500 focus:ring-blue-500" />
                  <span>Image (Personnalisé)</span>
               </label>
            </div>
            <div class="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-4">
              <button @click="downloadFromPreview" class="px-3 py-2 text-xs font-bold text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50">Télécharger PDF</button>
              <button @click="printPreview" class="px-3 py-2 text-xs font-bold text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">Imprimer</button>
              <button @click="isPreviewModalOpen = false" class="px-3 py-2 text-xs font-bold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">Fermer</button>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-100 dark:bg-[#151923]">
          <div ref="invoicePrintRef" class="invoice-page bg-white text-[#10233d] mx-auto shadow-sm">
            <!-- Header -->
            <div v-if="headerType === 'image' && agencyHeaderDoc" class="w-full mb-6 flex flex-col items-center border-b border-blue-100 pb-2">
              <div class="w-full relative overflow-hidden h-28 flex items-center justify-center mb-1">
                <img :src="agencyHeaderDoc.dataUrl" alt="En-tête de l'Agence" class="max-h-full max-w-full object-contain" />
              </div>
              <div class="text-center flex flex-col items-center justify-center mt-2">
                <h2 class="text-[20px] font-black text-[#1d4ed8]">FACTURE N°: {{ selectedFacture.numero }}</h2>
                <p class="text-[13px] text-gray-600 font-medium">Le {{ formatDateTime(selectedFacture.issueDate) }} à {{ selectedFacture.issueLocation || getFactureAgencyCity(selectedFacture) }}</p>
              </div>
            </div>
            <div v-else class="flex justify-between items-start mb-6 border-b border-blue-100 pb-4">
              <div class="w-32 h-20 flex items-center justify-start">
                 <img v-if="agencyLogoDoc" :src="agencyLogoDoc.dataUrl" class="max-w-full max-h-full object-contain" />
                 <div v-else class="w-16 h-16 bg-blue-100 border border-blue-300 flex items-center justify-center text-xs font-bold text-blue-800 rounded">LOGO</div>
              </div>
          
              <div class="text-center flex flex-col items-center justify-center pt-2">
                <h2 class="text-[18px] font-black text-[#1d4ed8]">FACTURE N°: {{ selectedFacture.numero }}</h2>
                <p class="text-[12px] text-gray-600 font-medium mt-1">Le {{ formatDateTime(selectedFacture.issueDate) }} à {{ selectedFacture.issueLocation || getFactureAgencyCity(selectedFacture) }}</p>
              </div>
          
              <div class="text-right text-[12px] leading-tight text-[#10233d] max-w-xs pt-1">
                <h3 class="font-bold text-[15px] text-[#1d4ed8]">{{ getFactureAgencyName(selectedFacture) }}</h3>
                <p>{{ getFactureAgencyCity(selectedFacture) }}</p>
                <p>Tél: <span class="font-medium">{{ getFactureAgencyPhone(selectedFacture) }}</span></p>
                <p>Email: <span class="font-medium">{{ getFactureAgencyEmail(selectedFacture) }}</span></p>
              </div>
            </div>

            <section class="mb-4">
              <h4 class="invoice-section-title">INFORMATIONS CLIENT</h4>
              <div class="grid grid-cols-2 gap-4 text-[13px] mt-2">
                <p><span class="font-bold">Client:</span> {{ getFactureClientName(selectedFacture) }}</p>
                <p><span class="font-bold">CNIE:</span> {{ getFactureClientCnie(selectedFacture) }}</p>
              </div>
            </section>

            <section class="mb-4">
              <h4 class="invoice-section-title">INFORMATIONS VÉHICULE</h4>
              <div class="grid grid-cols-2 gap-4 text-[13px] mt-2">
                <p><span class="font-bold">Véhicule:</span> {{ getFactureCarName(selectedFacture) }}</p>
                <p><span class="font-bold">Matricule:</span> {{ getFactureCarPlate(selectedFacture) }}</p>
              </div>
            </section>

            <section>
              <h4 class="invoice-section-title">DÉTAILS DE LA FACTURE</h4>
              <table class="w-full mt-2 text-[12px]">
                <thead>
                  <tr class="border-b border-blue-200 text-[#1d4ed8]">
                    <th class="py-2 text-left font-bold">DESCRIPTION</th>
                    <th class="py-2 text-center font-bold">DURÉE</th>
                    <th class="py-2 text-right font-bold">PRIX UNITAIRE HT</th>
                    <th class="py-2 text-right font-bold">TOTAL HT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(line, idx) in (selectedFacture.lines || [])" :key="idx" class="border-b border-gray-100">
                    <td class="py-2">{{ line.description }}</td>
                    <td class="py-2 text-center">{{ line.duration }} jrs</td>
                    <td class="py-2 text-right">{{ formatMAD(line.unitPrice) }}</td>
                    <td class="py-2 text-right font-semibold">{{ formatMAD(lineTotal(line)) }}</td>
                  </tr>
                </tbody>
              </table>

              <div class="flex justify-end mt-4">
                <div class="w-[320px] text-[13px] space-y-1">
                  <div class="flex justify-between"><span>Sous-total Location HT:</span><span class="font-semibold">{{ formatMAD(selectedFacture.totals?.rentalHT || 0) }}</span></div>
                  <div class="flex justify-between"><span>TVA ({{ selectedFacture.tvaRate || tvaRate }}%):</span><span class="font-semibold">{{ formatMAD(selectedFacture.totals?.tvaAmount || 0) }}</span></div>
                  <div class="flex justify-between text-[#1d4ed8]"><span class="font-bold">Sous-total Location TTC:</span><span class="font-bold">{{ formatMAD(selectedFacture.totals?.rentalTTC || 0) }}</span></div>
                  <div class="flex justify-between"><span>Autres services (sans TVA):</span><span class="font-semibold">{{ formatMAD(selectedFacture.totals?.servicesNoTax || 0) }}</span></div>
                  <div class="h-px bg-blue-300 my-2"></div>
                  <div class="flex justify-between text-[20px] text-[#1d4ed8]"><span class="font-black">TOTAL TTC:</span><span class="font-black">{{ formatMAD(selectedFacture.totals?.totalTTC || 0) }}</span></div>
                </div>
              </div>
            </section>

            <section class="mt-8 text-[13px]">
              <p class="font-bold">Arrêtée à la présente facture à la somme de:</p>
              <p class="font-semibold">{{ selectedFacture.totalInWords || '-' }}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import html2pdf from 'html2pdf.js'
import writtenNumber from 'written-number'
writtenNumber.defaults.lang = 'fr'
import { useFactureStore } from '../stores/factureStore'
import { useContratStore } from '../stores/contratStore'
import { useClientStore } from '../stores/clientStore'
import { useCarStore } from '../stores/carStore'
import { useAgencyStore } from '../stores/agencyStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useUserStore } from '../stores/userStore'

const factureStore = useFactureStore()
const contratStore = useContratStore()
const clientStore = useClientStore()
const carStore = useCarStore()
const agencyStore = useAgencyStore()
const settingsStore = useSettingsStore()
const userStore = useUserStore()

const searchQuery = ref('')
const isCreateModalOpen = ref(false)
const isPreviewModalOpen = ref(false)
const selectedFacture = ref(null)
const isSaving = ref(false)
const invoicePrintRef = ref(null)
const headerType = ref('texte')

const isAdmin = computed(() => userStore.isAdmin)

const effectiveAgencyId = computed(() => (
  form.value.agencyId ||
  userStore.userAgencyId ||
  userStore.currentAgencyId ||
  ''
))

const tvaRate = computed(() => Number(settingsStore.tvaRate || 20))

const getEmptyForm = () => ({
  contratId: '',
  clientId: '',
  carId: '',
  agencyId: '',
  issueDate: toInputDateTime(new Date()),
  issueLocation: 'Casablanca',
  totalInWords: '',
  lines: [
    { description: 'Location du véhicule', duration: 1, unitPrice: 0, taxable: true }
  ]
})

const form = ref(getEmptyForm())

const clientsOptions = computed(() => {
  const agencyId = effectiveAgencyId.value
  let list = clientStore.filteredClients || clientStore.clients || []
  if (agencyId) list = list.filter(c => c.agencyId === agencyId)
  return list
})

const carsOptions = computed(() => {
  const agencyId = effectiveAgencyId.value
  let list = carStore.filteredCars || carStore.cars || []
  if (agencyId) list = list.filter(c => c.agencyId === agencyId)
  return list
})

const agencesById = computed(() => {
  const map = new Map()
  ;(agencyStore.agencies || []).forEach(a => map.set(a.id, a))
  return map
})
const agenciesOptions = computed(() => agencyStore.agencies || [])

const contratsOptions = computed(() => {
  const agencyId = effectiveAgencyId.value
  let list = (contratStore.filteredContrats || contratStore.contrats || []).filter(c => c.etat !== 'Annulé')
  if (agencyId) list = list.filter(c => c.agencyId === agencyId)
  return list
})

const currentAgency = computed(() => {
  if (!selectedFacture.value) return null
  return agencesById.value.get(selectedFacture.value.agencyId)
})

const agencyLogoDoc = computed(() => {
   if (!currentAgency.value || !currentAgency.value.documents) return null
   return currentAgency.value.documents.find(d => d.agencyType === 'Logo')
})

const agencyHeaderDoc = computed(() => {
   if (!currentAgency.value || !currentAgency.value.documents) return null
   return currentAgency.value.documents.find(d => d.agencyType === 'En-tête')
})

const filteredFactures = computed(() => {
  let rows = [...(factureStore.filteredFactures || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  if (!searchQuery.value) return rows
  const q = searchQuery.value.toLowerCase()
  return rows.filter(f => {
    return (
      String(f.numero || '').toLowerCase().includes(q) ||
      getFactureClientName(f).toLowerCase().includes(q) ||
      getFactureCarName(f).toLowerCase().includes(q)
    )
  })
})

const lineTotal = (line) => Number(line.duration || 0) * Number(line.unitPrice || 0)

const formTotals = computed(() => {
  const lines = form.value.lines || []
  const rentalHT = lines.filter(l => l.taxable).reduce((sum, l) => sum + lineTotal(l), 0)
  const servicesNoTax = lines.filter(l => !l.taxable).reduce((sum, l) => sum + lineTotal(l), 0)
  const tvaAmount = (rentalHT * tvaRate.value) / 100
  const rentalTTC = rentalHT + tvaAmount
  const totalTTC = rentalTTC + servicesNoTax
  return { rentalHT, servicesNoTax, tvaAmount, rentalTTC, totalTTC }
})

const formatTotalInWords = (total) => {
  const dirhams = Math.floor(total);
  const centimes = Math.round((total - dirhams) * 100);
  
  let text = writtenNumber(dirhams) + ' dirhams';
  if (centimes > 0) {
    text += ' et ' + writtenNumber(centimes) + ' centimes';
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}

watch(() => formTotals.value.totalTTC, (newTotal) => {
  if (newTotal > 0) {
    form.value.totalInWords = formatTotalInWords(newTotal);
  } else {
    form.value.totalInWords = '';
  }
}, { immediate: true })

watch(() => form.value.contratId, (contratId) => {
  if (!contratId) return
  const contrat = contratStore.contrats.find(c => c.id === contratId)
  if (!contrat) return

  form.value.clientId = contrat.clientId || ''
  form.value.carId = contrat.carId || ''
  form.value.agencyId = contrat.agencyId || ''

  const baseLine = {
    description: 'Location du véhicule',
    duration: Number(contrat.duree || 1),
    unitPrice: Number(contrat.prixParJour || 0),
    taxable: true
  }

  const prolongationLines = (contrat.prolongations || []).map((p, idx) => ({
    description: `Prolongation #${idx + 1}`,
    duration: Number(p.joursAjoutes || 0),
    unitPrice: Number(p.prixJournalier || 0),
    taxable: true
  }))

  form.value.lines = [baseLine, ...prolongationLines]
}, { immediate: false })

const getClientById = (clientId) => clientStore.clients.find(c => c.id === clientId || c.nationalId === clientId)
const getCarById = (carId) => carStore.cars.find(c => c.id === carId)

const getClientName = (clientId) => {
  const c = getClientById(clientId)
  return c ? `${c.firstName} ${c.lastName}`.trim() : 'Client inconnu'
}

const getFactureClientName = (facture) => {
  if (facture.clientSnapshot?.fullName) return facture.clientSnapshot.fullName
  return getClientName(facture.clientId)
}

const getFactureClientCnie = (facture) => {
  if (facture.clientSnapshot?.nationalId) return facture.clientSnapshot.nationalId
  return getClientById(facture.clientId)?.nationalId || '-'
}

const getFactureCarName = (facture) => {
  if (facture.carSnapshot?.name) return facture.carSnapshot.name
  const car = getCarById(facture.carId)
  return car ? car.name : 'Véhicule inconnu'
}

const getFactureCarPlate = (facture) => {
  if (facture.carSnapshot?.licensePlate) return facture.carSnapshot.licensePlate
  return getCarById(facture.carId)?.licensePlate || '-'
}

const getFactureAgencyName = (facture) => {
  if (facture.agencySnapshot?.name) return facture.agencySnapshot.name
  return agencesById.value.get(facture.agencyId)?.name || 'Agence inconnue'
}

const getFactureAgencyCity = (facture) => {
  if (facture.agencySnapshot?.location) return facture.agencySnapshot.location
  const agency = agencesById.value.get(facture.agencyId)
  return agency?.location || agency?.ville || '-'
}

const getFactureAgencyPhone = (facture) => {
  if (facture.agencySnapshot?.phone) return facture.agencySnapshot.phone
  return agencesById.value.get(facture.agencyId)?.phone || '-'
}

const getFactureAgencyEmail = (facture) => {
  if (facture.agencySnapshot?.email) return facture.agencySnapshot.email
  return agencesById.value.get(facture.agencyId)?.email || '-'
}

const formatMAD = (value) => `${Number(value || 0).toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`

const formatDateTime = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function toInputDateTime(date) {
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const generateFactureNumber = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `FAC-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

const openCreateModal = () => {
  form.value = getEmptyForm()
  if (!isAdmin.value) {
    form.value.agencyId = userStore.userAgencyId || userStore.currentAgencyId || ''
  }
  isCreateModalOpen.value = true
}

const addLine = () => {
  form.value.lines.push({ description: '', duration: 1, unitPrice: 0, taxable: true })
}

const removeLine = (idx) => {
  if (form.value.lines.length === 1) return
  form.value.lines.splice(idx, 1)
}

const saveFacture = async () => {
  if (!form.value.clientId || !form.value.carId || !form.value.agencyId || !form.value.issueDate) {
    alert('Merci de compléter les champs obligatoires.')
    return
  }

  isSaving.value = true
  try {
    const client = getClientById(form.value.clientId)
    const car = getCarById(form.value.carId)
    const agency = agencesById.value.get(form.value.agencyId)

    const payload = {
      numero: generateFactureNumber(),
      contratId: form.value.contratId || null,
      clientId: form.value.clientId,
      carId: form.value.carId,
      agencyId: form.value.agencyId,
      issueDate: new Date(form.value.issueDate).toISOString(),
      issueLocation: form.value.issueLocation,
      lines: (form.value.lines || []).map(l => ({
        description: l.description,
        duration: Number(l.duration || 0),
        unitPrice: Number(l.unitPrice || 0),
        taxable: !!l.taxable
      })),
      tvaRate: tvaRate.value,
      totals: { ...formTotals.value },
      totalInWords: form.value.totalInWords,
      clientSnapshot: client ? {
        fullName: `${client.firstName || ''} ${client.lastName || ''}`.trim(),
        nationalId: client.nationalId || ''
      } : null,
      carSnapshot: car ? {
        name: car.name || '',
        licensePlate: car.licensePlate || ''
      } : null,
      agencySnapshot: agency ? {
        name: agency.name || '',
        location: agency.location || agency.ville || '',
        phone: agency.phone || '',
        email: agency.email || ''
      } : null
    }

    const created = await factureStore.addFacture(payload)
    isCreateModalOpen.value = false
    openPreview(created)
  } catch (error) {
    console.error('Failed to save facture:', error)
    alert('Erreur lors de la création de la facture.')
  } finally {
    isSaving.value = false
  }
}

const openPreview = (facture) => {
  selectedFacture.value = facture
  isPreviewModalOpen.value = true
}

const buildPdf = async (filename) => {
  await nextTick()
  const element = invoicePrintRef.value
  if (!element) return

  const opt = {
    margin: 6,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  await html2pdf().set(opt).from(element).save()
}

const downloadFromPreview = async () => {
  if (!selectedFacture.value) return
  await buildPdf(`${selectedFacture.value.numero || 'facture'}.pdf`)
}

const downloadFacture = async (facture) => {
  selectedFacture.value = facture
  if (!isPreviewModalOpen.value) {
    isPreviewModalOpen.value = true
  }
  await buildPdf(`${facture.numero || 'facture'}.pdf`)
}

const printPreview = () => window.print()

const deleteFacture = async (id) => {
  if (!confirm('Supprimer cette facture ?')) return
  await factureStore.deleteFacture(id)
}

onMounted(async () => {
  await Promise.all([
    factureStore.initializeFromStorage(),
    contratStore.initializeFromStorage(),
    clientStore.initializeFromStorage(),
    carStore.initializeFromStorage(),
    agencyStore.initializeFromStorage(),
    settingsStore.initializeFromStorage()
  ])
})
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 bg-white dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f];
}

.invoice-page {
  width: 210mm;
  min-height: 297mm;
  padding: 12mm;
  box-sizing: border-box;
}

.invoice-section-title {
  font-size: 22px;
  font-weight: 900;
  color: #1d4ed8;
  border-bottom: 2px solid #7ea6ff;
  padding-bottom: 4px;
  margin-bottom: 6px;
}

@media print {
  .invoice-page {
    box-shadow: none !important;
    margin: 0 !important;
  }
}
</style>
