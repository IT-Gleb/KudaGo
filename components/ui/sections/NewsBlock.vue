<script setup lang="ts">
import NewsBlockItem from "./NewsBlockItem.vue";

const {
  status,
  data: news,

  error,
} = await useLazyAsyncData(
  "news",
  async () =>
    await $fetch("/api/news", {
      method: "GET",
      cache: "force-cache",
      signal: AbortSignal.timeout(3000),
    }),
  {
    transform: (data) => {
      //console.log(data);
      const myNews: TNewsItem[] = (data as TNewsData).results;
      let tPages: number = Number((data as TNewsData).count);
      tPages = Math.floor(tPages / 20);
      return { data: myNews, total: tPages };
    },
  }
);
</script>

<template>
  <section class="min-h-screen w-full p-2 md:w-[95%] md:mx-auto">
    <h2 class="mt-5 uppercase">Новости</h2>
    <div v-if="status === 'pending'" class="w-fit mx-auto">
      Идет загрузка...
    </div>
    <div v-else-if="error">{{ error }}</div>
    <section
      class="grid grid-cols-1 md:grid-cols-3 mx-auto mt-5 gap-x-5 gap-y-5"
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
        />
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
