<template>
  <div class="px-0 sm:px-6 py-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Supervision du Système</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400">Consultez le journal des activités et restaurez les données supprimées.</p>
    </div>

    <!-- Main Card -->
    <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
      <!-- Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-800">
        <button
          v-for="(label, tab) in tabs"
          :key="tab"
          @click="activeTab = tab"
          class="px-6 py-4 text-sm font-medium focus:outline-none transition-colors relative"
          :class="activeTab === tab ? 'text-[#fa5b0f]' : 'text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800'"
        >
          {{ label }}
          <!-- Active Indicator -->
          <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fa5b0f]"></div>
        </button>
      </div>

      <!-- Tab Content: Journal d'Activité -->
      <div v-show="activeTab === 'activity'" class="flex-1 flex flex-col">
        <!-- Filters Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1C1C1C] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700 dark:text-gray-300 font-medium">Période:</span>
            <div class="flex items-center gap-2">
              <input type="date" class="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-white focus:outline-none focus:border-[#fa5b0f] focus:ring-1 focus:ring-[#fa5b0f] bg-white dark:bg-transparent">
              <span class="text-gray-500 dark:text-gray-400">au</span>
              <input type="date" class="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-white focus:outline-none focus:border-[#fa5b0f] focus:ring-1 focus:ring-[#fa5b0f] bg-white dark:bg-transparent">
            </div>
            <button class="px-4 py-1.5 bg-[#fa5b0f] text-white text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors shadow-sm ml-2">
              Filtrer
            </button>
          </div>
          
          <div class="relative">
             <input type="search" placeholder="Rechercher une action..." class="w-full md:w-64 pl-10 pr-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white focus:outline-none focus:border-[#fa5b0f] focus:ring-1 focus:ring-[#fa5b0f] bg-white dark:bg-transparent">
             <div class="absolute left-3 top-2 text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
          </div>
        </div>

        <!-- Activity Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr class="bg-white dark:bg-[#1C1C1C]">
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-left">Date & Heure</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-left">Utilisateur</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-left">Action</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-left min-w-[250px]">Description</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-left">Adresse IP</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800 bg-white dark:bg-[#1E2330]">
              <tr v-for="log in activityLogs" :key="log.id" class="hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors text-[13px] text-gray-700 dark:text-gray-300">
                <td class="px-4 py-3 text-gray-900 dark:text-white">{{ log.date }} <span class="text-gray-900 dark:text-white ml-1">{{ log.time }}</span></td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-yellow-500/20 text-[#fa5b0f] border border-gray-300 dark:border-gray-700 flex items-center justify-center text-[10px] font-bold">
                       {{ getInitials(log.user) }}
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">{{ log.user }}</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border" :class="getActionBadgeClass(log.type)">
                    {{ log.action }}
                  </span>
                </td>
                <td class="px-4 py-3 truncate max-w-xs text-gray-900 dark:text-white" :title="log.description">{{ log.description }}</td>
                <td class="px-4 py-3">
                  <code class="px-2 py-1 bg-white dark:bg-[#1C1C1C] text-gray-700 dark:text-gray-300 rounded text-xs border border-gray-300 dark:border-gray-700 font-mono tracking-tight">{{ log.ip }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab Content: Données supprimées -->
      <div v-show="activeTab === 'deleted'" class="flex-1 flex flex-col">
         <!-- Filters Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1C1C1C] flex items-center justify-between gap-4">
           <div class="relative">
             <input type="search" placeholder="Rechercher un élément supprimé..." class="w-full md:w-80 pl-10 pr-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white focus:outline-none focus:border-[#fa5b0f] focus:ring-1 focus:ring-[#fa5b0f] bg-white dark:bg-transparent">
             <div class="absolute left-3 top-2 text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
          </div>
        </div>

        <!-- Deleted Data Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr class="bg-white dark:bg-[#1C1C1C]">
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-left">Type d'élément</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-left">Détails</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-left">Supprimé par</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-left">Date de suppression</th>
                <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800 bg-white dark:bg-[#1E2330]">
              <tr v-for="item in deletedItems" :key="item.id" class="transition-colors text-[13px] hover:bg-gray-200 dark:hover:bg-gray-800/50">
                <td class="px-4 py-3 font-semibold text-gray-900 dark:text-white">{{ item.type }}</td>
                <td class="px-4 py-3 text-gray-900 dark:text-white">{{ item.details }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <div class="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                       {{ getInitials(item.deletedBy) }}
                    </div>
                    <span>{{ item.deletedBy }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-900 dark:text-white">{{ item.date }}</td>
                <td class="px-4 py-3 text-right">
                  <button 
                    class="inline-flex items-center justify-center p-1.5 text-[#3B82F6] hover:bg-blue-900/20 rounded transition-colors"
                    title="Restaurer"
                    @click="restoreItem(item)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                </td>
              </tr>
              <!-- Empty State if no deleted items -->
              <tr v-if="deletedItems.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-600 dark:text-gray-400 text-sm bg-white dark:bg-[#1E2330]">
                  Aucune donnée supprimée récemment.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('activity')

const tabs = {
  activity: "Journal d'Activité",
  deleted: "Données supprimées"
}

// Mock Activity Data
const activityLogs = ref([
  { id: 1, date: '10 Mars 2026', time: '08:15', user: 'Tarik B.', action: 'Connexion', type: 'login', description: 'Connexion réussie au système', ip: '192.168.1.42' },
  { id: 2, date: '10 Mars 2026', time: '09:02', user: 'Alice G.', action: 'Création', type: 'create', description: 'Nouveau client ajouté : Martin Dupont', ip: '10.0.0.12' },
  { id: 3, date: '10 Mars 2026', time: '09:45', user: 'Bob S.', action: 'Mise à jour', type: 'update', description: 'Changement de statut véhicule #R-Clio-1 (En Location)', ip: '192.168.1.105' },
  { id: 4, date: '09 Mars 2026', time: '14:20', user: 'Tarik B.', action: 'Création', type: 'create', description: 'Nouveau compte agent généré (david@rentcar.ma)', ip: '192.168.1.42' },
  { id: 5, date: '09 Mars 2026', time: '16:50', user: 'Alice G.', action: 'Mise à jour', type: 'update', description: 'Modification du prix par jour pour Peugeot 208', ip: '10.0.0.12' },
  { id: 6, date: '08 Mars 2026', time: '11:10', user: 'Bob S.', action: 'Connexion', type: 'login', description: 'Connexion réussie au système', ip: '192.168.1.105' },
])

// Mock Deleted Items Data
const deletedItems = ref([
  { id: 101, type: 'Client', details: 'Jean Michel - jm@email.com', deletedBy: 'Tarik B.', date: '09 Mars 2026, 17:30' },
  { id: 102, type: 'Contrat', details: 'Location #LOC-5042 - Audi A3', deletedBy: 'Alice G.', date: '05 Mars 2026, 09:12' },
  { id: 103, type: 'Véhicule', details: 'Dacia Logan - Matricule 1234-A-56', deletedBy: 'Tarik B.', date: '01 Mars 2026, 10:45' },
])

const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getActionBadgeClass = (type) => {
  switch (type) {
    case 'create':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'update':
      return 'bg-blue-100 text-[#2563EB] border-blue-200'
    case 'login':
      return 'bg-orange-100 text-orange-700 border-orange-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const restoreItem = (item) => {
  if(confirm(`Souhaitez-vous vraiment restaurer l'élément : ${item.details} ?`)) {
    deletedItems.value = deletedItems.value.filter(i => i.id !== item.id)
    alert('Élément restauré avec succès.')
  }
}
</script>
