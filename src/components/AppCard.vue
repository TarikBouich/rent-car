<template>
  <div class="bg-primary-50 rounded-lg shadow-md p-4">
    <img :src="car.image" alt="Car Image" class="w-full h-60 object-cover rounded-md mb-4">
    <div class="grid gap-2">
      <h2 class="text-lg font-bold border-b pb-2 mb-2 border-primary-90">{{ car.name }}</h2>
      <p class="text-white flex items-center justify-between">License Plate: <span class="ml-2 px-3 py-1 bg-primary-90 text-sm">{{ car.licensePlate }}</span></p>
      <p class="text-white flex items-center justify-between">Status: <span class="ml-2 px-3 py-1 bg-primary-90 text-sm">{{ car.status }}</span></p>
      <p class="text-white flex items-center justify-between font-semibold">Price per Day: <span class="ml-2 px-3 py-1 bg-primary-90 text-sm">${{ car.pricePerDay }}</span></p>
    </div>
   
  </div>
</template>

<script>
export default {
  props: {
    car: {
      type: Object,
      required: true,
    }
  }
};
</script>
