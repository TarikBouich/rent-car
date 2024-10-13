import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
    },
    {
      path: "/cars",
      name: "cars",
      component: () => import("../views/CarsView.vue"),
    },
    {
      path: "/cars/add",
      name: "cars-add",
      component: () => import("../views/AddCarView.vue"),
    },
    {
      path: "/reservations",
      name: "reservations",
      component: () => import("../views/ReservationsView.vue"),
    },
    {
      path: "/reservations/add",
      name: "reservations-add",
      component: () => import("../views/AddReservationView.vue"),
    },
    {
      path: "/clients",
      name: "clients",
      component: () => import("../views/ClientsView.vue"),
    },
    {
      path: "/clients/add",
      name: "clients-add",
      component: () => import("../views/AddClientView.vue"),
    },
  ],
});
export default router;