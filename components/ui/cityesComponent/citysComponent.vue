<script async setup lang="ts">
import { useCityes } from "~/store/cityStore";
import { storeToRefs } from "pinia";
import { useI18n, type LocaleMessageType, type VueMessageType } from "#i18n";

const { t, tm, rt } = useI18n();

const store = useCityes();
const { towns, SelectedItem } = storeToRefs(store);
const { SetItem, Init } = store;

await callOnce("cityes", () => Init());

const nameGroup: Array<Record<string, string>> = [
  { label: t("news.filter.all"), tag: "A" },
  { label: t("news.filter.intresting"), tag: "B" },
  { label: t("news.filter.city"), tag: "C" },
];

const City = ref<TCity>();

type TGroup = {
  label: string;
  tag: string;
  data: TCityData;
};

type TSelectGroups = {
  groups: TGroup[];
};

const selectedData = ref<TSelectGroups>({ groups: [] });

watch(SelectedItem, () => {
  //console.log("Selected: ", SelectedItem.value?.slug);
  City.value = SelectedItem.value;
});

watch(City, () => {
  //console.log(City.value?.name);
  SetItem(City.value?.slug as string);
  //  console.log(City.value.slug, props.select.slug);
});

const returnNameFromArray = (param: string[], paramName: string) => {
  const delimeter = "=";
  const reg = new RegExp("([a-zA-Z]*)=([a-zA-Zа-яА-Я-\s]*)", "gi");
  param.forEach((item) => {
    if (!item.match(reg)) {
      return "error data";
    }
  });

  return param.reduce((bbb, itm) => {
    if (itm.startsWith(paramName)) {
      bbb = itm.split(delimeter)[1];
    }
    return bbb;
  }, "");
};

onMounted(() => {
  //Перевести города на eng
  //@ts-ignore
  const { length: len } = tm("news.filter.towns");
  const engTowns: string[] = [];
  tm("news.filter.towns")
    //@ts-ignore
    .slice(0, len)
    .map((item: LocaleMessageType<VueMessageType>) => rt(item))
    .forEach((item: string) => engTowns.push(item));

  const { length } = towns.value;

  if (length && length > 0) {
    //Перековертировать в объект для select
    selectedData.value.groups = [];
    selectedData.value = towns.value.reduce(
      (acc, curr) => {
        if (curr.slug === "*") {
          acc.groups.push({
            label: nameGroup[0].label,
            tag: nameGroup[0].tag,
            data: [curr as never],
          });
        } else if (curr.slug === "interesting") {
          curr.name = t("news.filter.intresting");
          acc.groups.push({
            label: nameGroup[1].label,
            tag: nameGroup[1].tag,
            data: [curr as never],
          });
        } else {
          const finded = acc.groups.find(
            (item) => (item as TGroup).label === nameGroup[2].label
          );
          if (finded) {
            // console.log("найдено: ", curr);
            (finded as TGroup).tag = nameGroup[2].tag;
            curr.name = returnNameFromArray(engTowns, curr.slug);

            (finded as TGroup).data.push(curr);
          } else {
            curr.name = returnNameFromArray(engTowns, curr.slug);
            acc.groups.push({
              label: nameGroup[2].label,
              tag: nameGroup[2].tag,
              // data: [curr as never],
              data: [curr as never],
            });
          }
        }

        return acc;
      },
      { groups: [{ label: "", tag: "E", data: [] }] }
    );

    function sortByTag(a: unknown, b: unknown) {
      return (a as TGroup).tag.toLowerCase() > (b as TGroup).tag.toLowerCase()
        ? 1
        : -1;
    }

    selectedData.value.groups.splice(0, 1);
    selectedData.value.groups.sort(sortByTag);
    //console.log(selectedData.value);

    // City.value = towns.value[0];
    if (selectedData.value.groups[0].data?.length > 0) {
      City.value = selectedData.value.groups[0].data[0];
    }
  }
});
</script>

<template>
  <div class="flex flex-row gap-x-2 items-center">
    <span>{{ t("news.filteredBy") }}:</span>
    <select
      name="selectCity"
      id="selectCity"
      class="p-1 outline-none border border-black dark:border-slate-100 bg-white dark:bg-slate-950 dark:text-slate-300"
      v-model="City"
    >
      <optgroup
        v-for="(group, index) in selectedData?.groups"
        :label="group.label"
        :key="index"
      >
        <option
          v-for="item in group.data"
          :value="item"
          :key="item.id"
          class="odd:bg-slate-100 dark:odd:bg-slate-900 p-1"
        >
          {{ item.name }}
        </option>
      </optgroup>
    </select>
  </div>
</template>
