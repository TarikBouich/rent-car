<template>
  <div class="fixed z-[300] bottom-5 right-5 flex flex-col items-end gap-3">
    <!-- Chat panel -->
    <transition name="ai-pop">
      <div
        v-if="open"
        class="w-[92vw] max-w-[380px] h-[560px] max-h-[75vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border"
        :class="isDark ? 'bg-[#1E2330] border-[#2a2f3e]' : 'bg-white border-gray-200'"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 bg-[#fa5b0f] text-white shrink-0">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div class="leading-tight">
              <div class="text-sm font-bold">Assistant IA</div>
              <div class="text-[11px] text-white/80">{{ statusText }}</div>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <!-- Live conversation toggle -->
            <button
              @click="toggleLive"
              class="p-1.5 rounded-lg transition-colors border"
              :class="liveMode ? 'bg-white text-[#fa5b0f] border-white' : 'text-white border-white/30 hover:bg-white/20'"
              :title="liveMode ? 'Quitter le mode conversation' : 'Mode conversation en direct'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <!-- Language toggle -->
            <div class="flex rounded-lg overflow-hidden border border-white/30 mr-1">
              <button
                v-for="opt in LANG_OPTIONS"
                :key="opt.code"
                @click="setLang(opt.code)"
                class="px-2 py-1 text-[11px] font-bold transition-colors"
                :class="micLang === opt.code ? 'bg-white text-[#fa5b0f]' : 'text-white/90 hover:bg-white/20'"
              >{{ opt.label }}</button>
            </div>
            <button @click="clearChat" class="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Effacer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button @click="open = false" class="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Transcript -->
        <div ref="scroller" class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[85%] px-3.5 py-2.5 text-sm rounded-2xl whitespace-pre-wrap"
              :class="[
                msg.role === 'user'
                  ? 'bg-[#fa5b0f] text-white rounded-br-md'
                  : (isDark ? 'bg-[#151923] text-gray-200 rounded-bl-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'),
              ]"
            >
              {{ msg.text }}
            </div>
          </div>

          <div v-if="thinking" class="flex justify-start">
            <div class="px-3.5 py-3 rounded-2xl rounded-bl-md" :class="isDark ? 'bg-[#151923]' : 'bg-gray-100'">
              <span class="flex gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]"></span>
              </span>
            </div>
          </div>

          <div v-if="listening && liveTranscript" class="flex justify-end">
            <div class="max-w-[85%] px-3.5 py-2.5 text-sm rounded-2xl rounded-br-md border border-dashed text-gray-400"
                 :class="isDark ? 'border-[#3a3f4e] bg-transparent' : 'border-gray-300 bg-transparent'">
              {{ liveTranscript }}
            </div>
          </div>
        </div>

        <!-- Composer -->
        <div class="shrink-0 border-t p-3 flex items-center gap-2" :class="isDark ? 'border-[#2a2f3e] bg-[#1E2330]' : 'border-gray-200 bg-white'">
          <input
            v-model="input"
            @keyup.enter="sendText()"
            :placeholder="placeholder"
            :dir="uiLang === 'ar' ? 'rtl' : 'ltr'"
            class="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none border transition-colors focus:border-[#fa5b0f]"
            :class="isDark ? 'bg-[#151923] border-[#2a2f3e] text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'"
          />
          <button
            @click="sendText()"
            class="p-2.5 rounded-xl bg-gray-200 dark:bg-[#2a2f3e] text-gray-600 dark:text-gray-300 hover:bg-gray-300 transition-colors"
            title="Envoyer"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <button
            @click="toggleMic"
            class="p-2.5 rounded-xl transition-all"
            :class="listening ? 'bg-red-500 text-white animate-pulse' : 'bg-[#fa5b0f] text-white hover:bg-[#e5500a]'"
            :title="micSupported ? (listening ? labels.listening[uiLang] : 'Parler') : labels.writingOnly[uiLang]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4m-4 0h8" />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- FAB -->
    <button
      @click="togglePanel"
      class="group relative w-14 h-14 rounded-full bg-[#fa5b0f] text-white shadow-xl shadow-orange-500/30 hover:bg-[#e5500a] transition-all active:scale-95 flex items-center justify-center"
      :title="open ? 'Fermer l’assistant' : 'Assistant IA'"
    >
      <span v-if="!open" class="absolute inset-0 rounded-full bg-[#fa5b0f] animate-ping opacity-30"></span>
      <svg v-if="!open" class="w-7 h-7 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h8m-8 4h5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <span
        v-if="!open && unread"
        class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white dark:border-[#1E2330]"
      >{{ unread }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { interpret, labels, detectLang } from '../services/aiEngine'
import aiService from '../services/aiService'
import { useCarStore } from '../stores/carStore'
import { useClientStore } from '../stores/clientStore'
import { useBrandStore } from '../stores/brandStore'
import { useModelStore } from '../stores/modelStore'
import { useAgencyStore } from '../stores/agencyStore'
import { useContratStore } from '../stores/contratStore'
import { useAlertStore } from '../stores/alertStore'
import { useUserStore } from '../stores/userStore'

const props = defineProps({ mode: { type: String, default: 'light' } })

const router = useRouter()
const route = useRoute()
const carStore = useCarStore()
const clientStore = useClientStore()
const brandStore = useBrandStore()
const modelStore = useModelStore()
const agencyStore = useAgencyStore()
const contratStore = useContratStore()
const alertStore = useAlertStore()
const userStore = useUserStore()

const LANG_OPTIONS = [
  { code: 'fr-FR', label: 'FR', lang: 'fr' },
  { code: 'ar-MA', label: 'Darija', lang: 'ar' },
  { code: 'ar-SA', label: 'AR', lang: 'ar' },
]

const open = ref(false)
const input = ref('')
const messages = ref([])
const thinking = ref(false)
const listening = ref(false)
const liveTranscript = ref('')
const unread = ref(0)
const scroller = ref(null)
const draft = ref({ type: null, fields: {} })
const micLang = ref('fr-FR')
const availableVoices = ref([])
const liveMode = ref(false)
const speaking = ref(false)

const isDark = computed(() => props.mode === 'dark')
const uiLang = computed(() => (micLang.value.startsWith('ar') ? 'ar' : 'fr'))
const micSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)
const statusText = computed(() => {
  if (speaking.value) return uiLang.value === 'ar' ? 'يتحدّث…' : 'Réponse en cours…'
  if (thinking.value) return labels.thinking[uiLang.value]
  if (liveMode.value && listening.value) return uiLang.value === 'ar' ? 'محادثة مباشرة…' : 'Conversation en direct…'
  if (listening.value) return labels.listening[uiLang.value]
  return micSupported ? labels.speaker[uiLang.value] : labels.writingOnly[uiLang.value]
})
const placeholder = computed(() => {
  if (listening.value) return labels.listening[uiLang.value]
  return uiLang.value === 'ar' ? 'اكتب أو اضغط الميكروفون…' : 'Écrivez ou tapez le micro…'
})

let recognition = null
let stopVoiceLoop = false
let silenceTimer = null
let restartTimer = null
let finalBuffer = ''

// --- Female voice selection --------------------------------------------------
const FEMALE_HINTS = [
  'amelie', 'amélie', 'audrey', 'aurelie', 'aurélie', 'alice', 'julie', 'lea', 'léa', 'marie', 'anne',
  'chantal', 'claire', 'celine', 'céline', 'flo', 'hortense', 'denise', 'vivienne', 'zira', 'hedda',
  'hoda', 'salma', 'layla', 'laila', 'leila', 'lila', 'amina', 'fatima', 'zeina', 'nora', 'sana', 'yara',
  'hala', 'sara', 'sarah', 'mariam', 'maryam', 'zariyah', 'shakira', 'aria', 'jenny', 'emma', 'sonia',
  'sophie', 'carmen', 'paulina', 'helena', 'laura', 'alva', 'klara', 'satu', 'tessa', 'fiona', 'moira',
  'yamila', 'imane', 'iman', 'siham', 'noura', 'rania', 'linda', 'monica',
]

const loadVoices = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  availableVoices.value = window.speechSynthesis.getVoices() || []
}

const isFemale = (v) => FEMALE_HINTS.some((h) => (v.name || '').toLowerCase().includes(h))

const pickVoice = (langPrefix) => {
  const voices = availableVoices.value
  if (!voices.length) return null
  const pool = voices.filter((v) => (v.lang || '').toLowerCase().startsWith(langPrefix))
  const femaleOfLang = pool.find(isFemale)
  if (femaleOfLang) return femaleOfLang
  if (pool.length) return pool[0]
  return voices.find(isFemale) || null
}

// --- Speech recognition (continuous / hands-free) ----------------------------
const getRecognition = () => {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!Ctor) return null
  const r = new Ctor()
  r.lang = micLang.value
  r.continuous = true
  r.interimResults = true
  r.maxAlternatives = 1

  r.onresult = (event) => {
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) finalBuffer += transcript + ' '
      else interim += transcript
    }
    liveTranscript.value = (finalBuffer + interim).trim()
    clearTimeout(silenceTimer)
    silenceTimer = setTimeout(flushSpeech, 1100)
  }
  r.onerror = (e) => {
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
      liveMode.value = false
      listening.value = false
      push('assistant', labels.micDenied[uiLang.value])
    }
  }
  r.onend = () => {
    listening.value = false
    clearTimeout(silenceTimer)
    if (liveMode.value && !speaking.value && !stopVoiceLoop && open.value) {
      clearTimeout(restartTimer)
      restartTimer = setTimeout(beginListening, 250)
    } else {
      liveTranscript.value = ''
    }
  }
  return r
}

const flushSpeech = () => {
  const text = finalBuffer.trim()
  finalBuffer = ''
  liveTranscript.value = ''
  if (text) handleText(text)
}

const beginListening = () => {
  if (!micSupported || speaking.value || stopVoiceLoop || !open.value) return
  if (!recognition) recognition = getRecognition()
  recognition.lang = micLang.value
  try {
    recognition.start()
    listening.value = true
    liveTranscript.value = ''
  } catch {
    /* already started */
  }
}

const stopListening = () => {
  clearTimeout(silenceTimer)
  clearTimeout(restartTimer)
  finalBuffer = ''
  if (recognition) {
    try { recognition.stop() } catch { /* not started */ }
  }
  listening.value = false
  liveTranscript.value = ''
}

const toggleLive = () => {
  if (!micSupported) {
    push('assistant', labels.micUnsupported[uiLang.value])
    return
  }
  liveMode.value = !liveMode.value
  if (liveMode.value) {
    stopSpeaking()
    beginListening()
  } else {
    stopListening()
  }
}

const toggleMic = () => {
  if (!micSupported) {
    push('assistant', labels.micUnsupported[uiLang.value])
    return
  }
  if (speaking.value) {
    stopSpeaking()
    if (liveMode.value) beginListening()
    return
  }
  if (listening.value) {
    stopListening()
    return
  }
  beginListening()
}

// --- Text-to-speech (female) -------------------------------------------------
const stopSpeaking = () => {
  try { window.speechSynthesis?.cancel() } catch { /* silent */ }
  speaking.value = false
}

const speak = (text, lang = 'fr') => {
  if (!('speechSynthesis' in window) || stopVoiceLoop) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    const voice = pickVoice(lang === 'ar' ? 'ar' : 'fr')
    if (voice) {
      u.voice = voice
      u.lang = voice.lang
    } else {
      u.lang = lang === 'ar' ? 'ar-SA' : 'fr-FR'
    }
    u.rate = 1.05
    u.pitch = 1.1
    const resume = () => {
      speaking.value = false
      if (liveMode.value && !stopVoiceLoop && open.value) {
        clearTimeout(restartTimer)
        restartTimer = setTimeout(beginListening, 300)
      }
    }
    u.onend = resume
    u.onerror = resume
    speaking.value = true
    window.speechSynthesis.speak(u)
  } catch {
    speaking.value = false
  }
}

// --- Messages ----------------------------------------------------------------
const push = (role, text) => {
  messages.value.push({ id: Date.now() + Math.random(), role, text })
  nextTick(() => {
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
  })
}

const clearChat = () => {
  messages.value = []
  draft.value = { type: null, fields: {} }
  stopSpeaking()
}

const setLang = (code) => {
  micLang.value = code
  if (recognition) recognition.lang = code
  if (listening.value) {
    stopListening()
    if (liveMode.value) restartTimer = setTimeout(beginListening, 250)
  }
}

const buildCtx = () => ({
  carStore, clientStore, brandStore, modelStore, agencyStore, contratStore, route, router,
})

// Compact snapshot of live app data so the AI can answer real questions.
const buildAiContext = (lang) => {
  const cars = carStore.cars || []
  const clients = clientStore.clients || []
  const brands = brandStore.brands || []
  const models = modelStore.models || []
  const now = new Date().toISOString().slice(0, 10)

  const statusCount = cars.reduce((acc, c) => {
    const k = (c.status || 'inconnu').toString().trim() || 'inconnu'
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

  const summary = {
    userRole: userStore?.currentUser?.role || null,
    currentPage: route?.path || '/',
    today: now,
    counts: {
      cars: cars.length,
      clients: clients.length,
      brands: brands.length,
      models: models.length,
      agencies: (agencyStore.agencies || []).length,
      contracts: (contratStore.contrats || []).length,
    },
    carsByStatus: statusCount,
    brands: brands.slice(0, 60).map((b) => ({ id: b.id, name: b.name })),
    models: models.slice(0, 200).map((m) => ({ id: m.id, name: m.name, brandId: m.brandId })),
    recentClients: clients.slice(0, 15).map((c) => ({ firstName: c.firstName, lastName: c.lastName, phone: c.phone })),
  }

  return { lang, summary }
}

// Ask the remote Gemini assistant; fall back to the offline engine if unavailable.
const aiOfflineNotice = ref(false)

const askAI = async (text) => {
  const history = messages.value
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .slice(-12)
    .map((m) => ({ role: m.role, text: m.text }))

  const lang = detectLang(text)
  try {
    const data = await aiService.chat([...history, { role: 'user', text }], buildAiContext(lang))
    if (data && typeof data.reply === 'string' && data.reply.trim()) {
      aiOfflineNotice.value = false
      return { reply: data.reply.trim(), actions: data.actions || [], lang: data.lang || lang }
    }
    throw new Error('empty reply')
  } catch (e) {
    const status = e?.response?.status
    if (status !== undefined || e?.message === 'empty reply') {
      // The real AI is unreachable: say so instead of pretending with the dumb engine.
      aiOfflineNotice.value = true
      let why
      if (status === 429) {
        why = lang === 'ar'
          ? ' Abstended bezzaf d les requêtes. Tsenna chwiya o jedd.'
          : 'J\'ai été trop sollicité (quota gratuit). Attends quelques secondes et réessaie.'
      } else if (status === 503) {
        why = lang === 'ar'
          ? ' الكلمة السرية ديال Gemini ناقصة فـ server/.env.'
          : ' la clé GEMINI_API_KEY est absente de server/.env'
      } else {
        why = lang === 'ar' ? ' ما قدرتش نوصل لـ Gemini.' : " je n'ai pas pu joindre Gemini"
      }
      return {
        reply: lang === 'ar'
          ? `${why}الخدمة غادي ترجع تخدم فجوة دابا.`
          : `${why}. Relance le serveur si le problème continue.`,
        actions: [],
        lang,
      }
    }
    // Network-level failure (server down): keep the offline engine as last resort.
    const result = interpret(text, buildCtx(), draft.value)
    draft.value = result.draft || { type: null, fields: {} }
    return { reply: result.reply, actions: result.actions || [], lang: result.lang || lang }
  }
}

// --- Action execution --------------------------------------------------------
// Darija-friendly confirmations for actions the model requested.
const confirmMsg = {
  carCreated: {
    fr: (name, plate) => `Voiture créée : ${name}, plaque ${plate}.`,
    ar: (name, plate) => `تزاد ${name} باللوحة ${plate}. دابا كاينة فالإstock.`,
  },
  clientCreated: {
    fr: (f, l) => `Client ${f} ${l} créé.`,
    ar: (f, l) => `تزاد العميل ${f} ${l}.`,
  },
  brandCreated: {
    fr: (n) => `Marque ${n} ajoutée.`,
    ar: (n) => `تزاد الماركة ${n}.`,
  },
  modelCreated: {
    fr: (n, b) => `Modèle ${n} ajouté${b ? ` pour ${b}` : ''}.`,
    ar: (n, b) => `تزاد الموديل ${n}${b ? ` ديال ${b}` : ''}.`,
  },
  brandMissing: {
    fr: (b) => `Je ne trouve pas la marque ${b}. Dis-moi si je l'ajoute.`,
    ar: (b) => `ما لقيتش الماركة ${b}. واش نزيدها؟`,
  },
  modelMissing: {
    fr: (m, b) => `Le modèle ${m} n'existe pas pour ${b}. Je l'ajoute ?`,
    ar: (m, b) => `الموديل ${m} ما كاينش فـ ${b}. واش نزيدو؟`,
  },
  genericError: { fr: 'C\'est fait, mais une donnée n\'a pas été acceptée. Vérifie les champs.', ar: 'تصاوب، ولكن شي معلومة ما تقبلاتش. تحقق من الحقول.' },
  carError: { fr: 'Impossible de créer la voiture.', ar: 'ما قدرتش نزيد الطوموبيل. عاود جرب.' },
  clientError: { fr: 'Impossible de créer le client.', ar: 'ما قدرتش نزيد العميل.' },
  limit: { fr: 'Limite de forfait dépassée.', ar: 'وصلتي للحد ديال العرض.' },
}

const execute = async (actions, lang) => {
  // Create missing brands/models FIRST so a chained create_car can resolve them by name.
  const list = actions || []
  const ordered = [
    ...list.filter((a) => a.type === 'create_brand'),
    ...list.filter((a) => a.type === 'create_model'),
    ...list.filter((a) => !['create_brand', 'create_model'].includes(a.type)),
  ]

  for (const action of ordered) {
    if (action.type === 'navigate') {
      await router.push(action.path).catch(() => {})
      continue
    }
    if (action.type === 'create_car') {
      const p = { ...action.payload }

      // Resolve brand/model by name when the model had no id (or a stale one).
      const brands = brandStore.brands || []
      let brand = brands.find((b) => b.id === p.brandId)
      if (!brand && p.brandName) {
        brand = brands.find((b) => (b.name || '').toLowerCase() === String(p.brandName).toLowerCase())
      }
      if (!brand) {
        const msg = confirmMsg.brandMissing[lang](p.brandName || p.name || '')
        push('assistant', msg)
        speak(msg, lang)
        continue
      }
      p.brandId = brand.id

      const models = (modelStore.models || []).filter((m) => m.brandId === brand.id)
      let model = models.find((m) => m.id === p.modelId)
      if (!model && p.modelName) {
        model = models.find((m) => (m.name || '').toLowerCase() === String(p.modelName).toLowerCase())
      }
      if (!model) {
        const msg = confirmMsg.modelMissing[lang](p.modelName || '', p.brandName || brand.name)
        push('assistant', msg)
        speak(msg, lang)
        continue
      }
      p.modelId = model.id
      if (!p.name) p.name = `${brand.name} ${model.name}`.trim()

      try {
        await carStore.addCar(p)
        await alertStore.checkAlerts?.()
        const msg = confirmMsg.carCreated[lang](p.name, p.licensePlate)
        push('assistant', msg)
        speak(msg, lang)
      } catch (e) {
        const msg = e?.response?.status === 402 ? confirmMsg.limit[lang] : confirmMsg.carError[lang]
        push('assistant', msg)
        speak(msg, lang)
      }
      continue
    }
    if (action.type === 'create_brand') {
      const name = (action.payload?.name || '').trim()
      if (!name) continue
      try {
        const exists = (brandStore.brands || []).some((b) => (b.name || '').toLowerCase() === name.toLowerCase())
        if (exists) continue
        const created = await brandStore.addBrand(name)
        const msg = confirmMsg.brandCreated[lang](name)
        push('assistant', msg)
        speak(msg, lang)
        if (!created) brandStore.initializeFromStorage().catch(() => {})
      } catch {
        const msg = confirmMsg.genericError[lang]
        push('assistant', msg)
        speak(msg, lang)
      }
      continue
    }
    if (action.type === 'create_model') {
      const name = (action.payload?.name || '').trim()
      const brandName = action.payload?.brandName || ''
      // The model may invent a brandId; resolve it from the store (handles a brand created moments ago).
      const brands = brandStore.brands || []
      let brandId = action.payload?.brandId
      if (!brands.some((b) => b.id === brandId)) {
        const byName = brands.find(
          (b) => (b.name || '').toLowerCase() === brandName.toLowerCase(),
        )
        if (byName) brandId = byName.id
      }
      if (!name || !brandId) continue
      try {
        const exists = (modelStore.models || []).some(
          (m) => (m.name || '').toLowerCase() === name.toLowerCase() && m.brandId === brandId,
        )
        if (exists) continue
        await modelStore.addModel(brandId, name, action.payload?.category || '')
        const msg = confirmMsg.modelCreated[lang](name, brandName)
        push('assistant', msg)
        speak(msg, lang)
      } catch {
        const msg = confirmMsg.genericError[lang]
        push('assistant', msg)
        speak(msg, lang)
      }
      continue
    }
    if (action.type === 'create_client') {
      try {
        await clientStore.addClient(action.payload)
        const msg = confirmMsg.clientCreated[lang](action.payload.firstName, action.payload.lastName)
        push('assistant', msg)
        speak(msg, lang)
      } catch {
        const msg = confirmMsg.clientError[lang]
        push('assistant', msg)
        speak(msg, lang)
      }
    }
  }
}

// --- Core handler ------------------------------------------------------------
const handleText = async (text) => {
  if (!text) return
  stopListening()
  push('user', text)
  thinking.value = true

  // Brands/models needed to create a car — make sure they're loaded.
  if (!brandStore.brands.length || !modelStore.models.length) {
    try {
      if (!brandStore.brands.length) await brandStore.initializeFromStorage()
      if (!modelStore.models.length) await modelStore.initializeFromStorage()
    } catch { /* proceed */ }
  }

  await new Promise((r) => setTimeout(r, 150))
  const result = await askAI(text)
  const lang = result.lang || uiLang.value
  const actions = result.actions || []

  thinking.value = false
  // A pure placeholder reply means the model only emitted a function call;
  // `execute` will push the real confirmation, so don't duplicate it.
  const isPlaceholder = /^[\s.…]*$/.test(result.reply || '')
  if (!isPlaceholder || !actions.length) {
    push('assistant', result.reply)
    speak(result.reply, lang)
  }
  await execute(actions, lang)
}

const sendText = () => {
  const text = input.value.trim()
  if (!text) return
  input.value = ''
  handleText(text)
}

const togglePanel = async () => {
  open.value = !open.value
  if (open.value) {
    unread.value = 0
    if (!messages.value.length) {
      push('assistant', uiLang.value === 'ar'
        ? 'واش بغيتي؟ أنا مساعدك، گول لي واش ندير ليك اليوم.'
        : 'Bonjour ! Je suis votre assistant. Que puis-je faire pour vous ?')
    }
    if (!brandStore.brands.length) brandStore.initializeFromStorage().catch(() => {})
    if (!modelStore.models.length) modelStore.initializeFromStorage().catch(() => {})
    if (!carStore.cars.length) carStore.initializeFromStorage?.().catch(() => {})
    if (!clientStore.clients.length) clientStore.initializeFromStorage?.().catch(() => {})
    loadVoices()
  } else {
    liveMode.value = false
    stopListening()
    stopSpeaking()
  }
}

watch(open, () => nextTick(() => { if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight }))

onMounted(() => {
  if (micSupported) recognition = getRecognition()
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }
})

onBeforeUnmount(() => {
  stopVoiceLoop = true
  stopListening()
  stopSpeaking()
  recognition?.abort?.()
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = null
})
</script>

<style scoped>
.ai-pop-enter-active,
.ai-pop-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.ai-pop-enter-from,
.ai-pop-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
</style>
