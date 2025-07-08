<script setup lang="ts">
const shablon: string = "https://rutube.ru/play/embed/%s";
const ids: string[] = ["80d9d631ec25cfd5f2c854025e1947a8"];

const filmUrl = ref<string>("");

const reg = new RegExp("%s", "gmi");

filmUrl.value = shablon.replace(reg, ids[0]);
</script>

<template>
  <div class="my-10 aspect-video w-fit mx-auto object-cover object-center">
    <iframe
      width="720"
      height="405"
      :src="filmUrl"
      frameBorder="0"
      allow="clipboard-write; autoplay"
      allowFullScreen
    ></iframe>
  </div>
</template>
