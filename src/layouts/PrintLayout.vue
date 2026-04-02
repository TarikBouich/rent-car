<template>
  <div class="print-layout min-h-screen bg-white text-black">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PrintLayout'
}
</script>

<style scoped>
@media print {
  .print-layout {
    background: transparent;
    min-height: auto;
  }
}
</style>
