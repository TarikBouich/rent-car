// store.js
import { reactive } from 'vue';

export const carStore = reactive({
  cars: [
    {
      name: 'Toyota Corolla',
      licensePlate: 'ABC-1234',
      pricePerDay: 500,
      status: 'Available',
    },
    {
      name: 'Honda Accord',
      licensePlate: 'DEF-5678',
      pricePerDay: 500,
      status: 'Rented',
    },
  ],
  
  addCar(newCar) {
    this.cars.push(newCar);
  },
});
