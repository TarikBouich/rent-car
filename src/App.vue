<template>
  <div
    class="min-h-screen"
    :class="
      mode === 'dark'
        ? 'bg-dark-80 opacity-100 is-dark text-white-100'
        : 'bg-gray-20 bg-opacity-20 text-body-100'
    "
  >
    <div
      ref="sidebar"
      class="fixed top-0 left-0 z-[998] h-full px-2 duration-300 transition-all origin-left transform border-r without-scrollbar"
      :class="[
        isOpen === true
          ? 'w-70 overflow-visible'
          : ' w-60 overflow-x-hidden overflow-y-auto',
        mode === 'dark' ? 'bg-dark-90 border-dark-70' : 'bg-white-100',
        isCollapsed ? '-left-full' : 'left-0',
      ]"
    >
      <div
        class="sidebar-links font-semibold py-2 flex flex-col justify-between h-full"
        :class="[mode === 'dark' ? 'text-white-100' : 'text-gray-600']"
      >
        <div class="grid" :class="[isOpen ? 'gap-3' : 'gap-3']">
          <RouterLink
            :to="{ name: 'dashboard' }"
            v-slot="{ navigate, isActive, isExactActive }"
            :title="isOpen ? 'Dashboard' : ''"
            @click="redirect"
          >
            <div
              class="flex items-center p-2 relative rounded-md bg-opacity-5 gap-2 group"
              :class="[
                (isActive || isExactActive) && 'active',
                isOpen && 'is-open',
                mode === 'dark'
                  ? 'text-white-100 hover:bg-dark-70'
                  : 'hover:bg-primary-100 hover:text-body-100 hover:bg-opacity-5',
              ]"
              role="link"
              @click="navigate"
            >
              <span class="flex-shrink-0 w-6 h-6">
                <DashboardDots />
              </span>
              <div
                class="leading-none mt-1"
                :class="isOpen === true ? 'hidden' : ''"
              >
                Dashboard
              </div>
            </div>
          </RouterLink>
          <RouterLink
            :to="{ name: 'cars' }"
            v-slot="{ navigate, isActive, isExactActive }"
            :title="isOpen ? 'Cars' : ''"
            @click="redirect"
          >
            <div
              class="flex items-center p-2 relative rounded-md bg-opacity-5 gap-2 group"
              :class="[
                (isActive || isExactActive) && 'active',
                isOpen && 'is-open',
                mode === 'dark'
                  ? 'text-white-100 hover:bg-dark-70'
                  : 'hover:bg-primary-100 hover:text-body-100 hover:bg-opacity-5',
              ]"
              role="link"
              @click="navigate"
            >
              <span class="flex-shrink-0 w-6 h-6">
                <Car />
              </span>
              <div
                class="leading-none mt-1"
                :class="isOpen === true ? 'hidden' : ''"
              >
                Cars
              </div>
            </div>
          </RouterLink>
          <RouterLink
            :to="{ name: 'reservations' }"
            v-slot="{ navigate, isActive, isExactActive }"
            :title="isOpen ? 'Reservations' : ''"
            @click="redirect"
          >
            <div
              class="flex items-center p-2 relative rounded-md bg-opacity-5 gap-2 group"
              :class="[
                (isActive || isExactActive) && 'active',
                isOpen && 'is-open',
                mode === 'dark'
                  ? 'text-white-100 hover:bg-dark-70'
                  : 'hover:bg-primary-100 hover:text-body-100 hover:bg-opacity-5',
              ]"
              role="link"
              @click="navigate"
            >
              <span class="flex-shrink-0 w-6 h-6">
                <Calendar />
              </span>
              <div
                class="leading-none mt-1"
                :class="isOpen === true ? 'hidden' : ''"
              >
                Reservations
              </div>
            </div>
          </RouterLink>
          <RouterLink
            :to="{ name: 'clients' }"
            v-slot="{ navigate, isActive, isExactActive }"
            :title="isOpen ? 'Clients' : ''"
            @click="redirect"
          >
            <div
              class="flex items-center p-2 relative rounded-md bg-opacity-5 gap-2 group"
              :class="[
                (isActive || isExactActive) && 'active',
                isOpen && 'is-open',
                mode === 'dark'
                  ? 'text-white-100 hover:bg-dark-70'
                  : 'hover:bg-primary-100 hover:text-body-100 hover:bg-opacity-5',
              ]"
              role="link"
              @click="navigate"
            >
              <span class="flex-shrink-0 w-6 h-6">
                <Group />
              </span>
              <div
                class="leading-none mt-1"
                :class="isOpen === true ? 'hidden' : ''"
              >
                Archived Clients
              </div>
            </div>
          </RouterLink>
          <!-- <RouterLink
              :to="{ name: 'active-rentals' }"
              v-slot="{ navigate, isActive, isExactActive }"
              :title="isOpen ? 'Active Rentals' : ''"
              @click="redirect"
            >
            <div
              class="flex items-center p-2 relative rounded-md bg-opacity-5 gap-2 group"
              :class="[
                (isActive || isExactActive) && 'active',
                isOpen && 'is-open',
                mode === 'dark'
                  ? 'text-white-100 hover:bg-dark-70'
                  : 'hover:bg-primary-100 hover:text-body-100 hover:bg-opacity-5',
              ]"
              role="link"
              @click="navigate"
            >
              <span class="flex-shrink-0 icon-container">
                <img 
                  src="https://cdn-icons-png.flaticon.com/128/7867/7867059.png" 
                  alt="Active Rentals" 
                  class="sidebar-icon"
                />
              </span>
              <div
                class="leading-none mt-1"
                :class="isOpen === true ? 'hidden' : ''"
              >
                Active Rentals
              </div>
            </div>
          </RouterLink> -->
          <RouterLink
            :to="{ name: 'archived-reservations' }"
            v-slot="{ navigate, isActive, isExactActive }"
            :title="isOpen ? 'Archived Reservations' : ''"
            @click="redirect"
          >
            <div
              class="flex items-center p-2 relative rounded-md bg-opacity-5 gap-2 group"
              :class="[
                (isActive || isExactActive) && 'active',
                isOpen && 'is-open',
                mode === 'dark'
                  ? 'text-white-100 hover:bg-dark-70'
                  : 'hover:bg-primary-100 hover:text-body-100 hover:bg-opacity-5',
              ]"
              role="link"
              @click="navigate"
            >
              <span class="flex-shrink-0 icon-container">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/9746/9746150.png" 
                  alt="Archived Reservations" 
                  class="sidebar-icon"
                />
              </span>
              <div
                class="leading-none mt-1"
                :class="isOpen === true ? 'hidden' : ''"
              >
                Archived Reservations
              </div>
            </div>
          </RouterLink>
        </div>
        <div
          class="flex items-center justify-center p-2 rounded-md gap-2 cursor-pointer"
          @click="toggleOpen"
          :title="isOpen ? 'Collapse' : ''"
          :class="[
            mode === 'dark'
              ? 'text-white-100 bg-dark-70'
              : 'bg-primary-100 hover:text-body-100 bg-opacity-5',
          ]"
        >
          <span class="w-6 h-6">
            <svg
              v-if="isOpen"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M12.75 3.5a.75.75 0 0 0 0 1.5h1.19l-3.22 3.22a.75.75 0 0 0 1.06 1.06l3.22-3.22v1.19a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-.75-.75h-3Z"
              />
              <path
                d="M7.25 16.5a.75.75 0 0 0 0-1.5h-1.19l3.22-3.22a.75.75 0 1 0-1.06-1.06l-3.22 3.22v-1.19a.75.75 0 0 0-1.5 0v3c0 .414.336.75.75.75h3Z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M13.75 9.5a.75.75 0 0 0 0-1.5h-.69l3.22-3.22a.75.75 0 0 0-1.06-1.06l-3.22 3.22v-.69a.75.75 0 0 0-1.5 0v2.5c0 .414.336.75.75.75h2.5Z"
              />
              <path
                d="M6.25 10.5a.75.75 0 0 0 0 1.5h.69l-3.22 3.22a.75.75 0 1 0 1.06 1.06l3.22-3.22v.69a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 0-.75-.75h-2.5Z"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
    <div
      class="transition flex-1"
      :class="[isOpen === true ? 'ml-70' : 'ml-60']"
    >
      <TopBar :mode="mode" @toggle="toggleMode" />
      <RouterView :mode="mode" @toggle="toggle" :key="$route.path" />
    </div>
  </div>
</template>
<script>
import steeringIcon from "./components/icons/steering.vue";
import userIcon from "./components/icons/user.vue";
import notificationIcon from "./components/icons/notification.vue";
import TopBar from "./components/TopBar.vue";
import { Car, DashboardDots, Calendar, Group } from "@iconoir/vue";
import { initializeDefaultData } from './utils/initializeData';

export default {
  name: 'App',
  components: {
    steeringIcon,
    userIcon,
    notificationIcon,
    TopBar,
    Car,
    DashboardDots,
    Calendar,
    Group,
  },
  data() {
    return {
      mode: localStorage.getItem("mode") || "light",
      isOpen: false,
      isCollapsed: false,
    };
  },
  created() {
    // Initialize default data if needed
    initializeDefaultData();
  },
  methods: {
    toggleOpen() {
      if (this.isOpen == false) {
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }
    },
    toggle() {
      if (this.mode === "dark") {
        this.mode = "light";
      } else {
        this.mode = "dark";
      }
      localStorage.setItem("mode", this.mode);
    },
    redirect() {
      this.isCollapsed = false;
      window.dispatchEvent(
        new CustomEvent("isCollapsed", {
          detail: {
            isCollapsed: this.isCollapsed,
          },
        })
      );
    },
  },
};
</script>
<style scoped>
.icon-container {
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-icon {
  width: 25px;
  height: 25px;
  object-fit: contain;
}
</style>
