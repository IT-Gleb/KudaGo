import type {
  ISearchResult,
  ISearchRoot,
  Search_Root,
} from "~/types/serchTypes";
import {
  CompareDateAndNow,
  ExtracTextFromLink,
  ExtractParagraphData,
} from "~/utils/functions";

export default defineEventHandler(async (event) => {
  const shablonUrl: string =
    "https://kudago.com/public-api/v1.4/search/?q=&lang=&expand=place,dates&page=1&page_size=100&location=&ctype=event&is_free=&lat=&lon=&radius=&text_format=text";

  if (event.method !== "GET") {
    return {
      errorMsg: "Не верный метод получения данных",
      type: "NoGetMethod",
    };
  }
  const _searchUrl = new URL(`http://localhost${event.path}`);
  const query = _searchUrl.searchParams.get("query") ?? "выставки";
  const page = _searchUrl.searchParams.get("page") ?? "1";

  // console.log(query);
  const searchUrl = new URL(shablonUrl);
  searchUrl.searchParams.set("q", query.trim());
  searchUrl.searchParams.set("page", page.trim());

  try {
    const req = await $fetch<Blob, string>(searchUrl.toString(), {
      headers: { "Content-Type": "application/json;utf-8" },
      method: "GET",
      retry: 3,
      retryDelay: 500,
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    const data: ISearchRoot = JSON.parse(
      await (req as Blob).text()
    ) satisfies ISearchRoot;
    // const bdtext = JSON.parse(data.results[0].body_text);
    // return bdtext;
    let tmp: ISearchResult[] = [];

    //Отфильтровать по дате равной или больше текущей
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
    //Удалить ссылки в тексте
    tmp.forEach((item) => {
      if (item.description !== null) {
        let text: unknown = "";
        let objText: string = "";
        try {
          text = JSON.parse(item.description) as Search_Root;
        } catch (err) {
          objText = item.description;
        }

        if (typeof text === "object" && text !== null && "blocks" in text) {
          const { blocks } = text as Search_Root;
          objText = blocks[0]["text"];
        }
        objText = ExtracTextFromLink(objText) as string;
        objText = ExtractParagraphData(objText) as string;
        item.description = objText;
      }
    });
    data.results = Array.from(tmp);
    data.count = tmp.length;

    return data;
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      return { errorMsg: "Превышено время ожидания...", type: "AbortError" };
    } else {
      return { errorMsg: (err as Error).message, type: (err as Error).name };
    }
  }
});
