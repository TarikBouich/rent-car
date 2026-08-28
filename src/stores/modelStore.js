import { defineStore } from 'pinia';
import modelService from '../services/modelService';

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
    async initializeFromStorage() {
      try {
        const response = await modelService.getAll();
        this.models = response.data;
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    },
    async addModel(brandId, name, category) {
      try {
        const newModel = {
          id: 'model_' + Date.now(),
          brandId,
          name,
          category
        };
        const response = await modelService.create(newModel);
        this.models.unshift(response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to create model', error);
        throw error;
      }
    },
    async updateModel(updatedModel) {
      try {
        const response = await modelService.update(updatedModel.id, updatedModel);
        const index = this.models.findIndex(m => m.id === updatedModel.id);
        if (index !== -1) {
          this.models[index] = { ...this.models[index], ...response.data };
        }
        return response.data;
      } catch (error) {
        console.error('Failed to update model', error);
        throw error;
      }
    },
    async deleteModel(modelId) {
      try {
        await modelService.delete(modelId);
        this.models = this.models.filter(m => m.id !== modelId);
      } catch (error) {
        console.error('Failed to delete model', error);
        throw error;
      }
    }
  }
});
