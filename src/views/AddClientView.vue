<template>
  <div>
    <TopBar :mode="mode" @toggle="$emit('toggle')">
      <span class="text-[21px] font-bold">Add Client</span>
    </TopBar>
    <div class="p-4">
      <div
        class="rounded-xl shadow-card overflow-hidden"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white-100'"
      >
        <div
          class="p-4 border-b flex items-center justify-between xs:flex-col xs:items-start xs:gap-2"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <span class="text-lg font-bold leading-none">Add Client</span>
          <div class="flex items-center gap-2 xs:w-full">
            <RouterLink
              :to="{ name: 'clients' }"
              class="button primary-button small-button"
            >
              Clients
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
              <label class="text-[15px] mb-1 block font-medium"
                >Matricule</label
              >
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
                v-model="newCar.pricePerDay"
                type="text"
                placeholder="Model"
                class="form-field"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium"
                >Numero de chasse</label
              >
              <input
                v-model="newCar.pricePerDay"
                type="text"
                placeholder="Numero de chasse"
                class="form-field"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium"
                >Carburant</label
              >
              <input
                v-model="newCar.pricePerDay"
                type="text"
                placeholder="Carburant"
                class="form-field"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium"
                >Nombre porte</label
              >
              <input
                v-model="newCar.pricePerDay"
                type="text"
                placeholder="Nombre porte"
                class="form-field"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium"
                >Compteur KM</label
              >
              <input
                v-model="newCar.pricePerDay"
                type="text"
                placeholder="Compteur KM"
                class="form-field"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium"
                >Prix/Jour</label
              >
              <input
                v-model="newCar.pricePerDay"
                type="text"
                placeholder="Prix/Jour"
                class="form-field"
                required
              />
            </div>
            <div>
              <label class="text-[15px] mb-1 block font-medium">Etat</label>
              <input
                v-model="newCar.pricePerDay"
                type="text"
                placeholder="Etat"
                class="form-field"
                required
              />
            </div>
            <div class="col-span-3">
              <label class="text-[15px] mb-1 block font-medium">Image</label>
              <input
                type="file"
                placeholder="Etat"
                class="form-field"
                required
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
export default {
  components: {
    TopBar,
  },
  data() {
    return {
      newCar: {
        name: "",
        licensePlate: "",
        pricePerDay: 0,
        status: "Available",
      },
    };
  },
  methods: {
    addCar() {
      // Add the new car to the global store
      carStore.addCar({ ...this.newCar });
      this.resetForm();
    },
    resetForm() {
      this.newCar = {
        name: "",
        licensePlate: "",
        pricePerDay: 0,
        status: "Available",
      };
    },
  },
};
</script>
