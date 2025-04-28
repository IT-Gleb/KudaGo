import { nanoid } from "nanoid";

export type TCity = {
  id: string | number;
  slug: string;
  name: string;
};

export type TCityData = TCity[];

export const cityes: TCityData = [
  { id: nanoid(10), slug: "*", name: "*" },
  {
    id: nanoid(10),
    slug: "spb",
    name: "Санкт-Петербург",
  },
  {
    id: nanoid(10),
    slug: "msk",
    name: "Москва",
  },
  {
    id: nanoid(10),
    slug: "nsk",
    name: "Новосибирск",
  },
  {
    id: nanoid(10),
    slug: "ekb",
    name: "Екатеринбург",
  },
  {
    id: nanoid(10),
    slug: "nnv",
    name: "Нижний Новгород",
  },
  {
    id: nanoid(10),
    slug: "kzn",
    name: "Казань",
  },
  {
    id: nanoid(10),
    slug: "vbg",
    name: "Выборг",
  },
  {
    id: nanoid(10),
    slug: "smr",
    name: "Самара",
  },
  {
    id: nanoid(10),
    slug: "krd",
    name: "Краснодар",
  },
  {
    id: nanoid(10),
    slug: "sochi",
    name: "Сочи",
  },
  {
    id: nanoid(10),
    slug: "ufa",
    name: "Уфа",
  },
  {
    id: nanoid(10),
    slug: "krasnoyarsk",
    name: "Красноярск",
  },
  {
    id: nanoid(10),
    slug: "new-york",
    name: "Нью-Йорк",
  },
];

// spb - Санкт-Петербург
// msk - Москва
// nsk - Новосибирск
// ekb - Екатеринбург
// nnv - Нижний Новгород
// kzn - Казань
// vbg - Выборг
// smr - Самара
// krd - Краснодар
// sochi - Сочи
// ufa - Уфа
// krasnoyarsk - Красноярск
// kev - Киев
// new-york - Нью-Йорк
