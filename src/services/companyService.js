import api from './api';

class CompanyService {
  getAll() {
    return api.get('/companies');
  }

  getById(id) {
    return api.get(`/companies/${id}`);
  }

  create(companyData) {
    return api.post('/companies', companyData);
  }

  update(id, companyData) {
    return api.put(`/companies/${id}`, companyData);
  }

  getSupportContact() {
    return api.get('/companies/support-contact');
  }

  updateSupportContact(payload) {
    return api.put('/companies/support-contact', payload);
  }
}

export default new CompanyService();
