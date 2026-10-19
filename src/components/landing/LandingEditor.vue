<template>
  <div class="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm sm:p-4">
    <div class="flex h-[96vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#1B202C]">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div class="flex min-w-0 items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#fa5b0f] dark:bg-orange-500/10">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2.5l-4.5 4.5L20 16.5V19a1 1 0 01-1 1H5a1 1 0 01-1-1v-2.5L8.5 12 4 7.5V5z"/>
            </svg>
          </div>
          <div class="min-w-0">
            <h2 class="truncate text-base font-bold text-slate-900 dark:text-white">Éditeur de landing page</h2>
            <p class="truncate text-xs text-slate-500 dark:text-slate-400">
              {{ agency?.name || 'Agence' }}
              <span v-if="dirty" class="ml-1 font-semibold text-amber-600">· modifications non enregistrées</span>
              <span v-else-if="publishedAt" class="ml-1 font-semibold text-emerald-600">· publiée</span>
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Device toggle -->
          <div class="flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
            <button
              class="rounded-md px-2.5 py-1.5 text-xs font-bold transition"
              :class="device === 'desktop' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'"
              title="Aperçu bureau"
              @click="device = 'desktop'"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </button>
            <button
              class="rounded-md px-2.5 py-1.5 text-xs font-bold transition"
              :class="device === 'mobile' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'"
              title="Aperçu mobile"
              @click="device = 'mobile'"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            </button>
          </div>

          <a
            :href="liveUrl"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300"
          >
            Aperçu
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>

          <div class="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
            <a
              :href="publicUrl"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 transition hover:text-slate-900 dark:text-slate-300"
              :title="publishedAt ? 'Ouvrir la page publique' : 'Publiez la page pour la rendre accessible'"
            >
              Page publique
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
            <button
              class="border-l border-slate-200 px-2 py-2 text-slate-500 transition hover:text-slate-900 dark:border-slate-700 dark:text-slate-400"
              title="Copier le lien public"
              @click="copyPublicUrl"
            >
              <svg v-if="!copied" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              <svg v-else class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </button>
          </div>

          <button
            class="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
            :disabled="saving || !config"
            @click="saveDraft"
          >
            <svg v-if="!saving" class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1-4l-4 4m0 0L8 3m4 4V3"/></svg>
            <span>{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</span>
          </button>

          <button
            class="flex items-center gap-1.5 rounded-lg bg-[#fa5b0f] px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-600 disabled:opacity-50"
            :disabled="saving || !config"
            @click="publish"
          >
            <svg v-if="!saving" class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            {{ saving ? 'Publication...' : 'Publier' }}
          </button>

          <button
            class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Fermer"
            @click="requestClose"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- Feedback -->
      <div v-if="message" class="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold dark:border-slate-800 dark:bg-slate-900/40">
        <span :class="messageType === 'error' ? 'text-red-600' : 'text-emerald-600'">{{ message }}</span>
        <button class="text-slate-400 hover:text-slate-600" @click="message = ''">✕</button>
      </div>

      <!-- Body -->
      <div v-if="config" class="flex min-h-0 flex-1 flex-col lg:flex-row">
        <!-- Controls -->
        <aside class="flex w-full shrink-0 flex-col border-b border-slate-200 lg:w-[360px] lg:border-b-0 lg:border-r dark:border-slate-800">
          <div class="grid grid-cols-4 border-b border-slate-200 text-[11px] font-bold dark:border-slate-800">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="border-b-2 px-2 py-3 transition"
              :class="activeTab === tab.id ? 'border-[#fa5b0f] text-[#fa5b0f]' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto p-4">
            <!-- Templates -->
            <div v-if="activeTab === 'template'" class="space-y-3">
              <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Modèle de page</p>
              <button
                v-for="tpl in templates"
                :key="tpl.id"
                class="w-full rounded-xl border-2 p-3 text-left transition"
                :class="config.template === tpl.id ? 'border-[#fa5b0f] bg-orange-50/60 dark:bg-orange-500/10' : 'border-slate-200 hover:border-slate-400 dark:border-slate-700'"
                @click="config.template = tpl.id"
              >
                <div class="mb-2 h-16 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-800">
                  <div v-if="tpl.id === 'prestige'" class="grid h-full grid-cols-2 gap-1">
                    <div class="space-y-1">
                      <div class="h-2 w-3/4 rounded bg-slate-800"></div>
                      <div class="h-1.5 w-full rounded bg-slate-300"></div>
                      <div class="h-1.5 w-2/3 rounded bg-slate-300"></div>
                      <div class="mt-1 h-2 w-1/2 rounded bg-[#fa5b0f]"></div>
                    </div>
                    <div class="rounded bg-gradient-to-br from-sky-500 to-sky-800"></div>
                  </div>
                  <div v-else-if="tpl.id === 'editorial'" class="flex h-full gap-1">
                    <div class="flex-1 space-y-1 py-1">
                      <div class="h-1 w-1/3 rounded bg-slate-400"></div>
                      <div class="h-3 w-full rounded bg-slate-800"></div>
                      <div class="h-3 w-4/5 rounded bg-slate-800"></div>
                      <div class="h-1 w-1/2 rounded bg-slate-300"></div>
                    </div>
                    <div class="w-1/3 rounded bg-neutral-300"></div>
                  </div>
                  <div v-else class="grid h-full grid-cols-3 gap-1 rounded bg-slate-900 p-1">
                    <div class="col-span-2 rounded bg-gradient-to-br from-slate-700 to-slate-800"></div>
                    <div class="space-y-1">
                      <div class="h-1/2 rounded bg-[#fa5b0f]/70"></div>
                      <div class="h-[45%] rounded bg-slate-700"></div>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-bold text-slate-900 dark:text-white">{{ tpl.name }}</span>
                  <span v-if="config.template === tpl.id" class="text-[10px] font-black uppercase text-[#fa5b0f]">Actif</span>
                </div>
                <p class="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">{{ tpl.description }}</p>
              </button>
            </div>

            <!-- Colors -->
            <div v-else-if="activeTab === 'colors'" class="space-y-4">
              <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Couleurs</p>
              <button
                v-for="t in themes"
                :key="t.id"
                class="flex w-full items-center gap-3 rounded-xl border-2 p-3 transition"
                :class="config.theme === t.id ? 'border-[#fa5b0f] bg-orange-50/60 dark:bg-orange-500/10' : 'border-slate-200 hover:border-slate-400 dark:border-slate-700'"
                @click="config.theme = t.id"
              >
                <span class="h-10 w-10 shrink-0 rounded-lg shadow-inner" :style="{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }"></span>
                <span class="flex-1 text-left">
                  <span class="block text-sm font-bold text-slate-900 dark:text-white">{{ t.name }}</span>
                  <span class="block text-[11px] text-slate-500 dark:text-slate-400">{{ t.primary }} · {{ t.dark }}</span>
                </span>
                <svg v-if="config.theme === t.id" class="h-5 w-5 text-[#fa5b0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </button>
              <p class="rounded-lg bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                La couleur s'applique aux boutons, accents et dégradés du modèle choisi.
              </p>
            </div>

            <!-- Content -->
            <div v-else-if="activeTab === 'content'" class="space-y-5">
              <div>
                <p class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Héro</p>
                <div class="space-y-2">
                  <input v-model="config.content.badge" placeholder="Badge" class="field" />
                  <input v-model="config.content.heroTitle" placeholder="Titre principal" class="field" />
                  <input v-model="config.content.heroHighlight" placeholder="Mot mis en avant" class="field" />
                  <textarea v-model="config.content.heroSubtitle" rows="3" placeholder="Description" class="field"></textarea>
                  <div class="grid grid-cols-2 gap-2">
                    <input v-model="config.content.primaryCta" placeholder="Bouton principal" class="field" />
                    <input v-model="config.content.secondaryCta" placeholder="Bouton secondaire" class="field" />
                  </div>
                </div>
              </div>

              <div>
                <p class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Flotte</p>
                <div class="space-y-2">
                  <input v-model="config.content.fleetTitle" placeholder="Titre flotte" class="field" />
                  <textarea v-model="config.content.fleetSubtitle" rows="2" placeholder="Description flotte" class="field"></textarea>
                </div>
              </div>

              <div>
                <p class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">À propos</p>
                <div class="space-y-2">
                  <input v-model="config.content.aboutTitle" placeholder="Sur-titre" class="field" />
                  <input v-model="config.content.aboutHeading" placeholder="Titre" class="field" />
                  <textarea v-model="config.content.aboutText" rows="3" placeholder="Texte de présentation" class="field"></textarea>
                </div>
              </div>

              <div>
                <p class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Points forts</p>
                <div v-for="(feature, index) in config.content.features" :key="index" class="mb-2 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                  <input v-model="feature.title" :placeholder="`Titre ${index + 1}`" class="field mb-1" />
                  <input v-model="feature.text" :placeholder="`Texte ${index + 1}`" class="field" />
                </div>
              </div>

              <div>
                <p class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Contact</p>
                <div class="space-y-2">
                  <input v-model="config.content.contactTitle" placeholder="Titre contact" class="field" />
                  <textarea v-model="config.content.contactText" rows="2" placeholder="Texte contact" class="field"></textarea>
                  <input v-model="config.content.phone" placeholder="Téléphone" class="field" />
                  <input v-model="config.content.whatsapp" placeholder="WhatsApp (ex: 0612345678)" class="field" />
                  <input v-model="config.content.email" placeholder="Email" class="field" />
                  <input v-model="config.content.address" placeholder="Adresse" class="field" />
                </div>
              </div>
            </div>

            <!-- Sections -->
            <div v-else class="space-y-3">
              <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sections affichées</p>
              <label v-for="section in sections" :key="section.key" class="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <span>
                  <span class="block text-sm font-bold text-slate-900 dark:text-white">{{ section.label }}</span>
                  <span class="block text-[11px] text-slate-500 dark:text-slate-400">{{ section.hint }}</span>
                </span>
                <input v-model="config.content[section.key]" type="checkbox" class="h-5 w-5 accent-[#fa5b0f]" />
              </label>

              <button class="mt-4 w-full rounded-lg border border-red-200 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50" @click="resetContent">
                Réinitialiser le contenu
              </button>
            </div>
          </div>
        </aside>

        <!-- Preview -->
        <div class="flex min-h-0 flex-1 flex-col bg-slate-200 p-3 dark:bg-[#121620]">
          <div class="mb-2 flex items-center justify-between px-1">
            <div class="flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-full bg-red-400"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
            </div>
            <span class="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">/agencies/{{ agencyId }}/landing</span>
            <span class="rounded bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {{ templates.find(t => t.id === config.template)?.name }}
            </span>
          </div>

          <div class="flex min-h-0 flex-1 justify-center overflow-hidden">
            <iframe
              ref="frame"
              :src="previewUrl"
              :style="{ width: device === 'mobile' ? '390px' : '100%' }"
              class="h-full rounded-xl border border-slate-300 bg-white shadow-sm transition-all duration-300 dark:border-slate-700"
              title="Aperçu de la landing page"
              @load="sendConfig"
            ></iframe>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-1 items-center justify-center">
        <p class="text-sm font-semibold text-slate-500">Chargement de l'éditeur...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { LANDING_THEMES } from '../../utils/landingThemes';
import {
  LANDING_TEMPLATES,
  defaultLandingConfig,
  landingDraftKey,
  landingLiveKey,
  normalizeLandingConfig
} from '../../utils/landingConfig';
import { loadStateJson } from '../../services/stateJsonService';
import stateService from '../../services/stateService';

const props = defineProps({
  agency: { type: Object, default: null },
  agencyId: { type: [String, Number], required: true }
});
const emit = defineEmits(['close']);

const templates = LANDING_TEMPLATES;
const themes = LANDING_THEMES;

const tabs = [
  { id: 'template', label: 'Modèle' },
  { id: 'colors', label: 'Couleurs' },
  { id: 'content', label: 'Contenu' },
  { id: 'sections', label: 'Sections' }
];

const sections = [
  { key: 'showStats', label: 'Statistiques', hint: 'Nombre de véhicules et disponibilité' },
  { key: 'showFleet', label: 'Flotte', hint: 'Liste des véhicules à louer' },
  { key: 'showAbout', label: 'À propos', hint: 'Présentation et informations agence' },
  { key: 'showContact', label: 'Contact', hint: 'Bloc contact et boutons d’appel' }
];

const activeTab = ref('template');
const device = ref('desktop');
const config = ref(null);
const savedJson = ref('');
const saving = ref(false);
const message = ref('');
const messageType = ref('success');
const frame = ref(null);
const publishedAt = ref('');

const previewUrl = computed(() => `/agencies/${props.agencyId}/landing?preview=1&embed=1`);
const liveUrl = computed(() => `/agencies/${props.agencyId}/landing?preview=1`);
const publicUrl = computed(() => `${window.location.origin}/p/${encodeURIComponent(props.agencyId)}`);
const copied = ref(false);
const dirty = computed(() => !!config.value && JSON.stringify(config.value) !== savedJson.value);

const notify = (text, type = 'success') => {
  message.value = text;
  messageType.value = type;
};

const sendConfig = () => {
  frame.value?.contentWindow?.postMessage(
    { type: 'landing-config', config: config.value },
    window.location.origin
  );
};

watch(config, () => sendConfig(), { deep: true });

const load = async () => {
  const [draft, live] = await Promise.all([
    loadStateJson(landingDraftKey(props.agencyId), null),
    loadStateJson(landingLiveKey(props.agencyId), null)
  ]);
  const source = draft || live;
  config.value = normalizeLandingConfig(source, props.agency || {});
  savedJson.value = JSON.stringify(config.value);
  publishedAt.value = live?.publishedAt || '';
};

const persist = async (key) => {
  await stateService.setByKey(key, JSON.stringify(config.value));
};

const saveDraft = async () => {
  if (!config.value) return;
  saving.value = true;
  message.value = '';
  try {
    await persist(landingDraftKey(props.agencyId));
    savedJson.value = JSON.stringify(config.value);
    notify('Brouillon enregistré.');
  } catch (error) {
    notify("Impossible d'enregistrer le brouillon.", 'error');
  } finally {
    saving.value = false;
  }
};

const publish = async () => {
  if (!config.value) return;
  saving.value = true;
  message.value = '';
  try {
    const payload = { ...config.value, publishedAt: new Date().toISOString() };
    await persist(landingDraftKey(props.agencyId));
    await stateService.setByKey(landingLiveKey(props.agencyId), JSON.stringify(payload));
    config.value = payload;
    savedJson.value = JSON.stringify(payload);
    publishedAt.value = payload.publishedAt;
    notify('Landing page publiée.');
  } catch (error) {
    notify('Impossible de publier la landing page.', 'error');
  } finally {
    saving.value = false;
  }
};

const resetContent = () => {
  if (!confirm('Réinitialiser le contenu de la page ? Les modifications non enregistrées seront perdues.')) return;
  const defaults = defaultLandingConfig(props.agency || {});
  config.value = { ...config.value, content: defaults.content };
};

const requestClose = () => {
  if (dirty.value && !confirm('Fermer sans enregistrer les modifications ?')) return;
  emit('close');
};

const copyPublicUrl = async () => {
  try {
    await navigator.clipboard.writeText(publicUrl.value);
    copied.value = true;
    notify('Lien public copié.');
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (error) {
    notify('Impossible de copier le lien.', 'error');
  }
};

onMounted(load);
</script>

<style scoped>
.field {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid rgb(226 232 240);
  background: rgb(248 250 252);
  padding: 0.5rem 0.65rem;
  font-size: 0.75rem;
  color: rgb(15 23 42);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field:focus {
  border-color: #fa5b0f;
  box-shadow: 0 0 0 2px rgb(250 91 15 / 0.12);
  background: #fff;
}

:global(.dark) .field {
  border-color: rgb(51 65 85);
  background: rgb(30 41 59 / 0.5);
  color: rgb(241 245 249);
}
</style>
