import React from "react";
import styled from "styled-components";

export default function Selectbox({
  value,
  defaultValue = "-",
  options,
  name,
  height,
  handleChange,
}) {

  return (
    <Container
      value={value}
      onChange={handleChange}
      name={name}
      height={height}
    >
      <option value="" selected>
        {defaultValue}
      </option>
      {options.map((d) => (
        <option key={d.cd_id} value={d.cd_id}>
          {d.cd_nm}
        </option>
      ))}
    </Container>
  );
}

const Container = styled.select`
  width: 100%;
  height: ${(props) => props.height || "42px"};
  border: 1px solid #dddddd;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  padding-left: 14px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  ::ms-expand {
    display: none;
  }
  background: url("/images/common/select_down.svg") no-repeat calc(100% - 10px)
    50%;
`;
