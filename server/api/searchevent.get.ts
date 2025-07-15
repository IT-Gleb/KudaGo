import { ISearchRoot } from "~/types/serchTypes";

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

    return data;
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      return { errorMsg: "Превышено время ожидания...", type: "AbortError" };
    } else {
      return { errorMsg: (err as Error).message, type: (err as Error).name };
    }
  }
});
