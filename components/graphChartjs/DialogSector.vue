<script setup lang="ts">
import { ref } from "vue";
import { Vue3ColorPicker } from "@cyhnkckali/vue3-color-picker";
import { PieStore } from "~/store/pieStore";
import { storeToRefs } from "pinia";
import type { TPieChartItem } from "./PieGraph.vue";
import { nanoid } from "nanoid";

export type TDialogMode = "none" | "add" | "edit";

const props = defineProps<{
  mode: TDialogMode;
  onClose: () => void;
}>();

const diagRef = ref<HTMLDialogElement>();

const Colour = ref<string>("#fa76c2");
const colourShow = ref<boolean>(false);
const Label = ref<string>("");
const nValue = ref<number>(20);
const dataErrors = ref<{ nameErr: string; valueErr: string }>({
  nameErr: "",
  valueErr: "",
});

const store = PieStore();
const { Item } = storeToRefs(store);
const { addItem, setItemInArray } = store;

const handleOnSave = () => {
  colourShow.value = false;
  //console.log(Colour.value);
};

const showDialog = () => {
  diagRef.value?.showModal();
};

defineExpose({ showDialog });

const handleShowColorDialog = () => {
  colourShow.value = !colourShow.value;
};

const checkForValues = (): boolean => {
  let res: boolean = true;
  if (Label.value.trim().length < 3) {
    dataErrors.value.nameErr = "Не введено наименование!";
    res = false;
  }
  if (nValue.value < 1) {
    dataErrors.value.valueErr = "Значение должно быть больше 0!";
    res = res && false;
  }

  return res;
};

const handleSubmit = () => {
  colourShow.value = false;
  let tmp: Partial<TPieChartItem> = {};

  if (!checkForValues()) {
    return;
  }

  switch (props.mode) {
    case "add": {
      tmp = {
        id: nanoid(),
        value: nValue.value,
        label: Label.value,
        bgColor: Colour.value,
      };
      addItem(tmp as TPieChartItem);
      break;
    }
    case "edit": {
      tmp = {
        label: Label.value,
        value: nValue.value,
        bgColor: Colour.value,
        id: Item.value.id,
      };
      setItemInArray(tmp as TPieChartItem);
      break;
    }
  }
  props.onClose();
  diagRef.value?.close();
};

const setDialogItems = () => {
  dataErrors.value.nameErr = "";
  dataErrors.value.valueErr = "";

  switch (props.mode) {
    case "add":
      Label.value = "";
      nValue.value = 20;
      Colour.value = "#fa76c2";
      break;
    case "edit":
      Label.value = Item.value.label;
      nValue.value = Item.value.value;
      Colour.value = Item.value.bgColor;
      break;
  }
};

watch(
  () => props.mode,
  () => {
    setDialogItems();
  },
  { deep: true }
);

watch(Label, () => {
  if (Label.value.trim().length > 3) {
    dataErrors.value.nameErr = "";
  }
});

watch(nValue, () => {
  if (nValue.value > 0) {
    dataErrors.value.valueErr = "";
  }
});
</script>

<template>
  <ClientOnly>
    <dialog
      ref="diagRef"
      class="max-[390px]:w-[98%] max-[639px]:w-[75%] sm:w-[390px] mx-auto bg-white rounded-2xl overflow-hidden p-5"
      :class="colourShow ? 'mt-[18%] md:mt-[3%]' : 'mt-[45%] md:mt-[12%]'"
      @close.prevent="() => props.onClose()"
    >
      <form
        method="dialog"
        class="flex flex-col"
        @submit.prevent="handleSubmit"
      >
        <div class="w-full flex items-center justify-between">
          <span class="head1 text-[#252F4A] font-[500] text-[20px]/[24px]">{{
            props.mode === "add" ? "Добавление сектора" : "Изменение сектора"
          }}</span>
          <button
            type="button"
            title="Закрыть"
            data-text="x"
            class="w-[18px] h-[18px] overflow-hidden place-content-center bg-[#1B84FF] text-white text-[18px]/[20px] font-sans cursor-pointer select-none active:scale-90 relative before:absolute before:content-[attr(data-text)] before:left-[55%] before:top-[55%] before:translate-[-65%]"
            @click="() => diagRef?.close()"
          ></button>
        </div>
        <fieldset class="flex flex-col items-start gap-y-5 mt-5">
          <div
            class="w-full h-[60px] rounded-[10px] border border-[#DBDFE9] px-[20px]"
          >
            <label for="nameSector" class="cursor-pointer">
              <span class="text-[12px] font-[400] font-['Inter'] pt-2"
                >Наименование</span
              >
              <input
                type="text"
                name="nameSector"
                id="nameSector"
                v-model="Label"
                maxlength="50"
                placeholder=""
                autocomplete="off"
                autofocus
                class="w-full h-[24px] mt-[5px] textFont text-[14px]/[24px] outline-none focus:border-b"
              />
            </label>
          </div>
          <span
            v-if="dataErrors.nameErr.length > 3"
            class="w-full p-1 bg-red-500 text-white place-content-center text-[14px]/[18px] font-['Inter'] font-[400]"
            >{{ dataErrors.nameErr }}</span
          >
          <div
            class="w-full h-[60px] rounded-[10px] border border-[#DBDFE9] px-[20px]"
          >
            <label for="namberValue" class="cursor-pointer">
              <span class="text-[12px] font-[400] font-['Inter'] pt-2"
                >Значение</span
              >
              <input
                type="number"
                name="namberValue"
                id="namberValue"
                min="0"
                max="100"
                v-model="nValue"
                class="w-full h-[24px] mt-[5px] textFont text-[16px]/[24px] outline-none focus:border-b"
              />
            </label>
          </div>
          <span
            v-if="dataErrors.valueErr.length > 3"
            class="w-full p-1 bg-red-500 text-white place-content-center text-[14px]/[18px] font-['Inter'] font-[400]"
            >{{ dataErrors.valueErr }}</span
          >
          <div
            class="w-full rounded-[10px] border border-[#DBDFE9] px-[20px] pt-[18px]"
            :class="colourShow ? 'h-fit' : 'h-[60px]'"
          >
            <label
              for="ColorValue"
              class="flex items-center justify-between w-full cursor-pointer"
            >
              <span
                v-if="!colourShow"
                class="text-[12px] font-[400] font-['Inter']"
                >Цвет</span
              >
              <Vue3ColorPicker
                id="ColorValue"
                name="ColorValue"
                v-if="colourShow"
                v-model="Colour"
                mode="solid"
                :show-color-list="true"
                :theme="'light'"
                input-type="RGB"
                type="HEX"
                :show-buttons="true"
                :show-input-menu="false"
                :show-picker-mode="true"
                :show-alpha="false"
                @on-save="handleOnSave"
                @on-cancel="() => (colourShow = false)"
              />
              <button
                v-if="!colourShow"
                type="button"
                class="w-[24px] h-[24px] cursor-pointer active:scale-90"
                :style="{ backgroundColor: `${Colour}` }"
                @click.prevent="handleShowColorDialog"
              ></button>
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          class="w-full mt-[20px] bg-[#1B84FF] p-[18px_36px_18px_36px] rounded-[10px] overflow-hidden text-white font-['Inter'] font-[400] text-[16px]/[24px] cursor-pointer active:scale-90"
        >
          {{ props.mode === "edit" ? "Изменить сектор" : "Добавить сектор" }}
        </button>
      </form>
    </dialog>
  </ClientOnly>
</template>

<style scoped>
::backdrop {
  inset: 0;
  /* background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.85),
    rgba(0, 0, 0, 0.65),
    rgba(0, 0, 0, .85)
  ); */

  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.85),
    rgba(0, 0, 0, 0.65),
    rgba(0, 0, 0, 0.85)
  );
  background-size: 300% 300%;
  animation: backAnimo 15s ease infinite;
}

.head1 {
  font-family: "Inter";
  font-weight: 500;
}
.textFont {
  font-family: "Inter";
  font-weight: 400;
}

@keyframes backAnimo {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
