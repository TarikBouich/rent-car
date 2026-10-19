import api from './api';

const publicLandingService = {
  get(agencyId) {
    return api.get(`/public/landing/${encodeURIComponent(agencyId)}`);
  }
};

export default publicLandingService;
