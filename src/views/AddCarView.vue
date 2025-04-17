<template>
  <div>
    <div class="p-4">
      <!-- Success Message -->
      <div v-if="showSuccess" class="mb-4 p-4 rounded-lg bg-success-50 text-success-100">
        Car added successfully! Redirecting...
      </div>
      
      <div
        class="rounded-xl shadow-card overflow-hidden"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white-100'"
      >
        <div
          class="p-4 border-b flex items-center justify-between"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <span class="text-lg font-bold leading-none">Add Car</span>
          <div class="flex items-center">
            <RouterLink
              :to="{ name: 'cars' }"
              class="button primary-button small-button"
            >
              Cars
            </RouterLink>
          </div>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="text-[15px] mb-1 block font-medium">Marque</label>
              <input
                v-model="newCar.name"
                class="form-field"
                required
                placeholder="Marque"
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium">Matricule</label>
              <input
                v-model="newCar.licensePlate"
                class="form-field"
                placeholder="Matricule"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium">Model</label>
              <input
                v-model="newCar.model"
                type="text"
                placeholder="Model"
                class="form-field"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium">Numero de chasse</label>
              <input
                v-model="newCar.chassisNumber"
                type="text"
                placeholder="Numero de chasse"
                class="form-field"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium">Carburant</label>
              <input
                v-model="newCar.fuelType"
                type="text"
                placeholder="Carburant"
                class="form-field"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium">Nombre porte</label>
              <input
                v-model="newCar.doors"
                type="number"
                placeholder="Nombre porte"
                class="form-field"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium">Compteur KM</label>
              <input
                v-model="newCar.currentMileage"
                type="number"
                placeholder="Compteur KM"
                class="form-field"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium">Prix/Jour</label>
              <input
                v-model="newCar.pricePerDay"
                type="number"
                placeholder="Prix/Jour"
                class="form-field"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium">Date fin d'assurance</label>
              <input
                v-model="newCar.assuranceEndDate"
                type="date"
                class="form-field"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium">Date fin visite technique</label>
              <input
                v-model="newCar.visiteTechniqueEndDate"
                type="date"
                class="form-field"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium">Dernier vidange (km)</label>
              <input
                v-model="newCar.lastVidangeKm"
                type="number"
                class="form-field"
                @change="calculateNextVidange"
                required
              />
            </div>
            <div v-if="newCar.nextVidangeKm" class="mt-2 text-sm text-gray-500">
              Prochain vidange à: {{ newCar.nextVidangeKm }} km
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium">Etat</label>
              <select v-model="newCar.status" class="form-field" required>
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
              </select>
            </div>
            <div class="col-span-3">
              <label class="text-[15px] mb-1 block font-medium">Image</label>
              <input
                type="file"
                @change="handleImageUpload"
                class="form-field"
                accept="image/*"
              />
            </div>
          </div>
        </div>
        <div class="border-t-4 rounded-bl-xl rounded-br-xl bg-white-100 p-4">
          <div class="flex items-center justify-end">
            <button @click="addCar" class="button primary-button">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { carStore } from "../store";
import TopBar from "../components/TopBar.vue";
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';

export default {
  components: {
    TopBar,
    RouterLink
  },
  props: {
    mode: String,
  },
  data() {
    return {
      router: useRouter(),
      newCar: {
        name: "",
        licensePlate: "",
        model: "",
        chassisNumber: "",
        fuelType: "",
        doors: 0,
        currentMileage: 0,
        pricePerDay: 0,
        status: "Available",
        image: "",
        assuranceEndDate: "",
        visiteTechniqueEndDate: "",
        needsVidange: false,
        lastVidangeKm: 0,
        nextVidangeKm: 0
      },
      showSuccess: false,
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newCar.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    addCar() {
      // Add the new car to the global store
      carStore.addCar({ ...this.newCar });
      
      // Show success message
      this.showSuccess = true;
      
      // Reset form
      this.resetForm();
      
      // Redirect after 2 seconds
      setTimeout(() => {
        this.router.push({ name: 'cars' });
      }, 2000);
    },
    resetForm() {
      this.newCar = {
        name: "",
        licensePlate: "",
        model: "",
        chassisNumber: "",
        fuelType: "",
        doors: 0,
        currentMileage: 0,
        pricePerDay: 0,
        status: "Available",
        image: "",
        assuranceEndDate: "",
        visiteTechniqueEndDate: "",
        needsVidange: false,
        lastVidangeKm: 0,
        nextVidangeKm: 0
      };
    },
    calculateNextVidange() {
      if (this.newCar.lastVidangeKm) {
        this.newCar.nextVidangeKm = parseInt(this.newCar.lastVidangeKm) + 9500;
      }
    },
  },
};
</script>
