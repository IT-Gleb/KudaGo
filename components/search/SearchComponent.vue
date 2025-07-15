<script setup lang="ts">
import SearchEdit from "./SearchEdit.vue";
import Search from "../svg/Search.vue";
import { useI18n } from "#i18n";

const { t } = useI18n();

const router = useRouter();

const isShow = ref<boolean>(false);

const handleShow = (param: boolean) => {
  isShow.value = param;
};

const changeShow = () => {
  handleShow(false);
};

defineExpose({ handleShow });

watch(
  useState("searchTxt"),
  (newValue: string) => {
    if (newValue.trim().length > 3) {
      // console.log("нужно искать по строке: ", newValue);
      router.push({ path: "/search" });
    }
  },
  { deep: true }
);
</script>

<template>
  <SearchEdit v-if="isShow" :func-blur="changeShow" />
  <button
    type="button"
    :aria-label="t('buttons.searchButton')"
    :title="t('buttons.searchButton')"
    v-if="!isShow"
    class="w-[24px] h-[24px] text-indigo-900 dark:text-slate-400 cursor-pointer active:scale-90"
    @click="handleShow(true)"
  >
    <Search />
  </button>
</template>
