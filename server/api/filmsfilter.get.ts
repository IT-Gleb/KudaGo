import type {
  IFilmGenres,
  IFilmsResult,
  IFilmsRoot,
  TFilmsResultKeys,
} from "~/types/filmTypes";
import { randomIntegerFromMinMax } from "~/utils/functions";

export default defineEventHandler(async (event) => {
  //   const initUrl: string =
  //     "https://kudago.com/public-api/v1.4/movies/?lang=ru&page=2&page_size=50&fields=id,title,genres,country,poster,slug&text_format=text";

  const typeKeys: TFilmsResultKeys = [
    "id",
    "title",
    "poster",
    "description",
    "country",
    "budget",
    "director",
    "stars",
    "budget_currency",
    "imdb_rating",
    "mpaa_rating",
    "genres",
  ];

  const initUrl: string = `https://kudago.com/public-api/v1.4/movies/?lang=ru&page=${randomIntegerFromMinMax(
    1,
    55
  )}&page_size=100&fields=${typeKeys.join(",")}&text_format=text`;
  const paramTags: string[] = ["cartoons", "adventure", "sc-fi"];

  try {
    const req = await $fetch<IFilmsRoot, string>(initUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json;utf-8" },
      retry: 3,
      retryDelay: 500,
      signal: AbortSignal.timeout(5000),
      cache: "force-cache",
    });
    const data = JSON.parse(
      await (req as unknown as Blob).text()
    ) as IFilmsRoot;
    const result = data.results.filter((item) =>
      // item.genres?.length === paramTags.length &&
      item.genres?.every((bb) => paramTags.includes(bb.slug))
    );

    data.results = Array.from(result);

    return { data };
  } catch (err) {
    return { errorMessage: (err as Error).message };
  }
});
