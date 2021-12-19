import React from "react";
import styled from "styled-components";

const Container = styled.div`
  min-width: ${(props) => props.width || "auto"};
  height: ${(props) => props.height || "auto"};
  margin-right: 20px;
`;

const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  ::ms-expand {
    display: none;
  }

  width: 100%;
  height: 100%;
  border-radius: 5px;
  border: solid 1px #dddddd;
  padding: 0 14px;
  font-size: 16px;
  font-weight: 500;
  font-family: inherit;
  color: #999999;

  background: url("/images/common/select_down.svg") no-repeat calc(100% - 15px)
    50%;
`;

const Option = styled.option`
  width: 100%;
  height: 100%;
`;

export default function SelectInput({
  width,
  height,
  name,
  options,
  value,
  defaultValue = "-",
  handleClick,
}) {
  return (
    <>
      <Container width={width} height={height}>
        <Select value={value} onChange={handleClick} name={name}>
          <Option value="">{defaultValue}</Option>
          {options.map((d) => (
            <Option key={d.value} value={d.value}>
              {d.label}
            </Option>
          ))}
        </Select>
      </Container>
    </>
  );
}
