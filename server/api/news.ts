import { NewsUrl } from "~/utils/urls";

export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    try {
      const request = await fetch(NewsUrl, {
        headers: { "Content-Type": "application.json;utf-8" },
        signal: AbortSignal.timeout(3000),
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
