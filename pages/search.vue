<script setup lang="ts">
import { useSearchData } from "~/components/search/controller/SearchDataController";
import type { ISearchRoot } from "~/types/serchTypes";
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

const PagesCount = computed(() => {
  if (!searchdata.value) {
    return 0;
  }
  const { count } = searchdata.value as ISearchRoot;
  let result = count ?? 0;
  result = Math.ceil(result / itemsOnPage);
  return result;
});

const lengthOnPage = computed(() => {
  if (searchdata.value?.results) {
    const { length } = searchdata.value?.results;
    return length > 12;
  } else {
    return false;
  }
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
        <span v-if="paramSearch.length > 0"
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
    <div v-if="PagesCount > 0">
      Найдено: <mark>{{ searchdata?.count }}</mark> Страниц:
      <mark>{{ PagesCount }}</mark>
    </div>

    <div class="my-10">
      <div v-if="status === 'pending'">load data...</div>
      <div v-if="error !== null">{{ error }}</div>
      <div
        v-if="
          (status === 'success' || status === 'idle') && searchdata?.count === 0
        "
      >
        <h3>Нет данных</h3>
      </div>
      <div
        v-else
        class="p-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2"
      >
        <div v-for="item in searchdata?.results" :key="item.id">
          <div class="flex flex-col gap-2">
            <div class="font-bold first-letter:uppercase">{{ item.title }}</div>
            <div class="text-[0.85em]/[1.2em]">
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
    <div v-if="PagesCount > 0 && lengthOnPage" class="my-10">
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
