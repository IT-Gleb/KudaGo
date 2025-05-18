<script setup lang="ts">
import type { TEventOfDayObject } from "~/types/myTypes";
import { FormatDateFromString, FormatNowDate } from "#imports";
import { vIntersectionObserver } from "@vueuse/components";
import { ref } from "vue";
// import { onErrorCaptured } from "vue";

const abortDelay: number = 4000;
const url = "/api/eventofday";

const headRef = ref<HTMLDivElement | null>();

const DateEvent = ref<string>(FormatNowDate());
const errorMessage = ref<{ isError: boolean; message: string }>({
  isError: false,
  message: "",
});

//console.log(DateEvent.value);

const {
  data: eventsDay,
  error,
  execute,
  clear,
  status,
} = await useAsyncData<TEventOfDayObject[]>(
  `event-${Math.random().toString()}`,
  () =>
    $fetch(url, {
      headers: { "Content-Type": "application/json;utf-8" },
      method: "GET",
      retry: 3,
      retryDelay: 1000,
      signal: AbortSignal.timeout(abortDelay),
    }),
  {
    dedupe: "cancel",
    transform: (input) => {
      let tmp: TEventOfDayObject[] = [];
      if (input) {
        tmp = Array.from(input);
        tmp.forEach((item) => {
          if (item.daterange === null) {
            item.daterange = {
              start_date: DateEvent.value,
              end_date: DateEvent.value,
              start_time: "",
              start: 0,
              end: 0,
              end_time: "",
              schedules: [],
              is_continuous: false,
              is_endless: false,
              is_startless: false,
              use_place_schedule: false,
            };
          }
        });
      }
      return tmp;
    },
  }
);

const handleReload = async () => {
  (headRef.value as HTMLElement).scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "center",
  });
  clear();
  await execute();
};

const isVisibled = shallowRef(false);

function onIntersectionObserve([entry]: IntersectionObserverEntry[]) {
  isVisibled.value = entry?.isIntersecting || false;
}

watch(isVisibled, () => {
  if (isVisibled.value) {
    useHead({
      title: `"Событие дня:${FormatDateFromString(DateEvent.value)}:[Kuda Go]`,
    });
  }
});

// onErrorCaptured((err: Error) => {
//   errorMessage.value.message = "Ошибка!  " + err.message;
//   errorMessage.value.isError = true;
//   return false;
// });
</script>

<template>
  <ClientOnly>
    <section class="min-h-screen w-[96%] lg:w-[80%] mx-auto p-1">
      <div
        ref="headRef"
        class="flex flex-row items-baseline justify-between"
        v-intersection-observer="[
          onIntersectionObserve,
          { root: headRef, threshold: [0.25, 1] },
        ]"
      >
        <h4 class="my-3">Событие дня</h4>
        <button
          type="button"
          @click="handleReload"
          class="bg-indigo-950 text-slate-200 dark:bg-slate-400 dark:text-indigo-950 p-1 place-content-center overflow-hidden rounded-md cursor-pointer active:scale-90 active:shadow-none shadow-none hover:shadow-[2px_6px_10px_rgba(0,0,0,0.55)] hover:dark:shadow-[2px_6px_10px_rgba(250,200,240,0.55)]"
        >
          <small>Обновить</small>
        </button>
      </div>
      <LoaderComponent
        v-if="status === 'pending' && error === null"
        class="w-[50px] h-[50px] mx-auto"
      />
      <div v-if="error !== null">{{ error }}</div>
      <div v-if="error === null && status !== 'pending'">
        <div
          v-for="item in eventsDay"
          :key="item.id"
          class="my-5 pb-3 border-b border-b-indigo-800 dark:border-b-slate-300 overflow-hidden"
        >
          <div class="my-2">
            {{ FormatDateFromString(item.daterange.start_date as string) }}
          </div>
          <h6 class="text-balance my-5">{{ item.title }}</h6>
          <div
            class="w-[300px] h-[177px] aspect-video xl:w-[560px] xl:h-[330px] float-left object-cover object-left-top overflow-hidden rounded-xl mb-4 sm:mb-0 mr-2"
          >
            <img
              :src="item.first_image.thumbnails['640x384']"
              alt=""
              loading="lazy"
              decoding="async"
              class="block w-full h-full"
            />
          </div>
          <p class="indent-4 my-2 font-bold">{{ item.description }}</p>
          <p class="first-letter:uppercase indent-5 text-balance">
            {{ item.body_text }}
          </p>
          <div
            v-if="item.daterange !== null && item.daterange.end_time !== null"
            class="text-right xl:text-[clamp(0.65vw,2vw,0.8vw)] flex flex-col gap-2"
          >
            <span>Начало мероприятия: </span>
            <span class="font-bold">{{
              FormatDateFromString(item.daterange.start_date as string)
            }}</span>
            <span> Окончание мероприятия: </span>
            <span class="font-bold">{{
              FormatDateFromString(item.daterange.end_date as string)
            }}</span>
          </div>
        </div>
      </div>
    </section>
  </ClientOnly>
</template>
