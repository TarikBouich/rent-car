import api from './api';

const brandService = {
  getAll() {
    return api.get('/brands');
  },
  create(brandData) {
    return api.post('/brands', brandData);
  },
  update(id, brandData) {
    return api.put(`/brands/${id}`, brandData);
  },
  delete(id) {
    return api.delete(`/brands/${id}`);
  }
};

export default brandService;
