import type {
  ISearchResult,
  ISearchRoot,
  Search_Root,
} from "~/types/serchTypes";
import type { Ref } from "vue";

export const useSearchData = (param: Ref<string>, paramPage: Ref<number>) => {
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
        if (input.results && input.results.length > 0) {
          let data = Object.assign({}, input);
          let tmp: ISearchResult[] = [];

          tmp = (data.results as ISearchResult[])
            .filter((item) => {
              if (item.daterange && item.daterange.start_date) {
                return CompareDateAndNow(item.daterange?.start_date);
              } else {
                return true;
              }
            })
            .sort((a, b) => {
              if (a.daterange?.start_date && b.daterange?.start_date) {
                if (a.daterange?.start_date > b.daterange?.start_date) {
                  return 1;
                } else {
                  return -1;
                }
              } else {
                return 1;
              }
            });

          tmp.forEach((item) => {
            if (item.description !== null) {
              let text: unknown = "";
              let objText: string = "";
              try {
                text = JSON.parse(item.description) as Search_Root;
              } catch (err) {
                objText = item.description;
              }

              if (
                typeof text === "object" &&
                text !== null &&
                "blocks" in text
              ) {
                const { blocks } = text as Search_Root;
                objText = blocks[0]["text"];
              }
              objText = ExtracTextFromLink(objText) as string;
              objText = ExtractParagraphData(objText) as string;
              item.description = objText;
            }
          });
          data.results = Array.from(tmp);
          return data;
        } else {
          return input;
        }
      },
    }
  );
  return { status, error, searchdata, execute };
};
