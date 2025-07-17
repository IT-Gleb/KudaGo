<script setup lang="ts">
const props = defineProps<{
  items: string[];
  runFilter: (paramKey: string, paramIndex: number) => void;
  cancelFilter: () => void;
  disabledButton: boolean;
}>();
</script>

<template>
  <section class="my-10 lg:text-[0.7em]/[1em] bg-slate-100 dark:bg-slate-800">
    <div class="p-1 flex flex-wrap items-center justify-start gap-4">
      <button
        type="button"
        v-for="(item, index) in props.items"
        :aria-label="`Фильтр по - ${item}`"
        :key="item"
        class="active:scale-90 min-w-[60px] min-h-[30px] p-2 place-content-center cursor-pointer bg-slate-700 dark:bg-slate-500 text-white focus:font-bold focus:bg-green-500 focus:text-indigo-800 rounded-md"
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
  </section>
</template>
