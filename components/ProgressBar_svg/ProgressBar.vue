<script setup lang="ts">
const maxWidth: number = 200;
const strokeWidthInit: number = 12;

import { ref, watch, onUpdated } from "vue";

export type TProgressView = "normal" | "dashboard";
export type TProgressState = "in-progress" | "success" | "warning" | "error";
export type TColorBar = Record<TProgressState, { color: string }>;

const progressOptions: TColorBar = {
  "in-progress": { color: "#60a5fa" },
  success: { color: "#87c500" },
  warning: { color: "#f97316" },
  error: { color: "#ec2424" },
};

const props = withDefaults(
  defineProps<{
    width: number;
    value: number;
    view: TProgressView;
    state?: TProgressState;
  }>(),
  {
    width: 200,
    value: 0,
    view: "normal",
    state: "in-progress",
  }
);

const innerView = ref<TProgressView>(props.view);

const calculateRadius = (paramRadius: number): number => {
  return Math.round(2 * (Math.PI * paramRadius));
};

const groupRef = ref<HTMLElement>();
const pathRef = ref<SVGPathElement>();

const circleStrokeWidth = ref<number>(props.width <= maxWidth ? 7 : 10);
const circleRadius = ref<number>(
  Math.round(props.width / 2 - circleStrokeWidth.value)
);

const value = ref<number>(props.value);
const max = ref<number>(100);
const textX = ref<string>("50%");
const fontSize = ref<number>(20);
const total = ref<number>(calculateRadius(circleRadius.value));

const animateStrokeArray = ref<string>("");
const innerState = ref<TProgressState>(props.state);

const calculateTextX = (paramWidth: number): string => {
  return `${paramWidth / 2 - value.value.toString().length / 2}`;
};

const calculateScaleFactor = (
  paramWidth: number,
  isNumber = true
): string | number => {
  let scaleFactor = isNumber
    ? ((paramWidth * 100) / maxWidth) * 0.01
    : (((paramWidth * 100) / maxWidth) * 0.01).toFixed(2);
  return scaleFactor;
};

const calculateScale = (paramWidth: number) => {
  let scaleFactor = calculateScaleFactor(paramWidth, false);
  //console.log(scaleFactor);
  if (groupRef.value) {
    groupRef.value.setAttribute("style", "transform-origin: 0 0"); //style.setProperty("transform-origin", "0 0");
    groupRef.value.setAttribute("style", `transform: scale(${scaleFactor})`); //style.setProperty("transform", "scale(0.48)");
  }
  if (pathRef.value) {
    pathRef.value.setAttribute(
      "style",
      "transition: stroke-dasharray 240ms linear"
    );
  }
};

const calculateLength = () => {
  let len: number = 0;
  if (pathRef.value) {
    len = pathRef.value.getTotalLength();
  }

  len < 1 ? (len = 550) : (len += 0.01);
  return len;
};

const calculateVars = (paramWidth: number) => {
  textX.value = calculateTextX(paramWidth);
  let scaleFactor = calculateScaleFactor(paramWidth) as number;
  circleStrokeWidth.value = strokeWidthInit * scaleFactor;

  paramWidth < maxWidth
    ? paramWidth < maxWidth / 2
      ? (fontSize.value = 10)
      : (fontSize.value = 14)
    : (fontSize.value = 20);

  circleRadius.value = Math.round(paramWidth / 2 - circleStrokeWidth.value);
  innerView.value === "normal"
    ? (total.value = calculateRadius(circleRadius.value))
    : (total.value = calculateLength());

  value.value = Math.min(value.value, max.value);
  let tmp: number = (value.value * total.value) / 100;
  animateStrokeArray.value = `${tmp} ${total.value}`;
};

watch(
  () => props.state,
  (newValue) => {
    innerState.value = newValue;
    calculateVars(props.width);
  }
);

watch(
  () => props.view,
  (newValue) => {
    innerView.value = newValue;
    calculateVars(props.width);
  }
);

watch(
  () => props.width,
  (newValue) => {
    calculateVars(newValue);
    //calculateScale(newValue);
  }
);

watch(
  () => props.value,
  (newValue) => {
    if (innerState.value !== "in-progress") {
      return;
    }
    calculateVars(props.width);
    value.value = Math.min(newValue, max.value);
    let tmp: number = (value.value * total.value) / 100;
    if (innerState.value === "in-progress" || innerState.value === "success") {
      animateStrokeArray.value = `${tmp} ${total.value}`;
    }
    value.value >= max.value
      ? (innerState.value = "success")
      : (innerState.value = "in-progress");
  }
);

onMounted(() => {
  calculateVars(props.width);
});

onUpdated(() => {
  calculateScale(props.width);
});
</script>

<template>
  <svg
    v-if="innerView === 'normal'"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    view-box="0 0 200 200"
    fill="none"
    :width="props.width"
    :height="props.width"
    class="cursor-pointer border-indigo-900 visibleAnimateSvg"
  >
    <defs>
      <linearGradient
        id="greenRedGradient"
        gradientUnits="userSpaceOnUse"
        spreadMethod="pad"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <stop
          offset="35%"
          :stop-color="progressOptions['success'].color"
        ></stop>
        <stop offset="65%" :stop-color="progressOptions['error'].color"></stop>
      </linearGradient>
      <clipPath id="cutLeft">
        <rect x="0%" y="50%" width="100%" height="100%"></rect>
      </clipPath>
      <clipPath id="cutRight">
        <rect x="0%" y="0%" width="100%" height="50%"></rect>
      </clipPath>
    </defs>
    <circle
      cx="50%"
      cy="50%"
      :r="circleRadius"
      fill="none"
      stroke="#ccc"
      :stroke-width="circleStrokeWidth"
      stroke-linecap="square"
    ></circle>

    <circle
      cx="50%"
      cy="50%"
      :r="circleRadius"
      fill="none"
      :stroke="
        innerState === 'in-progress'
          ? 'url(#greenRedGradient)'
          : progressOptions[innerState].color
      "
      :stroke-width="circleStrokeWidth"
      stroke-linecap="square"
      :stroke-dasharray="animateStrokeArray"
    ></circle>
    <text
      v-if="innerState === 'in-progress'"
      :y="props.width / 2 + 4"
      :x="textX"
      font-family="Tahoma,Verdana"
      font-weight="500"
      text-anchor="middle"
      :font-size="fontSize"
      :fill="
        value < max * 0.35
          ? progressOptions['error'].color
          : value <= max * 0.75
          ? progressOptions['in-progress'].color
          : progressOptions['success'].color
      "
    >
      {{ value }}%
    </text>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      width="100%"
      height="100%"
      fill="none"
      view-box="0 0 24 24"
      :x="props.width / 2 - 12"
      :y="props.width / 2 - 12"
    >
      <path
        v-if="innerState === 'success'"
        class="visibleAnimate"
        id="success1"
        fill="none"
        :stroke="progressOptions[innerState].color"
        :stroke-width="props.width < maxWidth ? 4 : 6"
        stroke-linejoin="round"
        d="M 6.135 13.901 C 8.112 16.068 12.067 20.400 12.067 20.400 C 12.068 20.398 20.367 2.466 20.367 2.466 "
      />
      <g v-if="innerState === 'error'" class="visibleAnimate">
        <path
          id="cross1"
          fill="none"
          :stroke="progressOptions[innerState].color"
          :stroke-width="props.width < maxWidth ? 5 : 6"
          stroke-linejoin="round"
          d="M 4.000 4.000 C 9.333 9.333 19.999 19.999 20.000 20.000 "
        />
        <path
          id="cross2"
          fill="none"
          :stroke="progressOptions[innerState].color"
          :stroke-width="props.width < maxWidth ? 5 : 6"
          stroke-linejoin="round"
          d="M 20.000 4.000 C 14.667 9.333 4.001 19.999 4.000 20.000 "
        />
      </g>
      <g v-if="innerState === 'warning'" class="visibleAnimate">
        <path
          id="warning1"
          :fill="progressOptions[innerState].color"
          fill-rule="evenodd"
          stroke="none"
          d="M 11.950 0.861 C 5.848 0.861 0.800 5.743 0.800 11.955 C 0.800 18.168 5.848 23.049 11.950 23.049 C 18.051 23.049 23.099 18.168 23.099 11.955 C 23.099 5.743 18.051 0.861 11.950 0.861 Z"
        />
        <path
          id="warning2"
          fill="none"
          stroke="#ffffff"
          stroke-width="4"
          stroke-linejoin="round"
          d="M 11.887 4.136 C 11.919 7.614 11.983 14.570 11.983 14.570 "
        />
        <path
          id="warning3"
          fill="#ffffff"
          fill-rule="evenodd"
          stroke="none"
          d="M 10.791 16.651 C 10.791 16.651 13.242 16.651 13.242 16.651 C 13.242 16.651 13.242 19.059 13.242 19.059 C 13.242 19.059 10.791 19.059 10.791 19.059 C 10.791 19.059 10.791 16.651 10.791 16.651 Z"
        />
      </g>
    </svg>
  </svg>

  <svg
    v-if="innerView === 'dashboard'"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    id="db"
    :width="props.width"
    :height="props.width"
    view-box="0 0 200 200"
    fill="none"
    class="cursor-pointer border-indigo-900 visibleAnimateSvg"
  >
    <defs>
      <linearGradient
        id="greenRedGradient2"
        gradientUnits="objectBoundingBox"
        spreadMethod="pad"
        x1="0%"
        y1="100%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" :stop-color="progressOptions['error'].color"></stop>
        <stop
          offset="65%"
          :stop-color="progressOptions['in-progress'].color"
        ></stop>
        <stop
          offset="85%"
          :stop-color="progressOptions['success'].color"
        ></stop>
      </linearGradient>
    </defs>
    <g id="S1" ref="groupRef">
      <path
        fill="none"
        stroke="#ccc"
        :stroke-width="strokeWidthInit"
        stroke-linejoin="round"
        d="M 152.372 175.109 C 152.374 175.107 167.162 162.336 172.107 155.652 C 178.296 147.288 185.098 134.806 187.951 124.799 C 190.749 114.983 191.566 101.062 190.730 90.889 C 190.091 83.108 187.496 72.851 184.615 65.595 C 181.818 58.548 176.772 49.612 172.107 43.636 C 167.353 37.546 159.762 30.351 153.484 25.847 C 147.666 21.672 139.037 17.318 132.360 14.729 C 126.250 12.360 117.741 9.958 111.235 9.170 C 103.452 8.227 92.833 8.390 85.107 9.725 C 75.649 11.360 63.217 15.378 54.810 20.010 C 47.225 24.189 38.240 31.779 32.296 38.077 C 27.498 43.159 21.975 50.817 18.676 56.978 C 15.188 63.491 11.691 72.843 10.059 80.048 C 8.654 86.255 7.945 94.811 8.113 101.173 C 8.308 108.506 9.668 118.315 11.727 125.355 C 13.519 131.482 17.197 139.257 20.344 144.812 C 23.205 149.865 27.667 156.261 31.462 160.655 C 35.510 165.343 46.470 174.830 46.471 174.831 "
      />
      <path
        ref="pathRef"
        fill="none"
        :stroke="
          innerState === 'in-progress'
            ? 'url(#greenRedGradient2)'
            : progressOptions[innerState].color
        "
        :stroke-dasharray="animateStrokeArray"
        :stroke-dashoffset="0"
        :stroke-width="strokeWidthInit"
        stroke-linejoin="round"
        d="M 46.471 175.109 C 46.469 175.107 31.682 162.336 26.737 155.652 C 20.548 147.288 13.746 134.806 10.893 124.799 C 8.095 114.983 7.277 101.062 8.113 90.889 C 8.753 83.108 11.348 72.851 14.228 65.595 C 17.026 58.548 22.072 49.612 26.737 43.636 C 31.490 37.546 39.082 30.351 45.359 25.847 C 51.178 21.672 59.807 17.318 66.484 14.729 C 72.594 12.360 81.103 9.958 87.609 9.170 C 95.392 8.227 106.011 8.390 113.737 9.725 C 123.195 11.360 135.627 15.378 144.034 20.010 C 151.619 24.189 160.604 31.779 166.548 38.077 C 171.346 43.159 176.869 50.817 180.168 56.978 C 183.656 63.491 187.153 72.843 188.785 80.048 C 190.190 86.255 190.899 94.811 190.730 101.173 C 190.536 108.506 189.176 118.315 187.117 125.355 C 185.325 131.482 181.646 139.257 178.500 144.812 C 175.639 149.865 171.177 156.261 167.382 160.655 C 163.334 165.343 152.374 174.830 152.372 174.831 "
      />
      />
    </g>
    <text
      v-if="innerState === 'in-progress'"
      :x="textX"
      :y="props.width / 2 + 4"
      font-family="Tahoma,Verdana"
      font-weight="500"
      text-anchor="middle"
      :font-size="fontSize"
      :fill="
        value < max * 0.35
          ? progressOptions['error'].color
          : value <= max * 0.75
          ? progressOptions['in-progress'].color
          : progressOptions['success'].color
      "
    >
      {{ value }}%
    </text>
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="100%"
      height="100%"
      fill="none"
      view-box="0 0 24 24"
      :x="props.width / 2 - 12"
      :y="props.width / 2 - 12"
    >
      <path
        v-if="innerState === 'success'"
        class="visibleAnimate"
        id="success1"
        fill="none"
        :stroke="progressOptions[innerState].color"
        :stroke-width="props.width < maxWidth ? 4 : 6"
        stroke-linejoin="round"
        d="M 6.135 13.901 C 8.112 16.068 12.067 20.400 12.067 20.400 C 12.068 20.398 20.367 2.466 20.367 2.466 "
      />
      <g v-if="innerState === 'error'" class="visibleAnimate">
        <path
          id="cross1"
          fill="none"
          :stroke="progressOptions[innerState].color"
          :stroke-width="props.width < maxWidth ? 5 : 6"
          stroke-linejoin="round"
          d="M 4.000 4.000 C 9.333 9.333 19.999 19.999 20.000 20.000 "
        />
        <path
          id="cross2"
          fill="none"
          :stroke="progressOptions[innerState].color"
          :stroke-width="props.width < maxWidth ? 5 : 6"
          stroke-linejoin="round"
          d="M 20.000 4.000 C 14.667 9.333 4.001 19.999 4.000 20.000 "
        />
      </g>
      <g v-if="innerState === 'warning'" class="visibleAnimate">
        <path
          id="warning1"
          :fill="progressOptions[innerState].color"
          fill-rule="evenodd"
          stroke="none"
          d="M 11.950 0.861 C 5.848 0.861 0.800 5.743 0.800 11.955 C 0.800 18.168 5.848 23.049 11.950 23.049 C 18.051 23.049 23.099 18.168 23.099 11.955 C 23.099 5.743 18.051 0.861 11.950 0.861 Z"
        />
        <path
          id="warning2"
          fill="none"
          stroke="#ffffff"
          stroke-width="4"
          stroke-linejoin="round"
          d="M 11.887 4.136 C 11.919 7.614 11.983 14.570 11.983 14.570 "
        />
        <path
          id="warning3"
          fill="#ffffff"
          fill-rule="evenodd"
          stroke="none"
          d="M 10.791 16.651 C 10.791 16.651 13.242 16.651 13.242 16.651 C 13.242 16.651 13.242 19.059 13.242 19.059 C 13.242 19.059 10.791 19.059 10.791 19.059 C 10.791 19.059 10.791 16.651 10.791 16.651 Z"
        />
      </g>
    </svg>
  </svg>
</template>

<!-- gradientUnits="userSpaceOnUse" -->

<style lang="css" scoped>
svg circle {
  will-change: auto;
  transform-origin: center center;
  transform: rotate(-90deg);
  transition: stroke-dasharray 240ms linear;
}
svg text {
  user-select: none;
}
/* #S1 {
  transform: scale(0.48);
  transform-origin: 0 0;
} */
.visibleAnimate {
  opacity: 0;
  animation: animateOpacity 600ms ease-in-out forwards;
}

.visibleAnimateSvg {
  opacity: 0;
  animation: animateOpacitySvg 500ms ease-in-out forwards;
}

@keyframes animateOpacitySvg {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  50% {
    transform-origin: 50% 50%;
    transform: scale(1.1);
  }
  70% {
    transform-origin: 50% 50%;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes animateOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
