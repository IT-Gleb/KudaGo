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
  return `${ZeroNumber(dt.getUTCDate())}-${ZeroNumber(
    dt.getUTCMonth() + 1
  )}-${dt.getUTCFullYear()} ${ZeroNumber(dt.getUTCHours())}:${ZeroNumber(
    dt.getUTCMinutes()
  )}`;
}

//Функция получает текст и разбивает на массив строк
export function TextToArray(param: string): string[] {
  const delimeter: string = ". ";
  if (param.length < 1) {
    return [];
  }

  // Удалить ненужные символы и строки
  const p1: string = "Ранее мы рассказывали";
  const p2: string = "Ранее мы писали";
  let txt: string = param.replaceAll("\n", delimeter);
  txt = DeleteFromStrWithRegExp(txt, p1);
  txt = DeleteFromStrWithRegExp(txt, p2);

  txt = txt.replaceAll("..", delimeter);
  txt = txt.replaceAll("...", delimeter);

  //--------------------------------------

  const arrStr = txt.split(delimeter);
  const anotherArray: string[] = [];
  for (let item of arrStr) {
    if (item[item.length - 1] !== delimeter) {
      item = item + delimeter;
    }
    if (item.trim() !== ".") {
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

  let regX = new RegExp(`${paramToDelete}*['а-я','А-Я','a-z','A-Z']`, "gui");
  let ar = regX.exec(txt);
  if (ar) {
    const text_toDel: string = ar.input.substring(ar.index, ar.input.length);
    txt = txt.replaceAll(text_toDel, "");
    //console.log(ar, ar.index, text_toDel);
  }

  //console.log(ar);
  return txt;
}
