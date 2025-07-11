<script async setup lang="ts">
import NewsBlockItem from "./NewsBlockItem.vue";
import NewsImagesBlock from "./NewsImagesSlider.vue";
import { countOnPage } from "../../../utils/urls";
import NewsPagination from "./NewsPagination.vue";
import loaderComponent from "../../loader/loaderComponent.vue";
import { useCityes } from "../../../store/cityStore";
import CitysComponent from "../cityesComponent/citysComponent.vue";
import {
  getParamsToObject,
  deleteNonUsedSymbols,
} from "../../../utils/functions";
import type { TGetParamsObject, TNewsItem, TNewsData } from "~/types/myTypes";
import NewsError from "../NewsError.vue";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useLazyAsyncData, useHead } from "#app";
import { useI18n } from "#i18n";

const { t } = useI18n();

const ActivePage = ref<number>(1);
const titleRef = ref<HTMLHeadingElement | null>(null);

const cityStore = useCityes();
const { SelectedItem, Filtered } = storeToRefs(cityStore);
const { SetItem } = cityStore;

const paramsObj = ref<TGetParamsObject>();
const NewsOnPage = ref<number>(countOnPage);

const {
  status,
  data: news,
  execute,
  clear,
  error,
} = await useLazyAsyncData(
  `news-${ActivePage.value.toString()}`,
  () =>
    //@ts-ignore
    $fetch("/api/news", {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
      params: {
        page: ActivePage.value,
        city: SelectedItem.value?.slug,
        totalOnPage: NewsOnPage.value,
      },
      retry: 3,
    }),
  {
    //immediate: false,
    watch: [ActivePage, SelectedItem, NewsOnPage],
    dedupe: "cancel",
    transform: (data: unknown) => {
      //console.log(data);
      let myNews: TNewsItem[] = (data as TNewsData).results;

      //Удалить ненужное из текста
      if (myNews) {
        myNews.forEach(
          (item) => (item.body_text = deleteNonUsedSymbols(item.body_text))
        );
      }
      //-------------------------
      //Убрать дубликаты по description
      let tmpNews: TNewsItem[] = [];
      if (myNews) {
        myNews.forEach((item) => {
          let finded = tmpNews.find(
            (findItem) =>
              findItem.description.toLowerCase().trim() ===
              item.description.toLowerCase().trim()
          );
          if (!finded) {
            tmpNews.push(item);
          }
        });
        myNews = Array.from(tmpNews);
      }

      //----------------------------

      let tPages: number = 1;
      if (data) {
        tPages = Number((data as TNewsData).count);
        tPages = Math.ceil(tPages / NewsOnPage.value);
      }
      //-------------------
      if ((data as TNewsData).next) {
        const paramObj: TGetParamsObject | null = getParamsToObject(
          (data as TNewsData).next as string
        );
        if (paramObj) {
          paramsObj.value = paramObj;
        }
      }

      return {
        data: myNews,
        total: tPages,
        nextPage: (data as TNewsData).next,
        prevPage: (data as TNewsData).previos,
      };
    },
  }
);

const handleChangePage = (param: number) => {
  ActivePage.value = param;
  (titleRef.value as HTMLElement).scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
};

const handleReload = async () => {
  ActivePage.value = 1;
  SetItem("*");
  clear();
  await execute();
  //console.log(SelectedItem.value);
};

const handleNewsOnPage = async (param: number) => {
  //console.log("handle on Page: ", param);
  NewsOnPage.value = param;
  clear();
  await execute();
};

useHead({
  title: `Страница-[${ActivePage.value}]:Новости:[KudaGo]`,
});

watch(ActivePage, (newPage) => {
  useHead({
    title: `Страница-[${newPage}]:Новости:[KudaGo]`,
  });
});

watch(SelectedItem, () => {
  useHead({
    title: Filtered.value
      ? `Фильтр-[${SelectedItem.value?.name}]:Новости:[KudaGo]`
      : `Страница-[${ActivePage.value}]:Новости:[KudaGo]`,
  });
});
</script>

<template>
  <ClientOnly>
    <section class="min-h-screen w-full p-2 md:w-[95%] md:mx-auto xl:w-[80%]">
      <div
        class="flex flex-row flex-wrap items-center justify-between gap-2 mt-10"
      >
        <h2 ref="titleRef" class="uppercase">
          {{ t("news.title") }}
          <span
            class="text-[clamp(2.2vw,2.8vw,3vw)] md:text-[clamp(1vw,1.3vw,1.5vw)]"
            >{{
              Filtered
                ? `Фильтр-[${SelectedItem?.name}]`
                : `${t("news.page")}-[${ActivePage}]`
            }}</span
          >
        </h2>
        <button
          type="button"
          class="active:scale-90 hover:underline cursor-pointer bg-indigo-950 text-slate-200 dark:font-bold dark:bg-slate-400 disabled:opacity-0 dark:text-indigo-900 px-1 pt-[2px] pb-1 rounded-md"
          @click="handleReload"
        >
          <small>{{ t("buttons.update") }}</small>
        </button>
      </div>
      <div
        class="flex flex-col-reverse md:flex-row items-center justify-between gap-2 my-5 pb-3 border-b border-b-indigo-900 dark:border-b-slate-400"
      >
        <CitysComponent />
        <PagesComponent @set-news-count-on-page="handleNewsOnPage" />
        <TimerComponent />
      </div>
      <div
        v-if="status === 'pending' && !error"
        class="w-[64px] h-[64px] mx-auto text-indigo-950 dark:text-slate-100"
      >
        <loaderComponent />
      </div>
      <div v-if="error">
        <NewsError :error-msg="error.message" />
      </div>

      <NewsBlockItem
        v-if="status !== 'pending' && !error"
        v-for="(item, index) in news?.data"
        :key="item.id"
        :id="item.id"
        :header="item.title"
        :description="item.description"
        :text="item.body_text"
        :date_publication="item.publication_date"
        :isodd="index % 2 === 0"
      >
        <NewsImagesBlock :images="item.images" />
      </NewsBlockItem>
      <NewsPagination
        v-if="
          (news?.total as number) > 1 &&
          Filtered === false
        "
        :total-pages="news?.total as number"
        :active-page="ActivePage"
        @update-active-index="handleChangePage"
      />
    </section>
    <template #error="{ error, clearError }">
      <div class="w-fit mx-auto mt-5">
        <h3 class="w-fit mx-auto">Ошибка</h3>
        <p>{{ error }}</p>
        <button @click="clearError">Очистить</button>
      </div>
    </template>
  </ClientOnly>
</template>
