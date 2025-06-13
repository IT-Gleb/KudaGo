import { nanoid } from "nanoid";
import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  TPieChartData,
  TPieChartItem,
} from "~/components/graphChartjs/PieGraph.vue";

export const PieColors = ref<{ color: string }[]>([
  { color: "#9fa8da" },
  {
    color: "#2196f3",
  },
  {
    color: "#00bcd4",
  },
  { color: "#29b6f6" },
  { color: "#01579b" },
  { color: "#304ffe" },
  {
    color: "#009688",
  },
  {
    color: "#4caf50",
  },
  { color: "#7c4dff" },
  { color: "#cddc39" },
  { color: "#8bc34a" },
  { color: "#ff9800" },
  { color: "#ffeb3b" },
  { color: "#ff5722" },
  { color: "#795548" },
  { color: "#607d8b" },
  { color: "#e91e63" },
  { color: "#f44336" },
  { color: "#d50000" },
  { color: "#ff4081" },
  { color: "#aed581" },
  { color: "#ffa726" },
  { color: "#d500f9" },
  { color: "#536dfe" },
]);

const calculateColor = () => {
  const indx: number = randomIntegerFromMinMax(0, PieColors.value.length - 1);
  return PieColors.value[indx].color;
};

export const PieStore = defineStore("pieStore", () => {
  const Items = ref<TPieChartData>([
    {
      id: nanoid(),
      label: "Unknown",
      value: 20,
      bgColor: calculateColor(),
    },
  ]);
  const Item = ref<TPieChartItem>({
    id: nanoid(),
    label: "Unknown",
    value: 20,
    bgColor:
      PieColors.value[randomIntegerFromMinMax(0, PieColors.value.length - 1)]
        .color,
  });

  const ActiveIndex = ref<number>(0);

  const addItem = (param: TPieChartItem) => {
    Items.value.push(param);
    ActiveIndex.value = Math.max(...[0, Items.value.length - 1]);
  };
  const setItem = (param: TPieChartItem) => {
    Item.value = Object.assign({}, param);
  };

  function setActiveIndex(param: number) {
    ActiveIndex.value = Math.min(...[param, Items.value.length - 1]);
    Item.value = Object.assign({}, Items.value[ActiveIndex.value]);
  }

  function deleteItem() {
    Items.value.splice(ActiveIndex.value, 1);
    ActiveIndex.value = Math.max(...[0, Items.value.length - 1]);
    Item.value = Object.assign({}, Items.value[ActiveIndex.value]);
  }
  function setItemInArray(param: TPieChartItem) {
    Items.value[ActiveIndex.value] = Object.assign({}, param);
  }

  return {
    Item,
    Items,
    addItem,
    setItem,
    setActiveIndex,
    deleteItem,
    setItemInArray,
  };
});
