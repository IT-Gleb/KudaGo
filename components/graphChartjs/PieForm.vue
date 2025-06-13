<script setup lang="ts">
import { PieColors, PieStore } from "~/store/pieStore";
import type { TPieChartItem } from "./PieGraph.vue";
import { ref, type Ref } from "vue";
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

const LabelRef = ref<HTMLInputElement>();
const ValueRef = ref<HTMLInputElement>();

const store = PieStore();
const { addItem, setItem, deleteItem, setItemInArray } = store;
const { Item } = storeToRefs(store);
const FormError = ref<{ errorLabel: string; errorValue: string }>({
  errorLabel: "",
  errorValue: "",
});

const handleFocus = (paramRef: Ref) => {
  if (paramRef) {
    (paramRef.value as HTMLInputElement).focus();
  }
};

const handleSubmit = () => {
  let tmp: Partial<TPieChartItem> = {};
  if (PLabel.value.trim().length < 3) {
    FormError.value.errorLabel = "Не введено наименование!";
    handleFocus(LabelRef);
    return;
  }
  FormError.value.errorLabel = "";

  if (PValue.value < 1) {
    handleFocus(ValueRef);
    FormError.value.errorValue = "Не введено значение!";
    return;
  }
  FormError.value.errorValue = "";

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
      setItem(tmp as TPieChartItem);
      PState.value = "add";
      break;
  }

  PLabel.value = "";
  PColor.value = calculateColor();
  PValue.value = 0;
  handleFocus(LabelRef);
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

onMounted(() => {
  handleFocus(LabelRef);
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
        class="indent-5 text-balance text-justify text-[1.2rem] xl:text-[0.75rem] p-2 rounded-md bg-amber-100 border border-amber-200 dark:bg-amber-700 dark:text-slate-200 overflow-hidden"
      >
        <small
          >Нажмите на сектор графика, который хотите удалить или изменить. После
          этого выберите режим.
        </small>
      </p>
      <fieldset class="p-2 flex flex-col items-start gap-6 mt-5">
        <input
          ref="LabelRef"
          type="text"
          maxlength="25"
          placeholder="введите наименование"
          class="outline-none border p-1 w-full bg-slate-200 dark:bg-slate-700 focus:bg-transparent focus:border-2 focus:border-blue-800"
          v-model="PLabel"
        />
        <p
          v-if="FormError.errorLabel.length > 1"
          class="bg-red-600 text-white p-2 rounded-md overflow-hidden"
        >
          {{ FormError.errorLabel }}
        </p>
        <input
          ref="ValueRef"
          type="number"
          v-model="PValue"
          class="outline-none border p-1 w-full bg-slate-200 dark:bg-slate-700 focus:bg-transparent focus:border-2 focus:border-blue-800"
        />
        <p
          v-if="PValue < 1 && FormError.errorValue.trim().length > 5"
          class="bg-red-600 text-white p-2 rounded-md overflow-hidden"
        >
          {{ FormError.errorValue }}
        </p>

        <label class="flex flex-col items-start gap-2">
          Выберите цвет:
          <input
            type="color"
            v-model="PColor"
            list="pieBgcolors"
            class="cursor-pointer outline-none border focus:border-2 focus:border-blue-800"
          />
        </label>
        <datalist id="pieBgcolors" name="pieBgcolors">
          <option
            v-for="item in PieColors"
            :key="item.color"
            :value="item.color"
          >
            {{ item.color }}
          </option>
        </datalist>
      </fieldset>
    </legend>
    <div class="mt-10 text-right">
      <button
        type="submit"
        class="cursor-pointer min-w-[100px] min-h-[40px] active:scale-90 bg-indigo-900 dark:bg-slate-400 text-slate-50 dark:text-indigo-950 font-semibold p-1 disabled:bg-slate-200 disabled:text-slate-400"
      >
        OK
      </button>
    </div>
  </form>
</template>
