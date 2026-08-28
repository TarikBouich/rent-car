import api from './api';

const stateService = {
  getAll(keys = []) {
    const query = keys.length ? `?keys=${encodeURIComponent(keys.join(','))}` : '';
    return api.get(`/state${query}`);
  },
  getByKey(key) {
    return api.get(`/state/${key}`);
  },
  setByKey(key, value) {
    return api.put(`/state/${key}`, { value });
  },
  deleteByKey(key) {
    return api.delete(`/state/${key}`);
  }
};

export default stateService;
