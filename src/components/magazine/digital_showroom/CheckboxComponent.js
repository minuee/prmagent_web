import React, { useState } from "react";
import styled, { css } from "styled-components";

import CheckOn from "assets/digitalshowroom/check_on.svg";
import CheckOff from "assets/digitalshowroom/check_off.svg";

export default function CheckboxComponents({ check, setCheck }) {
  return (
    <>
      <Container>
        <Check active={check === "all"} onClick={() => setCheck("all")}>
          <img src={check === "all" ? CheckOn : CheckOff} alt="" />
          All
        </Check>
        <Check
          active={check === "posession"}
          onClick={() => setCheck("posession")}
        >
          <img src={check === "posession" ? CheckOn : CheckOff} alt="" />
          Possesion
        </Check>
        <Check
          active={check === "notPosession"}
          onClick={() => setCheck("notPosession")}
        >
          <img src={check === "notPosession" ? CheckOn : CheckOff} alt="" />
          Not Possesion
        </Check>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Check = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  > img {
    margin-right: 5px;
  }
  ${(props) =>
    props.active
      ? css`
          font-weight: bold;
          color: #000000;
        `
      : css`
          font-weight: 500;
          color: #999999;
        `}
  & + & {
    margin-top: 10px;
  }
`;
