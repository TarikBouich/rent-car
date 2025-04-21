<template>
  <div>
    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-dark-70 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">Confirm Early Return</h3>
        <p class="mb-4">This car is scheduled to return on {{ formatDate(selectedReservation?.endDate) }}. Do you want to update the return date to today and make it available?</p>
        <div class="flex justify-end gap-4">
          <button 
            @click="showConfirmationModal = false" 
            class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-dark-50 hover:bg-gray-300 dark:hover:bg-dark-60"
          >
            Cancel
          </button>
          <button 
            @click="confirmMakeCarAvailable" 
            class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- Remaining Amount Confirmation Modal -->
    <div v-if="showRemainingAmountModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div class="bg-white dark:bg-dark-70 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">Remaining Amount Due</h3>
        <p class="mb-4">There is a remaining amount of <span class="font-bold text-red-500">{{ selectedReservation ? (selectedReservation.totalPrice - (selectedReservation.advance || 0)) : 0 }} MAD</span> to be paid by client <span class="font-bold">{{ selectedReservation ? getClientName(selectedReservation.clientId) : '' }}</span>.</p>
        <p class="mb-4">Do you want to approve this return and archive the reservation?</p>
        <div class="flex justify-end gap-4">
          <button 
            @click="showRemainingAmountModal = false" 
            class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-dark-50 hover:bg-gray-300 dark:hover:bg-dark-60"
          >
            Cancel
          </button>
          <button 
            @click="confirmRemainingAmount" 
            class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Approve Return
          </button>
        </div>
      </div>
    </div>

    <div class="p-4">
      <div
        class="rounded-xl shadow-card overflow-hidden"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white'"
      >
        <div
          class="px-4 py-2.5 border-b flex items-center justify-between"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <div class="flex items-center gap-4">
          <span class="text-lg font-bold leading-none">Reservations</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-[500px]">
              <div class="relative flex items-center">
                <input
                  type="search"
                  class="form-field pl-10"
                  placeholder="Search for a reservation by client name or car name"
                  v-model="searchQuery"
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
              class="button primary-button small-button whitespace-nowrap"
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
                <th class="py-4">Client</th>
                <th class="py-4">Car</th>
                <th class="py-4">Rental Period</th>
                <th class="py-4">Number of Days</th>
                <th class="py-4">Price/Day</th>
                <th class="py-4">Total Price</th>
                <th class="py-4">Advance</th>
                <th class="py-4">Remaining</th>
                <th class="py-4">Status</th>
                <th class="py-4">Actions</th>
              </tr>
            </thead>
            <tbody
              class="divide-y bg-opacity-40"
              :class="
                mode === 'dark'
                  ? 'bg-dark-70 divide-dark-50'
                  : 'bg-white divide-gray-100'
              "
            >
              <tr v-for="(reservation, index) in filteredReservations" :key="index" class="hover:bg-gray-50 dark:hover:bg-dark-60 transition-colors">
                <td class="p-2">
                  <div class="flex flex-col">
                    <span class="text-lg font-bold text-primary-100">{{ getClientName(reservation.clientId) }}</span>
                    <div class="flex flex-col mt-1 space-y-1">
                      <span class="text-sm text-black dark:text-white">ID: {{ reservation.clientId }}</span>
                      <span class="text-sm text-black dark:text-white">Phone: {{ getClientPhone(reservation.clientId) }}</span>
                      <span class="text-sm text-black dark:text-white">Nationality: {{ getClientDetails(reservation.clientId).nationality }}</span>
                      <span class="text-sm text-black dark:text-white">License: {{ getClientDetails(reservation.clientId).licenseNumber }}</span>
                    </div>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-[100px] h-[100px] mr-4">
                      <img
                        class="w-full h-full rounded-lg object-contain"
                        :src="getCarImage(reservation.carId)"
                        alt="Car Image"
                      />
                    </div>
                    <div class="flex flex-col">
                      <p class="text-lg font-bold text-primary-100 mb-2">
                        {{ reservation.carName }}
                      </p>
                      <div class="flex flex-col gap-1">
                        <div class="flex items-center gap-2 text-black dark:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1zM3 8a1 1 0 00-1.447.894l-2 1A1 1 0 000 10v4a1 1 0 001.447.894l2-1A1 1 0 003 13V8z" />
                          </svg>
                          <p class="text-sm">{{ reservation.carId }}</p>
                        </div>
                        <div class="flex items-center gap-2 text-black dark:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="9" stroke-width="2"/>
                            <path d="M12 8v1" stroke-width="2"/>
                            <path d="M12 15v1" stroke-width="2"/>
                            <path d="M8 12h1" stroke-width="2"/>
                            <path d="M15 12h1" stroke-width="2"/>
                            <path d="M12 12L9 7" stroke-width="2.5" stroke-linecap="round"/>
                            <path d="M12 12l4 1" stroke-width="1.5" stroke-linecap="round"/>
                            <circle cx="12" cy="12" r="1" fill="currentColor"/>
                          </svg>
                          <p class="text-sm">{{ reservation.currentMileage }} km</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                      </svg>
                      <span class="text-sm font-medium text-black dark:text-white">Rented: {{ formatDate(reservation.startDate) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                      </svg>
                  <span
                        class="text-sm font-medium"
                    :class="{
                          'text-red-500': isEndDateToday(reservation.endDate),
                          'text-red-700 bg-red-100 px-2 py-1 rounded': isEndDatePast(reservation.endDate)
                    }"
                  >
                        Return: {{ formatDate(reservation.endDate) }}
                        <span v-if="isEndDatePast(reservation.endDate)" class="ml-2">(Overdue)</span>
                  </span>
                      <a 
                        v-if="isEndDateToday(reservation.endDate) || isEndDatePast(reservation.endDate)"
                        :href="'tel:' + getClientPhone(reservation.clientId)"
                        class="ml-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
                        title="Call Client"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-black dark:text-white">{{ reservation.numberOfDays }} days</span>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-black dark:text-white">{{ reservation.pricePerDay }} MAD</span>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-black dark:text-white">{{ reservation.totalPrice }} MAD</span>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-green-500/50">{{ reservation.advance || 0 }} MAD</span>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-red-500/50">{{ reservation.totalPrice - (reservation.advance || 0) }} MAD</span>
                  </div>
                </td>
                <td class="p-2">
                  <div class="flex items-center gap-2">
                    <span
                      class="px-3 py-1 rounded-full text-sm font-medium"
                      :class="{
                        'bg-success-50 text-success-100': reservation.status === 'Active',
                        'bg-gray-50 text-gray-100': reservation.status === 'Completed'
                      }"
                    >
                      {{ reservation.status }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap flex items-center space-x-2">
                  <ContractPDF
                    :reservation="reservation"
                    :car="getCar(reservation.carId)"
                    :client="getClientDetails(reservation.clientId)"
                  />
                  <button
                    @click="editReservation(reservation, index)"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
                    title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                        />
                      </svg>
                  </button>
                  <button
                    v-if="reservation.status === 'Active'"
                    @click="makeCarAvailable(reservation, index)"
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
                    title="Make Available"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      class="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      >
                        <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                        />
                      </svg>
                  </button>
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
      :class="mode === 'dark' ? 'bg-white' : 'text-body-100'"
      @click.self="showModal = false"
    >
      <div
        class="max-w-2xl rounded-xl w-full mx-auto"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white'"
        @click.stop
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
            <div>
              <label class="block text-sm mb-1">Current Mileage</label>
              <input
                type="number"
                class="form-field"
                v-model="currentCar.currentMileage"
                @change="updateVidangeInfo"
              />
            </div>
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="needsVidange"
                v-model="currentCar.needsVidange"
                class="form-checkbox"
              />
              <label for="needsVidange" class="text-sm">Needs Vidange</label>
            </div>
            <div v-if="currentCar.needsVidange">
              <label class="block text-sm mb-1">Last Vidange Mileage</label>
              <input
                type="number"
                class="form-field"
                v-model="currentCar.lastVidangeKm"
                @change="calculateNextVidange"
              />
              <div v-if="currentCar.nextVidangeKm" class="mt-2 text-sm text-gray-500">
                Next Vidange at: {{ currentCar.nextVidangeKm }} km
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

    <!-- Edit Reservation Modal -->
    <div
      v-if="showEditModal"
      class="bg-opacity-40 fixed inset-0 z-[9999] flex items-center justify-center p-4"
      :class="mode === 'dark' ? 'bg-white' : 'text-body-100'"
      @click.self="showEditModal = false"
    >
      <div
        class="max-w-2xl rounded-xl w-full mx-auto"
        :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white'"
        @click.stop
      >
        <div
          class="flex items-center justify-between px-4 py-3 border-b"
          :class="mode === 'dark' ? 'border-dark-50' : ''"
        >
          <h5 class="font-semibold leading-none">Edit Reservation</h5>
          <svg
            @click="showEditModal = false"
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
          class="flex flex-col max-h-[80vh]"
          :class="mode === 'dark' ? 'bg-dark-70' : 'bg-white'"
        >
          <div class="flex-shrink-0 px-4 py-3 border-b" :class="mode === 'dark' ? 'border-dark-50' : ''">
            <h5 class="font-semibold leading-none">Reservation Details</h5>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <div class="grid gap-4">
              <!-- Client Section -->
              <div>
                <label class="block text-sm mb-1">Client</label>
                <div class="flex items-center gap-4 p-4 rounded-lg border" :class="mode === 'dark' ? 'border-dark-50' : 'border-gray-200'">
                  <div class="flex flex-col">
                    <p class="text-lg font-bold text-primary-100">{{ currentReservation.clientName }}</p>
                    <p class="text-black dark:text-white">ID: {{ currentReservation.clientId }}</p>
                  </div>
                </div>
              </div>

              <!-- Second Driver Section -->
              <div>
                <div class="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="editHasSecondDriver"
                    v-model="currentReservation.hasSecondDriver"
                    class="form-checkbox h-4 w-4 text-primary-100 rounded border-gray-300"
                  />
                  <label for="editHasSecondDriver" class="ml-2 text-[15px] font-medium">
                    Add Second Driver
                  </label>
                </div>

                <div v-if="currentReservation.hasSecondDriver" class="grid gap-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-[15px] mb-1 block font-medium">First Name</label>
                      <input
                        v-model="currentReservation.secondDriver.firstName"
                        type="text"
                        class="form-field"
                        required
                      />
                    </div>
                    <div>
                      <label class="text-[15px] mb-1 block font-medium">Last Name</label>
                      <input
                        v-model="currentReservation.secondDriver.lastName"
                        type="text"
                        class="form-field"
                        required
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-[15px] mb-1 block font-medium">License Number</label>
                      <input
                        v-model="currentReservation.secondDriver.license"
                        type="text"
                        class="form-field"
                        required
                      />
                    </div>
                    <div>
                      <label class="text-[15px] mb-1 block font-medium">License Date</label>
                      <input
                        v-model="currentReservation.secondDriver.licenseDate"
                        type="date"
                        class="form-field"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label class="text-[15px] mb-1 block font-medium">License City</label>
                    <input
                      v-model="currentReservation.secondDriver.licenseCity"
                      type="text"
                      class="form-field"
                      required
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-[15px] mb-1 block font-medium">CIN</label>
                      <input
                        v-model="currentReservation.secondDriver.cin"
                        type="text"
                        class="form-field"
                        required
                      />
                    </div>
                    <div>
                      <label class="text-[15px] mb-1 block font-medium">CIN Delivered At</label>
                      <input
                        v-model="currentReservation.secondDriver.cinDeliveredAt"
                        type="date"
                        class="form-field"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Car Section -->
              <div>
                <label class="block text-sm mb-1">Car</label>
                <div class="flex items-center gap-4 p-4 rounded-lg border" :class="mode === 'dark' ? 'border-dark-50' : 'border-gray-200'">
                  <div class="flex-shrink-0 w-[100px] h-[100px]">
                    <img :src="getCarImage(currentReservation.carId)" :alt="currentReservation.carName" class="w-full h-full rounded-lg object-contain">
                  </div>
                  <div class="flex flex-col">
                    <p class="text-lg font-bold text-primary-100">{{ currentReservation.carName }}</p>
                    <p class="text-black dark:text-white">{{ currentReservation.carId }}</p>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm mb-1">Current Mileage</label>
                <input
                  type="number"
                  class="form-field"
                  v-model="currentReservation.currentMileage"
                  placeholder="Enter current mileage"
                />
              </div>
              <div>
                <label class="block text-sm mb-1">Price per Day</label>
                <input
                  type="number"
                  class="form-field"
                  v-model="currentReservation.pricePerDay"
                  placeholder="Enter price per day"
                />
              </div>
              <div>
                <label class="block text-sm mb-1">Advance Payment</label>
                <input
                  type="number"
                  class="form-field"
                  v-model="currentReservation.advance"
                  placeholder="Enter advance amount"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[15px] mb-1 block font-medium">Start Date</label>
                  <input
                    v-model="currentReservation.startDate"
                    type="date"
                    class="form-field"
                    required
                    @change="calculateEditDays"
                  />
                </div>
                <div>
                  <label class="text-[15px] mb-1 block font-medium">End Date</label>
                  <input
                    v-model="currentReservation.endDate"
                    type="date"
                    class="form-field"
                    required
                    @change="calculateEditDays"
                  />
                </div>
              </div>

              <div v-if="editNumberOfDays > 0" class="text-sm text-gray-500">
                Rental period: {{ editNumberOfDays }} day{{ editNumberOfDays > 1 ? 's' : '' }}
              </div>
            </div>
          </div>
          <div class="flex-shrink-0 p-4 border-t" :class="mode === 'dark' ? 'border-dark-50' : ''">
            <div class="flex items-center justify-end gap-2">
              <button
                type="button"
                class="button close-button small-button"
                @click="showEditModal = false"
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
                @click="saveReservation"
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
    </div>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import ContractPDF from '../components/ContractPDF.vue';

export default {
  name: "ReservationsView",
  components: {
    RouterLink,
    ContractPDF,
  },
  data() {
    return {
      searchQuery: "",
      showModal: false,
      showEditModal: false,
      showConfirmationModal: false,
      showRemainingAmountModal: false,
      currentCarIndex: -1,
      currentReservationIndex: -1,
      currentCar: {
        name: "",
        licensePlate: "",
        pricePerDay: 0,
        status: "Available",
        currentMileage: 0,
        needsVidange: false,
        lastVidangeKm: 0,
        nextVidangeKm: 0
      },
      currentReservation: {
        clientId: "",
        clientName: "",
        carId: "",
        carName: "",
        currentMileage: "",
        pricePerDay: "",
        startDate: "",
        endDate: "",
        hasSecondDriver: false,
        secondDriver: {
          firstName: "",
          lastName: "",
          license: "",
          licenseDate: "",
          licenseCity: "",
          cin: "",
          cinDeliveredAt: "",
        },
      },
      cars: [
        {
          name: 'Toyota Corolla',
          licensePlate: 'ABC-1234',
          pricePerDay: 500,
          status: 'Available',
          currentMileage: 50000,
          needsVidange: false,
          lastVidangeKm: 45000,
          nextVidangeKm: 50000,
          image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
          name: 'Honda Accord',
          licensePlate: 'DEF-5678',
          pricePerDay: 600,
          status: 'Available',
          currentMileage: 35000,
          needsVidange: false,
          lastVidangeKm: 30000,
          nextVidangeKm: 35000,
          image: "https://images.unsplash.com/photo-1551830820-330a71b99659?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
          name: 'Mercedes C-Class',
          licensePlate: 'GHI-9012',
          pricePerDay: 1200,
          status: 'Available',
          currentMileage: 25000,
          needsVidange: false,
          lastVidangeKm: 20000,
          nextVidangeKm: 25000,
          image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        },
        {
          name: 'BMW 3 Series',
          licensePlate: 'JKL-3456',
          pricePerDay: 1100,
          status: 'Available',
          currentMileage: 30000,
          needsVidange: false,
          lastVidangeKm: 25000,
          nextVidangeKm: 30000,
          image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
        }
      ],
      clients: [
        {
          firstName: 'Mohammed',
          lastName: 'Alami',
          nationalId: 'AB123456',
          phoneNumber: '0612345678',
          nationality: 'Moroccan',
          birthDate: '1985-05-15',
          profession: 'Business Owner',
          licenseNumber: 'L123456',
          licenseDate: '2010-06-01',
          address: '123 Avenue Hassan II, Casablanca'
        },
        {
          firstName: 'Fatima',
          lastName: 'Benali',
          nationalId: 'CD789012',
          phoneNumber: '0623456789',
          nationality: 'Moroccan',
          birthDate: '1990-08-20',
          profession: 'Doctor',
          licenseNumber: 'L789012',
          licenseDate: '2015-03-15',
          address: '456 Boulevard Mohammed V, Rabat'
        },
        {
          firstName: 'Ahmed',
          lastName: 'El Fassi',
          nationalId: 'EF345678',
          phoneNumber: '0634567890',
          nationality: 'Moroccan',
          birthDate: '1988-03-10',
          profession: 'Engineer',
          licenseNumber: 'L345678',
          licenseDate: '2012-09-20',
          address: '789 Rue Atlas, Marrakech'
        },
        {
          firstName: 'Amina',
          lastName: 'Bouazza',
          nationalId: 'GH901234',
          phoneNumber: '0645678901',
          nationality: 'Moroccan',
          birthDate: '1992-11-25',
          profession: 'Lawyer',
          licenseNumber: 'L901234',
          licenseDate: '2017-01-10',
          address: '321 Avenue des FAR, Tangier'
        }
      ],
      reservations: [],
      completedReservations: [],
      editNumberOfDays: 0,
      selectedReservationIndex: null,
      selectedReservation: null,
      newReservation: {
        advance: 0,
      },
    };
  },
  computed: {
    mode() {
      return 'light'; // Default to light mode
    },
    filteredReservations() {
      // Only show active reservations where the car is still rented
      const activeReservations = this.reservations.filter(reservation => {
        const car = this.cars.find(c => c.licensePlate === reservation.carId);
        return car && car.status === 'Rented' && reservation.status === 'Active';
      });

      if (!this.searchQuery) return activeReservations;
      
      const query = this.searchQuery.toLowerCase();
      return activeReservations.filter(reservation => {
        const client = this.clients.find(c => c.nationalId === reservation.clientId);
        const clientName = client ? `${client.firstName} ${client.lastName}`.toLowerCase() : '';
        const car = this.cars.find(c => c.licensePlate === reservation.carId);
        const carName = car ? car.name.toLowerCase() : '';
        
        return clientName.includes(query) || carName.includes(query);
      });
    },
    calculateTotalPrice() {
      if (this.newReservation.startDate && this.newReservation.endDate) {
        const start = new Date(this.newReservation.startDate);
        const end = new Date(this.newReservation.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const total = diffDays * this.newReservation.pricePerDay;
        this.newReservation.totalPrice = total;
        this.newReservation.advance = Math.round(total * 0.3); // Calculate 30% advance
        return total;
      }
      return 0;
    },
  },
  methods: {
    loadReservations() {
      try {
        const savedReservations = localStorage.getItem('reservations');
        if (savedReservations) {
          this.reservations = JSON.parse(savedReservations);
        }
      } catch (error) {
        console.error('Error loading reservations:', error);
      }
    },
    loadClients() {
      try {
        const savedClients = localStorage.getItem('clients');
        if (savedClients) {
          this.clients = JSON.parse(savedClients);
        }
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    },
    loadCars() {
      try {
        const savedCars = localStorage.getItem('cars');
        if (savedCars) {
          this.cars = JSON.parse(savedCars);
        }
      } catch (error) {
        console.error('Error loading cars:', error);
      }
    },
    getClientName(clientId) {
      const client = this.clients.find(c => c.nationalId === clientId);
      return client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
    },
    getClientPhone(clientId) {
      const client = this.clients.find(c => c.nationalId === clientId);
      return client ? client.phoneNumber : 'Unknown Phone';
    },
    getCarImage(carId) {
      const car = this.cars.find(c => c.licensePlate === carId);
      return car ? car.image : '';
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
    isEndDateToday(endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      return today.getTime() === end.getTime();
    },
    isEndDatePast(endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      return today.getTime() > end.getTime();
    },
    editReservation(reservation, index) {
      this.currentReservationIndex = index;
      this.currentReservation = {
        ...reservation,
        secondDriver: reservation.secondDriver || {
          firstName: "",
          lastName: "",
          license: "",
          licenseDate: "",
          licenseCity: "",
          cin: "",
          cinDeliveredAt: "",
        }
      };
      this.showEditModal = true;
      this.calculateEditDays();
    },
    makeCarAvailable(reservation, index) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const returnDate = new Date(reservation.endDate);
      returnDate.setHours(0, 0, 0, 0);
      
      // Check for remaining amount
      const remainingAmount = reservation.totalPrice - (reservation.advance || 0);
      
      if (remainingAmount > 0) {
        // Show remaining amount modal
        this.selectedReservationIndex = index;
        this.selectedReservation = reservation;
        this.showRemainingAmountModal = true;
      } else if (returnDate > today) {
        // Show early return confirmation modal
        this.selectedReservationIndex = index;
        this.selectedReservation = reservation;
        this.showConfirmationModal = true;
      } else {
        this.processCarReturn(reservation);
      }
    },
    confirmRemainingAmount() {
      if (this.selectedReservation) {
        // Set advance to total price to clear the remaining amount
        this.selectedReservation.advance = this.selectedReservation.totalPrice;
        this.processCarReturn(this.selectedReservation);
        this.showRemainingAmountModal = false;
        this.selectedReservationIndex = null;
        this.selectedReservation = null;
      }
    },
    confirmMakeCarAvailable() {
      if (this.selectedReservation) {
        this.processCarReturn(this.selectedReservation);
        this.showConfirmationModal = false;
        this.selectedReservationIndex = null;
        this.selectedReservation = null;
      }
    },
    processCarReturn(reservation) {
      const car = this.cars.find(c => c.licensePlate === reservation.carId);
      
      if (car) {
        // Update car status to Available
        car.status = 'Available';
        
        // Update the reservation with today's date and Archived status
        const today = new Date().toISOString().split('T')[0];
        const startDate = new Date(reservation.startDate);
        const endDate = new Date(today);
        const timeDiff = endDate.getTime() - startDate.getTime();
        const numberOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
        
        // Find the highest existing ID and increment it
        const archivedReservations = this.reservations.filter(r => r.status === 'Archived');
        const maxId = archivedReservations.reduce((max, r) => Math.max(max, r.id || 0), 0);
        const nextId = maxId + 1;
        
        const updatedReservations = this.reservations.map(r => {
          if (r.clientId === reservation.clientId && 
              r.carId === reservation.carId &&
              r.startDate === reservation.startDate) {
            return { 
              ...r, 
              status: 'Archived',
              endDate: today,
              numberOfDays: numberOfDays,
              totalPrice: numberOfDays * r.pricePerDay,
              id: nextId,
              updatedAt: new Date().toISOString(),
              archivedAt: new Date().toISOString()
            };
          }
          return r;
        });
        
        // Save changes to localStorage
        this.reservations = updatedReservations;
        localStorage.setItem('cars', JSON.stringify(this.cars));
        localStorage.setItem('reservations', JSON.stringify(updatedReservations));
        
        // Force reload of data
        this.loadCars();
        this.loadReservations();
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('reservation-updated', {
          detail: {
            type: 'car-returned',
            reservation: updatedReservations.find(r => 
              r.clientId === reservation.clientId && 
              r.carId === reservation.carId &&
              r.startDate === reservation.startDate
            )
          }
        }));
        
        // Show success message
        this.$toast.success('Car has been made available and reservation archived successfully');
        
        // Close the confirmation modal
        this.showConfirmationModal = false;
        this.selectedReservationIndex = null;
        this.selectedReservation = null;
      }
    },
    updateVidangeInfo() {
      if (this.currentCar.needsVidange && this.currentCar.lastVidangeKm) {
        this.currentCar.nextVidangeKm = this.currentCar.lastVidangeKm + 5000;
      }
    },
    calculateNextVidange() {
      if (this.currentCar.lastVidangeKm) {
        this.currentCar.nextVidangeKm = this.currentCar.lastVidangeKm + 5000;
      }
    },
    calculateEditDays() {
      if (this.currentReservation.startDate && this.currentReservation.endDate) {
        const start = new Date(this.currentReservation.startDate);
        const end = new Date(this.currentReservation.endDate);
        const diffTime = Math.abs(end - start);
        this.editNumberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      } else {
        this.editNumberOfDays = 0;
      }
    },
    saveReservation() {
      if (this.currentReservationIndex > -1) {
        // Format second driver dates if they exist
        let secondDriverInfo = null;
        if (this.currentReservation.hasSecondDriver) {
          secondDriverInfo = {
            ...this.currentReservation.secondDriver,
            licenseDate: this.formatDate(this.currentReservation.secondDriver.licenseDate),
            cinDeliveredAt: this.formatDate(this.currentReservation.secondDriver.cinDeliveredAt)
          };
        }

        const updatedReservation = {
          ...this.currentReservation,
          numberOfDays: this.editNumberOfDays,
          totalPrice: this.currentReservation.pricePerDay * this.editNumberOfDays,
          hasSecondDriver: this.currentReservation.hasSecondDriver,
          secondDriver: secondDriverInfo,
          advance: this.currentReservation.advance || 0
        };

        // Update the existing reservation
        this.reservations[this.currentReservationIndex] = updatedReservation;
        
        // Save to localStorage
        localStorage.setItem('reservations', JSON.stringify(this.reservations));
        
        // Close the modal
        this.showEditModal = false;
        
        // Reload the reservations to reflect changes
        this.loadReservations();
      }
    },
    updateCar() {
      if (this.currentCarIndex > -1) {
        this.cars[this.currentCarIndex] = { ...this.currentCar };
        localStorage.setItem('cars', JSON.stringify(this.cars));
        this.showModal = false;
      }
    },
    handleReservationUpdate() {
      this.loadReservations();
    },
    getCar(carId) {
      const cars = JSON.parse(localStorage.getItem('cars') || '[]');
      const car = cars.find(car => car.licensePlate === carId);
      console.log('Found car:', car);
      return car || {};
    },
    getClientDetails(clientId) {
      const clients = JSON.parse(localStorage.getItem('clients') || '[]');
      const client = clients.find(client => client.nationalId === clientId);
      console.log('Looking for client with ID:', clientId);
      console.log('Found client:', client);
      
      if (!client) {
        console.warn('Client not found:', clientId);
        return {
          name: '',
          nationality: '',
          birthDate: '',
          profession: '',
          cin: '',
          licenseNumber: '',
          licenseDate: '',
          address: '',
          phone: ''
        };
      }

      return {
        name: `${client.firstName} ${client.lastName}`,
        nationality: client.nationality || '',
        birthDate: this.formatDate(client.birthDate) || '',
        profession: client.profession || '',
        cin: client.nationalId || '',
        licenseNumber: client.licenseNumber || '',
        licenseDate: this.formatDate(client.licenseDate) || '',
        address: client.address || '',
        phone: client.phoneNumber || ''
      };
    },
  },
  created() {
    this.loadReservations();
    this.loadClients();
    this.loadCars();
    // Add event listener for reservation updates
    window.addEventListener('reservation-updated', this.handleReservationUpdate);
  },
  beforeUnmount() {
    // Remove event listener when component is destroyed
    window.removeEventListener('reservation-updated', this.handleReservationUpdate);
  },
  mounted() {
    // Load existing data from localStorage
    this.loadCars();
    this.loadClients();
    this.loadReservations();
  },
  watch: {
    cars: {
      handler(newCars) {
        localStorage.setItem('cars', JSON.stringify(newCars));
      },
      deep: true
    },
    reservations: {
      handler(newReservations) {
        localStorage.setItem('reservations', JSON.stringify(newReservations));
      },
      deep: true
    },
    completedReservations: {
      handler(newCompletedReservations) {
        localStorage.setItem('completedReservations', JSON.stringify(newCompletedReservations));
      },
      deep: true
    },
    clients: {
      handler(newClients) {
        localStorage.setItem('clients', JSON.stringify(newClients));
      },
      deep: true
    }
  }
};
</script>
