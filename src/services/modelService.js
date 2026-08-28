import api from './api';

const modelService = {
  getAll() {
    return api.get('/models');
  },
  getByBrand(brandId) {
    return api.get(`/models/brand/${brandId}`);
  },
  create(modelData) {
    return api.post('/models', modelData);
  },
  update(id, modelData) {
    return api.put(`/models/${id}`, modelData);
  },
  delete(id) {
    return api.delete(`/models/${id}`);
  }
};

export default modelService;
