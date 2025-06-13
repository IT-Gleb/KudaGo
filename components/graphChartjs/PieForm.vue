<script setup lang="ts">
import { PieColors, PieStore } from "~/store/pieStore";
import type { TPieChartItem } from "./PieGraph.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { nanoid } from "nanoid";

const calculateColor = () => {
  const indx: number = randomIntegerFromMinMax(0, PieColors.value.length - 1);
  return PieColors.value[indx].color;
};

type TStateRadio = "add" | "edit" | "delete";

const PLabel = ref<string>("");
const PValue = ref<number>(0);
const PColor = ref<string>(calculateColor());
const PState = ref<TStateRadio>("add");

const store = PieStore();
const { addItem, setItem, deleteItem, setItemInArray } = store;
const { Item } = storeToRefs(store);

const handleSubmit = () => {
  let tmp: Partial<TPieChartItem> = {};
  tmp.label = PLabel.value;
  tmp.value = PValue.value;
  tmp.bgColor = PColor.value;
  PState.value === "add" ? (tmp.id = nanoid()) : (tmp.id = Item.value.id);

  switch (PState.value) {
    case "add":
      addItem(tmp as TPieChartItem);
      setItem(tmp as TPieChartItem);
      break;
    case "delete":
      deleteItem();
      PState.value = "add";
      break;
    case "edit":
      setItemInArray(tmp as TPieChartItem);
      PState.value = "add";
      break;
  }

  PLabel.value = "";
  PColor.value = calculateColor();
  PValue.value = 0;
};

watch(PState, () => {
  switch (PState.value) {
    case "add":
      PLabel.value = "";
      PValue.value = 0;
      PColor.value = calculateColor();
      break;
    case "edit":
    case "delete":
      PLabel.value = Item.value.label;
      PValue.value = Item.value.value;
      PColor.value = Item.value.bgColor;
      break;
  }
});
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="w-full md:max-w-[70%] md:mx-auto xl:max-w-[25%]"
  >
    <legend class="border border-slate-500 p-2">
      <fieldset
        class="my-5 w-fit mx-auto text-[0.75rem]/[1rem] flex flex-col items-start sm:flex-row lg:items-center gap-2 select-none"
      >
        <label class="cursor-pointer">
          <input type="radio" name="state" value="add" v-model="PState" />
          Добавить
        </label>
        <label class="cursor-pointer">
          <input type="radio" name="state" value="edit" v-model="PState" />
          Изменить
        </label>
        <label class="cursor-pointer">
          <input type="radio" name="state" value="delete" v-model="PState" />
          Удалить
        </label>
      </fieldset>
      <p
        class="indent-5 text-balance text-justify text-[1.2rem] xl:text-[0.75rem]"
      >
        <small
          >Нажмите на сектор графика, который хотите удалить или изменить. После
          этого выберите режим.
        </small>
      </p>
      <fieldset class="p-2 flex flex-col items-start gap-10 mt-5">
        <input
          type="text"
          maxlength="25"
          placeholder="введите наименование"
          class="outline-none border p-1 w-full"
          v-model="PLabel"
        />
        <input
          type="number"
          v-model="PValue"
          class="outline-none border p-1 w-full"
        />
        <label class="flex flex-col items-start gap-2">
          Выберите цвет:
          <input type="color" v-model="PColor" class="cursor-pointer" />
        </label>
      </fieldset>
    </legend>
    <div class="mt-10 text-right">
      <button
        type="submit"
        class="cursor-pointer min-w-[100px] min-h-[40px] active:scale-90 bg-slate-500 text-slate-50 dark:text-indigo-950 font-semibold p-1 disabled:bg-slate-200 disabled:text-slate-400"
      >
        OK
      </button>
    </div>
  </form>
</template>
