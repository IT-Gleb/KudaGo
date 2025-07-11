<script async setup lang="ts">
import type { IFilmsRoot } from "~/types/filmTypes";
import { FilmsController } from "./controllers/FilmsController";
import { randomIntegerFromMinMax } from "#imports";
import FilmCard from "./FilmCard.vue";
import popMessage from "../../popover/popMessage.vue";
import { useI18n } from "#i18n";

import { ref } from "vue";
import { PopMessageStore } from "~/store/popMessagesStore";

type TPageParam = -1 | 0 | 1;

const { t } = useI18n();

const popMsg = PopMessageStore();
const { PopPush } = popMsg;

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

watch(
  films,
  () => {
    if (films.value) {
      totalPage.value = Math.ceil((films.value as IFilmsRoot).count / 10);
      let msg: string = t("popMessages.dataPageLoaded").replace(
        "%s",
        paramPage.value.toString()
      );

      PopPush(msg);
    } else {
      totalPage.value = 500;
    }
  },
  { deep: true }
);
</script>

<template>
  <popMessage />
  <section class="w-[96%] xl:w-[80%] mx-auto min-h-screen p-1">
    <div ref="filmsRef" class="p-1 flex items-center justify-between">
      <div class="flex items-center gap-4" :id="FilmsSectionId">
        <h4 class="my-5">Фильмы</h4>
        <span>[Страница - {{ paramPage }} из {{ totalPage }}]</span>
      </div>
      <button
        type="button"
        @click="handleRefresh"
        class="bg-indigo-950 -inset-4 xl:inset-0 text-slate-300 dark:bg-slate-300 dark:text-indigo-900 cursor-pointer active:scale-90 p-1 place-content-center overflow-hidden rounded-md"
      >
        <small>{{ t("buttons.update") }}</small>
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
      v-if="
        status !== 'pending' && (error === null || typeof error === undefined)
      "
      class="w-fit mx-auto"
    >
      <FilmCard
        v-for="item in (films as IFilmsRoot).results"
        :key="item.id"
        :item="item"
      />
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
