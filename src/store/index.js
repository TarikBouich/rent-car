import { reactive } from 'vue';
import { imageStore } from './imageStore';

// Load data from localStorage or use default values
const loadCars = () => {
  const savedCars = localStorage.getItem('cars');
  return savedCars ? JSON.parse(savedCars) : [];
};

const loadReservations = () => {
  const savedReservations = localStorage.getItem('reservations');
  return savedReservations ? JSON.parse(savedReservations) : [];
};

const loadCompletedReservations = () => {
  const savedCompletedReservations = localStorage.getItem('completedReservations');
  return savedCompletedReservations ? JSON.parse(savedCompletedReservations) : [];
};

// Client Store
export const clientStore = reactive({
  clients: [],
  loadClients() {
    try {
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        this.clients = JSON.parse(savedClients);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
      this.clients = [];
    }
  },
  addClient(client) {
    this.clients.push(client);
    localStorage.setItem('clients', JSON.stringify(this.clients));
  },
  updateClient(index, client) {
    if (index >= 0 && index < this.clients.length) {
      this.clients[index] = { ...client };
      localStorage.setItem('clients', JSON.stringify(this.clients));
    }
  },
  deleteClient(index) {
    if (index >= 0 && index < this.clients.length) {
      this.clients.splice(index, 1);
      localStorage.setItem('clients', JSON.stringify(this.clients));
    }
  }
});

// Initialize clients from localStorage
const savedClients = localStorage.getItem('clients');
if (savedClients) {
  clientStore.clients = JSON.parse(savedClients);
}

// Car Store
export const carStore = reactive({
  cars: loadCars(),
  reservations: loadReservations(),
  completedReservations: loadCompletedReservations(),
  addCar(car) {
    this.cars.push(car);
    localStorage.setItem('cars', JSON.stringify(this.cars));
  },
  addReservation(reservation) {
    this.reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(this.reservations));
  },
  addCompletedReservation(reservation) {
    this.completedReservations.push(reservation);
    localStorage.setItem('completedReservations', JSON.stringify(this.completedReservations));
  },
  saveData() {
    localStorage.setItem('cars', JSON.stringify(this.cars));
    localStorage.setItem('reservations', JSON.stringify(this.reservations));
    localStorage.setItem('completedReservations', JSON.stringify(this.completedReservations));
  },
  getAvailableCars(startDate, endDate) {
    const reservedCarIds = this.reservations
      .filter(reservation => {
        const reservationStart = new Date(reservation.startDate);
        const reservationEnd = new Date(reservation.endDate);
        return (
          (reservationStart >= startDate && reservationStart <= endDate) ||
          (reservationEnd >= startDate && reservationEnd <= endDate) ||
          (reservationStart <= startDate && reservationEnd >= endDate)
        );
      })
      .map(reservation => reservation.carId);

    return this.cars.filter(car => !reservedCarIds.includes(car.id));
  },
  getCarByLicensePlate(licensePlate) {
    return this.cars.find(car => car.licensePlate === licensePlate);
  },
  checkMaintenanceNotifications() {
    return this.cars.filter(car => car.needsVidange);
  }
});

// Load initial data
clientStore.loadClients();

export { clientStore, carStore }; 