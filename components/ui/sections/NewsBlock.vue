<script setup lang="ts">
import NewsBlockItem from "./NewsBlockItem.vue";
import NewsImagesBlock from "./NewsImagesSlider.vue";
import { countOnPage } from "~/utils/urls";
import NewsPagination from "~/components/ui/sections/NewsPagination.vue";
import { useLazyAsyncData } from "#app";
import loaderComponent from "~/components/loader/loaderComponent.vue";
import { useCityes } from "~/store/cityStore";
import LazyCitysComponent from "../cityesComponent/citysComponent.vue";
import { getParamsToObject } from "~/utils/functions";

const ActivePage = ref<number>(1);
const titleRef = ref<HTMLHeadingElement | null>(null);

const cityStore = useCityes();
const { SelectedItem, Filtered } = storeToRefs(cityStore);
const { SetItem } = cityStore;

const paramsObj = ref<TGetParamsObject>();

const {
  status,
  data: news,
  refresh,
  error,
} = await useLazyAsyncData(
  `news-${(ActivePage.value + Math.random()).toString()}`,
  () =>
    //@ts-ignore
    $fetch("/api/news", {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
      params: {
        page: ActivePage.value,
        city: SelectedItem.value?.slug,
      },
      retry: 3,
    }),
  {
    //immediate: false,
    watch: [ActivePage, SelectedItem],
    dedupe: "cancel",
    transform: (data: unknown) => {
      //console.log(data);
      const myNews: TNewsItem[] = (data as TNewsData).results;
      //Удалить ненужное из текста
      if (myNews) {
        myNews.forEach(
          (item) => (item.body_text = deleteNonUsedSymbols(item.body_text))
        );
      }
      //-------------------------
      let tPages: number = 1;
      if (data) {
        tPages = Number((data as TNewsData).count);
        tPages = Math.floor(tPages / countOnPage);
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
  await refresh();
  //console.log(SelectedItem.value);
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
    <section class="min-h-screen w-full p-2 md:w-[95%] md:mx-auto">
      <div class="flex flex-row items-end justify-between my-10">
        <h2 ref="titleRef" class="uppercase">
          Новости
          <span
            class="text-[clamp(2.2vw,2.8vw,3vw)] md:text-[clamp(1vw,1.3vw,1.5vw)]"
            >{{
              Filtered
                ? `Фильтр-[${SelectedItem?.name}]`
                : `Страница-[${ActivePage}]`
            }}</span
          >
        </h2>
        <LazyCitysComponent />
        <button
          type="button"
          class="active:scale-90 hover:underline cursor-pointer bg-indigo-950 text-slate-200 dark:font-bold dark:bg-slate-400 disabled:opacity-0 dark:text-indigo-900 px-1 pt-[2px] pb-1 rounded-md"
          @click="handleReload"
        >
          <small>Обновить</small>
        </button>
      </div>
      <div
        v-if="status === 'pending'"
        class="w-[64px] h-[64px] mx-auto text-indigo-950 dark:text-slate-100"
      >
        <loaderComponent />
      </div>
      <div v-if="error">
        {{ error }}
      </div>

      <div v-if="status !== 'pending' && !error">
        <p>
          {{
            news?.prevPage !== null && typeof news?.prevPage !== "undefined"
              ? news?.prevPage
              : "No prevPage"
          }}
        </p>
        <p class="py-5">
          {{ paramsObj }}
        </p>
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
        v-if="status !== 'error' && status !== 'pending' && Filtered === false"
        :total-pages="news?.total as number"
        :active-page="ActivePage"
        @update-active-index="handleChangePage"
      />
    </section>
  </ClientOnly>
</template>
