import { nanoid } from "nanoid";
import { type TCityData, TCity } from "~/utils/cityes";

const locationURL: string =
  "https://kudago.com/public-api/v1.4/locations/?lang=ru";

type TPartialCityData = Partial<TCity>[];

export default defineEventHandler(async (event) => {
  if (event.method === "POST") {
    try {
      const response = await fetch(locationURL, {
        headers: { "Content-Type": "application/json;utf-8" },
        signal: AbortSignal.timeout(3200),
      });
      if (response.ok) {
        const data: TPartialCityData | null = await response.json();
        if (data) {
          data.forEach((item) => (item.id = nanoid()));
          data.unshift({ slug: "*", name: "*", id: nanoid() });
        } else {
          throw new Error("Ошибка при обработке данных");
        }
        return data as TCityData;
      } else {
        throw new Error("Ошибка получения данных!");
      }
    } catch (err) {
      console.log(err as Error);
      return err;
    }
  }

  return [];
});
