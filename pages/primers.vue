<script setup lang="ts">
import ProgresSection from "~/components/ProgressBar_svg/ProgresSection.vue";
</script>

<template>
  <div class="p-2 my-10 flex flex-col gap-2">
    <div class="my-5 place-content-center lg:w-[60%] text-left">
      <NuxtLink to="/" class="my-5"><small>На главную</small></NuxtLink>
    </div>
    <ProgresSection />
    <div class="my-5 place-content-center text-right">
      <NuxtLink to="/"><small>На главную</small></NuxtLink>
    </div>
  </div>
</template>
