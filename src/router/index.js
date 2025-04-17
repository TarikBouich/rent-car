import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import CarsView from "../views/CarsView.vue";
import ReservationsView from "../views/ReservationsView.vue";
import ClientsView from "../views/ClientsView.vue";
import AddClientView from "../views/AddClientView.vue";
import AddReservationView from "../views/AddReservationView.vue";
import ActiveRentalsView from "../views/ActiveRentalsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: "/cars",
      name: "cars",
      component: CarsView,
    },
    {
      path: "/cars/add",
      name: "cars-add",
      component: () => import("../views/AddCarView.vue"),
    },
    {
      path: "/reservations",
      name: "reservations",
      component: ReservationsView,
    },
    {
      path: "/reservations/add",
      name: "reservations-add",
      component: AddReservationView,
    },
    {
      path: "/clients",
      name: "clients",
      component: ClientsView,
    },
    {
      path: "/clients/add",
      name: "clients-add",
      component: AddClientView,
    },
    {
      path: "/active-rentals",
      name: "active-rentals",
      component: ActiveRentalsView,
    },
    {
      path: "/archived-reservations",
      name: "archived-reservations",
      component: () => import("../views/ArchivedReservationsView.vue"),
    },
  ],
});

export default router;