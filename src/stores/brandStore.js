import { defineStore } from 'pinia';

export const useBrandStore = defineStore('brand', {
  state: () => ({
    brands: [],
  }),
  getters: {
    getAllBrands: (state) => state.brands,
    getBrandById: (state) => (brandId) => state.brands.find(brand => brand.id === brandId)
  },
  actions: {
    initializeFromStorage() {
      const storedBrands = localStorage.getItem('brands');
      if (storedBrands) {
        this.brands = JSON.parse(storedBrands);
      } else {
        // Initialize default
        const defaultBrands = [
          { id: 'brand1', name: 'Toyota', logo: '' },
          { id: 'brand2', name: 'Mercedes', logo: '' },
          { id: 'brand3', name: 'BMW', logo: '' },
          { id: 'brand4', name: 'Renault', logo: '' }
        ];
        this.brands = defaultBrands;
        localStorage.setItem('brands', JSON.stringify(this.brands));
      }
    },
    addBrand(name) {
      this.initializeFromStorage(); // Ensure loaded
      const newBrand = {
        id: 'brand' + Date.now(),
        name
      };
      this.brands.unshift(newBrand);
      localStorage.setItem('brands', JSON.stringify(this.brands));
      return newBrand;
    },
    updateBrand(updatedBrand) {
      const index = this.brands.findIndex(b => b.id === updatedBrand.id);
      if (index !== -1) {
        this.brands[index] = { ...this.brands[index], ...updatedBrand };
        localStorage.setItem('brands', JSON.stringify(this.brands));
      }
    },
    deleteBrand(brandId) {
      this.brands = this.brands.filter(b => b.id !== brandId);
      localStorage.setItem('brands', JSON.stringify(this.brands));
    }
  }
});
