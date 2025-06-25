import type { IFilmsRoot, IFilmsResult } from "~/types/filmTypes";
import {
  ExtractParagraphData,
  randomIntegerFromMinMax,
} from "~/utils/functions";

export default defineEventHandler(async (event) => {
  let initUrl: string =
    "https://kudago.com/public-api/v1.4/movies/?page=1&page_size=10&fields=id,title,description,poster,budget,budget_currency,year,country,imdb_rating,director,stars,age_restriction,mpaa_rating";
  if (event.method === "GET") {
    const paramUrl = new URL(`http://localhost${event.path}`);

    //console.log(event.path);

    const myUrl = new URL(initUrl);
    myUrl.searchParams.set(
      "page",
      typeof paramUrl.searchParams.get("page") !== "undefined"
        ? randomIntegerFromMinMax(1, 500).toString()
        : "1"
    );

    try {
      const req = await $fetch<unknown, string>(myUrl.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json;utf-8" },
        signal: AbortSignal.timeout(4500),
        retry: 3,
        cache: "force-cache",
      });

      // if (req.ok) {
      // const data: IFilmsRoot = (await req.json()) as IFilmsRoot;
      const data: IFilmsRoot = JSON.parse(
        await (req as Blob).text()
      ) as IFilmsRoot;

      // const bb = data.results.sort((a, b) => {
      //   if (a.imdb_rating === null && b.imdb_rating === null) {
      //     if ((a.year as unknown as number) > (b.year as unknown as number)) {
      //       return 1;
      //     } else {
      //       return -1;
      //     }
      //   }
      //   if (
      //     (a.imdb_rating as unknown as number) <=
      //     (b.imdb_rating as unknown as number)
      //   ) {
      //     return 1;
      //   } else {
      //     return -1;
      //   }
      // });

      // bb.forEach(
      //   (item) =>
      //     (item.description = ExtractParagraphData(
      //       item.description as string
      //     ))
      // );

      return data;
      // return {
      //   count: data.count,
      //   next: data.next,
      //   previous: data.previous,
      //   results: data.results,
      // };
      // } else {
      //   throw createError({
      //     statusMessage: "Не могу получить данные",
      //     statusCode: 404,
      //   });
      // }
    } catch (err: unknown) {
      return (err as Error).message;
    }
  }

  return [];
});
