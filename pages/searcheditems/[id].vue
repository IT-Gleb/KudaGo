<script setup lang="ts">
import { useState } from "#app";
import type { ISearchResult, Search_Root } from "~/types/serchTypes";
import { ClientOnly } from "#components";
import { hasPlaceData, isObject } from "~/utils/functions";
import BackMainButtons from "~/components/backMainButtons/BackMainButtons.vue";
import LMap from "~/components/leafletmap/LMap.vue";

const eventItem = useState<Partial<ISearchResult>>("eventItem");

if (isObject(eventItem.value.body_text as string)) {
  eventItem.value.body_text = JSON.parse(eventItem.value.body_text as string);
}

function formatTextToHTMLHeaders(param: string): string {
  // console.log(param);
  let reg: RegExp[] = [
    new RegExp(`^[А-Я][\\s\\S]+?\\?$`, "gmu"),
    new RegExp(`^\\d\\d?[\\s\\S]+?:$`, "gmu"),
  ];
  let txt: string = `${param}`;
  try {
    reg.forEach((regitem) =>
      regitem
        .exec(txt)
        ?.forEach((item) => (txt = txt.replaceAll(item, `<h4>${item}</h4>`)))
    );

    // ?.forEach((item) => (txt = txt.replaceAll(item, `<h4>${item}</h4>`)));
    // console.log(txt);
  } catch (err) {
    return txt;
  }

  return txt;
}

const TextBlocks = computed<string | { id: string; text: string }[]>(() => {
  if (!eventItem.value.body_text) {
    return "";
  }
  if (isObject(eventItem.value.body_text)) {
    let tmpTexts: { id: string; text: string }[] = [];
    (eventItem.value.body_text as unknown as Search_Root).blocks.forEach(
      (item) => {
        if (item.text.length > 0) {
          tmpTexts = [
            ...tmpTexts,
            { id: item.key, text: formatTextToHTMLHeaders(item.text) },
          ];
        }
      }
    );
    return tmpTexts;
  } else {
    return eventItem.value.body_text;
  }
});

useHead({
  title: `${eventItem.value.title}:[Kuda-Go]`,
});

const hasPlace = computed<boolean>(() => hasPlaceData(eventItem.value.place));

const subways = (param: string) =>
  computed<string>(() => {
    let tmp = param.split(",");
    if (tmp.length > 0) {
      tmp.forEach((item) => {
        item = item.trim();
        return item;
      });
      return tmp.join(", ");
    }
    return param;
  });

const phones = computed<string[] | undefined>(() => {
  let tmp = eventItem.value.place?.phone.split(",");
  let res: string[] = [];
  if (tmp) {
    tmp.forEach(
      (item) => (item = item.replaceAll(" ", "").replaceAll("-", ""))
    );
    res = Array.from(tmp);
  }

  return res;
});
</script>

<template>
  <ClientOnly>
    <section
      class="p-2 text-[1.2em]/[1.4em] lg:text-[1rem]/[1.5rem] w-[98vw] lg:w-[75vw] xl:w-[70vw] mx-auto"
    >
      <BackMainButtons />

      <div class="flex flex-col items-start gap-2 justify-between border-b">
        <div class="w-full border-b border-b-black p-2 pb-4">
          <h4 class="text-[1.3em]/[1.6em]">{{ eventItem.title }}</h4>
        </div>
        <div class="w-full">
          <div class="w-fit mx-auto">
            <div class="object-cover object-center">
              <img
                :src="
                eventItem.first_image?.thumbnails !== null
                  ? eventItem.first_image?.thumbnails['640x384'] as string
                  : ''
              "
                :alt="eventItem.title"
                loading="lazy"
                decoding="async"
                class="block max-w-full max-h-full"
              />
            </div>
          </div>
        </div>

        <div
          v-if="eventItem.place"
          class="w-fit mx-auto p-2 grid grid-cols-[100px_1fr] md:grid-cols-[160px_1fr] my-5 text-[0.9em]/[1.2em] gap-2"
        >
          <div class="font-bold font-['Roboto']">Город:</div>
          <div>{{ Locations[eventItem.place?.location] }}</div>
          <div class="font-bold font-['Roboto']">Место:</div>
          <div>«{{ eventItem.place.title }}»</div>

          <div class="font-bold font-['Roboto']">Адрес:</div>
          <div>{{ eventItem.place?.address }}</div>
          <div class="font-bold font-['Roboto']">Ссылка:</div>
          <div>
            <NuxtLink :to="eventItem.item_url" target="_blank">{{
              eventItem.item_url
            }}</NuxtLink>
          </div>
          <div v-if="eventItem.place?.phone" class="font-bold font-['Roboto']">
            Телефон:
          </div>
          <div v-if="eventItem.place?.phone" class="first-letter:uppercase">
            <NuxtLink
              v-for="item in phones"
              :key="item"
              :to="`tel:${item}`"
              target="_blank"
              >{{ item }}
            </NuxtLink>
          </div>

          <div v-if="eventItem.place?.subway" class="font-bold font-['Roboto']">
            Ближайшее метро:
          </div>
          <div v-if="eventItem.place?.subway">
            {{ subways(eventItem.place?.subway) }}
          </div>
        </div>

        <div
          class="max-w-[96%] mx-auto flex flex-col text-[0.8em]/[1.4em] md:flex-row items-start justify-between border-t"
        >
          <div v-if="typeof TextBlocks === 'string'" class="indent-3 px-2">
            {{ TextBlocks }}
          </div>
          <div v-if="typeof TextBlocks === 'object'">
            <div v-for="item in TextBlocks" :key="item.id">
              <div
                v-html="item.text"
                class="indent-3 mt-2 px-2 pb-2 [&>h4]:text-[1.1em]/[1.35em] [&>h4]:mt-1"
              ></div>
            </div>
          </div>
          <div
            v-if="hasPlace"
            class="w-[96%] md:w-[50%] mx-auto pl-2 py-2 md:border-l"
          >
            <LMap
              :title="eventItem.title as string "
              :place="eventItem.place"
            />
          </div>
        </div>
      </div>

      <BackMainButtons />
    </section>
  </ClientOnly>
</template>
