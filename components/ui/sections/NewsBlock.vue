<script setup lang="ts">
import NewsBlockItem from "./NewsBlockItem.vue";
import NewsImagesBlock from "./NewsImagesBlock.vue";
import { countOnPage } from "#imports";

const {
  status,
  data: news,
  refresh,
  error,
} = await useLazyAsyncData(
  "news",
  () =>
    $fetch("/api/news", {
      method: "GET",
      cache: "reload",
      signal: AbortSignal.timeout(3000),
    }),
  {
    transform: (data) => {
      //console.log(data);
      const myNews: TNewsItem[] = (data as TNewsData).results;
      let tPages: number = Number((data as TNewsData).count);
      tPages = Math.floor(tPages / countOnPage);
      return { data: myNews, total: tPages };
    },
  }
);

const handleReload = async () => {
  await refresh();
};
</script>

<template>
  <section class="min-h-screen w-full p-2 md:w-[95%] md:mx-auto">
    <div class="flex flex-row items-center justify-between">
      <h2 class="mt-5 uppercase">Новости</h2>
      <div>
        <button
          type="button"
          class="active:scale-90 hover:underline cursor-pointer bg-indigo-950 text-slate-200 dark:bg-slate-400 disabled:opacity-0 dark:text-indigo-900 px-1 py-[2px] rounded-md"
          @click="handleReload"
          :disabled="status === 'pending'"
        >
          <small>Обновить</small>
        </button>
      </div>
    </div>
    <div
      v-if="status === 'pending'"
      class="w-fit mx-auto text-indigo-950 dark:text-slate-100"
    >
      Идет загрузка...
    </div>
    <div v-else-if="error">{{ error }}</div>
    <section class="grid grid-cols-1 mx-auto mt-5 gap-x-5 gap-y-5">
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
      Всего страниц: {{ news?.total }}
    </div>
  </section>
</template>
