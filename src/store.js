import { reactive } from 'vue';

// Client Store
const clientStore = reactive({
  clients: JSON.parse(localStorage.getItem('clients')) || [],
  addClient(client) {
    this.clients.push(client);
    this.saveClients();
  },
  saveClients() {
    localStorage.setItem('clients', JSON.stringify(this.clients));
  },
  getClientByNationalId(nationalId) {
    return this.clients.find(client => client.nationalId === nationalId);
  }
});

// Car Store
const carStore = reactive({
  cars: JSON.parse(localStorage.getItem('cars')) || [],
  reservations: JSON.parse(localStorage.getItem('reservations')) || [],
  completedReservations: JSON.parse(localStorage.getItem('completedReservations')) || [],
  getCarByLicensePlate(licensePlate) {
    return this.cars.find(car => car.licensePlate === licensePlate);
  },
  addCar(car) {
    this.cars.push({
      ...car,
      assuranceEndDate: '',
      visiteTechniqueEndDate: '',
      lastVidangeKm: 0,
      nextVidangeKm: 0,
      needsVidange: false
    });
    this.saveCars();
  },
  updateCar(index, car) {
    this.cars[index] = car;
    this.saveCars();
  },
  saveCars() {
    localStorage.setItem('cars', JSON.stringify(this.cars));
  },
  saveReservations() {
    localStorage.setItem('reservations', JSON.stringify(this.reservations));
  },
  saveCompletedReservations() {
    localStorage.setItem('completedReservations', JSON.stringify(this.completedReservations));
  },
  addReservation(reservation) {
    this.reservations.push(reservation);
    this.saveReservations();
  },
  checkMaintenance() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const maintenanceNotifications = [];
    
    this.cars.forEach(car => {
      // Check assurance
      if (car.assuranceEndDate) {
        const assuranceEnd = new Date(car.assuranceEndDate);
        if (assuranceEnd.toDateString() === tomorrow.toDateString()) {
          maintenanceNotifications.push({
            type: 'assurance',
            message: `Assurance for ${car.name} (${car.licensePlate}) ends tomorrow!`,
            car: car
          });
        }
      }
      
      // Check visite technique
      if (car.visiteTechniqueEndDate) {
        const visiteEnd = new Date(car.visiteTechniqueEndDate);
        if (visiteEnd.toDateString() === tomorrow.toDateString()) {
          maintenanceNotifications.push({
            type: 'visite',
            message: `Visite technique for ${car.name} (${car.licensePlate}) ends tomorrow!`,
            car: car
          });
        }
      }
      
      // Check vidange
      if (car.nextVidangeKm && car.currentMileage) {
        if (car.currentMileage >= car.nextVidangeKm) {
          maintenanceNotifications.push({
            type: 'vidange',
            message: `Vidange needed for ${car.name} (${car.licensePlate})! Current: ${car.currentMileage}km, Next: ${car.nextVidangeKm}km`,
            car: car
          });
        }
      }
    });
    
    return maintenanceNotifications;
  }
});

export { clientStore, carStore }; 