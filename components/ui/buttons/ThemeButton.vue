<script setup lang="ts">
import { ref, watch } from "vue";
import { motion } from "motion-v";
const darkClass: string = "dark";

const thisX = ref(0);
const isDark = ref(false);
const keyStore: string = "darkTheme";
const lengths = ref([36, 72]);

const isDesktop = useMediaQuery("only screen and (min-width: 1024px)");

const pathLength = isDesktop.value
  ? ref(lengths.value[1])
  : ref(lengths.value[0]); //36;

let store: Storage | undefined = undefined;
if (import.meta.client) {
  store = window.localStorage;
  //console.log(store);
}

const handleX = () => {
  isDark.value = !isDark.value;
};

const handlePath = () => {
  isDark.value ? (thisX.value = pathLength.value) : (thisX.value = 0);
};

const setDarkMode = () => {
  //Установить класс dark
  if (isDark.value) {
    document.documentElement.classList.toggle(darkClass, isDark.value);
  } else {
    document.documentElement.classList.remove(darkClass);
  }
};

if (store) {
  switch (store.getItem(keyStore)) {
    case "true":
      isDark.value = true;
      break;
    case "false":
      isDark.value = false;
      break;
    default:
      isDark.value = false;
      break;
  }
  handlePath();
  setDarkMode();
}

watch(isDark, () => {
  handlePath();
  if (import.meta.client) {
    if (store) {
      store.setItem(keyStore, String(isDark.value));
    }
  }
  //Установить класс dark
  setDarkMode();
});

watch(isDesktop, () => {
  pathLength.value = isDesktop.value ? lengths.value[1] : lengths.value[0]; //72:36;

  handlePath();
  // console.log(isDesktop.value, pathLength.value);
});
//export default defineComponent({ name: "ThemeButton" });
</script>

<template>
  <div
    class="w-[60px] h-[24px] lg:w-[100px] lg:h-[30px] bg-[linear-gradient(to_right,theme(colors.slate.100),theme(colors.slate.500))] dark:bg-[linear-gradient(to_right,theme(colors.black),theme(colors.slate.500))] rounded-4xl border border-indigo-950 dark:border-slate-500 overflow-hidden place-content-center"
  >
    <!-- <div class="w-[35px] h-[35px] rounded-full bg-slate-800 cursor-pointer" /> -->
    <motion.div
      :transition="{ type: 'spring' }"
      :animate="{ x: thisX }"
      @click="handleX"
      role="button"
      title="Изменить тему отображения"
      class="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] rounded-full bg-slate-500 dark:bg-slate-300 cursor-pointer lowercase"
    >
    </motion.div>
  </div>
</template>
