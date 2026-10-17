<template>
  <div class="px-0 sm:px-6 py-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-screen text-gray-800 dark:text-gray-200">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Modèles de Véhicules</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Gérez les modèles de vos véhicules</p>
      </div>
      <button @click="showAddModal = true" class="px-6 py-3 bg-[#fa5b0f] hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
        Ajouter un modèle
      </button>
    </div>
    
    <!-- Table list of Models -->
    <div class="bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <!-- Search Bar -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-end items-center bg-white dark:bg-[#1C1F2B]">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-400">Rechercher:</label>
          <input v-model="searchQuery" type="text" class="bg-[#F3F4F6] dark:bg-[#151923] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-1.5 text-sm outline-none focus:border-[#fa5b0f] text-gray-900 dark:text-white">
        </div>
      </div>
      
      <table class="w-full text-left">
        <thead>
          <tr class="bg-[#F3F4F6] dark:bg-[#151923] text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">
            <th class="px-6 py-4 font-bold">Marque</th>
            <th class="px-6 py-4 font-bold">Modèle</th>
            <th class="px-6 py-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
          <tr v-for="model in filteredModels" :key="model.id" class="hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
              <span class="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded font-bold text-xs">{{ getBrandName(model.brandId) }}</span>
            </td>
            <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">{{ model.name }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button @click="openEditModal(model)" class="p-2 bg-orange-50 dark:bg-[#fa5b0f]/10 text-[#fa5b0f] dark:text-[#fa5b0f] rounded-lg hover:bg-[#fa5b0f] hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button @click="deleteModel(model.id)" class="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredModels.length === 0">
            <td colspan="3" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Aucun modèle trouvé</td>
          </tr>
        </tbody>
      </table>
    </div>

<!-- Add Model Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Nouveau modèle</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Marque</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              </div>
              <select v-model="newModel.brandId" class="w-full pl-10 pr-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-3 outline-none focus:border-[#fa5b0f] text-gray-900 dark:text-white appearance-none">
                <option value="" disabled>Sélectionner une marque</option>
                <option v-for="brand in brandStore.brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Nom du modèle</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              </div>
              <input v-model="newModel.name" type="text" placeholder="Ex: Golf 8, Q8..." class="w-full pl-10 pr-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-3 outline-none focus:border-[#fa5b0f] text-gray-900 dark:text-white">
            </div>
          </div>
        </div>
        <div class="flex gap-3 mt-8">
          <button @click="handleCreate" class="flex-1 py-3 bg-[#fa5b0f] hover:bg-orange-600 text-white font-bold rounded-xl transition-all">Valider</button>
          <button @click="showAddModal = false" class="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-all">Annuler</button>
        </div>
      </div>
    </div>
    
    <!-- Edit Model Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Modifier le modèle</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Marque</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              </div>
              <select v-model="editModelData.brandId" class="w-full pl-10 pr-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-3 outline-none focus:border-[#fa5b0f] text-gray-900 dark:text-white appearance-none">
                <option value="" disabled>Sélectionner une marque</option>
                <option v-for="brand in brandStore.brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Nom du modèle</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              </div>
              <input v-model="editModelData.name" type="text" placeholder="Ex: Golf 8, Q8..." class="w-full pl-10 pr-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-3 outline-none focus:border-[#fa5b0f] text-gray-900 dark:text-white">
            </div>
          </div>
        </div>
        <div class="flex gap-3 mt-8">
          <button @click="handleEdit" class="flex-1 py-3 bg-[#fa5b0f] hover:bg-orange-600 text-white font-bold rounded-xl transition-all">Enregistrer</button>
          <button @click="showEditModal = false" class="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-all">Annuler</button>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useModelStore } from '../stores/modelStore';
import { useBrandStore } from '../stores/brandStore';

const modelStore = useModelStore();
const brandStore = useBrandStore();

const showAddModal = ref(false);
const showEditModal = ref(false);
const searchQuery = ref('');
const newModel = ref({ brandId: '', name: '' });
const editModelData = ref({ id: '', brandId: '', name: '' });

const filteredModels = computed(() => {
  return modelStore.models.filter(m => {
    const q = String(searchQuery.value || '').toLowerCase();
    const brandName = getBrandName(m.brandId).toLowerCase();
    return String(m.name).toLowerCase().includes(q) || brandName.includes(q);
  });
});

const getBrandName = (brandId) => {
  const brand = brandStore.getBrandById(brandId);
  return brand ? brand.name : 'Inconnu';
}

const handleCreate = async () => {
  if (!newModel.value.name || !newModel.value.brandId) return;
  try {
    await modelStore.addModel(newModel.value.brandId, newModel.value.name);
    showAddModal.value = false;
    newModel.value = { brandId: '', name: '' };
  } catch (error) {
    const message = error?.response?.data?.message || 'Erreur lors de la création du modèle.';
    alert(message);
  }
};

const openEditModal = (model) => {
  editModelData.value = { ...model };
  showEditModal.value = true;
};

const handleEdit = async () => {
  if (!editModelData.value.name || !editModelData.value.brandId) return;
  try {
    await modelStore.updateModel(editModelData.value);
    showEditModal.value = false;
  } catch (error) {
    const message = error?.response?.data?.message || 'Erreur lors de la modification du modèle.';
    alert(message);
  }
};

const deleteModel = async (id) => {
  if(confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
    try {
      await modelStore.deleteModel(id);
    } catch (error) {
      const message = error?.response?.data?.message || 'Erreur lors de la suppression du modèle.';
      alert(message);
    }
  }
};

onMounted(() => {
  modelStore.initializeFromStorage();
  brandStore.initializeFromStorage();
});
</script>
