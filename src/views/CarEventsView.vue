<template>
  <div class="p-4">
    <div
      class="rounded-xl shadow-card overflow-hidden"
      :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white-100'"
    >
      <div
        class="px-4 py-2.5 border-b flex items-center justify-between"
        :class="mode === 'dark' ? 'border-dark-50' : ''"
      >
        <span class="text-lg font-bold leading-none">Car Events</span>
      </div>
      <div class="p-4">
        <p>Car Events content will go here</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CarEventsView',
  props: {
    mode: {
      type: String,
      default: 'light'
    }
  }
}
</script> 