import { defineStore } from "pinia";
import { ref } from "vue";

export const useCityes = defineStore("cityes", () => {
  const towns = ref<TCityData>([]);
  let t_error = ref<boolean | string>(false);
  const ActiveIndex = ref<number>(-1);
  const SelectedItem = ref<TCity | undefined>(undefined);

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
    }
  }

  function setActiveIndex(param: number) {
    ActiveIndex.value = param;
    ActiveIndex.value = Math.max(
      0,
      Math.min(ActiveIndex.value, towns.value.length - 1)
    );
  }

  function SetItem(param: string) {
    const find = towns.value.find((item) => item.slug === param);
    if (find) {
      SelectedItem.value = find;
    }
  }

  Init();

  return { towns, t_error, SelectedItem, SetItem };
});
