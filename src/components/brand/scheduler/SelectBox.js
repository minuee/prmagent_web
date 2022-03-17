import React from "react";
import styled, { css } from "styled-components";

export default function SelectBox({
  value,
  setValue,
  setSeasonQuery = null,
  opt,
  width,
}) {
  return (
    <Select
      value={value}
      onChange={(v) => {
        setValue(v.target.value),
          setSeasonQuery !== null &&
            setSeasonQuery(
              opt.find((d) => d.value === parseInt(v.target.value)).season_year,
              opt.find((d) => d.value === parseInt(v.target.value)).season_cd_id
            );
      }}
      width={width}
    >
      {opt.map((d) => (
        <option key={d.value} value={d.value}>
          {d.label}
        </option>
      ))}
    </Select>
  );
}

const Select = styled.select`
  width: ${(props) => props.width || "150px"};
  height: 42px;
  border: none;
  padding: 0 16px;
  font-size: 20px;
  font-weight: bold;
  font-family: Noto Sans KR;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  ::ms-expand {
    display: none;
  }
  background: url("/images/common/select_down_icon.png") no-repeat
    calc(100% - 10px) 50%;
`;
