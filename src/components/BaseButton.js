import React from "react";
import { darken, lighten } from "polished";
import styled, { css } from "styled-components";

/*
    width: 버튼 넓이
    height: 버튼 높이
    color: 버튼 배경색
    type: filled / outlined
    hoverType: hover 배경색 타입
    text: 버튼 Text
*/

const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: ${(props) => props.fontWeight || "500"};
  font-size: ${(props) => props.fontSize || "12px"};
  width: ${(props) => props.width || "auto"};
  height: ${(props) => props.height || "auto"};
  color: ${(props) => props.textColor || "#000000"};

  ${(props) =>
    props.type === "filled" &&
    css`
      background-color: ${props.color};
      ${props.hoverType === "lighten" &&
      css`
        &:hover {
          background-color: ${lighten(0.1, props.color)};
        }
      `}
      ${props.hoverType === "darken" &&
      css`
        &:hover {
          background-color: ${darken(0.1, props.color)};
        }
      `}
    `}

  ${(props) =>
    props.type === "outlined" &&
    css`
      border: 1px solid ${props.color};
      ${props.hoverType === "lighten" &&
      css`
        &:hover {
          border: 1px solid ${lighten(0.1, props.color)};
        }
      `}
      ${props.hoverType === "darken" &&
      css`
        &:hover {
          border: 1px solid ${darken(0.1, props.color)};
          background-color: ${darken(0.1, "#ffffff")};
        }
      `}
    `}
`;

export default function BaseButton({
  width,
  height,
  type,
  color,
  textColor,
  fontSize,
  fontWeight,
  hoverType = "darken",
  text,
  handleClick,
}) {
  return (
    <>
      <ButtonWrap
        width={width}
        height={height}
        type={type}
        color={color}
        textColor={textColor}
        fontSize={fontSize}
        fontWeight={fontWeight}
        hoverType={hoverType}
        onClick={handleClick}
      >
        {text}
      </ButtonWrap>
    </>
  );
}
