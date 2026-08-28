import api from './api';

const agencyService = {
  getAll() {
    return api.get('/agencies');
  },
  getById(id) {
    return api.get(`/agencies/${id}`);
  },
  create(agencyData) {
    return api.post('/agencies', agencyData);
  },
  update(id, agencyData) {
    return api.put(`/agencies/${id}`, agencyData);
  },
  delete(id) {
    return api.delete(`/agencies/${id}`);
  }
};

export default agencyService;
