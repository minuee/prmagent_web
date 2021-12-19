import React, { useState } from "react";
import styled, { css } from "styled-components";

import CloseIconOff from "assets/digitalshowroom/close_icon_off.svg";
import CloseIconOn from "assets/digitalshowroom/close_icon_on.svg";

function UnavailableItems({ data, handleClick }) {
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <>
      <SelectDate
        onMouseOver={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        onClick={() => handleClick(data)}
      >
        {data}
        <CloseIconWrap active={mouseOver ? "on" : "off"}>
          <img
            src={mouseOver ? CloseIconOn : CloseIconOff}
            alt=""
            style={{ width: "10px" }}
          />
        </CloseIconWrap>
      </SelectDate>
    </>
  );
}

const SelectDate = styled.div`
  background-color: #7ea1b2;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 5px 5px 10px;
  color: #ffffff;
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
`;

const CloseIconWrap = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  cursor: pointer;

  ${(props) =>
    props.active === "on"
      ? css`
          background-color: #000000;
        `
      : css`
          background-color: #ffffff;
        `}
`;

export default React.memo(UnavailableItems);
