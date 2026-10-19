<template>
  <div class="min-h-screen bg-[#FAF8F5] font-[Inter] text-neutral-900">
    <!-- Top strip -->
    <div class="border-b border-neutral-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <span class="truncate">{{ city }} — Location de véhicules</span>
        <a v-if="content.phone" :href="telHref" class="shrink-0 transition-colors hover:text-neutral-900">{{ content.phone }}</a>
      </div>
    </div>

    <!-- Nav -->
    <header class="sticky top-0 z-40 border-b border-neutral-200 bg-[#FAF8F5]/95 backdrop-blur">
      <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" class="flex items-center gap-3">
          <img v-if="view.logo" :src="view.logo" :alt="view.agency.name" class="h-11 w-11 rounded-full object-cover" />
          <div v-else class="flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-white" :style="logoStyle">{{ view.initials }}</div>
          <div class="leading-tight">
            <p class="text-sm font-black uppercase tracking-[0.2em]">{{ view.agency.name }}</p>
            <p class="text-[10px] uppercase tracking-[0.3em] text-neutral-400">Car rental</p>
          </div>
        </a>

        <nav class="hidden items-center gap-8 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 lg:flex">
          <a v-if="content.showFleet" href="#flotte" class="transition-colors hover:text-neutral-900">La sélection</a>
          <a v-if="content.showAbout" href="#apropos" class="transition-colors hover:text-neutral-900">L'agence</a>
          <a v-if="content.showContact" href="#contact" class="transition-colors hover:text-neutral-900">Contact</a>
        </nav>

        <a
          :href="telHref"
          class="hidden items-center gap-2 border-b-2 pb-1 text-[11px] font-black uppercase tracking-[0.18em] transition-opacity hover:opacity-60 sm:flex"
          :style="{ borderColor: theme.primary, color: theme.dark }"
        >
          {{ content.secondaryCta }}
        </a>
      </div>
    </header>

    <!-- Hero -->
    <section class="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
      <div class="grid items-end gap-10 lg:grid-cols-12">
        <div class="lg:col-span-7">
          <p class="mb-6 inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.24em]" :style="{ color: theme.dark }">
            <span class="inline-block h-px w-10" :style="{ background: theme.primary }"></span>
            {{ content.badge }}
          </p>
          <h1 class="font-serif text-5xl leading-[0.98] tracking-tight sm:text-6xl lg:text-[5.2rem]">
            {{ content.heroTitle }}
            <span class="block italic" :style="{ color: theme.dark }">{{ content.heroHighlight }}</span>
          </h1>
          <p class="mt-8 max-w-xl text-base leading-relaxed text-neutral-500 sm:text-lg">{{ content.heroSubtitle }}</p>

          <div class="mt-9 flex flex-wrap items-center gap-5">
            <a
              v-if="content.showFleet"
              href="#flotte"
              class="group inline-flex items-center gap-3 px-7 py-3.5 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:opacity-90"
              :style="{ background: theme.dark }"
            >
              {{ content.primaryCta }}
              <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
            <a :href="telHref" class="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-neutral-900">
              {{ content.phone || 'Appeler' }}
            </a>
          </div>
        </div>

        <!-- Featured visual -->
        <div class="lg:col-span-5">
          <figure class="relative">
            <div class="aspect-[4/5] overflow-hidden bg-neutral-200">
              <img
                v-if="featured && view.carImage(featured)"
                :src="view.carImage(featured)"
                :alt="featured.name"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full items-center justify-center" :style="{ background: `linear-gradient(160deg, ${theme.from}, ${theme.dark})` }">
                <svg class="h-28 w-28 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M5 13l1.5-5.5A2 2 0 018.45 6h7.1a2 2 0 011.95 1.5L19 13m-14 0h14m-14 0a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-3a2 2 0 00-2-2M7 15h.01M17 15h.01"/></svg>
              </div>
            </div>
            <figcaption class="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-neutral-400">
              <span>{{ featured?.name || 'Votre prochain véhicule' }}</span>
              <span v-if="featured">{{ view.price(featured.pricePerDay) }} DH / jour</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <!-- Stats line -->
      <div v-if="content.showStats" class="mt-14 grid grid-cols-2 gap-6 border-t border-neutral-300 pt-6 sm:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label">
          <p class="font-serif text-3xl font-bold sm:text-4xl">{{ stat.value }}</p>
          <p class="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Fleet -->
    <section v-if="content.showFleet" id="flotte" class="border-y border-neutral-200 bg-white">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p class="text-[11px] font-black uppercase tracking-[0.24em]" :style="{ color: theme.dark }">01 — La sélection</p>
            <h2 class="mt-3 font-serif text-3xl tracking-tight sm:text-4xl lg:text-5xl">{{ content.fleetTitle }}</h2>
          </div>
          <p class="max-w-sm text-sm leading-relaxed text-neutral-500">{{ content.fleetSubtitle }}</p>
        </div>

        <div v-if="view.cars.length === 0" class="mt-12 border border-neutral-200 py-16 text-center">
          <p class="font-serif text-2xl">Aucun véhicule pour le moment</p>
          <p class="mt-2 text-sm text-neutral-500">Contactez-nous pour connaître les disponibilités.</p>
        </div>

        <div v-else class="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          <article
            v-for="(car, index) in view.cars"
            :key="car.id"
            class="group w-[300px] shrink-0 snap-start sm:w-[360px]"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-neutral-100">
              <img v-if="view.carImage(car)" :src="view.carImage(car)" :alt="car.name" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div v-else class="flex h-full items-center justify-center bg-neutral-100">
                <svg class="h-20 w-20 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M5 13l1.5-5.5A2 2 0 018.45 6h7.1a2 2 0 011.95 1.5L19 13m-14 0h14m-14 0a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-3a2 2 0 00-2-2M7 15h.01M17 15h.01"/></svg>
              </div>
              <span class="absolute left-3 top-3 bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]" :style="{ color: theme.dark }">
                {{ car.status === 'Available' ? 'Disponible' : 'Sur demande' }}
              </span>
            </div>

            <div class="flex items-start justify-between gap-4 border-b border-neutral-200 py-4">
              <div>
                <p class="font-serif text-xl leading-tight">{{ car.name }}</p>
                <p class="mt-1 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                  {{ view.brandName(car) }} {{ view.modelName(car) }} · {{ car.year || 'Récent' }}
                </p>
              </div>
              <p class="shrink-0 text-right">
                <span class="font-serif text-xl font-bold">{{ view.price(car.pricePerDay) }}</span>
                <span class="block text-[9px] uppercase tracking-[0.18em] text-neutral-400">DH / jour</span>
              </p>
            </div>

            <a :href="telHref" class="mt-3 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] transition-opacity hover:opacity-60" :style="{ color: theme.dark }">
              Réserver
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
          </article>
        </div>
      </div>
    </section>

    <!-- About -->
    <section v-if="content.showAbout" id="apropos" class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div class="grid gap-14 lg:grid-cols-12">
        <div class="lg:col-span-5">
          <p class="text-[11px] font-black uppercase tracking-[0.24em]" :style="{ color: theme.dark }">02 — {{ content.aboutTitle }}</p>
          <h2 class="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">{{ content.aboutHeading }}</h2>
          <p class="mt-6 text-base leading-relaxed text-neutral-500">{{ content.aboutText }}</p>

          <div class="mt-8 border-l-2 pl-5" :style="{ borderColor: theme.primary }">
            <p class="font-serif text-xl italic text-neutral-700">« La route commence ici. »</p>
            <p class="mt-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400">{{ view.agency.name }}</p>
          </div>
        </div>

        <div class="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7">
          <div v-for="(feature, index) in content.features" :key="feature.title" class="border-t border-neutral-300 pt-5">
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">0{{ index + 1 }}</p>
            <p class="mt-3 font-serif text-xl">{{ feature.title }}</p>
            <p class="mt-2 text-sm leading-relaxed text-neutral-500">{{ feature.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section v-if="content.showContact" id="contact" class="bg-neutral-950 text-white">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div class="grid gap-12 lg:grid-cols-12">
          <div class="lg:col-span-7">
            <p class="text-[11px] font-black uppercase tracking-[0.24em] text-white/40">03 — Contact</p>
            <h2 class="mt-4 max-w-3xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">{{ content.contactTitle }}</h2>
            <p class="mt-6 max-w-xl text-base leading-relaxed text-white/60">{{ content.contactText }}</p>

            <a :href="telHref" class="mt-10 inline-flex items-center gap-4 border-b border-white/30 pb-3 transition-colors hover:border-white">
              <span class="text-2xl font-bold sm:text-3xl">{{ content.phone || 'Appeler maintenant' }}</span>
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
          </div>

          <div class="lg:col-span-5">
            <dl class="space-y-6 border-t border-white/15 pt-8 text-sm">
              <div v-if="content.email">
                <dt class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Email</dt>
                <dd class="mt-1 text-white/90"><a :href="`mailto:${content.email}`" class="hover:underline">{{ content.email }}</a></dd>
              </div>
              <div v-if="content.address">
                <dt class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Adresse</dt>
                <dd class="mt-1 text-white/90">{{ content.address }}</dd>
              </div>
              <div v-if="waHref">
                <dt class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">WhatsApp</dt>
                <dd class="mt-1"><a :href="waHref" target="_blank" rel="noopener" class="text-white/90 hover:underline">Discuter maintenant</a></dd>
              </div>
              <div v-if="view.managerName">
                <dt class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Responsable</dt>
                <dd class="mt-1 text-white/90">{{ view.managerName }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-neutral-950 text-white">
      <div class="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div class="border-t border-white/10 pt-8">
          <p class="font-serif text-[13vw] leading-none tracking-tighter text-white/10 lg:text-[9rem]">{{ view.initials }}</p>
          <div class="mt-4 flex flex-col justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-white/40 sm:flex-row">
            <span>{{ view.agency.name }} — {{ city }}</span>
            <span>© {{ year }} Tous droits réservés</span>
          </div>
        </div>
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
</script>

<style scoped>
#flotte,
#apropos,
#contact {
  scroll-margin-top: 6rem;
}
</style>
