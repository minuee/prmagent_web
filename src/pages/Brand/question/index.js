import React, { useCallback } from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";

import Add from "./Add";
import List from "./List";
import Detail from "./Detail";
import Constants from '../../../utils/constants';

const Container = styled.div`
  display: flex;
  justify-content: center;
  width:calc(100%-25px);
  margin-left:25px;
`;

const QuestionWrap = styled.div`
  width:100%;    
`;

const Title = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  margin-bottom: 36px;
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
          border-top: 2px solid #7ea1b2;
          border-left: 2px solid #7ea1b2;
          border-right: 2px solid #7ea1b2;
          color: #7ea1b2;
        `
      : css`
          border-bottom: 2px solid #7ea1b2;
          color: #999999;
        `}
`;

export default function Question({ match }) {
  const history = useHistory();
  const QNA_NO = match.params.qna_no === undefined ? 0 : match.params.qna_no;
  const LIST_YN = match.params.qna_no === undefined ? false : true;
  const DETAIL_YN = LIST_YN && QNA_NO > 0 ? true : false;

  const handleTabMenu = useCallback((tab) => {
    if (tab === "add") {
      history.push("/brand/question");
    } else if (tab === "list") {
      history.push("/brand/question/list");
    }
  });

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
              문의내역 확인
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
