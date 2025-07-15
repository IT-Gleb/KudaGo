<script setup lang="ts">
import { useSearchData } from "~/components/search/controller/SearchDataController";
import type { ISearchResult, ISearchRoot } from "~/types/serchTypes";
import { FormatDateFromNumber } from "~/utils/functions";

const itemsOnPage: number = 15;

const router = useRouter();

const paramSearch = useState<string>("searchTxt");

const handleMain = () => {
  router.replace({ path: "/" });
};

const currentPage = ref<number>(1);

const { status, searchdata, error, execute } = useSearchData(
  paramSearch,
  currentPage
);

const ItemsCount = computed(() => {
  if (searchdata.value) {
    if (searchdata.value.results) {
      const { length } = (searchdata.value as ISearchRoot)
        .results as ISearchResult[];
      return length;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
});

const lengthOnPage = computed(() => {
  return Math.ceil(ItemsCount.value / itemsOnPage) > 0;
});
</script>

<template>
  <section class="p-1 lg:w-[80%] mx-auto">
    <div class="flex flex-row items-center justify-between">
      <button
        type="button"
        aria-label="На главную"
        class="min-w-[60px] min-h-[30px] p-2 place-content-center bg-slate-600 text-slate-100 active:scale-90 cursor-pointer"
        @click="handleMain"
      >
        На главную
      </button>

      <div class="my-5">
        Параметры поиска:
        <span v-if="paramSearch !== ''"
          ><mark>{{ paramSearch }}</mark></span
        >
      </div>
      <button
        type="button"
        aria-label="Обновить"
        class="min-w-[60px] min-h-[30px] p-1 bg-indigo-950 text-slate-300 active:scale-90 cursor-pointer rounded-md"
        @click="async () => await execute()"
      >
        Обновить
      </button>
    </div>
    <div v-if="ItemsCount > 0">
      Найдено: <mark>{{ searchdata?.count }}</mark> Страниц:
      <mark>{{ ItemsCount }}</mark>
    </div>

    <div class="my-10">
      <div v-if="status === 'pending'">load data...</div>
      <div v-if="error !== null">{{ error }}</div>
      <div
        v-if="(status === 'success' || status === 'idle') && ItemsCount === 0"
      >
        <h3>Нет данных</h3>
      </div>
      <div
        v-else
        class="p-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2"
      >
        <div v-for="item in searchdata?.results" :key="item.id">
          <div class="flex flex-col gap-2">
            <div
              class="font-bold first-letter:uppercase text-[1.5em]/[1.8em] md:text-[1em]/[1.2em]"
            >
              {{ item.title }}
            </div>
            <div class="text-[1.2em]/[1.6em] md:text-[0.8em]/[1.2em]">
              <p class="indent-5 text-balance">
                {{ item.description }}
              </p>
            </div>
          </div>
          <div v-if="item.daterange" class="text-right">
            <div v-if="item.daterange.start_date">
              <small>
                начало:
                {{ FormatDateFromNumber(item.daterange.start_date) }}
              </small>
              &nbsp;
              <small v-if="item.daterange.start_time">
                {{ FormatTimeFromNumber(item.daterange.start_time) }}
              </small>
            </div>
            <div v-if="item.daterange.end_date">
              <small>
                окончание:
                {{ FormatDateFromNumber(item.daterange.end_date) }}
              </small>
              &nbsp;
              <small v-if="item.daterange.end_time">
                {{ FormatTimeFromNumber(item.daterange.end_time) }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="ItemsCount > 12 && lengthOnPage" class="my-10">
      <button
        type="button"
        aria-label="На главную"
        class="min-w-[60px] min-h-[30px] p-2 place-content-center bg-slate-600 text-slate-100 active:scale-90 cursor-pointer"
        @click="handleMain"
      >
        На главную
      </button>
    </div>
  </section>
</template>
