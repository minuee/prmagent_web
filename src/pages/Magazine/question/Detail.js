import React from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { darken } from "polished";
import { useHistory } from "react-router-dom";

import ReplyIcon from "assets/reply_icon.svg";
import { apiObject } from "api/api_magazine";
import Progress from "components/common/progress";

const Container = styled.div`
  width:100%;
`;

const Title = styled.div``;

const Table = styled.table`
  border-spacing: 0;
  margin-bottom: 50px;
  width: 100%;
`;

const THeadTr = styled.tr``;

const THeadTh01 = styled.th`
  color: #7ea1b2;
  font-weight: 500;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  width: 8%;
  padding: 15px 0;
`;

const THeadTh02 = styled.th`
  font-weight: normal;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  padding: 15px 20px 15px 0;
  text-align: left;
`;

const THeadTh03 = styled.th`
  color: #999999;
  font-weight: normal;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
  width: 10%;
  padding: 15px 0;
`;

const TBody = styled.tbody`
  background-color: #f7f8fa;
`;

const TBodyTd01 = styled.td`
  padding: 20px 0 44px 0;
`;

const TBodyTd02 = styled.td`
  position: relative;
  width: 5%;
  border-top: 1px solid #dddddd;
`;

const TBodyTd03 = styled.td`
  padding: 20px 0 44px 0;
  font-size: 14px;
  color: #555555;
  border-top: 1px solid #dddddd;
`;

const TBodyTd04 = styled.td`
  padding: 20px 0;
  font-size: 14px;
  color: #555555;
`;

const TBodyTd05 = styled.td`
  padding: 20px 0 44px 0;
  font-size: 14px;
  color: #999999;
  border-top: 1px solid #dddddd;
  vertical-align: top;
  text-align: center;
`;

const ReplyDiv = styled.div`
  display: flex;
  img {
    position: absolute;
    top: 18px;
  }
`;

const ReplyTxt = styled.div`
  width: 30px;
  height: 20px;
  background-color: #7ea1b2;
  font-size: 12px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 18px;
  right: 7px;
`;

const ButtonWrap = styled.div`
  margin: 60px 0 80px 0;
  display: flex;
  justify-content: flex-end;
`;

const Btn = styled.div`
  width: 200px;
  height: 60px;
  border-radius: 5px;
  background-color: #7ea1b2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);
  transition: all 0.3s;

  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
  }
  &:active {
    background-color: ${darken(0.2, "#7ea1b2")};
  }
`;

export default function QuestionDetail({ qnaNo }) {
  const history = useHistory();
  const detailQuery = useQuery(
    ["qna-detail", qnaNo],
    async () =>
      await apiObject.getQnaDetail({
        sys_inqry_no: qnaNo,
      })
  );

  const handleList = () => {
    history.push("/magazine/question/list");
  };

  const detailData = detailQuery.isLoading ? [] : detailQuery.data;

  if (detailQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <Container>
      <Title>
        <Table>
          <thead>
            <THeadTr>
              <THeadTh01>
                {detailData.answer_yn ? "답변 완료" : "답변 대기"}
              </THeadTh01>
              <THeadTh02 colSpan={2}>{detailData.inqry_subj}</THeadTh02>
              <THeadTh03>{detailData.inqry_user_nm}</THeadTh03>
              <THeadTh03>
                {dayjs.unix(detailData.inqry_dt).format("YYYY.MM.DD")}
              </THeadTh03>
            </THeadTr>
          </thead>
          <TBody>
            <tr>
              <td></td>
              <TBodyTd04 colSpan={2}>
                {detailData.inqry_cntent.split("\n").map((line, i) => {
                  return (
                    <span key={`q_${i}`}>
                      {line}
                      <br />
                    </span>
                  );
                })}
              </TBodyTd04>
              <td></td>
              <td></td>
            </tr>
            {detailData.answer_yn && (
              <tr>
                <TBodyTd01 />
                <TBodyTd02>
                  <ReplyDiv>
                    <img src={ReplyIcon} alt="reply" />
                    <ReplyTxt>답변</ReplyTxt>
                  </ReplyDiv>
                </TBodyTd02>
                <TBodyTd03>
                  {detailData.answer_cntent.split("\n").map((line, i) => {
                    return (
                      <span key={`a_${i}`}>
                        {line}
                        <br />
                      </span>
                    );
                  })}
                </TBodyTd03>
                <TBodyTd05>{detailData.answer_user_nm}</TBodyTd05>
                <TBodyTd05>
                  {dayjs.unix(detailData.answer_dt).format("YYYY.MM.DD")}
                </TBodyTd05>
              </tr>
            )}
          </TBody>
        </Table>
      </Title>
      <ButtonWrap>
        <Btn onClick={handleList}>List</Btn>
      </ButtonWrap>
    </Container>
  );
}
