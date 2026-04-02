<template>
   <div class="print-container bg-gray-100 min-h-screen">
      <div class="no-print p-4 bg-white shadow-md mb-4 flex justify-between items-center text-sm sticky top-0 z-50">
         <div class="flex items-center gap-6">
            <button @click="$router.back()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded font-bold hover:bg-gray-300">Retour</button>
            <div class="flex items-center gap-3">
               <span class="font-bold text-gray-700">Format d'En-tête :</span>
               <label class="flex items-center gap-1 cursor-pointer">
                  <input type="radio" v-model="headerType" value="texte" class="w-4 h-4 text-[#fa5b0f] focus:ring-[#fa5b0f]" />
                  <span>Standard (Texte & Logo)</span>
               </label>
               <label v-if="agencyHeaderDoc" class="flex items-center gap-1 cursor-pointer text-blue-600">
                  <input type="radio" v-model="headerType" value="image" class="w-4 h-4 text-blue-500 focus:ring-blue-500" />
                  <span>En-tête Personnalisé (Image)</span>
               </label>
            </div>
            <div class="flex items-center gap-3 border-l border-gray-300 pl-4 ml-2">
               <span class="font-bold text-gray-700">Options :</span>
               <label class="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" v-model="showPrices" class="w-4 h-4 text-green-600 focus:ring-green-600 rounded" />
                  <span>Afficher les tarifs</span>
               </label>
            </div>
         </div>
         <button @click="handlePrint" class="px-6 py-2 bg-[#1d4ed8] text-white rounded font-bold shadow hover:bg-blue-800">
            Imprimer (Ctrl+P)
         </button>
      </div>

      <div class="a4-page bg-white text-black font-[Arial,sans-serif] mx-auto shadow-2xl flex flex-col relative my-8 text-[11px]" v-if="contrat">
         
         <!-- Header -->
         <div v-if="headerType === 'image' && agencyHeaderDoc" class="w-full mb-4 flex flex-col items-center border-b border-gray-100 pb-2">
            <div class="w-full relative overflow-hidden h-24 flex items-center justify-center mb-1">
               <img :src="agencyHeaderDoc.dataUrl" alt="En-tête de l'Agence" class="max-h-full max-w-full object-contain" />
            </div>
            <div class="text-center flex flex-col items-center justify-center">
               <div class="font-bold text-[#1e3a8a] text-[13px] uppercase">CONTRAT N°: CTR-{{ contrat.numero }}</div>
               <div class="text-gray-700 text-[9px] mt-0.5">Le {{ formatLongDate(contrat.dateContrat) }} à {{ contrat.lieuContrat || agency?.location }}</div>
            </div>
         </div>
         <div v-else class="flex justify-between items-start mb-6 pt-4 border-b border-gray-100 pb-4">
            <div class="w-32 h-20 flex items-center justify-start">
               <img v-if="agencyLogoDoc" :src="agencyLogoDoc.dataUrl" class="max-w-full max-h-full object-contain" />
               <div v-else class="w-16 h-16 bg-blue-100 border border-blue-300 flex items-center justify-center text-xs font-bold text-blue-800 rounded">LOGO</div>
            </div>
        
            <div class="text-center flex flex-col items-center justify-center pt-2">
               <div class="font-bold text-[#1e3a8a] text-[15px] uppercase">CONTRAT N°: CTR-{{ contrat.numero }}</div>
               <div class="text-gray-700 text-[10px] mt-1">Le {{ formatLongDate(contrat.dateContrat) }} à {{ contrat.lieuContrat || agency?.location }}</div>
            </div>

            <div class="text-right leading-tight text-gray-800 max-w-xs">
               <h1 class="text-sm font-bold text-[#1e3a8a]">{{ agency?.name || 'Agence de Location' }}</h1>
               <p>{{ agency?.address || agency?.location || 'Ville Inconnue' }}</p>
               <p>Tél: <span class="font-medium">{{ agency?.phone || '-' }}</span></p>
               <p>Email: <span class="font-medium">{{ agency?.email || '-' }}</span></p>
               <p class="text-[9px] mt-1 text-gray-500">RC: {{ agency?.rc || '-' }} | ICE: {{ agency?.ice || '-' }}</p>
               <p class="text-[9px] text-gray-500">Patente: {{ agency?.patente || '-' }} | IF: {{ agency?.if || '-' }}</p>
            </div>
         </div>

         <!-- VÉHICULE DE LOCATION -->
         <div class="mb-5 relative">
            <h2 class="text-[#1d4ed8] font-bold text-[12px] uppercase mb-1">VÉHICULE DE LOCATION</h2>
            <div class="h-[2px] w-full bg-[#93c5fd] mb-2"></div>
            <div class="grid grid-cols-4 gap-4 mb-2">
               <div><span class="font-bold text-[#1e3a8a] text-[10px]">Libellé</span><br><span class="uppercase">{{ carData?.name || '-' }}</span></div>
               <div><span class="font-bold text-[#1e3a8a] text-[10px]">Matricule</span><br><span class="uppercase tracking-widest font-mono">{{ carData?.licensePlate || '-' }}</span></div>
               <div><span class="font-bold text-[#1e3a8a] text-[10px]">Carburant</span><br><span class="uppercase">{{ carData?.fuel || 'Diesel' }}</span></div>
               <div><span class="font-bold text-[#1e3a8a] text-[10px]">Transmission</span><br><span class="uppercase">{{ carData?.transmission || 'Automatique' }}</span></div>
            </div>
            <div class="flex items-center gap-4 text-[10px] text-gray-800 mt-3 pt-2">
               <span class="font-bold text-[#1e3a8a]">Documents de bord:</span>
               <label class="flex items-center gap-1 cursor-default"><input type="checkbox" checked readonly class="accent-blue-600"> Carte grise</label>
               <label class="flex items-center gap-1 cursor-default"><input type="checkbox" checked readonly class="accent-blue-600"> Assurance</label>
               <label class="flex items-center gap-1 cursor-default"><input type="checkbox" checked readonly class="accent-blue-600"> Vignette</label>
               <label class="flex items-center gap-1 cursor-default"><input type="checkbox" checked readonly class="accent-blue-600"> Visite technique</label>
               <label class="flex items-center gap-1 cursor-default"><input type="checkbox" checked readonly class="accent-blue-600"> Aut. circulation</label>
            </div>
         </div>

         <!-- LOCATAIRES -->
         <div class="grid grid-cols-2 gap-8 mb-6">
            <div>
               <h2 class="text-[#1d4ed8] font-bold text-[12px] uppercase mb-1">LOCATAIRE PRINCIPAL</h2>
               <div class="h-[2px] w-full bg-[#93c5fd] mb-2"></div>
               <div class="grid grid-cols-[110px_1fr] gap-y-1.5 mt-2 text-[10px]">
                  <span class="font-bold text-[#1e3a8a]">Nom & Prénom:</span><span class="uppercase font-bold">{{ client?.firstName }} {{ client?.lastName }}</span>
                  <span class="font-bold text-[#1e3a8a]">Date de naissance:</span><span>{{ formatSimpleDate(client?.birthDate) }}</span>
                  <span class="font-bold text-[#1e3a8a]">CNIE / Passport:</span><span class="uppercase font-medium">{{ client?.nationalId }}</span>
                  <span class="font-bold text-[#1e3a8a]">Expiration CNIE:</span><span>{{ formatSimpleDate(client?.idDeliveryDate) }}</span>
                  <span class="font-bold text-[#1e3a8a]">Permis:</span><span class="uppercase font-medium">{{ client?.licenseNumber }}</span>
                  <span class="font-bold text-[#1e3a8a]">Expiration Permis:</span><span>{{ formatSimpleDate(client?.licenseDeliveryDate) }}</span>
                  <span class="font-bold text-[#1e3a8a]">Téléphone:</span><span class="font-medium">{{ client?.phoneNumber }}</span>
               </div>
            </div>
            <div>
               <h2 class="text-[#1d4ed8] font-bold text-[12px] uppercase mb-1">DEUXIÈME CONDUCTEUR</h2>
               <div class="h-[2px] w-full bg-[#93c5fd] mb-2"></div>
               <div v-if="contrat.hasConducteur2" class="grid grid-cols-[100px_1fr] gap-y-1.5 mt-2 text-[10px]">
                  <span class="font-bold text-[#1e3a8a]">Nom & Prénom:</span><span class="uppercase">{{ contrat.conducteur2?.nom }}</span>
                  <span class="font-bold text-[#1e3a8a]">CNIE:</span><span class="uppercase">{{ contrat.conducteur2?.cin }}</span>
                  <span class="font-bold text-[#1e3a8a]">Permis:</span><span class="uppercase">{{ contrat.conducteur2?.permis }}</span>
                  <span class="font-bold text-[#1e3a8a]">Téléphone:</span><span>{{ contrat.conducteur2?.tel }}</span>
               </div>
               <div v-else class="text-gray-500 italic mt-2 text-[10px]">Non renseigné</div>
            </div>
         </div>

         <!-- DÉTAILS DE LOCATION -->
         <div class="mb-6 h-[250px] relative">
            <h2 class="text-[#1d4ed8] font-bold text-[12px] uppercase mb-1">DÉTAILS DE LOCATION</h2>
            <div class="h-[2px] w-full bg-[#93c5fd] mb-4"></div>
            
            <div class="grid grid-rows-2 h-[200px]">
               <!-- DEPART -->
               <div class="flex items-start border-b border-gray-100 pb-2 relative h-[100px] overflow-visible">
                  <div class="flex items-center gap-2 w-28 border-l-2 border-[#1d4ed8] pl-2 font-bold mb-auto mt-2 tracking-widest text-[#1e3a8a]">DÉPART</div>
                  <!-- Mini Car SVG strictly scoped -->
                  <div class="w-48 h-24 absolute left-[7rem] top-[-1rem] flex items-center justify-center p-0 m-0 print:-webkit-print-color-adjust shrink-0 pointer-events-none transform scale-90 origin-center opacity-80 mix-blend-multiply">
                     <CarDamageMap v-model="contrat.departDamages" :readonly="true" />
                  </div>
                  <!-- Shift text right explicitly -->
                  <div class="w-48 ml-[14rem] mt-2">
                     <div class="font-bold text-[#1e3a8a] text-[9px] mb-0.5">Date & Lieu</div>
                     <div class="font-medium text-[10px]">{{ formatLongDate(contrat.dateSortie) }}</div>
                     <div class="text-[10px] text-gray-700 capitalize break-words">{{ contrat.lieuLivraison }}</div>
                  </div>
                  <div class="flex-1 mt-2">
                     <div class="font-bold text-[#1e3a8a] text-[9px] mb-0.5">Km Départ</div>
                     <div class="mb-2 font-medium text-[10px]">{{ contrat.kmDepart.toLocaleString() }} Km</div>
                     <div class="font-bold text-[#1e3a8a] text-[9px] mb-0.5">Carburant Départ</div>
                     <div class="uppercase text-[10px] font-medium">{{ contrat.carburantDepart }}</div>
                  </div>
               </div>
               
               <!-- RETOUR -->
               <div class="flex items-start pt-2 relative h-[100px] overflow-visible mt-10">
                  <div class="flex items-center gap-2 w-28 border-l-2 border-[#1d4ed8] pl-2 font-bold mb-auto tracking-widest text-[#1e3a8a]">RETOUR</div>
                  <div class="w-48 h-24 absolute left-[7rem] top-[-1.5rem] flex items-center justify-center p-0 m-0 print:-webkit-print-color-adjust shrink-0 pointer-events-none transform scale-90 origin-center opacity-80 mix-blend-multiply">
                     <CarDamageMap v-model="mappedRetourDamages" :readonly="true" />
                  </div>
                  <div class="w-48 ml-[14rem]">
                     <div class="font-bold text-[#1e3a8a] text-[9px] mb-0.5">Date & Lieu</div>
                     <div class="font-medium text-[10px]">{{ formatLongDate(contrat.dateRetour) }}</div>
                     <div class="text-[10px] text-gray-700 capitalize break-words">{{ contrat.lieuRecuperation }}</div>
                  </div>
                  <div class="flex-1">
                     <div class="font-bold text-[#1e3a8a] text-[9px] mb-0.5">Km Retour</div>
                     <div class="mb-2 font-medium text-[10px]">{{ contrat.etat === 'Retournée' ? contrat.kmRetour.toLocaleString() + ' Km' : '...' }}</div>
                     <div class="font-bold text-[#1e3a8a] text-[9px] mb-0.5">Carburant Retour</div>
                     <div class="uppercase text-[10px] font-medium">{{ contrat.etat === 'Retournée' ? contrat.carburantRetour : '...' }}</div>
                  </div>
               </div>
            </div>
         </div>

         <!-- FRAIS DE LOCATION -->
         <div class="mb-10 max-h-[140px]">
            <h2 class="text-[#1d4ed8] font-bold text-[12px] uppercase mb-1">FRAIS DE LOCATION</h2>
            <div class="h-[2px] w-full bg-[#93c5fd] mb-2"></div>
            <table class="w-full text-left uppercase text-[10px]">
               <thead>
                  <tr class="border-b border-[#93c5fd]">
                     <th class="py-2 w-1/2 font-bold text-[#1e3a8a]">ARTICLE</th>
                     <th class="py-2 text-center w-32 font-bold text-[#1e3a8a]">DURÉE</th>
                     <th v-if="showPrices" class="py-2 text-right font-bold text-[#1e3a8a]">PRIX UNITAIRE</th>
                     <th v-if="showPrices" class="py-2 text-right font-bold text-[#1e3a8a]">TOTAL</th>
                  </tr>
               </thead>
               <tbody class="text-gray-800">
                  <tr class="border-b border-gray-100/50">
                     <td class="py-2.5 font-medium">Location du véhicule</td>
                     <td class="py-2.5 text-center">{{ contrat.duree }} jrs</td>
                     <td v-if="showPrices" class="py-2.5 text-right">{{ contrat.prixParJour?.toFixed(2) }} MAD</td>
                     <td v-if="showPrices" class="py-2.5 text-right font-medium">{{ contrat.total?.toFixed(2) }} MAD</td>
                  </tr>
               </tbody>
            </table>
            <div v-if="showPrices" class="flex justify-end mt-4">
               <div class="text-right font-bold text-sm bg-gray-50 border border-gray-100 p-3 rounded min-w-[200px]">
                  TOTAL GÉNÉRAL: {{ contrat.total?.toFixed(2) }} MAD
                  <p v-if="contrat.avance > 0" class="text-[10px] text-gray-500 mt-1 uppercase font-medium line-through decoration-red-400">Avance payée : {{ contrat.avance?.toFixed(2) }} MAD</p>
                  <p v-if="contrat.reste > 0" class="text-[10px] text-red-600 mt-0.5 uppercase font-bold">Reste dû : {{ contrat.reste?.toFixed(2) }} MAD</p>
               </div>
            </div>
         </div>

         <!-- FOOTER SIGNATURES -->
         <div class="mt-auto w-full pt-4">
            <p class="text-[9px] text-gray-700 mb-6 text-center italic">
               En signant, vous acceptez l'intégralité des conditions de location.<br/>
               <b class="text-gray-900 not-italic">NB: Ce contrat ne vaut en aucun cas comme facture.</b>
            </p>
            
            <div class="grid grid-cols-2 text-center relative h-32 items-start">
               <div class="font-bold text-[#1d4ed8] text-[11px] relative h-full flex flex-col items-center">
                  <span>SIGNATURE DU CLIENT</span>
                  <div v-if="contrat.clientSignature" class="mt-2 w-32 h-20 opacity-90 mix-blend-multiply flex items-center justify-center">
                     <img :src="contrat.clientSignature" class="max-w-full max-h-full object-contain mix-blend-multiply scale-150 transform origin-top h-[50px]" />
                  </div>
               </div>
               <div class="absolute inset-y-0 left-1/2 w-[1px] bg-[#93c5fd]"></div>
               <div class="font-bold text-[#1d4ed8] text-[11px] relative h-full flex flex-col items-center">
                  <span>SIGNATURE DE L'AGENCE</span>
                  <div v-if="agencyCachetDoc" class="mt-2 w-28 h-[50px] opacity-80 mix-blend-multiply flex items-center justify-center rounded">
                     <img :src="agencyCachetDoc.dataUrl" class="max-w-full max-h-full object-contain" />
                  </div>
               </div>
            </div>
         </div>

      </div>

      <!-- PAGE 2 : CONDITIONS GÉNÉRALES UPLOADÉES (SI APPLICABLE) -->
      <div v-if="agencyConditionsDoc" class="a4-page bg-white text-black mx-auto shadow-2xl flex items-center justify-center my-8 p-0" style="page-break-before: always;">
         <img :src="agencyConditionsDoc.dataUrl" class="max-w-full max-h-[297mm] object-contain p-4 mix-blend-multiply" />
      </div>

      <div v-else class="text-center py-20 text-red-500 font-bold">
         Contrat introuvable ou erreur de chargement.
      </div>
   </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContratStore } from '../stores/contratStore'
import { useClientStore } from '../stores/clientStore'
import { useCarStore } from '../stores/carStore'
import { useAgencyStore } from '../stores/agencyStore'
import CarDamageMap from '../components/CarDamageMap.vue'

const route = useRoute()
const router = useRouter()

const contratStore = useContratStore()
const clientStore = useClientStore()
const carStore = useCarStore()
const agencyStore = useAgencyStore()

const contratId = route.params.id

const contrat = computed(() => {
   return contratStore.getContratById(contratId)
})

const mappedRetourDamages = computed({
   get() {
      if (!contrat.value) return [];
      return Array.isArray(contrat.value.retourDamages) ? contrat.value.retourDamages : []
   },
   set(val) {}
})

const client = computed(() => {
   if (!contrat.value) return null
   return clientStore.clients.find(c => c.id === contrat.value.clientId || c.nationalId === contrat.value.clientId)
})

const carData = computed(() => {
   if (!contrat.value) return null
   return carStore.cars.find(c => c.id === contrat.value.carId)
})

const agency = computed(() => {
   if (!contrat.value) return null
   return agencyStore.agencies.find(a => a.id === contrat.value.agencyId)
})

const agencyLogoDoc = computed(() => {
   if (!agency.value || !agency.value.documents) return null
   return agency.value.documents.find(d => d.agencyType === 'Logo')
})

const agencyHeaderDoc = computed(() => {
   if (!agency.value || !agency.value.documents) return null
   return agency.value.documents.find(d => d.agencyType === 'En-tête')
})

const agencyCachetDoc = computed(() => {
   if (!agency.value || !agency.value.documents) return null
   return agency.value.documents.find(d => d.agencyType === 'Cachet')
})

const agencyConditionsDoc = computed(() => {
   if (!agency.value || !agency.value.documents) return null
   return agency.value.documents.find(d => d.agencyType === 'Conditions Générales')
})

const headerType = ref('texte')
const showPrices = ref(true)

const formatSimpleDate = (dateStr) => {
   if (!dateStr) return '-'
   return new Date(dateStr).toLocaleDateString('fr-FR')
}

const formatLongDate = (dateStr) => {
   if (!dateStr) return '-'
   return new Date(dateStr).toLocaleString('fr-FR', { 
     day: '2-digit', month: '2-digit', year: 'numeric',
     hour: '2-digit', minute: '2-digit'
   }).replace(',', ' à')
}

const handlePrint = () => {
   window.print()
}

let wasDark = false

onMounted(() => {
   wasDark = document.documentElement.classList.contains('dark')
   if (wasDark) {
      document.documentElement.classList.remove('dark')
   }

   if (!contrat.value) {
      alert("Ce contrat n'existe plus.")
      router.back()
   }
})

onUnmounted(() => {
   if (wasDark) {
      document.documentElement.classList.add('dark')
   }
})
</script>

<style scoped>
.print-container {
   min-height: 100vh;
}
.a4-page {
   width: 210mm;
   height: 297mm;
   background: white;
   box-sizing: border-box;
   padding: 0 10mm;
}

@media print {
   @page {
      margin: 0;
      size: auto;
   }
   body * {
      visibility: hidden;
   }
   .print-container {
      background-color: white !important;
   }
   .no-print {
      display: none !important;
   }
   .a4-page, .a4-page * {
      visibility: visible;
   }
   .a4-page {
      position: absolute;
      left: 0;
      top: 0;
      margin: 0;
      padding: 10mm;
      box-shadow: none;
      width: 100%;
   }
   * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
   }
}
</style>
