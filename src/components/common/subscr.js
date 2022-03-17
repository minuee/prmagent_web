import React, { useCallback } from "react";
import styled from "styled-components";
import { darken } from "polished";
import { useHistory } from "react-router-dom";

function Subscr() {
  const history = useHistory();
  const handleClick = useCallback(() => {
    history.push("/brand/my_account");
  });
  return (
    <Container>
      <div>구독 후 이용해 주세요.</div>
      <SubscrBtn onClick={handleClick}>구독하러 가기</SubscrBtn>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 80px;
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
`;

const SubscrBtn = styled.div`
  margin-top: 40px;
  font-size: 14px;
  width: 200px;
  height: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  background-color: #7ea1be;
  color: #ffffff;

  &:hover {
    background-color: ${darken(0.1, "#7ea1be")};
  }
  &:active {
    background-color: ${darken(0.2, "#7ea1be")};
  }
`;

export default React.memo(Subscr);
