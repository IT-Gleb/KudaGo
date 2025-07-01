export interface IFilmsRoot {
  count: number;
  next: string | null;
  previous: string | null;
  results: IFilmsResult[];
}

export interface IFilmsResult {
  id: number;
  title: string;
  description: string | null;
  country: string | null;
  year: number | null;
  budget: string | number | null;
  budget_currency: string | null;
  imdb_rating: number | null;
  mpaa_rating: string | null;
  age_restriction: string | null;
  poster: IFilmPoster;
  director: string | null;
  stars: string | null;
  genres: IFilmGenres[] | null;
}

export interface IFilmGenres {
  id: number;
  name: string;
  slug: string;
}

export interface IFilmPoster {
  image: string;
  thumbnails: {
    "640x384": string;
    "144x96": string;
  };
  source: {
    name: string;
    link: string;
  };
}

export type TFilmsResultKeys = Array<keyof IFilmsResult>;

export type TResourceString<T extends string> =
  T extends `name:${infer R} ${string}` ? R : never;

export type TFilmsSlug =
  | { id: 1; ru_slug: "Боевик"; slug: "action" }
  | { id: 2; ru_slug: "Мультфильмы"; slug: "cartoons" }
  | { id: 3; ru_slug: "Фэнтази"; slug: "fantasy" }
  | { id: 4; ru_slug: "Драма"; slug: "drama" }
  | { id: 5; ru_slug: "Фантастика"; slug: "sc-fi" }
  | { id: 6; ru_slug: "Приключения"; slug: "adventure" }
  | { id: 7; ru_slug: "Детские"; slug: "children" }
  | { id: 8; ru_slug: "Триллер"; slug: "thriller" }
  | { id: 9; ru_slug: "Комедия"; slug: "comedy" }
  | { id: 10; ru_slug: "Ужасы"; slug: "horror" }
  | { id: 11; ru_slug: "Мелодрама"; slug: "romance" }
  | { id: 12; ru_slug: "Биографические"; slug: "biographies" }
  | { id: 13; ru_slug: "Детектив"; slug: "crime" }
  | { id: 14; ru_slug: "Вестерн"; slug: "western" }
  | { id: 15; ru_slug: "Документальный"; slug: "documentary" }
  | { id: 16; ru_slug: "Исторический"; slug: "historical" }
  | { id: 17; ru_slug: "Фильм-катастрофа"; slug: "disaster-movie" }
  | { id: 18; ru_slug: "Мюзикл"; slug: "musical" };

export type TFilmSlugsData = Array<TFilmsSlug>;

export const FilmsGenres: TFilmSlugsData = [
  { id: 12, ru_slug: "Биографические", slug: "biographies" },
  { id: 1, ru_slug: "Боевик", slug: "action" },
  { id: 14, ru_slug: "Вестерн", slug: "western" },
  { id: 4, ru_slug: "Драма", slug: "drama" },
  { id: 13, ru_slug: "Детектив", slug: "crime" },
  { id: 7, ru_slug: "Детские", slug: "children" },
  { id: 9, ru_slug: "Комедия", slug: "comedy" },
  { id: 18, ru_slug: "Мюзикл", slug: "musical" },
  { id: 2, ru_slug: "Мультфильмы", slug: "cartoons" },
  { id: 5, ru_slug: "Фантастика", slug: "sc-fi" },
  { id: 6, ru_slug: "Приключения", slug: "adventure" },
  { id: 11, ru_slug: "Мелодрама", slug: "romance" },
  { id: 8, ru_slug: "Триллер", slug: "thriller" },
  { id: 10, ru_slug: "Ужасы", slug: "horror" },
  { id: 3, ru_slug: "Фэнтази", slug: "fantasy" },
  { id: 15, ru_slug: "Документальный", slug: "documentary" },
  { id: 16, ru_slug: "Исторический", slug: "historical" },
  { id: 17, ru_slug: "Фильм-катастрофа", slug: "disaster-movie" },
];
