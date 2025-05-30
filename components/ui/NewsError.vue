<script setup lang="ts">
const props = defineProps<{ errorMsg: string }>();
</script>

<template>
  <article class="w-[95%] md:w-[60%] mx-auto my-5 border border-red-500 p-2">
    <h4 class="w-fit mx-auto text-red-400">Ой. Что-то пошло не так.</h4>
    <p class="mt-3">
      {{ props.errorMsg }}
    </p>

    <p class="mt-5">Поробуйте повторить. Нажмите обновить.</p>
  </article>
</template>
