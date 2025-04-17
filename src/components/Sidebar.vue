<template>
  <div class="flex flex-col gap-2">
    <RouterLink
      :to="{ name: 'reservations' }"
      class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
      :class="
        route.name === 'reservations'
          ? 'bg-primary-100 text-white'
          : 'text-gray-100 hover:bg-gray-50'
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        class="w-5 h-5"
        fill="currentColor"
      >
        <path
          d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4z"
        />
      </svg>
      <span>Reservations</span>
    </RouterLink>
    <RouterLink
      :to="{ name: 'clients' }"
      class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
      :class="
        route.name === 'clients'
          ? 'bg-primary-100 text-white'
          : 'text-gray-100 hover:bg-gray-50'
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        class="w-5 h-5"
        fill="currentColor"
      >
        <path
          d="M10 9a3 3 0 100-6 3 3 0 000 6zM2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4z"
        />
      </svg>
      <span>Clients</span>
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