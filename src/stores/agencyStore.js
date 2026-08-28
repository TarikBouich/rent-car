import { defineStore } from 'pinia';
import { useTransactionStore } from './transactionStore';
import { useUserStore } from './userStore';
import { useCompanyStore } from './companyStore';
import { SAAS_PLANS } from '../utils/planConstants';
import agencyService from '../services/agencyService';

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
    async initializeFromStorage() {
      try {
        const response = await agencyService.getAll();
        this.agencies = response.data.map(agency => {
          if (typeof agency.documents === 'string') {
            try { agency.documents = JSON.parse(agency.documents); } catch(e) { agency.documents = []; }
          }
          if (!Array.isArray(agency.documents)) agency.documents = [];
          return agency;
        });
      } catch (error) {
        console.error('Failed to fetch agencies:', error);
      }
    },
    async addAgency(name, ville, documents = [], initialEspece = 0, initialBanque = 0) {
      try {
        const newAgencyData = {
          id: 'agency_' + Date.now(),
          name,
          ville: ville,
          location: ville, // Maintain backwards compatibility with the component expectation
          address: '',
          phone: '',
          status: 'Active',
          documents: documents,
          initialEspece: parseFloat(initialEspece) || 0,
          initialBanque: parseFloat(initialBanque) || 0
        };
        const response = await agencyService.create(newAgencyData);
        const finalData = response.data;
        if (typeof finalData.documents === 'string') {
          try { finalData.documents = JSON.parse(finalData.documents); } catch(e) { finalData.documents = []; }
        }
        if (!Array.isArray(finalData.documents)) finalData.documents = [];
        this.agencies.unshift(finalData);
        return finalData;
      } catch (error) {
        if (error.response && error.response.status === 402) {
           alert("Limite de forfait dépassée.");
        }
        console.error('Failed to create agency', error);
      }
    },

    async updateAgency(updatedAgency) {
      try {
        const response = await agencyService.update(updatedAgency.id, updatedAgency);
        const index = this.agencies.findIndex(a => a.id === updatedAgency.id);
        if (index !== -1) {
          const finalData = response.data;
          if (typeof finalData.documents === 'string') {
            try { finalData.documents = JSON.parse(finalData.documents); } catch(e) { finalData.documents = []; }
          }
          if (!Array.isArray(finalData.documents)) finalData.documents = [];
          this.agencies[index] = { ...this.agencies[index], ...finalData };
        }
      } catch (error) {
        console.error('Failed to update agency', error);
      }
    },
    async deleteAgency(agencyId) {
      try {
        await agencyService.delete(agencyId);
        this.agencies = this.agencies.filter(a => a.id !== agencyId);
      } catch (error) {
        console.error('Failed to delete agency', error);
      }
    }
  }
});
