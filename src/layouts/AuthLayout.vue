<template>
  <div class="min-h-screen flex items-center justify-center" :class="mode === 'dark' ? 'bg-gray-200 dark:bg-gray-900' : 'bg-gray-100'">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold" :class="mode === 'dark' ? 'text-white' : 'text-primary'">Rent Car</h1>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',
  props: {
    mode: {
      type: String,
      default: 'light'
    }
  }
}
</script> 