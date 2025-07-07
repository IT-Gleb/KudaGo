<script async setup lang="ts">
import { FilterStore } from "~/store/filterFilmStore";
import {
  FilmsGenres,
  type TFilmSlugsData,
  type TFilmsSlug,
} from "~/types/filmTypes";
import ProgressBar, {
  type TProgressState,
} from "~/components/ProgressBar_svg/ProgressBar.vue";
import Arrow2 from "~/components/svg/Arrow2.vue";
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { FiltersHeader } from "../../../../utils/functions";

import popMessage from "../../popover/popMessage.vue";
import { PopMessageStore } from "~/store/popMessagesStore";

type TFilterState = "none" | "filtered";

const isShowFilter = ref<boolean>(false);
const FilterPo = ref<TFilmSlugsData>([]);
const FilterFrom = ref<TFilmSlugsData>(FilmsGenres);
const paramFiltrStr = ref<string>("cartoons");
const FilterState = ref<TFilterState>("none");

const popStringMsg = ref<string>("");

const showProgress = ref<boolean>(false);
const progresState = ref<TProgressState>("in-progress");

const store = FilterStore();

const { setFilterParam, ClearData, getFiltered } = store;
const { dataStatus, tick } = storeToRefs(store);

const popMsg = PopMessageStore();
const { PopPush } = popMsg;

const sortByRuSlug = (a: TFilmsSlug, b: TFilmsSlug) => {
  if (a.ru_slug.toLowerCase() > b.ru_slug.toLowerCase()) {
    return 1;
  } else {
    return -1;
  }
};

const goToFiltered = () => {
  const filteredArea = document.getElementById(FiltersHeader);
  // console.log(filteredArea);

  if (filteredArea) {
    (filteredArea as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
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

const clearFilterPo = () => {
  //Очистить FilterPro и перенести данные в FilterFrom
  if (FilterPo.value.length < 1) {
    return;
  }
  FilterPo.value.forEach((item) => {
    const found = FilterFrom.value.find((find) => find.id === item.id);
    if (typeof found === "undefined") {
      FilterFrom.value.push(item);
    }
  });
  FilterPo.value = [];
  FilterFrom.value.sort(sortByRuSlug);
  FilterState.value = "none";
};

const handleUpdate = async () => {
  //console.log(paramFiltrStr.value);
  if (FilterState.value === "none") {
    setFilterParam(paramFiltrStr.value);
    showProgress.value = true;
    progresState.value = "in-progress";
    (await getFiltered())();
    return;
  }
  if (FilterState.value === "filtered") {
    clearFilterPo();
    paramFiltrStr.value = "";
    ClearData();
    progresState.value = "success";

    popStringMsg.value = "  Фильтры очищены!...";
    PopPush(popStringMsg.value);
  }
};

watch(tick, async () => {
  showProgress.value = progresState.value === "in-progress" && tick.value < 100;
  if (tick.value >= 100) {
    progresState.value = "success";
    FilterState.value = "filtered";
    goToFiltered();

    popStringMsg.value = "  Фильтрование применено!...";
    PopPush(popStringMsg.value);

    //FilterState.value = "filtered";
  }
});

watch(isShowFilter, () => {
  if (!isShowFilter.value) {
    progresState.value = "success";
    showProgress.value = false;
    ClearData();
  }
});

watch(
  FilterPo,
  () => {
    paramFiltrStr.value = "";
    if (FilterPo.value.length > 0) {
      paramFiltrStr.value = FilterPo.value.reduce((acc, curr, index, array) => {
        if (index < array.length - 1) {
          acc += curr.slug + ",";
        } else {
          acc += curr.slug;
        }

        return acc;
      }, "");
    }

    FilterPo.value.length > 0
      ? (FilterState.value = "none")
      : (FilterState.value = "filtered");
    //    console.log(paramFiltrStr.value);
  },
  { deep: true }
);

watch(isShowFilter, () => {
  if (!isShowFilter.value) {
    FilterPo.value = [];
    FilterFrom.value = Array.from(FilmsGenres);
    FilterFrom.value.sort(sortByRuSlug);
  }
});

onMounted(() => {
  FilterFrom.value.sort(sortByRuSlug);
  ClearData();
});

onUnmounted(() => {
  ClearData();
});
</script>

<template>
  <popMessage />
  <article
    :class="
      isShowFilter ? 'bg-slate-100 dark:bg-slate-800 overflow-hidden' : null
    "
  >
    <label
      class="flex flex-row items-center gap-x-3 select-none cursor-pointer pb-2"
      :class="isShowFilter ? '' : 'border-b dark:border-b-slate-300'"
      for="showFilter"
    >
      <span class="uppercase">Фильтр</span>
      <input
        type="checkbox"
        v-model="isShowFilter"
        name="showFilter"
        id="showFilter"
        :disabled="showProgress"
        class="cursor-pointer accent-slate-900 dark:accent-amber-900 w-[18px] h-[18px] lg:w-[24px] lg:h-[24px] disabled:opacity-20 disabled:pointer-events-none"
      />
    </label>

    <div
      v-if="isShowFilter"
      class="w-full flex flex-col items-start gap-5 text-[12px]/[14px] lg:text-[14px]/[18px] Showing relative"
    >
      <div
        v-if="showProgress"
        class="absolute z-10 bg-[#FFFFFFaf] inset-0 place-content-center Showing"
      >
        <div class="w-fit mx-auto flex flex-col items-center gap-2">
          <ProgressBar
            :width="160"
            :value="tick"
            :state="progresState"
            :view="'dashboard'"
          />
          <span
            class="w-fit mx-auto font-bold dark:text-slate-900 animate-bounce"
            >{{ tick < 65 ? "Получаю данные..." : "Применяю фильтры..." }}</span
          >
        </div>
      </div>
      <label
        for="Filters"
        class="w-full p-2 border-b border-b-indigo-900 dark:border-b-slate-400"
      >
        <span
          class="font-['Roboto'] text-[clamp(2vw,3vw,3.5vw)]/[clamp(2.5vw,3.5vw,4vw)]"
          >Фильтровать по:</span
        >
        <div id="Filters" class="w-full mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            class="min-w-[60px] lg:min-w-[80px] min-h-[30px] lg:min-h-[40px] rounded-lg bg-green-300 dark:bg-slate-200 text-slate-700 active:scale-90 p-1 cursor-pointer whitespace-nowrap overflow-hidden disabled:opacity-20 disabled:pointer-events-none"
            v-for="item in FilterPo"
            :key="item.id"
            :disabled="dataStatus === 'pending'"
            @click="handleFrom(item.id, true)"
          >
            -{{ item.ru_slug }}
          </button>
        </div>
      </label>
      <div class="font-bold place-self-center">
        <div class="w-[40px] h-[40px] text-slate-400 rotate-90">
          <Arrow2 />
        </div>
        <div class="w-[40px] h-[40px] text-slate-400 -rotate-90">
          <Arrow2 />
        </div>
      </div>

      <label
        for="existsFilters"
        class="w-full p-2 border-t border-t-indigo-900 dark:border-t-slate-400"
      >
        <span
          class="font-['Roboto'] text-[clamp(2vw,3vw,3.5vw)]/[clamp(2.5vw,3.5vw,4vw)]"
          >Добавить фильтр:</span
        >
        <div
          id="existsFilters"
          class="w-full flex flex-wrap gap-2 mt-3 font-['Roboto']"
        >
          <button
            type="button"
            class="min-w-[60px] lg:min-w-[80px] min-h-[30px] lg:min-h-[40px] rounded-lg bg-indigo-800 text-yellow-50 dark:bg-slate-600 dark:text-yellow-200 active:scale-90 p-1 cursor-pointer whitespace-nowrap overflow-hidden disabled:opacity-20 disabled:pointer-events-none"
            v-for="item in FilterFrom"
            :key="item.id"
            :disabled="dataStatus === 'pending'"
            @click="handleFrom(item.id, false)"
          >
            +{{ item.ru_slug }}
          </button>
        </div>
      </label>
    </div>
    <div v-if="isShowFilter" class="text-right p-2">
      <button
        type="button"
        class="min-w-[60px] min-h-[30px] p-2 bg-slate-800 dark:bg-slate-400 text-slate-200 dark:text-slate-900 rounded-lg cursor-pointer active:scale-90 text-[16px]/[22px] disabled:opacity-15 disabled:pointer-events-none"
        @click.prevent="handleUpdate()"
        :disabled="dataStatus === 'pending' || FilterPo.length < 1"
      >
        {{
          FilterState === "none" && FilterPo.length > 0
            ? "Применить"
            : "Очистить"
        }}
      </button>
    </div>
  </article>
</template>

<style lang="css" scoped>
.Showing {
  animation: animoShow 300ms ease;
}

@keyframes animoShow {
  0% {
    opacity: 0;
    transform: scaleY(0);
  }
  50% {
    opacity: 0.25;
  }
  100% {
    opacity: 1;
    transform: scaleY(100%);
  }
}
</style>
