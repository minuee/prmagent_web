import sample1 from "assets/scheduler/sample1.png";
import sample2 from "assets/scheduler/sample2.png";
const testArr = [
  { id: "k", from: 5, to: 6, data: "data7" },
  { id: "a", from: 1, to: 1, data: "data1" },
  { id: "e", from: 5, to: 6, data: "data4" },
  { id: "j", from: 4, to: 4, data: "data6" },
  { id: "g", from: 1, to: 1, data: "data5" },
  { id: "b", from: 2, to: 2, data: "data2" },
  { id: "d", from: 4, to: 4, data: "data3" },
  { id: "asdf", from: 1, to: 4, data: "data3" },
  { id: "sdasdf", from: 2, to: 4, data: "data3" },
  { id: "sdasdf12", from: 6, to: 7, data: "data3" },
];
const makeDataToRow = (inputArr = []) => {
  const initialObj = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
  };
  const outputArr = [];
  let filteredObject = inputArr.reduce((acc, curr) => {
    if (Array.isArray(acc[curr.from])) {
      acc[curr.from].push(curr);
    } else {
      acc[curr.from] = [curr];
    }
    return acc;
  }, {});

  let filteredArrays = [[], [], [], [], [], [], [], []];

  for (const [key, value] of Object.entries(filteredObject)) {
    filteredArrays[key] = value;
  }
  filteredArrays.map((dayArray) =>
    dayArray.sort((a, b) => b.to - b.from - (a.to - a.from))
  );

  while (!filteredArrays.every((a) => a.length === 0)) {
    for (let i = 1; i <= 7; i++) {
      if (filteredArrays[i].length) {
        let newSchedule = filteredArrays[i].shift();
        i = newSchedule.to;
        outputArr.push(newSchedule);
      } else {
        outputArr.push({
          id: getUUID(),
          from: i,
          to: i,
          data: "",
          blank: true,
        });
      }
    }
  }

  return outputArr;
};

export const SchedularSelectedWeekData = [
  {
    id: 1,
    date: "8/1",
    day: "SUN",
  },
  {
    id: 2,
    date: "8/2",
    day: "MON",
  },
  {
    id: 3,
    date: "8/3",
    day: "TUE",
  },
  {
    id: 4,
    date: "8/4",
    day: "WED",
  },
  {
    id: 5,
    date: "8/5",
    day: "THU",
  },
  {
    id: 6,
    date: "8/6",
    day: "FRI",
  },
  {
    id: 7,
    date: "8/7",
    day: "SAT",
  },
];

export const ZeplinExactData = [
  {
    id: 1,
    title: "Look #1",
    memo: "수선중",
    imgSrc: sample1,
    weekData: [
      { id: "a", from: 1, to: 1, data: "data1" },
      { id: "b", from: 2, to: 2, data: "data2" },
      { id: "c", from: 3, to: 3, data: "", blank: true },
      { id: "d", from: 4, to: 4, data: "data3" },
      { id: "e", from: 5, to: 6, data: "data4" },
      { id: "f", from: 7, to: 7, data: "", blank: true },
      { id: "g", from: 1, to: 1, data: "data5" },
      { id: "h", from: 2, to: 2, data: "", blank: true },
      { id: "i", from: 3, to: 3, data: "", blank: true },
      { id: "j", from: 4, to: 4, data: "data6" },
      { id: "k", from: 5, to: 6, data: "data7" },
    ],
    testArr,
    sortedArr: makeDataToRow(testArr),
  },
  {
    id: 2,
    title: "Look #1",
    memo: "수선중",
    imgSrc: sample2,
    weekData: makeDataToRow(testArr),
  },
];
export const SchedulerMockData = [
  {
    id: 1,
    title: "Look #1",
    memo: "수선중",
    imgSrc: sample1,
    weekData: [
      { id: "11", from: 1, to: 7, data: "hello1-7" },
      { id: "12", from: 1, to: 6, data: "hello1-6" },
      { id: "13", from: 1, to: 5, data: "hello1-5" },
      { id: "14", from: 1, to: 4, data: "hello1-4" },
      { id: "15", from: 1, to: 3, data: "hello1-3" },
      { id: "16", from: 1, to: 2, data: "hello1-2" },
      { id: "17", from: 1, to: 1, data: "hello1-1" },
      { id: "18", from: 2, to: 7, data: "hello2-7" },
      { id: "19", from: 2, to: 6, data: "hello2-6" },
      { id: "21", from: 2, to: 5, data: "hello2-5" },
      { id: "22", from: 2, to: 4, data: "hello2-4" },
      { id: "23", from: 2, to: 3, data: "hello2-3" },
      { id: "24", from: 2, to: 2, data: "hello2-2" },
      { id: "25", from: 3, to: 7, data: "hello3-7" },
      { id: "26", from: 3, to: 6, data: "hello3-6" },
      { id: "27", from: 3, to: 5, data: "hello3-5" },
      { id: "28", from: 3, to: 4, data: "hello3-4" },
      { id: "29", from: 3, to: 3, data: "hello3-3" },
      { id: "31", from: 4, to: 7, data: "hello4-7" },
      { id: "32", from: 4, to: 6, data: "hello4-6" },
      { id: "33", from: 4, to: 5, data: "hello4-5" },
      { id: "34", from: 4, to: 4, data: "hello4-4" },
      { id: "35", from: 5, to: 7, data: "hello5-7" },
      { id: "36", from: 5, to: 6, data: "hello5-6" },
      { id: "37", from: 5, to: 5, data: "hello5-5" },
      { id: "38", from: 6, to: 7, data: "hello6-7" },
      { id: "39", from: 6, to: 6, data: "hello6-6" },
      { id: "41", from: 7, to: 7, data: "hello7-7" },
    ],
  },
  {
    id: 2,
    title: "Look #1",
    memo: "수선중",
    imgSrc: sample2,
    weekData: [],
  },
];

function getUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 3) | 8;
    return v.toString(16);
  });
}
