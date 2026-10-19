<template>
  <div class="min-h-screen bg-[#070A12] font-[Inter] text-white">
    <div class="pointer-events-none fixed inset-0 opacity-60" :style="glowStyle"></div>

    <!-- Nav -->
    <header class="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div class="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-[#0B1020]/80 px-4 py-3 shadow-2xl backdrop-blur-xl">
        <a href="#" class="flex min-w-0 items-center gap-3">
          <img v-if="view.logo" :src="view.logo" :alt="view.agency.name" class="h-10 w-10 rounded-xl object-cover ring-1 ring-white/20" />
          <div v-else class="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white shadow-lg" :style="logoStyle">{{ view.initials }}</div>
          <div class="min-w-0">
            <p class="truncate text-sm font-black leading-tight">{{ view.agency.name }}</p>
            <p class="truncate text-[10px] uppercase tracking-[0.18em] text-white/40">{{ city }}</p>
          </div>
        </a>

        <nav class="hidden items-center gap-7 text-xs font-bold uppercase tracking-[0.14em] text-white/50 md:flex">
          <a v-if="content.showFleet" href="#flotte" class="transition-colors hover:text-white">Flotte</a>
          <a v-if="content.showAbout" href="#apropos" class="transition-colors hover:text-white">Agence</a>
          <a v-if="content.showContact" href="#contact" class="transition-colors hover:text-white">Contact</a>
        </nav>

        <a :href="telHref" class="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-white shadow-lg transition hover:brightness-110" :style="ctaStyle">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          <span class="hidden sm:inline">{{ content.phone || 'Réserver' }}</span>
        </a>
      </div>
    </header>

    <!-- Hero -->
    <section class="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
      <div class="grid items-center gap-10 lg:grid-cols-12">
        <div class="lg:col-span-6">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
            <span class="h-1.5 w-1.5 rounded-full" :style="{ background: theme.primary, boxShadow: `0 0 10px ${theme.primary}` }"></span>
            {{ content.badge }}
          </span>

          <h1 class="mt-6 text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-[4.2rem]">
            {{ content.heroTitle }}
            <span class="mt-1 block bg-clip-text text-transparent" :style="textGradientStyle">{{ content.heroHighlight }}</span>
          </h1>

          <p class="mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">{{ content.heroSubtitle }}</p>

          <div class="mt-9 flex flex-wrap items-center gap-3">
            <a
              v-if="content.showFleet"
              href="#flotte"
              class="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5"
              :style="ctaStyle"
            >
              {{ content.primaryCta }}
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
            <a :href="telHref" class="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white">
              {{ content.secondaryCta }}
            </a>
          </div>
        </div>

        <!-- Bento -->
        <div class="lg:col-span-6">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div v-if="featured && view.carImage(featured)" class="h-64 sm:h-72">
                <img :src="view.carImage(featured)" :alt="featured.name" class="h-full w-full object-cover" />
              </div>
              <div v-else class="flex h-64 items-center justify-center sm:h-72" :style="heroGradient">
                <svg class="h-28 w-28 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M5 13l1.5-5.5A2 2 0 018.45 6h7.1a2 2 0 011.95 1.5L19 13m-14 0h14m-14 0a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-3a2 2 0 00-2-2M7 15h.01M17 15h.01"/></svg>
              </div>
              <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-[#070A12] via-[#070A12]/60 to-transparent p-5">
                <div>
                  <p class="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">À la une</p>
                  <p class="mt-1 text-lg font-black">{{ featured?.name || 'Votre prochaine voiture' }}</p>
                </div>
                <p v-if="featured" class="text-right text-xl font-black">{{ view.price(featured.pricePerDay) }} <span class="text-xs font-semibold text-white/50">DH/j</span></p>
              </div>
            </div>

            <div v-if="content.showStats" class="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p class="text-3xl font-black">{{ view.cars.length }}</p>
              <p class="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Véhicules</p>
            </div>
            <div v-if="content.showStats" class="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p class="text-3xl font-black" :style="{ color: theme.to }">{{ view.availableCars.length }}</p>
              <p class="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Disponibles</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Fleet -->
    <section v-if="content.showFleet" id="flotte" class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.22em]" :style="{ color: theme.to }">La flotte</p>
          <h2 class="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{{ content.fleetTitle }}</h2>
          <p class="mt-2 max-w-lg text-sm text-white/50">{{ content.fleetSubtitle }}</p>
        </div>
        <a :href="telHref" class="text-xs font-black uppercase tracking-[0.16em] text-white/50 transition-colors hover:text-white">Tout voir →</a>
      </div>

      <div v-if="view.cars.length === 0" class="mt-10 rounded-3xl border border-white/10 bg-white/5 py-16 text-center">
        <p class="text-xl font-black">Aucun véhicule disponible</p>
        <p class="mt-2 text-sm text-white/50">Contactez-nous pour connaître les disponibilités.</p>
      </div>

      <div v-else class="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
        <article
          v-for="car in view.cars"
          :key="car.id"
          class="group w-[280px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-[#0B1020] transition hover:border-white/25 sm:w-[330px]"
        >
          <div class="relative h-44 overflow-hidden bg-white/5">
            <img v-if="view.carImage(car)" :src="view.carImage(car)" :alt="car.name" class="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
            <div v-else class="flex h-full items-center justify-center">
              <svg class="h-20 w-20 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M5 13l1.5-5.5A2 2 0 018.45 6h7.1a2 2 0 011.95 1.5L19 13m-14 0h14m-14 0a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-3a2 2 0 00-2-2M7 15h.01M17 15h.01"/></svg>
            </div>
            <span class="absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white" :style="{ background: car.status === 'Available' ? theme.primary : 'rgba(255,255,255,.12)' }">
              {{ car.status === 'Available' ? 'Disponible' : 'Sur demande' }}
            </span>
          </div>

          <div class="p-5">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-base font-black leading-tight">{{ car.name }}</h3>
                <p class="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/40">{{ view.brandName(car) }} {{ view.modelName(car) }}</p>
              </div>
              <p class="shrink-0 text-right text-lg font-black">{{ view.price(car.pricePerDay) }} <span class="text-[10px] font-semibold text-white/40">DH</span></p>
            </div>

            <div class="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white/50">
              <span class="rounded-lg bg-white/5 px-2 py-1">{{ car.seats || 5 }} places</span>
              <span class="rounded-lg bg-white/5 px-2 py-1">{{ car.fuelType || 'Diesel' }}</span>
              <span class="rounded-lg bg-white/5 px-2 py-1">{{ car.transmission || 'Manuelle' }}</span>
            </div>

            <a :href="telHref" class="mt-5 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:brightness-110" :style="ctaStyle">
              Réserver
            </a>
          </div>
        </article>
      </div>
    </section>

    <!-- About / Process -->
    <section v-if="content.showAbout" id="apropos" class="relative border-y border-white/10 bg-white/[0.02]">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div class="grid gap-12 lg:grid-cols-12">
          <div class="lg:col-span-5">
            <p class="text-[10px] font-black uppercase tracking-[0.22em]" :style="{ color: theme.to }">{{ content.aboutTitle }}</p>
            <h2 class="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{{ content.aboutHeading }}</h2>
            <p class="mt-5 text-base leading-relaxed text-white/55">{{ content.aboutText }}</p>

            <div class="mt-8 grid grid-cols-2 gap-3">
              <div v-for="feature in content.features" :key="feature.title" class="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p class="text-sm font-bold">{{ feature.title }}</p>
                <p class="mt-1 text-xs leading-relaxed text-white/40">{{ feature.text }}</p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-7">
            <div class="rounded-3xl border border-white/10 bg-[#0B1020] p-6 sm:p-8">
              <p class="text-[10px] font-black uppercase tracking-[0.22em] text-white/40">Comment ça marche</p>
              <div class="mt-6 space-y-0">
                <div v-for="(step, index) in steps" :key="step.title" class="relative flex gap-5 pb-8 last:pb-0">
                  <div class="relative flex flex-col items-center">
                    <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white" :style="ctaStyle">{{ index + 1 }}</span>
                    <span v-if="index < steps.length - 1" class="mt-2 w-px flex-1 bg-gradient-to-b from-white/20 to-transparent"></span>
                  </div>
                  <div class="pt-1">
                    <p class="text-base font-bold">{{ step.title }}</p>
                    <p class="mt-1 text-sm leading-relaxed text-white/45">{{ step.text }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section v-if="content.showContact" id="contact" class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div class="relative overflow-hidden rounded-[2rem] border border-white/10 p-8 sm:p-12" :style="contactStyle">
        <div class="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/20 blur-3xl"></div>
        <div class="relative grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 class="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">{{ content.contactTitle }}</h2>
            <p class="mt-4 max-w-lg text-base text-white/80">{{ content.contactText }}</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a :href="telHref" class="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-slate-900 shadow-xl transition hover:scale-[1.02]">
                {{ content.phone || 'Appeler maintenant' }}
              </a>
              <a v-if="waHref" :href="waHref" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">
                WhatsApp
              </a>
            </div>
          </div>

          <div class="rounded-2xl border border-white/20 bg-black/20 p-6 backdrop-blur">
            <dl class="space-y-4 text-sm">
              <div v-if="content.email">
                <dt class="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Email</dt>
                <dd class="mt-1 font-semibold">{{ content.email }}</dd>
              </div>
              <div v-if="content.address">
                <dt class="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Adresse</dt>
                <dd class="mt-1 font-semibold">{{ content.address }}</dd>
              </div>
              <div v-if="view.managerName">
                <dt class="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Responsable</dt>
                <dd class="mt-1 font-semibold">{{ view.managerName }}</dd>
              </div>
              <div>
                <dt class="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Horaires</dt>
                <dd class="mt-1 font-semibold">7j/7 — 08:00 à 20:00</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/10">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-[10px] uppercase tracking-[0.16em] text-white/35 sm:flex-row sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-black text-white" :style="logoStyle">{{ view.initials }}</div>
          <span>{{ view.agency.name }} — {{ city }}</span>
        </div>
        <span>© {{ year }} — Tous droits réservés</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  view: { type: Object, required: true },
  theme: { type: Object, required: true },
  content: { type: Object, required: true }
});

const city = computed(() => props.view.agency.ville || props.view.agency.location || 'Location');
const year = new Date().getFullYear();
const featured = computed(() => props.view.availableCars[0] || props.view.cars[0] || null);

const steps = [
  { title: 'Choisissez votre véhicule', text: 'Parcourez la flotte et sélectionnez le modèle adapté à votre trajet.' },
  { title: 'Confirmez votre réservation', text: 'Un appel ou un message WhatsApp suffit pour bloquer vos dates.' },
  { title: 'Prenez la route', text: 'Récupérez les clés à l’agence et profitez de votre location.' }
];

const telHref = computed(() => (props.content.phone ? `tel:${props.content.phone}` : '#'));
const waHref = computed(() => {
  const digits = String(props.content.whatsapp || '').replace(/\D/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits.startsWith('212') ? digits : `212${digits.replace(/^0/, '')}`}`;
});

const logoStyle = computed(() => ({ background: `linear-gradient(135deg, ${props.theme.primary}, ${props.theme.dark})` }));
const heroGradient = computed(() => ({ background: `linear-gradient(150deg, ${props.theme.from}, ${props.theme.dark})` }));
const textGradientStyle = computed(() => ({ backgroundImage: `linear-gradient(90deg, ${props.theme.to}, ${props.theme.primary})` }));
const ctaStyle = computed(() => ({ background: `linear-gradient(135deg, ${props.theme.primary}, ${props.theme.dark})` }));
const contactStyle = computed(() => ({ background: `linear-gradient(135deg, ${props.theme.dark} 0%, ${props.theme.from} 100%)` }));
const glowStyle = computed(() => ({
  background: `radial-gradient(900px 500px at 80% -10%, ${props.theme.primary}22, transparent 60%), radial-gradient(700px 400px at -10% 30%, ${props.theme.dark}33, transparent 60%)`
}));
</script>

<style scoped>
#flotte,
#apropos,
#contact {
  scroll-margin-top: 6rem;
}
</style>
