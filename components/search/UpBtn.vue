<script setup lang="ts">
import Arrow2 from "../svg/Arrow2.vue";

const handlerUp = () => {
  window.scrollTo(0, 0);
};
</script>

<template>
  <div
    class="fixed right-1 top-[94%] bg-slate-900 text-white px-1 py-[2px] border-2 border-slate-50 rounded-lg"
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
