<script setup lang="ts">
import progressBar2 from "./progressBar2.vue";
const widthBar = ref<number>(180);
const valuesBar = ref<number>(0);

const timerRef = ref<number>(-1);

const clearTimer = () => {
  if (timerRef.value !== -1) {
    window.clearInterval(timerRef.value);
    timerRef.value = -1;
  }
};

const handleAutoProgress = () => {
  if (timerRef.value !== -1) {
    clearTimer();
    return;
  }
  valuesBar.value = 0;
  timerRef.value = window.setInterval(() => {
    valuesBar.value += 1;
    if (valuesBar.value >= 100) {
      clearTimer();
    }
  }, 200);
};
</script>

<template>
  <section class="min-h-screen p-1 py-10">
    <div class="flex flex-col gap-5">
      <div class="w-fit mx-auto mt-5">
        <progressBar2
          :width="widthBar"
          :value="valuesBar"
          view="normal"
          :state="'error'"
        />
      </div>
      <div class="w-fit mx-auto p-2 place-content-center flex gap-x-5">
        <button
          type="button"
          class="p-2 w-[120px] h-[40px] place-content-center cursor-pointer bg-indigo-900 text-slate-300 active:scale-90"
        >
          Dashboard
        </button>

        <select
          id="selectWidth"
          v-model="widthBar"
          class="outline-none border border-indigo-900 p-1"
        >
          <option value="100">100x100</option>
          <option value="140">140x140</option>
          <option value="180">180x180</option>
          <option value="240">240x240</option>
          <option value="360">360x360</option>
        </select>

        <button
          type="button"
          class="p-2 w-[120px] h-[40px] place-content-center cursor-pointer bg-indigo-900 text-slate-300 active:scale-90"
          @click="handleAutoProgress"
        >
          "Запустить"
        </button>
        <select
          id="progressValues"
          class="outline-none border border-indigo-900 p-1"
          v-model="valuesBar"
        >
          <option value="0">0</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="33">33</option>
          <option value="50">50</option>
          <option value="77">77</option>
          <option value="85">85</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  </section>
</template>
