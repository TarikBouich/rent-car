<template>
  <div class="min-h-screen bg-[#F8FAFC] font-[Inter] text-slate-900">
    <!-- Nav -->
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex min-w-0 items-center gap-3">
          <img v-if="view.logo" :src="view.logo" :alt="view.agency.name" class="h-10 w-10 rounded-xl object-cover shadow ring-2 ring-white" />
          <div v-else class="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white" :style="logoStyle">
            {{ view.initials }}
          </div>
          <div class="min-w-0">
            <p class="truncate font-bold leading-tight">{{ view.agency.name }}</p>
            <p class="truncate text-xs text-slate-500">{{ city }}</p>
          </div>
        </div>

        <nav class="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <a v-if="content.showFleet" href="#flotte" class="transition-colors hover:text-slate-900">Notre flotte</a>
          <a v-if="content.showAbout" href="#apropos" class="transition-colors hover:text-slate-900">À propos</a>
          <a v-if="content.showContact" href="#contact" class="transition-colors hover:text-slate-900">Contact</a>
        </nav>

        <a
          :href="telHref"
          class="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:opacity-90 sm:flex"
          :style="ctaStyle"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          {{ content.phone || 'Réserver' }}
        </a>
      </div>
    </header>

    <!-- Hero -->
    <section class="relative overflow-hidden text-white" :style="heroStyle">
      <div class="absolute inset-0 opacity-15" style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 28px 28px;"></div>
      <div class="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>

      <div class="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <span class="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur">
            {{ content.badge }}
          </span>
          <h1 class="mt-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {{ content.heroTitle }}<br />
            <span class="opacity-90">{{ content.heroHighlight }}</span>
          </h1>
          <p class="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{{ content.heroSubtitle }}</p>
          <div class="mt-8 flex flex-wrap items-center gap-4">
            <a
              v-if="content.showFleet"
              href="#flotte"
              class="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-slate-900 shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
            >
              {{ content.primaryCta }}
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
            </a>
            <a
              :href="telHref"
              class="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10"
            >
              {{ content.secondaryCta }}
            </a>
          </div>
        </div>

        <!-- Featured vehicle -->
        <div class="relative">
          <div class="absolute -inset-4 rounded-[2rem] bg-white/10 blur-2xl"></div>
          <div class="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur">
            <div v-if="featured && view.carImage(featured)" class="h-56 sm:h-64">
              <img :src="view.carImage(featured)" :alt="featured.name" class="h-full w-full object-cover" />
            </div>
            <div v-else class="flex h-56 items-center justify-center bg-slate-900/30 sm:h-64">
              <svg class="h-24 w-24 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l1.5-5.5A2 2 0 018.45 6h7.1a2 2 0 011.95 1.5L19 13m-14 0h14m-14 0a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-3a2 2 0 00-2-2M7 15h.01M17 15h.01"/></svg>
            </div>

            <div class="flex items-end justify-between gap-4 p-5">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-white/60">Véhicule à la une</p>
                <p class="mt-1 text-lg font-black">{{ featured?.name || 'Votre prochaine voiture' }}</p>
                <p v-if="featured" class="text-sm text-white/70">{{ view.brandName(featured) }} {{ view.modelName(featured) }}</p>
              </div>
              <div v-if="featured" class="rounded-2xl bg-white/15 px-4 py-2 text-right backdrop-blur">
                <p class="text-[10px] font-bold uppercase tracking-wider text-white/60">/ jour</p>
                <p class="text-2xl font-black">{{ view.price(featured.pricePerDay) }} <span class="text-xs font-semibold">DH</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div v-if="content.showStats" class="relative border-t border-white/15 bg-black/10">
        <div class="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div v-for="stat in stats" :key="stat.label" class="px-4 py-8 text-center">
            <p class="text-3xl font-black">{{ stat.value }}</p>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wider text-white/70">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Fleet -->
    <section v-if="content.showFleet" id="flotte" class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div class="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p class="mb-2 text-xs font-black uppercase tracking-widest" :style="{ color: theme.primary }">Notre flotte</p>
          <h2 class="text-3xl font-black tracking-tight lg:text-4xl">{{ content.fleetTitle }}</h2>
          <p class="mt-2 max-w-xl text-slate-500">{{ content.fleetSubtitle }}</p>
        </div>
        <div class="flex gap-2">
          <button
            v-for="f in filters"
            :key="f.value"
            class="rounded-full border px-4 py-2 text-sm font-bold transition-all"
            :class="filter === f.value ? 'border-transparent text-white shadow-lg' : 'border-slate-200 text-slate-600 hover:border-slate-400'"
            :style="filter === f.value ? ctaStyle : {}"
            @click="filter = f.value"
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <div v-if="visibleCars.length === 0" class="rounded-3xl border border-slate-200 bg-white py-20 text-center">
        <div class="mb-4 text-6xl">🚗</div>
        <h3 class="text-lg font-bold">Aucun véhicule disponible</h3>
        <p class="mt-1 text-slate-500">Contactez-nous, notre équipe vous trouvera la voiture idéale.</p>
        <a :href="telHref" class="mt-4 inline-block rounded-full px-5 py-2.5 text-sm font-bold text-white" :style="ctaStyle">Nous contacter</a>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="car in visibleCars"
          :key="car.id"
          class="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
        >
          <div class="relative h-52 overflow-hidden bg-slate-100">
            <img v-if="view.carImage(car)" :src="view.carImage(car)" :alt="car.name" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div v-else class="flex h-full items-center justify-center">
              <svg class="h-20 w-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l1.5-5.5A2 2 0 018.45 6h7.1a2 2 0 011.95 1.5L19 13m-14 0h14m-14 0a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-3a2 2 0 00-2-2M7 15h.01M17 15h.01"/></svg>
            </div>
            <span class="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg" :style="ctaStyle">
              {{ car.status === 'Available' ? 'Disponible' : (car.status || 'Sur demande') }}
            </span>
          </div>

          <div class="flex flex-1 flex-col p-6">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h3 class="text-lg font-black leading-tight">{{ car.name }}</h3>
                <p class="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                  <span class="inline-block h-2 w-2 rounded-full" :style="{ background: theme.primary }"></span>
                  {{ view.brandName(car) }} {{ view.modelName(car) }}
                </p>
              </div>
              <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{{ car.year || 'Récent' }}</span>
            </div>

            <div class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
              <span>{{ car.seats || 5 }} places</span>
              <span>{{ car.fuelType || 'Diesel' }}</span>
              <span>{{ car.transmission || 'Manuelle' }}</span>
            </div>

            <div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prix / jour</p>
                <p class="text-2xl font-black">{{ view.price(car.pricePerDay) }} <span class="text-sm font-semibold text-slate-500">DH</span></p>
              </div>
              <a :href="telHref" class="rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5" :style="ctaStyle">
                Réserver
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- About -->
    <section v-if="content.showAbout" id="apropos" class="border-y border-slate-200 bg-white">
      <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <p class="mb-2 text-xs font-black uppercase tracking-widest" :style="{ color: theme.primary }">{{ content.aboutTitle }}</p>
          <h2 class="text-3xl font-black tracking-tight lg:text-4xl">{{ content.aboutHeading }}</h2>
          <p class="mt-4 leading-relaxed text-slate-500">{{ content.aboutText }}</p>

          <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div v-for="feature in content.features" :key="feature.title" class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white" :style="logoStyle">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <p class="text-sm font-bold">{{ feature.title }}</p>
              <p class="mt-0.5 text-xs text-slate-500">{{ feature.text }}</p>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="absolute -inset-3 rounded-3xl opacity-10 blur-2xl" :style="heroGradient"></div>
          <div class="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl">
            <div class="h-1.5" :style="gradientBarStyle"></div>
            <div class="p-8">
              <h3 class="mb-6 text-xl font-black">Informations de l'agence</h3>
              <dl class="space-y-4 text-sm">
                <div v-if="content.email" class="flex items-center gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Email</dt>
                    <dd class="font-semibold">{{ content.email }}</dd>
                  </div>
                </div>
                <div v-if="content.phone" class="flex items-center gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div>
                    <dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Téléphone</dt>
                    <dd class="font-semibold">{{ content.phone }}</dd>
                  </div>
                </div>
                <div v-if="content.address" class="flex items-center gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Adresse</dt>
                    <dd class="font-semibold">{{ content.address }}</dd>
                  </div>
                </div>
                <div v-if="view.managerName" class="flex items-center gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                  <div>
                    <dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Responsable</dt>
                    <dd class="font-semibold">{{ view.managerName }}</dd>
                  </div>
                </div>
              </dl>

              <div class="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 text-center text-xs">
                <div v-if="view.agency.if" class="rounded-xl bg-white/5 p-3">
                  <p class="mb-1 font-bold uppercase tracking-wider text-slate-400">IF</p>
                  <p class="font-bold">{{ view.agency.if }}</p>
                </div>
                <div v-if="view.agency.rc" class="rounded-xl bg-white/5 p-3">
                  <p class="mb-1 font-bold uppercase tracking-wider text-slate-400">RC</p>
                  <p class="font-bold">{{ view.agency.rc }}</p>
                </div>
                <div v-if="view.agency.patente" class="rounded-xl bg-white/5 p-3">
                  <p class="mb-1 font-bold uppercase tracking-wider text-slate-400">Patente</p>
                  <p class="font-bold">{{ view.agency.patente }}</p>
                </div>
                <div v-if="view.agency.ice" class="rounded-xl bg-white/5 p-3">
                  <p class="mb-1 font-bold uppercase tracking-wider text-slate-400">ICE</p>
                  <p class="font-bold">{{ view.agency.ice }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section v-if="content.showContact" id="contact" class="relative overflow-hidden text-white" :style="contactStyle">
      <div class="absolute inset-0 opacity-15" style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 28px 28px;"></div>
      <div class="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 class="text-3xl font-black tracking-tight lg:text-5xl">{{ content.contactTitle }}</h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-white/85">{{ content.contactText }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a :href="telHref" class="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-black text-slate-900 shadow-2xl transition hover:scale-105">
            {{ content.phone || 'Appeler maintenant' }}
          </a>
          <a v-if="waHref" :href="waHref" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-3.5 font-bold transition hover:bg-white/10">
            WhatsApp
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-950 text-slate-400">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row lg:px-8">
        <div class="flex items-center gap-3">
          <img v-if="view.logo" :src="view.logo" :alt="view.agency.name" class="h-10 w-10 rounded-xl object-cover ring-2 ring-white/10" />
          <div v-else class="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white" :style="logoStyle">{{ view.initials }}</div>
          <div>
            <p class="font-bold text-white">{{ view.agency.name }}</p>
            <p class="text-xs">{{ city }}</p>
          </div>
        </div>
        <p class="text-center text-xs md:text-right">© {{ year }} {{ view.agency.name }} — Location de voitures. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  view: { type: Object, required: true },
  theme: { type: Object, required: true },
  content: { type: Object, required: true }
});

const filter = ref('all');
const filters = [
  { label: 'Tous', value: 'all' },
  { label: 'Disponibles', value: 'available' }
];

const city = computed(() => props.view.agency.ville || props.view.agency.location || 'Location');
const year = new Date().getFullYear();
const featured = computed(() => props.view.availableCars[0] || props.view.cars[0] || null);

const visibleCars = computed(() => (filter.value === 'available' ? props.view.availableCars : props.view.cars));

const stats = computed(() => [
  { value: props.view.cars.length, label: 'Véhicules' },
  { value: props.view.availableCars.length, label: 'Disponibles' },
  { value: props.view.staffCount, label: 'Professionnels' },
  { value: '7/7', label: 'Disponibilité' }
]);

const telHref = computed(() => (props.content.phone ? `tel:${props.content.phone}` : '#'));
const waHref = computed(() => {
  const digits = String(props.content.whatsapp || '').replace(/\D/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits.startsWith('212') ? digits : `212${digits.replace(/^0/, '')}`}`;
});

const logoStyle = computed(() => ({ background: `linear-gradient(135deg, ${props.theme.primary}, ${props.theme.dark})` }));
const heroStyle = computed(() => ({ background: `linear-gradient(135deg, ${props.theme.from} 0%, ${props.theme.dark} 100%)` }));
const heroGradient = computed(() => ({ background: `linear-gradient(135deg, ${props.theme.from}, ${props.theme.to})` }));
const gradientBarStyle = computed(() => ({ background: `linear-gradient(90deg, ${props.theme.primary}, ${props.theme.to})` }));
const ctaStyle = computed(() => ({ background: `linear-gradient(135deg, ${props.theme.primary}, ${props.theme.dark})` }));
const contactStyle = computed(() => ({ background: `linear-gradient(135deg, ${props.theme.dark} 0%, ${props.theme.from} 100%)` }));
</script>

<style scoped>
#flotte,
#apropos,
#contact {
  scroll-margin-top: 5rem;
}
</style>
