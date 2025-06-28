import type {
  IFilmsResult,
  IFilmsRoot,
  TFilmsResultKeys,
} from "~/types/filmTypes";
import { randomIntegerFromMinMax, Wait } from "~/utils/functions";

type TPromiseFilter = { data?: IFilmsRoot; errorMessage?: string };

const sortById = (a: IFilmsResult, b: IFilmsResult) => {
  if (a.id > b.id) {
    return 1;
  } else {
    return -1;
  }
};

// async function filterFetcher(paramUrl: URL | string, onResponse: () => void) {
//   const url = typeof paramUrl === "object" ? paramUrl.toString() : paramUrl;
//   try {
//     const req = await $fetch<IFilmsRoot, string>(url, {
//       method: "GET",
//       headers: { "Content-Type": "application/json;utf-8" },
//       retry: 3,
//       retryDelay: 500,
//       signal: AbortSignal.timeout(5000),
//       cache: "force-cache",
//       onResponse,
//     });
//     const data = JSON.parse(
//       await (req as unknown as Blob).text()
//     ) as IFilmsRoot;

//     return { data };
//   } catch (err) {
//     return { errorMessage: (err as Error).message };
//   }
// }

async function filterFetcher(paramUrl: URL | string) {
  const url = typeof paramUrl === "object" ? paramUrl.toString() : paramUrl;
  try {
    const req = await $fetch<IFilmsRoot, string>(url, {
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

    return { data };
  } catch (err) {
    return { errorMessage: (err as Error).message };
  }
}

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

  const tmpUrl = new URL(`http://localhost${event.path}`);

  const params: string[] = (
    tmpUrl.searchParams.get("filterParam") as string
  )?.split(",");

  let initUrl: string = `https://kudago.com/public-api/v1.4/movies/?lang=ru&page=${randomIntegerFromMinMax(
    1,
    55
  )}&page_size=100&fields=${typeKeys.join(",")}&text_format=text`;

  //Цикл
  let indx: number = 0;
  let maxCount: number = Math.floor(5000 / 100);
  let MainData: TPromiseFilter = {
    data: { count: 0, next: "", previous: "", results: [] },
  };

  // const abc = () => {
  //   let percent = Math.floor(((indx - 1) * 100) / maxCount);
  //   if (percent > 100) {
  //     percent = 100;
  //   }
  //   console.log(percent, "%");
  //   return percent;
  // };

  while (indx <= maxCount) {
    let data: TPromiseFilter = Object.assign({}, MainData);
    indx++;
    initUrl = `https://kudago.com/public-api/v1.4/movies/?lang=ru&page=${indx}&page_size=100&fields=${typeKeys.join(
      ","
    )}&text_format=text`;

    //    data = await filterFetcher(initUrl, abc);
    data = await filterFetcher(initUrl);
    //Ошибка
    if ("errorMessage" in data) {
      break;
    }

    if (!("errorMessage" in data)) {
      (MainData.data as IFilmsRoot).count = data.data?.count as number;
      (MainData.data as IFilmsRoot).next = data.data?.next as string;
      (MainData.data as IFilmsRoot).previous = data.data?.previous as string;
      maxCount = Math.floor((MainData.data as IFilmsRoot).count / 100);

      const filters = (data.data as IFilmsRoot).results.filter(
        (item) =>
          item.genres &&
          item.genres.length > 0 &&
          item.genres?.every((itm) => params.includes(itm.slug))
      );
      if ((MainData.data as IFilmsRoot).results.length < 1) {
        (MainData.data as IFilmsRoot).results = Array.from(filters);
      } else {
        filters.forEach((item) => {
          let founded = (MainData.data as IFilmsRoot).results.find(
            (finded) => finded.id === item.id
          );
          if (typeof founded === "undefined") {
            (MainData.data as IFilmsRoot).results.push(item);
          }
        });
      }
    }
    //console.log(MainData.data?.results.length);
    await Wait(100);
  }
  //--Цикл--

  //Сортировка
  (MainData.data as IFilmsRoot).results.sort(sortById);
  //console.log(MainData.data?.results.length);
  return MainData.data;
});
