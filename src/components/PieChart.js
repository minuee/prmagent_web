import React from "react";
import styled from "styled-components";
import { PieChart, Pie, Cell } from "recharts";

import { COMPANY_COLOR_LIST } from "mock/Mock";

const TxtWrap = styled.div`
  font-size: ${(props) => props.fontSize || "12px"};
  color: ${(props) => props.color || "#000000"};
  font-weight: ${(props) => props.fontWeight || "normal"};
  margin-right: ${(props) => props.marginRight || 0};
  line-height: ${(props) => props.lineHeight || "unset"};
  text-align: ${(props) => props.textAlign || "left"};
`;

const TitleWrap = styled.div`
  position: relative;
  font-size: 12px;
  font-weight: normal;
  width: 154px;
  color: #222222;
`;

const TitleDiv = styled.div`
  position: absolute;
  width: 100%;
  top: 148px;
  left: 128px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function PieChartComp({ data, title, subTitle }) {
  // const COLORS = ["#7ea1b2", "#e1c668", "#ff958d", "#8cc1a7"];

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    // data,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN) - 3;
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <>
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          style={{
            fontSize: "13px",
            fill: "#000000",
            fontWeight: "500",
          }}
        >
          {data[index].name}
        </text>
      </>
    );
  };

  return (
    <>
      <div>
        <TxtWrap fontSize="20px" fontWeight="bold">
          {title} {subTitle}
          <TitleWrap>
            <TitleDiv>
              <div>{title}</div>
              <div>{subTitle}</div>
            </TitleDiv>
          </TitleWrap>
        </TxtWrap>
        <PieChart width={460} height={320}>
          <Pie
            data={data}
            dataKey="value"
            cx={200}
            cy={160}
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={140}
            innerRadius={80}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COMPANY_COLOR_LIST[index % 18]} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </>
  );
}
