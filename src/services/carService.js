import api from './api';

const carService = {
  getAll() {
    return api.get('/cars');
  },
  getById(id) {
    return api.get(`/cars/${id}`);
  },
  create(carData) {
    return api.post('/cars', carData);
  },
  update(id, carData) {
    return api.put(`/cars/${id}`, carData);
  },
  delete(id) {
    return api.delete(`/cars/${id}`);
  }
};

export default carService;
