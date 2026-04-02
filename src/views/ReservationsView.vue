<template>
  <div class="p-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)]">
    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Confirm Early Return</h3>
        <p class="mb-4 text-gray-700 dark:text-gray-300">This car is scheduled to return on {{ formatDate(selectedReservation?.endDate) }}. Do you want to update the return date to today and make it available?</p>
        <div class="flex justify-end gap-4">
          <button 
            @click="showConfirmationModal = false" 
            class="px-4 py-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
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
    <div v-if="showRemainingAmountModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div class="bg-white dark:bg-[#1E2330] border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Remaining Amount Due</h3>
        <p class="mb-4 text-gray-700 dark:text-gray-300">There is a remaining amount of <span class="font-bold text-red-500">{{ selectedReservation ? (selectedReservation.totalPrice - (selectedReservation.advance || 0)) : 0 }} MAD</span> to be paid by client <span class="font-bold text-gray-900 dark:text-white">{{ selectedReservation ? getClientName(selectedReservation.clientId) : '' }}</span>.</p>
        <p class="mb-4 text-gray-700 dark:text-gray-300">Do you want to approve this return and archive the reservation?</p>
        <div class="flex justify-end gap-4">
          <button 
            @click="showRemainingAmountModal = false" 
            class="px-4 py-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
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

    <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <span class="text-lg font-bold text-gray-900 dark:text-white leading-none">Reservations</span>
        <RouterLink
          :to="{ name: 'reservations-add' }"
          class="inline-flex items-center gap-2 px-4 py-2 bg-[#fa5b0f] text-white text-sm font-medium rounded-lg hover:bg-yellow-500 transition-colors shadow-sm"
        >
          Add reservation
        </RouterLink>
      </div>

      <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-[#1E2330]">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
          <select class="px-2 py-1.5 bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#fa5b0f]">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
        </div>

        <div class="relative w-full max-w-xs flex items-center justify-end gap-2">
          <label class="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Rechercher:</label>
          <input
            type="text"
            v-model="searchQuery"
            class="w-full px-3 py-1.5 bg-white dark:bg-transparent border border-gray-200 dark:border-gray-800 rounded-[4px] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#fa5b0f] focus:border-[#fa5b0f]"
          />
        </div>
      </div>
      <div class="w-full overflow-x-auto without-scrollbar">
        <table class="w-full form-table min-w-max">
          <thead class="border-b-2 border-gray-200 dark:border-gray-800">
            <tr class="bg-white dark:bg-[#1C1C1C]">
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap text-left">Client</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap text-left">Car</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap text-left">Rental Period</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap text-left">Number of Days</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap text-left">Price/Day</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap text-left">Total Price</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap text-left">Advance</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap text-left">Remaining</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap text-left">Status</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap text-left">Agent</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap text-left">Agency</th>
              <th class="px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800 bg-white dark:bg-[#1E2330]">
            <tr v-for="(reservation, index) in filteredReservations" :key="index" class="hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors">
              <td class="p-2">
                <div class="flex flex-col">
                  <span class="text-lg font-bold text-[#fa5b0f]">{{ getClientName(reservation.clientId) }}</span>
                  <div class="flex flex-col mt-1 space-y-1">
                    <span class="text-sm text-gray-700 dark:text-gray-300">ID: {{ reservation.clientId }}</span>
                    <span class="text-sm text-gray-700 dark:text-gray-300">Phone: {{ getClientPhone(reservation.clientId) }}</span>
                    <span class="text-sm text-gray-700 dark:text-gray-300">Nationality: {{ getClientDetails(reservation.clientId).nationality }}</span>
                    <span class="text-sm text-gray-700 dark:text-gray-300">License: {{ getClientDetails(reservation.clientId).licenseNumber }}</span>
                  </div>
                </div>
              </td>
              <td class="p-2">
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-[100px] h-[100px] mr-4">
                    <img class="w-full h-full rounded-lg object-contain" :src="getCarImage(reservation.carId)" alt="Car Image" />
                  </div>
                  <div class="flex flex-col">
                    <p class="text-lg font-bold text-[#fa5b0f] mb-2">{{ reservation.carName }}</p>
                    <div class="flex flex-col gap-1">
                      <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1zM3 8a1 1 0 00-1.447.894l-2 1A1 1 0 000 10v4a1 1 0 001.447.894l2-1A1 1 0 003 13V8z" />
                        </svg>
                        <p class="text-sm">{{ reservation.carId }}</p>
                      </div>
                      <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
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
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Rented: {{ formatDate(reservation.startDate) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm font-medium" :class="{'text-red-500': isEndDateToday(reservation.endDate), 'text-red-400 bg-red-900/30 px-2 py-1 rounded': isEndDatePast(reservation.endDate)}">
                      Return: {{ formatDate(reservation.endDate) }}
                      <span v-if="isEndDatePast(reservation.endDate)" class="ml-2">(Overdue)</span>
                    </span>
                    <a 
                      v-if="isEndDateToday(reservation.endDate) || isEndDatePast(reservation.endDate)"
                      :href="'tel:' + getClientPhone(reservation.clientId)"
                      class="ml-2 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
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
                  <span class="text-lg font-bold text-gray-700 dark:text-gray-300">{{ reservation.numberOfDays }} days</span>
                </div>
              </td>
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-gray-700 dark:text-gray-300">{{ reservation.pricePerDay }} MAD</span>
                </div>
              </td>
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-gray-700 dark:text-gray-300">{{ reservation.totalPrice }} MAD</span>
                </div>
              </td>
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-green-500">{{ reservation.advance || 0 }} MAD</span>
                </div>
              </td>
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-red-500">{{ reservation.totalPrice - (reservation.advance || 0) }} MAD</span>
                </div>
              </td>
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded-full text-[11px] font-medium" :class="{'bg-green-900/30 text-green-400 border border-green-800': reservation.status === 'Active', 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700': reservation.status === 'Completed'}">
                    {{ reservation.status }}
                  </span>
                </div>
              </td>
              <td class="p-2">
                <span class="text-gray-700 dark:text-gray-300">{{ getAgentName(reservation.agentId) }}</span>
              </td>
              <td class="p-2">
                <span class="text-gray-700 dark:text-gray-300">{{ getCarAgencyName(reservation.carId) }}</span>
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">
                  <ContractPDF
                    :reservation="reservation"
                    :car="getCar(reservation.carId)"
                    :client="getClientDetails(reservation.clientId)"
                    class="w-7 h-7 flex items-center justify-center rounded-full text-[#3B82F6] hover:bg-blue-900/20 transition-colors"
                  />
                  <button
                    @click="editReservation(reservation, index)"
                    class="w-7 h-7 flex items-center justify-center rounded-full text-[#10B981] hover:bg-emerald-900/20 transition-colors"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    v-if="reservation.status === 'Active'"
                    @click="initiateMakeCarAvailable(reservation, index)"
                    class="w-7 h-7 flex items-center justify-center rounded-full text-[#3B82F6] hover:bg-blue-900/20 transition-colors"
                    title="Make Available"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
                class="form-field dark:bg-transparent bg-white dark:text-white"
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
                class="form-field dark:bg-transparent bg-white dark:text-white"
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
                class="form-field dark:bg-transparent bg-white dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm mb-1">Status</label>
              <div class="flex items-center relative">
                <select
                  class="form-field appearance-none dark:bg-transparent bg-white dark:text-white"
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
                class="form-field dark:bg-transparent bg-white dark:text-white"
                v-model="currentCar.currentMileage"
                @change="updateVidangeInfo"
              />
            </div>
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="needsVidange"
                v-model="currentCar.needsVidange"
                class="form-checkbox dark:bg-transparent bg-white dark:text-white"
              />
              <label for="needsVidange" class="text-sm">Needs Vidange</label>
            </div>
            <div v-if="currentCar.needsVidange">
              <label class="block text-sm mb-1">Last Vidange Mileage</label>
              <input
                type="number"
                class="form-field dark:bg-transparent bg-white dark:text-white"
                v-model="currentCar.lastVidangeKm"
                @change="calculateNextVidange"
              />
              <div v-if="currentCar.nextVidangeKm" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
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
                    class="form-checkbox h-4 w-4 text-primary-100 rounded border-gray-300 dark:bg-transparent bg-white dark:text-white"
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
                        class="form-field dark:bg-transparent bg-white dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label class="text-[15px] mb-1 block font-medium">Last Name</label>
                      <input
                        v-model="currentReservation.secondDriver.lastName"
                        type="text"
                        class="form-field dark:bg-transparent bg-white dark:text-white"
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
                        class="form-field dark:bg-transparent bg-white dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label class="text-[15px] mb-1 block font-medium">License Date</label>
                      <input
                        v-model="currentReservation.secondDriver.licenseDate"
                        type="date"
                        class="form-field dark:bg-transparent bg-white dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label class="text-[15px] mb-1 block font-medium">License City</label>
                    <input
                      v-model="currentReservation.secondDriver.licenseCity"
                      type="text"
                      class="form-field dark:bg-transparent bg-white dark:text-white"
                      required
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-[15px] mb-1 block font-medium">CIN</label>
                      <input
                        v-model="currentReservation.secondDriver.cin"
                        type="text"
                        class="form-field dark:bg-transparent bg-white dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label class="text-[15px] mb-1 block font-medium">CIN Delivered At</label>
                      <input
                        v-model="currentReservation.secondDriver.cinDeliveredAt"
                        type="date"
                        class="form-field dark:bg-transparent bg-white dark:text-white"
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
                  class="form-field dark:bg-transparent bg-white dark:text-white"
                  v-model="currentReservation.currentMileage"
                  placeholder="Enter current mileage"
                />
              </div>
              <div>
                <label class="block text-sm mb-1">Price per Day</label>
                <input
                  type="number"
                  class="form-field dark:bg-transparent bg-white dark:text-white"
                  v-model="currentReservation.pricePerDay"
                  placeholder="Enter price per day"
                />
              </div>
              <div>
                <label class="block text-sm mb-1">Advance Payment</label>
                <input
                  type="number"
                  class="form-field dark:bg-transparent bg-white dark:text-white"
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
                    class="form-field dark:bg-transparent bg-white dark:text-white"
                    required
                    @change="calculateEditDays"
                  />
                </div>
                <div>
                  <label class="text-[15px] mb-1 block font-medium">End Date</label>
                  <input
                    v-model="currentReservation.endDate"
                    type="date"
                    class="form-field dark:bg-transparent bg-white dark:text-white"
                    required
                    @change="calculateEditDays"
                  />
                </div>
              </div>

              <div v-if="editNumberOfDays > 0" class="text-sm text-gray-500 dark:text-gray-400">
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
