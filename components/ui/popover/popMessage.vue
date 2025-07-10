<script setup lang="ts">
import { PopMessageStore } from "~/store/popMessagesStore";

export type TPopMsgStatus = "success" | "error";

const props = withDefaults(defineProps<{ status?: TPopMsgStatus }>(), {
  status: "success",
});

const refs = ref<Array<Ref<HTMLElement>>>([]);
const timerRef = ref<NodeJS.Timeout | null>(null);

const messagesStore = PopMessageStore();
const { messages } = storeToRefs(messagesStore);
const { DeleteMsg, SetInitialTop, SetMinHeightFromWindowWidth } = messagesStore;

const ClearThisTimeOut = () => {
  if (timerRef.value !== null) {
    clearTimeout(timerRef.value);
  }
  timerRef.value = null;
};

// const calculateHeight = (param: number) => {
//   let windowHeight = window.innerHeight;
//   let myHeight = 50;
//   // let myHeight = Number(
//   //   popRef.value!.getBoundingClientRect().height.toFixed(1)
//   // );
//   // console.log(myHeight);

//   popTop.value.unshift({
//     id: `pop${param}`,
//     top: windowHeight - myHeight * param - stepY,
//   });

//   // console.log(popTop.value);
// };

messagesStore.$subscribe(
  (mutation, state) => {
    //mutation.type может быть "direct" | "patch object" | "patch function"
    // if (mutation.type !== "direct") {
    //   return;
    // }
    // console.log(mutation, state);
    SetMinHeightFromWindowWidth(window.innerWidth);
    SetInitialTop(window.innerHeight);

    if (state.messages.length > 0) {
      //   // (refs.value[indx] as unknown as HTMLElement).showPopover();

      ClearThisTimeOut();
      timerRef.value = setTimeout(() => {
        for (let indx: number = 0; indx < messages.value.length; indx++) {
          (refs.value[indx] as unknown as HTMLElement).showPopover();
        }
      }, 400);
    }
  },
  {
    // flush: "pre",
    flush: "sync",
    deep: true,
  }
);

const handleClosePopover = (param: string) => {
  DeleteMsg(param);
};

onUnmounted(() => {
  ClearThisTimeOut();
});
</script>

<template>
  <div
    v-for="item in messages"
    ref="refs"
    :id="`#${item.popId}`"
    :key="item.id"
    popover="manual"
    class="w-[98%] md:w-[75%] max-h-[60px] left-1 transition-all overflow-hidden rounded-lg"
    :style="{
      top: `${item.top}px`,
    }"
  >
    <div
      class="flex items-center gap-2 justify-between text-[1rem]/[1.5rem] p-2"
      :class="
        props.status === 'success'
          ? 'bg-green-400 dark:bg-green-800 text-black dark:text-amber-100'
          : 'bg-red-500 text-white'
      "
    >
      <span class="font-['Roboto'] line-clamp-1">{{ item.msg }}</span>
      <button
        type="button"
        :popovertarget="`${item.popId}`"
        popovertargetaction="hide"
        class="px-2 min-w-[30px] min-h-[30px] cursor-pointer bg-slate-500 dark:bg-slate-900 text-white active:scale-90 ml-[5rem] rounded-md float-right"
        @click.prevent="() => handleClosePopover(item.id)"
      >
        <span aria-hidden="true">x</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
[popover] {
  @starting-style {
    opacity: 1;
  }

  &:popover-open {
    opacity: 1;
    animation: popoverUp 0.35s ease;
  }
  &:not(:popover-open) {
    transform: scale(0);
    transition: all 0.35s ease-out;
    animation: popverHide 0.5s ease-out;
  }
}

@keyframes popoverUp {
  0% {
    opacity: 0.5;
    /* top: 120%; */
    /* transform: scaleX(0.25); */
    transform: translateY(300%);
  }
  100% {
    opacity: 1;
    /* top: 90%; */
    /* transform: scaleX(1); */
    transform: translateY(0);
  }
}

@keyframes popoverHide {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
</style>
