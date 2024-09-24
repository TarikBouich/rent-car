<script setup></script>

<template>
  <main class="min-h-screen">
    <div class="fixed top-0 left-0 h-screen w-[300px] border-r">
      <ul>
        <li><RouterLink :to="{ name: 'dashboard' }">Dashboard</RouterLink></li>
        <li>
          <RouterLink :to="{ name: 'cars' }">Cars</RouterLink>
        </li>
      </ul>
    </div>
    <div class="ml-[300px] bg-red-100 min-h-screen">
      <div class="h-[50px] bg-white flex items-center justify-between">
        <div>Page Title</div>
        <div>User Account & notifications & dark/light mode</div>
      </div>
      <div class="p-5">
        <RouterView :key="$route.path" />
      </div>
    </div>
  </main>
</template>
