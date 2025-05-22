import type { IFilmsRoot, IFilmsResult } from "~/types/filmTypes";

export default defineEventHandler(async (event) => {
  const initUrl: string = "https://kudago.com/public-api/v1.4/movies/";
  if (event.method === "GET") {
    try {
      const req = await $fetch<IFilmsRoot, string>(initUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json;utf-8" },
        retry: 3,
        retryDelay: 300,
        signal: AbortSignal.timeout(4500),
        cache: "no-store",
        params: {
          page_size: 10,
          fields:
            "id,title,description,poster,country,year,budget,budget_currency,imdb_rating",
          expand: "poster,description",
        },
      });

      const data: IFilmsRoot = JSON.parse(
        await (req as unknown as Blob).text()
      ) as IFilmsRoot;

      const bb = data.results.sort((a, b) => {
        if (
          (a.imdb_rating as unknown as number) <=
            (b.imdb_rating as unknown as number) ||
          (a.year as unknown as number) - (b.year as unknown as number)
        ) {
          return 1;
        } else {
          return -1;
        }
      });

      return {
        count: data.count,
        next: data.next,
        previous: data.previous,
        results: bb,
      };
    } catch (err: unknown) {
      return (err as Error).message;
    }
  }

  return [];
});
