<script setup lang="ts">
import { useState } from "#app";
import type { ISearchResult, Search_Root } from "~/types/serchTypes";
import { ClientOnly } from "#components";
import { hasPlaceData, isObject } from "~/utils/functions";
import BackMainButtons from "~/components/backMainButtons/BackMainButtons.vue";
import LMap from "~/components/leafletmap/LMap.vue";
import { nanoid } from "nanoid";

const eventItem = useState<Partial<ISearchResult>>("eventItem");

if (isObject(eventItem.value.body_text as string)) {
  eventItem.value.body_text = JSON.parse(eventItem.value.body_text as string);
}

function formatTextToHTMLHeaders(param: string): string {
  // console.log(param);
  let reg: RegExp[] = [
    new RegExp(`^[А-Я][\\s\\S].*?[^\\.]$`, "gsi"),
    new RegExp(`^\\d\\d?[\\s\\S]+?:$`, "gs"),
    new RegExp(`^[А-Я]?[\\s\\S]+?:\\?$`, "gsi"),
    // new RegExp(`^[А-Я]?[\\s\\S]+?\\+\\)$`, "gi"),
    new RegExp(`^[А-Я||\\"«]?[\\s\\S].*?\\)$`, "gsi"),
  ];
  let txt: string = `${param.trim()}`;
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
        const reg = new RegExp("еще?ё? больше", "gmi");
        if (item.text.length > 0 && !reg.test(item.text)) {
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

type TPlacePhone = {
  id: string;
  text: string;
  link: string;
}[];

const phones = computed<TPlacePhone>(() => {
  let tmp = eventItem.value.place?.phone.split(",");
  let res: TPlacePhone = [];
  if (tmp) {
    tmp.forEach((item) => {
      const tmpLink = item.replaceAll(" ", "").replaceAll("-", "");
      res.push({ id: nanoid(), link: tmpLink, text: item });
    });
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
          <div
            v-if="eventItem.place?.phone"
            class="flex flex-wrap items-start gap-3"
          >
            <NuxtLink
              v-for="item in phones"
              :key="item.id"
              :to="`tel:${item.link}`"
              target="_blank"
              class="underline underline-offset-2"
              >{{ item.text }}
            </NuxtLink>
          </div>

          <div v-if="eventItem.place?.subway" class="font-bold font-['Roboto']">
            Ближайшее метро:
          </div>
          <div v-if="eventItem.place?.subway">
            {{ subways(eventItem.place?.subway) }}
          </div>
          <div
            v-if="eventItem.age_restriction"
            class="font-bold font-['Roboto']"
          >
            Возрастные ограничения:
          </div>
          <div v-if="eventItem.age_restriction">
            {{ eventItem.age_restriction }}+
          </div>
        </div>

        <div
          class="max-w-[96%] mx-auto text-[0.8em]/[1.4em] border-t flex flex-col gap-2"
        >
          <div v-if="typeof TextBlocks === 'string'" class="indent-3 px-2">
            {{ TextBlocks }}
          </div>
          <div
            v-else
            v-for="(item, index) in TextBlocks"
            :key="item.id"
            v-html="item.text"
            class="indent-3 mt-2 px-2 pb-2 [&>h4]:text-[1.1em]/[1.35em] [&>h4]:mt-1"
          ></div>
          <div v-if="hasPlace" class="w-[96%] md:w-[90%] mx-auto pl-2 py-2">
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
