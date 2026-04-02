import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import { checkAccess } from '../utils/navigationGuard';
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
      path: "/sign/:token",
      name: "signature-capture",
      component: () => import("../views/SignatureCaptureView.vue"),
      meta: { requiresAuth: false, layout: 'auth' } // Use empty layout
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/NewDashboardView.vue"),
      meta: { requiresAuth: true, layout: 'new-default', requiresAdmin: true }
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
      component: () => import("../views/NewCarsView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/cars/add",
      name: "cars-add",
      component: () => import("../views/NewAddCarView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/cars/availability",
      name: "cars-availability",
      component: () => import("../views/CarAvailabilityView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/cars/damages",
      name: "cars-damages",
      component: () => import("../views/CarDamagesView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/cars/:id",
      name: "car-profile",
      component: () => import("../views/CarProfileView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/marques",
      name: "marques",
      component: () => import("../views/BrandsView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/modeles",
      name: "modeles",
      component: () => import("../views/ModelsView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/car-events",
      name: "car-events",
      component: () => import("../views/CarEventsView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/reservations",
      alias: ["/reservation", "/new-reservation"],
      name: "reservations",
      component: () => import("../views/ReservationsView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/reservations/add",
      name: "reservations-add",
      component: () => import("../views/NewReservationView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/clients",
      name: "clients",
      component: () => import("../views/ClientsView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/clients/add",
      name: "clients-add",
      component: () => import("../views/AddClientView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/active-rentals",
      name: "active-rentals",
      component: () => import("../views/ActiveRentalsView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/archived-reservations",
      name: "archived-reservations",
      component: () => import("../views/ArchivedReservationsView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/agents',
      name: 'agents',
      component: () => import('../views/AgentsView.vue'),
      meta: { requiresAuth: true, layout: 'new-default', requiresAdmin: true }
    },
    {
      path: '/agents/add',
      name: 'agents-add',
      component: () => import('../views/AddAgentView.vue'),
      meta: { requiresAuth: true, layout: 'new-default', requiresAdmin: true }
    },
    {
      path: '/agents/:id',
      name: 'agent-profile',
      component: () => import('../views/AgentProfileView.vue'),
      meta: { requiresAuth: true, layout: 'new-default', requiresAdmin: true }
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: () => import('../views/AlertsView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/agencies',
      name: 'agencies',
      component: () => import('../views/AgenciesView.vue'),
      meta: { requiresAuth: true, layout: 'new-default', requiresAdmin: true }
    },
    {
      path: '/agencies/:id',
      name: 'agency-profile',
      component: () => import('../views/AgencyProfileView.vue'),
      meta: { requiresAuth: true, layout: 'new-default', requiresAdmin: true }
    },
    {
      path: '/accounting',
      name: 'accounting',
      component: () => import('../views/AccountingView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAuth: true, layout: 'new-default', requiresAdmin: true }
    },
    {
      path: '/supervision',
      name: 'supervision',
      component: () => import('../views/SupervisionView.vue'),
      meta: { requiresAuth: true, layout: 'new-default', requiresAdmin: true }
    },
    {
      path: '/visites-techniques',
      name: 'visites-techniques',
      component: () => import('../views/VisitesTechniquesView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/centres-visite',
      name: 'centres-visite',
      component: () => import('../views/CentresVisiteView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/assurances',
      name: 'assurances',
      component: () => import('../views/AssurancesView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/assurance-agences',
      name: 'assurance-agences',
      component: () => import('../views/AssuranceAgencesView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/assistances',
      name: 'assistances',
      component: () => import('../views/AssistancesView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/entretiens',
      name: 'entretiens',
      component: () => import('../views/EntretiensView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/taches',
      name: 'taches',
      component: () => import('../views/TachesView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/contrats',
      name: 'contrats',
      component: () => import('../views/ContratsView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/contrats/add",
      name: "contrats-add",
      component: () => import("../views/NewAddContratView.vue"),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: "/contrats/:id/print",
      name: "contrat-print",
      component: () => import("../views/ContratPrintView.vue"),
      meta: { requiresAuth: true, layout: 'print' }
    },
    {
      path: '/factures',
      name: 'factures',
      component: () => import('../views/FacturesView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/accidents',
      name: 'accidents',
      component: () => import('../views/AccidentsView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/versements',
      name: 'versements',
      component: () => import('../views/VersementsView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/financements',
      name: 'financements',
      component: () => import('../views/FinancementsView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/traites',
      name: 'traites',
      component: () => import('../views/TraitesView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/statistiques',
      name: 'statistiques',
      component: () => import('../views/StatistiquesView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/rapports',
      name: 'rapports',
      component: () => import('../views/RapportsView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/super-admin',
      name: 'super-admin',
      component: () => import('../views/SuperAdminDashboard.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
    },
    {
      path: '/super-admin/client/:id',
      name: 'super-admin-tenant',
      component: () => import('../views/TenantProfileView.vue'),
      meta: { requiresAuth: true, layout: 'new-default' }
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