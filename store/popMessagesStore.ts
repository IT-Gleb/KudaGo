import { nanoid } from "nanoid";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

const delayMsg: number = 4000;
export type TMessageStr = {
  id: string;
  msg: string;
  top: number;
  popId: string;
};

export const PopMessageStore = defineStore("popMessages", () => {
  const messages = ref<TMessageStr[]>([]);
  const timerRef = ref<NodeJS.Timeout | null>(null);
  const initialTop = ref<number>(500);
  const minHeight = 52;

  const queueSize = computed(() => messages.value.length);

  function SetInitialTop(param: number) {
    initialTop.value = param;
  }

  function ClearTimeOut() {
    if (timerRef.value !== null) {
      clearInterval(timerRef.value);
    }
    timerRef.value = null;
  }

  function DeleteFirst() {
    if (messages.value.length > 0) {
      messages.value.shift();
    }
    if (messages.value.length < 1) {
      ClearTimeOut();
    }
  }

  function CalculateTops() {
    const { length } = messages.value;
    if (length < 1) {
      return;
    }
    for (let indx: number = 0; indx < length; indx++) {
      messages.value[indx].top = initialTop.value - minHeight * (length - indx);
      messages.value[indx].popId = `pop${indx}`;
    }
    messages.value[length - 1].top = initialTop.value - minHeight;
  }

  function DeleteMsg(param: string) {
    if (messages.value.length > 0) {
      messages.value = messages.value.filter((item) => item.id !== param);
      CalculateTops();
    }
  }

  function PopPush(param: string) {
    let tmp: TMessageStr = {
      id: nanoid(),
      msg: param,
      popId: "",
      top: initialTop.value,
    };
    messages.value.push(tmp);
    CalculateTops();

    if (messages.value.length > 0 && timerRef.value === null) {
      timerRef.value = setInterval(() => {
        DeleteFirst();
      }, delayMsg);
    }
  }

  return {
    queueSize,
    messages,
    PopPush,
    DeleteMsg,
    SetInitialTop,
  };
});
