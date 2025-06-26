import { useAsyncData } from "#app";
import type { IFilmsRoot } from "~/types/filmTypes";

export const FilmsController = async (param: Ref<number>) => {
  //console.log(param.value);

  const {
    data: films,
    error,
    status,
    execute,
    refresh,
    clear,
  } = await useAsyncData(
    `films-${Math.floor(Math.random())}`,
    () =>
      $fetch<IFilmsRoot, string>("/api/films", {
        headers: { "Content-Type": "application/json;utf-8" },
        method: "GET",
        retry: 3,
        retryDelay: 500,
        cache: "force-cache",
        signal: AbortSignal.timeout(4000),
        params: {
          page: param.value,
        },
      }),

    {
      dedupe: "cancel",
      transform: (input) => {
        let tmp: Partial<IFilmsRoot> = {};
        if (input) {
          tmp = Object.assign({}, input as IFilmsRoot);
          //tmp.count = 5000;
          tmp.next = "jfdhfgkjfhjgkdjfk";
          tmp.previous = "jhdjshdj";
          if (tmp.results) {
            tmp.results.forEach(
              (item) =>
                (item.description = ExtractParagraphData(
                  item.description as string
                ))
            );
          }
        }
        return tmp as IFilmsRoot;
      },
      watch: [param],
    }
  );

  return { films, status, error, execute, refresh, clear };
};
