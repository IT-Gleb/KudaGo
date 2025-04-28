<script setup lang="ts">
import NewsBlockItem from "./NewsBlockItem.vue";
import NewsImagesBlock from "./NewsImagesBlock.vue";
import { countOnPage } from "~/utils/urls";
import { LazyUiSectionsNewsPagination } from "#components";
import { useLazyAsyncData } from "#app";
import loaderComponent from "~/components/loader/loaderComponent.vue";
import { useCityes } from "~/store/cityStore";

const ActivePage = ref<number>(1);
const titleRef = ref<HTMLHeadingElement | null>(null);

const cityStore = useCityes();
const { SelectedItem } = storeToRefs(cityStore);

const {
  status,
  data: news,
  // refresh,
  error,
} = await useLazyAsyncData(
  `news-${Math.random().toString()}`,
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
    transform: (data) => {
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
      return { data: myNews, total: tPages };
    },
  }
);

const handleReload = async () => {
  ActivePage.value = 1;
  //await refresh();
};

const handleActiveIndex = async (param: number) => {
  //console.log(param);
  ActivePage.value = param;
  (titleRef.value as HTMLHeadElement).scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
  //  await refresh();
};

useHead({
  title: `Страница-[${ActivePage.value}]:Новости:[KudaGo]`,
});

watch(ActivePage, (newPage) => {
  useHead({
    title: `Страница-[${newPage}]:Новости:[KudaGo]`,
  });
});
</script>

<template>
  <section class="min-h-screen w-full p-2 md:w-[95%] md:mx-auto">
    <div class="flex flex-row items-end justify-between mt-5">
      <h2 ref="titleRef" class="uppercase">
        Новости
        <span
          class="text-[clamp(2.2vw,2.8vw,3vw)] md:text-[clamp(1vw,1.3vw,1.5vw)]"
          >Страница-[{{ ActivePage }}]</span
        >
      </h2>
      <UiCityesComponentCitysComponent />
      <div>
        <button
          type="button"
          class="active:scale-90 hover:underline cursor-pointer bg-indigo-950 text-slate-200 dark:font-bold dark:bg-slate-400 disabled:opacity-0 dark:text-indigo-900 px-1 pt-[2px] pb-1 rounded-md"
          @click="handleReload"
          :disabled="status === 'pending'"
        >
          <small>Обновить</small>
        </button>
      </div>
    </div>
    <div
      v-if="status === 'pending'"
      class="w-[64px] h-[64px] mx-auto text-indigo-950 dark:text-slate-100"
    >
      <loaderComponent />
    </div>
    <div v-else-if="error">{{ error }}</div>
    <section
      v-show="status !== 'pending' && status !== 'error'"
      class="grid grid-cols-1 mx-auto mt-5 gap-x-5 gap-y-5"
    >
      <div v-for="(item, index) in news?.data">
        <NewsBlockItem
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
      </div>
    </section>
    <div
      v-if="status !== 'pending' && status !== 'error'"
      class="w-fit mx-auto my-5"
    >
      <!-- Всего страниц: {{ news?.total }} -->
      <LazyUiSectionsNewsPagination
        v-show="news !== null"
        :totalPages="news?.total as number"
        :active-page="ActivePage"
        @updateActiveIndex="handleActiveIndex"
      />
    </div>
  </section>
</template>
