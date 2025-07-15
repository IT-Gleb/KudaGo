<script setup lang="ts">
import Search from "../svg/Search.vue";
import Cross from "../svg/Cross.vue";
import { refDebounced } from "@vueuse/core";
import { ref } from "vue";
import { useI18n } from "#i18n";

const delayDebonce: number = 1000;

const props = defineProps<{ funcBlur: () => void }>();
const searchRef = ref<HTMLInputElement | null>(null);

const searchText = ref<string>("");

const { t } = useI18n();

const debouncedInput = refDebounced(searchText, delayDebonce);

const handleClear = () => {
  searchText.value = "";
  searchRef.value?.focus();
};

const isKeyBoardPersist = () => {
  return "virtualKeyboard" in navigator;
};

const showVirtualKeyboard = () => {
  if (isKeyBoardPersist()) {
    //@ts-ignore
    console.log(navigator.vitualKeyBoard);
    //@ts-ignore
    navigator.virtualKeyboard.overlaysContent = true;
    //@ts-ignore
    navigator.virtualKeyboard.show();
  }
};

const textToSerch = useState("searchTxt", () => "");

watch(debouncedInput, () => {
  textToSerch.value = debouncedInput.value;
});

onMounted(() => {
  searchRef.value?.focus();
});
</script>

<template>
  <form
    class="flex items-start rounded-r-2xl overflow-hidden m-0 p-0 border-1 animoSearch"
    action=""
    @submit.prevent="() => false"
  >
    <input
      ref="searchRef"
      type="search"
      maxlength="50"
      autocomplete="off"
      v-model="searchText"
      :placeholder="t('search.placeholder')"
      class="max-w-[320px] min-h-[30px] py-[2px] px-1 outline-none font-['Inter'] text-[1rem]/[1.2rem] placeholder:text-slate-500"
    />
    <div class="flex items-end gap-1 text-indigo-950 bg-slate-300 p-1">
      <button
        type="button"
        class="w-[24px] h-[24px] cursor-pointer active:scale-90"
        @click="handleClear"
      >
        <Cross />
      </button>
      <button
        type="button"
        class="w-[24px] h-[24px] cursor-pointer active:scale-90"
        @click="props.funcBlur"
      >
        <Search />
      </button>
    </div>
  </form>
</template>

<style lang="css" scoped>
.animoSearch {
  animation-delay: 500ms;
  animation: animoSized 0.5s ease;
}

@keyframes animoSized {
  0% {
    transform-origin: right;
    transform: scaleX(0);
  }
  100% {
    transform-origin: right;
    transform: scaleX(100%);
  }
}
</style>
