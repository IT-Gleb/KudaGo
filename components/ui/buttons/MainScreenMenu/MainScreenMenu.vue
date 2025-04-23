<script setup lang="ts">
const MainMenuItems = ref(["Новости", "Мероприятия", "Выставки", "Музеи"]);
</script>

<template>
  <div
    class="text-[clamp(3vw,4vw,4vw)] sm:text-[clamp(2.4vw,3vw,2.8vw)] md:text-[clamp(1.25vw,2vw,1.8vw)] flex flex-row flex-wrap items-start md:items-center max-[767px]:text-slate-200 dark:max-[767px]:text-slate-300 md:text-indigo-950 dark:md:text-slate-300 gap-4 justify-center uppercase font-bold"
  >
    <NuxtLink
      href="#"
      v-for="menuItem of MainMenuItems"
      class="hover:underline"
      >{{ menuItem }}</NuxtLink
    >
  </div>
</template>
