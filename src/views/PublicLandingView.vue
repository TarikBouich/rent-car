<template>
  <component
    :is="templateComponent"
    v-if="ready"
    :view="view"
    :theme="theme"
    :content="config.content"
  />

  <div v-else class="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8FAFC] px-6 text-center font-[Inter]">
    <template v-if="loading">
      <div class="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-lg font-black text-white">
        RC
      </div>
      <p class="text-sm font-semibold text-slate-500">Chargement de la page...</p>
    </template>

    <template v-else>
      <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
        <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
      </div>
      <div>
        <h1 class="text-xl font-black text-slate-900">
          {{ notFound ? 'Page non disponible' : 'Impossible de charger la page' }}
        </h1>
        <p class="mt-2 max-w-md text-sm text-slate-500">
          {{ notFound
            ? "Cette landing page n'a pas encore été publiée par l'agence."
            : (error || 'Une erreur est survenue. Veuillez réessayer plus tard.') }}
        </p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getLandingTheme } from '../utils/landingThemes';
import { normalizeLandingConfig } from '../utils/landingConfig';
import publicLandingService from '../services/publicLandingService';
import LandingPrestige from '../components/landing/LandingPrestige.vue';
import LandingEditorial from '../components/landing/LandingEditorial.vue';
import LandingBold from '../components/landing/LandingBold.vue';

const route = useRoute();

const loading = ref(true);
const notFound = ref(false);
const error = ref('');
const data = ref(null);

const config = computed(() => (data.value ? normalizeLandingConfig(data.value.config, data.value.agency) : null));

const ready = computed(() => !!config.value && !!data.value);

const theme = computed(() => getLandingTheme(config.value?.theme));

const templateComponent = computed(() => ({
  prestige: LandingPrestige,
  editorial: LandingEditorial,
  bold: LandingBold
}[config.value?.template] || LandingPrestige));

const view = computed(() => {
  if (!data.value) return null;

  const agency = data.value.agency || {};
  const cars = Array.isArray(data.value.cars) ? data.value.cars : [];
  const brands = Object.fromEntries((data.value.brands || []).map(b => [b.id, b.name]));
  const models = Object.fromEntries((data.value.models || []).map(m => [m.id, m.name]));

  let docs = agency.documents || [];
  if (typeof docs === 'string') {
    try { docs = JSON.parse(docs); } catch (e) { docs = []; }
  }
  if (!Array.isArray(docs)) docs = [];

  const logoDoc = docs.find(d => String(d?.agencyType || '').toLowerCase() === 'logo');

  const name = agency.name || 'RC';
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();

  return {
    agency,
    cars,
    availableCars: cars.filter(c => c.status === 'Available'),
    staffCount: data.value.staffCount || 0,
    logo: logoDoc?.dataUrl || '',
    initials,
    managerName: data.value.managerName || '',
    carImage: (car) => {
      if (!car) return '';
      if (Array.isArray(car.images) && car.images.length) return car.images[0];
      return car.image || '';
    },
    brandName: (car) => brands[car?.brandId] || '',
    modelName: (car) => models[car?.modelId] || '',
    price: (value) => (Number(value) || 0).toLocaleString('fr-MA')
  };
});

onMounted(async () => {
  try {
    const response = await publicLandingService.get(route.params.id);
    data.value = response.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      notFound.value = true;
    } else {
      error.value = err?.response?.data?.message || '';
    }
  } finally {
    loading.value = false;
  }
});
</script>
