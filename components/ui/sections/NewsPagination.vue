<script setup lang="ts">
const props = defineProps<{ totalPages: number; activePage: number }>();
const pages = ref<number[]>([]);
const emit = defineEmits<{
  (event: "updateActiveIndex", param: number): void;
}>();

for (let indx: number = 0; indx < props.totalPages; indx++) {
  pages.value.push(indx + 1);
}
</script>

<template>
  <section>
    <div class="w-fit mx-auto my-3 flex items-center gap-x-2">
      <h6>Всего страниц</h6>
      <span
        ><small>-[{{ props.totalPages }}]</small></span
      >
    </div>
    <div
      class="w-full mb-5 flex flex-row flex-wrap items-center gap-x-3 gap-y-4"
    >
      <button
        type="button"
        role="button"
        v-for="item in pages"
        :key="item"
        :tabindex="item"
        class="w-[20px] h-[20px] md:w-[32px] md:h-[32px] overflow-hidden font-bold cursor-pointer active:scale-90 place-content-center focus:outline focus:outline-offset-2 focus:outline-indigo-900 focus:dark:outline-slate-200"
        :class="
          props.activePage === item
            ? 'bg-indigo-400 text-yellow-100 dark:bg-yellow-500 dark:text-red-600 outline outline-offset-2 outline-indigo-900 dark:outline-slate-200'
            : 'bg-slate-700 text-slate-100 dark:bg-slate-400 dark:text-indigo-900'
        "
        @click="() => emit('updateActiveIndex', item)"
      >
        <small>
          {{ item }}
        </small>
      </button>
    </div>
  </section>
</template>
