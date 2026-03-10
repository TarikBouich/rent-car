import { defineStore } from 'pinia';

export const useAgencyStore = defineStore('agency', {
  state: () => ({
    agencies: [],
  }),
  actions: {
    initializeFromStorage() {
      const storedAgencies = localStorage.getItem('agencies');
      if (storedAgencies) {
        this.agencies = JSON.parse(storedAgencies);
      }
    },
     // Action to get an agency by ID
    getAgencyById(agencyId) {
      return this.agencies.find(agency => agency.id === agencyId);
    }
  },
}); 