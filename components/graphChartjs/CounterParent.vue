<script setup lang="ts">
import { ref } from "vue";
import counter from "./counter.vue";

const counterRef = ref<InstanceType<typeof counter> | null>(null);

const handlePlus = () => {
  counterRef.value?.increment();
};

const handleMinus = () => {
  counterRef.value?.decrement();
};
</script>

<template>
  <div class="w-fit mx-auto mb-10 border p-1">
    <counter ref="counterRef" />
    <div class="flex items-center gap-4">
      <button
        type="button"
        class="p-1 min-w-[100px] min-h-[40px] place-content-center bg-slate-600 text-slate-100 active:scale-90 cursor-pointer"
        @click="handlePlus"
      >
        +
      </button>
      <button
        type="button"
        class="p-1 min-w-[100px] min-h-[40px] place-content-center bg-slate-600 text-slate-100 active:scale-90 cursor-pointer"
        @click="handleMinus"
      >
        -
      </button>
    </div>
  </div>
</template>
