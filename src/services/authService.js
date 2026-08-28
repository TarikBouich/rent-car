import api from './api';

const authService = {
  login(email, password) {
    return api.post('/auth/login', { email, password });
  },
  
  getMe() {
    return api.get('/auth/me');
  }
};

export default authService;
