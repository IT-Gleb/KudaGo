<script setup lang="ts">
import ThemeButton from "~/components/ui/buttons/ThemeButton.vue";
import langButton from "../ui/buttons/langButton.vue";
import SearchComponent from "../search/SearchComponent.vue";
</script>

<template>
  <nav
    class="flex flex-row items-center gap-x-4 justify-end uppercase my-2 ml-1"
  >
    <SearchComponent />
    <langButton />
    <div class="place-content-center mr-5">
      <ThemeButton />
    </div>
  </nav>
</template>
