<template>
  <div class="p-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    
    <!-- Top Bar -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Agences d'Assurance</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez la liste de vos courtiers et compagnies d'assurance</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="relative">
          <input
            type="search"
            class="pl-10 pr-4 py-2 bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]"
            placeholder="Rechercher une agence..."
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
          Ajouter Agence
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th class="p-4 w-12 text-center">#</th>
              <th class="p-4">Nom de l'Agence</th>
              <th class="p-4">Téléphone de Contact</th>
              <th class="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <tr v-for="(ag, idx) in filteredAgencies" :key="ag.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
              <td class="p-4 text-center text-sm text-gray-500">{{ idx + 1 }}</td>
              <td class="p-4 text-sm font-bold text-gray-900 dark:text-white">{{ ag.name }}</td>
              <td class="p-4 text-sm text-gray-700 dark:text-gray-300">{{ ag.contactTel || '-' }}</td>
              <td class="p-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="editAgency(ag)" class="p-2 text-emerald-500 hover:text-emerald-600 transition-colors" title="Modifier">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button @click="deleteAgency(ag.id)" class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Supprimer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredAgencies.length === 0">
              <td colspan="4" class="p-8 text-center text-gray-500 dark:text-gray-400">
                Aucune agence d'assurance trouvée.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white dark:bg-[#1E2330] rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#1C1C1C]/50">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ modalMode === 'add' ? "Création Agence d'Assurance" : "Modifier l'Agence" }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <form @submit.prevent="saveAgency" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de l'Agence <span class="text-red-500">*</span></label>
              <input type="text" v-model="formData.name" required placeholder="Ex: AXA Assurance" class="w-full px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Agence (Tél)</label>
              <input type="tel" v-model="formData.contactTel" placeholder="Ex: 0522..." class="w-full px-4 py-2 bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fa5b0f]" />
            </div>
          </form>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-[#1C1C1C]/50">
          <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            Annuler
          </button>
          <button @click="saveAgency" class="px-6 py-2 bg-[#fa5b0f] text-white text-sm font-medium rounded-lg hover:bg-orange-500 transition-colors shadow-sm">
            Enregistrer
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAssuranceAgencyStore } from '../stores/assuranceAgencyStore'

const agencyStore = useAssuranceAgencyStore()

onMounted(() => {
  agencyStore.initializeFromStorage()
})

const searchQuery = ref('')
const showModal = ref(false)
const modalMode = ref('add') // 'add' or 'edit'
const editId = ref(null)

const formData = ref({
  name: '',
  contactTel: ''
})

const filteredAgencies = computed(() => {
  if (!searchQuery.value) return agencyStore.agencies
  const q = searchQuery.value.toLowerCase()
  return agencyStore.agencies.filter(a => a.name.toLowerCase().includes(q))
})

const openAddModal = () => {
  modalMode.value = 'add'
  editId.value = null
  formData.value = { name: '', contactTel: '' }
  showModal.value = true
}

const editAgency = (agency) => {
  modalMode.value = 'edit'
  editId.value = agency.id
  formData.value = { name: agency.name, contactTel: agency.contactTel }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveAgency = () => {
  if (!formData.value.name.trim()) return

  if (modalMode.value === 'add') {
    agencyStore.addAgency({
      name: formData.value.name.trim(),
      contactTel: formData.value.contactTel
    })
  } else {
    agencyStore.updateAgency({
      id: editId.value,
      name: formData.value.name.trim(),
      contactTel: formData.value.contactTel
    })
  }
  closeModal()
}

const deleteAgency = (id) => {
  if (confirm('Voulez-vous vraiment supprimer cette agence ? Les assurances liées pourraient devenir orphelines.')) {
    agencyStore.deleteAgency(id)
  }
}
</script>
