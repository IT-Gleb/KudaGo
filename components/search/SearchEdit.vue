<script setup lang="ts">
import Cross from "../svg/Cross.vue";
import RoundCross from "../svg/RoundCross.vue";
import { refDebounced } from "@vueuse/core";
import { ref } from "vue";
import { useI18n } from "#i18n";
import { useResizeObserver } from "@vueuse/core";
import { useRouter } from "vue-router";

const delayDebonce: number = 1500;

const props = defineProps<{ funcBlur: () => void }>();
const searchRef = ref<HTMLInputElement | null>(null);
const popRef = ref<HTMLDivElement>();

const router = useRouter();

const searchText = ref<string>("");

const { t } = useI18n();

const debouncedInput = refDebounced(searchText, delayDebonce);

useResizeObserver(searchRef, (entries) => {
  popoverPosition();
});

const handleClear = () => {
  searchText.value = "";
  searchRef.value?.focus();
};

const isKeyBoardPersist = () => {
  return "virtualKeyboard" in navigator;
};

const popoverPosition = () => {
  if (searchRef.value) {
    const popRect = (
      searchRef.value as HTMLInputElement
    ).getBoundingClientRect();
    popRef.value?.style.setProperty("top", `${popRect.bottom - 2}px`);
    popRef.value?.style.setProperty("left", `${popRect.x + 12}px`);
    // console.log(popRect);
  }
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

const textToSearch = useState("searchTxt", () => "");

watch(debouncedInput, () => {
  textToSearch.value = debouncedInput.value.trim();
});

watch(searchText, () => {
  searchText.value.trim().length <= SearchMinSymbolsLength
    ? popRef.value?.showPopover()
    : popRef.value?.hidePopover();
});

onMounted(() => {
  nextTick(() => {
    searchRef.value?.focus();
  });

  let timer = setTimeout(() => {
    popoverPosition();
    searchText.value.trim().length <= SearchMinSymbolsLength
      ? popRef.value?.showPopover()
      : null;

    clearTimeout(timer);
  }, 500);

  // window.addEventListener("resize", popoverPosition);
});

const handlerRoute = async () => {
  await router.push("/search");
};

const handlerSubmit = (): boolean => {
  if (searchText.value.length > SearchMinSymbolsLength) {
    handlerRoute();
    return true;
  }
  return false;
};
</script>

<template>
  <form
    class="flex items-start rounded-r-2xl overflow-hidden m-0 p-0 border-1 animoSearch"
    action=""
    @submit.prevent="handlerSubmit"
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
        :title="t('buttons.clearSearch')"
        :aria-label="t('buttons.clearSearch')"
        class="w-[24px] h-[24px] cursor-pointer active:scale-90"
        @click="handleClear"
      >
        <Cross />
      </button>
      <button
        type="button"
        :title="t('buttons.closeSearch')"
        :aria-label="t('buttons.closeSearch')"
        class="w-[24px] h-[24px] cursor-pointer active:scale-90"
        @click="props.funcBlur"
      >
        <RoundCross />
      </button>
    </div>
  </form>
  <div
    popover="hint"
    ref="popRef"
    class="w-fit my-2 p-2 place-content-center bg-slate-800 text-white dark:bg-slate-600 dark:text-slate-200 first-letter:uppercase font-normal lowercase"
  >
    <small>
      Введите не менее {{ SearchMinSymbolsLength + 1 }}-х символов для поиска
    </small>
  </div>
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
