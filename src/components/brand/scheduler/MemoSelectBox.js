import React from "react";
import styled, { css } from "styled-components";

function MemoSelectBox({ value, setValue, opt, width }) {
  return (
    <Select
      value={value}
      onChange={(v) => setValue(v.target.value)}
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
  border: solid 1px #dddddd;
  border-radius: 5px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: bold;
  font-family: "Noto Sans KR";
  text-transform: uppercase;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  ::ms-expand {
    display: none;
  }
  background: url("/images/common/select_down.svg") no-repeat calc(100% - 10px)
    50%;
`;

export default React.memo(MemoSelectBox);
