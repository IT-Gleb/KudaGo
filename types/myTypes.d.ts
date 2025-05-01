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
