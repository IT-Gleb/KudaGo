<script setup lang="ts">
const props = defineProps<{
  imageSrc: string;
  imageAlt: string;
}>();
</script>

<template>
  <div class="w-[300px] sm:w-[480px] lg:w-[640px] object-left-top object-cover">
    <img
      :src="props.imageSrc"
      :alt="props.imageAlt"
      decoding="sync"
      loading="eager"
      class="block w-full h-full"
    />
  </div>
</template>
