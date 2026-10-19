<template>
  <div class="px-0 sm:px-6 py-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Nouvelle Contrat</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Édition d'un contrat de location de véhicule</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="space-y-6">
      
      <!-- Agence & Client -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Dossier & Client</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Agence -->
          <div v-if="isAdmin" class="md:col-span-2">
             <label class="block text-[14px] font-bold text-[#fa5b0f] dark:text-[#fa5b0f] mb-2">Agence gestionnaire (Obligatoire)</label>
             <select v-model="formData.agencyId" @change="onAgencyChange" required class="w-full px-4 py-2.5 bg-[#fa5b0f]/5 dark:bg-[#151923] text-gray-900 dark:text-white border border-[#fa5b0f]/30 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] transition-colors">
                <option value="" disabled>-- Choisir l'agence d'abord --</option>
                <option v-for="ag in agencyStore.agencies" :key="ag.id" :value="ag.id">
                   {{ ag.name }}
                </option>
             </select>
          </div>

          <div class="md:col-span-2">
             <label class="flex justify-between text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">
               Sélectionner un client
               <span v-if="formData.clientSignature" class="text-green-600 font-bold text-xs flex items-center gap-1">
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                 Signé
               </span>
             </label>
             <div class="flex gap-2">
                <select v-model="formData.clientId" @change="onClientSelect" required class="flex-1 px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f] transition-colors">
                   <option value="" disabled>-- Choisir un client --</option>
                   <option v-for="c in clientsList" :key="c.id || c.nationalId" :value="c.id || c.nationalId">
                      {{ c.firstName }} {{ c.lastName }} ({{ c.nationalId || c.id }})
                   </option>
                </select>
                <button 
                  v-if="formData.clientId && !formData.clientSignature" 
                  @click="requestSignatureWhatsApp" 
                  type="button" 
                  class="bg-green-500 hover:bg-green-600 text-white px-4 rounded-xl font-bold flex items-center gap-2 transition"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.573-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/></svg>
                  Signature
                </button>
             </div>
          </div>
        </div>
      </div>

      <!-- Informations Contrat -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Informations Contrat</h2>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- N Contrat -->
          <div>
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">N° de contrat</label>
            <div class="flex">
               <input v-model="formData.numero" type="text" required class="w-full px-4 py-2 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-l-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" />
               <button type="button" @click="generateId" class="px-4 bg-[#fa5b0f] text-white rounded-r-xl font-bold hover:bg-[#fa5b0f]/90 text-sm whitespace-nowrap">
                 Générer
               </button>
            </div>
          </div>
          <!-- Date de contrat -->
          <div>
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Date de contrat</label>
            <input v-model="formData.dateContrat" type="datetime-local" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] transition-colors" />
          </div>

          <!-- Lieu -->
          <div>
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Lieu de contrat</label>
            <input v-model="formData.lieuContrat" type="text" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] transition-colors" />
          </div>

          <!-- Dates d'Opération -->
          <div>
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Date de sortie</label>
            <input v-model="formData.dateSortie" type="datetime-local" @change="calculateDuration" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] transition-colors" />
          </div>
          <div>
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Date de retour</label>
            <input v-model="formData.dateRetour" type="datetime-local" @change="calculateDuration" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] transition-colors" />
          </div>
          <div>
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Durée (Jours)</label>
            <input v-model="formData.duree" type="number" readonly class="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-xl text-sm cursor-not-allowed font-bold" />
          </div>

          <!-- Lieux logistique -->
          <div>
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Lieu de livraison</label>
            <input v-model="formData.lieuLivraison" type="text" list="morocco-cities" placeholder="Chercher une ville..." class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] transition-colors" />
          </div>
          <div>
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Lieu de récupération</label>
            <input v-model="formData.lieuRecuperation" type="text" list="morocco-cities" placeholder="Chercher une ville..." class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] transition-colors" />
          </div>
          <div>
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">État du Contrat</label>
            <select v-model="formData.etat" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] transition-colors">
               <option value="En cours">En cours</option>
               <option value="Retournée">Retournée</option>
               <option value="Annulé">Annulé</option>
            </select>
          </div>

          <datalist id="morocco-cities">
            <option value="Casablanca"></option>
            <option value="Rabat"></option>
            <option value="Fès"></option>
            <option value="Marrakech"></option>
            <option value="Agadir"></option>
            <option value="Tanger"></option>
            <option value="Meknès"></option>
            <option value="Oujda"></option>
          </datalist>
        </div>
      </div>

       <!-- Voiture Section -->
       <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Sélection du Véhicule</h2>
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
           <div class="lg:col-span-1">
             <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Matricule (Véhicule)</label>
             <select v-model="formData.carId" @change="onCarSelect" required class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] transition-colors">
                <option value="" disabled>-- Choisir matricule --</option>
                <option v-for="c in carsList" :key="c.id" :value="c.id">
                   {{ c.licensePlate || c.matriculeWWW }} ({{ getCarFullTitle(c) }})
                </option>
             </select>
           </div>
           
           <div class="col-span-1">
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Véhicule</label>
            <input :value="selectedCarName" type="text" readonly class="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/50 text-gray-500 rounded-xl text-sm border-0" />
           </div>

           <div class="col-span-1">
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Km de départ</label>
            <input v-model.number="formData.kmDepart" type="number" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" />
           </div>

           <div class="col-span-1">
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Carburant de départ</label>
            <select v-model="formData.carburantDepart" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]">
               <option value="reserve">Réserve</option>
               <option value="1/4">1/4</option>
               <option value="1/2">1/2</option>
               <option value="3/4">3/4</option>
               <option value="plein">Plein</option>
            </select>
           </div>

           <div class="lg:col-span-4" v-if="formData.carId">
               <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Équipements inclus</label>
               <div class="flex flex-wrap gap-2 mt-2">
                 <span v-for="eq in selectedCarEquipments" :key="eq" class="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
                    {{ eq }}
                 </span>
                 <span v-if="!selectedCarEquipments.length" class="text-sm text-gray-500">Aucun équipement spécial renseigné pour ce véhicule.</span>
               </div>
           </div>
        </div>
      </div>

      <!-- État du Véhicule au Départ -->
      <div v-if="formData.carId" class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
         <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">État du Véhicule au Départ</h2>
         <div class="flex justify-center max-w-lg mx-auto">
            <CarDamageMap v-model="formData.departDamages" />
         </div>
      </div>

      <!-- Tarification -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
         <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Facturation & Paiement</h2>
         <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div>
             <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Prix par jour (DH)</label>
             <input v-model.number="formData.prixParJour" @input="calculateFinance" type="number" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" />
           </div>
           <div>
             <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Total Auto (DH)</label>
             <input :value="formData.total" readonly type="number" class="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/50 text-[#fa5b0f] text-lg rounded-xl border-0 font-bold" />
           </div>
           <div>
             <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Avance (DH)</label>
             <input v-model.number="formData.avance" @input="calculateFinance" type="number" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]" />
           </div>
           <div>
             <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Reste (DH)</label>
             <input :value="formData.reste" readonly type="number" class="w-full px-4 py-2.5 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl border-0 font-bold text-lg" />
           </div>
           <div class="md:col-span-4">
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Type de paiement</label>
            <select v-model="formData.typePaiement" required class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]">
               <option value="Espèces">Espèces</option>
               <option value="Carte Bancaire">Carte Bancaire</option>
               <option value="Chèque">Chèque</option>
               <option value="Virement">Virement</option>
               <option value="TPE">TPE</option>
            </select>
           </div>
         </div>
      </div>

      <!-- Conducteur 2 -->
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        <label class="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" v-model="formData.hasConducteur2" class="w-5 h-5 rounded border-gray-300 text-[#fa5b0f] focus:ring-[#fa5b0f]" />
          <span class="text-lg font-bold text-gray-900 dark:text-white">Deuxième conducteur (Garant)</span>
        </label>
        
        <div v-show="formData.hasConducteur2" class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div>
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Nom Complet</label>
            <input v-model="formData.conducteur2.nom" type="text" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm" />
          </div>
          <div>
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">N° CIN</label>
            <input v-model="formData.conducteur2.cin" type="text" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm" />
          </div>
          <div>
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">N° Permis</label>
            <input v-model="formData.conducteur2.permis" type="text" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm" />
          </div>
          <div>
            <label class="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Téléphone</label>
            <input v-model="formData.conducteur2.tel" type="tel" class="w-full px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#151923] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl text-sm" />
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <button type="submit" class="px-6 py-2.5 bg-[#fa5b0f] text-white text-sm font-bold rounded-xl hover:bg-[#fa5b0f]/90 transition-colors">
          Sauvegarder le contrat
        </button>
        <button type="button" @click="$router.back()" class="px-6 py-2.5 bg-white dark:bg-[#1C1F2B] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Annuler
        </button>
      </div>
    </form>
    
    <!-- Modal Alert Pre-Save -->
    <div v-if="showWarningModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
       <div class="bg-white dark:bg-[#1e2330] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-red-200 dark:border-red-900/30">
          <div class="p-6">
             <div class="flex items-center gap-4 text-red-600 dark:text-red-500 mb-4">
                <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold">Alerte d'Expiration</h3>
             </div>
             
             <ul class="space-y-2 mb-6 text-gray-700 dark:text-gray-300 text-sm">
                <li v-for="(warn, i) in warnings" :key="i" class="flex gap-2">
                   <span class="text-red-500">•</span> {{ warn }}
                </li>
             </ul>
             
             <p class="text-sm border-t border-gray-100 dark:border-gray-800 pt-4 text-gray-500 dark:text-gray-400">
               Êtes-vous sûr de vouloir de créer le contrat avec ces expirations critiques en attente ?
             </p>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-[#151923] flex justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
             <button @click="showWarningModal = false" class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700">Retour</button>
             <button @click="forceSave" class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">Continuer quand même</button>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useClientStore } from '../stores/clientStore'
import { useCarStore } from '../stores/carStore'
import { useUserStore } from '../stores/userStore'
import { useContratStore } from '../stores/contratStore'
import { useAgencyStore } from '../stores/agencyStore'
import { useBrandStore } from '../stores/brandStore'
import { useModelStore } from '../stores/modelStore'
import { useTransactionStore } from '../stores/transactionStore'
import { useSignatureStore } from '../stores/signatureStore'
import CarDamageMap from '../components/CarDamageMap.vue'

const router = useRouter()
const route = useRoute()
const clientStore = useClientStore()
const carStore = useCarStore()
const userStore = useUserStore()
const contratStore = useContratStore()
const agencyStore = useAgencyStore()
const brandStore = useBrandStore()
const modelStore = useModelStore()
const transactionStore = useTransactionStore()
const signatureStore = useSignatureStore()

// helper
const getCarFullTitle = (c) => {
   if (!c) return ''
   const b = brandStore.brands.find(b => b.id === c.brandId)
   const m = modelStore.models.find(m => m.id === c.modelId)
   const bName = b ? b.name : ''
   const mName = m ? m.name : ''
   return `${bName} ${mName}`.trim()
}

const isAdmin = computed(() => userStore.isAdmin)
const effectiveAgencyId = computed(() => (
  formData.value.agencyId ||
  userStore.userAgencyId ||
  userStore.currentAgencyId ||
  ''
))

// References for lists filtered by the active customized form agency
const clientsList = computed(() => {
  const agencyId = effectiveAgencyId.value
  if (!agencyId) return []
  return clientStore.clients.filter(c => c.agencyId === agencyId)
})
const carsList = computed(() => {
  const agencyId = effectiveAgencyId.value
  if (!agencyId) return []
  return carStore.cars.filter(c => c.agencyId === agencyId)
})
const myAgency = computed(() => agencyStore.agencies.find(a => a.id === effectiveAgencyId.value))

const showWarningModal = ref(false)
const warnings = ref([])

// Utility math & date
const todayString = () => {
   const d = new Date()
   d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
   return d.toISOString().slice(0,16)
}

const formData = ref({
  agencyId: userStore.currentAgencyId || userStore.userAgencyId || '',
  clientId: '',
  numero: '',
  dateContrat: todayString(),
  lieuContrat: '',
  dateSortie: todayString(),
  dateRetour: '',
  duree: 0,
  lieuLivraison: 'Agence',
  lieuRecuperation: 'Agence',
  carId: '',
  prixParJour: 0,
  kmDepart: 0,
  carburantDepart: '1/4',
  avance: 0,
  total: 0,
  reste: 0,
  typePaiement: 'Espèces',
  etat: 'En cours',
  departDamages: [],
  retourDamages: [],
  hasConducteur2: false,
  conducteur2: {
    nom: '', cin: '', permis: '', tel: ''
  },
  clientSignature: null
})

// === WhatsApp Signature Capture Core ===
let signatureTimer = null
const activeSignToken = ref(null)

import { onUnmounted } from 'vue'

const generateUUID = () => {
   if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
   }
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
   })
}

const requestSignatureWhatsApp = async () => {
   if (!formData.value.clientId) return
   
   const client = clientsList.value.find(c => (c.id || c.nationalId) === formData.value.clientId)
   if (!client || !client.phoneNumber) {
      alert("Le client n'a pas de numéro de téléphone principal (Téléphone 1) pré-enregistré.")
      return
   }

   // 1. Generate Token & Secure PIN
   const signToken = 'SIG-' + generateUUID()
   activeSignToken.value = signToken
   const pinCode = Math.floor(100000 + Math.random() * 900000).toString() // 6 digits

   try {
      await signatureStore.createSession(signToken, pinCode)
   } catch (e) {
      console.error(e)
      activeSignToken.value = null
      alert("Impossible de créer le lien de signature. Vérifiez votre connexion et réessayez.")
      return
   }
   
   // 2. Build remote URL
   // Uses window.location object which will perfectly resolve to `http://192.168.x.x` if the host runs Vite optimally over LAN.
   const signUrl = `${window.location.origin}/sign/${signToken}`
   
   // 3. Format Phone for WhatsApp (Default to 212 Morocco if starting with 0 and length 10)
   let waPhone = client.phoneNumber.replace(/[^0-9]/g, '')
   if (waPhone.length === 10 && waPhone.startsWith('0')) {
      waPhone = '212' + waPhone.substring(1)
   }

   const message = `Bonjour ${client.firstName},\nVeuillez signer votre contrat de location de véhicule numériquement via ce lien :\n${signUrl}\n\n🔒 *Code Secret pour déverrouiller le document :* ${pinCode}`
   window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`, '_blank')

   // 4. Poll API Relay Server locally
   if (signatureTimer) clearInterval(signatureTimer)
   signatureTimer = setInterval(async () => {
      const session = await signatureStore.getSession(signToken)
      if (session && session.status === 'signed' && session.dataUrl) {
         formData.value.clientSignature = session.dataUrl
         clearInterval(signatureTimer) // stop polling and lock it
      }
   }, 2000)
}

onUnmounted(() => {
   if (signatureTimer) clearInterval(signatureTimer)
})
// ======================================

// Lifecycle
onMounted(async () => {
   await Promise.all([
      agencyStore.initializeFromStorage(),
      clientStore.initializeFromStorage(),
      carStore.initializeFromStorage()
   ])

   if (!formData.value.agencyId) {
      formData.value.agencyId = userStore.userAgencyId || userStore.currentAgencyId || ''
   }

   // Support auto-fill from router queries (e.g. from CarAvailabilityView)
   if (route.query.agencyId) {
      formData.value.agencyId = route.query.agencyId
   }
   if (route.query.carId) {
      formData.value.carId = route.query.carId
   }
   if (route.query.startDate) {
      formData.value.dateSortie = route.query.startDate.slice(0, 16)
   }
   if (route.query.endDate) {
      formData.value.dateRetour = route.query.endDate.slice(0, 16)
   }

   generateId()
   ensureAgencyLieu()
})

const onAgencyChange = () => {
   // Reset dependencies
   formData.value.clientId = ''
   formData.value.carId = ''
   formData.value.prixParJour = 0
   formData.value.kmDepart = 0
   formData.value.departDamages = []
   formData.value.clientSignature = null
   if (signatureTimer) clearInterval(signatureTimer)
   ensureAgencyLieu()
   calculateFinance()
}

// Watch closely carId to preload historical data
import { watch } from 'vue'

watch(() => formData.value.carId, (newCarId) => {
   if (newCarId) {
      const car = carStore.cars.find(c => c.id === newCarId)
      if (car) {
         formData.value.kmDepart = car.mileage || 0
         if (car.damages && Array.isArray(car.damages)) {
            formData.value.departDamages = [...car.damages]
         } else {
            formData.value.departDamages = []
         }
      }
   } else {
      formData.value.departDamages = []
   }
})

const ensureAgencyLieu = () => {
   if (myAgency.value && myAgency.value.location) {
      formData.value.lieuContrat = myAgency.value.location
   }
}

const generateId = () => {
   const randInt = Math.floor(Math.random() * 90000) + 10000;
   const year = new Date().getFullYear();
   formData.value.numero = `${randInt}/${year}`;
}

const calculateDuration = () => {
  if (!formData.value.dateSortie || !formData.value.dateRetour) return;
  const t1 = new Date(formData.value.dateSortie).getTime()
  const t2 = new Date(formData.value.dateRetour).getTime()
  if (t2 <= t1) {
     formData.value.duree = 0
  } else {
     const diffDays = Math.ceil((t2 - t1) / (1000 * 3600 * 24))
     formData.value.duree = diffDays
  }
  calculateFinance()
}

const calculateFinance = () => {
  if (!formData.value.prixParJour) formData.value.prixParJour = 0;
  if (!formData.value.avance) formData.value.avance = 0;
  
  formData.value.total = formData.value.duree * formData.value.prixParJour;
  formData.value.reste = formData.value.total - formData.value.avance;
  if (formData.value.reste < 0) formData.value.reste = 0;
}

const selectedCarName = computed(() => {
   if (!formData.value.carId) return ''
   const c = carsList.value.find(x => x.id === formData.value.carId)
   return getCarFullTitle(c)
})

const selectedCarEquipments = computed(() => {
   if (!formData.value.carId) return []
   const c = carsList.value.find(x => x.id === formData.value.carId)
   if (c && c.equipments) {
      if (Array.isArray(c.equipments)) return c.equipments;
      // if it's an object of booleans
      return Object.keys(c.equipments).filter(k => c.equipments[k])
   }
   return []
})

const onCarSelect = () => {
   const c = carsList.value.find(x => x.id === formData.value.carId)
   if (c) {
      formData.value.prixParJour = c.pricePerDay || 0
      formData.value.kmDepart = c.currentMileage || 0
      if (c.fuelLevel) formData.value.carburantDepart = c.fuelLevel;
      calculateFinance()
   }
}
const onClientSelect = () => {
  // Can expand here later
}


// --- Validation Engine ---
const evalAlerts = () => {
  warnings.value = []
  const c = carsList.value.find(x => x.id === formData.value.carId)
  if (!c) return false;

  const sortirDate = new Date(formData.value.dateSortie)
  const retourDate = new Date(formData.value.dateRetour)
  
  // 1. Vidange Logic
  const kmMoyen = Number(c.averageMileagePerDay || 100) // fallback 100
  const endKm = formData.value.kmDepart + (kmMoyen * formData.value.duree)
  const requiredVidange = Number(c.nextVidangeKm || 0)
  
  if (requiredVidange > 0) {
      const threshold = requiredVidange - 500
      if (endKm >= threshold) {
         warnings.value.push(`La voiture requiert une vidange très prochainement. Kilométrage estimé au retour: ${endKm} km 
           (Prochaine vidange prévue à: ${requiredVidange} km). Limite critique dépassée.`)
      }
  }

  // 2. Assurances check (Depends if assurance exist inside car meta or separate, 
  // currently we'll assume there is `expirationDate` or similar, fallback: assume we query the store if available)
  // Let's implement generic stubs: If you have an `assurances` array mapped.
  if (c.insuranceExpiration) {
     const exp = new Date(c.insuranceExpiration)
     if (exp >= sortirDate && exp <= retourDate) {
        warnings.value.push(`L'assurance du véhicule expire PENDANT la période de location (Le ${exp.toLocaleDateString()}).`)
     } else if (exp < sortirDate) {
        warnings.value.push(`L'assurance du véhicule est DÉJÀ EXPIRÉE.`)
     }
  }

  // 3. Technical Visite
  if (c.technicalVisitExpiration) {
     const tExp = new Date(c.technicalVisitExpiration)
     if (tExp >= sortirDate && tExp <= retourDate) {
        warnings.value.push(`La visite technique du véhicule expire PENDANT la période de location (Le ${tExp.toLocaleDateString()}).`)
     } else if (tExp < sortirDate) {
        warnings.value.push(`La visite technique est DÉJÀ EXPIRÉE.`)
     }
  }

  return warnings.value.length > 0;
}


const executeSave = async () => {
   const c = JSON.parse(JSON.stringify(formData.value))
   // Check and push transaction if Avance provided
   if (c.avance > 0) {
      transactionStore.addTransaction({
         agencyId: c.agencyId,
         type: 'revenue',
         amount: c.avance,
         method: c.typePaiement === 'Espèces' ? 'espece' : 'banque',
         description: `Avance Contrat ${c.numero}`
      })
   }
   contratStore.addContrat(c)

   // Syc back the damages state purely to car physically
   const carRef = carStore.cars.find(voiture => voiture.id === c.carId)
   if (carRef) {
      const nextStatus = (c.etat || '').trim() === 'En cours' ? 'Rented' : 'Available'
      await carStore.updateCar({
         ...carRef,
         damages: c.departDamages ? [...c.departDamages] : [],
         status: nextStatus
      })
   }
   
   // Kill the link token globally to prevent user from accessing it after submission validation
   if (signatureTimer) clearInterval(signatureTimer)

   // Cleanup API session explicitly on save completely destroying the token
   if (activeSignToken.value) {
      signatureStore.removeSession(activeSignToken.value)
      activeSignToken.value = null
   }

   router.push('/contrats')
}

const handleSave = async () => {
   if (evalAlerts()) {
      showWarningModal.value = true;
   } else {
      await executeSave()
   }
}

const forceSave = async () => {
   showWarningModal.value = false;
   await executeSave()
}
</script>
