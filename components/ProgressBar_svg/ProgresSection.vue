<script setup lang="ts">
import ProgressBar, {
  type TProgressState,
  type TProgressView,
} from "./ProgressBar.vue";
import PieGraph from "../graphChartjs/PieGraph.vue";
import PieForm from "../graphChartjs/PieForm.vue";

const widthBar = ref<number>(180);
const valuesBar = ref<number>(0);
const stateVar = ref<TProgressState>("in-progress");
const progresType = ref<TProgressView>("normal");
const isType = ref<boolean>(false);

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
    stateVar.value = "warning";
    return;
  }
  valuesBar.value = 0;
  stateVar.value = "in-progress";
  timerRef.value = window.setInterval(() => {
    if (stateVar.value === "in-progress") {
      valuesBar.value += 1;
      if (valuesBar.value >= 100) {
        clearTimer();
        stateVar.value = "success";
      }
    }
  }, 200);
};

const handleType = () => {
  if (progresType.value === "normal") {
    progresType.value = "dashboard";
    isType.value = false;
    return;
  }
  if (progresType.value === "dashboard") {
    progresType.value = "normal";
    isType.value = true;
  }
};
</script>

<template>
  <section class="min-h-screen p-1 py-10">
    <div class="flex flex-col gap-5">
      <div class="w-fit mx-auto mt-5">
        <ProgressBar
          :width="widthBar"
          :value="valuesBar"
          :state="stateVar"
          :view="progresType"
        />
      </div>
      <div
        class="w-fit mx-auto p-2 place-content-center flex flex-wrap gap-5 justify-baseline"
      >
        <label class="flex gap-2">
          <span>Тип: </span>
          <button
            type="button"
            class="p-2 min-w-[120px] min-h-[40px] place-content-center cursor-pointer bg-indigo-900 text-slate-300 active:scale-90 overflow-hidden"
            @click="handleType"
          >
            {{ isType ? "Normal" : "Dashboard" }}
          </button>
        </label>
        <label class="flex gap-2">
          <span>Размер:</span>
          <select
            id="selectWidth"
            v-model="widthBar"
            class="outline-none border border-indigo-900 p-1 dark:bg-slate-950 dark:text-slate-300"
          >
            <option :value="50">50x50</option>
            <option :value="75">75x75</option>
            <option :value="100">100x100</option>
            <option :value="140">140x140</option>
            <option :value="180">180x180</option>
            <option :value="220">220x220</option>
            <option :value="260">260x260</option>
            <option :value="300">300x300</option>
            <option :value="360">360x360</option>
          </select>
        </label>

        <button
          type="button"
          class="p-2 min-w-[120px] min-h-[40px] place-content-center cursor-pointer bg-indigo-900 text-slate-300 active:scale-90 disabled:bg-slate-400 disabled:cursor-none disabled:pointer-events-none overflow-hidden"
          @click="handleAutoProgress"
          :disabled="stateVar === 'in-progress'"
        >
          "Запустить"
        </button>
        <label class="flex gap-2">
          <span>Значения:</span>
          <select
            id="progressValues"
            class="outline-none border border-indigo-900 p-1 dark:bg-slate-950 dark:text-slate-300"
            v-model="valuesBar"
          >
            <option :value="0">0</option>
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="33">33</option>
            <option :value="50">50</option>
            <option :value="77">77</option>
            <option :value="85">85</option>
            <option :value="99">99</option>
            <option :value="100">100</option>
          </select>
        </label>

        <label class="flex gap-2">
          <span>Состояние:</span>
          <select
            id="selState"
            class="outline-none border border-indigo-900 p-1 dark:bg-slate-950 dark:text-slate-300"
            v-model="stateVar"
          >
            <option value="in-progress">in-progress</option>
            <option value="success">success</option>
            <option value="warning">warning</option>
            <option value="error">error</option>
          </select>
        </label>
      </div>
    </div>
    <div class="w-fit mx-auto my-20">
      <div class="flex flex-wrap-reverse items-stretch gap-4">
        <PieGraph />
        <PieForm />
      </div>
    </div>
  </section>
</template>
