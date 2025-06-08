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

export type TResourceString<T extends string> =
  T extends `name:${infer R} ${string}` ? R : never;
