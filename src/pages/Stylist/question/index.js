import React from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";

import Add from "./Add";
import List from "./List";
import Detail from "./Detail";

const Container = styled.div`
  display: flex;
  @media (min-width: 1920px) {
    width: 1480px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 950px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 600px
  }  
`;

const QuestionWrap = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 56px;
`;

const TabMenu = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.div`
  width: 50%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  ${(props) =>
    props.active
      ? css`
          border-top: 2px solid #000000;
          border-left: 2px solid #000000;
          border-right: 2px solid #000000;
          color: #000000;
        `
      : css`
          border-bottom: 2px solid #000000;
          color: #999999;
        `}
`;

export default function Question({ match }) {
  const history = useHistory();
  const QNA_NO = match.params.qna_no === undefined ? 0 : match.params.qna_no;
  const LIST_YN = match.params.qna_no === undefined ? false : true;
  const DETAIL_YN = LIST_YN && QNA_NO > 0 ? true : false;

  const handleTabMenu = (tab) => {
    if (tab === "add") {
      history.push("/stylist/question");
    } else if (tab === "list") {
      history.push("/stylist/question/list");
    }
  };

  return (
    <>
      <Container>
        <QuestionWrap>
          <Title>Question</Title>
          <TabMenu>
            <Tab
              active={!LIST_YN ? true : false}
              loc="left"
              onClick={() => handleTabMenu("add")}
            >
              문의하기
            </Tab>
            <Tab
              active={LIST_YN ? true : false}
              loc="right"
              onClick={() => handleTabMenu("list")}
            >
              문의내역확인
            </Tab>
          </TabMenu>
          {!LIST_YN && <Add />}
          {LIST_YN && !DETAIL_YN && <List />}
          {LIST_YN && DETAIL_YN && <Detail qnaNo={QNA_NO} />}
        </QuestionWrap>
      </Container>
    </>
  );
}
