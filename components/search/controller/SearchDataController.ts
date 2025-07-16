import type {
  ISearchResult,
  ISearchRoot,
  Search_Root,
  TGrouppedSearchData,
} from "~/types/serchTypes";
import type { Ref } from "vue";

export const useSearchData = (param: Ref<string>, paramPage: Ref<number>) => {
  const {
    status,
    data: searchdata,
    error,
    execute,
  } = useAsyncData<ISearchRoot | TGrouppedSearchData>(
    `searchData-${randomIntegerFromMinMax(1, 100)}`,
    async () =>
      await $fetch<ISearchRoot, string>("/api/searchevent", {
        headers: { "Content-Type": "application/json;utf-8" },
        method: "GET",
        retry: 3,
        retryDelay: 500,
        signal: AbortSignal.timeout(5000),
        cache: "force-cache",
        params: {
          query: param.value,
          page: paramPage.value,
        },
      }),
    {
      dedupe: "cancel",
      lazy: true,
      watch: [param, paramPage],
      transform: (input) => {
        let data: TGrouppedSearchData = {
          count: 0,
          isGroupped: false,
          results: [],
        };
        if ((input as ISearchRoot).results) {
          //Сгруппировать по дате начала
          let tmp = Object.groupBy(
            (input as ISearchRoot).results as ISearchResult[],
            (item) =>
              item.daterange !== null && item.daterange?.start_date !== null
                ? item.daterange.start_date
                : "unknow"
          );

          //Рассчитать количество полученных данных
          let total: number = 0;
          for (const key of Object.values(tmp)) {
            if (key) {
              total += key?.length;
            }
          }

          data.count = total;
          data.isGroupped = true;
          data.results = tmp;

          return data;
        } else {
          return input;
        }
      },
    }
  );
  return { status, error, searchdata, execute };
};
