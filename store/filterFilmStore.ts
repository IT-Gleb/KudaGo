import type { AsyncDataRequestStatus, NuxtError } from "#app";
import { defineStore } from "pinia";
import type { IFilmsRoot } from "~/types/filmTypes";

const delayTimer: number = 325;

export const FilterStore = defineStore("filterFilms", () => {
  const filtered = ref<IFilmsRoot>({
    count: 0,
    next: "",
    previous: "",
    results: [],
  });
  const filterParam = ref<string>("cartoons");
  const hasFilteredData = computed(() => filtered.value.results.length > 0);
  const Size = computed(() => filtered.value.results.length);
  const dataStatus = ref<AsyncDataRequestStatus>();
  const dataError = ref<NuxtError<unknown> | null>(null);
  const tick = ref<number>(0);
  const timerRef = ref<NodeJS.Timeout>();

  const setFilterParam = async (param: string) => {
    filterParam.value = param;
    if (filterParam.value.length > 0) {
      await getFiltered();
    } else {
      filtered.value = { count: 0, next: "", previous: "", results: [] };
    }
  };

  function ClearData() {
    filtered.value.results = [];
    filterParam.value = "";
    tick.value = 0;
    clearInterval(timerRef.value);
  }

  async function getFiltered() {
    const { error, status } = await useAsyncData(
      `filter-${filterParam}`,
      () =>
        $fetch<IFilmsRoot, string>("/api/filmsfilter", {
          headers: { "Content-Type": "application/json;utf-8" },
          method: "GET",
          retry: 3,
          retryDelay: 100,
          params: {
            filterParam: filterParam.value,
          },
          onResponse: () => {
            dataStatus.value = "success";
            clearInterval(timerRef.value);
            //console.log("response: ", dataStatus.value);
          },
          onResponseError: () => {
            dataStatus.value = status.value;
            dataError.value = error.value;
            clearInterval(timerRef.value);
          },
          onRequest: () => {
            dataStatus.value = status.value;
            tick.value = 0;
            timerRef.value = setInterval(() => {
              tick.value += randomIntegerFromMinMax(1, 4);
              if (tick.value > 98) {
                tick.value -= randomIntegerFromMinMax(12, 48);
              }
              //   console.log(tick.value);
            }, delayTimer);
            // console.log("request: ", dataStatus.value);
          },
          onRequestError: () => {
            dataStatus.value = status.value;
            dataError.value = error.value;
            clearInterval(timerRef.value);
          },
        }),
      {
        dedupe: "cancel",
        transform: (input) => {
          filtered.value = Object.assign({}, input);
          filtered.value.count = filtered.value.results.length;
          if (!dataError.value && tick.value !== 100) {
            tick.value = 100;
          }
          // console.log(filtered.value.count, filtered.value.results.length);
        },
      }
    );
  }

  return {
    filtered,
    hasFilteredData,
    dataStatus,
    dataError,
    tick,
    Size,
    getFiltered,
    setFilterParam,
    ClearData,
  };
});
