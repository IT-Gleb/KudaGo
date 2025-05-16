<script setup lang="ts">
import { useCityes } from "~/store/cityStore";
import { storeToRefs } from "pinia";

const store = useCityes();
const { towns, SelectedItem } = storeToRefs(store);
const { SetItem, Init } = store;

await callOnce("cityes", () => Init());

const nameGroup: Array<Record<string, string>> = [
  { label: "Всё", tag: "A" },
  { label: "Интересное", tag: "B" },
  { label: "Города", tag: "C" },
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

// const handleChange = (event: Event) => {
//   const { value } = <HTMLSelectElement>event.target;

//   //console.log(value);
//   SetItem(value);
// };

watch(SelectedItem, () => {
  //console.log("Selected: ", SelectedItem.value?.slug);
  City.value = SelectedItem.value;
});

watch(City, () => {
  //console.log(City.value?.name);
  SetItem(City.value?.slug as string);
  //  console.log(City.value.slug, props.select.slug);
});

onMounted(() => {
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
            (finded as TGroup).tag = nameGroup[2].tag;
            (finded as TGroup).data.push(curr);
          } else {
            acc.groups.push({
              label: nameGroup[2].label,
              tag: nameGroup[2].tag,
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
    <span>Фильтр запроса:</span>
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
