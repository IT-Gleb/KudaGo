<script setup lang="ts">
import { useSearchData } from "~/components/search/controller/SearchDataController";
import type { TSearchDataObject } from "~/types/serchTypes";
import { FormatDateFromNumber } from "~/utils/functions";
import loaderComponent from "~/components/loader/loaderComponent.vue";
import SearchCard from "~/components/search/SearchCard.vue";
import { useI18n } from "#i18n";

const { t } = useI18n();

const itemsOnPage: number = 15;

const router = useRouter();

const paramSearch = useState<string>("searchTxt");

const isSearchParam = computed(
  () => paramSearch.value && paramSearch.value.trim().length > 0
);

const handleMain = () => {
  router.replace({ path: "/" });
};

const currentPage = ref<number>(1);

const { status, searchdata, error, execute } = useSearchData(
  paramSearch,
  currentPage
);

const serchItems = computed(() => {
  if (searchdata.value) {
    return searchdata.value.count !== null ? searchdata.value.count : 0;
  } else {
    return 0;
  }
});

useHead({
  title: "Поиск:[Kuda Go]",
  meta: [
    { name: "description", content: t("title") },
    { name: "author", content: t("author") },
  ],
});
</script>

<template>
  <section class="p-1 lg:w-[80%] mx-auto">
    <div class="flex flex-row items-center justify-between my-10">
      <button
        type="button"
        aria-label="На главную"
        class="min-w-[60px] min-h-[30px] p-2 place-content-center bg-slate-600 text-slate-100 active:scale-90 cursor-pointer"
        @click="handleMain"
      >
        На главную
      </button>

      <div>
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

    <div v-if="!isSearchParam" class="w-fit mx-auto my-10">
      <h4>Не введены параметры поиска</h4>
    </div>

    <div class="my-10">
      <div
        v-if="status === 'pending'"
        class="w-[34px] h-[34px] mx-auto text-orange-600 dark:text-slate-400"
      >
        <loader-component />
      </div>
      <div v-if="error !== null">{{ error }}</div>
    </div>
    <div
      v-if="
        status !== 'pending' &&
        status !== 'error' &&
        serchItems < 1 &&
        isSearchParam
      "
    >
      <h4>Нет Данных</h4>
    </div>

    <div
      v-if="
        (status === 'success' || status === 'idle') &&
        serchItems > 0 &&
        isSearchParam
      "
    >
      Найдено: {{ serchItems }}

      <div class="my-10 font-light">
        <div
          v-for="([key, value], index) in Object.entries(searchdata?.results as TSearchDataObject)"
          :key="index"
          class="my-5 font-bold font-['Roboto'] p-1"
        >
          <h5
            class="text-orange-600 dark:text-slate-200 text-[1.8em]/[2.1em] lg:text-[1rem]/[1.2rem]"
          >
            {{
              (key as string) === "unknow"
                ? "Дата начала не указана"
                : FormatDateFromNumber(Number(key))
            }}
          </h5>
          <hr class="text-orange-700 dark:text-slate-500" />
          <div
            class="mx-2 mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <SearchCard
              v-for="itm of value"
              :key="itm.id"
              :item="itm"
              :date="key"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
