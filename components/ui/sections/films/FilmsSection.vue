<script async setup lang="ts">
import type { IFilmsRoot } from "~/types/filmTypes";
import { FilmsController } from "./controllers/FilmsController";
import { randomIntegerFromMinMax } from "#imports";

import { ref } from "vue";
// import { getName } from "~/utils/functions";

type TPageParam = -1 | 0 | 1;

const paramPage = ref<number>(randomIntegerFromMinMax(1, 500));
const totalPage = ref<number>(500);

const filmsRef = ref<HTMLDivElement | null>(null);

const { status, films, error } = await FilmsController(paramPage);

const handleRefresh = async () => {
  checkPage(0);
  const total: number =
    !isNaN(totalPage.value) && totalPage.value > 1 ? totalPage.value : 1;
  paramPage.value = randomIntegerFromMinMax(1, total);
};

watch(paramPage, () => {
  paramPage.value = Math.min(
    ...[paramPage.value, Math.ceil((films.value as IFilmsRoot).count / 10)]
  );
  paramPage.value = Math.max(...[1, paramPage.value]);
});

const checkPage = (param: TPageParam) => {
  (filmsRef.value as HTMLElement).scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "start",
  });

  paramPage.value += param;
};

const handlerNext = async () => {
  checkPage(1);
};

const handlerPrev = async () => {
  checkPage(-1);
};

watch(films, () => {
  if (films.value) {
    totalPage.value = Math.ceil((films.value as IFilmsRoot).count / 10);
  } else {
    totalPage.value = 500;
  }
});
</script>

<template>
  <section class="w-[96%] xl:w-[80%] mx-auto min-h-screen p-1">
    <!-- <div class="w-fit mx-auto uppercase">
      {{ getName("jdh jdh name:dd:mm:yyyy jfh jfh gjhgj") }}
    </div> -->
    <div ref="filmsRef" class="p-1 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h4 class="my-5">Фильмы</h4>
        <span>[Страница - {{ paramPage }} из {{ totalPage }}]</span>
      </div>
      <button
        type="button"
        @click="handleRefresh"
        class="bg-indigo-950 -inset-4 xl:inset-0 text-slate-300 dark:bg-slate-300 dark:text-indigo-900 cursor-pointer active:scale-90 p-1 place-content-center overflow-hidden rounded-md"
      >
        <small>Обновить</small>
      </button>
    </div>

    <div
      v-if="status === 'pending' && !error"
      class="w-[50px] h-[50px] mx-auto mt-5"
    >
      <LoaderComponent />
    </div>
    <div
      v-if="status === 'success' && !error"
      class="flex flex-row items-center justify-center gap-4 mb-5"
    >
      <button
        v-if="(films as IFilmsRoot).previous"
        type="button"
        @click="handlerPrev"
        class="p-1 w-[40px] h-[40px] inset-10 -scale-100 place-content-center text-indigo-900 dark:text-slate-300 active:-scale-90 rounded-sm cursor-pointer"
      >
        <UiSvgNextSvg />
      </button>
      <span>Страница - {{ paramPage }}</span>
      <button
        v-if="(films as IFilmsRoot).next"
        type="button"
        @click="handlerNext"
        class="p-1 w-[40px] h-[40px] inset-10 place-content-center text-indigo-900 dark:text-slate-300 active:scale-90 rounded-sm cursor-pointer"
      >
        <UiSvgNextSvg />
      </button>
    </div>

    <div
      v-if="status !== 'pending' && (error === null || error === undefined)"
      class="w-fit mx-auto"
    >
      <article
        v-for="item in (films as IFilmsRoot).results"
        :key="item.id"
        class="w-[99%] lg:w-[80%] mx-auto grid grid-cols-[120px_1fr] sm:grid-cols-[220px_1fr] gap-2 odd:bg-slate-50 dark:odd:bg-slate-950"
      >
        <div
          class="w-[120px] h-[180px] sm:w-[200px] sm:h-[260px] overflow-hidden rounded-lg object-cover object-left-top row-span-2 mb-5"
        >
          <img
            :src="
              item.poster !== null && typeof item.poster.image !== undefined
                ? item.poster.image
                : ''
            "
            alt=""
            loading="lazy"
            getName
            decoding="async"
            class="block w-full h-full"
          />
        </div>
        <div>
          <p
            class="font-['Roboto'] font-bold text-[clamp(4vw,5vw,6vw)]/[clamp(4.2vw,5.5vw,6.5vw)] text-balance mb-5 md:hidden"
          >
            {{ item.title }}
          </p>

          <h5 class="hidden md:inline-block mb-5 text-balance">
            {{ item.title }}
          </h5>
          <div class="grid grid-cols-2 sm:grid-cols-[200px_1fr] gap-2">
            <div class="font-bold"><small>Рейтинг (IMDB):</small></div>
            <div>{{ item.imdb_rating ? item.imdb_rating : "нет" }}</div>
            <div class="font-bold"><small>Год выпуска:</small></div>
            <div>{{ item.year }}</div>
            <div class="font-bold"><small>Страна:</small></div>
            <div>{{ item.country }}</div>
            <div v-if="item.budget as number > 0" class="font-bold">
              <small>Бюджет фильма:</small>
            </div>
            <div v-if="item.budget as number > 0">
              {{
                Intl.NumberFormat("en-EN", {
                  style: "currency",
                  currency: "USD",
                }).format(item.budget as number)
              }}
            </div>
            <div v-if="item.director"><small>Режиссер:</small></div>
            <div v-if="item.director">{{ item.director }}</div>
            <div v-if="item.stars"><small>Актеры:</small></div>
            <div v-if="item.stars" class="col-span-2 md:col-auto">
              {{ item.stars }}
            </div>
            <div v-if="item.description" class="font-bold">
              <small>Описание:</small>
            </div>
            <p
              v-if="item.description && item.description?.length > 0"
              class="indent-2 col-span-2 md:col-auto"
            >
              {{ item.description }}
            </p>
          </div>
        </div>
      </article>
      <div
        v-if="status === 'success' && !error"
        class="flex flex-row items-center justify-center gap-4 my-5"
      >
        <button
          v-if="(films as IFilmsRoot).previous"
          type="button"
          @click="handlerPrev"
          class="p-1 w-[40px] h-[40px] inset-10 -scale-100 place-content-center text-indigo-900 dark:text-slate-300 active:-scale-90 rounded-sm cursor-pointer"
        >
          <UiSvgNextSvg />
        </button>
        <span>Страница - {{ paramPage }}</span>
        <button
          v-if="(films as IFilmsRoot).next"
          type="button"
          @click="handlerNext"
          class="p-1 w-[40px] h-[40px] inset-10 place-content-center text-indigo-900 dark:text-slate-300 active:scale-90 rounded-sm cursor-pointer"
        >
          <UiSvgNextSvg />
        </button>
      </div>
    </div>
  </section>
</template>
