import { defineStore } from 'pinia'
import { generateNextId, sortByIdDesc } from '../utils/idGenerator'
import { useAlertStore } from './alertStore'
import { useUserStore } from './userStore'
import { useCompanyStore } from './companyStore'
import { SAAS_PLANS } from '../utils/planConstants'

export const useCarStore = defineStore('car', {
  state: () => ({
    cars: JSON.parse(localStorage.getItem('cars') || '[]'),
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
    // Initialize data from localStorage
    initializeFromStorage() {
      // Load data from localStorage
      this.cars = JSON.parse(localStorage.getItem('cars') || '[]')
      this.reservations = JSON.parse(localStorage.getItem('reservations') || '[]')
      this.completedReservations = JSON.parse(localStorage.getItem('completedReservations') || '[]')
    },

    // Add a new car
    addCar(car) {
      const userStore = useUserStore()
      const companyStore = useCompanyStore()
      
      const userCompanyId = userStore.userCompanyId
      const comp = companyStore.getCompanyById(userCompanyId)
      
      if (comp && comp.planId) {
         const plan = SAAS_PLANS[comp.planId]
         const userCars = this.cars.filter(c => c.companyId === userCompanyId).length
         if (userCars >= plan.limits.cars) {
            alert(`Limite Atteinte ! Votre forfait '${plan.name}' autorise un maximum de ${plan.limits.cars} véhicules.`)
            throw new Error('Limite de forfait dépassée.')
         }
      }

      car.companyId = userCompanyId
      this.cars.push(car)
      this.saveCars()
      // Check for new alerts
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    // Add damage to a car
    addDamage(carId, damage) {
      const userStore = useUserStore()
      const car = this.cars.find(c => c.id === carId)
      if (car) {
        if (!car.damages) car.damages = []
        car.damages.push({
          ...damage,
          companyId: userStore.userCompanyId,
          id: `dmg_${Date.now()}`
        })
        this.saveCars()
      }
    },

    // Update a car
    updateCar(updatedCar) {
      const index = this.cars.findIndex(car => car.id === updatedCar.id)
      if (index !== -1) {
        this.cars[index] = { ...this.cars[index], ...updatedCar }
        this.saveCars()
        // Check for new alerts
        const alertStore = useAlertStore()
        alertStore.checkAlerts()
      }
    },

    // Delete a car
    deleteCar(carId) {
      this.cars = this.cars.filter(car => car.id !== carId)
      this.saveCars()
      // Check for new alerts
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    // Add a new reservation
    addReservation(reservation) {
      const userStore = useUserStore()
      reservation.companyId = userStore.userCompanyId
      this.reservations.push(reservation)
      this.saveReservations()
      // Check for new alerts
      const alertStore = useAlertStore()
      alertStore.checkAlerts()
    },

    // Update a reservation
    updateReservation(updatedReservation) {
      const index = this.reservations.findIndex(res => res.id === updatedReservation.id)
      if (index !== -1) {
        this.reservations[index] = updatedReservation
        this.saveReservations()
        // Check for new alerts
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
        this.saveReservations()
        this.saveCompletedReservations()
        // Check for new alerts
        const alertStore = useAlertStore()
        alertStore.checkAlerts()
      }
    },

    // Save methods
    saveCars() {
      localStorage.setItem('cars', JSON.stringify(this.cars))
    },

    saveReservations() {
      localStorage.setItem('reservations', JSON.stringify(this.reservations))
    },

    saveCompletedReservations() {
      localStorage.setItem('completedReservations', JSON.stringify(this.completedReservations))
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
    initializeCars() {
      const savedCars = localStorage.getItem('cars')
      if (savedCars) {
        this.cars = JSON.parse(savedCars)
      }
    }
  }
}) 