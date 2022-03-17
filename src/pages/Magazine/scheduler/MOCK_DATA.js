import item1 from "assets/scheduler/mock/item1.png";
import item2 from "assets/scheduler/mock/item2.png";
import item3 from "assets/scheduler/mock/item3.png";
import item4 from "assets/scheduler/mock/item4.png";
import item5 from "assets/scheduler/mock/item5.png";
import item6 from "assets/scheduler/mock/item6.png";
import item7 from "assets/scheduler/mock/item7.png";
import item8 from "assets/scheduler/mock/item8.png";
import item9 from "assets/scheduler/mock/item9.png";

import model1 from "assets/scheduler/mock/model1.png";
import model2 from "assets/scheduler/mock/model2.png";
import model3 from "assets/scheduler/mock/model3.png";
import model4 from "assets/scheduler/mock/model4.png";
import model5 from "assets/scheduler/mock/model5.png";
import model6 from "assets/scheduler/mock/model6.png";

import brand1 from "assets/scheduler/mock/logo1.png";
import item1_1 from "assets/scheduler/mock/item1-1.png";
import item1_2 from "assets/scheduler/mock/item1-3.png";
import item1_3 from "assets/scheduler/mock/item1-2.png";
import item1_4 from "assets/scheduler/mock/item1-4.png";

const MOCK_DATA = {
  byDates: [
    {
      id: 1,
      date: "8/1",
      day: "SAT",
      count: 6,
      cardData: [
        {
          id: "id-1",
          brandName: "GUCCI",
          images: [item1, model1],
          chip: false,
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
        {
          id: "id-2",
          brandName: "GIVENCHY",
          images: [item2, model2],
          chip: false,
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
        {
          id: "id-3",
          brandName: "BALENCIAGA",
          images: [item3, model3],
          chip: false,
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
        {
          id: "id-4",
          brandName: "LOUIS VUITTON",
          images: [item4, model4],
          chip: "plane",
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
        {
          id: "id-5",
          brandName: "PRADA",
          images: [item5],
          chip: "cash",
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
        {
          id: "id-6",
          brandName: "GUCCI",
          images: [item6, model5],
          chip: false,
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
      ],
    },
    {
      id: 2,
      date: "8/2",
      day: "SUN",
      count: 4,
      cardData: [
        {
          id: "id-1",
          brandName: "BOTTEGA VENETA",
          images: [item7, model6],
          chip: false,
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
        {
          id: "id-2",
          brandName: "GIVENCHY",
          images: [item8, model5],
          chip: false,
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
        {
          id: "id-3",
          brandName: "BALENCIAGA",
          images: [item9, model4],
          chip: false,
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
        {
          id: "id-4",
          brandName: "LOUIS VUITTON",
          images: [item1, model1],
          chip: "plane",
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
      ],
    },
  ],
  byBrand: [
    {
      id: 1,
      brandName: "GUCCI",
      count: 16,
      cardData: [
        {
          id: "id-1",
          brandName: "GUCCI",
          images: [item1, model1],
          chip: false,
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
        {
          id: "id-2",
          brandName: "GIVENCHY",
          images: [item2, model2],
          chip: false,
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
        {
          id: "id-3",
          brandName: "BALENCIAGA",
          images: [item3, model3],
          chip: false,
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
        {
          id: "id-4",
          brandName: "LOUIS VUITTON",
          images: [item4, model4],
          chip: "plane",
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
        {
          id: "id-5",
          brandName: "PRADA",
          images: [item5],
          chip: "cash",
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
        {
          id: "id-6",
          brandName: "GUCCI",
          images: [item6, model5],
          chip: false,
          detail: {
            images: [item1_1, item1_2, item1_3, item1_4],
            brandLogo: brand1,
            name: "이진선 ed",
            date: "2020-08-20",
            title: "FW 키룩 촬영",
            studioName: "박현구 스튜디오",
            studioAddress: "강남구 신사동 542-7 B1",
            managerName: "김지영 as",
            managerPhone: "010-7104-5568",
          },
        },
      ],
    },
  ],
};

export default MOCK_DATA;
