import { assign } from "lodash";

// Colors
const yellow200 = "#FFF59D";
const deepOrange600 = "#F4511E";
const lime300 = "#DCE775";
const lightGreen500 = "#8BC34A";
const teal700 = "#00796B";
const cyan900 = "#006064";
const colors = [
  //   deepOrange600,
  //   yellow200,
  //   lime300,
  //   lightGreen500,
  //   teal700,
  //   cyan900,
  "#c18c8cff",
  "#e1c668ff",
  "#b8c18cff",
  "#95c18cff",
  "#8cafc1ff",
  "#af8cc1ff",
  "#e1af7bff",
  "#c1c3c3ff",
  "#b0a581ff",
  "#c18c8c8f",
  "#c1a68c8f",
  "#b8c18c8f",
  "#8cafc18f",
  "#c2af9dff",
  "#c1c3c38f",
  "#c5c0d5ff",
  "#9dc2c2ff",
  "#e6e6678f",
];
const blueGrey50 = "#ECEFF1";
const blueGrey300 = "#90A4AE";
const blueGrey700 = "#455A64";
const grey900 = "#212121";

const sansSerif = "'Helvetica Neue', 'Helvetica', sans-serif";
const letterSpacing = "normal";
const fontSize = 12;

const padding = 8;
const baseProps = {
  width: 460,
  height: 320,
  padding: 30,
};
const pieProps = {
  width: 460,
  height: 320,
  padding: 10,
};

const baseLabelStyles = {
  fontFamily: "Noto Sans KR",
  fontWeight: "bold",
  fontSize,
  letterSpacing,
  padding,
  fill: blueGrey700,
  stroke: "transparent",
  strokeWidth: 0,
};

const centeredLabelStyles = assign({ textAnchor: "middle" }, baseLabelStyles);

const strokeDasharray = "10, 5";
const strokeLinecap = "round";
const strokeLinejoin = "round";

// Put it all together...
export const theme = {
  area: assign(
    {
      style: {
        data: {
          fill: grey900,
        },
        labels: baseLabelStyles,
      },
    },
    baseProps
  ),
  axis: assign(
    {
      style: {
        axis: {
          fill: "#bababa",
          stroke: "#bababa",
          strokeWidth: 2,
          //   strokeLinecap,
          //   strokeLinejoin,
        },
        axisLabel: assign({}, centeredLabelStyles, {
          padding,
          stroke: "transparent",
        }),
        grid: {
          fill: "none",
          stroke: "none",
          //   strokeDasharray,
          //   strokeLinecap,
          //   strokeLinejoin,
          pointerEvents: "painted",
        },
        ticks: {
          fill: "transparent",
          size: 5,
          stroke: blueGrey300,
          strokeWidth: 1,
          strokeLinecap,
          strokeLinejoin,
        },
        tickLabels: assign({}, baseLabelStyles, {
          fill: blueGrey700,
        }),
      },
    },
    baseProps
  ),
  polarDependentAxis: assign({
    style: {
      ticks: {
        fill: "transparent",
        size: 1,
        stroke: "transparent",
      },
    },
  }),
  bar: assign(
    {
      style: {
        data: {
          fill: "#bababa",
          padding,
          strokeWidth: 0,
        },
        labels: baseLabelStyles,
      },
    },
    baseProps
  ),
  boxplot: assign(
    {
      style: {
        max: { padding, stroke: blueGrey700, strokeWidth: 1 },
        maxLabels: assign({}, baseLabelStyles, { padding: 3 }),
        median: { padding, stroke: blueGrey700, strokeWidth: 1 },
        medianLabels: assign({}, baseLabelStyles, { padding: 3 }),
        min: { padding, stroke: blueGrey700, strokeWidth: 1 },
        minLabels: assign({}, baseLabelStyles, { padding: 3 }),
        q1: { padding, fill: blueGrey700 },
        q1Labels: assign({}, baseLabelStyles, { padding: 3 }),
        q3: { padding, fill: blueGrey700 },
        q3Labels: assign({}, baseLabelStyles, { padding: 3 }),
      },
      boxWidth: 20,
    },
    baseProps
  ),
  candlestick: assign(
    {
      style: {
        data: {
          stroke: blueGrey700,
        },
        labels: assign({}, baseLabelStyles, { padding: 5 }),
      },
      candleColors: {
        positive: "#ffffff",
        negative: blueGrey700,
      },
    },
    baseProps
  ),
  chart: baseProps,
  errorbar: assign(
    {
      borderWidth: 8,
      style: {
        data: {
          fill: "transparent",
          opacity: 1,
          stroke: blueGrey700,
          strokeWidth: 2,
        },
        labels: baseLabelStyles,
      },
    },
    baseProps
  ),
  group: assign(
    {
      colorScale: colors,
    },
    baseProps
  ),
  histogram: assign(
    {
      style: {
        data: {
          fill: blueGrey700,
          stroke: grey900,
          strokeWidth: 2,
        },
        labels: baseLabelStyles,
      },
    },
    baseProps
  ),
  legend: {
    colorScale: colors,
    gutter: 10,
    orientation: "vertical",
    titleOrientation: "top",
    style: {
      data: {
        type: "circle",
      },
      labels: baseLabelStyles,
      title: assign({}, baseLabelStyles, { padding: 5 }),
    },
  },
  line: assign(
    {
      style: {
        data: {
          fill: "transparent",
          opacity: 1,
          stroke: blueGrey700,
          strokeWidth: 2,
        },
        labels: baseLabelStyles,
      },
    },
    baseProps
  ),
  pie: assign(
    {
      colorScale: colors,
      style: {
        data: {
          padding,
          stroke: blueGrey50,
          strokeWidth: 1,
        },
        labels: assign({}, baseLabelStyles, { padding: 20 }),
      },
    },
    pieProps
  ),
  scatter: assign(
    {
      style: {
        data: {
          fill: blueGrey700,
          opacity: 1,
          stroke: "transparent",
          strokeWidth: 0,
        },
        labels: baseLabelStyles,
      },
    },
    baseProps
  ),
  stack: assign(
    {
      colorScale: colors,
    },
    baseProps
  ),
  tooltip: {
    style: assign({}, baseLabelStyles, { padding: 0, pointerEvents: "none" }),
    flyoutStyle: {
      stroke: grey900,
      strokeWidth: 1,
      fill: "#f0f0f0",
      pointerEvents: "none",
    },
    flyoutPadding: 5,
    cornerRadius: 5,
    pointerLength: 10,
  },
  voronoi: assign(
    {
      style: {
        data: {
          fill: "transparent",
          stroke: "transparent",
          strokeWidth: 0,
        },
        labels: assign({}, baseLabelStyles, {
          padding: 5,
          pointerEvents: "none",
        }),
        flyout: {
          stroke: grey900,
          strokeWidth: 1,
          fill: "#f0f0f0",
          pointerEvents: "none",
        },
      },
    },
    baseProps
  ),
};
