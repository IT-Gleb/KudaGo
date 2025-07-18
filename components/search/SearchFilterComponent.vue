<script setup lang="ts">
import nextSvg from "../ui/svg/nextSvg.vue";

const props = defineProps<{
  items: string[];
  runFilter: (paramKey: string, paramIndex: number) => void;
  cancelFilter: () => void;
  disabledButton: boolean;
  activeItem: string;
}>();

const isOpen = ref<boolean>(false);

const handlerOpen = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <section class="my-10 lg:text-[0.7em]/[1em] bg-slate-100 dark:bg-slate-800">
    <details :open="isOpen">
      <summary
        class="bg-slate-300 p-2 flex gap-2 items-center justify-between cursor-pointer"
      >
        Отобрать по:
        {{
          props.activeItem === "unknow"
            ? "Без даты Начала"
            : props.activeItem !== ""
            ? FormatDateFromNumber(Number(props.activeItem))
            : ""
        }}
        <button
          type="button"
          aria-label="Раскрыть"
          class="w-[20px] h-[20px] cursor-pointer"
          @click="handlerOpen"
        >
          <next-svg
            class="transition-transform"
            :class="isOpen ? ' rotate-90' : 'rotate-0'"
          />
        </button>
      </summary>
      <div class="p-1 flex flex-wrap items-center justify-start gap-4 mt-3">
        <button
          type="button"
          v-for="(item, index) in props.items"
          :aria-label="`Фильтр по - ${item}`"
          :key="item"
          class="active:scale-90 min-w-[60px] min-h-[30px] p-2 place-content-center cursor-pointer focus:font-bold focus:bg-green-500 focus:text-indigo-800 rounded-md"
          :class="
            item === props.activeItem
              ? 'bg-green-500 text-indigo-800'
              : 'bg-slate-700 text-white'
          "
          @click="props.runFilter(item, index)"
        >
          {{
            item === "unknow"
              ? "Без даты Начала"
              : FormatDateFromNumber(Number(item))
          }}
        </button>
      </div>
      <div
        class="mt-4 text-right p-5 dark:bg-slate-900 border-t border-t-slate-800 dark:border-t-slate-400"
      >
        <button
          type="button"
          aria-label="Отменить"
          class="min-w-[60px] min-h-[30px] bg-indigo-950 dark:bg-slate-500 text-white dark:text-slate-100 cursor-pointer disabled:opacity-20 disabled:pointer-events-none active:scale-90 p-1 rounded-md"
          :disabled="props.disabledButton"
          @click="props.cancelFilter"
        >
          Отменить
        </button>
      </div>
    </details>
  </section>
</template>
