<script setup lang="ts">
import { PieStore } from "~/store/pieStore";
import PieItemEditButton from "./PieItemEditButton.vue";
import PieItemTrashButton from "./PieItemTrashButton.vue";
import PieGraph from "./PieGraph.vue";

const store = PieStore();
const { Items } = store;
</script>

<template>
  <div class="mb-10">
    <span class="header1 font-[600] text-[32px]">Круговая диаграмма</span>
  </div>
  <section class="gap-y-4 w-fit mx-auto flex flex-wrap gap-x-2">
    <ul class="max-w-[541px] overflow-hidden">
      <li
        v-for="item in Items"
        class="flex flex-row gap-x-[50px] bg-[#DBDFE933] py-[20px] px-[18px] mb-[5px]"
      >
        <div class="w-[253px] h-[24px] flex items-center justify-between">
          <div class="w-[120px] border-r-2 border-r-[#DBDFE9] header1">
            {{ item.label }}
          </div>
          <div
            class="min-w-[83px] border-r-2 border-r-[#DBDFE9] text-center header1"
          >
            {{ item.value }}%
          </div>
          <div
            class="w-[20px] h-[20px] rounded-full"
            :style="{ backgroundColor: `${item.bgColor}` }"
          ></div>
        </div>
        <div class="flex flex-row gap-x-[24px] ml-auto">
          <PieItemEditButton />
          <PieItemTrashButton />
        </div>
      </li>
      <li class="mt-[30px]">
        <button
          type="button"
          class="w-full bg-[#1B84FF] header1 text-white font-[400] text-[16px]/[24px] rounded-[10px] cursor-pointer active:scale-90 p-[18px_36px_18px_36px]"
        >
          Добавить сектор
        </button>
      </li>
    </ul>
    <PieGraph />
  </section>
</template>

<style scoped>
.header1 {
  font-family: Inter;
}
</style>
