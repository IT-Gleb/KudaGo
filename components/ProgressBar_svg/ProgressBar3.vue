<script setup lang="ts">
export type TKindBar = "normal" | "dashboard";
export type TProgressBar = "in-progress" | "success" | "warning" | "error";
export type TColorBar = Record<TProgressBar, { color: string }>;

const Colors: TColorBar = {
  "in-progress": { color: "#60a5fa" },
  success: { color: "#87c500" },
  warning: { color: "#f97316" },
  error: { color: "#ec2424" },
};

// | { type: "in-progress"; color: "#60a5fa" }
// | { type: "success"; color: "#87c500" }
// | { type: "warning"; color: "#f97316" }
// | { type: "error"; color: "#ec2424" };

const props = withDefaults(
  defineProps<{
    kindBar: TKindBar;
    width: number;
    height?: number;
    step?: number;
    progressType: TProgressBar;
    progress?: number;
  }>(),
  {
    kindBar: "normal",
    width: 200,
    height: 200,
    step: 10,
    progress: 0,
    progressType: "in-progress",
  }
);

const progressEmit = defineEmits(["handleProgress"]);

const maxWidth: number = 160;
const maxStep: number = 30;
const stepDefault: number = 10;
const stepDelay = 200;

const pTypeBar = ref<TKindBar>(props.kindBar);

const pBar = ref<TProgressBar>(props.progressType);

const radius =
  Math.min(...[props.width, props.height ? props.height : props.width]) / 2 - 8;
const radiusStr: string = `${radius}`;
let total: number = 0;
if (pTypeBar.value === "normal") {
  total = 2 * (Math.PI * radius);
}

if (pTypeBar.value === "dashboard") {
  total = 350;
}

const step = ref<number>(
  props.step
    ? Math.min(...[Math.max(...[1, props.step]), maxStep])
    : stepDefault
);
const timerRef = ref<number>(-1);

const calculateText = (): string => {
  return `${Math.round((progress.value * 100) / total)}%`;
};

const calculatePercent = () => {
  let percent: number = props.progress ? props.progress : 0;
  percent = Math.round((percent * total) / 100);
  return percent;
};

const progress = ref<number>(calculatePercent());
const textProgress = ref<string>(props.progress ? calculateText() : "0%");
const strokeDashArray = ref<string>(`${progress.value} ${total}`);
const fullDashArray = ref<string>(`${total} ${total}`);

const stopProgress = () => {
  if (timerRef.value > -1) {
    window.clearInterval(timerRef.value);
    timerRef.value = -1;
  }
};

const handleProgress = () => {
  pBar.value = "in-progress";
  if (timerRef.value != -1) {
    stopProgress();
    pBar.value = "warning";
    return;
  }

  timerRef.value = window.setInterval(() => {
    progress.value += step.value;
    if (progress.value >= total) {
      stopProgress();
      pBar.value = "success";
      progress.value = 0;
    }
    strokeDashArray.value = `${progress.value} ${total}`;
    textProgress.value = calculateText();
  }, stepDelay);
};

const handleEsc = () => {
  pBar.value = "error";
  stopProgress();
};

onMounted(() => {
  pBar.value === "in-progress" ? handleProgress() : null;
});
</script>

<template>
  <svg
    v-if="pTypeBar === 'normal'"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    :width="props.width"
    :height="props.height ? props.height : props.width"
    view-box="0 0 200 200"
    fill="none"
    class="cursor-pointer"
  >
    <defs>
      <filter id="blurFilter" y="-5" height="40">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" y="-" />
      </filter>
      <clipPath id="cutLeft">
        <rect x="0%" y="50%" width="100%" height="100%"></rect>
      </clipPath>
      <clipPath id="cutRight">
        <rect x="0%" y="0%" width="100%" height="50%"></rect>
      </clipPath>
      <linearGradient
        id="redGreenGradient"
        gradientUnits="userSpaceOnUse"
        spreadMethod="reflect"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" :stop-color="Colors[pBar].color"></stop>
        <stop offset="80%" stop-color="#ec2424"></stop>
        <stop offset="100%" stop-color="#ec2424"></stop>
      </linearGradient>
      <linearGradient
        id="GreenGreenGradient"
        gradientUnits="userSpaceOnUse"
        spreadMethod="reflect"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" :stop-color="Colors[pBar].color"></stop>
        <stop offset="95%" stop-color="#87c500"></stop>
      </linearGradient>
    </defs>
    <circle
      :r="radiusStr"
      cx="50%"
      cy="50%"
      fill="none"
      :stroke-width="props.width > maxWidth ? 12 : 8"
      stroke="#ccc"
      :opacity="pBar === 'success' ? 0 : 1"
    ></circle>
    <circle
      v-if="progress > total / 3 && pBar === 'in-progress'"
      :r="radiusStr"
      cx="50%"
      cy="50%"
      fill="none"
      :stroke-width="props.width > maxWidth ? 12 : 8"
      stroke="url(#GreenGreenGradient)"
      clip-path="url(#cutRight)"
      :stroke-dasharray="strokeDashArray"
    ></circle>
    <circle
      v-if="progress > 0 && pBar === 'in-progress'"
      :r="radiusStr"
      cx="50%"
      cy="50%"
      fill="none"
      :stroke-width="props.width > maxWidth ? 12 : 8"
      stroke="url(#redGreenGradient)"
      clip-path="url(#cutLeft)"
      :stroke-dasharray="strokeDashArray"
    ></circle>
    <text
      v-if="pBar === 'in-progress'"
      x="50%"
      :y="props.width > maxWidth ? '58%' : '55%'"
      :font-size="props.width > maxWidth ? 40 : 20"
      font-family="Verdana,Tahoma"
      text-anchor="middle"
      :fill="
        progress > total - total / 5
          ? '#87c500'
          : progress < total / 4
          ? '#ec2424'
          : Colors[pBar].color
      "
    >
      {{ textProgress }}
    </text>
    <circle
      v-if="pBar === 'success' || pBar === 'warning' || pBar === 'error'"
      :r="radiusStr"
      cx="50%"
      cy="50%"
      fill="none"
      :stroke-width="props.width > maxWidth ? 12 : 8"
      :stroke="Colors[pBar].color"
      :stroke-dasharray="progress !== 0 ? strokeDashArray : fullDashArray"
    ></circle>
    <svg
      v-if="pBar === 'success' || pBar === 'warning' || pBar === 'error'"
      id="svg2"
      :width="pBar === 'success' ? props.width / 2 : props.width / 4"
      :height="props.height ? props.height / 2 : props.width / 2"
      :x="pBar === 'success' ? '30%' : '38%'"
      y="25%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      fill-opacity="0"
    >
      <path
        v-if="pBar === 'success'"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17.0303 8.78039L8.99993 16.8107L5.4696 13.2804L6.53026 12.2197L8.99993 14.6894L15.9696 7.71973L17.0303 8.78039Z"
        :fill="Colors[pBar].color"
      />
      <path
        v-if="pBar === 'warning'"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"
        :fill="Colors[pBar].color"
      />
      <path
        v-if="pBar === 'error'"
        d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"
        :fill="Colors[pBar].color"
      />
      <animate
        attributeName="fill-opacity"
        dur="3s"
        begin="2s"
        values="0;1;0;"
        fill="freeze"
        repeatCount="indefinite"
      ></animate>
    </svg>
  </svg>

  <svg
    v-if="pTypeBar === 'dashboard'"
    xmlns="http://www.w3.org/2000/svg"
    :height="props.height ? props.height : props.width"
    :width="props.width"
    viewBox="0 0 200 200"
    data-value="40"
    fill="none"
    class="cursor-pointer"
  >
    <defs>
      <linearGradient
        id="redGreenGradient"
        gradientUnits="userSpaceOnUse"
        spreadMethod="reflect"
        x1="100%"
        y1="0%"
        x2="0%"
        y2="0%"
      >
        <stop offset="0%" stop-color="#87c500"></stop>
        <stop offset="60%" :stop-color="Colors[pBar].color"></stop>
        <stop offset="98%" stop-color="#ec2424"></stop>
      </linearGradient>
    </defs>
    <path
      stroke="#ccc"
      stroke-width="12"
      d="M41 149.5a77 77 0 1 1 117.93 0"
      fill="none"
    />
    <path
      stroke="url(#redGreenGradient)"
      stroke-width="12"
      d="M41 149.5a77 77 0 1 1 117.93 0"
      fill="none"
      :stroke-dasharray="strokeDashArray"
      :stroke-offset="total"
    />
    <path
      v-if="pBar === 'success'"
      :stroke="Colors[pBar].color"
      stroke-width="12"
      d="M41 149.5a77 77 0 1 1 117.93 0"
      fill="none"
    />

    <text
      v-if="pBar === 'in-progress'"
      x="50%"
      :y="props.width > maxWidth ? '58%' : '55%'"
      :font-size="props.width > maxWidth ? 40 : 20"
      font-family="Verdana,Tahoma"
      text-anchor="middle"
      :fill="
        progress > total - total / 5
          ? '#87c500'
          : progress < total / 4
          ? '#ec2424'
          : Colors[pBar].color
      "
    >
      {{ textProgress }}
    </text>
    <svg
      v-if="pBar === 'success' || pBar === 'warning' || pBar === 'error'"
      id="svg3"
      :width="pBar === 'success' ? props.width / 3 : props.width / 4"
      :height="props.height ? props.height / 3 : props.width / 3"
      :x="
        props.width < maxWidth
          ? pBar === 'success'
            ? '40%'
            : pBar === 'warning'
            ? '40%'
            : pBar === 'error'
            ? '40%'
            : '36%'
          : '34%'
      "
      :y="props.width < maxWidth ? '30%' : '30%'"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      fill-opacity="0"
    >
      <path
        v-if="pBar === 'success'"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17.0303 8.78039L8.99993 16.8107L5.4696 13.2804L6.53026 12.2197L8.99993 14.6894L15.9696 7.71973L17.0303 8.78039Z"
        :fill="Colors[pBar].color"
      />
      <path
        v-if="pBar === 'warning'"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"
        :fill="Colors[pBar].color"
      />
      <path
        v-if="pBar === 'error'"
        d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"
        :fill="Colors[pBar].color"
      />
      <animate
        attributeName="fill-opacity"
        dur="3s"
        begin="2s"
        values="0;1;0;"
        fill="freeze"
        repeatCount="indefinite"
      ></animate>
    </svg>
  </svg>
</template>

<!-- repeatCount="indefinite" -->
<!-- stroke-linecap="round" -->

<!-- stroke-dashoffset="300" -->

<style lang="css" scoped>
svg circle {
  will-change: auto;
  /* stroke-width: 12px; */
  transform-origin: center center;
  transform: rotate(-90deg);
  transition: stroke-dasharray 240ms linear;
}
svg text {
  user-select: none;
}
svg path {
  transform-origin: center center;
  transition: stroke-dasharray 240ms linear;
}
</style>
