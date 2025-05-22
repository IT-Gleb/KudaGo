import { useAsyncData } from "#app";

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
    `films-${param.value}`,
    () =>
      $fetch("/api/films", {
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

    { dedupe: "cancel", lazy: true, watch: [param] }
  );

  return { films, status, error, execute, refresh, clear };
};
