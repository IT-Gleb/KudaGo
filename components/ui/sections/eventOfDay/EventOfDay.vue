<script setup lang="ts">
import type { TEventOfDayObject } from "~/types/myTypes";

const abortDelay: number = 4000;
const url = "/api/eventofday";

const headRef = ref<HTMLDivElement | null>();

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
    })
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
</script>

<template>
  <ClientOnly>
    <section class="min-h-screen w-[96%] lg:w-[80%] mx-auto p-1">
      <div ref="headRef" class="flex flex-row items-baseline justify-between">
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
          class="my-5 pb-3 border-b border-b-indigo-800 dark:border-b-slate-300"
        >
          <div class="my-2">
            {{ item.daterange.start_date }}
          </div>
          <h6 class="text-balance my-5">{{ item.title }}</h6>
          <div class="float-left object-cover overflow-hidden rounded-xl mr-2">
            <img
              :src="item.first_image.thumbnails['144x96']"
              alt=""
              loading="lazy"
              decoding="async"
              class="block w-full h-full"
            />
          </div>
          <p class="my-2 font-bold">{{ item.description }}</p>
          <p class="first-letter:uppercase indent-5 text-balance">
            {{ item.body_text }}
          </p>
          <div
            v-if="item.daterange.end_time !== null"
            class="text-right font-bold xl:text-[clamp(0.65vw,2vw,0.8vw)]"
          >
            {{ item.daterange.start_date }} - {{ item.daterange.end_date }}
          </div>
        </div>
      </div>
    </section>
  </ClientOnly>
</template>
