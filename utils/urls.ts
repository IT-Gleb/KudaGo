//Urls для новостей
export let countOnPage: number = 15;
export let NewsUrl: string = `https://kudago.com/public-api/v1.4/news/?lang=ru&page=1&page_size=${countOnPage}&fields=id,title,slug,publication_date,description,body_text,images&expand=images,place&order_by=&text_format=text&ids=&location=&actual_only=true`;

export function setCountOnPage(param: number) {
  if (param > 0 && param < 101) {
    countOnPage = param;
  }
}
