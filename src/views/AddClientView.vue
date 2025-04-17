<template>
  <div>
    <div class="p-4">
      <div
        class="rounded-xl shadow-card overflow-hidden"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white-100'"
      >
        <div
          class="px-4 py-2.5 border-b flex items-center justify-between"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <span class="text-lg font-bold leading-none">Add New Client</span>
        </div>
        <div
          class="p-4"
          :class="mode === 'dark' ? 'bg-dark-70' : 'bg-gray-20 bg-opacity-30'"
        >
          <div v-if="error" class="text-red-500 mb-4">
            {{ error }}
          </div>
          <div v-if="loading" class="text-gray-500 mb-4">
            Processing images and saving client data...
          </div>
          <form @submit.prevent="addClient" class="grid gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm mb-1">First Name</label>
                <input
                  type="text"
                  class="form-field"
                  id="firstName"
                  v-model="newClient.firstName"
                  required
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm mb-1">Last Name</label>
                <input
                  type="text"
                  class="form-field"
                  id="lastName"
                  v-model="newClient.lastName"
                  required
                />
              </div>
            </div>
            <div>
              <label for="nationalId" class="block text-sm mb-1">National ID</label>
              <input
                type="text"
                class="form-field"
                id="nationalId"
                v-model="newClient.nationalId"
                required
              />
            </div>
            <div>
              <label for="phoneNumber" class="block text-sm mb-1">Phone Number</label>
              <input
                type="tel"
                class="form-field"
                id="phoneNumber"
                v-model="newClient.phoneNumber"
                required
              />
            </div>
            <div>
              <label for="nationality" class="block text-sm mb-1">Nationality</label>
              <input
                type="text"
                class="form-field"
                id="nationality"
                v-model="newClient.nationality"
                required
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="birthDate" class="block text-sm mb-1">Birth Date</label>
                <input
                  type="date"
                  class="form-field"
                  id="birthDate"
                  v-model="newClient.birthDate"
                  required
                />
              </div>
              <div>
                <label for="profession" class="block text-sm mb-1">Profession</label>
                <input
                  type="text"
                  class="form-field"
                  id="profession"
                  v-model="newClient.profession"
                  required
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="licenseNumber" class="block text-sm mb-1">License Number</label>
                <input
                  type="text"
                  class="form-field"
                  id="licenseNumber"
                  v-model="newClient.licenseNumber"
                  required
                />
              </div>
              <div>
                <label for="licenseDate" class="block text-sm mb-1">License Issue Date</label>
                <input
                  type="date"
                  class="form-field"
                  id="licenseDate"
                  v-model="newClient.licenseDate"
                  required
                />
              </div>
            </div>
            <div>
              <label for="address" class="block text-sm mb-1">Address</label>
              <textarea
                class="form-field"
                id="address"
                v-model="newClient.address"
                rows="2"
                required
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm mb-1">ID Card Front</label>
                <input
                  type="file"
                  class="form-field"
                  @change="handleFileUpload($event, 'idCardFront')"
                  accept="image/*"
                />
                <div v-if="newClient.idCardFront" class="mt-2">
                  <img :src="newClient.idCardFront" class="w-32 h-32 object-cover rounded-lg" />
                </div>
              </div>
              <div>
                <label class="block text-sm mb-1">ID Card Back</label>
                <input
                  type="file"
                  class="form-field"
                  @change="handleFileUpload($event, 'idCardBack')"
                  accept="image/*"
                />
                <div v-if="newClient.idCardBack" class="mt-2">
                  <img :src="newClient.idCardBack" class="w-32 h-32 object-cover rounded-lg" />
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm mb-1">Driver's License Front</label>
                <input
                  type="file"
                  class="form-field"
                  @change="handleFileUpload($event, 'driverLicenseFront')"
                  accept="image/*"
                />
                <div v-if="newClient.driverLicenseFront" class="mt-2">
                  <img :src="newClient.driverLicenseFront" class="w-32 h-32 object-cover rounded-lg" />
                </div>
              </div>
              <div>
                <label class="block text-sm mb-1">Driver's License Back</label>
                <input
                  type="file"
                  class="form-field"
                  @change="handleFileUpload($event, 'driverLicenseBack')"
                  accept="image/*"
                />
                <div v-if="newClient.driverLicenseBack" class="mt-2">
                  <img :src="newClient.driverLicenseBack" class="w-32 h-32 object-cover rounded-lg" />
                </div>
              </div>
            </div>
            <div class="flex items-center justify-end gap-2">
              <RouterLink
                :to="{ name: 'clients' }"
                class="button close-button small-button"
              >
                Cancel
              </RouterLink>
              <button
                type="submit"
                class="button primary-button small-button"
              >
                Add Client
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import TopBar from "../components/TopBar.vue";
import { clientStore } from "../store";

export default {
  components: {
    TopBar,
  },
  props: {
    mode: String,
  },
  data() {
    return {
      newClient: {
        firstName: "",
        lastName: "",
        nationalId: "",
        phoneNumber: "",
        nationality: "",
        birthDate: "",
        profession: "",
        licenseNumber: "",
        licenseDate: "",
        address: "",
        idCardFront: "",
        idCardBack: "",
        driverLicenseFront: "",
        driverLicenseBack: ""
      },
      error: null,
      loading: false
    };
  },
  methods: {
    handleFileUpload(event, field) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newClient[field] = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async addClient() {
      this.loading = true;
      this.error = null;
      try {
        await clientStore.addClient(this.newClient);
        this.$router.push({ name: 'clients' });
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
