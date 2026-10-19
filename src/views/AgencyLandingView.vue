<template>
  <component
    :is="templateComponent"
    v-if="config && agency"
    :view="view"
    :theme="theme"
    :content="config.content"
  />

  <div v-else class="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F8FAFC] font-[Inter]">
    <div class="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-lg font-black text-white">
      RC
    </div>
    <p class="text-sm font-semibold text-slate-500">Chargement de l'agence...</p>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getLandingTheme } from '../utils/landingThemes';
import {
  landingDraftKey,
  landingLiveKey,
  normalizeLandingConfig
} from '../utils/landingConfig';
import { loadStateJson } from '../services/stateJsonService';
import { useAgencyStore } from '../stores/agencyStore';
import { useCarStore } from '../stores/carStore';
import { useBrandStore } from '../stores/brandStore';
import { useModelStore } from '../stores/modelStore';
import { useUserStore } from '../stores/userStore';
import LandingPrestige from '../components/landing/LandingPrestige.vue';
import LandingEditorial from '../components/landing/LandingEditorial.vue';
import LandingBold from '../components/landing/LandingBold.vue';

const route = useRoute();
const router = useRouter();

const agencyStore = useAgencyStore();
const carStore = useCarStore();
const brandStore = useBrandStore();
const modelStore = useModelStore();
const userStore = useUserStore();

const agency = ref(null);
const config = ref(null);

const isPreview = computed(() => route.query.preview === '1');

const templateComponent = computed(() => ({
  prestige: LandingPrestige,
  editorial: LandingEditorial,
  bold: LandingBold
}[config.value?.template] || LandingPrestige));

const theme = computed(() => getLandingTheme(config.value?.theme));

const initials = computed(() => {
  const name = agency.value?.name || 'RC';
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
});

const logo = computed(() => {
  const docs = agency.value?.documents || [];
  const found = docs.find(d => String(d.agencyType || '').toLowerCase() === 'logo');
  return found?.dataUrl || '';
});

const managerName = computed(() => {
  const id = agency.value?.gerantId;
  if (!id) return '';
  const manager = userStore.getUserById?.(id) || userStore.users.find(u => u.id === id);
  if (!manager) return '';
  return [manager.firstName, manager.lastName].filter(Boolean).join(' ') || manager.name || '';
});

const view = computed(() => {
  const agencyId = route.params.id;
  const cars = carStore.cars.filter(c => c.agencyId === agencyId);

  return {
    agency: agency.value || {},
    cars,
    availableCars: cars.filter(c => c.status === 'Available'),
    staffCount: userStore.users.filter(u => u.agencyId === agencyId).length,
    logo: logo.value,
    initials: initials.value,
    managerName: managerName.value,
    carImage: (car) => {
      if (!car) return '';
      if (Array.isArray(car.images) && car.images.length) return car.images[0];
      return car.image || '';
    },
    brandName: (car) => brandStore.getBrandById(car?.brandId)?.name || '',
    modelName: (car) => modelStore.getModelById(car?.modelId)?.name || '',
    price: (value) => (Number(value) || 0).toLocaleString('fr-MA')
  };
});

const onConfigMessage = (event) => {
  if (event.origin !== window.location.origin) return;
  const data = event.data || {};
  if (data.type === 'landing-config') {
    config.value = normalizeLandingConfig(data.config, agency.value || {});
  }
};

onMounted(async () => {
  await Promise.all([
    agencyStore.initializeFromStorage(),
    carStore.initializeFromStorage(),
    brandStore.initializeFromStorage(),
    modelStore.initializeFromStorage(),
    userStore.initializeFromStorage()
  ]);

  const found = agencyStore.getAgencyById(route.params.id);
  if (!found) {
    router.replace('/agencies');
    return;
  }
  agency.value = found;

  const [draft, live] = await Promise.all([
    loadStateJson(landingDraftKey(found.id), null),
    loadStateJson(landingLiveKey(found.id), null)
  ]);

  const source = isPreview.value ? (draft || live) : live;
  let next = normalizeLandingConfig(source, found);

  if (route.query.theme) {
    next = normalizeLandingConfig({ ...next, theme: route.query.theme }, found);
  }

  config.value = next;
  window.addEventListener('message', onConfigMessage);
});

onBeforeUnmount(() => {
  window.removeEventListener('message', onConfigMessage);
});
</script>
