<script setup lang="ts">
const props = defineProps<{ errObject: Error; errFn: () => void }>();
</script>

<template>
  <div
    class="w-fit mx-auto my-5 p-1 border border-rose-700 overflow-hidden rounded-md"
  >
    <h4 class="my-2 w-fit mx-auto">Ошибка</h4>
    <p class="indent-2 text-balance first-letter:uppercase">
      {{ props.errObject.message }}
    </p>

    <div class="w-fit mx-auto my-2">
      <button
        class="p-1 place-content-center bg-red-600 text-white cursor-pointer inset-3 active:scale-90"
        @click="props.errFn"
      >
        <small>Повторить</small>
      </button>
    </div>
  </div>
</template>
