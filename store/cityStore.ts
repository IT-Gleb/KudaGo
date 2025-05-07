import { defineStore } from "pinia";
import { ref } from "vue";
import { type TCity, type TCityData } from "#imports";

export const useCityes = defineStore("cityes", () => {
  const towns = ref<TCityData>([]);
  let t_error = ref<boolean | string>(false);
  const SelectedItem = ref<TCity>();

  const Filtered = computed(() => SelectedItem.value?.slug !== "*");

  async function Init() {
    t_error.value = false;
    const { data, error } = await useFetch("/api/cityes", {
      immediate: true,
      method: "POST",
      headers: { "Content-Type": "application/json;utf-8" },
      retry: 3,
      signal: AbortSignal.timeout(3000),
      body: "",
    });
    if (error.value) {
      towns.value = [];
      t_error.value = error.value as unknown as string;
    }
    if (data) {
      towns.value = Array.from(data.value as unknown as TCityData);
      SelectedItem.value = towns.value[0];
    }
  }

  function SetItem(param: string) {
    const find = towns.value.find(
      (item) => item.slug.toLowerCase() === param.toLowerCase()
    );
    if ((find as TCity)?.slug !== SelectedItem.value?.slug) {
      SelectedItem.value = find as TCity;
    }
  }

  Init();

  return { towns, t_error, Filtered, SelectedItem, SetItem };
});
