import React, { useState } from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  Tooltip,
  LabelList,
  Label,
} from "recharts";

const TxtWrap = styled.div`
  font-size: ${(props) => props.fontSize || "12px"};
  color: ${(props) => props.color || "#000000"};
  font-weight: ${(props) => props.fontWeight || "normal"};
  margin-right: ${(props) => props.marginRight || 0};
  line-height: ${(props) => props.lineHeight || "unset"};
  text-align: ${(props) => props.textAlign || "left"};
`;

const TootipWrap = styled.div`
  display: flex;
  color: #ffffff;
  background-color: #000000;
  border-radius: 15px;
  width: 80px;
  height: 50px;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  font-size: 20px;
`;

export default function BarChartComp({ data, text }) {
  const [focus, setFocus] = useState(null);

  const handleClick = (data, index) => {
    setFocus(index);
  };

  const new_data = [];
  data.forEach(
    (v, i) =>
      i >= data.length - 7 &&
      new_data.push({
        name: v.name,
        value: v.value,
      })
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active) {
      return (
        <TootipWrap>
          <p className="label">{`+${payload[0].value}`}</p>
        </TootipWrap>
      );
    }

    return null;
  };

  const CustomLabel = (props) => {
    const { x, y, fill, value, width } = props;

    return (
      fill === "#7ea1b2" && (
        <g width="80" height="50">
          <rect
            width="80"
            height="50"
            rx="15"
            ry="15"
            fill="#000000"
            x={x - 25}
            y={y - 52}
          />
          <text
            x={x - 25}
            y={y - 50}
            // textLength="33"
            textAnchor="middle"
            alignmentBaseline="middle"
            transform="translate(40, 25)"
            style={{
              fill: "#fff",
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            +{value}
          </text>
        </g>
      )
    );
  };

  return (
    <>
      <div>
        <TxtWrap fontSize="20px" fontWeight="bold">
          {text}
        </TxtWrap>
        <BarChart
          width={460}
          height={320}
          data={new_data}
          barSize={28}
          margin={{
            top: 50,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="name"
            style={{
              fontWeight: 500,
              fontSize: "12px",
              color: "#bababa",
            }}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            content={<CustomTooltip />}
          />
          <Bar dataKey="value">
            <LabelList
              dataKey="value"
              position="top"
              content={<CustomLabel />}
            />
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={data.length - 1 === index ? "#7ea1b2" : "#bababa"}
              />
              // <Cell
              //   key={`cell-${index}`}
              //   fill={focus === index ? "#7ea1b2" : "#bababa"}
              // />
            ))}
          </Bar>
        </BarChart>
      </div>
    </>
  );
}
