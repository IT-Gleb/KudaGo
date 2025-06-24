import type { TResourceString } from "~/types/filmTypes";
import type {
  IEventOfDayRoot,
  TEventOfDayObject,
  TGetParamsObject,
} from "~/types/myTypes";

const delimeter: string = ". ";

export function getNowYear(): string {
  const dt = new Date();
  return `${dt.getUTCFullYear()}`;
}

export function ZeroNumber(param: number): string {
  return param < 10 ? `0${param}` : `${param}`;
}

export function FormatDateToString(param: number | string): string {
  let rc: number = 0;
  if (typeof param === "string") {
    param.length === 10 ? (rc = Number(`${param}245`)) : (rc = Number(param));
  }
  if (typeof param === "number") {
    rc = param;
  }
  const dt = new Date(rc);
  // return Intl.DateTimeFormat("ru-RU", {
  //   day: "2-digit",
  //   month: "2-digit",
  //   year: "numeric",
  //   hour: "2-digit",
  //   minute: "2-digit",
  // }).format(param);
  dt.setHours(dt.getUTCHours() + 3);
  return `${ZeroNumber(dt.getUTCDate())}-${ZeroNumber(
    dt.getUTCMonth() + 1
  )}-${dt.getUTCFullYear()} ${ZeroNumber(dt.getHours())}:${ZeroNumber(
    dt.getUTCMinutes()
  )}`;
}

export function FormatDateFromString(param: string | null) {
  let dataStr: string = param === null ? FormatNowDate() : param;
  // let dataStr: string = param as string;
  //Проверить param на шаблон даты
  const regX = new RegExp(`[0-9]{4,4}-[0-9]{2,2}-[0-9]{2,2}`, "giu");
  if (!regX.test(dataStr)) {
    return "Не верная дата передана - " + dataStr;
  }
  try {
    const dt = new Date(dataStr + "T00:00:00");
    return Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      day: "2-digit",
      month: "long",
    }).format(dt);
  } catch (err) {
    return (err as Error).message;
  }
}

export function FormatNowDate() {
  const dt = Date.now();

  let res = Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    day: "2-digit",
    month: "2-digit",
  }).format(dt);

  const reg = new RegExp("\\.|/", "gi");
  res = res.replaceAll(reg, "-");
  res = res.split("-").reverse().join("-");

  return res;
}

export function deleteNonUsedSymbols(param: string) {
  // Удалить ненужные символы и строки
  const p1: string = "Ранее мы рассказывали";
  const p2: string = "Ранее мы писали";
  const p3: string = "Ранее портал KUDAGO опубликовал";
  const p4: string = "Ранее порта рассказывал";

  let txt: string = "";
  txt = param.replaceAll("\n", delimeter);

  let reg = new RegExp(`(?<=(${p1})).*`, "gmi");
  txt = txt.replaceAll(reg, "");
  reg = new RegExp(`(?<=(${p2})).*`, "gmi");
  txt = txt.replaceAll(reg, "");
  reg = new RegExp(`(?<=(${p3})).*`, "gmi");
  txt = txt.replaceAll(reg, "");
  reg = new RegExp(`(?<=(${p4})).*`, "gmi");
  txt = txt.replaceAll(reg, "");
  txt = txt.replace(reg, "");
  txt = txt.replaceAll(p1, "");
  txt = txt.replaceAll(p2, "");
  txt = txt.replaceAll(p3, "");
  txt = txt.replaceAll(p4, "");

  txt = RegExpDomain(txt);
  txt = RegExpOnlyDomain(txt);

  // txt = DeleteFromStrWithRegExp(txt, p1);
  // txt = DeleteFromStrWithRegExp(txt, p2);
  // txt = DeleteFromStrWithRegExp(txt, p3);

  txt = txt.replaceAll("..", delimeter);
  txt = txt.replaceAll("...", delimeter);
  txt = txt.replaceAll(" . ", ".");
  txt = txt.replaceAll("..", ".");
  txt = txt.trim();
  if (txt[txt.length - 1] !== ".") {
    txt += ".";
  }

  //--------------------------------------
  return txt;
}

//Функция получает текст и разбивает на массив строк
export function TextToArray(param: string): string[] {
  if (param.length < 1) {
    return [];
  }

  let txt: string = param;

  const arrStr = txt.split(delimeter);
  const anotherArray: string[] = [];
  for (let item of arrStr) {
    if (item[item.length - 1] !== delimeter) {
      item = item + delimeter;
      anotherArray.push(item);
    }
  }

  return anotherArray;
}

//Функция получает массив строк и возвращает массив укрупненный до количества передающегося во 2-м параметре
export function ArrayGrowArray(
  param: string[],
  paramGrow: number = 3
): string[] {
  const res: string[] = [];
  if (param.length <= paramGrow) {
    return param;
  }
  let index: number = 0;
  let text: string = "";
  while (index < param.length) {
    text += param[index];
    if (index === paramGrow || index >= param.length) {
      res.push(text);
      text = "";
      param.splice(0, index);
      index = 0;
    }
    index++;
  }

  return res;
}

export function DeleteFromStrWithRegExp(param: string, paramToDelete: string) {
  let txt: string = param;
  //console.log(paramToDelete);

  let regX = new RegExp(`${paramToDelete}*['а-я','А-Я','a-z','A-Z']`, "gmui");
  txt = txt.replaceAll(regX, "");
  // let ar = regX.exec(txt);
  // if (ar) {
  //   const text_toDel: string = ar.input.substring(ar.index, ar.input.length);
  //   txt = txt.replaceAll(text_toDel, "");
  //   //console.log(ar, ar.index, text_toDel);
  // }

  //console.log(ar);
  return txt;
}

export function RegExpDomain(paramText: string) {
  //  let RegX = new RegExp("(?:www.|)([w.-]+).*", "gui");
  let Reg = new RegExp(`Фото: ([a-z-]{0,}).?([a-z]*).([a-z]{1,})`, "gmui");
  let txt: string = paramText;
  txt = txt.replaceAll(Reg, "");
  Reg = new RegExp(`пишет ([a-z-]{0,}).?([a-z]*).([a-z]{1,})`, "gmui");
  txt = txt.replaceAll(Reg, "");

  // const arr = Reg.exec(txt);
  // if (arr && arr.length > 0) {
  //   console.log(arr);
  //   if (arr[0].length > 0) {
  //     console.log(arr[0]);
  //     txt = txt.replaceAll(arr[0] as string, "");
  //   }
  // }
  return txt;
}

export function RegExpOnlyDomain(paramText: string) {
  //  let RegX = new RegExp("(?:www.|)([w.-]+).*", "gui");
  let Reg = new RegExp(`([a-z-]{0,}).?([a-z]*).([a-z]{1,})`, "gmui");
  let txt: string = paramText;
  txt = txt.replaceAll(Reg, "");
  return txt;
}

export function getParamsToObject(paramUrl: string): TGetParamsObject | null {
  //Проверить параметр на соответствие URL
  let RegObj = new RegExp(`(https?)://([a-z0-9\/\.-]+)`, "gmiu");
  if (paramUrl.match(RegObj)) {
    return paramUrl
      ?.split("&")
      .map((item1) => item1.split("?").map((itm) => itm.replaceAll("%2C", ",")))
      .flat(3)
      .reduce((acc: TGetParamsObject, curr: string) => {
        let tmp = curr.split("=");
        if (tmp.length === 2) {
          acc[tmp[0]] = tmp[1];
        } else {
          acc["url"] = tmp[0];
        }
        return acc;
      }, {});
  }
  //----------------------------------
  return null;
}

//Сбросить значения объекта
export function resetObj<T extends Object>(param: T): T {
  const res: T = Object.assign({}, param);
  for (let [key, value] of Object.entries(res)) {
    if (typeof value === "object" && Array.isArray(value)) {
      res[key as never] = [] as never;
    } else if (
      typeof value === "object" &&
      (value !== undefined || value !== null)
    ) {
      resetObj(value);
    } else if (typeof value === "string") {
      res[key as never] = "" as never;
    } else if (typeof value === "boolean") {
      res[key as never] = false as never;
    } else {
      if (typeof value === "number") {
        res[key as never] = 0 as never;
      }
    }
  }
  return res;
}

export function convertToSmallData(param: IEventOfDayRoot) {
  let tmpKeysObj: Array<keyof TEventOfDayObject> = [
    "id",
    "slug",
    "ctype",
    "item_url",
    "title",
    "age_restriction",
    "description",
    "body_text",
    "place",
    "first_image",
    "daterange",
  ];

  const data: TEventOfDayObject[] = [];

  for (let item of param.results) {
    let tmp: Partial<TEventOfDayObject> = {};
    const { object } = item;
    tmpKeysObj.forEach((fieldName) => {
      if (Object.keys(object).includes(fieldName)) {
        tmp[fieldName as never] = object[fieldName as never];
      }
    });
    if (tmp.body_text) {
      const reg = new RegExp(
        `([^\:\w"])([а-яА-Яё0-9,\!\?.-\s]+)([^,\"]+)([^a-z0-9,\"]+)([^a-zA-Z0-9\s=\.\&\/%;:-<>\",\W,\*]+)`,
        "gmiu"
      );
      let str = tmp.body_text.match(reg);
      if (str && str.length > 0) {
        let tmp3 = str?.join("");
        let reg1 = new RegExp(`(?<=(<div)).*`, "gmi");
        tmp3 = tmp3.replace(reg1, "");
        reg1 = new RegExp(`(?<=(<iframe)).*`, "gmi");
        tmp3 = tmp3.replace(reg1, "");

        tmp3 = tmp3.replace("<div", "");
        tmp3 = tmp3.replace("<iframe", "");
        tmp3 = tmp3.replace("}]}}]", "");
        tmp3 = tmp3.replaceAll("\\", "");
        tmp3 = tmp3.replaceAll(".,", ".");
        tmp3 = tmp3.replaceAll(". ,", ".");
        tmp3 = tmp3.replaceAll(".", ". ");
        tmp3 = tmp3.replaceAll("предоставлено организатором", "");
        tmp3 = tmp3.replaceAll("предоставлены организатором", "");

        //Убрать <strong><strong/>
        reg1 = new RegExp("<strong>.*?</strong>", "gmi");
        tmp3
          .matchAll(reg1)
          .forEach((item) => (tmp3 = tmp3.replace(item[0], "")));

        //Убрать <script и все после
        reg1 = new RegExp("<script.*script>", "gmi");
        tmp3
          .matchAll(reg1)
          .forEach((item) => (tmp3 = tmp3.replace(item[0], "")));

        //Вставить пробел с точкой перед заглавной буквой, если перед ней прописная буква
        reg1 = new RegExp(`([а-я)!?])([А-Я])`, "gm");
        tmp3.matchAll(reg1).forEach((item) => {
          if (item && item[0]) {
            let temp1 = item[0].split("");
            if (temp1.includes("?") || temp1.includes("!")) {
              temp1.splice(1, 0, " ");
            } else {
              temp1.splice(1, 0, ". ");
            }
            let temp2 = temp1.join("");
            tmp3 = tmp3.replace(item[0], temp2);
          }
        });

        tmp3 = tmp3.trim();
        if (tmp3[tmp3.length - 1] !== ".") {
          tmp3 += ".";
        }
        tmp.body_text = tmp3;
      }
    }
    //Убрать <p></p>
    if (tmp.description) {
      const reg = RegExp(`([^<p//>])*`, "gmiu");
      let str = tmp.description.match(reg);
      if (str && str.length > 0) {
        let tmpStr = str.join("");
        //console.log(tmpStr);
        tmp.description = tmpStr;
      }
    }
    data.push(tmp as TEventOfDayObject);
  }

  //console.log(tmpKeysObj);
  return data;
}

export function ExtractParagraphData(param: string): string {
  let txt: string = param;

  let reg1 = new RegExp("([<p/>])", "gm");
  txt.matchAll(reg1).forEach((item) => (txt = txt.replace(item[0], "")));

  return txt;
}

export function randomIntegerFromMinMax(
  paramMin: number,
  paramMax: number
): number {
  return Math.floor(paramMin + Math.random() * (paramMax + 1 - paramMin));
}

export function getName(param: string) {
  let format: TResourceString<`name:dd:mm:yyyy `> = "dd:mm:yyyy";
  let reg1 = new RegExp(`${format}`, "gmi");
  if (param.match(reg1) !== null) {
    let isValid = param.match(reg1)?.every((item) => item === format);
    if (isValid) {
      return param;
    }
    return "Error";
  }
  return "Error";
}
