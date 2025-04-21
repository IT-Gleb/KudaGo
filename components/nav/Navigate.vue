<script setup lang="ts">
import { ref } from "vue";
const menuItems = ref(["One", "Two", "Free", "Four"]);
</script>

<template>
  <nav class="flex flex-row gap-x-2 justify-evenly uppercase">
    <a v-for="item in menuItems" href="#" class="p-1 hover:text-yellow-100">{{
      item
    }}</a>
  </nav>
</template>
