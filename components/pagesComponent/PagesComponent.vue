<script setup lang="ts">
//import { setCountOnPage } from "../../utils/urls";
const CountOnPageArray: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const CountP = ref<number>(CountOnPageArray[2]);
const emitPage = defineEmits(["setNewsCountOnPage"]);

watch(CountP, () => {
  //console.log(CountP.value);
  //setCountOnPage(CountP.value);
  emitPage("setNewsCountOnPage", CountP.value);
});
</script>

<template>
  <div class="flex items-center gap-x-2">
    <span><small>Новостей на странице</small></span>
    <select
      name="countSelect"
      id="countSel"
      class="bg-slate-50 p-1 dark:bg-slate-950 outline-none border border-indigo-900 dark:border-slate-300"
      v-model="CountP"
    >
      <option
        v-for="item of CountOnPageArray"
        :key="item"
        :value="item"
        class="odd:bg-slate-100 dark:odd:bg-slate-900 p-2"
      >
        {{ item }}
      </option>
    </select>
  </div>
</template>
