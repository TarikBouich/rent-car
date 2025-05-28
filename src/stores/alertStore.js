import { defineStore } from 'pinia';
import { useUserStore } from './userStore';

export const useAlertStore = defineStore('alert', {
  state: () => ({
    alerts: []
  }),

  getters: {
    totalAlerts: (state) => {
      const userStore = useUserStore();
      return userStore.filterByAgency(state.alerts).length;
    },

    filteredAlerts: (state) => {
      const userStore = useUserStore();
      return userStore.filterByAgency(state.alerts);
    }
  },

  actions: {
    checkAlerts() {
      const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const cars = JSON.parse(localStorage.getItem('cars') || '[]');
      const newAlerts = [];

      // Get today's date and tomorrow's date
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Check car returns
      reservations.forEach(reservation => {
        if (reservation.status === 'Active') {
          const endDate = new Date(reservation.endDate);
          if (endDate.toDateString() === today.toDateString()) {
            // Find the car to get its agencyId
            const car = cars.find(c => c.licensePlate === reservation.carId);
            newAlerts.push({
              id: `return-${reservation.id}`,
              type: 'return',
              message: `Car ${reservation.carName} needs to be returned today by ${reservation.clientName} (${reservation.clientPhone})`,
              priority: 'high',
              agencyId: car?.agencyId || reservation.agencyId
            });
          }
        }
      });

      // Check cars
      cars.forEach(car => {
        // Check technical inspection
        if (car.visiteTechniqueEndDate) {
          const inspectionDate = new Date(car.visiteTechniqueEndDate);
          if (inspectionDate < today) {
            newAlerts.push({
              id: `inspection-expired-${car.licensePlate}`,
              type: 'inspection',
              message: `⚠️ Technical inspection EXPIRED for ${car.name} (${car.licensePlate})`,
              priority: 'high',
              agencyId: car.agencyId
            });
          } else if (inspectionDate.toDateString() === tomorrow.toDateString()) {
            newAlerts.push({
              id: `inspection-${car.licensePlate}`,
              type: 'inspection',
              message: `Technical inspection due tomorrow for ${car.name} (${car.licensePlate})`,
              priority: 'medium',
              agencyId: car.agencyId
            });
          }
        }

        // Check oil change
        if (car.currentMileage && car.nextVidangeKm) {
          if (car.currentMileage >= car.nextVidangeKm) {
            newAlerts.push({
              id: `oil-${car.licensePlate}`,
              type: 'maintenance',
              message: `Oil change needed for ${car.name} (${car.licensePlate}) - Current: ${car.currentMileage}km, Next: ${car.nextVidangeKm}km`,
              priority: 'medium',
              agencyId: car.agencyId
            });
          }
        }

        // Check insurance
        if (car.assuranceEndDate) {
          const insuranceDate = new Date(car.assuranceEndDate);
          if (insuranceDate < today) {
            newAlerts.push({
              id: `insurance-expired-${car.licensePlate}`,
              type: 'insurance',
              message: `⚠️ Insurance EXPIRED for ${car.name} (${car.licensePlate})`,
              priority: 'high',
              agencyId: car.agencyId
            });
          } else if (insuranceDate.toDateString() === tomorrow.toDateString()) {
            newAlerts.push({
              id: `insurance-${car.licensePlate}`,
              type: 'insurance',
              message: `Insurance expires tomorrow for ${car.name} (${car.licensePlate})`,
              priority: 'medium',
              agencyId: car.agencyId
            });
          }
        }
      });

      // Sort alerts by priority (high first)
      newAlerts.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      this.alerts = newAlerts;
      console.log('Current alerts:', newAlerts); // Debug log
    },

    initialize() {
      this.checkAlerts();
    }
  }
}); 