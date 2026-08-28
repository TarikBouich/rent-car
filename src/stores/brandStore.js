import { defineStore } from 'pinia';
import brandService from '../services/brandService';

export const useBrandStore = defineStore('brand', {
  state: () => ({
    brands: [],
  }),
  getters: {
    getAllBrands: (state) => state.brands,
    getBrandById: (state) => (brandId) => state.brands.find(brand => brand.id === brandId)
  },
  actions: {
    async initializeFromStorage() {
      try {
        const response = await brandService.getAll();
        this.brands = response.data;
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      }
    },
    async addBrand(name) {
      try {
        const response = await brandService.create({ id: 'brand_' + Date.now(), name });
        this.brands.push(response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to create brand:', error);
        throw error;
      }
    },
    async updateBrand(updatedBrand) {
      try {
        const response = await brandService.update(updatedBrand.id, updatedBrand);
        const index = this.brands.findIndex(b => b.id === updatedBrand.id);
        if (index !== -1) {
          this.brands[index] = { ...this.brands[index], ...response.data };
        }
        return response.data;
      } catch (error) {
        console.error('Failed to update brand:', error);
        throw error;
      }
    },
    async deleteBrand(brandId) {
      try {
        await brandService.delete(brandId);
        this.brands = this.brands.filter(b => b.id !== brandId);
      } catch (error) {
        console.error('Failed to delete brand:', error);
        throw error;
      }
    }
  }
});
