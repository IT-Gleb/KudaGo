<script setup lang="ts">
// import { ref } from "vue";
import ThemeButton from "~/components/ui/buttons/ThemeButton.vue";
// const menuItems = ref(["One", "Two", "Free", "Four"]);
</script>

<template>
  <nav class="flex flex-row gap-x-2 justify-evenly uppercase my-2">
    <!-- <a
      v-for="item in menuItems"
      href="#"
      class="p-1 hover:text-yellow-100 active:text-yellow-300 visited:text-sky-400"
      >{{ item }}</a
    > -->
    <div class="place-content-center">
      <ThemeButton />
    </div>
  </nav>
</template>
