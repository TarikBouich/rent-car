<template>
  <div class="p-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-screen text-gray-800 dark:text-gray-200">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Marques & Constructeurs</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Gérez les marques de vos véhicules</p>
      </div>
      <button @click="showAddModal = true" class="px-6 py-3 bg-[#fa5b0f] hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
        Ajouter une marque
      </button>
    </div>
    
    <!-- Table list of Brands -->
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
            <th class="px-6 py-4 font-bold">Nom de la marque</th>
            <th class="px-6 py-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
          <tr v-for="brand in filteredBrands" :key="brand.id" class="hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors">
            <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">{{ brand.name }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="deleteBrand(brand.id)" class="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </td>
          </tr>
          <tr v-if="filteredBrands.length === 0">
            <td colspan="2" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Aucune marque trouvée</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Brand Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-[#1C1F2B] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Nouvelle marque</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Nom de la marque</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              </div>
              <input v-model="newBrand.name" type="text" placeholder="Ex: BMW, Renault..." class="w-full pl-10 pr-4 bg-[#F3F4F6] dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl py-3 outline-none focus:border-[#fa5b0f] text-gray-900 dark:text-white">
            </div>
          </div>
        </div>
        <div class="flex gap-3 mt-8">
          <button @click="handleCreate" class="flex-1 py-3 bg-[#fa5b0f] hover:bg-orange-600 text-white font-bold rounded-xl transition-all">Valider</button>
          <button @click="showAddModal = false" class="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-all">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBrandStore } from '../stores/brandStore';

const brandStore = useBrandStore();

const showAddModal = ref(false);
const searchQuery = ref('');
const newBrand = ref({ name: '' });

const filteredBrands = computed(() => {
  return brandStore.brands.filter(b => {
    const q = String(searchQuery.value || '').toLowerCase();
    return String(b.name).toLowerCase().includes(q);
  });
});

const handleCreate = async () => {
  if (!newBrand.value.name) return;
  try {
    await brandStore.addBrand(newBrand.value.name);
    showAddModal.value = false;
    newBrand.value = { name: '' };
  } catch (error) {
    const message = error?.response?.data?.message || 'Erreur lors de la création de la marque.';
    alert(message);
  }
};

const deleteBrand = async (id) => {
  if(confirm('Êtes-vous sûr de vouloir supprimer cette marque ?')) {
    try {
      await brandStore.deleteBrand(id);
    } catch (error) {
      const message = error?.response?.data?.message || 'Erreur lors de la suppression de la marque.';
      alert(message);
    }
  }
};

onMounted(() => {
  brandStore.initializeFromStorage();
});
</script>
