declare type TNewsImagesItem = {
  image: string;
  thumbnails: {
    "640x384": string;
    "144x96": string;
  };
  source: {
    name: string;
    link: string;
  };
};

declare type TNewsImages = TNewsImagesItem[];

declare type TNewsItem = {
  id: number;
  publication_date: number;
  slug: string;
  title: string;
  description: string;
  body_text: string;
  images: TNewsImages;
};

declare type TNewsData = {
  count: number;
  next?: string | null;
  previos?: string | null;
  results: TNewsItem[];
};

declare type TGetParamsObject = { [index: string]: string | number };

export type TMyLocale = "ru" | "en" | null;

//Событие дня интерафейсы
export interface IEventOfDayRoot {
  count: number;
  next: string | null;
  previos: string | null;
  results: IEventOfDay[];
}

export interface IEventOfDay {
  date: string;
  location: string;
  object: IEventObject;
  title: string;
}
export interface IEventObject {
  id: number;
  slug: string;
  title: string;
  favorites_count: number;
  comments_count: number;
  description: string;
  body_text: string;
  item_url: string;
  disable_comments: boolean;
  ctype: string;
  place: IPlace;
  daterange: IDaterange;
  first_image: IFirstImage;
  age_restriction: string;
}

export interface IPlace {
  id: number;
}

export interface IDaterange {
  start_date: string | null;
  start_time: string;
  start: number;
  end_date: string | null;
  end_time: string | null;
  end: number;
  is_continuous: boolean;
  is_endless: boolean;
  is_startless: boolean;
  schedules: any[];
  use_place_schedule: boolean;
}

export interface IFirstImage {
  image: string;
  thumbnails: IThumbnails;
  source: ISource;
}

export interface IThumbnails {
  "640x384": string;
  "144x96": string;
}

export interface ISource {
  name: string;
  link: string;
}

export type TEventOfDayObject = Pick<
  IEventObject,
  | "id"
  | "item_url"
  | "title"
  | "slug"
  | "place"
  | "body_text"
  | "description"
  | "age_restriction"
  | "first_image"
  | "ctype"
  | "daterange"
>;
export type TEventOfDay = Pick<IEventOfDay, "date" | "location" | "object">;

//-------------------------------
type TKeysOf<T> = {
  [K in keyof T]: K;
};

const myKeys: Array<keyof TKeysOf<IDaterange>> = Object.keys({}) as Array<
  keyof TKeysOf<IDaterange>
>;
