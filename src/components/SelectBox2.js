import React, { useState, useRef } from "react";
import styled from "styled-components";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { darken } from "polished";

import useOutsideClick from "./UseOutsideClick";

const Container = styled.div`
  position: relative;
  top:0;
  left:0;
  width:100%;
  height:auto;
`;

const DrowdownWrap = styled.div`
  display: flex;
  align-items: center;
  padding-left: 13px;
  position: relative;
  cursor: pointer;
  background-color: none;

  width: ${(props) => props.width || "auto"};
  height: ${(props) => props.height || "auto"};
  font-size: ${(props) => props.fontSize || "0.8571428571428571rem"};
  border: 1px solid #b7b7b7;
  color: rgba(0, 0, 0, 0.4);
`;

const SubContainer = styled.div`
  border: 1px solid #b7b7b7;
  border-top: none;
  position: absolute;
  top:${(props) => props.height || "37px"};
  left:0;
  width: ${(props) => props.width || "auto"};
  z-index: 10;
  background-color: #fafafa;
`;

const Options = styled.div`
  cursor: pointer;
  height: 40px;
  font-size: 14px;
  padding-left: 13px;
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.4);

  &:hover {
    color: #000000;
    background-color: ${darken(0.1, "#ffffff")};
  }
`;

export default function SelectBox({
  width,
  height,
  fontSize,
  text,
  name,
  options,
  value,
  handleChange,
  isdrawer =  true,
  addWidth = 0
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const handleClick = (data) => {
    setOpen(false);
    handleChange(name, data);
  };

  useOutsideClick(ref, () => {
    setOpen(false);
  });

  return (
    <>
      <Container onClose={() => setOpen(false)} ref={ref}>
        <DrowdownWrap
          width={isdrawer ? addWidth : width}
          height={height}
          fontSize={fontSize}
          onClick={() => setOpen(!open)}
        >
          <div>
            {value === ""
              ? text
              : options.map((v) => v.value === value && v.label)}
          </div>
          <div
            style={{
              position: "absolute",
              right: "6px",
              top: "6px",
              color: "#000000",
            }}
          >
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
        </DrowdownWrap>
        {open && options !== "" && (
          <SubContainer width={isdrawer ? addWidth : width}>
            {options.map((d) => (
              <Options key={d.value} onClick={() => handleClick(d.value)}>
                {d.label}
              </Options>
            ))}
          </SubContainer>
        )}
        {open && options === "" && (
          <SubContainer width={width}>
            <Options onClick={() => setOpen(false)}>
              조회된 팀원이 없습니다.
            </Options>
          </SubContainer>
        )}
      </Container>
    </>
  );
}
