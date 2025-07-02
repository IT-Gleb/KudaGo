import { defineEventHandler } from "h3";

export default defineEventHandler((event) => {
  event.headers.set("X-Frame-Options", "DENY");
});
