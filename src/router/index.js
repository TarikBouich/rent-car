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
  ],
});
export default router;