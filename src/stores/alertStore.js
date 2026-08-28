import { defineStore } from 'pinia';
import { useUserStore } from './userStore';
import { useSettingsStore } from './settingsStore';
import { useModelStore } from './modelStore';
import { useBrandStore } from './brandStore';
import { useCarStore } from './carStore';
import { useEntretienStore } from './entretienStore';
import { useEntretienTypeStore } from './entretienTypeStore';

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
    async checkAlerts() {
      const userStore = useUserStore();
      const settingsStore = useSettingsStore();
      await settingsStore.initializeFromStorage();
      
      const thresholds = settingsStore.alertThresholds || { active: true };

      if (!thresholds.active) {
        this.alerts = [];
        return;
      }

      const carStore = useCarStore();
      await carStore.initializeFromStorage();
      const reservations = carStore.reservations || [];
      const cars = carStore.cars || [];
      const newAlerts = [];
      const currentCompanyId = userStore.userCompanyId || userStore.currentUser?.companyId || null;

      const modelStore = useModelStore();
      const brandStore = useBrandStore();
      await modelStore.initializeFromStorage();
      await brandStore.initializeFromStorage();

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

      const pushAlert = (payload) => {
        newAlerts.push({
          ...payload,
          companyId: payload.companyId || currentCompanyId,
          agencyId: payload.agencyId || null
        });
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
            pushAlert({
              id: `return-${reservation.id}`,
              type: 'return',
              message: `Retour Prévu: Le véhicule ${carNameStr} (${reservation.carId}) doit être retourné aujourd'hui par ${reservation.clientName} (${reservation.clientPhone})`,
              priority: 'high',
              category: 'locations',
              agencyId: car?.agencyId || reservation.agencyId,
              companyId: car?.companyId || reservation.companyId || currentCompanyId
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
            pushAlert({
              id: `inspection-expired-${car.licensePlate}`,
              type: 'inspection',
              message: `⚠️ Visite technique EXPIRÉE pour ${getCarName(car)} (${car.licensePlate})`,
              priority: 'high',
              category: 'voitures',
              agencyId: car.agencyId,
              companyId: car.companyId || currentCompanyId
            });
          } else if (inspectionDate <= vtThresholdDate && inspectionDate >= today) {
            const daysLeft = Math.ceil((inspectionDate - today) / (1000 * 60 * 60 * 24));
            pushAlert({
              id: `inspection-soon-${car.licensePlate}`,
              type: 'inspection',
              message: `Visite technique dans ${daysLeft}j pour ${getCarName(car)} (${car.licensePlate}) - ${inspectionDate.toLocaleDateString('fr-FR')}`,
              priority: 'medium',
              category: 'voitures',
              agencyId: car.agencyId,
              companyId: car.companyId || currentCompanyId
            });
          }
        }

        // Check vidange (dynamic km threshold)
        const kmThreshold = Number(thresholds.kmAvantEntretien || 1000);
        if (car.currentMileage !== undefined && car.nextVidangeKm) {
          const kmLeft = car.nextVidangeKm - car.currentMileage;
          if (kmLeft <= kmThreshold && kmLeft > 0) {
            pushAlert({
              id: `vidange-soon-${car.licensePlate}`,
              type: 'vidange',
              message: `Vidange proche pour ${getCarName(car)} (${car.licensePlate}) - ${kmLeft}km restants (limite: ${kmThreshold}km)`,
              priority: 'medium',
              category: 'voitures',
              agencyId: car.agencyId,
              companyId: car.companyId || currentCompanyId
            });
          } else if (car.currentMileage >= car.nextVidangeKm) {
            pushAlert({
              id: `vidange-due-${car.licensePlate}`,
              type: 'vidange',
              message: `⚠️ Vidange DÛE pour ${getCarName(car)} (${car.licensePlate}) - Actuel: ${car.currentMileage}km >= ${car.nextVidangeKm}km`,
              priority: 'high',
              category: 'voitures',
              agencyId: car.agencyId,
              companyId: car.companyId || currentCompanyId
            });
          }
        }

        // Check assurance
        const assuranceThresholdDate = getFutureDate(thresholds.finAssurance || 0);
        if (car.assuranceEndDate) {
          const assuranceDate = new Date(car.assuranceEndDate);
          assuranceDate.setHours(0, 0, 0, 0);
          if (assuranceDate < today) {
            pushAlert({
              id: `assurance-expired-${car.licensePlate}`,
              type: 'assurance',
              message: `⚠️ Assurance EXPIRÉE pour ${getCarName(car)} (${car.licensePlate})`,
              priority: 'high',
              category: 'voitures',
              agencyId: car.agencyId,
              companyId: car.companyId || currentCompanyId
            });
          } else if (assuranceDate <= assuranceThresholdDate && assuranceDate >= today) {
            const daysLeft = Math.ceil((assuranceDate - today) / (1000 * 60 * 60 * 24));
            pushAlert({
              id: `assurance-soon-${car.licensePlate}`,
              type: 'assurance',
              message: `Assurance expire dans ${daysLeft}j pour ${getCarName(car)} (${car.licensePlate}) - ${assuranceDate.toLocaleDateString('fr-FR')}`,
              priority: 'medium',
              category: 'voitures',
              agencyId: car.agencyId,
              companyId: car.companyId || currentCompanyId
            });
          }
        }
      });

      // Check Entretiens (Polymorphic Maintenance Logs)
      const entretienStore = useEntretienStore();
      const entretienTypeStore = useEntretienTypeStore();
      await entretienStore.initializeFromStorage();
      await entretienTypeStore.initializeFromStorage();
      const entretiens = entretienStore.entretiens || [];
      const entretienTypes = entretienTypeStore.types || [];
      
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
              pushAlert({
                id: `entretien-km-soon-${log.id}`,
                type: 'entretien',
                message: `${typeConfig.name} proche pour ${getCarName(car)} (${car.licensePlate}) - ${kmLeft}km restants.`,
                priority: 'medium',
                category: 'voitures',
                agencyId: car.agencyId,
                companyId: car.companyId || currentCompanyId
              });
            } else if (car.currentMileage >= log.nextKm) {
              pushAlert({
                id: `entretien-km-due-${log.id}`,
                type: 'entretien',
                message: `⚠️ ${typeConfig.name} DÛ pour ${getCarName(car)} (${car.licensePlate}) - Kilométrage dépassé!`,
                priority: 'high',
                category: 'voitures',
                agencyId: car.agencyId,
                companyId: car.companyId || currentCompanyId
              });
            }
          }
        }

        // Date Alert Engine
        if (typeConfig.alertDate && log.nextDate) {
          const nextDateObj = new Date(log.nextDate);
          nextDateObj.setHours(0, 0, 0, 0);

          if (nextDateObj < today) {
            pushAlert({
              id: `entretien-date-expired-${log.id}`,
              type: 'entretien',
              message: `⚠️ ${typeConfig.name} DÉPASSÉ pour ${getCarName(car)} (${car.licensePlate}) depuis ${nextDateObj.toLocaleDateString('fr-FR')}`,
              priority: 'high',
              category: 'voitures',
              agencyId: car.agencyId,
              companyId: car.companyId || currentCompanyId
            });
          } else if (nextDateObj <= entretienDateThreshold && nextDateObj >= today) {
            const daysLeft = Math.ceil((nextDateObj - today) / (1000 * 60 * 60 * 24));
            pushAlert({
              id: `entretien-date-soon-${log.id}`,
              type: 'entretien',
              message: `${typeConfig.name} prévu dans ${daysLeft}j pour ${getCarName(car)} (${car.licensePlate})`,
              priority: 'medium',
              category: 'voitures',
              agencyId: car.agencyId,
              companyId: car.companyId || currentCompanyId
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

    async initialize() {
      await this.checkAlerts();
    }
  }
});
