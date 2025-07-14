<script setup lang="ts">
const router = useRouter();

const paramSearch = useState("searchTxt");

const handleMain = () => {
  router.replace({ path: "/" });
};
</script>

<template>
  <div class="my-20 w-fit mx-auto">
    <h3 class="uppercase">Это страница поиска!!!</h3>
    <div class="my-10">
      Параметры поиска: <span>{{ paramSearch }}</span>
    </div>
    <div class="my-10">
      <button
        type="button"
        class="min-w-[60px] min-h-[30px] p-2 place-content-center bg-slate-600 text-slate-100 active:scale-90 cursor-pointer"
        @click="handleMain"
      >
        На главную
      </button>
    </div>
  </div>
</template>
