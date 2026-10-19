<template>
  <div v-if="agency" class="min-h-screen bg-[#F8FAFC] font-[Inter] text-slate-900" :style="pageStyle">
    <!-- ===== Sticky Top Nav ===== -->
    <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3 min-w-0">
            <img
              v-if="agencyLogo"
              :src="agencyLogo"
              :alt="agency.name"
              class="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow"
            />
            <div v-else class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm" :style="logoStyle">
              {{ initials }}
            </div>
            <div class="min-w-0">
              <p class="font-bold text-slate-900 truncate leading-tight">{{ agency.name }}</p>
              <p class="text-xs text-slate-500 truncate flex items-center gap-1">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {{ agency.ville || agency.location || 'Location' }}
              </p>
            </div>
          </div>
          <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#flotte" @click.prevent="scrollToSection('flotte')" class="hover:text-slate-900 transition-colors">Notre Flotte</a>
            <a href="#apropos" @click.prevent="scrollToSection('apropos')" class="hover:text-slate-900 transition-colors">À propos</a>
            <a href="#contact" @click.prevent="scrollToSection('contact')" class="hover:text-slate-900 transition-colors">Contact</a>
          </nav>
          <a
            :href="agency.phone ? 'tel:' + agency.phone : '#'"
            class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all"
            :style="ctaStyle"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            {{ agency.phone || 'Réserver' }}
          </a>
        </div>
      </div>
    </header>

    <!-- ===== Hero ===== -->
    <section class="relative overflow-hidden text-white" :style="heroStyle">
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 28px 28px;"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-black/20 blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div class="max-w-3xl">
          <div class="flex items-center gap-2 mb-6">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur text-xs font-bold uppercase tracking-wider">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              Location de voitures &amp; utilitaires
            </span>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            Louez la voiture parfaite<br />
            <span class="opacity-90">{{ agency.ville || 'chez nous' }}</span>
          </h1>
          <p class="mt-6 text-lg text-white/85 max-w-2xl leading-relaxed">
            {{ agency.name }} met à votre disposition une flotte moderne et entretenue de véhicules.
            Tarifs transparents, véhicules récents, service client disponible 7j/7.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#flotte"
              @click.prevent="scrollToSection('flotte')"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white font-bold text-slate-900 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              Découvrir la flotte
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
            </a>
            <a
              :href="agency.phone ? 'tel:' + agency.phone : '#'"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/40 font-bold text-white hover:bg-white/10 transition-all"
            >
              Nous contacter
            </a>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white/10 border border-white/20 backdrop-blur rounded-2xl p-5 text-center">
            <p class="text-3xl font-black">{{ agencyCars.length }}</p>
            <p class="text-xs font-semibold uppercase tracking-wider text-white/75 mt-1">Véhicules</p>
          </div>
          <div class="bg-white/10 border border-white/20 backdrop-blur rounded-2xl p-5 text-center">
            <p class="text-3xl font-black">{{ availableCars.length }}</p>
            <p class="text-xs font-semibold uppercase tracking-wider text-white/75 mt-1">Disponibles</p>
          </div>
          <div class="bg-white/10 border border-white/20 backdrop-blur rounded-2xl p-5 text-center">
            <p class="text-3xl font-black">{{ agencyStaff.length }}</p>
            <p class="text-xs font-semibold uppercase tracking-wider text-white/75 mt-1">Professionnels</p>
          </div>
          <div class="bg-white/10 border border-white/20 backdrop-blur rounded-2xl p-5 text-center">
            <p class="text-3xl font-black">7/7</p>
            <p class="text-xs font-semibold uppercase tracking-wider text-white/75 mt-1">Disponibilité</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Fleet ===== -->
    <section id="flotte" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <p class="text-xs font-black uppercase tracking-widest mb-2" :style="labelStyle">Notre flotte</p>
          <h2 class="text-3xl lg:text-4xl font-black tracking-tight">Nos véhicules en location</h2>
          <p class="text-slate-500 mt-2 max-w-xl">Une sélection de véhicules entretenus, prête à vous accompagner au quotidien.</p>
        </div>
        <div class="flex gap-2">
          <button
            v-for="f in carFilters"
            :key="f.value"
            @click="activeFilter = f.value"
            class="px-4 py-2 rounded-full text-sm font-bold border transition-all"
            :class="activeFilter === f.value ? 'text-white border-transparent shadow-lg' : 'text-slate-600 border-slate-200 hover:border-slate-400'"
            :style="activeFilter === f.value ? filterActiveStyle : {}"
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <div v-if="filteredCars.length === 0" class="text-center py-20 bg-white rounded-3xl border border-slate-200">
        <div class="text-6xl mb-4">🚗</div>
        <h3 class="text-lg font-bold">Aucun véhicule disponible</h3>
        <p class="text-slate-500 mt-1">Contactez-nous, notre équipe vous trouvera la voiture idéale.</p>
        <a :href="agency.phone ? 'tel:' + agency.phone : '#'" class="inline-block mt-4 px-5 py-2.5 rounded-full text-white text-sm font-bold" :style="ctaStyle">Nous contacter</a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="car in filteredCars"
          :key="car.id"
          class="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
        >
          <div class="relative h-56 overflow-hidden bg-slate-100">
            <img
              v-if="getCarImage(car)"
              :src="getCarImage(car)"
              :alt="car.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-24 h-24 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l1.5-5.5A2 2 0 018.45 6h7.1a2 2 0 011.95 1.5L19 13m-14 0h14m-14 0a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-3a2 2 0 00-2-2M7 15h.01M17 15h.01"/></svg>
            </div>
            <span
              class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg"
              :class="car.status === 'Available' ? 'bg-emerald-500 text-white' : 'bg-slate-800/80 text-white'"
            >
              {{ car.status === 'Available' ? 'Disponible' : (car.status || 'Sur demande') }}
            </span>
            <span class="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/95 text-slate-900 text-xs font-black shadow-lg">
              {{ car.year || 'Récent' }}
            </span>
          </div>

          <div class="p-6 flex flex-col flex-1">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h3 class="text-lg font-black text-slate-900 leading-tight">{{ car.name }}</h3>
                <p class="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <span class="inline-block w-2 h-2 rounded-full shrink-0" :style="{ background: theme.primary }"></span>
                  {{ getBrandName(car.brandId) }} {{ getModelName(car.modelId) }}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs text-slate-600">
              <span class="inline-flex items-center gap-1.5">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                {{ car.seats || 5 }} places
              </span>
              <span class="inline-flex items-center gap-1.5">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                {{ car.fuelType || 'Diesel' }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a2 2 0 11-4 0 2 2 0 014 0zm0 0a2 2 0 104 0 2 2 0 00-4 0z"/></svg>
                {{ car.transmission || 'Manuelle' }}
              </span>
            </div>

            <div class="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Prix / jour</p>
                <p class="text-2xl font-black">
                  <span class="text-slate-900">{{ formatPrice(car.pricePerDay) }}</span>
                  <span class="text-sm font-semibold text-slate-500"> DH</span>
                </p>
              </div>
              <a
                :href="agency.phone ? 'tel:' + agency.phone : '#'"
                class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-white text-sm font-bold shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all"
                :style="ctaStyle"
              >
                Réserver
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ===== About ===== -->
    <section id="apropos" class="bg-white border-y border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p class="text-xs font-black uppercase tracking-widest mb-2" :style="labelStyle">À propos</p>
          <h2 class="text-3xl lg:text-4xl font-black tracking-tight">{{ agency.name }}</h2>
          <p class="text-slate-500 mt-4 leading-relaxed">
            Votre agence de location de voitures située à <strong class="text-slate-700">{{ agency.ville || agency.location }}</strong>.
            Nous proposons des véhicules soigneusement entretenus, une prise en charge rapide et des tarifs
            compétitifs, adaptés à vos besoins professionnels ou personnels.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div class="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" :style="logoStyle">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <div>
                <p class="font-bold text-sm">Véhicules contrôlés</p>
                <p class="text-xs text-slate-500 mt-0.5">Entretien et visites techniques à jour</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" :style="logoStyle">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <p class="font-bold text-sm">Tarifs transparents</p>
                <p class="text-xs text-slate-500 mt-0.5">Aucun frais caché, devis clair</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" :style="logoStyle">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <p class="font-bold text-sm">Service réactif</p>
                <p class="text-xs text-slate-500 mt-0.5">Une équipe à votre écoute 7j/7</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" :style="logoStyle">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <p class="font-bold text-sm">Localisation idéale</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ agency.ville || agency.location || 'Centre ville' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Info card -->
        <div class="relative">
          <div class="absolute -inset-3 rounded-3xl opacity-10 blur-2xl" :style="heroGradient"></div>
          <div class="relative bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl">
            <div class="h-1.5" :style="gradientBarStyle"></div>
            <div class="p-8">
              <h3 class="text-xl font-black mb-6">Informations de l'agence</h3>
              <dl class="space-y-4 text-sm">
                <div v-if="agency.email" class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <dt class="text-xs text-slate-400 uppercase font-bold tracking-wider">Email</dt>
                    <dd class="font-semibold">{{ agency.email }}</dd>
                  </div>
                </div>
                <div v-if="agency.phone" class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div>
                    <dt class="text-xs text-slate-400 uppercase font-bold tracking-wider">Téléphone</dt>
                    <dd class="font-semibold">{{ agency.phone }}</dd>
                  </div>
                </div>
                <div v-if="agency.address || agency.location" class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <dt class="text-xs text-slate-400 uppercase font-bold tracking-wider">Adresse</dt>
                    <dd class="font-semibold">{{ [agency.address, agency.ville || agency.location].filter(Boolean).join(', ') }}</dd>
                  </div>
                </div>
                <div v-if="agencyManagerName" class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                  <div>
                    <dt class="text-xs text-slate-400 uppercase font-bold tracking-wider">Responsable</dt>
                    <dd class="font-semibold">{{ agencyManagerName }}</dd>
                  </div>
                </div>
              </dl>

              <div class="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-3 text-center text-xs">
                <div v-if="agency.if" class="rounded-xl bg-white/5 p-3">
                  <p class="text-slate-400 font-bold uppercase tracking-wider mb-1">IF</p>
                  <p class="font-bold">{{ agency.if }}</p>
                </div>
                <div v-if="agency.rc" class="rounded-xl bg-white/5 p-3">
                  <p class="text-slate-400 font-bold uppercase tracking-wider mb-1">RC</p>
                  <p class="font-bold">{{ agency.rc }}</p>
                </div>
                <div v-if="agency.patente" class="rounded-xl bg-white/5 p-3">
                  <p class="text-slate-400 font-bold uppercase tracking-wider mb-1">Patente</p>
                  <p class="font-bold">{{ agency.patente }}</p>
                </div>
                <div v-if="agency.ice" class="rounded-xl bg-white/5 p-3">
                  <p class="text-slate-400 font-bold uppercase tracking-wider mb-1">ICE</p>
                  <p class="font-bold">{{ agency.ice }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Contact CTA ===== -->
    <section id="contact" class="relative overflow-hidden text-white" :style="ctaSectionStyle">
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 28px 28px;"></div>
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 class="text-3xl lg:text-5xl font-black tracking-tight">Prêt à prendre la route ?</h2>
        <p class="mt-4 text-white/85 text-lg max-w-2xl mx-auto">
          Contactez {{ agency.name }} dès maintenant pour réserver votre véhicule ou obtenir un devis personnalisé.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a :href="agency.phone ? 'tel:' + agency.phone : '#'" class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white font-black text-slate-900 shadow-2xl hover:scale-105 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            {{ agency.phone || 'Appeler maintenant' }}
          </a>
          <a :href="agency.email ? 'mailto:' + agency.email : '#'" class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/40 font-bold hover:bg-white/10 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            {{ agency.email || 'Envoyer un email' }}
          </a>
        </div>
      </div>
    </section>

    <!-- ===== Footer ===== -->
    <footer class="bg-slate-950 text-slate-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <img v-if="agencyLogo" :src="agencyLogo" :alt="agency.name" class="w-10 h-10 rounded-xl object-cover ring-2 ring-white/10" />
            <div v-else class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm" :style="logoStyle">{{ initials }}</div>
            <div>
              <p class="font-bold text-white">{{ agency.name }}</p>
              <p class="text-xs">{{ agency.ville || agency.location }}</p>
            </div>
          </div>
          <p class="text-xs text-center md:text-right">
            © {{ new Date().getFullYear() }} {{ agency.name }} — Location de voitures.
            <br class="md:hidden" />
            Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>

    <!-- ===== Theme picker (3 professional presets) ===== -->
    <div class="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      <transition name="theme-pop">
        <div
          v-if="pickerOpen"
          class="w-[280px] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl p-4"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="text-[11px] font-black uppercase tracking-widest text-slate-400">Thème du site</p>
              <p class="text-sm font-bold text-slate-800">{{ theme.name }}</p>
            </div>
            <button
              @click="pickerOpen = false"
              class="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              title="Fermer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="t in THEMES"
              :key="t.id"
              @click="setTheme(t.id)"
              class="rounded-xl overflow-hidden border-2 bg-white transition-all text-left"
              :class="theme.id === t.id ? 'border-slate-900 shadow-md scale-[1.02]' : 'border-slate-200 hover:border-slate-400'"
            >
              <span class="block h-14 relative" :style="{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }">
                <span
                  v-if="theme.id === t.id"
                  class="absolute top-1 right-1 w-4 h-4 rounded-full bg-white text-slate-900 flex items-center justify-center shadow"
                >
                  <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </span>
              </span>
              <span class="block px-1.5 py-1.5 text-[10px] font-bold text-center text-slate-600">{{ t.name }}</span>
            </button>
          </div>

          <p class="mt-3 text-[10px] leading-snug text-slate-400 text-center">
            3 thèmes professionnels. Votre choix est enregistré pour cette agence.
          </p>
        </div>
      </transition>

      <button
        v-if="!pickerOpen"
        @click="pickerOpen = true"
        class="w-12 h-12 rounded-full text-white shadow-xl shadow-slate-900/20 flex items-center justify-center hover:scale-105 transition-transform"
        :style="ctaStyle"
        title="Choisir un thème"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3a9 9 0 100 18h1.5a2.5 2.5 0 000-5H12a2 2 0 010-4h4.5A3.5 3.5 0 0020 8.5 5.5 5.5 0 0014.5 3H12z"/>
          <circle cx="7.5" cy="11.5" r="1" fill="currentColor"/>
          <circle cx="10" cy="7.5" r="1" fill="currentColor"/>
          <circle cx="15" cy="7.5" r="1" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- ===== Loading State ===== -->
  <div v-else class="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4 font-[Inter]">
    <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg animate-pulse" style="background: linear-gradient(135deg, #0EA5E9, #0369A1)">
      RC
    </div>
    <p class="text-sm font-semibold text-slate-500">Chargement de l'agence...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAgencyStore } from '../stores/agencyStore';
import { useCarStore } from '../stores/carStore';
import { useBrandStore } from '../stores/brandStore';
import { useModelStore } from '../stores/modelStore';
import { useUserStore } from '../stores/userStore';

const route = useRoute();
const router = useRouter();

const agencyStore = useAgencyStore();
const carStore = useCarStore();
const brandStore = useBrandStore();
const modelStore = useModelStore();
const userStore = useUserStore();

const agency = ref(null);
const activeFilter = ref('all');
const carFilters = [
  { label: 'Tous', value: 'all' },
  { label: 'Disponibles', value: 'available' }
];

// ---- Three professional, modern themes the agency can choose from ----
const THEMES = [
  { id: 'ocean',   name: 'Océan',    primary: '#0EA5E9', dark: '#0369A1', from: '#0C4A6E', to: '#38BDF8' },
  { id: 'emerald', name: 'Émeraude', primary: '#10B981', dark: '#047857', from: '#064E3B', to: '#34D399' },
  { id: 'rentcar', name: 'RentCar',  primary: '#FA5B0F', dark: '#C2410C', from: '#7C2D12', to: '#FB923C' }
];

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < String(str).length; i++) {
    hash = (hash << 5) - hash + String(str).charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const selectedThemeId = ref(null);
const pickerOpen = ref(true);

const theme = computed(() => THEMES.find(t => t.id === selectedThemeId.value) || THEMES[0]);

const setTheme = (id) => {
  selectedThemeId.value = id;
  if (agency.value?.id) {
    localStorage.setItem(`landing-theme:${agency.value.id}`, id);
  }
};

const defaultThemeId = (source) => THEMES[hashString(source) % THEMES.length].id;

// ---- Helpers ----
const initials = computed(() => {
  const name = agency.value?.name || 'RC';
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
});

const agencyLogo = computed(() => {
  const docs = agency.value?.documents || [];
  const logo = docs.find(d => String(d.agencyType || '').toLowerCase() === 'logo');
  return logo?.dataUrl || '';
});

const getCarImage = (car) => {
  if (!car) return '';
  if (Array.isArray(car.images) && car.images.length > 0) return car.images[0];
  return car.image || '';
};

const getBrandName = (id) => brandStore.getBrandById(id)?.name || '';
const getModelName = (id) => modelStore.getModelById(id)?.name || '';

const formatPrice = (price) => {
  const n = Number(price) || 0;
  return n.toLocaleString('fr-MA');
};

const agencyCars = computed(() => {
  const id = route.params.id;
  return carStore.cars.filter(c => c.agencyId === id);
});

const availableCars = computed(() => agencyCars.value.filter(c => c.status === 'Available'));

const filteredCars = computed(() => {
  if (activeFilter.value === 'available') return availableCars.value;
  return agencyCars.value;
});

const agencyStaff = computed(() => {
  const id = route.params.id;
  return userStore.users.filter(u => u.agencyId === id);
});

const agencyManagerName = computed(() => {
  const id = agency.value?.gerantId;
  if (!id) return '';
  const g = userStore.getUserById?.(id) || userStore.users.find(u => u.id === id);
  if (!g) return '';
  return [g.firstName, g.lastName].filter(Boolean).join(' ') || g.name || '';
});

// ---- Styles bound with brand colors ----
const pageStyle = computed(() => ({ '--brand': theme.value.primary }));
const logoStyle = computed(() => ({ background: `linear-gradient(135deg, ${theme.value.primary}, ${theme.value.dark})` }));
const heroGradient = computed(() => ({ background: `linear-gradient(135deg, ${theme.value.from}, ${theme.value.to})` }));
const heroStyle = computed(() => ({ background: `linear-gradient(135deg, ${theme.value.from} 0%, ${theme.value.dark} 100%)` }));
const gradientBarStyle = computed(() => ({ background: `linear-gradient(90deg, ${theme.value.primary}, ${theme.value.to})` }));
const ctaStyle = computed(() => ({ background: `linear-gradient(135deg, ${theme.value.primary}, ${theme.value.dark})` }));
const ctaSectionStyle = computed(() => ({ background: `linear-gradient(135deg, ${theme.value.dark} 0%, ${theme.value.from} 100%)` }));
const labelStyle = computed(() => ({ color: theme.value.primary }));
const filterActiveStyle = computed(() => ({ background: `linear-gradient(135deg, ${theme.value.primary}, ${theme.value.dark})` }));

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const savedTheme = localStorage.getItem(`landing-theme:${found.id}`);
  selectedThemeId.value = THEMES.some(t => t.id === savedTheme)
    ? savedTheme
    : defaultThemeId(`${found.id || ''}-${found.name || ''}`);
});
</script>

<style scoped>
#flotte,
#apropos,
#contact {
  scroll-margin-top: 5rem;
}

.theme-pop-enter-active,
.theme-pop-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.theme-pop-enter-from,
.theme-pop-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
</style>