import type {
  ISearchResult,
  ISearchRoot,
  TGrouppedSearchData,
  TSearchEditObject,
} from "~/types/serchTypes";
import type { Ref } from "vue";

// , paramPage: Ref<number>

export const useSearchData = (
  paramId: Ref<string>,
  param: Ref<TSearchEditObject>
) => {
  const {
    status,
    data: searchdata,
    error,
    execute,
    clear,
  } = useAsyncData<ISearchRoot | TGrouppedSearchData | null>(
    paramId,
    async () => {
      if (param.value.searchTxt.length > SearchMinSymbolsLength) {
        return await $fetch<ISearchRoot, string>("/api/searchevent", {
          headers: { "Content-Type": "application/json;utf-8" },
          method: "GET",
          retry: 3,
          retryDelay: 500,
          signal: AbortSignal.timeout(20000),
          cache: "force-cache",
          params: {
            query: param.value.searchTxt,
            //page: paramPage.value,
          },
        });
      } else {
        return null;
      }
    },
    {
      dedupe: "cancel",
      lazy: false,
      immediate: true,
      watch: [param],
      transform: (input) => {
        let data: TGrouppedSearchData = {
          count: 0,
          isGroupped: false,
          results: [],
        };
        if (input === null || input === undefined) {
          return data;
        }
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
  return { status, error, searchdata, execute, clear };
};
