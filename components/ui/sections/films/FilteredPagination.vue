<script setup lang="ts">
import Arrow2 from "~/components/svg/Arrow2.vue";
import Arrow from "~/components/svg/Arrow.vue";
import { FilterStore } from "~/store/filterFilmStore";

const props = defineProps<{
  onPage: number;
  activePage: number;
  changePage: (param: number) => void;
}>();

const store = FilterStore();

const { Size } = storeToRefs(store);
const items = computed(() =>
  Array.from(
    { length: Math.ceil(Size.value / props.onPage) },
    (value, index) => index + 1
  )
);

const buttonsRef = ref<HTMLButtonElement[]>([]);

const Step: number = 192;
const WidthCorrect: number = 166;
const ButtonWidth: number = 38;

const mainX = ref<number>(0);
const Width = ref<number>(items.value.length * ButtonWidth);

const handleMinusStep = () => {
  mainX.value -= Step;
  if (Math.abs(mainX.value) >= Width.value - WidthCorrect) {
    mainX.value = -(Width.value - WidthCorrect);
  }
  //   console.log(mainX.value, Width.value - 164);
};

const handlePlusStep = () => {
  mainX.value += Step;
  if (mainX.value > 0) {
    mainX.value = 0;
  }
  //   console.log(mainX.value, Width.value - 164);
};

const handleBegin = () => {
  if (mainX.value !== 0) {
    mainX.value = 0;
  }
};

const handleEnd = () => {
  if (mainX.value !== Width.value - WidthCorrect) {
    mainX.value = -(Width.value - WidthCorrect);
  }
};

watch(
  items,
  () => {
    Width.value = items.value.length * ButtonWidth;
  },
  { deep: true }
);

watch(
  props,
  () => {
    //Перемемтить выделенную кнопку в область видимости
    const { activePage } = props;
    const { length } = items.value;
    //5-ть кнопок в зоне видимости
    if (length < 6) {
      mainX.value = 0;
      return;
    }
    let left = buttonsRef.value[activePage - 1].offsetLeft;
    if (activePage - 1 > 1 && activePage < length - 3) {
      mainX.value = -left + ButtonWidth * 2; //Сместить на 2 кнопки
    } else if (activePage - 1 > length - 4) {
      mainX.value = -(Width.value - 174);
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="w-fit mx-auto flex flex-row items-center gap-x-2">
    <button
      v-if="Size > 50"
      type="button"
      class="min-w-[30px] h-[32px] bg-indigo-500 text-green-200 rounded-md p-2 cursor-pointer active:scale-90"
      @click="handleBegin"
    >
      <Arrow />
    </button>
    <button
      v-if="Size > 50"
      type="button"
      class="min-w-[30px] h-[32px] bg-indigo-500 text-green-200 rounded-md p-2 cursor-pointer active:scale-90"
      @click="handlePlusStep"
    >
      <Arrow2 />
    </button>
    <div
      class="my-10 w-[186px] h-[32px] bg-slate-50 dark:bg-slate-950 text-slate-900 overflow-hidden relative"
    >
      <div
        class="flex flex-row items-center gap-2 absolute transition-all"
        :style="{ left: `${mainX}px` }"
      >
        <button
          type="button"
          v-for="item in items"
          ref="buttonsRef"
          :key="item"
          class="min-w-[30px] h-[30px] text-slate-200 rounded-md text-[0.85rem]/[1.1rem] cursor-pointer active:scale-90 font-['Roboto']"
          :class="
            props.activePage === item
              ? 'bg-green-500 text-slate-800 font-bold'
              : 'bg-indigo-900'
          "
          @click="props.changePage(item)"
        >
          {{ item }}
        </button>
      </div>
    </div>
    <button
      v-if="Size > 50"
      type="button"
      class="min-w-[30px] h-[32px] bg-indigo-500 text-green-200 rounded-md p-2 -scale-100 cursor-pointer active:-scale-90"
      @click="handleMinusStep"
    >
      <Arrow2 />
    </button>
    <button
      v-if="Size > 50"
      type="button"
      class="min-w-[30px] h-[32px] bg-indigo-500 text-green-200 rounded-md p-2 cursor-pointer -scale-100 active:-scale-90"
      @click="handleEnd"
    >
      <Arrow />
    </button>
  </div>
</template>
