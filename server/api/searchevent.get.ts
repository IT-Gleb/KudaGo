import { ISearchRoot } from "~/types/serchTypes";

export default defineEventHandler(async (event) => {
  const searchUrl: string =
    "https://kudago.com/public-api/v1.4/search/?q=кофе&lang=ru&expand=place,dates&page_size=15&location=&ctype=event&is_free=&lat=&lon=&radius=&text_format=text";

  if (event.method !== "GET") {
    return {
      errorMsg: "Не верный метод получения данных",
      type: "NoGetMethod",
    };
  }
  try {
    const req = await $fetch<Blob, string>(searchUrl, {
      headers: { "Content-Type": "application/json;utf-8" },
      method: "GET",
      retry: 3,
      retryDelay: 500,
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });

    const data: ISearchRoot = JSON.parse(
      await (req as Blob).text()
    ) satisfies ISearchRoot;
    // const bdtext = JSON.parse(data.results[1].body_text);

    return data;
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      return { errorMsg: "Превышено время ожидания...", type: "AbortError" };
    } else {
      return { errorMsg: (err as Error).message, type: (err as Error).name };
    }
  }
});
