import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import dayjs from "dayjs";
import utils from "utils";
import { useDispatch, useSelector } from "react-redux";
import { darken } from "polished";
import CHECKON from 'assets/circle_check_on.png';

export default function Print({ data, footer ,view,handleEachPickup=null,handleEachReturn=null}) {
  //console.log('PrintPrintPrint',data,view)
  const reducer = useSelector((state) => state.reducer);
  const [newSendOutDate, setChangeSendoutDate] = useState(null);
  const [newReturnDate, setChangeReturnDate] = useState(null);
  useEffect(async() => {
    if ( !utils.isEmpty(data)) {
      if ( view === 'pickups') {
        const loaning_date = dayjs.unix(data.loaning_date).format("YYYY-MM-DD");
        if ( !utils.isEmpty(data.showroom_list) ) {
          data.showroom_list.forEach((item1,i1) => {
            if ( !utils.isEmpty(item1.sample_list) ) {
              item1.sample_list.forEach((item2,i2) => {
                if ( utils.dateToDate(item2.sendout_dt) !== loaning_date ) {
                  setChangeSendoutDate(utils.dateToDate(item2.sendout_dt));
                }
              })
            }
          }
        )}
      }else if ( view === 'sendout') {
        const returning_date = dayjs.unix(data.returning_date).format("YYYY-MM-DD");
        if ( !utils.isEmpty(data.showroom_list) ) {
          data.showroom_list.forEach((item1,i1) => {
            if ( !utils.isEmpty(item1.sample_list) ) {
              item1.sample_list.forEach((item2,i2) => {
                if ( utils.dateToDate(item2.return_dt) !== returning_date ) {
                  setChangeReturnDate(utils.dateToDate(item2.return_dt));
                }
              })
            }
          }
        )}
      }
    }
  }, []);

  if ( utils.isEmpty(data)) {
    return (
      <Nodata>
        no data
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
            {!utils.isEmpty(newSendOutDate) && (
              <FontRedPadding>(일부 픽업일 변경 : {utils.dateToDateMMDD(newSendOutDate)})</FontRedPadding>
            )}
            
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
            {!utils.isEmpty(newReturnDate) && (
              <FontRedPadding>(일부 반납(전달)일 변경 : {utils.dateToDateMMDD(newReturnDate)})</FontRedPadding>
            )}
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
                      
                        { view === 'pickups' ?
                        <TbodyTdWrap bg="#d78979">
                          {utils.isEmpty(v.send_user_info) ? data.brand_nm : v.send_user_info?.[0].user_nm}
                          {utils.isEmpty(v.send_user_info) ? '' : v.send_user_info?.[0].position}
                          ({utils.isEmpty(v.send_user_info) ? data.brand_nm : v.send_user_info?.[0].mgzn_nm})
                          {/* { (view === 'pickups' && v.pickup_yn ) &&
                            <img src={CHECKON} alt="date" style={{width:9,height:10,marginTop:2}} />
                          } */}
                          { dayjs.unix(data.loaning_date).format("YYYY-MM-DD") !== utils.dateToDate(v.sendout_dt) &&
                          <><br />픽업일 ({utils.dateToDate(v.sendout_dt)})</>
                          }
                          
                        </TbodyTdWrap>
                        :
                        <TbodyTdWrap bg="#d78979">                          
                          {data.to_user_nm}
                          { dayjs.unix(data.returning_date).format("YYYY-MM-DD") !== utils.dateToDate(v.return_dt) &&
                          <><br />전달일 ({utils.dateToDate(v.return_dt)})</>
                          }                          
                          {
                            (view === 'sendout' && v.return_yn ) &&
                            <>  <img src={CHECKON} alt="date" style={{width:9,height:10,marginTop:2}} /></>
                          }
                          </TbodyTdWrap>
                        }                    
                      
                        { 
                         view === 'pickups' ?
                         <TbodyTd bg="#e1c668">
                          {data.to_user_nm}
                          {
                              (view === 'pickups' && v.pickup_yn ) &&
                              <>  <img src={CHECKON} alt="date" style={{width:9,height:10,marginTop:2}} /></>
                            }
                         </TbodyTd>
                         :
                         <TbodyTd bg="#e1c668">
                          {utils.isEmpty(v.return_user_info) ? data.brand_nm : v.return_user_info?.[0].user_nm}
                          {utils.isEmpty(v.return_user_info) ? '' : v.return_user_info?.[0].position}
                          ({utils.isEmpty(v.return_user_info) ? data.brand_nm : v.return_user_info?.[0].mgzn_nm})
                          {
                            (view === 'sendout' && v.returncheck_yn ) &&
                            <>  <img src={CHECKON} alt="date" style={{width:9,height:10,marginTop:2}} /></>
                          }
                          
                          </TbodyTd>
                        }
                    </TBodyTr>
                    <TBodyTr>
                      <TbodyTd>{utils.numberWithCommas(v.price)}</TbodyTd>
                      { view === 'pickups' ?
                      <TbodyTd>                        
                        {utils.isEmpty(v.send_user_info) ? utils.phoneFormat(data.from_user_phone) : utils.phoneFormat(v.send_user_info?.[0].phone_no)}
                      </TbodyTd>
                      :
                      <TbodyTd>
                        {utils.isEmpty(v.use_user_info) ? utils.phoneFormat(data.from_user_phone) : utils.phoneFormat(v.use_user_info?.[0].phone_no)}
                      </TbodyTd>
                      }
                      <TbodyTd>
                        {utils.isEmpty(v.return_user_info) ? utils.phoneFormat(data.to_user_phone) : utils.phoneFormat(v.return_user_info?.[0].phone_no)}                        
                      </TbodyTd>
                    </TBodyTr>
                    {d.sample_list.length === 1 && (
                      <TBodyTr>
                        <TbodyTd></TbodyTd>
                        <TbodyTd2>
                          
                          { (view === 'sendout' && !v.sendout_yn  && dayjs.unix(data.returning_date).format("YYYY-MM-DD") !== utils.dateToDate(v.return_dt) ) &&
                          <FontRed>전달일자를 꼭 확인하세요</FontRed>
                          }
                          { (view === 'pickups' && !v.pickup_yn && dayjs.unix(data.loaning_date).format("YYYY-MM-DD") !== utils.dateToDate(v.sendout_dt) ) &&
                          <FontRed>픽업일자를 꼭 확인하세요</FontRed>
                          }
{
                            ( view === 'sendout' &&  !v.return_yn  && v.use_user_info[0].use_id == reducer.myUser.username ) ?
                            <SendBtn onClick={()=>handleEachReturn(data.req_no, v.sample_no)}>반납하기</SendBtn>
                            :
                            null
                          }

                        </TbodyTd2>
                        <TbodyTd2>
                          {
                            ( view === 'pickups' &&  !v.pickup_yn  && v.use_user_info[0].use_id == reducer.myUser.username ) ?
                            <SendBtn onClick={()=>handleEachPickup(data.req_no, v.sample_no)}>픽업하기</SendBtn>
                            :
                            null
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
  ;font-size: 14px
`;

const FontRed = styled.div`
  font-size: 12px;
  color:red;
`;
const FontRedPadding = styled.div`
  font-size: 11px;
  padding-left:10px;
  color:red;
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
  width: 50px;
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

const TbodyTdWrap = styled.td`
  border: solid 1px #000000;  
  background-color: ${(props) => props.bg || "#ffffff"};
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.imgUrl &&
    css`
      background: url("${(props) => props.imgUrl}") no-repeat center;
      background-size: cover;
    `}
`;