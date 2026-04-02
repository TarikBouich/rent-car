<template>
  <div class="p-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    
    <!-- Top Bar -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Visites Techniques</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez les visites techniques de vos véhicules</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="relative">
          <input
            type="search"
            class="pl-10 pr-4 py-2 bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]"
            placeholder="Rechercher (Matricule, Centre...)"
            v-model="searchQuery"
          />
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.323 13.383a5.5 5.5 0 1 1 1.06-1.06l2.897 2.897a.75.75 0 1 1-1.06 1.06l-2.897-2.897Zm.677-4.383a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
            </svg>
          </div>
        </div>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-[#fa5b0f] text-white text-sm font-medium rounded-lg hover:bg-orange-500 transition-colors shadow-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Nouvelle Visite
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th class="p-4">Matricule</th>
              <th class="p-4">Modèle</th>
              <th class="p-4">Centre</th>
              <th class="p-4">Contact Centre</th>
              <th class="p-4">Date Visite</th>
              <th class="p-4">Date Fin</th>
              <th class="p-4 text-right">Montant</th>
              <th class="p-4 text-center">Fichiers</th>
              <th class="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <tr v-for="visite in filteredVisites" :key="visite.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
              <td class="p-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 uppercase tracking-wide border border-gray-200 dark:border-gray-700">
                  {{ getCarLicensePlate(visite.carId) }}
                </span>
              </td>
              <td class="p-4 text-sm text-gray-900 dark:text-white font-medium">{{ getCarModelName(visite.carId) }}</td>
              <td class="p-4 text-sm text-gray-500 dark:text-gray-400">{{ visite.centreName || '-' }}</td>
              <td class="p-4 text-sm text-gray-500 dark:text-gray-400">{{ visite.contactTel || '-' }}</td>
              <td class="p-4 text-sm text-gray-900 dark:text-white">{{ formatDateOnly(visite.dateVisite) }}</td>
              <td class="p-4 text-sm">
                <span :class="getDateStatusClass(visite.dateFin)" class="px-2.5 py-1 rounded-md text-xs font-semibold">
                  {{ formatDateOnly(visite.dateFin) }}
                </span>
              </td>
              <td class="p-4 text-sm text-gray-900 dark:text-white font-semibold text-right">{{ formatCurrency(visite.price) }}</td>
              <td class="p-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button v-if="visite.fileVisite" @click="showImage(visite.fileVisite, 'Visite Technique')" class="text-blue-500 hover:text-blue-600 p-1" title="Voir Visite">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  </button>
                  <button v-if="visite.fileFacture" @click="showImage(visite.fileFacture, 'Facture')" class="text-emerald-500 hover:text-emerald-600 p-1" title="Voir Facture">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </button>
                  <span v-if="!visite.fileVisite && !visite.fileFacture" class="text-xs text-gray-400">-</span>
                </div>
              </td>
              <td class="p-4 text-center">
                <button @click="deleteVisite(visite.id)" class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Supprimer">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </td>
            </tr>
            <tr v-if="filteredVisites.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-500 dark:text-gray-400">
                Aucune visite technique trouvée.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white dark:bg-[#1E2330] rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#1C1C1C]/50">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Nouvelle Visite Technique</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto custom-scrollbar">
          <form @submit.prevent="saveVisite" class="space-y-6">
                     <!-- Vehicle Selection -->
            <div class="space-y-4">
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">Information Véhicule</h4>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Véhicule (Matricule) <span class="text-red-500">*</span></label>
                <select v-model="formData.carId" required class="w-full px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]">
                  <option value="" disabled>Sélectionner un véhicule</option>
                  <option v-for="car in availableCars" :key="car.id" :value="car.id">
                    {{ car.licensePlate }} - {{ getModelNameDirect(car.modelId) }} ({{ car.brand }})
                  </option>
                </select>
              </div>
            </div>

            <!-- Centre Section -->
            <div v-show="formData.carId" class="space-y-4 slide-down overflow-hidden">
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">Centre de Visite</h4>
              <div v-if="!isCreatingNewCentre">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Centre existant <span class="text-red-500">*</span></label>
                <div class="flex items-center gap-2">
                  <select v-model="formData.centreId" :required="!isCreatingNewCentre" class="flex-1 px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]">
                    <option value="" disabled>Choisir un centre</option>
                    <option v-for="c in knownCentres" :key="c.id" :value="c.id">
                      {{ c.name }}
                    </option>
                  </select>
                  <button type="button" @click="isCreatingNewCentre = true" class="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0" title="Ajouter un nouveau centre">
                    Nouveau
                  </button>
                </div>
              </div>

              <div v-if="isCreatingNewCentre" class="space-y-3 bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-blue-700 dark:text-blue-400">Création Nouveau Centre</span>
                  <button type="button" @click="isCreatingNewCentre = false; newCentreData.name='' " class="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-white">Annuler</button>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du Centre <span class="text-red-500">*</span></label>
                  <input type="text" v-model="newCentreData.name" :required="isCreatingNewCentre" placeholder="Ex: Dekra" class="w-full px-3 py-1.5 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#fa5b0f]" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Centre (Tél)</label>
                  <input type="tel" v-model="newCentreData.contactTel" placeholder="Ex: 0522..." class="w-full px-3 py-1.5 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#fa5b0f]" />
                </div>
              </div>
            </div>

            <transition name="fade">
              <div v-show="formData.carId && (formData.centreId || isCreatingNewCentre)" class="space-y-6">
                <!-- Visite Details -->
                <div class="space-y-4">
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 mt-2">Détails de la Visite</h4>
                  
                  <!-- Dates & Duration -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de visite <span class="text-red-500">*</span></label>
                      <input type="date" v-model="formData.dateVisite" required class="w-full px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Durée (mois) <span class="text-red-500">*</span></label>
                      <input type="number" min="1" v-model.number="formData.dureeMois" required class="w-full px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date fin (Calculée)</label>
                      <input type="date" :value="calculatedDateFin" readonly disabled class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent rounded-lg text-sm text-gray-700 dark:text-gray-300 cursor-not-allowed font-medium" />
                    </div>
                  </div>

                  <!-- Price & Observation -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix (MAD) <span class="text-red-500">*</span></label>
                      <input type="number" min="0" step="0.01" v-model.number="formData.price" required class="w-full px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paiement <span class="text-red-500">*</span></label>
                      <select v-model="formData.paymentMethod" required class="w-full px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]">
                        <option value="espece">Espèce</option>
                        <option value="banque">Banque</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observation</label>
                      <input type="text" v-model="formData.observation" placeholder="Remarques éventuelles..." class="w-full px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]">
                    </div>
                  </div>
                </div>

                <!-- Uploads -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                  <!-- Visite Upload -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document de Visite</label>
                    <div class="flex items-center gap-3">
                      <input type="file" @change="handleFileUpload($event, 'fileVisite')" accept="image/*,.pdf" class="hidden" ref="fileVisiteInput" />
                      <button type="button" @click="$refs.fileVisiteInput.click()" class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Choisir...</button>
                      <span class="text-xs text-gray-500 truncate max-w-[120px]">{{ formData.fileVisite ? 'Fichier chargé' : 'Aucun fichier' }}</span>
                    </div>
                    <div v-if="formData.fileVisite && isImage(formData.fileVisite)" class="mt-2 h-20 w-32 rounded border border-gray-200 dark:border-gray-700 overflow-hidden relative">
                      <img :src="formData.fileVisite" class="w-full h-full object-cover" />
                      <button @click.prevent="formData.fileVisite = ''" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg></button>
                    </div>
                  </div>

                  <!-- Facture Upload -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Facture</label>
                    <div class="flex items-center gap-3">
                      <input type="file" @change="handleFileUpload($event, 'fileFacture')" accept="image/*,.pdf" class="hidden" ref="fileFactureInput" />
                      <button type="button" @click="$refs.fileFactureInput.click()" class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Choisir...</button>
                      <span class="text-xs text-gray-500 truncate max-w-[120px]">{{ formData.fileFacture ? 'Fichier chargé' : 'Aucun fichier' }}</span>
                    </div>
                    <div v-if="formData.fileFacture && isImage(formData.fileFacture)" class="mt-2 h-20 w-32 rounded border border-gray-200 dark:border-gray-700 overflow-hidden relative">
                      <img :src="formData.fileFacture" class="w-full h-full object-cover" />
                      <button @click.prevent="formData.fileFacture = ''" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg></button>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
            
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-[#1C1C1C]/50">
          <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            Annuler
          </button>
          <button @click="saveVisite" :disabled="isSaving" class="px-6 py-2 bg-[#fa5b0f] text-white text-sm font-medium rounded-lg hover:bg-orange-500 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
            <svg v-if="isSaving" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Enregistrer
          </button>
        </div>

      </div>
    </div>

    <!-- Image Viewer Modal -->
    <div v-if="imageViewer.show" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" @click="imageViewer.show = false">
      <div class="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
        <button @click="imageViewer.show = false" class="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <span class="absolute top-4 left-4 text-white font-bold bg-black/50 px-4 py-1.5 rounded-full">{{ imageViewer.title }}</span>
        <img v-if="isImage(imageViewer.url)" :src="imageViewer.url" class="max-h-[85vh] max-w-full object-contain shadow-2xl rounded-lg" @click.stop />
        <div v-else class="text-white flex flex-col items-center p-8 bg-black/50 rounded-xl" @click.stop>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <p class="text-lg">Ce fichier est un Document (PDF). Impossible d'afficher l'aperçu.</p>
          <a :href="imageViewer.url" download="document.pdf" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Télécharger le document</a>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVisiteStore } from '../stores/visiteStore'
import { useCentreVisiteStore } from '../stores/centreVisiteStore'
import { useCarStore } from '../stores/carStore'
import { useModelStore } from '../stores/modelStore'
import { useChargeStore } from '../stores/chargeStore'

const route = useRoute()
const router = useRouter()
const visiteStore = useVisiteStore()
const centreStore = useCentreVisiteStore()
const carStore = useCarStore()
const modelStore = useModelStore()
const chargeStore = useChargeStore()

// State
const searchQuery = ref('')
const showAddModal = ref(false)
const isSaving = ref(false)

const imageViewer = ref({
  show: false,
  url: '',
  title: ''
})

const isCreatingNewCentre = ref(false)
const newCentreData = ref({
  name: '',
  contactTel: ''
})

const formData = ref({
  carId: '',
  centreId: '',
  dateVisite: '',
  dureeMois: 12,
  price: 0,
  paymentMethod: 'espece',
  observation: '',
  fileVisite: '',
  fileFacture: ''
})

// Initialization
onMounted(() => {
  visiteStore.initializeFromStorage()
  centreStore.initializeFromStorage()
  carStore.initializeFromStorage()
  modelStore.initializeFromStorage()
  chargeStore.initializeFromStorage()
  
  formData.value.dateVisite = new Date().toISOString().split('T')[0]

  if (route.query.new) {
    openAddModal()
  }
})

// Watchers
watch(() => route.query.new, (newVal) => {
  if (newVal) {
    if (!showAddModal.value) openAddModal()
  }
})

watch(() => formData.value.carId, (newCarId) => {
  if (newCarId) {
    const car = carStore.getCarById(newCarId)
    if (car && car.visiteTechniqueEndDate) {
      formData.value.dateVisite = car.visiteTechniqueEndDate
    } else {
      formData.value.dateVisite = new Date().toISOString().split('T')[0]
    }
  }
})

// Computeds
const availableCars = computed(() => {
  return carStore.filteredCars
})

const knownCentres = computed(() => {
  return centreStore.centres
})

const filteredVisites = computed(() => {
  let list = visiteStore.filteredVisites || []
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(v => {
      const carMatricule = getCarLicensePlate(v.carId).toLowerCase()
      const centre = (v.centreName || '').toLowerCase()
      return carMatricule.includes(q) || centre.includes(q)
    })
  }
  return list.sort((a, b) => new Date(b.dateVisite) - new Date(a.dateVisite))
})

const calculatedDateFin = computed(() => {
  if (!formData.value.dateVisite || !formData.value.dureeMois) return ''
  const date = new Date(formData.value.dateVisite)
  date.setMonth(date.getMonth() + parseInt(formData.value.dureeMois))
  return date.toISOString().split('T')[0]
})

// Methods
const openAddModal = () => {
  isCreatingNewCentre.value = false
  newCentreData.value = { name: '', contactTel: '' }
  
  formData.value = {
    carId: '',
    centreId: '',
    dateVisite: new Date().toISOString().split('T')[0],
    dureeMois: 12,
    price: 0,
    paymentMethod: 'espece',
    observation: '',
    fileVisite: '',
    fileFacture: ''
  }
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  if (route.query.new) {
    router.replace({ path: route.path })
  }
}

const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.value[fieldName] = e.target.result
  }
  reader.readAsDataURL(file)
}

const saveVisite = () => {
  if (!formData.value.carId || !formData.value.dateVisite || !formData.value.price) return
  if (!formData.value.centreId && !isCreatingNewCentre.value) return
  if (isCreatingNewCentre.value && !newCentreData.value.name.trim()) return

  isSaving.value = true
  
  let finalCentreId = formData.value.centreId
  let finalCentreName = ''
  let finalContactTel = ''

  if (isCreatingNewCentre.value) {
    const newCentre = centreStore.addCentre({
      name: newCentreData.value.name.trim(),
      contactTel: newCentreData.value.contactTel
    })
    finalCentreId = newCentre.id
    finalCentreName = newCentre.name
    finalContactTel = newCentre.contactTel
  } else if (finalCentreId) {
    const c = centreStore.getCentreById(finalCentreId)
    if (c) {
      finalCentreName = c.name
      finalContactTel = c.contactTel
    }
  }

  const finalDateFin = calculatedDateFin.value

  const newVisite = {
    carId: formData.value.carId,
    centreId: finalCentreId,
    centreName: finalCentreName,
    contactTel: finalContactTel,
    dateVisite: formData.value.dateVisite,
    dureeMois: formData.value.dureeMois,
    price: formData.value.price,
    observation: formData.value.observation,
    fileVisite: formData.value.fileVisite,
    fileFacture: formData.value.fileFacture,
    dateFin: finalDateFin,
    id: 'v_tech_' + Date.now(),
    createdAt: new Date().toISOString()
  }

  visiteStore.addVisite(newVisite)

  if (newVisite.price > 0) {
    chargeStore.addCharge({
      id: 'charge_' + newVisite.id,
      type: 'car',
      chargeType: 'visite technique',
      carId: newVisite.carId,
      agencyId: carStore.getCarById(newVisite.carId)?.agencyId,
      amount: newVisite.price,
      paymentMethod: formData.value.paymentMethod,
      date: newVisite.dateVisite,
      description: `Visite Technique - Centre: ${finalCentreName || 'Inconnu'}`,
      status: 'Paid'
    })
  }
  
  // 5. Automatically push expiration threshold to global Car Profile
  const car = carStore.getCarById(newVisite.carId)
  if (car) {
    const formattedDate = finalDateFin.split('T')[0]
    if (!car.visiteTechniqueEndDate || new Date(formattedDate) > new Date(car.visiteTechniqueEndDate)) {
      car.visiteTechniqueEndDate = formattedDate
      carStore.updateCar(car)
    }
  }

  setTimeout(() => {
    isSaving.value = false
    closeModal()
  }, 400)
}

const deleteVisite = (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette visite technique ?')) {
    visiteStore.deleteVisite(id)
    // Attempt to delete correlated charge
    chargeStore.deleteCharge('charge_' + id)
  }
}

// Helpers
const getCarLicensePlate = (carId) => {
  const car = carStore.getCarById(carId)
  return car ? car.licensePlate : 'Inconnu'
}

const getCarModelName = (carId) => {
  const car = carStore.getCarById(carId)
  if (!car) return 'Inconnu'
  return getModelNameDirect(car.modelId)
}

const getModelNameDirect = (modelId) => {
  const m = modelStore.getModelById(modelId)
  return m ? m.name : 'Inconnu'
}

const formatDateOnly = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(val || 0)
}

const getDateStatusClass = (dateFinStr) => {
  if (!dateFinStr) return 'bg-gray-100 text-gray-500'
  const end = new Date(dateFinStr)
  const now = new Date()
  const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
  if (diffDays <= 30) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
  return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
}

const isImage = (dataStr) => {
  if (!dataStr) return false
  return dataStr.startsWith('data:image/')
}

const showImage = (url, title) => {
  imageViewer.value = {
    show: true,
    url,
    title
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
.slide-down { animation: slideDown 0.3s ease-out forwards; }
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
