import { cityes } from "~/utils/cityes";

export default defineEventHandler(async (event) => {
  if (event.method === "POST") {
    return cityes;
  }

  return [];
});
