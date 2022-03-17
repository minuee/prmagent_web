import React from "react";
import styled, { css } from "styled-components";

// const Text = styled(Typography)`
const Text = styled.div`
  width: ${(props) => props.width || "auto"};
  height: ${(props) => props.height || "auto"};
  font-size: ${(props) => props.fontSize || "12px"};
  font-weight: ${(props) => props.fontWeight || "normal"};
  color: ${(props) => props.color || "#000000"};
  ${(props) =>
    props.lineHeight &&
    css`
      line-height: ${props.lineHeight};
    `}
`;

export default function TextComponent({
  width,
  height,
  fontSize,
  color,
  fontWeight,
  lineHeight,
  text,
}) {
  return (
    <>
      <Text
        width={width}
        height={height}
        fontSize={fontSize}
        fontWeight={fontWeight}
        lineHeight={lineHeight}
        color={color}
      >
        {text}
      </Text>
    </>
  );
}
