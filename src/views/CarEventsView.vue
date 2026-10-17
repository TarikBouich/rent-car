<template>
  <div class="px-0 sm:px-6 py-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
    <div
      class="rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-[#1E2330]"
    >
      <div class="px-0 sm:px-6 py-6 bg-[#F3F4F6] dark:bg-[#151923] min-h-[calc(100vh-4rem)] font-[Inter]">
        <FullCalendar
          ref="calendar"
          :options="calendarOptions"
          class="calendar-container font-sans"
        />
      </div>
    </div>

    <!-- Event Details Popup -->
    <div v-if="showEventPopup" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div class="bg-white dark:bg-[#1E2330] rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl max-w-md w-full mx-4">
        <div class="flex justify-between items-center p-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Event Details</h3>
          <button @click="showEventPopup = false" class="text-gray-600 dark:text-gray-400 hover:text-gray-200 transition-colors">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>
        <div class="px-4 pb-4">
          <div class="space-y-3">
            <div class="flex items-center">
              <span v-html="selectedEvent?.icon" class="mr-2"></span>
              <span class="text-gray-900 dark:text-white font-medium">{{ selectedEvent?.name }}</span>
            </div>
            <div class="text-gray-700 dark:text-gray-300">
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
                {{ selectedEvent?.date }}
              </div>
            </div>
            <div class="text-gray-700 dark:text-gray-300">
              <div class="flex items-center">
                <svg class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                {{ selectedEvent?.type }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useCarStore } from '@/stores/carStore'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  name: 'CarEventsView',
  components: {
    FullCalendar
  },
  props: {
    mode: {
      type: String,
      default: 'light'
    }
  },
  setup(props) {
    const calendar = ref(null)
    const events = ref([])
    const showEventPopup = ref(false)
    const selectedEvent = ref(null)
    const carStore = useCarStore()

    const generateEvents = () => {
      const newEvents = []
      const cars = carStore.filteredCars

      cars.forEach(car => {
        // Add insurance expiration event
        if (car.assuranceEndDate) {
          const icon = `<svg class="inline-block w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25 6 2.25v4.7zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>`
          newEvents.push({
            title: `${icon}${car.name} - Insurance`,
            start: new Date(car.assuranceEndDate).toISOString().split('T')[0],
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgb(239, 68, 68)',
            textColor: '#fff',
            allDay: true,
            classNames: ['event-item'],
            html: true,
            extendedProps: {
              type: 'Insurance',
              icon,
              name: car.name,
              date: new Date(car.assuranceEndDate).toLocaleDateString('fr-FR')
            }
          })
        }

        // Add technical inspection event
        if (car.visiteTechniqueEndDate) {
          const icon = `<svg class="inline-block w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>`
          newEvents.push({
            title: `${icon}${car.name} - Technical Visit`,
            start: new Date(car.visiteTechniqueEndDate).toISOString().split('T')[0],
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            borderColor: 'rgb(249, 115, 22)',
            textColor: '#fff',
            allDay: true,
            classNames: ['event-item'],
            html: true,
            extendedProps: {
              type: 'Technical Visit',
              icon,
              name: car.name,
              date: new Date(car.visiteTechniqueEndDate).toLocaleDateString('fr-FR')
            }
          })
        }

        // Add oil change event based on mileage
        if (car.currentMileage && car.nextVidangeKm && car.currentMileage >= car.nextVidangeKm) {
          const icon = `<svg class="inline-block w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zM6 18l3-3h2l3 3H6z"/></svg>`
          newEvents.push({
            title: `${icon}${car.name} - Oil Change`,
            start: new Date().toISOString().split('T')[0],
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgb(34, 197, 94)',
            textColor: '#fff',
            allDay: true,
            classNames: ['event-item'],
            html: true,
            extendedProps: {
              type: 'Oil Change',
              icon,
              name: car.name,
              date: new Date().toLocaleDateString('fr-FR')
            }
          })
        }
      })

      // Add rental return events
      const reservations = carStore.filteredReservations
      reservations.forEach(reservation => {
        if (reservation.status === 'Active') {
          const icon = `<svg class="inline-block w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>`
          newEvents.push({
            title: `${icon}${reservation.carName} - Return`,
            start: new Date(reservation.endDate).toISOString().split('T')[0],
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgb(59, 130, 246)',
            textColor: '#fff',
            allDay: true,
            classNames: ['event-item'],
            html: true,
            extendedProps: {
              type: 'Return',
              icon,
              name: reservation.carName,
              date: new Date(reservation.endDate).toLocaleDateString('fr-FR')
            }
          })
        }
      })

      events.value = newEvents
      
      // Update the calendar with new events
      if (calendar.value) {
        const calendarApi = calendar.value.getApi()
        calendarApi.removeAllEvents()
        calendarApi.addEventSource(newEvents)
      }
      
      return newEvents
    }

    // Watch for changes in the car store
    watch(
      () => [carStore.filteredCars, carStore.filteredReservations],
      () => {
        generateEvents()
      },
      { deep: true }
    )

    const calendarOptions = computed(() => ({
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'today'
      },
      events: events.value,
      eventClick: (info) => {
        selectedEvent.value = info.event.extendedProps
        showEventPopup.value = true
      },
      height: 'auto',
      aspectRatio: 2,
      editable: false,
      selectable: false,
      dayMaxEvents: 3,
      weekends: true,
      dayHeaderFormat: { weekday: 'short' },
      moreLinkContent: (args) => `+${args.num} more`,
      eventContent: (arg) => {
        return { html: arg.event.title }
      }
    }))

    onMounted(() => {
      // Initialize the car store
      carStore.initializeFromStorage()
      
      // Initial generation of events after a short delay to ensure the calendar is mounted
      nextTick(() => {
        generateEvents()
      })

      // Set up periodic refresh
      const refreshInterval = setInterval(() => {
        generateEvents()
      }, 60000) // Refresh every minute

      // Cleanup on component unmount
      onUnmounted(() => {
        clearInterval(refreshInterval)
      })
    })

    return {
      calendar,
      calendarOptions,
      showEventPopup,
      selectedEvent
    }
  }
}
</script>

<style>
.calendar-container {
  --fc-border-color: theme('colors.gray.800');
  --fc-page-bg-color: transparent;
  --fc-neutral-bg-color: #1C1C1C;
  --fc-neutral-text-color: theme('colors.gray.400');
  --fc-button-bg-color: #1C1C1C;
  --fc-button-border-color: theme('colors.gray.700');
  --fc-button-text-color: theme('colors.gray.300');
  --fc-button-hover-bg-color: theme('colors.gray.800');
  --fc-button-hover-border-color: theme('colors.gray.600');
  --fc-button-active-bg-color: #fa5b0f;
  --fc-button-active-border-color: #fa5b0f;
  --fc-today-bg-color: rgba(250, 91, 15, 0.1);
  --fc-event-text-color: #ffffff;
}

.calendar-container .fc-toolbar-title {
  @apply text-base font-medium text-white;
}

.calendar-container .fc-button {
  @apply text-sm font-medium shadow-none border rounded-md px-3 py-1.5 transition-colors !important;
}

.calendar-container .fc-button-primary {
  @apply bg-white dark:bg-[#1C1C1C] border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:border-gray-600 transition-colors !important;
}

.calendar-container .fc-button-primary:not(:disabled).fc-button-active,
.calendar-container .fc-button-primary:not(:disabled):active {
  @apply bg-[#fa5b0f] text-white border-[#fa5b0f] font-bold !important;
}

.calendar-container .event-item {
  @apply rounded border-l-2 shadow-sm text-sm py-1 px-2 mb-1 truncate !important;
  color: #ffffff !important;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
}

.calendar-container .fc-daygrid-day {
  @apply text-sm bg-white dark:bg-[#1E2330] hover:bg-gray-200 dark:hover:bg-gray-800/30 transition-colors;
}

.calendar-container .fc-theme-standard th, 
.calendar-container .fc-theme-standard td {
  @apply border-gray-200 dark:border-gray-800;
}

.calendar-container .fc-daygrid-day-number {
  @apply p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-white transition-colors;
}

.calendar-container .fc-col-header-cell {
  @apply py-3 text-xs uppercase text-gray-600 dark:text-gray-400 font-medium bg-white dark:bg-[#1C1C1C] border-gray-200 dark:border-gray-800 !important;
}

.calendar-container .fc-col-header-cell-cushion {
  @apply text-gray-600 dark:text-gray-400 font-semibold;
  display: inline-block;
  padding: 8px 4px;
}

.calendar-container .fc-more-link {
  @apply text-xs text-gray-500 dark:text-gray-400 hover:text-white font-medium transition-colors;
}

.calendar-container .fc-daygrid-more-link {
  @apply mx-1 mt-1;
}

.calendar-container .fc-popover {
  @apply rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl bg-white dark:bg-[#1E2330] !important;
  z-index: 50;
}

.calendar-container .fc-popover-header {
  @apply bg-white dark:bg-[#1C1C1C] px-3 py-2 text-sm font-medium text-white border-b border-gray-200 dark:border-gray-800 !important;
}

.calendar-container .fc-popover-body {
  @apply bg-white dark:bg-[#1E2330] text-gray-700 dark:text-gray-300 p-2 !important;
}

.calendar-container .fc-daygrid-event-harness {
  margin-right: 4px !important;
}

.calendar-container .fc-daygrid-day-events {
  padding-right: 4px !important;
}

/* Add styles for the popup animation */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}
</style> 