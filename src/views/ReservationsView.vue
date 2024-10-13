<template>
  <div>
    <TopBar :mode="mode" @toggle="$emit('toggle')">
      <div class="flex items-center gap-4">
        <span class="text-[21px] font-bold">Reservations</span>
      </div>
    </TopBar>
    <div class="p-4">
      <div
        class="rounded-xl shadow-card overflow-hidden"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white-100'"
      >
        <div
          class="px-4 py-2.5 border-b flex items-center justify-between xs:flex-col xs:items-start xs:gap-2"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <span class="text-lg font-bold leading-none">Reservations</span>
          <div class="flex items-center gap-2 xs:w-full">
            <div class="w-[500px] xs:w-full xs:flex-1">
              <div class="relative flex items-center">
                <input
                  type="search"
                  class="form-field pl-10"
                  placeholder="Search for a reservation by name"
                />
                <div
                  class="absolute left-0 top-0 bottom-0 flex items-center justify-center w-11 text-gray-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    class="w-5 h-5"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.323 13.383a5.5 5.5 0 1 1 1.06-1.06l2.897 2.897a.75.75 0 1 1-1.06 1.06l-2.897-2.897Zm.677-4.383a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <RouterLink
              :to="{ name: 'reservations-add' }"
              class="button primary-button small-button"
            >
              Add reservation
            </RouterLink>
          </div>
        </div>
        <div class="w-full overflow-x-auto without-scrollbar">
          <table class="w-full form-table">
            <thead
              class="border-b-2"
              :class="mode === 'dark' ? 'border-dark-50' : ''"
            >
              <tr :class="mode === 'dark' ? 'bg-dark-1' : 'bg-gray-1'">
                <th>Voiture</th>
                <th>Prix</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody
              class="divide-y bg-opacity-40"
              :class="
                mode === 'dark'
                  ? 'bg-dark-70 divide-dark-50'
                  : 'bg-white-100 divide-gray-100'
              "
            >
              <tr v-for="(car, index) in cars" :key="index">
                <td>
                  <div class="flex">
                    <div class="flex-shrink-0 w-10 h-10">
                      <img
                        class="w-full h-full rounded-lg"
                        :src="car.image"
                        alt="Car Image"
                      />
                    </div>
                    <div class="ml-3">
                      <p class="font-semibold text-primary-100">
                        {{ car.name }}
                      </p>
                      <p>
                        {{ car.licensePlate }}
                      </p>
                    </div>
                  </div>
                </td>
                <td>{{ car.pricePerDay }} MAD</td>
                <td>
                  <span
                    class="inline-flex px-2 text-[13px] rounded py-1 font-medium"
                    :class="{
                      'text-success-100 bg-success-50':
                        car.status === 'Available',
                      'text-danger-100 bg-danger-50': car.status === 'Rented',
                    }"
                  >
                    {{ car.status }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <div
                      @click="editCar(car, index)"
                      class="w-5 h-5 cursor-pointer hover:text-success-100"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M15.655 4.344a2.695 2.695 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.008.01-5.88 5.88a2.75 2.75 0 0 0-.805 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.539a2.695 2.695 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88-1.689-1.69Zm2.75.629.599-.599a1.195 1.195 0 1 0-1.69-1.689l-.598.599 1.69 1.689Z"
                        />
                      </svg>
                    </div>
                    <div
                      class="w-5 h-5 cursor-pointer hover:text-danger-100"
                      @click="deleteCar(index)"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M11.5 8.25a.75.75 0 0 1 .75.75v4.25a.75.75 0 0 1-1.5 0v-4.25a.75.75 0 0 1 .75-.75Z"
                        />
                        <path
                          d="M9.25 9a.75.75 0 0 0-1.5 0v4.25a.75.75 0 0 0 1.5 0v-4.25Z"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M7.25 5.25a2.75 2.75 0 0 1 5.5 0h3a.75.75 0 0 1 0 1.5h-.75v5.45c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311c-.642.327-1.482.327-3.162.327h-.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311c-.327-.642-.327-1.482-.327-3.162v-5.45h-.75a.75.75 0 0 1 0-1.5h3Zm1.5 0a1.25 1.25 0 1 1 2.5 0h-2.5Zm-2.25 1.5h7v5.45c0 .865-.001 1.423-.036 1.848-.033.408-.09.559-.128.633a1.5 1.5 0 0 1-.655.655c-.074.038-.225.095-.633.128-.425.035-.983.036-1.848.036h-.4c-.865 0-1.423-.001-1.848-.036-.408-.033-.559-.09-.633-.128a1.5 1.5 0 0 1-.656-.655c-.037-.074-.094-.225-.127-.633-.035-.425-.036-.983-.036-1.848v-5.45Z"
                        />
                      </svg>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Edit Car Modal -->
    <div
      v-if="showModal"
      class="bg-opacity-40 fixed inset-0 z-[9999] flex items-center justify-center p-4"
      :class="mode === 'dark' ? 'bg-white-100' : 'text-body-100'"
    >
      <div
        class="max-w-2xl rounded-xl w-full mx-auto"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white-100'"
      >
        <div
          class="flex items-center justify-between px-4 py-3 border-b"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <h5 class="font-semibold leading-none">Edit Car</h5>
          <svg
            @click="showModal = !showModal"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="cursor-pointer w-6 h-6 -mr-1"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M368 368L144 144M368 144L144 368"
            ></path>
          </svg>
        </div>
        <div
          class="without-scrollbar max-h-modal overflow-y-auto p-4 rounded-bl-xl rounded-br-xl"
          :class="mode === 'dark' ? 'bg-dark-70' : 'bg-gray-20 bg-opacity-30'"
        >
          <div class="grid gap-4">
            <div>
              <label for="name" class="block text-sm mb-1">Name</label>
              <input
                type="text"
                class="form-field"
                id="name"
                v-model="currentCar.name"
                placeholder=""
              />
            </div>
            <div>
              <label for="license-plate" class="block text-sm mb-1"
                >Perks</label
              >
              <input
                type="text"
                class="form-field"
                id="license-plate"
                v-model="currentCar.licensePlate"
                placeholder=""
              />
            </div>
            <div>
              <label class="block text-sm mb-1">Price Per Day</label>
              <input
                v-model="currentCar.pricePerDay"
                type="number"
                class="form-field"
              />
            </div>
            <div>
              <label class="block text-sm mb-1">Status</label>
              <div class="flex items-center relative">
                <select
                  class="form-field appearance-none"
                  v-model="currentCar.status"
                >
                  <option value="Available">Available</option>
                  <option value="Rented">Rented</option>
                </select>
                <span class="absolute right-3 pointer-events-none"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="w-4 rotate-90 transform"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="48"
                      d="M184 112l144 144-144 144"
                    ></path></svg
                ></span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex items-center justify-end p-4 border-t space-x-2"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <button
            type="button"
            class="button close-button small-button"
            @click="showModal = !showModal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-5 h-5 -ml-1 mr-1"
              fill="currentColor"
            >
              <path
                d="M9.75 3c-1.243 0-2.25 1.007-2.25 2.25 0 .414.336.75.75.75s.75-.336.75-.75.336-.75.75-.75h3.5c.69 0 1.25.56 1.25 1.25v8.5c0 .69-.56 1.25-1.25 1.25h-3.5c-.414 0-.75-.336-.75-.75s-.336-.75-.75-.75-.75.336-.75.75c0 1.243 1.007 2.25 2.25 2.25h3.5c1.519 0 2.75-1.231 2.75-2.75v-8.5c0-1.519-1.231-2.75-2.75-2.75h-3.5Z"
              />
              <path
                d="M12.25 10.75c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-5.69l.97-.97c.293-.293.293-.767 0-1.06-.293-.293-.767-.293-1.06 0l-2.25 2.25c-.141.14-.22.331-.22.53s.079.39.22.53l2.25 2.25c.293.293.767.293 1.06 0 .293-.293.293-.767 0-1.06l-.97-.97h5.69Z"
              />
            </svg>
            Close
          </button>
          <button
            type="submit"
            class="button primary-button small-button"
            @click="updateCar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-5 h-5 mr-1 -ml-1"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M15.78 5.97a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06l2.72 2.72 5.97-5.97a.75.75 0 0 1 1.06 0Z"
              />
            </svg>
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import TopBar from "../components/TopBar.vue";
export default {
  components: {
    TopBar,
  },
  props: {
    mode: String,
  },
  data() {
    return {
      cars: [
        {
          name: "Toyota Corolla",
          licensePlate: "ABC-1234",
          pricePerDay: 500,
          status: "Available",
          image: "https://via.placeholder.com/80",
        },
        {
          name: "Honda Accord",
          licensePlate: "DEF-5678",
          pricePerDay: 500,
          status: "Rented",
          image: "https://via.placeholder.com/80",
        },
        {
          name: "Ford Mustang",
          licensePlate: "GHI-9101",
          pricePerDay: 600,
          status: "Available",
          image: "https://via.placeholder.com/80",
        },
        {
          name: "Tesla Model 3",
          licensePlate: "JKL-2345",
          pricePerDay: 1000,
          status: "Rented",
          image: "https://via.placeholder.com/80",
        },
      ],
      showModal: false,
      currentCar: {
        name: "",
        licensePlate: "",
        pricePerDay: 0,
        status: "Available",
      },
      currentCarIndex: -1,
    };
  },
  methods: {
    editCar(car, index) {
      this.currentCar = { ...car }; // Copy the car data to the currentCar
      this.currentCarIndex = index;
      this.showModal = true;
    },
    updateCar() {
      if (this.currentCarIndex > -1) {
        this.cars[this.currentCarIndex] = { ...this.currentCar };
        this.showModal = false; // Close modal after saving
      }
    },
    deleteCar(index) {
      this.cars.splice(index, 1); // Remove the car from the array
    },
  },
};
</script>
