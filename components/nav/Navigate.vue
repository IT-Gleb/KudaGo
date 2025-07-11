<script setup lang="ts">
import ThemeButton from "~/components/ui/buttons/ThemeButton.vue";
import langButton from "../ui/buttons/langButton.vue";
</script>

<template>
  <nav class="flex flex-row gap-x-4 justify-end uppercase my-2">
    <langButton />
    <div class="place-content-center mr-5">
      <ThemeButton />
    </div>
  </nav>
</template>
