<script setup lang="ts">
import {
  FilmsGenres,
  type TFilmSlugsData,
  type TFilmsSlug,
} from "~/types/filmTypes";
const isShowFilter = ref<boolean>(false);
const FilterPo = ref<TFilmSlugsData>([]);
const FilterFrom = ref<TFilmSlugsData>(FilmsGenres);
const paramFiltrStr = ref<string>("");

const sortByRuSlug = (a: TFilmsSlug, b: TFilmsSlug) => {
  if (a.ru_slug.toLowerCase() > b.ru_slug.toLowerCase()) {
    return 1;
  } else {
    return -1;
  }
};

const handleFrom = (param: number, isReverce: boolean) => {
  const found = isReverce
    ? FilterPo.value.find((item) => item.id === param)
    : FilterFrom.value.find((item) => item.id === param);
  if (!!found) {
    isReverce ? FilterFrom.value.push(found) : FilterPo.value.push(found);
    isReverce
      ? (FilterPo.value = FilterPo.value.filter((item) => item.id !== found.id))
      : (FilterFrom.value = FilterFrom.value.filter(
          (item) => item.id !== found.id
        ));
  }

  FilterFrom.value.sort(sortByRuSlug);
  FilterPo.value.sort(sortByRuSlug);
};

watch(
  FilterPo,
  () => {
    paramFiltrStr.value = "";
    if (FilterPo.value.length > 0) {
      paramFiltrStr.value = FilterPo.value.reduce((acc, curr) => {
        acc += curr.slug + ",";
        return acc;
      }, "");
    }
    paramFiltrStr.value = paramFiltrStr.value.slice(
      0,
      paramFiltrStr.value.length - 1
    );
    // console.log(paramFiltrStr.value);
  },
  { deep: true }
);

onMounted(() => {
  FilterFrom.value.sort(sortByRuSlug);
});
</script>

<template>
  <article :class="isShowFilter ? 'bg-slate-100 dark:bg-slate-800' : null">
    <label
      class="flex flex-row gap-x-3 select-none cursor-pointer"
      for="showFilter"
    >
      <span>Фильтр</span>
      <input
        type="checkbox"
        v-model="isShowFilter"
        name="showFilter"
        id="showFilter"
        class="cursor-pointer accent-slate-900 dark:accent-amber-900"
      />
    </label>

    <div
      v-if="isShowFilter"
      class="w-full flex flex-row justify-between items-start gap-5 text-[12px]/[14px] lg:text-[14px]/[18px]"
    >
      <label for="Filters" class="max-w-[45%] p-2">
        <span
          class="font-['Inter'] text-[clamp(2vw,3vw,3.5vw)]/[clamp(2.5vw,3.5vw,4vw)]"
          >Фильтровать по:</span
        >
        <div id="Filters" class="w-full mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            class="min-w-[60px] lg:min-w-[80px] min-h-[30px] lg:min-h-[40px] rounded-lg bg-green-300 dark:bg-slate-200 text-slate-700 active:scale-90 p-1 cursor-pointer whitespace-nowrap overflow-hidden"
            v-for="item in FilterPo"
            :key="item.id"
            @click="handleFrom(item.id, true)"
          >
            -{{ item.ru_slug }}
          </button>
        </div>
      </label>
      <div class="font-bold place-self-center">=><=</div>

      <label for="existsFilters" class="max-w-[45%] p-2">
        <span
          class="font-['Inter'] text-[clamp(2vw,3vw,3.5vw)]/[clamp(2.5vw,3.5vw,4vw)]"
          >Добавить фильтр:</span
        >
        <div
          id="existsFilters"
          class="w-full flex flex-wrap gap-2 mt-3 font-['Roboto']"
        >
          <button
            type="button"
            class="min-w-[60px] lg:min-w-[80px] min-h-[30px] lg:min-h-[40px] rounded-lg bg-rose-300 text-yellow-50 dark:bg-slate-600 dark:text-yellow-200 active:scale-90 p-1 cursor-pointer whitespace-nowrap overflow-hidden"
            v-for="item in FilterFrom"
            :key="item.id"
            @click="handleFrom(item.id, false)"
          >
            +{{ item.ru_slug }}
          </button>
        </div>
      </label>
    </div>
  </article>
</template>
