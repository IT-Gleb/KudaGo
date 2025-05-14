import { type IEventOfDayRoot, TEventOfDayObject } from "~/types/myTypes";
import { convertToSmallData } from "~/utils/functions";

export default defineEventHandler(async (event) => {
  const url: string =
    "https://kudago.com/public-api/v1.4/events-of-the-day/?text_format=text&expand=object";
  if (event.method === "GET") {
    try {
      const req = await $fetch<unknown, string>(url, {
        headers: { "Content-Type": "application/json;utf-8" },
        method: "GET",
        signal: AbortSignal.timeout(5000),
        retry: 3,
        cache: "no-store",
      });
      //let myEventofDay: TEventOfDayObject = request.object;
      const obj: IEventOfDayRoot = JSON.parse(await (req as Blob).text());
      const obj1: TEventOfDayObject[] = convertToSmallData(obj);
      return obj1;
    } catch (err: unknown) {
      return { message: (err as Error).message + " Ошибка" };
    }
  }

  return { message: "Unknown method" };
});
