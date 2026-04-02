import { defineStore } from 'pinia';

export const useModelStore = defineStore('model', {
  state: () => ({
    models: [],
  }),
  getters: {
    getAllModels: (state) => state.models,
    getModelById: (state) => (modelId) => state.models.find(model => model.id === modelId),
    getModelsByBrandId: (state) => (brandId) => state.models.filter(model => model.brandId === brandId)
  },
  actions: {
    initializeFromStorage() {
      const storedModels = localStorage.getItem('models');
      if (storedModels) {
        this.models = JSON.parse(storedModels);
      } else {
        // Initialize default
        const defaultModels = [
          { id: 'model1', brandId: 'brand1', name: 'Corolla', category: 'Berline' },
          { id: 'model2', brandId: 'brand2', name: 'C-Class', category: 'Berline' },
          { id: 'model3', brandId: 'brand3', name: 'X5', category: 'SUV' },
          { id: 'model4', brandId: 'brand4', name: 'Clio 4', category: 'Citadine' }
        ];
        this.models = defaultModels;
        localStorage.setItem('models', JSON.stringify(this.models));
      }
    },
    addModel(brandId, name) {
      this.initializeFromStorage(); // Ensure loaded
      const newModel = {
        id: 'model' + Date.now(),
        brandId,
        name
      };
      this.models.unshift(newModel);
      localStorage.setItem('models', JSON.stringify(this.models));
      return newModel;
    },
    updateModel(updatedModel) {
      const index = this.models.findIndex(m => m.id === updatedModel.id);
      if (index !== -1) {
        this.models[index] = { ...this.models[index], ...updatedModel };
        localStorage.setItem('models', JSON.stringify(this.models));
      }
    },
    deleteModel(modelId) {
      this.models = this.models.filter(m => m.id !== modelId);
      localStorage.setItem('models', JSON.stringify(this.models));
    }
  }
});
