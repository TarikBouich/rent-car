<template>
  <div
    class="flex items-center justify-between border-b h-14 px-4 relative custom:sticky top-0 z-[999]"
    :class="[mode === 'dark' ? 'bg-dark-90 border-dark-70' : 'bg-white-100']"
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
      <!-- <Notifications v-if="tooltipText" :mode="mode" /> -->
      <div class="relative" v-click-outside="hideDropdown">
        <button
          class="flex items-center justify-center font-semibold tracking-wider text-base leading-none bg-primary-100 w-[40px] h-[40px] rounded-full text-white-100"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          @click="toggleDropDown"
        >
          TB
        </button>
        <div
          class="absolute top-full mt-1 right-0 rounded-md min-w-60 border"
          :class="[
            dropdownClass,
            mode === 'dark' ? 'bg-dark-90 border-dark-70' : 'bg-white-100',
          ]"
          aria-labelledby="dropdownMenuButton"
        >
          <div class="py-2">
            <RouterLink :to="{ name: 'dashboard' }" v-slot="{ navigate }">
              <a
                class="flex items-center gap-2 p-2 font-semibold bg-opacity-5"
                :class="[
                  mode === 'dark'
                    ? 'text-dark-15 hover:text-white-100 hover:bg-dark-70'
                    : 'hover:bg-primary-100 text-gray-600 hover:text-body-100 hover:bg-opacity-5',
                ]"
                @click="navigate"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7 8.25a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M15.168 15.435a7.5 7.5 0 1 1-10.336-10.87 7.5 7.5 0 0 1 10.336 10.87Zm-9.83-1.659a6 6 0 1 1 9.326 0 7.03 7.03 0 0 0-4.664-1.776 7.03 7.03 0 0 0-4.663 1.776Zm1.086 1.043a5.973 5.973 0 0 0 3.576 1.181c1.34 0 2.577-.44 3.576-1.181a5.53 5.53 0 0 0-3.576-1.319 5.53 5.53 0 0 0-3.576 1.319Z"
                  />
                </svg>
                Account
              </a>
            </RouterLink>
            <RouterLink
              v-if="isTeamTier"
              :to="{ name: 'team-members' }"
              v-slot="{ navigate }"
            >
              <a
                class="flex items-center gap-2 p-2 bg-opacity-5 font-semibold"
                @click="navigate"
                :class="[
                  mode === 'dark'
                    ? 'text-dark-15 hover:text-white-100 hover:bg-dark-70'
                    : 'hover:bg-primary-100 text-gray-600 hover:text-body-100 hover:bg-opacity-5',
                ]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  class="w-6 h-6"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 4a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-.75 2.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M10 7a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-.75 2.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M11.75 6.25a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Zm2.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
                  />
                  <path
                    d="M14 9a.75.75 0 0 0 0 1.5h.75c.69 0 1.25.56 1.25 1.25v1.5a.75.75 0 0 0 1.5 0v-1.5a2.75 2.75 0 0 0-2.75-2.75h-.75Z"
                  />
                  <path
                    d="M6.75 9.75a.75.75 0 0 0-.75-.75h-.75a2.75 2.75 0 0 0-2.75 2.75v1.5a.75.75 0 0 0 1.5 0v-1.5c0-.69.56-1.25 1.25-1.25h.75a.75.75 0 0 0 .75-.75Z"
                  />
                  <path
                    d="M10.75 12a2.75 2.75 0 0 1 2.75 2.75v1a.75.75 0 0 1-1.5 0v-1c0-.69-.56-1.25-1.25-1.25h-1.5c-.69 0-1.25.56-1.25 1.25v1a.75.75 0 0 1-1.5 0v-1a2.75 2.75 0 0 1 2.75-2.75h1.5Z"
                  />
                </svg>
                Team
              </a>
            </RouterLink>
            <RouterLink :to="{ name: 'dashboard' }" v-slot="{ navigate }">
              <a
                class="flex items-center gap-2 p-2 bg-opacity-5 font-semibold"
                @click="navigate"
                :class="[
                  mode === 'dark'
                    ? 'text-dark-15 hover:text-white-100 hover:bg-dark-70'
                    : 'hover:bg-primary-100 text-gray-600 hover:text-body-100 hover:bg-opacity-5',
                ]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  class="w-6 h-6"
                  fill="currentColor"
                >
                  <path
                    d="M6.25 11.25a.75.75 0 0 0 0 1.5h2.75a.75.75 0 0 0 0-1.5h-2.75Z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M2.5 7.25a2.75 2.75 0 0 1 2.75-2.75h9.5a2.75 2.75 0 0 1 2.75 2.75v5.5a2.75 2.75 0 0 1-2.75 2.75h-9.5a2.75 2.75 0 0 1-2.75-2.75v-5.5Zm12.25-1.25c.69 0 1.25.56 1.25 1.25h-12c0-.69.56-1.25 1.25-1.25h9.5Zm1.25 3.25h-12v3.5c0 .69.56 1.25 1.25 1.25h9.5c.69 0 1.25-.56 1.25-1.25v-3.5Z"
                  />
                </svg>
                Subscription
              </a>
            </RouterLink>
            <a
              class="flex items-center gap-2 p-2 bg-opacity-5 font-semibold"
              :class="[
                mode === 'dark'
                  ? 'text-dark-15 hover:text-white-100 hover:bg-dark-70'
                  : 'hover:bg-primary-100 text-gray-600 hover:text-body-100 hover:bg-opacity-5',
              ]"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                class="w-6 h-6"
                fill="currentColor"
              >
                <path
                  d="M9.75 3a2.25 2.25 0 0 0-2.25 2.25.75.75 0 0 0 1.5 0 .75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75h-4a.75.75 0 0 1-.75-.75.75.75 0 0 0-1.5 0 2.25 2.25 0 0 0 2.25 2.25h4a2.25 2.25 0 0 0 2.25-2.25v-9.5a2.25 2.25 0 0 0-2.25-2.25h-4Z"
                />
                <path
                  d="M12.25 10.75a.75.75 0 0 0 0-1.5h-5.69l.97-.97a.75.75 0 0 0-1.06-1.06l-2.25 2.25a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 0 0 1.06-1.06l-.97-.97h5.69Z"
                />
              </svg>
              Log out
            </a>
            <div
              class="flex items-center gap-2 p-2 bg-opacity-5 font-semibold"
              :class="[
                mode === 'dark'
                  ? 'text-dark-15 hover:text-white-100 hover:bg-dark-70'
                  : 'hover:bg-primary-100 text-gray-600 hover:text-body-100 hover:bg-opacity-5',
              ]"
            >
              <div class="switcher">
                <input
                  id="toggle-dark-mode"
                  type="checkbox"
                  @change="$emit('toggle')"
                  :checked="mode === 'dark' ? 'checked' : false"
                />
                <label for="toggle-dark-mode"> Dark mode </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Notifications from "./Notifications.vue";
export default {
  components: {
    // Notifications,
  },
  props: {
    mode: String,
  },
  data() {
    return {
      dropdownClass: "hidden",
      isCollapsed: false,
    };
  },
  mounted() {
    window.addEventListener("isCollapsed", (event) => {
      this.isCollapsed = event.detail.isCollapsed;
    });
  },
  methods: {
    toggleDropDown() {
      this.dropdownClass = this.dropdownClass === "block" ? "hidden" : "block";
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
  },
};
</script>
