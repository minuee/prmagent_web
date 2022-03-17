import React from "react";
import styled, { css } from "styled-components";
import dayjs from "dayjs";
import utils from "utils";

export default function Print({ data, footer }) {
  return (
    <Container>
      <Title>{data.brand_nm}</Title>
      <Header>
        <HeaderRow>
          <HeaderTitle>Magazine</HeaderTitle>
          <HeaderContent>{data.mgzn_nm}</HeaderContent>
        </HeaderRow>
        <HeaderRow>
          <HeaderTitle>Editor/Stylist</HeaderTitle>
          <HeaderContent>{data.req_user_nm}</HeaderContent>
        </HeaderRow>
        <HeaderRow>
          <HeaderTitle>Assistant</HeaderTitle>
          <HeaderContent>
            <HeaderContentDetailTitle>
              {data.contact_user_nm}
            </HeaderContentDetailTitle>
            <HeaderContentDetailWrap>
              <HeaderContentDetail1>연락처</HeaderContentDetail1>
              <HeaderContentDetail2>
                {utils.phoneFormat(data.contact_user_phone)}
              </HeaderContentDetail2>
            </HeaderContentDetailWrap>
          </HeaderContent>
        </HeaderRow>
        <HeaderRow>
          <HeaderTitle>픽업일</HeaderTitle>
          <HeaderContent>
            {dayjs.unix(data.loaning_date).format("MM월 DD일")}
          </HeaderContent>
        </HeaderRow>
        <HeaderRow>
          <HeaderTitle>촬영일</HeaderTitle>
          <HeaderContent>
            {dayjs.unix(data.shooting_date).format("MM월 DD일")}
          </HeaderContent>
        </HeaderRow>
        <HeaderRow>
          <HeaderTitle>반납일</HeaderTitle>
          <HeaderContent>
            {dayjs.unix(data.returning_date).format("MM월 DD일")}
            {/* <HeaderContentDetailTitle>
              {dayjs.unix(data.returning_date).format("MM월 DD일")}
            </HeaderContentDetailTitle>
            <HeaderContentDetailWrap>
              <HeaderContentDetail1>Studio</HeaderContentDetail1>
              <HeaderContentDetail2>{data.studio}</HeaderContentDetail2>
            </HeaderContentDetailWrap> */}
          </HeaderContent>
        </HeaderRow>
        <HeaderRow>
          <HeaderTitle>Studio</HeaderTitle>
          <HeaderContent>{data.studio}</HeaderContent>
        </HeaderRow>
      </Header>

      <Content>
        <Table>
          <thead></thead>
          <tbody>
            <tr style={{ height: "24px" }}>
              <THeadTh style={{ width: "15%" }}>Look#</THeadTh>
              <THeadTh style={{ width: "15%" }}></THeadTh>
              <THeadTh style={{ width: "10%" }}></THeadTh>
              <THeadTh>From</THeadTh>
              <THeadTh>Shoot</THeadTh>
            </tr>
            {
            !utils.isEmpty(data.showroom_list) &&
            data.showroom_list.map((d) => (
              <React.Fragment key={d.showroom_no}>
                {d.sample_list.map((v, i) => (
                  <React.Fragment key={v.sample_no}>
                    <TBodyTr>
                      {i === 0 && (
                        <TbodyTd
                          rowSpan={
                            d.sample_list.length > 1
                              ? d.sample_list.length * 2
                              : 3
                          }
                        >
                          {d.showroom_nm}
                        </TbodyTd>
                      )}
                      <TbodyTd>{v.category}</TbodyTd>
                      {i === 0 && (
                        <TbodyTd
                          rowSpan={
                            d.sample_list.length > 1
                              ? d.sample_list.length * 2
                              : 3
                          }
                          imgUrl={v.image_list[0]}
                        ></TbodyTd>
                      )}
                      <TbodyTd bg="#d78979">
                        {data.brand_nm} {data.from_user_nm}
                      </TbodyTd>
                      <TbodyTd bg="#e1c668">
                        {data.mgzn_nm} {data.to_user_nm}
                      </TbodyTd>
                    </TBodyTr>
                    <TBodyTr>
                      <TbodyTd>{utils.numberWithCommas(v.price)}</TbodyTd>
                      <TbodyTd>
                        {utils.phoneFormat(data.from_user_phone)}
                      </TbodyTd>
                      <TbodyTd>{utils.phoneFormat(data.to_user_phone)}</TbodyTd>
                    </TBodyTr>
                    {d.sample_list.length === 1 && (
                      <TBodyTr>
                        <TbodyTd></TbodyTd>
                        <TbodyTd></TbodyTd>
                        <TbodyTd></TbodyTd>
                      </TBodyTr>
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  paddingTop: "15px",
                }}
                colSpan={5}
              >
                {footer}
              </td>
            </tr>
          </tbody>
        </Table>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  page-break-before: always;
`;

const Title = styled.div`
  width: 100%;
  height: 50px;
  font-size: 30px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const Header = styled.div`
  font-size: 14px;
`;

const HeaderRow = styled.div`
  display: flex;
  height: 20px;
  align-items: center;
  margin-bottom: 5px;
`;

const HeaderTitle = styled.div`
  font-weight: bold;
  width: 125px;
  height: 20px;
`;

const HeaderContent = styled.div`
  width: 100%;
  height: 20px;
  font-size: 12px;
  font-weight: normal;
  border-bottom: solid 1px #dddddd;
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

const HeaderContentDetailTitle = styled.div`
  width: 40%;
`;

const HeaderContentDetailWrap = styled.div`
  display: flex;
`;

const HeaderContentDetail1 = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-right: 30px;
  margin-bottom: 2px;
  align-items: center;
`;

const HeaderContentDetail2 = styled.div`
  display: flex;
  height: 20px;
  align-items: flex-end;
`;

const Content = styled.div`
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  font-size: 10px;
  table-layout: fixed;
  border-collapse: collapse;
  page-break-after: always;
`;

const THeadTh = styled.th`
  border: solid 1px #000000;
`;

const TBodyTr = styled.tr`
  height: 24px;
  text-align: center;
  page-break-after: always;
`;

const TbodyTd = styled.td`
  border: solid 1px #000000;
  word-wrap: break-word;
  background-color: ${(props) => props.bg || "#ffffff"};

  ${(props) =>
    props.imgUrl &&
    css`
      background: url("${(props) => props.imgUrl}") no-repeat center;
      background-size: contain;
    `}
`;
