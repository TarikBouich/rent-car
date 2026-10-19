<template>
  <aside 
    class="w-[260px] h-screen bg-white dark:bg-[#1e2330] flex flex-col fixed left-0 top-0 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >

    <!-- Logo -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-800/50 flex items-center justify-between gap-3 h-[64px]">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-[#fa5b0f] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.8a1 1 0 0 0-.8.4L2.3 11l-5.16.86A1 1 0 0 0 .84 12.99V16h3" />
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white tracking-wide">RentCar</h1>
        </div>
      </div>
      <!-- Close Button Mobile -->
      <button @click="$emit('close')" class="md:hidden p-1 text-gray-500 hover:text-gray-800 dark:hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-6 overflow-y-auto w-full">
      <div v-for="(group, gIndex) in menuGroups" :key="gIndex" class="mb-6" v-show="group.items.some(i => hasPermission(i.name))">
        <!-- Group Title -->
        <h3 v-if="group.title" class="px-6 mb-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          {{ group.title }}
        </h3>
        <ul class="space-y-1">
        <li v-for="item in group.items" :key="item.name">
          <!-- Normal Link -->
          <router-link
            v-if="!item.subItems && hasPermission(item.name)"
            :to="item.path"
            @click="$emit('close')"
            class="flex items-center gap-3 px-6 pl-[20px] ml-[20px] py-4 transition-colors duration-200 group relative border-l-[3px]"
            :class="[
              isActive(item.path) 
                ? 'active-tab-shape border-[#fa5b0f] bg-[#F3F4F6] text-[#fa5b0f] dark:bg-[#151923] dark:text-white' 
                : 'hover-tab-shape border-transparent text-black hover:bg-[#F3F4F6] hover:text-[#fa5b0f] dark:text-[#9CA3AF] dark:hover:bg-[#151923] dark:hover:text-white'
            ]"
          >
            <component 
              :is="item.icon" 
              class="w-5 h-5 flex-shrink-0 transition-colors"
              :class="isActive(item.path) ? 'text-[#fa5b0f] dark:text-[#fa5b0f]' : 'text-black group-hover:text-[#fa5b0f] dark:text-[#6B7280] dark:group-hover:text-gray-300'"
            />
            <span class="text-sm font-medium">{{ item.name }}</span>
          </router-link>

          <!-- Dropdown -->
          <div v-else-if="hasPermission(item.name)" class="">
            <button
              @click="toggleDropdown(item.name)"
              class="pl-[20px] ml-[20px] w-full flex items-center justify-between gap-3 pr-6 py-4 transition-colors duration-200 group hover-tab-shape border-l-[3px] border-transparent text-black hover:bg-[#F3F4F6] hover:text-[#fa5b0f] dark:text-[#9CA3AF] dark:hover:bg-[#151923] dark:hover:text-white"
            >
              <div class="flex items-center gap-3">
                <component 
                  :is="item.icon" 
                  class="w-5 h-5 flex-shrink-0 transition-colors text-black group-hover:text-[#fa5b0f] dark:text-[#6B7280] dark:group-hover:text-gray-300"
                />
                <span class="text-sm font-medium">{{ item.name }}</span>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="w-4 h-4 transition-transform duration-200" 
                :class="openDropdown === item.name ? 'rotate-180' : ''" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <transition
              enter-active-class="transition-all duration-300 ease-out overflow-hidden"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-40 opacity-100"
              leave-active-class="transition-all duration-200 ease-in overflow-hidden"
              leave-from-class="max-h-40 opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <ul v-show="openDropdown === item.name" class="pl-14 space-y-2 pb-2">
                <li v-for="sub in item.subItems" :key="sub.path">
                  <router-link
                    :to="sub.path"
                    @click="$emit('close')"
                    class="block py-2 text-sm transition-colors duration-200"
                    :class="isActive(sub.path) ? 'text-[#fa5b0f] font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'"
                  >
                    {{ sub.name }}
                  </router-link>
                </li>
              </ul>
            </transition>
          </div>
        </li>
        </ul>
      </div>
    </nav>

    <!-- Footer -->
    <div class="px-6 py-6 border-t border-gray-200 dark:border-gray-800/50 mt-auto">
      <div class="flex items-center justify-between">
        <div class="text-[11px] text-[#6B7280] flex flex-col items-center mx-auto space-y-1">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>© 2026 RentCar v1.1.7</span>
          </div>
          <span>Tous droits réservés</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { h, computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

// Icon components as render functions
const DashboardIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('rect', { x: '3', y: '3', width: '7', height: '9', rx: '1' }),
      h('rect', { x: '14', y: '3', width: '7', height: '5', rx: '1' }),
      h('rect', { x: '14', y: '12', width: '7', height: '9', rx: '1' }),
      h('rect', { x: '3', y: '16', width: '7', height: '5', rx: '1' })
    ])
  }
}

const AgencyIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
      h('polyline', { points: '9 22 9 12 15 12 15 22' })
    ])
  }
}

const EmployeesIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '9', cy: '7', r: '4' }),
      h('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
      h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
    ])
  }
}

const DriversIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' }),
      h('path', { d: 'M2 12h20' })
    ])
  }
}

const ClientsIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '9', cy: '7', r: '4' }),
      h('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
      h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
    ])
  }
}

const CarsIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.8a1 1 0 0 0-.8.4L2.3 11l-5.16.86A1 1 0 0 0 .84 12.99V16h3' }),
      h('circle', { cx: '6.5', cy: '16.5', r: '2.5' }),
      h('circle', { cx: '16.5', cy: '16.5', r: '2.5' })
    ])
  }
}

const ReservationsIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' }),
      h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
      h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
      h('line', { x1: '3', y1: '10', x2: '21', y2: '10' })
    ])
  }
}

const RentalsIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }),
      h('path', { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' }),
      h('path', { d: 'M12 6v6' }),
      h('path', { d: 'M9 9h6' })
    ])
  }
}

const MaintenanceIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' })
    ])
  }
}

const AccountingIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('line', { x1: '12', y1: '1', x2: '12', y2: '23' }),
      h('path', { d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' })
    ])
  }
}

const SupervisionIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' }),
      h('circle', { cx: '12', cy: '12', r: '3' })
    ])
  }
}

const SettingsIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('circle', { cx: '12', cy: '12', r: '3' }),
      h('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' })
    ])
  }
}


const LogoutIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }), h('polyline', { points: '16 17 21 12 16 7' }), h('line', { x1: '21', y1: '12', x2: '9', y2: '12' }) ]) } }
const VisitesIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('path', { d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }) ]) } }
const AssurancesIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }) ]) } }
const AssistancesIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('path', { d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' }) ]) } }
const EntretiensIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('path', { d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' }) ]) } }
const TachesIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('path', { d: 'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' }) ]) } }
const ContratsIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('path', { d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 m-14 4h8 m-8 4h8' }) ]) } }
const FacturesIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('path', { d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M16 13H8 M16 17H8 M10 9H8' }) ]) } }
const AccidentsIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('path', { d: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01' }) ]) } }
const VersementsIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('circle', { cx: '12', cy: '12', r: '10' }), h('path', { d: 'M16 8h-6a2 2 0 100 4h4a2 2 0 110 4H8 M12 18V6' }) ]) } }
const FinancementsIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('path', { d: 'M3 21h18 M4 21v-4 M10 21v-4 M14 21v-4 M20 21v-4 M12 3L3 9h18L12 3z' }) ]) } }
const TraitesIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('rect', { x: '2', y: '5', width: '20', height: '14', rx: '2', ry: '2' }), h('line', { x1: '2', y1: '10', x2: '22', y2: '10' }) ]) } }
const StatistiquesIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('rect', { x: '18', y: '3', width: '4', height: '18' }), h('rect', { x: '10', y: '8', width: '4', height: '13' }), h('rect', { x: '2', y: '13', width: '4', height: '8' }) ]) } }
const RapportsIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('path', { d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' }) ]) } }
const ChargesIcon = { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('path', { d: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' }) ]) } }

export default {

  name: 'NewSidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
    
    const openDropdown = ref('Voitures') // Default open
    const normalizeRole = (role) => String(role || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const isAgencyRestrictedRole = computed(() => {
      const role = normalizeRole(userStore.currentUser?.role)
      return role === 'gerant' || role === 'employe' || role === 'agent'
    })
    const agenciesMenuPath = computed(() => {
      if (userStore.isAdmin || userStore.isSuperAdmin || !isAgencyRestrictedRole.value) {
        return '/agencies'
      }
      const ownAgencyId = userStore.userAgencyId
      return ownAgencyId ? `/agencies/${ownAgencyId}` : '/agencies'
    })

    const toggleDropdown = (name) => {
      openDropdown.value = openDropdown.value === name ? '' : name;
    }
    
    const menuGroups = computed(() => {
      if (userStore.isSuperAdmin) {
        return [
          {
            title: 'SaaS SUPERVISION',
            items: [
              { name: 'Tableau de bord', path: '/super-admin', icon: DashboardIcon },
              { name: 'Paramètres', path: '/super-admin/settings', icon: SettingsIcon }
            ]
          }
        ]
      }
      return [
        {
          title: '',
          items: [
            { name: 'Tableau de bord', path: '/dashboard', icon: DashboardIcon },
            { name: 'Agences', path: agenciesMenuPath.value, icon: AgencyIcon },
            { name: 'Clients', path: '/clients', icon: ClientsIcon }
          ]
        },
        {
          title: 'PARC AUTOMOBILE',
          items: [
            { 
              name: 'Véhicules', 
              icon: CarsIcon,
              subItems: [
                { name: 'Liste voitures', path: '/cars' },
                { name: 'Disponibilité', path: '/cars/availability' },
                { name: 'Dégâts et État', path: '/cars/damages' },
                { name: 'Marques', path: '/marques' },
                { name: 'Modèles', path: '/modeles' }
              ]
            },
            { 
              name: 'Visites techniques', 
              icon: VisitesIcon,
              subItems: [
                { name: 'Liste visites', path: '/visites-techniques' },
                { name: 'Nouvelle visite', path: '/visites-techniques?new=1' },
                { name: 'Centres de visite', path: '/centres-visite' }
              ]
            },
            { 
              name: 'Assurances', 
              icon: AssurancesIcon,
              subItems: [
                { name: 'Liste assurances', path: '/assurances' },
                { name: 'Nouvelle assurance', path: '/assurances?new=1' },
                { name: 'Liste agences', path: '/assurance-agences' }
              ]
            },
            // { name: 'Assistances', path: '/assistances', icon: AssistancesIcon },
            { name: 'Entretiens', path: '/entretiens', icon: EntretiensIcon },
            { name: 'Tâches', path: '/taches', icon: TachesIcon }
          ]
        },
        {
          title: 'COMMERCIAL',
          items: [
            { 
              name: 'Contrats', 
              icon: ContratsIcon,
              subItems: [
                { name: 'Liste Contrats', path: '/contrats' },
                { name: 'Nouvelle Contrat', path: '/contrats/add' }
              ]
            },
           /* { name: 'Réservations', path: '/reservations', icon: ReservationsIcon },*/
            { name: 'Factures', path: '/factures', icon: FacturesIcon },
            { name: 'Accidents', path: '/accidents', icon: AccidentsIcon }
          ]
        },
        {
          title: 'FINANCES',
          items: [
         /* { name: 'Versements', path: '/versements', icon: VersementsIcon },
          { name: 'Financements', path: '/financements', icon: FinancementsIcon },*/
          { name: 'Traites', path: '/traites', icon: TraitesIcon },
          { name: 'Comptabilité', path: '/accounting', icon: AccountingIcon }
        ]
      },
      {
        title: 'ANALYSE',
        items: [
          { name: 'Statistiques', path: '/statistiques', icon: StatistiquesIcon },
          { name: 'Rapports généraux', path: '/rapports' }
        ]
      },
      {
        title: 'RESSOURCES HUMAINES',
        items: [
          { 
            name: 'Employés', 
            icon: EmployeesIcon,
            subItems: [
              { name: 'Liste employés', path: '/agents' },
              { name: 'Ajouter employé', path: '/agents/add' }
            ]
          }
        ]
      },
      {
        title: 'PARAMÈTRES',
        items: [
          { name: 'Paramètres', path: '/settings', icon: SettingsIcon }
        ]
      }
    ]
  })

  const isActive = (path) => {
      if (route.path === path) return true

      // Superadmin root dashboard should not stay active on its subpages (ex: /super-admin/settings)
      if (path === '/super-admin') {
         return route.path === '/super-admin'
      }
      
      // Special exclusion for /cars dashboard subpages so they don't highlight "Liste voitures"
      if (path === '/cars') {
         if (route.path.startsWith('/cars/availability') || route.path.startsWith('/cars/damages')) {
            return false
         }
      }
      
      return route.path.startsWith(path + '/')
    }

    const isDropdownActive = (subItems) => {
      return subItems.some(item => route.path === item.path || route.path.startsWith(item.path + '/'))
    }

    const handleLogout = () => {
      userStore.logout()
      router.push('/login')
    }

    // Initialize user store to get current user data
    userStore.initializeFromStorage()

    // Keep role/permissions in sync with the server so an admin's changes are
    // reflected here without a re-login. Admins/superadmins bypass checks anyway.
    const refreshAccess = () => {
      if (!userStore.isAdmin && !userStore.isSuperAdmin) userStore.refreshCurrentUser()
    }
    const onVisibility = () => { if (document.visibilityState === 'visible') refreshAccess() }
    onMounted(() => {
      refreshAccess()
      window.addEventListener('focus', refreshAccess)
      document.addEventListener('visibilitychange', onVisibility)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('focus', refreshAccess)
      document.removeEventListener('visibilitychange', onVisibility)
    })

    const userName = computed(() => userStore.currentUser?.name || 'User')
    const userRole = computed(() => userStore.currentUser?.role === 'admin' ? 'Admin' : 'Agent')
    const userInitial = computed(() => userName.value?.charAt(0).toUpperCase() || 'U')

    const hasPermission = (itemName) => {
      if (userStore.isSuperAdmin) return true;
      if (userStore.isAdmin) return true;
      const perms = userStore.currentUser?.permissions;
      if (!perms || typeof perms !== 'object') return false;

      // Normalize keys/names (case- and accent-insensitive) and map the few labels
      // whose sidebar name differs from the stored permission key.
      const norm = (s) => String(s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
      const aliases = { 'vehicules': 'voitures', 'visites techniques': 'visites techniques' };
      let key = norm(itemName);
      key = aliases[key] || key;

      for (const k of Object.keys(perms)) {
        if (norm(k) === key) return perms[k] === true;
      }
      return false;
    }

    return {
      menuGroups,
      isActive,
      handleLogout,
      userName,
      userRole,
      userInitial,
      openDropdown,
      toggleDropdown,
      hasPermission
    }
  }
}
</script>

<style scoped>
nav ul li a {
  border-top-left-radius: 9999px;
  border-bottom-left-radius: 9999px;
  margin-left: 1rem;
  border-left-width: 0 !important;
  position: relative;
}
.active-tab-shape,
.hover-tab-shape:hover {
  border-top-left-radius: 9999px;
  border-bottom-left-radius: 9999px;
  margin-left: 1rem;
  border-left-width: 0 !important;
  position: relative;
}

.active-tab-shape::before,
.active-tab-shape::after,
.hover-tab-shape:hover::before,
.hover-tab-shape:hover::after {
  content: "";
  position: absolute;
  right: 0;
  width: 1.25rem;
  height: 1.25rem;
  background-color: inherit;
  pointer-events: none;
}

.active-tab-shape::before,
.hover-tab-shape:hover::before {
  top: -1.25rem;
  -webkit-mask-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22black%22%20d%3D%22M0%2C20%20Q20%2C20%2020%2C0%20L20%2C20%20Z%22/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22black%22%20d%3D%22M0%2C20%20Q20%2C20%2020%2C0%20L20%2C20%20Z%22/%3E%3C/svg%3E");
}

.active-tab-shape::after,
.hover-tab-shape:hover::after {
  bottom: -1.25rem;
  -webkit-mask-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22black%22%20d%3D%22M0%2C0%20Q20%2C0%2020%2C20%20L20%2C0%20Z%22/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22black%22%20d%3D%22M0%2C0%20Q20%2C0%2020%2C20%20L20%2C0%20Z%22/%3E%3C/svg%3E");
}
</style>
