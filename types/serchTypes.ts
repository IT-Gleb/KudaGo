export interface ISearchRoot {
  count: number | null;
  next: string | null;
  previous: string | null;
  results: ISearchResult[] | null;
}

export interface ISearchResult {
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
  place: ISerchPlace | null;
  daterange: ISerchDaterange | null;
  first_image: ISearchFirstImage | null;
  age_restriction: number;
}

export interface ISerchPlace {
  id: number;
  title: string;
  slug: string;
  address: string;
  phone: string;
  is_stub: boolean;
  site_url: string;
  coords: ISearchCoords | null;
  subway: string;
  is_closed: boolean;
  location: string;
}

export interface ISearchCoords {
  lat: number;
  lon: number;
}

export interface ISerchDaterange {
  start_date: number;
  start_time: number;
  start: number;
  end_date: number;
  end_time: any;
  end: number;
  is_continuous: boolean;
  is_endless: boolean;
  is_startless: boolean;
  schedules: any[];
  use_place_schedule: boolean;
}

export interface ISearchFirstImage {
  image: string;
  thumbnails: ISearchThumbnails | null;
  source: ISearchSource | null;
}

export interface ISearchThumbnails {
  "640x384": string;
  "144x96": string;
}

export interface ISearchSource {
  name: string;
  link: string;
}
