import { NewsUrl } from "~/utils/urls";
const newPage: string = "page";

export default defineEventHandler(async (event) => {
  const Page =
    new URL(`http://localhost${event.path}`).searchParams.get(newPage) ?? "1";
  const url = new URL(NewsUrl);
  url.searchParams.set(newPage, Page);
  if (event.method === "GET") {
    try {
      const request = await fetch(url, {
        headers: { "Content-Type": "application.json;utf-8" },
        signal: AbortSignal.timeout(5000),
      });
      const data = await request.json();
      return data;
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        return {
          message: "Превышено время обработки запроса!",
          type: (err as Error).name,
        };
      }
      return {
        message: (err as Error).message,
        type: (err as Error).name,
      };
    }
  }

  return [{ text: "Не правильный метод получения данных!" }];
});
