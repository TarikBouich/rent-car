<template>
  <div class="flex flex-col gap-2">
    <!-- Dashboard -->
    <RouterLink
      :to="{ name: 'dashboard' }"
      class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
      :class="route.name === 'dashboard' ? 'bg-primary-100 text-white' : 'text-gray-100 hover:bg-gray-50'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"/>
      </svg>
      <span>Dashboard</span>
    </RouterLink>

    <!-- Cars -->
    <RouterLink
      :to="{ name: 'cars' }"
      class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
      :class="route.name === 'cars' ? 'bg-primary-100 text-white' : 'text-gray-100 hover:bg-gray-50'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 20H5V21C5 21.6 4.6 22 4 22H3C2.4 22 2 21.6 2 21V12L4.3 6.7C4.9 5.7 6 5 7.2 5H16.9C18.1 5 19.2 5.7 19.7 6.7L22 12V21C22 21.6 21.6 22 21 22H20C19.4 22 19 21.6 19 21V20ZM7.5 18C8.9 18 10 16.9 10 15.5C10 14.1 8.9 13 7.5 13C6.1 13 5 14.1 5 15.5C5 16.9 6.1 18 7.5 18ZM16.5 18C17.9 18 19 16.9 19 15.5C19 14.1 17.9 13 16.5 13C15.1 13 14 14.1 14 15.5C14 16.9 15.1 18 16.5 18ZM18 7H6L4 11H20L18 7Z"/>
      </svg>
      <span>Cars</span>
    </RouterLink>

    <!-- Reservations -->
    <RouterLink
      :to="{ name: 'reservations' }"
      class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
      :class="route.name === 'reservations' ? 'bg-primary-100 text-white' : 'text-gray-100 hover:bg-gray-50'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 4h-1V3c0-.6-.4-1-1-1s-1 .4-1 1v1H8V3c0-.6-.4-1-1-1s-1 .4-1 1v1H5C3.3 4 2 5.3 2 7v12c0 1.7 1.3 3 3 3h14c1.7 0 3-1.3 3-3V7c0-1.7-1.3-3-3-3zm1 15c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1V10h16v9zm0-11H4V7c0-.6.4-1 1-1h1v1c0 .6.4 1 1 1s1-.4 1-1V6h8v1c0 .6.4 1 1 1s1-.4 1-1V6h1c.6 0 1 .4 1 1v1z"/>
      </svg>
      <span>Reservations</span>
    </RouterLink>

    <!-- Archived Reservations -->
    <RouterLink
      :to="{ name: 'archived-reservations' }"
      class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
      :class="route.name === 'archived-reservations' ? 'bg-primary-100 text-white' : 'text-gray-100 hover:bg-gray-50'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5zm11-5.5l-4 4-4-4 1.41-1.41L11 13.67V10h2v3.67l1.59-1.59L16 13.5z"/>
      </svg>
      <span>Archived Reservations</span>
    </RouterLink>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  components: {
    RouterLink
  },
  props: {
    route: {
      type: Object,
      required: true
    }
  }
}
</script> 