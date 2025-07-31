<script setup lang="ts">
import SearchEdit from "./SearchEdit.vue";
import Search from "../svg/Search.vue";
import { useI18n } from "#i18n";
import type { TIsSearchShow, TSearchEditObject } from "~/types/serchTypes";
import { useRoute, useRouter } from "vue-router";

const { t, locale } = useI18n();

const router = useRouter();
const currentRoute = useRoute();

const isShow = ref<boolean>(false);
const isSeachShow = useState<TIsSearchShow>("searchShow", () => ({
  isSearchShow: isShow.value,
  windowWidth: typeof window !== "undefined" ? window.innerWidth : 800,
}));

const handleShow = (param: boolean) => {
  isShow.value = param;
};

const changeShow = () => {
  handleShow(false);
};

defineExpose({ handleShow });

const searchPath = computed(() =>
  locale.value === "ru" ? "/search" : "/en/search"
);

watch(
  useState("searchTxt"),
  (newValue: TSearchEditObject) => {
    if (newValue.searchTxt.trim().length > SearchMinSymbolsLength) {
      // console.log("нужно искать по строке: ", newValue);
      if (currentRoute.path !== searchPath.value) {
        router.push({ path: searchPath.value });
      }
    }
  },
  { deep: true }
);
//Передать данные для скрытия кнопки
watch(isShow, (newValue) => {
  let windowWidth: number = 350;
  if (typeof window !== "undefined") {
    windowWidth = window.innerWidth;
  }
  isSeachShow.value.isSearchShow = newValue;
  isSeachShow.value.windowWidth = windowWidth;
});
</script>

<template>
  <SearchEdit v-if="isShow" :func-blur="changeShow" />
  <button
    type="button"
    :aria-label="t('buttons.searchButton')"
    :title="t('buttons.searchButton')"
    v-if="!isShow"
    class="w-[24px] h-[24px] text-slate-300 dark:text-slate-400 cursor-pointer active:scale-90"
    @click="handleShow(true)"
  >
    <Search />
  </button>
</template>
