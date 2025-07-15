import type { ISearchResult, ISearchRoot } from "~/types/serchTypes";
import type { Ref } from "vue";

export const useSearchData = (param: Ref<string>) => {
  const {
    status,
    data: searchdata,
    error,
    execute,
  } = useAsyncData<ISearchRoot>(
    `searchData-${randomIntegerFromMinMax(1, 100)}`,
    async () =>
      await $fetch<ISearchRoot, string>("/api/searchevent", {
        headers: { "Content-Type": "application/json;utf-8" },
        method: "GET",
        retry: 3,
        retryDelay: 500,
        signal: AbortSignal.timeout(3000),
        cache: "force-cache",
        params: {
          query: param.value,
        },
      }),
    {
      dedupe: "cancel",
      lazy: true,
      watch: [param],
      transform: (input) => {
        if (input.results && input.results.length > 0) {
          let data = Object.assign({}, input);
          let tmp: ISearchResult[] = data.results as ISearchResult[];
          tmp.forEach((item) => {
            if (item.description !== null) {
              item.description = ExtracTextFromLink(item.description) as string;
              item.description = ExtractParagraphData(
                item.description
              ) as string;
            }
          });
          tmp.sort((a, b) => {
            if (a.daterange?.start_date && b.daterange?.start_date) {
              if (a.daterange?.start_date > b.daterange?.start_date) {
                return 1;
              } else {
                return -1;
              }
            } else {
              return 0;
            }
          });
          return data;
        } else {
          return input;
        }
      },
    }
  );
  return { status, error, searchdata, execute };
};
