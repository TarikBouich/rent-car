import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from './views/DashboardView.vue'
import CarsView from './views/CarsView.vue'
import ReservationsView from './views/ReservationsView.vue'
import AddReservationView from './views/AddReservationView.vue'
import ArchivedReservationsView from './views/ArchivedReservationsView.vue'
import ClientsView from './views/ClientsView.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/cars',
    name: 'cars',
    component: CarsView
  },
  {
    path: '/cars/add',
    name: 'cars-add',
    component: () => import('./views/AddCarView.vue')
  },
  {
    path: '/car-events',
    name: 'car-events',
    component: () => import('./views/CarEventsView.vue')
  },
  {
    path: '/reservations',
    name: 'reservations',
    component: ReservationsView
  },
  {
    path: '/reservations/add',
    name: 'reservations-add',
    component: AddReservationView
  },
  {
    path: '/clients',
    name: 'clients',
    component: ClientsView
  },
  {
    path: '/clients/add',
    name: 'clients-add',
    component: () => import('./views/AddClientView.vue')
  },
  {
    path: '/archived-reservations',
    name: 'archived-reservations',
    component: ArchivedReservationsView
  },
  {
    path: '/archived-clients',
    name: 'archived-clients',
    component: () => import('./views/ArchivedClientsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 