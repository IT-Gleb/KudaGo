<script setup lang="ts">
import { PieStore } from "~/store/pieStore";
import PieItemEditButton from "./PieItemEditButton.vue";
import PieItemTrashButton from "./PieItemTrashButton.vue";
import PieGraph from "./PieGraph.vue";
import DialogSector from "./DialogSector.vue";

import { ref } from "vue";
import type { TDialogMode } from "./DialogSector.vue";

const dRef = ref<InstanceType<typeof DialogSector> | null>(null);
const dialogMode = ref<TDialogMode>("none");
const aRef = ref<HTMLSpanElement>();

const store = PieStore();
const { Items } = storeToRefs(store);
const { setActiveIndex, SetRandomValues } = store;

const handleAddDialog = () => {
  aRef.value?.scrollIntoView(true);
  dialogMode.value = "add";
};

const handleRandomValues = () => {
  aRef.value?.scrollIntoView(true);
  SetRandomValues();
};

const handleEditDialog = (paramIndex: number) => {
  setActiveIndex(paramIndex);
  dialogMode.value = "edit";
};

const setNoneMode = () => {
  dialogMode.value = "none";
};

watch(dialogMode, () => {
  // console.log(dialogMode.value);
  if (dialogMode.value !== "none") {
    dRef.value?.showDialog();
  }
});
</script>

<template>
  <div class="mb-10">
    <span ref="aRef" class="header1 font-[600] text-[32px]/[32px]"
      >Круговая диаграмма</span
    >
  </div>
  <DialogSector ref="dRef" :mode="dialogMode" :onClose="setNoneMode" />
  <section class="w-fit mx-auto flex flex-wrap gap-x-2 gap-y-4">
    <ul class="w-[99%] md:w-[541px] mx-auto overflow-hidden">
      <li
        v-for="(item, index) in Items"
        :key="item.id"
        class="flex flex-row gap-x-10 lg:gap-x-[50px] bg-[#DBDFE933] py-[20px] px-[18px] mb-[5px]"
      >
        <div
          class="w-fit lg:w-[253px] h-[24px] grid grid-cols-[100px_83px_1fr]"
        >
          <div
            class="overflow-hidden whitespace-nowrap border-r-2 border-r-[#DBDFE9] text-[16px]/[24px] font-['Inter']"
          >
            {{ item.label }}
          </div>
          <div
            class="border-r-2 border-r-[#DBDFE9] text-center text-[16px]/[24px] font-['Inter']"
          >
            {{ item.value }}%
          </div>
          <div
            class="w-[16px] h-[16px] md:w-[20px] md:h-[20px] rounded-full ml-5"
            :style="{ backgroundColor: `${item.bgColor}` }"
          ></div>
        </div>
        <div class="flex flex-row gap-x-2 lg:gap-x-[24px] ml-auto">
          <PieItemEditButton :run="() => handleEditDialog(index)" />
          <PieItemTrashButton :delete-index="index" />
        </div>
      </li>
      <li class="mt-[30px]">
        <button
          type="button"
          class="w-full bg-[#1B84FF] header1 text-white font-[400] text-[16px]/[24px] rounded-[10px] cursor-pointer active:scale-90 p-[18px_36px_18px_36px]"
          @click.prevent="handleAddDialog"
        >
          Добавить сектор
        </button>
      </li>
      <li class="mt-[30px]">
        <button
          type="button"
          class="w-full bg-[#1B84FF] header1 text-white text-balance font-[400] text-[16px]/[24px] rounded-[10px] cursor-pointer active:scale-90 p-[18px_36px_18px_36px]"
          @click.prevent="handleRandomValues"
        >
          Сформировать график(случайные значения)
        </button>
      </li>
    </ul>
    <PieGraph />
  </section>
</template>
