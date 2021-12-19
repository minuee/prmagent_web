import React from "react";
import styled, { css } from "styled-components";
import dayjs from "dayjs";
import utils from "utils";
import { useDispatch, useSelector } from "react-redux";
import { darken } from "polished";
import CHECKON from 'assets/circle_check_on.png';

export default function Print({ data, footer ,view,handleEachSendOut=null,handleEachReturns=null}) {
  const reducer = useSelector((state) => state.reducer);
  console.log('reducerreducerreducer',reducer.myUser.username);
  console.log('datadatadata',data);
  if ( utils.isEmpty(data)) {
    return (
      <Nodata>
        잘못된 접근입니다.
      </Nodata>
    )
  }else{
 
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
            <HeaderContent>{data.studio} {data.studio_detail}</HeaderContent>
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
                  {
                  !utils.isEmpty(d.sample_list) &&
                  d.sample_list.map((v, i) => (
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
                          { view === 'sendout' ?
                          <TbodyTd bg="#d78979">
                            {utils.isEmpty(v.send_user_info) ? data.brand_nm : v.send_user_info?.[0].user_nm}
                            ({utils.isEmpty(v.send_user_info) ? '' : v.send_user_info?.[0].position})
                          </TbodyTd>
                          :
                          <TbodyTd bg="#d78979">                          
                            {data.to_user_nm}
                            </TbodyTd>
                          }                    
                        
                          { 
                          view === 'sendout' ?
                          <TbodyTd bg="#e1c668">                         
                            {utils.isEmpty(v.use_user_info) ? data.to_user_nm : v.use_user_info?.[0].user_nm}
                            {utils.isEmpty(v.use_user_info) ? '' : "("+v.use_user_info?.[0].position+")"}
                          </TbodyTd>
                          :
                          <TbodyTd bg="#e1c668">
                            {utils.isEmpty(v.return_user_info) ? data.brand_nm : v.return_user_info?.[0].user_nm}
                            {utils.isEmpty(v.return_user_info) ? '' : v.return_user_info?.[0].position}
                            ({utils.isEmpty(v.return_user_info) ? data.brand_nm : v.return_user_info?.[0].mgzn_nm})
                            </TbodyTd>
                          }
                      </TBodyTr>
                      <TBodyTr>
                        <TbodyTd>{utils.numberWithCommas(v.price)}</TbodyTd>
                        { view === 'sendout' ?
                        <TbodyTd>
                          {utils.isEmpty(v.send_user_info) ? utils.phoneFormat(data.from_user_phone) : utils.phoneFormat(v.send_user_info?.[0].phone_no)}
                        </TbodyTd>
                        :
                        <TbodyTd>
                          {utils.isEmpty(v.use_user_info) ? utils.phoneFormat(data.from_user_phone) : utils.phoneFormat(v.use_user_info?.[0].phone_no)}
                        </TbodyTd>
                        }
                        <TbodyTd>
                          { view === 'sendout' ?
                            utils.phoneFormat(data.to_user_phone)
                            :
                            utils.phoneFormat(data.from_user_phone)
                          }
                        </TbodyTd>
                      </TBodyTr>
                      {d.sample_list.length === 1 && (
                        <TBodyTr>
                          <TbodyTd></TbodyTd>
                          <TbodyTd2>
                            {
                              view === 'sendout' && (
                              v.sendout_yn ?
                              <><img src={CHECKON} alt="date" style={{width:15,height:15}} /></>
                              :
                              v.send_user_info[0].sendout_id == reducer.myUser.username ?
                              <SendBtn onClick={()=>handleEachSendOut(data.req_no, v.sample_no)}>발송하기</SendBtn>
                              :
                              null
                              )
                            }
                            {
                              (view === 'return' && v.return_yn ) &&
                              <><img src={CHECKON} alt="date" style={{width:15,height:15}} /></>
                            }
                          </TbodyTd2>
                          <TbodyTd2>
                            
                            {
                              view === 'return' && (
                              v.returncheck_yn ?
                              <><img src={CHECKON} alt="date" style={{width:15,height:15}} /></>
                              :
                              v.return_user_info[0].return_id == reducer.myUser.username ?
                              <SendBtn onClick={()=>handleEachReturns(data.req_no, v.sample_no)}>반납완료처리</SendBtn>
                              :
                              null
                              )   
                            }
                            
                          </TbodyTd2>
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
}
const Nodata = styled.div`
  height: 186px;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  padding-left: 30px;
`;

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
      background-size: cover;
    `}
`;
const TbodyTd2 = styled.td`
  border: solid 1px #000000;
  word-wrap: break-word;
  font-size: 13px;
  background-color: ;${(props) => props.bg || "#ffffff"};
  align-items: center;
  justify-content: center;
  width: 100%;
  ${(props) =>
    props.imgUrl &&
    css`
      background: url("${(props) => props.imgUrl}") no-repeat center;
      background-size: cover;
    `}
`;

const SendBtn = styled.div`
  width: 80px;
  height: 20px;
  cursor: pointer;
  border-radius: 3px;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);
  background-color: #000000;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  margin-left:60px;
  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
  }
  &:active {
    background-color: ${darken(0.2, "#7ea1b2")};
  }
`;