import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import CarsView from "../views/CarsView.vue";
import ReservationsView from "../views/ReservationsView.vue";
import ClientsView from "../views/ClientsView.vue";
import AddClientView from "../views/AddClientView.vue";
import AddReservationView from "../views/AddReservationView.vue";
import ActiveRentalsView from "../views/ActiveRentalsView.vue";
import LoginView from "../views/LoginView.vue";
import { checkAccess } from '../utils/navigationGuard';
import AgentsView from '../views/AgentsView.vue';
import AlertsView from '../views/AlertsView.vue';
import { useUserStore } from '../stores/userStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { requiresAuth: false, layout: 'auth' }
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/",
      redirect: to => {
        const userStore = useUserStore();
        if (!userStore.isAuthenticated) return '/login';
        return userStore.isAdmin ? '/dashboard' : '/cars';
      }
    },
    {
      path: "/cars",
      name: "cars",
      component: CarsView,
      meta: { requiresAuth: true }
    },
    {
      path: "/cars/add",
      name: "cars-add",
      component: () => import("../views/AddCarView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/car-events",
      name: "car-events",
      component: () => import("../views/CarEventsView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/reservations",
      name: "reservations",
      component: ReservationsView,
      meta: { requiresAuth: true }
    },
    {
      path: "/reservations/add",
      name: "reservations-add",
      component: AddReservationView,
      meta: { requiresAuth: true }
    },
    {
      path: "/clients",
      name: "clients",
      component: ClientsView,
      meta: { requiresAuth: true }
    },
    {
      path: "/clients/add",
      name: "clients-add",
      component: AddClientView,
      meta: { requiresAuth: true }
    },
    {
      path: "/active-rentals",
      name: "active-rentals",
      component: ActiveRentalsView,
      meta: { requiresAuth: true }
    },
    {
      path: "/archived-reservations",
      name: "archived-reservations",
      component: () => import("../views/ArchivedReservationsView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: '/agents',
      name: 'agents',
      component: AgentsView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: AlertsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/agencies',
      name: 'agencies',
      component: () => import('../views/AgenciesView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  console.log('Navigation guard:', {
    to: {
      path: to.path,
      name: to.name,
      meta: to.meta
    },
    from: {
      path: from.path,
      name: from.name
    }
  });
  
  if (checkAccess(to, router)) {
    console.log('Access granted to:', to.path);
    next();
  } else {
    console.log('Access denied to:', to.path);
  }
});

export default router;