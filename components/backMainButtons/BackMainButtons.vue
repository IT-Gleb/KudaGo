<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const handlerBack = () => {
  router.back();
};

const handlerMain = () => {
  router.push("/");
};
</script>

<template>
  <div class="flex items-center gap-2 justify-evenly my-10">
    <button
      type="button"
      aria-label="Вернуться"
      class="bg-slate-700 text-slate-100 active:scale-90 p-1 min-w-[60px] min-h-[30px] cursor-pointer rounded-md"
      @click="handlerBack"
    >
      Вернуться
    </button>

    <button
      type="button"
      aria-label="На Главную"
      class="bg-slate-700 text-slate-100 active:scale-90 p-1 min-w-[60px] min-h-[30px] cursor-pointer rounded-md"
      @click="handlerMain"
    >
      На Главную
    </button>
  </div>
</template>
