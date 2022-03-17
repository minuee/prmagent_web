import React from "react";
import styled from "styled-components";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
  // VictoryTooltip,
} from "victory";
import { theme } from "./theme";

function BarChart({ data, title }) {
  const new_colors = [];
  const ticks_value = [];
  const ticks_format = [];
  const new_datas = [];
  const last_datas = data[data.length - 1].name;

  data.forEach((v, i) =>
    i === length - 1 ? new_colors.push("#7ea1b2") : new_colors.push("#dddddd")
  );
  data.forEach((v, i) => ticks_value.push(i + 1));
  data.forEach((v) => ticks_format.push(v.name));
  data.forEach((v) =>
    new_datas.push({
      x: v.name,
      y: v.value,
      label: v.value.toString(),
    })
  );

  return (
    new_datas.length > 0 && (
      <>
        <Title>{title}</Title>
        <Box>
          <VictoryChart domainPadding={40} theme={theme}>
            <VictoryAxis tickValue={ticks_value} tichFormat={ticks_format} />
            <VictoryBar
              name="Bar-1"
              data={new_datas}
              x="x"
              y="y"
              barRatio={0.8}
              style={{
                data: {
                  fill: ({ datum }) =>
                    datum.x === last_datas ? "#7ea1be" : "#bababa",
                },
                labels: {
                  fontSize: "20px",
                  fontWeight: "bold",
                  fontFamily: "Noto Sans KR",
                },
              }}
              labelComponent={
                <VictoryLabel dy={-5} />
                // <VictoryTooltip flyoutStyle={{ fill: "#ffffff" }} />
              }
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onMouseEnter: () => {
                      return [
                        {
                          target: "labels",
                          mutation: (props) => {
                            return (
                              props.datum.x !== last_datas && {
                                text: `${props.datum.y}`,
                              }
                            );
                          },
                        },
                        {
                          target: "data",
                          mutation: (props) =>
                            props.datum.x !== last_datas && {
                              style: { fill: "#7ea1b2" },
                            },
                        },
                      ];
                    },
                    onMouseLeave: () => {
                      return [
                        {
                          target: "labels",
                          mutation: (props) => {
                            return (
                              props.datum.x !== last_datas && {
                                text: "",
                              }
                            );
                          },
                        },
                        {
                          target: "data",
                          mutation: (props) =>
                            props.datum.x !== last_datas && {
                              style: { fill: "#bababa" },
                            },
                        },
                      ];
                    },
                  },
                },
              ]}
            />
          </VictoryChart>
        </Box>
      </>
    )
  );
}

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Box = styled.div`
  width: 100%;
  height: 270px;
`;

export default React.memo(BarChart);
