<template>
  <div class="p-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    <div class="max-w-4xl mx-auto bg-white dark:bg-[#1E2330] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
      <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ canSeeSubscription ? 'Paramètres Généraux & Abonnement' : 'Paramètres Généraux' }}
        </h2>
      </div>
      
      <!-- Tenant Subscription Status -->
      <div v-if="canSeeSubscription" class="p-6 pb-0">
         <SubscriptionInfo />
      </div>

      <form @submit.prevent="saveSettings" class="p-6 space-y-8">
        
        <!-- Taxes & Accounting -->
        <section>
          <h3 class="text-md font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Comptabilité & Taxes</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Taux de TVA (%)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                  </svg>
                </div>
                <input v-model="form.tvaRate" type="number" step="0.1" required class="input-field pl-10 pr-4" />
              </div>
              <p class="text-xs text-gray-500 mt-1">Sera appliqué dynamiquement lors de la création de nouvelles réservations</p>
            </div>
          </div>
        </section>

        <!-- Alerts -->
        <section>
          <div class="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-800 mb-4">
            <h3 class="text-md font-bold text-gray-900 dark:text-white">Alertes & Notifications</h3>
            <button 
              type="button" 
              @click="openAlertModal"
              class="text-sm font-medium text-[#fa5b0f] hover:text-orange-600 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurer les seuils
            </button>
          </div>
        </section>

        <!-- Conditions Générales -->
        <section>
          <div class="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-800 mb-4">
            <h3 class="text-md font-bold text-gray-900 dark:text-white">Conditions Générales (Contrat)</h3>
            <button 
              type="button" 
              @click="openConditionsModal"
              class="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Éditer les conditions
            </button>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Personnalisez le texte du contrat de location en Français et en Arabe. Ce contrat sera imprimable au format PDF.
          </p>
        </section>

        <!-- Maintenance Data -->
        <section v-if="userStore.isAdmin">
          <div class="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-800 mb-4">
            <h3 class="text-md font-bold text-gray-900 dark:text-white">Maintenance des Données</h3>
          </div>
          <div class="rounded-lg border border-orange-200 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-900/10 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Réappliquer la synchronisation des agences sur les données historiques liées aux voitures
              (assurances, visites techniques, entretiens, charges, contrats, réservations).
            </p>
            <button
              type="button"
              @click="runAgencyResync"
              :disabled="isResyncing"
              class="px-4 py-2 text-sm font-bold rounded-lg border transition-colors whitespace-nowrap"
              :class="isResyncing
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700'
                : 'bg-[#fa5b0f] text-white border-[#fa5b0f] hover:bg-transparent hover:text-[#fa5b0f]'"
            >
              {{ isResyncing ? 'Synchronisation...' : 'Resync Car Linked Data' }}
            </button>
          </div>
        </section>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
          <button
            type="submit"
            class="px-6 py-2.5 text-sm font-bold text-white bg-[#fa5b0f] text-white border border-transparent rounded-lg shadow-sm hover:bg-orange-500 focus:outline-none transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </form>
    </div>

    <!-- Alert Configuration Modal -->
    <div v-if="isAlertModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-[#1E2330] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-4xl flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-[#fa5b0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Configuration des seuils d'alerte</h2>
          </div>
          <button @click="isAlertModalOpen = false" class="text-gray-400 hover:text-gray-500 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Body -->
        <div class="p-6 overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span class="text-red-500">⏰</span> Retour contrat (j)
              </label>
              <input type="number" v-model.number="alertForm.retourContrat" class="input-field" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span class="text-orange-500">🔧</span> Fin visite technique (j)
              </label>
              <input type="number" v-model.number="alertForm.finVisiteTechnique" class="input-field" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span class="text-yellow-500">🛡️</span> Fin assurance (j)
              </label>
              <input type="number" v-model.number="alertForm.finAssurance" class="input-field" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span class="text-amber-600">🛟</span> Fin assistance (j)
              </label>
              <input type="number" v-model.number="alertForm.finAssistance" class="input-field" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span class="text-orange-400">📄</span> Fin carte grise (j)
              </label>
              <input type="number" v-model.number="alertForm.finCarteGrise" class="input-field" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span class="text-yellow-600">📝</span> Fin autorisation (j)
              </label>
              <input type="number" v-model.number="alertForm.finAutorisation" class="input-field" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span class="text-blue-500">⚙️</span> Km avant entretien
              </label>
              <input type="number" v-model.number="alertForm.kmAvantEntretien" class="input-field" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span class="text-cyan-500">🔧</span> Entretien par date (j)
              </label>
              <input type="number" v-model.number="alertForm.entretienParDate" class="input-field" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span class="text-indigo-500">💳</span> Prochaine traite (j)
              </label>
              <input type="number" v-model.number="alertForm.prochaineTraite" class="input-field" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span class="text-blue-400">📅</span> Réservation (j)
              </label>
              <input type="number" v-model.number="alertForm.reservation" class="input-field" />
            </div>
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span class="text-gray-500">☑️</span> Tâche programmée (j)
              </label>
              <input type="number" v-model.number="alertForm.tacheProgrammee" class="input-field" />
            </div>
          </div>
          
          <div class="mt-8 flex items-center gap-3">
            <!-- Toggle Switch -->
            <button 
              type="button"
              @click="alertForm.active = !alertForm.active"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              :class="alertForm.active ? 'bg-[#fa5b0f]' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <span 
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="alertForm.active ? 'translate-x-5' : 'translate-x-0'"
              ></span>
            </button>
            <span class="text-sm font-bold text-gray-900 dark:text-white">Activer les alertes</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1A1F2B] rounded-b-xl">
          <button @click="isAlertModalOpen = false" class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2A303C] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Annuler
          </button>
          <button @click="saveAlertThresholds" class="flex items-center gap-2 px-4 py-2 bg-[#fa5b0f] text-[#fff] rounded-[8px] transition-colors font-bold border border-[#fa5b0f] hover:bg-transparent hover:text-[#fa5b0f]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
    <!-- Conditions Modal -->
    <div v-if="isConditionsModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-[#1E2330] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-6xl flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Éditeur des Conditions Générales</h2>
          </div>
          <button @click="isConditionsModalOpen = false" class="text-gray-400 hover:text-gray-500 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Body -->
        <div class="p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-[#151923]">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[500px]">
            <div class="flex flex-col h-full space-y-2">
              <label class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🇫🇷 Version Française
              </label>
              <textarea v-model="conditionsForm.fr" class="input-field flex-1 h-full min-h-[400px] resize-none font-mono text-xs p-4 leading-relaxed"></textarea>
            </div>
            <div class="flex flex-col h-full space-y-2">
              <label class="font-bold text-gray-900 dark:text-white flex items-center justify-end gap-2" dir="rtl">
                🇲🇦 النسخة العربية
              </label>
              <textarea v-model="conditionsForm.ar" dir="rtl" class="input-field flex-1 h-full min-h-[400px] resize-none font-mono text-sm p-4 leading-relaxed text-right"></textarea>
            </div>
          </div>
        </div>

        <!-- Hidden A4 DOM element for PDF Generation -->
        <div class="pointer-events-none absolute opacity-0 z-[-1]" aria-hidden="true">
           <div id="pdf-conditions-template" style="width: 210mm; background: white; color: black; font-family: 'Arial', sans-serif; box-sizing: border-box;">
              <!-- Header -->
              <div style="display: flex; justify-content: space-between; align-items: center; background-color: #d1d5db; padding: 10mm; border-bottom: 2px solid #9ca3af;">
                 <h1 style="margin: 0; font-size: 20px; font-weight: bold; width: 50%;">Conditions Générales</h1>
                 <h1 style="margin: 0; font-size: 24px; font-weight: bold; width: 50%; text-align: right; direction: rtl;">شروط عامة</h1>
              </div>
              <!-- Content Grid -->
              <div style="display: flex; width: 100%; padding: 10mm; gap: 8mm;">
                 <div style="flex: 1; font-size: 11px; line-height: 1.4; white-space: pre-wrap; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">{{ conditionsForm.fr }}</div>
                 <div style="flex: 1; font-size: 13px; line-height: 1.5; white-space: pre-wrap; direction: rtl; text-align: right; font-family: 'Arial', sans-serif;">{{ conditionsForm.ar }}</div>
              </div>
           </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1F2B] rounded-b-xl">
          <button @click="generatePDF" class="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-[8px] transition-colors font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Télécharger le PDF
          </button>
          
          <div class="flex items-center gap-3">
            <button @click="isConditionsModalOpen = false" class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2A303C] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Annuler
            </button>
            <button @click="saveConditions" class="flex items-center gap-2 px-4 py-2 bg-[#fa5b0f] text-[#fff] rounded-[8px] transition-colors font-bold border border-[#fa5b0f] hover:bg-transparent hover:text-[#fa5b0f]">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useAlertStore } from '../stores/alertStore'
import { useCarStore } from '../stores/carStore'
import SubscriptionInfo from '../components/SubscriptionInfo.vue'
import { useSettingsStore } from '../stores/settingsStore'
import html2pdf from 'html2pdf.js'

const userStore = useUserStore()
const settingsStore = useSettingsStore()
const alertStore = useAlertStore()
const carStore = useCarStore()
const canSeeSubscription = computed(() => userStore.isAdmin)
const isResyncing = ref(false)

const form = ref({
  tvaRate: 20
})

const isAlertModalOpen = ref(false)
const alertForm = ref({
  retourContrat: 3,
  finVisiteTechnique: 7,
  finAssurance: 7,
  finAssistance: 7,
  finCarteGrise: 7,
  finAutorisation: 7,
  kmAvantEntretien: 1000,
  entretienParDate: 15,
  prochaineTraite: 7,
  reservation: 3,
  tacheProgrammee: 3,
  active: true
})

const isConditionsModalOpen = ref(false)
const conditionsForm = ref({
  fr: '',
  ar: ''
})

onMounted(async () => {
  await settingsStore.initializeFromStorage()
  form.value.tvaRate = settingsStore.tvaRate
  if (settingsStore.alertThresholds) {
    alertForm.value = JSON.parse(JSON.stringify(settingsStore.alertThresholds))
  }
  if (settingsStore.conditionsGenerales) {
    conditionsForm.value = JSON.parse(JSON.stringify(settingsStore.conditionsGenerales))
  }
})

const openAlertModal = async () => {
  await settingsStore.initializeFromStorage()
  if (settingsStore.alertThresholds) {
    alertForm.value = JSON.parse(JSON.stringify(settingsStore.alertThresholds))
  }
  isAlertModalOpen.value = true
}

const saveAlertThresholds = async () => {
  await settingsStore.updateSettings({
    alertThresholds: alertForm.value
  })
  await alertStore.checkAlerts()
  isAlertModalOpen.value = false
  alert('Seuils d’alertes enregistrés.')
}

const saveSettings = async () => {
  await settingsStore.updateSettings({
    tvaRate: parseFloat(form.value.tvaRate)
  })
  alert('Paramètres mis à jour avec succès!')
}

const openConditionsModal = () => {
  if (settingsStore.conditionsGenerales) {
    conditionsForm.value = JSON.parse(JSON.stringify(settingsStore.conditionsGenerales))
  }
  isConditionsModalOpen.value = true
}

const saveConditions = async () => {
  await settingsStore.updateSettings({
    conditionsGenerales: conditionsForm.value
  })
  alert('Conditions enregistrées avec succès!')
  isConditionsModalOpen.value = false
}

const generatePDF = () => {
  const element = document.getElementById('pdf-conditions-template')
  const opt = {
    margin:       0,
    filename:     'conditions_generales.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().set(opt).from(element).save()
}

const runAgencyResync = async () => {
  if (isResyncing.value) return
  isResyncing.value = true
  try {
    const result = await carStore.runManualAgencyResync()
    const touchedKeys = Object.values(result || {}).filter(Boolean).length
    if (touchedKeys > 0) {
      alert(`Synchronisation terminée. ${touchedKeys} module(s) mis à jour.`)
    } else {
      alert('Synchronisation terminée. Aucune correction nécessaire.')
    }
  } catch (error) {
    console.error('Agency resync failed:', error)
    alert('Erreur lors de la synchronisation.')
  } finally {
    isResyncing.value = false
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full py-2.5 bg-white dark:bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors;
}
</style>
