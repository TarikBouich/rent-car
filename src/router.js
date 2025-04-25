import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/LoginView.vue'),
    meta: { 
      layout: 'auth',
      requiresAuth: false 
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cars',
    name: 'cars',
    component: () => import('./views/CarsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cars/add',
    name: 'cars-add',
    component: () => import('./views/AddCarView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/car-events',
    name: 'car-events',
    component: () => import('./views/CarEventsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reservations',
    name: 'reservations',
    component: () => import('./views/ReservationsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reservations/add',
    name: 'reservations-add',
    component: () => import('./views/AddReservationView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clients',
    name: 'clients',
    component: () => import('./views/ClientsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/add',
    name: 'clients-add',
    component: () => import('./views/AddClientView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/archived-reservations',
    name: 'archived-reservations',
    component: () => import('./views/ArchivedReservationsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/archived-clients',
    name: 'archived-clients',
    component: () => import('./views/ArchivedClientsView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const currentUser = localStorage.getItem('currentUser')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (to.path === '/login' && currentUser) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router 