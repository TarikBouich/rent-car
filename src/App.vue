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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"
                  />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M19 20H5V21C5 21.6 4.6 22 4 22H3C2.4 22 2 21.6 2 21V12L4.3 6.7C4.9 5.7 6 5 7.2 5H16.9C18.1 5 19.2 5.7 19.7 6.7L22 12V21C22 21.6 21.6 22 21 22H20C19.4 22 19 21.6 19 21V20ZM7.5 18C8.9 18 10 16.9 10 15.5C10 14.1 8.9 13 7.5 13C6.1 13 5 14.1 5 15.5C5 16.9 6.1 18 7.5 18ZM16.5 18C17.9 18 19 16.9 19 15.5C19 14.1 17.9 13 16.5 13C15.1 13 14 14.1 14 15.5C14 16.9 15.1 18 16.5 18ZM18 7H6L4 11H20L18 7Z"
                  />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"
                  />
                </svg>
              </span>
              <div
                class="leading-none mt-1"
                :class="isOpen === true ? 'hidden' : ''"
              >
                Clients
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M19 4h-1V3c0-.6-.4-1-1-1s-1 .4-1 1v1H8V3c0-.6-.4-1-1-1s-1 .4-1 1v1H5C3.3 4 2 5.3 2 7v12c0 1.7 1.3 3 3 3h14c1.7 0 3-1.3 3-3V7c0-1.7-1.3-3-3-3zm1 15c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1v-3h16v3zm0-5H4V7c0-.6.4-1 1-1h1v1c0 .6.4 1 1 1s1-.4 1-1V6h8v1c0 .6.4 1 1 1s1-.4 1-1V6h1c.6 0 1 .4 1 1v6z"
                  />
                </svg>
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
import { useRoute } from 'vue-router';

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
  setup() {
    const route = useRoute();
    return { route };
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
