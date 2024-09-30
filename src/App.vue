
<script setup></script>
<template>
  <main class="min-h-screen">
    <div class="fixed top-0 left-0 h-screen w-[300px] bg-primary-50">
      <div class="flex items-center px-4 py-6 gap-2">
        <div class="w-10 h-10">
          <steering-icon/>
        </div>
        <p class="text-lg">Location Voitures</p>
      </div>
      <ul class="p-0 grid gap-3 sidebar-links">
        <li>
          <RouterLink :to="{ name: 'dashboard' }">Dashboard</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'cars' }">List Voitures</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'cars-add' }">Ajouter Voiture</RouterLink>
        </li>
      </ul>
    </div>
    <div class="ml-[300px] min-h-screen">
      <div class="h-[70px] bg-primary-90 flex items-center justify-between p-6">
        <div>Page Title</div>
        <div class="grid grid-cols-2 gap-4">
          <a href="#" class="flex items-center justify-center w-[40px] p-1 rounded-full bg-primary-50 border-[3px] border-primary-70"><notification-icon/></a>
          <a href="#" class="flex items-center justify-center w-[40px] h-[40px] p-1 rounded-full bg-primary-50 border-[3px] border-primary-70"><user-icon/></a>
        </div>
      </div>
      <div class="p-5">
        <RouterView :key="$route.path" />
      </div>
    </div>
  </main>
</template>
<script>
import steeringIcon from "./components/icons/steering.vue";
import userIcon from "./components/icons/user.vue";
import notificationIcon from "./components/icons/notification.vue";
export default {
  components: {
    steeringIcon,
    userIcon,
    notificationIcon
  },
};
</script>