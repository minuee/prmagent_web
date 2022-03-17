import React from "react";
import styled, { css } from "styled-components";

const Container = styled.div`
  width: 800px;
  height: 50px;  
  display: flex;
`;

const GridDiv = styled.div`
  max-width: 66.66666%;
  flex-basis: 66.66666%;
  font-weight: 500;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: -0.35px;
  cursor: pointer;
  padding-top:10px;
  padding-bottom:10px;
  ${(props) =>
    props.active &&
    css`
      border-top: 2px solid #7ea1b2;
      border-left: 2px solid #7ea1b2;
      border-right: 2px solid #7ea1b2;
      color: #7ea1b2;
      padding-bottom: 3px;
    `}

  ${(props) =>
    !props.active &&
    css`
      border-bottom: 2px solid #7ea1b2;
      color: #555555;
    `}

  &:hover {
    color: #7ea1b2;
  }
`;

export default function JoinTab({ nowTab, setNowTab }) {
  return (
    <>
      <Container>
        <GridDiv
          active={nowTab === 0 ? true : false}
          onClick={() => setNowTab(0)}
        >
          <div>Brand</div>
        </GridDiv>
        <GridDiv
          active={nowTab === 1 ? true : false}
          onClick={() => setNowTab(1)}
        >
          <div>Magazine/Stylist</div>
        </GridDiv>
        {/* <GridDiv
          active={nowTab === 2 ? true : false}
          onClick={() => setNowTab(2)}
        >
          <div>Stylist</div>
        </GridDiv> */}
      </Container>
    </>
  );
}
