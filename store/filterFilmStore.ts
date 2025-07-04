import type { AsyncDataRequestStatus, NuxtError } from "#app";
import { defineStore } from "pinia";
import type { IFilmGenres, IFilmsResult, IFilmsRoot } from "~/types/filmTypes";

const delayTimer: number = 325;
const sortByGenres = (a: IFilmsResult, b: IFilmsResult) => {
  if (!a.genres || !b.genres) {
    return 0;
  }
  if (a.genres?.length > b.genres?.length) {
    return -1;
  } else {
    return 1;
  }
};
const sortByName = (a: IFilmGenres, b: IFilmGenres) => {
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  } else {
    return -1;
  }
};

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

  const setFilterParam = (param: string) => {
    filterParam.value = param;
  };

  function ClearData() {
    filtered.value.results = [];
    filterParam.value = "";
    tick.value = 0;
    clearInterval(timerRef.value);
    dataError.value = null;
  }

  async function getFiltered() {
    const { error, status, execute } = await useAsyncData(
      `filter-${filterParam.value}`,
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
            dataError.value = null;
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
              if (tick.value >= 98) {
                tick.value -= randomIntegerFromMinMax(12, 64);
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
          filtered.value.results.forEach((item) =>
            item.genres?.sort(sortByName)
          );
          filtered.value.results.sort(sortByGenres);
          if (!dataError.value && tick.value !== 100) {
            tick.value = 100;
          }
          // console.log(filtered.value.count, filtered.value.results.length);
        },
      }
    );
    return execute;
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
