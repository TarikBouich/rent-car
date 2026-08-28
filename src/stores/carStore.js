import { defineStore } from 'pinia'
import { generateNextId } from '../utils/idGenerator'
import { useAlertStore } from './alertStore'
import { useUserStore } from './userStore'
import { useCompanyStore } from './companyStore'
import { SAAS_PLANS } from '../utils/planConstants'
import carService from '../services/carService'
import { loadStateJson, saveStateJson } from '../services/stateJsonService'

export const useCarStore = defineStore('car', {
  state: () => ({
    cars: [],
    reservations: [],
    completedReservations: []
  }),

  getters: {
    getAllCars: (state) => state.cars,
    getCarById: (state) => (id) => state.cars.find(car => car.id === id),
    getCarsByAgencyId: (state) => (agencyId) => state.cars.filter(car => car.agencyId === agencyId),

    // Get cars filtered by agency
    filteredCars: (state) => {
      const userStore = useUserStore()
      return userStore.filterByAgency(state.cars)
    },

    // Get reservations filtered by agency
    filteredReservations: (state) => {
      const userStore = useUserStore()
      return userStore.filterByAgency(state.reservations)
    },

    // Get completed reservations filtered by agency
    filteredCompletedReservations: (state) => {
      const userStore = useUserStore()
      return userStore.filterByAgency(state.completedReservations)
    }
  },

  actions: {
    async _syncAllCarAgenciesAcrossState() {
      if (!Array.isArray(this.cars) || this.cars.length === 0) return;

      const agencyByCarId = new Map(
        this.cars
          .filter(car => car?.id && car?.agencyId)
          .map(car => [car.id, car.agencyId])
      );

      if (agencyByCarId.size === 0) return;

      const syncByKey = async (key) => {
        const rows = await loadStateJson(key, []);
        if (!Array.isArray(rows) || rows.length === 0) return false;

        let changed = false;
        const updatedRows = rows.map((row) => {
          const targetAgencyId = agencyByCarId.get(row?.carId);
          if (!targetAgencyId) return row;
          if (row?.agencyId === targetAgencyId) return row;
          changed = true;
          return { ...row, agencyId: targetAgencyId };
        });

        if (changed) {
          await saveStateJson(key, updatedRows);
        }

        return changed;
      };

      const assurancesChanged = await syncByKey('assurances');
      const visitesChanged = await syncByKey('visites');
      const entretiensChanged = await syncByKey('entretiens');
      const chargesChanged = await syncByKey('charges');
      const contratsChanged = await syncByKey('contrats');
      const reservationsChanged = await syncByKey('reservations');
      const completedChanged = await syncByKey('completedReservations');

      if (reservationsChanged) {
        this.reservations = await loadStateJson('reservations', []);
      }
      if (completedChanged) {
        this.completedReservations = await loadStateJson('completedReservations', []);
      }

      return {
        assurancesChanged,
        visitesChanged,
        entretiensChanged,
        chargesChanged,
        contratsChanged,
        reservationsChanged,
        completedChanged
      };
    },

    async runManualAgencyResync() {
      if (!Array.isArray(this.cars) || this.cars.length === 0) {
        const response = await carService.getAll();
        this.cars = response.data.map(c => this._normalizeCar(c));
      }
      const result = await this._syncAllCarAgenciesAcrossState();
      const alertStore = useAlertStore();
      await alertStore.checkAlerts();
      return result || {};
    },

    async _syncCarAgencyAcrossState(carId, newAgencyId) {
      const syncByKey = async (key, shouldUpdate) => {
        const rows = await loadStateJson(key, []);
        if (!Array.isArray(rows) || rows.length === 0) return false;

        let changed = false;
        const updatedRows = rows.map((row) => {
          if (!shouldUpdate(row)) return row;
          if (row.agencyId === newAgencyId) return row;
          changed = true;
          return { ...row, agencyId: newAgencyId };
        });

        if (changed) {
          await saveStateJson(key, updatedRows);
        }
        return changed;
      };

      // Car-linked modules that rely on agencyId filtering
      await syncByKey('assurances', (row) => row?.carId === carId);
      await syncByKey('visites', (row) => row?.carId === carId);
      await syncByKey('entretiens', (row) => row?.carId === carId);
      await syncByKey('charges', (row) => row?.carId === carId);
      await syncByKey('contrats', (row) => row?.carId === carId);
      await syncByKey('reservations', (row) => row?.carId === carId);
      await syncByKey('completedReservations', (row) => row?.carId === carId);
    },

    // Normalize JSON fields that MySQL may return as strings
    _normalizeCar(car) {
      const parseJSON = (val, fallback) => {
        if (val === null || val === undefined) return fallback;
        if (typeof val === 'object') return val;
        try { return JSON.parse(val); } catch { return fallback; }
      };
      car.images     = parseJSON(car.images, []);
      car.damages    = parseJSON(car.damages, []);
      car.options    = parseJSON(car.options, {});
      car.equipments = parseJSON(car.equipments, { climatisation: false, cric: false, documents: false, extincteur: false });
      // Defaults for optional numeric fields
      if (!car.seats) car.seats = 5;
      if (!car.oilMileage) car.oilMileage = 10000;
      if (!car.fuelType) car.fuelType = 'Diesel';
      return car;
    },

    // Initialize data from API
    async initializeFromStorage() {
      try {
        const response = await carService.getAll();
        this.cars = response.data.map(c => this._normalizeCar(c));
        this.reservations = await loadStateJson('reservations', [])
        this.completedReservations = await loadStateJson('completedReservations', [])
        await this._syncAllCarAgenciesAcrossState()
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      }
    },

    // Add a new car
    async addCar(carData) {
      try {
        // Prepare ID before sending
        carData.id = carData.id || 'car_' + Date.now();
        const response = await carService.create(carData);
        this.cars.push(this._normalizeCar(response.data));
        
        // Alert System triggers
        const alertStore = useAlertStore();
        alertStore.checkAlerts();
      } catch (error) {
        if (error.response && error.response.status === 402) {
           alert("Limite de forfait dépassée.");
        }
        console.error('Failed to create car:', error);
        throw error;
      }
    },

    // Add damage to a car
    async addDamage(carId, damage) {
      const userStore = useUserStore()
      const car = this.cars.find(c => c.id === carId)
      if (car) {
        if (!car.damages) car.damages = []
        car.damages.push({
          ...damage,
          companyId: userStore.userCompanyId,
          id: `dmg_${Date.now()}`
        })
        // Persist via API
        await this.updateCar({ id: carId, damages: car.damages })
      }
    },

    // Update a car
    async updateCar(updatedCar) {
      try {
        const existingCar = this.cars.find(car => car.id === updatedCar.id);
        const previousAgencyId = existingCar?.agencyId || null;

        const response = await carService.update(updatedCar.id, updatedCar);
        const index = this.cars.findIndex(car => car.id === updatedCar.id);
        if (index !== -1) {
          this.cars[index] = this._normalizeCar({ ...this.cars[index], ...response.data });

          const nextAgencyId = this.cars[index]?.agencyId || null;
          const agencyChanged = !!nextAgencyId && previousAgencyId !== nextAgencyId;
          if (agencyChanged) {
            await this._syncCarAgencyAcrossState(updatedCar.id, nextAgencyId);
          }

          // Check for new alerts
          const alertStore = useAlertStore();
          alertStore.checkAlerts();
        }
      } catch (error) {
        console.error('Failed to update car', error);
      }
    },

    // Delete a car
    async deleteCar(carId) {
      try {
        await carService.delete(carId);
        this.cars = this.cars.filter(car => car.id !== carId);
        // Check for new alerts
        const alertStore = useAlertStore();
        alertStore.checkAlerts();
      } catch (error) {
        console.error('Failed to delete car', error);
      }
    },

    // Add a reservation (in-memory, full reservation API migration pending)
    addReservation(reservation) {
      const userStore = useUserStore()
      reservation.companyId = userStore.userCompanyId
      this.reservations.push(reservation)
      saveStateJson('reservations', this.reservations)
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    // Update a reservation
    updateReservation(updatedReservation) {
      const index = this.reservations.findIndex(res => res.id === updatedReservation.id)
      if (index !== -1) {
        this.reservations[index] = updatedReservation
        saveStateJson('reservations', this.reservations)
        const alertStore = useAlertStore()
        alertStore.checkAlerts()
      }
    },

    // Complete a reservation
    completeReservation(reservationId) {
      const index = this.reservations.findIndex(res => res.id === reservationId)
      if (index !== -1) {
        const reservation = this.reservations[index]
        reservation.status = 'Completed'
        reservation.completedAt = new Date().toISOString()
        this.completedReservations.push(reservation)
        this.reservations.splice(index, 1)
        saveStateJson('reservations', this.reservations)
        saveStateJson('completedReservations', this.completedReservations)
        const alertStore = useAlertStore()
        alertStore.checkAlerts()
      }
    },

    // Get available cars for a date range
    getAvailableCars(startDate, endDate) {
      const userStore = useUserStore()
      const reservedCarIds = this.reservations
        .filter(reservation => {
          const reservationStart = new Date(reservation.startDate)
          const reservationEnd = new Date(reservation.endDate)
          return (
            (reservationStart >= startDate && reservationStart <= endDate) ||
            (reservationEnd >= startDate && reservationEnd <= endDate) ||
            (reservationStart <= startDate && reservationEnd >= endDate)
          )
        })
        .map(reservation => reservation.carId)

      return this.filteredCars.filter(car => 
        !reservedCarIds.includes(car.id) && 
        car.status === 'available'
      )
    },

    // Load initial cars data
    async initializeCars() {
      await this.initializeFromStorage();
    }
  }
}) 
