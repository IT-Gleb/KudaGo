<script setup lang="ts">
import SearchEdit from "./SearchEdit.vue";
import Search from "../svg/Search.vue";

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
    if (newValue.trim().length > 0) {
      console.log("нужно искать по строке: ", newValue);
    }
  },
  { deep: true }
);
</script>

<template>
  <SearchEdit v-if="isShow" :func-blur="changeShow" />
  <button
    type="button"
    v-if="!isShow"
    class="w-[24px] h-[24px] text-indigo-900 cursor-pointer active:scale-90"
    @click="handleShow(true)"
  >
    <Search />
  </button>
</template>
