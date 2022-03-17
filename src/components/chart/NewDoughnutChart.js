import React from "react";
import styled from "styled-components";
import { VictoryPie, VictoryLabel } from "victory";
import { theme } from "./theme";
import { darken, lighten } from "polished";

function DoughnutChart({ data, title, subTitle }) {
  // const sample = [
  //   {
  //     x: "ELLE",
  //     y: 20,
  //   },
  //   {
  //     x: "MAZED",
  //     y: 50,
  //   },
  //   {
  //     x: "BAZZAR",
  //     y: 70,
  //   },
  //   {
  //     x: "COSMOPOLITAN",
  //     y: 20,
  //   },
  //   {
  //     x: "ARENA",
  //     y: 33,
  //   },
  // ];

  const new_datas = [];
  data.forEach((v) =>
    new_datas.push({
      x: v.name,
      y: v.value,
    })
  );

  return (
    <>
      <Title>
        {title} {subTitle}
      </Title>
      <Box>
        <Text>
          {title}
          <br />
          {subTitle}
        </Text>
        <VictoryPie
          theme={theme}
          innerRadius={90}
          data={new_datas}
          labelRadius={({ innerRadius }) => innerRadius + 25}
          style={{
            labels: { fill: "#000000", fontSize: 12, fontWeight: "bold" },
          }}
          //   events={[
          //     {
          //       target: "data",
          //       eventHandlers: {
          //         onMouseEnter: () => {
          //           return [
          //             {
          //               target: "data",
          //               mutation: (props) => ({
          //                 style: { fill: `${darken(0.1, props.style.fill)}` },
          //               }),
          //             },
          //           ];
          //         },
          //         onMouseLeave: () => {
          //           return [
          //             {
          //               target: "data",
          //               mutation: (props) => ({
          //                 style: { fill: `${lighten(0.1, props.style.fill)}` },
          //               }),
          //             },
          //           ];
          //         },
          //       },
          //     },
          //   ]}
        />
      </Box>
    </>
  );
}

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Box = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
`;

const Text = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 12px;
`;

export default React.memo(DoughnutChart);
