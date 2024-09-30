<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-6">Car Rental Dashboard</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Loop through car data and pass each car object to AppCard -->
      <app-card v-for="(car, index) in cars" :key="index" :car="car" />
    </div>
  </div>
</template>

<script>
import AppCard from "../components/AppCard.vue";
export default {
  components: {
    AppCard,
  },
  data() {
    return {
      cars: [
        {
          name: 'Toyota Corolla',
          licensePlate: 'ABC-1234',
          status: 'Available',
          pricePerDay: 50,
          image: 'https://via.placeholder.com/60',
        },
        {
          name: 'Honda Accord',
          licensePlate: 'DEF-5678',
          status: 'Rented',
          pricePerDay: 50,
          image: 'https://via.placeholder.com/60',
        },
        {
          name: 'Ford Mustang',
          licensePlate: 'GHI-9101',
          status: 'Available',
          pricePerDay: 70,
          image: 'https://via.placeholder.com/60',
        },
        {
          name: 'Tesla Model 3',
          licensePlate: 'JKL-2345',
          status: 'Rented',
          pricePerDay: 100,
          image: 'https://via.placeholder.com/60',
        },
      ]
    }
  }
};
</script>
