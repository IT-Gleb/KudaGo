import { countOnPage, NewsUrl } from "~/utils/urls";
const newPage: string = "page";
const location_str: string = "location";
const onPage: string = "totalOnPage";

export default defineEventHandler(async (event) => {
  const paramUrl = new URL(`http://localhost${event.path}`);
  const Page = paramUrl.searchParams.get(newPage) ?? "1";
  let City = paramUrl.searchParams.get("city") ?? "";
  City = City === "*" ? "" : City;

  const NewsOnPage = paramUrl.searchParams.get(onPage) ?? countOnPage;

  let news_Url: string = "https://kudago.com/public-api/v1.4/news/?location=";

  switch (City) {
    case "":
      news_Url = NewsUrl;
      break;
    default:
      news_Url = `https://kudago.com/public-api/v1.4/news/?lang=ru&location=&page_size=${NewsOnPage}&fields=id,title,slug,publication_date,description,body_text,images&expand=images,place&order_by=&text_format=text&ids=&actual_only=true`;
      break;
  }

  const url = new URL(news_Url);
  City === ""
    ? url.searchParams.set(newPage, Page)
    : url.searchParams.set(location_str, City);
  url.searchParams.set("page_size", `${NewsOnPage}`);
  //console.log(url.search);

  //console.log(City, " ", url.search);

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
