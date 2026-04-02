import { defineStore } from 'pinia';
import { useTransactionStore } from './transactionStore';
import { generateNextId } from '../utils/idGenerator.js';
import { useUserStore } from './userStore';
import { useCompanyStore } from './companyStore';
import { SAAS_PLANS } from '../utils/planConstants';

export const useAgencyStore = defineStore('agency', {
  state: () => ({
    agencies: [],
  }),
  getters: {
    getAllAgencies: (state) => state.agencies,
    getAgencyById: (state) => (agencyId) => state.agencies.find(agency => agency.id === agencyId),
    getAgencyTotalEspece: (state) => (agencyId) => {
      const txStore = useTransactionStore()
      const agency = state.agencies.find(a => a.id === agencyId)
      if (!agency) return 0
      return (agency.initialEspece || 0) + txStore.getAgencyEspeceFlow(agencyId)
    },
    getAgencyTotalBanque: (state) => (agencyId) => {
      const txStore = useTransactionStore()
      const agency = state.agencies.find(a => a.id === agencyId)
      if (!agency) return 0
      return (agency.initialBanque || 0) + txStore.getAgencyBanqueFlow(agencyId)
    }
  },
  actions: {
    initializeFromStorage() {
      const storedAgencies = localStorage.getItem('agencies');
      if (storedAgencies) {
        this.agencies = JSON.parse(storedAgencies);
      } else {
        // Initialize default
        const defaultAgencies = [
          { id: 'agency1', name: 'Premium Cars Agency', ville: 'Downtown', address: '', phone: '', status: 'active' },
          { id: 'agency2', name: 'Luxury Rentals', ville: 'Uptown', address: '', phone: '', status: 'active' }
        ];
        this.agencies = defaultAgencies;
        localStorage.setItem('agencies', JSON.stringify(this.agencies));
      }
    },
    addAgency(name, ville, documents = [], initialEspece = 0, initialBanque = 0) {
      this.initializeFromStorage(); // Ensure loaded
      const userStore = useUserStore();
      const companyStore = useCompanyStore();
      
      const userCompanyId = userStore.userCompanyId;
      const comp = companyStore.getCompanyById(userCompanyId);
      
      if (comp && comp.planId) {
         const plan = SAAS_PLANS[comp.planId];
         const userAgencies = this.agencies.filter(a => a.companyId === userCompanyId).length;
         if (userAgencies >= plan.limits.agencies) {
            alert(`Limite Atteinte ! Votre forfait '${plan.name}' autorise un maximum de ${plan.limits.agencies} agence(s).`);
            throw new Error('Limite de forfait dépassée.');
         }
      }

      const newAgency = {
        id: 'agency' + Date.now(), // String ID compatible w/ defaults
        companyId: userStore.userCompanyId,
        name,
        ville: ville,
        location: ville, // Maintain backwards compatibility with the component expectation
        address: '',
        phone: '',
        status: 'Active',
        documents: documents, // Add documents directly to the initial object
        initialEspece: parseFloat(initialEspece) || 0,
        initialBanque: parseFloat(initialBanque) || 0
      };
      this.agencies.unshift(newAgency);
      localStorage.setItem('agencies', JSON.stringify(this.agencies));
      return newAgency;
    },

    updateAgency(updatedAgency) {
      const index = this.agencies.findIndex(a => a.id === updatedAgency.id);
      if (index !== -1) {
        this.agencies[index] = { ...this.agencies[index], ...updatedAgency };
        localStorage.setItem('agencies', JSON.stringify(this.agencies));
      }
    },
    deleteAgency(agencyId) {
      this.agencies = this.agencies.filter(a => a.id !== agencyId);
      localStorage.setItem('agencies', JSON.stringify(this.agencies));
    }
  }
});
