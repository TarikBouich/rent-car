import { defineStore } from 'pinia'

export const useEntretienTypeStore = defineStore('entretienType', {
  state: () => ({
    // Initialize with standard predefined maintenance types if empty
    types: JSON.parse(localStorage.getItem('entretienTypes') || '[]')
  }),

  getters: {
    getAllTypes: (state) => state.types,
    getTypeById: (state) => (id) => state.types.find(t => t.id === id),
  },

  actions: {
    initializeFromStorage() {
      const stored = JSON.parse(localStorage.getItem('entretienTypes') || '[]')
      if (stored.length === 0) {
        // Pre-seed basic requested defaults
        this.types = [
          { id: 'et_1', name: 'Vidange', alertKm: true, alertDate: true },
          { id: 'et_2', name: 'Chaine de distribution', alertKm: true, alertDate: true },
          { id: 'et_3', name: 'Roue', alertKm: true, alertDate: false },
          { id: 'et_4', name: 'Huile de frein', alertKm: true, alertDate: false },
          { id: 'et_5', name: 'Batterie', alertKm: false, alertDate: true },
          { id: 'et_6', name: 'Filtre aire', alertKm: true, alertDate: false },
          { id: 'et_7', name: 'Filtre climatiseur', alertKm: true, alertDate: false },
          { id: 'et_8', name: 'Filtre huile', alertKm: true, alertDate: false },
          { id: 'et_9', name: 'Filtre diesel', alertKm: true, alertDate: false },
          { id: 'et_10', name: 'Equilibrage / Parallélisme', alertKm: true, alertDate: false },
          { id: 'et_11', name: 'Lavage', alertKm: false, alertDate: false },
          { id: 'et_12', name: 'Tolier', alertKm: false, alertDate: false },
          { id: 'et_13', name: 'Vignette', alertKm: false, alertDate: true }
        ]
        this.saveTypes()
      } else {
        this.types = stored
      }
    },

    addType(typeData) {
      if (!typeData.id) {
        typeData.id = 'et_' + Date.now()
      }
      this.types.push(typeData)
      this.saveTypes()
      return typeData
    },

    updateType(updatedType) {
      const index = this.types.findIndex(t => t.id === updatedType.id)
      if (index !== -1) {
        this.types[index] = { ...this.types[index], ...updatedType }
        this.saveTypes()
      }
    },

    deleteType(typeId) {
      // Prevent deleting basic defaults if necessary, but keep it flexible here.
      this.types = this.types.filter(t => t.id !== typeId)
      this.saveTypes()
    },

    saveTypes() {
      localStorage.setItem('entretienTypes', JSON.stringify(this.types))
    }
  }
})
