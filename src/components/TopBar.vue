<template>
  <div
    class="flex items-center justify-between border-b h-14 px-4 relative custom:sticky top-0 z-[999]"
    :class="[mode === 'dark' ? 'bg-dark-90 border-dark-70' : 'bg-white']"
  >
    <div class="flex items-center gap-4">
      <div
        @click="collapseSidebar"
        class="w-6 h-6 cursor-pointer hidden custom:block"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M3 4.75a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5h-12.5a.75.75 0 0 1-.75-.75Z"
          />
          <path
            fill-rule="evenodd"
            d="M3 10a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5h-12.5a.75.75 0 0 1-.75-.75Z"
          />
          <path
            fill-rule="evenodd"
            d="M3 15.25a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5h-12.5a.75.75 0 0 1-.75-.75Z"
          />
        </svg>
      </div>
      <slot></slot>
    </div>
    <div class="flex items-center gap-x-6 custom:gap-x-4">
      <div class="relative">
        <button
          class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-dark-70"
          @click="toggleNotifications"
        >
          <notificationIcon />
          <span
            v-if="unreadCount > 0"
            class="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full"
          >
            {{ unreadCount }}
          </span>
        </button>
        <div
          v-if="showNotifications"
          ref="notificationMenu"
          class="absolute right-0 w-80 mt-2 bg-white dark:bg-dark-90 rounded-lg shadow-lg z-50"
        >
          <div class="p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Notifications</h3>
              <button
                class="text-sm text-primary-100 hover:text-primary-200"
                @click="markAllAsRead"
              >
                Mark all as read
              </button>
            </div>
            <div class="space-y-2 max-h-[400px] overflow-y-auto">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="flex items-start p-4 border-b border-gray-200 dark:border-gray-700 gap-2.5"
                :class="{ 'bg-red-50 dark:bg-red-900/20': notification.time === 'Today' }"
              >
                <img
                  :src="notification.icon"
                  :alt="notification.type"
                  class="w-8 h-8 rounded-full"
                />
                <div class="flex-1">
                  <p class="text-sm font-medium" v-html="notification.message"></p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ notification.time }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <button
          @click="toggleDropdown"
          class="flex items-center justify-center font-semibold tracking-wider text-base leading-none bg-primary-100 w-[40px] h-[40px] rounded-full text-white"
          type="button"
        >
          {{ getUserInitials }}
        </button>
        <div
          v-if="showDropdown"
          ref="dropdownMenu"
          class="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-dark-70 rounded-lg shadow-lg py-1 z-50"
        >
          <a
            href="#"
            class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-60"
            @click="logout"
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import notificationIcon from "./icons/notification.vue";

export default {
  components: {
    notificationIcon,
  },
  props: {
    mode: String,
  },
  data() {
    return {
      dropdownClass: "hidden",
      isCollapsed: false,
      isDropDownOpen: false,
      showNotifications: false,
      showDropdown: false,
      notifications: [],
      unreadCount: 0,
    };
  },
  mounted() {
    window.addEventListener("isCollapsed", (event) => {
      this.isCollapsed = event.detail.isCollapsed;
    });
    this.checkCarNotifications();
    // Check for notifications every hour
    setInterval(this.checkCarNotifications, 3600000);
    // Add click outside listener
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    // Remove click outside listener
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    checkCarNotifications() {
      const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const cars = JSON.parse(localStorage.getItem('cars') || '[]');
      const clients = JSON.parse(localStorage.getItem('clients') || '[]');
      
      // Get today's date in DD/MM/YYYY format
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const todayFormatted = `${day}/${month}/${year}`;
      
      // Get tomorrow's date
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDay = String(tomorrow.getDate()).padStart(2, '0');
      const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const tomorrowYear = tomorrow.getFullYear();
      const tomorrowFormatted = `${tomorrowDay}/${tomorrowMonth}/${tomorrowYear}`;
      
      this.notifications = [];

      // Check for cars that need to be returned today
      reservations.forEach(reservation => {
        if (reservation.status === 'Active') {
          const reservationDate = new Date(reservation.endDate);
          const resDay = String(reservationDate.getDate()).padStart(2, '0');
          const resMonth = String(reservationDate.getMonth() + 1).padStart(2, '0');
          const resYear = reservationDate.getFullYear();
          const formattedEndDate = `${resDay}/${resMonth}/${resYear}`;

          if (formattedEndDate === todayFormatted) {
            // Find the car details
            const car = cars.find(c => c.name === reservation.carName);
            this.notifications.push({
              id: `return-${reservation.id}`,
              type: 'return',
              message: `${reservation.carName} [${car?.licensePlate || 'N/A'}] needs to be returned today by <br>client: <b>${reservation.clientName}</b> <br>phone: <b>${reservation.clientPhone}</b>`,
              time: 'Today',
              unread: true,
              icon: car?.image || 'https://cdn-icons-png.flaticon.com/128/7867/7867059.png',
              priority: 1 // Higher priority for today's notifications
            });
          }
        }
      });

      // Check for technical inspection due tomorrow or expired
      cars.forEach(car => {
        if (car.visiteTechniqueEndDate) {
          const inspectionDate = new Date(car.visiteTechniqueEndDate);
          const insDay = String(inspectionDate.getDate()).padStart(2, '0');
          const insMonth = String(inspectionDate.getMonth() + 1).padStart(2, '0');
          const insYear = inspectionDate.getFullYear();
          const formattedInspectionDate = `${insDay}/${insMonth}/${insYear}`;
          
          // Check if expired
          if (inspectionDate < today) {
            this.notifications.push({
              id: `inspection-expired-${car.licensePlate}`,
              type: 'inspection',
              message: `⚠️ Visite Technique EXPIRED for ${car.name} (${car.licensePlate}) <br>Expired on: <b>${formattedInspectionDate}</b>`,
              time: 'Today',
              unread: true,
              icon: car.image || 'https://cdn-icons-png.flaticon.com/128/7867/7867059.png',
              priority: 1 // Higher priority for expired items
            });
          }
          // Check if due tomorrow
          else if (formattedInspectionDate === tomorrowFormatted) {
            this.notifications.push({
              id: `inspection-${car.licensePlate}`,
              type: 'inspection',
              message: `Visite Technique due tomorrow for ${car.name} (${car.licensePlate})`,
              time: 'Tomorrow',
              unread: true,
              icon: car.image || 'https://cdn-icons-png.flaticon.com/128/7867/7867059.png',
              priority: 2 // Lower priority for tomorrow's notifications
            });
          }
        }

        // Check for oil change needed based on current mileage
        if (car.currentMileage && car.nextVidangeKm) {
          if (car.currentMileage >= car.nextVidangeKm) {
            this.notifications.push({
              id: `oilchange-${car.licensePlate}`,
              type: 'maintenance',
              message: `Vidange needed for :<br>${car.name} (${car.licensePlate}) <br>- Current: <b>${car.currentMileage}km</b> <br>- Next: <b>${car.nextVidangeKm}km</b>`,
              time: 'Today',
              unread: true,
              icon: car.image || 'https://cdn-icons-png.flaticon.com/128/7867/7867059.png',
              priority: 1 // Higher priority for today's notifications
            });
          }
        }

        // Check for insurance expiration
        if (car.assuranceEndDate) {
          const insuranceDate = new Date(car.assuranceEndDate);
          const insDay = String(insuranceDate.getDate()).padStart(2, '0');
          const insMonth = String(insuranceDate.getMonth() + 1).padStart(2, '0');
          const insYear = insuranceDate.getFullYear();
          const formattedInsuranceDate = `${insDay}/${insMonth}/${insYear}`;
          
          // Check if expired
          if (insuranceDate < today) {
            this.notifications.push({
              id: `insurance-expired-${car.licensePlate}`,
              type: 'insurance',
              message: `⚠️ Insurance EXPIRED for ${car.name} (${car.licensePlate}) <br>Expired on: <b>${formattedInsuranceDate}</b>`,
              time: 'Today',
              unread: true,
              icon: car.image || 'https://cdn-icons-png.flaticon.com/128/7867/7867059.png',
              priority: 1 // Higher priority for expired items
            });
          }
          // Check if due tomorrow
          else if (formattedInsuranceDate === tomorrowFormatted) {
            this.notifications.push({
              id: `insurance-${car.licensePlate}`,
              type: 'insurance',
              message: `Insurance expires tomorrow for ${car.name} (${car.licensePlate})`,
              time: 'Tomorrow',
              unread: true,
              icon: car.image || 'https://cdn-icons-png.flaticon.com/128/7867/7867059.png',
              priority: 2 // Lower priority for tomorrow's notifications
            });
          }
        }
      });

      // Sort notifications by priority (today first, then tomorrow)
      this.notifications.sort((a, b) => a.priority - b.priority);

      console.log('Final notifications:', this.notifications);
    },
    toggleDropDown() {
      this.isDropDownOpen = !this.isDropDownOpen;
      this.showNotifications = false;
    },
    hideDropdown(event) {
      if (this.dropdownClass === "block") {
        this.dropdownClass = "hidden";
      }
    },
    collapseSidebar() {
      this.isCollapsed = !this.isCollapsed;
      window.dispatchEvent(
        new CustomEvent("collapseSidebar", {
          detail: {
            isCollapsed: this.isCollapsed,
          },
        })
      );
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      this.isDropDownOpen = false;
    },
    markAllAsRead() {
      this.notifications.forEach((notification) => {
        notification.unread = false;
      });
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    logout() {
      localStorage.removeItem('user');
      window.location.href = '/';
    },
    handleClickOutside(event) {
      const dropdownMenu = this.$refs.dropdownMenu;
      const notificationMenu = this.$refs.notificationMenu;
      const userButton = event.target.closest('button[type="button"]');
      const notificationButton = event.target.closest('button[class*="hover:bg-gray-100"]');
      
      if (dropdownMenu && !dropdownMenu.contains(event.target) && !userButton) {
        this.showDropdown = false;
      }
      
      if (notificationMenu && !notificationMenu.contains(event.target) && !notificationButton) {
        this.showNotifications = false;
      }
    },
  },
  computed: {
    getUserInitials() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.firstName && user.lastName) {
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
      }
      return 'TB';
    },
    unreadCount() {
      return this.notifications.filter((n) => n.unread).length;
    }
  },
};
</script>
