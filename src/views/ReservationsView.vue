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
                <th class="py-4">Agent</th>
                <th class="py-4">Agency</th>
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
                <td class="p-2">
                  <span class="text-black dark:text-white">{{ getAgentName(reservation.agentId) }}</span>
                </td>
                <td class="p-2">
                  <span class="text-black dark:text-white">{{ getCarAgencyName(reservation.carId) }}</span>
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
                    @click="initiateMakeCarAvailable(reservation, index)"
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
import { useRouter } from 'vue-router'
import { useCarStore } from '../stores/carStore'
import { useClientStore } from '../stores/clientStore'
import { useUserStore } from '../stores/userStore';
import { useAgencyStore } from '../stores/agencyStore';
import { generateNextId, sortByIdDesc } from '../utils/idGenerator'; // Assuming sortByIdDesc is still needed
import ContractPDF from "../components/ContractPDF.vue"; // Assuming this component is used

export default {
  name: "ReservationsView",
  components: {
    RouterLink,
    ContractPDF, // Register the component
  },
  props: {
    mode: String,
  },
  setup() {
    const router = useRouter();
    const carStore = useCarStore();
    const clientStore = useClientStore();
    const userStore = useUserStore();
    const agencyStore = useAgencyStore();
    return { router, carStore, clientStore, userStore, agencyStore }; // Expose stores and router
  },
  data() {
    return {
      searchQuery: "",
      showModal: false,
      showEditModal: false,
      showConfirmationModal: false,
      showRemainingAmountModal: false,
      currentReservationIndex: -1,
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
        advance: 0, // Initialize advance here
      },
      editNumberOfDays: 0,
      selectedReservationIndex: null,
      selectedReservation: null,
      newReservation: { // This might be redundant if using currentReservation for editing/adding
        advance: 0,
      },
    };
  },
  computed: {
    mode() {
      return this.mode; // Use prop mode
    },
    filteredReservations() {
      // Use the filteredReservations getter from the car store
      const allReservations = this.carStore.filteredReservations;

      // Only show active reservations where the car status is not 'Completed' or 'Archived'
      const activeReservations = allReservations.filter(reservation => {
         // Find the car using carStore.cars (full list)
        const car = this.carStore.cars.find(c => c.licensePlate === reservation.carId);
        // Check if the car exists and its status is not Completed or Archived, and reservation is Active
        return car && car.status !== 'Completed' && car.status !== 'Archived' && reservation.status === 'Active';
      });

      if (!this.searchQuery) return sortByIdDesc(activeReservations);
      
      const query = this.searchQuery.toLowerCase();
      return sortByIdDesc(activeReservations.filter(reservation => {
        // Find the client using clientStore.clients (full list)
        const client = this.clientStore.clients.find(c => c.nationalId === reservation.clientId);
        const clientName = client ? `${client.firstName} ${client.lastName}`.toLowerCase() : '';
        // Find the car using carStore.cars (full list)
        const car = this.carStore.cars.find(c => c.licensePlate === reservation.carId);
        const carName = car ? car.name.toLowerCase() : '';
        
        return clientName.includes(query) || carName.includes(query);
      }));
    },
    calculateTotalPrice() {
      if (this.currentReservation.startDate && this.currentReservation.endDate && this.currentReservation.pricePerDay > 0) {
        const start = new Date(this.currentReservation.startDate);
        const end = new Date(this.currentReservation.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include end date
        const total = diffDays * this.currentReservation.pricePerDay;
        // We might not need to store totalPrice and advance in newReservation if using currentReservation
        // this.newReservation.totalPrice = total;
        // this.newReservation.advance = Math.round(total * 0.3); // Calculate 30% advance
        return total;
      }
      return 0;
    },
    // Add computed property for clients if needed for dropdowns/lookups
    allClients() {
      return this.clientStore.clients; // Use the full client list for lookups
    },
     // Add computed property for cars if needed for dropdowns/lookups
    allCars() {
      return this.carStore.cars; // Use the full car list for lookups
    }
  },
  mounted() {
    // Initialize stores from localStorage
    this.clientStore.initializeFromStorage();
    this.carStore.initializeFromStorage();
    this.agencyStore.initializeFromStorage();
    this.userStore.initializeFromStorage();
    // No need to load reservations/clients manually here if using store
  },
  methods: {
     // Helper to get client name
    getClientName(clientId) {
      const client = this.clientStore.clients.find(c => c.nationalId === clientId);
      return client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
    },
    // Helper to get client phone
    getClientPhone(clientId) {
       const client = this.clientStore.clients.find(c => c.nationalId === clientId);
       return client ? client.phoneNumber : 'N/A';
    },
    // Helper to get full client details
    getClientDetails(clientId) {
       return this.clientStore.clients.find(c => c.nationalId === clientId) || {};
    },
    // Helper to get car image
    getCarImage(carId) {
      const car = this.carStore.cars.find(c => c.licensePlate === carId);
      return car ? car.image : '';
    },
    // Helper to get car object
    getCar(carId) {
      return this.carStore.cars.find(c => c.licensePlate === carId);
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
     isEndDateToday(endDate) {
      const today = new Date();
      const end = new Date(endDate);
      return today.toDateString() === end.toDateString();
    },
    isEndDatePast(endDate) {
      const today = new Date();
      const end = new Date(endDate);
      // Set both dates to midnight to compare just the date part
      today.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return end < today;
    },
     editReservation(reservation) {
      this.currentReservation = { ...reservation };
      this.showEditModal = true;
       // Calculate initial number of days for editing
       this.calculateEditDays();
    },
     closeEditModal() {
      this.showEditModal = false;
      // Reset currentReservation
      this.currentReservation = {
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
        advance: 0,
      };
       this.editNumberOfDays = 0;
    },
     calculateEditDays() {
       if (this.currentReservation.startDate && this.currentReservation.endDate) {
        const start = new Date(this.currentReservation.startDate);
        const end = new Date(this.currentReservation.endDate);
        const diffTime = Math.abs(end - start);
        this.editNumberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include end date
      } else {
        this.editNumberOfDays = 0;
      }
    },
    saveEditedReservation() {
      // Find the index of the reservation in the store's reservations array
      const index = this.carStore.reservations.findIndex(res => res.id === this.currentReservation.id);
      if (index !== -1) {
        // Update the reservation in the store
        this.carStore.updateReservation(index, this.currentReservation);
        this.closeEditModal();
      }
    },
     initiateMakeCarAvailable(reservation) {
      this.selectedReservation = reservation;
      this.showConfirmationModal = true;
    },
     confirmMakeCarAvailable() {
      if (this.selectedReservation) {
        // Update reservation status to Completed
        // Update car status to Available
        // Find reservation and car in stores
        const reservationIndex = this.carStore.reservations.findIndex(res => res.id === this.selectedReservation.id);
        if (reservationIndex !== -1) {
           // Check if remaining amount is due before archiving
           const remaining = this.selectedReservation.totalPrice - (this.selectedReservation.advance || 0);
           if (remaining > 0) {
             this.showConfirmationModal = false; // Close the current modal
             this.showRemainingAmountModal = true; // Show remaining amount modal
             return; // Stop here and wait for the next confirmation
           } else {
              // If no remaining amount, proceed to archive and make car available
              this.archiveReservation(this.selectedReservation);
           }
        }
      }
       this.showConfirmationModal = false;
    },
     confirmRemainingAmount() {
       if (this.selectedReservation) {
         this.archiveReservation(this.selectedReservation);
       }
       this.showRemainingAmountModal = false;
     },
     archiveReservation(reservationToArchive) {
       // Use the action from the car store to move the reservation to completed
       this.carStore.completeReservation(reservationToArchive.id);
       
       // Find the car and update its status to 'Available'
       const car = this.carStore.cars.find(c => c.licensePlate === reservationToArchive.carId);
       if (car) {
         // Create a new car object with updated status
         const updatedCar = {
           ...car,
           status: 'Available'
         };
         this.carStore.updateCar(updatedCar);
       }
     },
     deleteReservation(reservation) {
      if (confirm('Are you sure you want to delete this reservation?')) {
        try {
          // Use the action from the car store to delete the reservation
          this.carStore.deleteReservation(reservation.id);
           // Optional: If you want to change car status back to available on delete, add that logic here
           const car = this.carStore.cars.find(c => c.licensePlate === reservation.carId);
           if(car && car.status === 'Rented') { // Only change status if it was rented
             this.carStore.updateCar(car.id, { status: 'Available' });
           }
        } catch (error) {
          console.error('Error deleting reservation:', error);
          // Optionally show an error message to the user
        }
      }
    },
    getCarAgencyName(carId) {
      const car = this.carStore.cars.find(c => c.licensePlate === carId);
      if (!car || !car.agencyId) return 'Unknown Agency';

      const agency = this.agencyStore.agencies.find(a => a.id === car.agencyId);
      return agency ? agency.name : 'Unknown Agency';
    },
    getAgentName(agentId) {
      const agent = this.userStore.users.find(user => user.id === agentId);
      return agent ? agent.name : 'N/A';
    },
  }
}
</script>
