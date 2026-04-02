import { defineStore } from 'pinia';
import { useUserStore } from './userStore';
import { useSettingsStore } from './settingsStore';
import { useModelStore } from './modelStore';
import { useBrandStore } from './brandStore';

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
    },

    voituresAlerts: (state) => {
      const userStore = useUserStore();
      return userStore.filterByAgency(state.alerts).filter(alert => alert.category === 'voitures');
    }
  },

  actions: {
    checkAlerts() {
      const settingsStore = useSettingsStore();
      settingsStore.initializeFromStorage();
      
      const thresholds = settingsStore.alertThresholds || { active: true };

      if (!thresholds.active) {
        this.alerts = [];
        return;
      }

      const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const cars = JSON.parse(localStorage.getItem('cars') || '[]');
      const newAlerts = [];

      const modelStore = useModelStore();
      const brandStore = useBrandStore();
      modelStore.initializeFromStorage();
      brandStore.initializeFromStorage();

      const getCarName = (car) => {
        if (!car) return 'Véhicule Inconnu';
        const brand = brandStore.brands.find(b => b.id === car.brandId)?.name || '';
        const model = modelStore.models.find(m => m.id === car.modelId)?.name || '';
        return brand || model ? `${brand} ${model}`.trim() : 'Véhicule Inconnu';
      };

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const getFutureDate = (days) => {
        const d = new Date(today);
        d.setDate(d.getDate() + Number(days || 0));
        return d;
      };

      // Check car returns using retourContrat threshold
      const retourThresholdDate = getFutureDate(thresholds.retourContrat || 0);

      reservations.forEach(reservation => {
        if (reservation.status === 'Active') {
          const endDate = new Date(reservation.endDate);
          endDate.setHours(0, 0, 0, 0);
          
          if (endDate <= retourThresholdDate && endDate >= today) {
            const car = cars.find(c => c.licensePlate === reservation.carId);
            const carNameStr = car ? getCarName(car) : (reservation.carName || 'Inconnu');
            newAlerts.push({
              id: `return-${reservation.id}`,
              type: 'return',
              message: `Retour Prévu: Le véhicule ${carNameStr} (${reservation.carId}) doit être retourné aujourd'hui par ${reservation.clientName} (${reservation.clientPhone})`,
              priority: 'high',
              category: 'locations',
              agencyId: car?.agencyId || reservation.agencyId
            });
          }
        }
      });

      // Check cars - VOITURES alerts with dynamic threshold logic
      cars.forEach(car => {
        // Check technical inspection (Visite Technique)
        const vtThresholdDate = getFutureDate(thresholds.finVisiteTechnique || 0);
        if (car.visiteTechniqueEndDate) {
          const inspectionDate = new Date(car.visiteTechniqueEndDate);
          if (inspectionDate < today) {
            newAlerts.push({
              id: `inspection-expired-${car.licensePlate}`,
              type: 'inspection',
              message: `⚠️ Visite technique EXPIRÉE pour ${getCarName(car)} (${car.licensePlate})`,
              priority: 'high',
              category: 'voitures',
              agencyId: car.agencyId
            });
          } else if (inspectionDate <= vtThresholdDate && inspectionDate >= today) {
            const daysLeft = Math.ceil((inspectionDate - today) / (1000 * 60 * 60 * 24));
            newAlerts.push({
              id: `inspection-soon-${car.licensePlate}`,
              type: 'inspection',
              message: `Visite technique dans ${daysLeft}j pour ${getCarName(car)} (${car.licensePlate}) - ${inspectionDate.toLocaleDateString('fr-FR')}`,
              priority: 'medium',
              category: 'voitures',
              agencyId: car.agencyId
            });
          }
        }

        // Check vidange (dynamic km threshold)
        const kmThreshold = Number(thresholds.kmAvantEntretien || 1000);
        if (car.currentMileage !== undefined && car.nextVidangeKm) {
          const kmLeft = car.nextVidangeKm - car.currentMileage;
          if (kmLeft <= kmThreshold && kmLeft > 0) {
            newAlerts.push({
              id: `vidange-soon-${car.licensePlate}`,
              type: 'vidange',
              message: `Vidange proche pour ${getCarName(car)} (${car.licensePlate}) - ${kmLeft}km restants (limite: ${kmThreshold}km)`,
              priority: 'medium',
              category: 'voitures',
              agencyId: car.agencyId
            });
          } else if (car.currentMileage >= car.nextVidangeKm) {
            newAlerts.push({
              id: `vidange-due-${car.licensePlate}`,
              type: 'vidange',
              message: `⚠️ Vidange DÛE pour ${getCarName(car)} (${car.licensePlate}) - Actuel: ${car.currentMileage}km >= ${car.nextVidangeKm}km`,
              priority: 'high',
              category: 'voitures',
              agencyId: car.agencyId
            });
          }
        }

        // Check assurance
        const assuranceThresholdDate = getFutureDate(thresholds.finAssurance || 0);
        if (car.assuranceEndDate) {
          const assuranceDate = new Date(car.assuranceEndDate);
          assuranceDate.setHours(0, 0, 0, 0);
          if (assuranceDate < today) {
            newAlerts.push({
              id: `assurance-expired-${car.licensePlate}`,
              type: 'assurance',
              message: `⚠️ Assurance EXPIRÉE pour ${getCarName(car)} (${car.licensePlate})`,
              priority: 'high',
              category: 'voitures',
              agencyId: car.agencyId
            });
          } else if (assuranceDate <= assuranceThresholdDate && assuranceDate >= today) {
            const daysLeft = Math.ceil((assuranceDate - today) / (1000 * 60 * 60 * 24));
            newAlerts.push({
              id: `assurance-soon-${car.licensePlate}`,
              type: 'assurance',
              message: `Assurance expire dans ${daysLeft}j pour ${getCarName(car)} (${car.licensePlate}) - ${assuranceDate.toLocaleDateString('fr-FR')}`,
              priority: 'medium',
              category: 'voitures',
              agencyId: car.agencyId
            });
          }
        }
      });

      // Check Entretiens (Polymorphic Maintenance Logs)
      const entretiens = JSON.parse(localStorage.getItem('entretiens') || '[]');
      const entretienTypes = JSON.parse(localStorage.getItem('entretienTypes') || '[]');
      
      const entretienDateThreshold = getFutureDate(thresholds.entretienParDate || 15);
      const kmThreshold = Number(thresholds.kmAvantEntretien || 1000);

      // Only evaluate the MOST RECENT log of any specific type for each car so we don't alert old completed actions
      const latestEntretiensMap = {};
      entretiens.forEach(log => {
        const key = `${log.carId}_${log.typeId}`;
        if (!latestEntretiensMap[key] || new Date(log.date) > new Date(latestEntretiensMap[key].date)) {
          latestEntretiensMap[key] = log;
        }
      });

      Object.values(latestEntretiensMap).forEach(log => {
        const typeConfig = entretienTypes.find(t => t.id === log.typeId);
        if (!typeConfig) return;

        const car = cars.find(c => c.id === log.carId);
        if (!car) return;

        // KM Alert Engine
        if (typeConfig.alertKm && log.nextKm && car.currentMileage != null) {
          const kmLeft = log.nextKm - car.currentMileage;
          // Note: Vidange uses custom standard system higher up, but this catches Chaine and custom km types
          if (!typeConfig.name.toLowerCase().includes('vidange')) {
            if (kmLeft <= kmThreshold && kmLeft > 0) {
              newAlerts.push({
                id: `entretien-km-soon-${log.id}`,
                type: 'entretien',
                message: `${typeConfig.name} proche pour ${getCarName(car)} (${car.licensePlate}) - ${kmLeft}km restants.`,
                priority: 'medium',
                category: 'voitures',
                agencyId: car.agencyId
              });
            } else if (car.currentMileage >= log.nextKm) {
              newAlerts.push({
                id: `entretien-km-due-${log.id}`,
                type: 'entretien',
                message: `⚠️ ${typeConfig.name} DÛ pour ${getCarName(car)} (${car.licensePlate}) - Kilométrage dépassé!`,
                priority: 'high',
                category: 'voitures',
                agencyId: car.agencyId
              });
            }
          }
        }

        // Date Alert Engine
        if (typeConfig.alertDate && log.nextDate) {
          const nextDateObj = new Date(log.nextDate);
          nextDateObj.setHours(0, 0, 0, 0);

          if (nextDateObj < today) {
            newAlerts.push({
              id: `entretien-date-expired-${log.id}`,
              type: 'entretien',
              message: `⚠️ ${typeConfig.name} DÉPASSÉ pour ${getCarName(car)} (${car.licensePlate}) depuis ${nextDateObj.toLocaleDateString('fr-FR')}`,
              priority: 'high',
              category: 'voitures',
              agencyId: car.agencyId
            });
          } else if (nextDateObj <= entretienDateThreshold && nextDateObj >= today) {
            const daysLeft = Math.ceil((nextDateObj - today) / (1000 * 60 * 60 * 24));
            newAlerts.push({
              id: `entretien-date-soon-${log.id}`,
              type: 'entretien',
              message: `${typeConfig.name} prévu dans ${daysLeft}j pour ${getCarName(car)} (${car.licensePlate})`,
              priority: 'medium',
              category: 'voitures',
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
      console.log('Current alerts:', newAlerts);
    },

    initialize() {
      this.checkAlerts();
    }
  }
});
