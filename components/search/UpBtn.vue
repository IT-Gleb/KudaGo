<script setup lang="ts">
import Arrow2 from "../svg/Arrow2.vue";

const handlerUp = () => {
  window.scrollTo(0, 0);
};
</script>

<template>
  <div
    class="fixed right-2 top-[90%] w-fit bg-slate-900 text-white px-1 py-[2px] outline-2 outline-offset-2 outline-indigo-950 dark:outline-green-500 border-2 border-slate-50 rounded-full"
  >
    <button
      type="button"
      aria-label="Up"
      class="w-[28px] h-[28px] active:scale-70 rotate-90 scale-90 cursor-pointer"
      @click="handlerUp"
    >
      <Arrow2 />
    </button>
  </div>
</template>
