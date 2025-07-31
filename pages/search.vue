<script setup lang="ts">
import { useSearchData } from "../components/search/controller/SearchDataController";
import type {
  ISearchResult,
  TGrouppedSearchData,
  TSearchDataObject,
  TSearchEditObject,
} from "../types/serchTypes";
import { FormatDateFromNumber } from "../utils/functions";
import loaderComponent from "../components/loader/loaderComponent.vue";
import SearchCard from "../components/search/SearchCard.vue";

import SearchFilterComponent from "../components/search/SearchFilterComponent.vue";
import UpBtn from "../components/search/UpBtn.vue";
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useHead, useState } from "nuxt/app";
import MyErrorComponent from "~/components/ui/myError/MyErrorComponent.vue";

const { t } = useI18n();

const router = useRouter();

let paramSearch = ref<Partial<TSearchEditObject>>({});
try {
  paramSearch = useState<Partial<TSearchEditObject>>("searchTxt");
  // const strData: string = localStorage.getItem("TxtSearchObj") as string;
  // paramSearch.value = JSON.parse(strData);
} catch (err: unknown) {
  console.log((err as Error).message);
  const strData: string = localStorage.getItem("TxtSearchObj") as string;
  paramSearch.value = JSON.parse(strData);
}

const FilteredData = ref<TGrouppedSearchData>({
  count: 0,
  isGroupped: false,
  results: [],
});

const scrollTimer = ref<NodeJS.Timeout | null>(null);
const ActiveFilterItem = ref<string>("");

const paramSearchId = computed(() =>
  paramSearch.value && paramSearch.value.id !== 0
    ? `SerchData-${paramSearch.value.id}`
    : `SerchData-${randomIntegerFromMinMax(1, 100)}`
);

const isSearchParam = computed(
  () =>
    paramSearch.value &&
    paramSearch.value.searchTxt &&
    paramSearch.value.searchTxt.trim().length > 0
);

const handlerMain = () => {
  router.replace({ path: "/" });
};

// const currentPage = ref<number>(1);
let FilterState = useState("filterState", () => ActiveFilterItem.value);

const { status, searchdata, error, execute, clear } = useSearchData(
  paramSearchId,
  <Ref>paramSearch
);

const filtered_searchItems = computed(() => {
  if (searchdata.value) {
    return FilteredData.value.count !== null ? FilteredData.value.count : 0;
  } else {
    return 0;
  }
});

const noSearchData = computed(
  () =>
    !searchdata.value ||
    searchdata.value === undefined ||
    searchdata.value.results === null ||
    searchdata.value.count === null
);

const s_searchItems = computed(() => {
  if (searchdata.value) {
    return searchdata.value.count !== null ? searchdata.value.count : 0;
  } else {
    return 0;
  }
});

const ClearScrollTimer = () => {
  if (scrollTimer.value !== null) {
    clearTimeout(scrollTimer.value);
  }
  scrollTimer.value = null;
};

const handlerFilter = (paramKey: string, paramIndex: number) => {
  let tmp: ISearchResult[] = [];

  const isNoDate = paramKey === "unknow";
  ActiveFilterItem.value = "";
  if (noSearchData.value) {
    FilterState.value = "";
    return;
  }

  if (!noSearchData.value && searchdata.value && searchdata.value.count) {
    tmp = Array.from(
      //@ts-ignore
      searchdata.value?.results[
        //@ts-ignore
        isNoDate ? "unknow" : Number(paramKey)
      ] as unknown as ISearchResult[]
    );
    FilteredData.value.count = tmp.length;
    FilteredData.value.results = Object.assign(
      {},
      { [isNoDate ? "unknow" : Number(paramKey)]: tmp }
    );
    //@ts-ignore
    ActiveFilterItem.value = Object.keys(searchdata.value.results)[paramIndex];
    FilterState.value = ActiveFilterItem.value;
  }

  scrollTimer.value = setTimeout(() => {
    const element = document.getElementById(paramKey);
    if (element) {
      // console.log(element);
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
    ClearScrollTimer();
  }, 600);
};

const handlerCancelFilter = () => {
  ActiveFilterItem.value = "";
  if (searchdata.value && "isGroupped" in searchdata.value) {
    FilteredData.value = Object.assign(
      {},
      searchdata.value as TGrouppedSearchData
    );
  }
  FilterState.value = "";
};

watch(
  searchdata,
  () => {
    //    handlerCancelFilter();

    if (searchdata.value === undefined) {
      return;
    }

    let tmp = useState("filterState");
    let index: number = 0;

    if ((tmp.value as string).length > 1 && searchdata.value) {
      const objKeys = Object.keys(searchdata.value?.results as ISearchResult[]);
      const { length } = objKeys;

      for (let indx: number = 0; indx < length; indx++) {
        if (objKeys[indx] === tmp.value) {
          index = indx;
          break;
        }
      }
    }

    if (
      (tmp.value as string) === "" &&
      (searchdata.value?.count as number) > 0
    ) {
      // console.log("begin: ", tmp.value);
      FilterState.value = Object.keys(
        searchdata.value?.results as ISearchResult[]
      )[index] as string;
      // console.log("end: ", tmp.value);
    }

    handlerFilter(tmp.value as string, index);
  },
  { deep: true }
);

onMounted(() => {
  try {
    // paramSearch = useState<Partial<TSearchEditObject>>("searchTxt");
    const strData: string = localStorage.getItem("TxtSearchObj") as string;
    paramSearch.value = JSON.parse(strData);
  } catch (err: unknown) {
    console.log((err as Error).message);
  }

  useHead({
    title: "Поиск:[Kuda Go]",
    meta: [
      { name: "description", content: t("title") },
      { name: "author", content: t("author") },
    ],
  });
});

onUnmounted(() => {
  ClearScrollTimer();
});
</script>

<template>
  <NuxtErrorBoundary
    @error="
      () => {
        console.log('Error on seach page');
      }
    "
  >
    <section class="p-1 lg:w-[80%] mx-auto">
      <div class="flex flex-row items-center justify-between my-10">
        <button
          type="button"
          aria-label="На главную"
          class="min-w-[60px] min-h-[30px] p-2 place-content-center bg-slate-600 text-slate-100 active:scale-90 cursor-pointer"
          @click="handlerMain"
        >
          На главную
        </button>

        <div>
          Параметры поиска:
          <span v-if="paramSearch.searchTxt !== ''"
            ><mark>{{ paramSearch.searchTxt }}</mark></span
          >
        </div>
        <button
          type="button"
          aria-label="Обновить"
          class="min-w-[60px] min-h-[30px] p-1 bg-indigo-950 text-slate-300 active:scale-90 cursor-pointer rounded-md"
          @click="
            async () => {
              clear();
              await execute();
            }
          "
        >
          Обновить
        </button>
      </div>

      <div v-if="!isSearchParam" class="w-fit mx-auto my-10">
        <h4>Не введены параметры поиска</h4>
      </div>

      <div class="my-10">
        <div
          v-if="status === 'pending'"
          class="w-[34px] h-[34px] mx-auto text-orange-600 dark:text-slate-400"
        >
          <loader-component />
        </div>
        <div v-if="error !== null">{{ error }}</div>
      </div>
      <div
        v-if="
          status !== 'pending' &&
          status !== 'error' &&
          s_searchItems < 1 &&
          isSearchParam
        "
      >
        <h4>Нет Данных</h4>
      </div>

      <div
        v-if="
          (status === 'success' || status === 'idle') &&
          s_searchItems > 0 &&
          isSearchParam
        "
      >
        Найдено: {{ s_searchItems }} Отобрано: {{ filtered_searchItems }}

        <SearchFilterComponent
          :items="Object.keys(searchdata?.results as unknown as string[]) "
          :run-filter="handlerFilter"
          :cancel-filter="handlerCancelFilter"
          :disabled-button="searchdata?.count === FilteredData.count"
          :active-item="ActiveFilterItem"
        />

        <div class="my-10 font-light">
          <div
            v-for="([keyO, value]) in Object.entries(FilteredData.results as
          TSearchDataObject)"
            :key="keyO"
            :id="keyO"
            class="my-5 font-bold font-['Roboto'] p-1"
          >
            <h5
              class="text-orange-600 dark:text-slate-200 text-[1.8em]/[2.1em] lg:text-[1rem]/[1.2rem]"
            >
              {{
                (keyO as string) === "unknow"
                  ? "Дата начала не указана"
                  : FormatDateFromNumber(Number(keyO))
              }}{{
                FilteredData.count !== searchdata?.count
                  ? ` (${FilteredData.count})`
                  : ""
              }}
            </h5>
            <hr class="text-orange-700 dark:text-slate-500" />
            <div
              class="mx-2 mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <SearchCard
                v-for="itm in value"
                :key="itm.id"
                :item="itm"
                :date="keyO"
              />
            </div>
          </div>
        </div>
      </div>
      <UpBtn v-if="s_searchItems > 1" />
    </section>
    <template #error="{ error, clearError }">
      <MyErrorComponent :err-object="error" :err-fn="clearError" />
    </template>
  </NuxtErrorBoundary>
</template>
