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

export type TSearchDataObject = Partial<
  Record<number | "unknow", ISearchResult[]>
>;

export type TGrouppedSearchData = {
  count: number;
  isGroupped: boolean;
  results: TSearchDataObject;
};

//----------------------------
export interface Search_Root {
  blocks: Search_Block[];
  entityMap: Search_EntityMap;
}

export interface Search_Block {
  key: string;
  text: string;
  type: string;
  depth: number;
  inlineStyleRanges: Search_InlineStyleRange[];
  entityRanges: Search_EntityRange[];
  data: Search_Data;
}

export interface Search_InlineStyleRange {
  offset: number;
  length: number;
  style: string;
}

export interface Search_EntityRange {
  offset: number;
  length: number;
  key: number;
}

export interface Search_Data {
  text?: string;
  slides?: Search_Slide[];
  caption?: string;
  image?: Search_Image2;
  url?: string;
  newTab?: boolean;
  sourceTitle?: string;
  sourceUrl?: string;
}

export interface Search_Slide {
  caption: string;
  sourceTitle?: string;
  image: Search_Image;
}

export interface Search_Image {
  filename: string;
  url: string;
}

export interface Search_Image2 {
  filename: string;
  url: string;
}

export interface Search_EntityMap {
  "0": Search_N0;
  "1": Search_N1;
  "2": Search_N2;
  "3": Search_N3;
  "4": Search_N4;
  "5": Search_N5;
}

export interface Search_N0 {
  type: string;
  mutability: string;
  data: Search_Data2;
}

export interface Search_Data2 {
  href: string;
  url: string;
}

export interface Search_N1 {
  type: string;
  mutability: string;
  data: Search_Data3;
}

export interface Search_Data3 {
  url: string;
  newTab: boolean;
  index: boolean;
  title: string;
  modalIsOpen: boolean;
  currentLinkEntityKey: string;
}

export interface Search_N2 {
  type: string;
  mutability: string;
  data: Search_Data4;
}

export interface Search_Data4 {
  url: string;
  newTab: boolean;
  index: boolean;
  title: string;
  modalIsOpen: boolean;
  currentLinkEntityKey: string;
}

export interface Search_N3 {
  type: string;
  mutability: string;
  data: Search_Data5;
}

export interface Search_Data5 {
  href: string;
  url: string;
}

export interface Search_N4 {
  type: string;
  mutability: string;
  data: Search_Data6;
}

export interface Search_Data6 {
  href: string;
  url: string;
}

export interface Search_N5 {
  type: string;
  mutability: string;
  data: Search_Data7;
}

export interface Search_Data7 {
  href: string;
  url: string;
  index: boolean;
  newTab: boolean;
  title: string;
  modalIsOpen: boolean;
  currentLinkEntityKey: string;
}
//-----------------------------------

export type TSearchEditObject = {
  id: number;
  searchTxt: string;
};
