import React, { useState, useEffect } from "react";
import styled from "styled-components";
import moment from "moment";
import _ from "lodash";

import MemoComponent from "components/brand/scheduler/DetailMemo";
import ReqWait from "./ReqWaitComponent";
import utils from "utils";
import PlaneIcon from "assets/scheduler/planeIcon.svg";
import CoinIcon from "assets/scheduler/coinIcon.svg";
import StackIcon from "assets/scheduler/stackIcon.svg";
import DailyMemo from "components/brand/scheduler/DailyMemo";

function ReqBoard({data,memo,dt,h,setH,idx,wait,endDt,season,gender,look,thisLook,daysStartTerm,daysEndTerm}) {
  console.log('ReqBoard',thisLook)
  /* const week = [
    moment(dt).weekday(0),
    moment(dt).weekday(1),
    moment(dt).weekday(2),
    moment(dt).weekday(3),
    moment(dt).weekday(4),
    moment(dt).weekday(5),
    moment(dt).weekday(6),
    moment(dt).weekday(7),
    moment(dt).weekday(8),
    moment(dt).weekday(9),
    moment(dt).weekday(10),
  ]; */
  /* let chk = [0, 0, 0, 0, 0, 0, 0]; */
  const week = [];
  let chk = []
  for(let i=daysStartTerm ; i<=daysEndTerm ; i++) {
    week.push(moment(dt).weekday(i))
    chk.push(0)
  }
   

  const [inputs, setInputs] = useState(null);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    setInputs(memo);
    setHeight(
      chk.reduce(function (a, b) {
        return Math.max(a, b);
      })
    );
    h[idx] = height;
    setH([...h]);
    return () => {};
  }, [data, height, memo]);



  return (
    <>
      <Container height={height} maxWidth={daysEndTerm-daysStartTerm}>
        <FlexBox>
          {week.map((n, index) => (            
            <Wrap style={{ display: "flex", flexDirection: "column" }} key={n}>
              <DailyMemo 
                data={n} 
                idx={index} 
                look={look} 
                thisLook={thisLook}
                inputs={inputs} 
                daysStartTerm={daysStartTerm}
                daysEndTerm={daysEndTerm}
              />
            </Wrap>
          )
          )}
        </FlexBox>
        
        {/* {week.map((n) => (
          <Blank key={n} height={height}>
            {inputs !== null &&
              inputs.map(
                (d) =>
                  moment(n).weekday() === moment.unix(d.memo_dt).weekday() && (
                    <MemoComponent key={d.memo_no} data={d} />
                  )
              )}
          </Blank>
        ))} */}
        
        {data !== null &&
          data.map((d) => {
            for (let i = d.from; i <= d.to; i++) {
              chk[i] = chk[i] + 1;
            }
            return (
              <ReqWrap key={d.req_no} width={parseInt(d.from)} height={chk[d.from]} inputs_len={inputs}>
                <Req leng={d.to-d.from+1 } color={d.mgzn_color}>
                  <div className="head">
                    <img src={d.mgzn_logo_adres} alt="" />
                  </div>
                  <div className="body">
                    <div className="reqNm">{d.req_user_nm}</div>
                    <div className="company">{d.company_name}</div>
                    {/*  <div className="gap">{d.address}</div> */}
                    <div className="gap">{d.contact_user_nm}</div>
                    <div>{utils.phoneFormat(d.contact_user_phone)}</div>
                    <div className="icon">
                      {d.loc_yn && <img src={PlaneIcon} alt="" />}
                      {d.own_paid_pictorial_yn && (
                        <img src={CoinIcon} alt="" />
                      )}
                      {d.other_paid_pictorial_yn && (
                        <img src={StackIcon} alt="" />
                      )}
                    </div>
                  </div>
                </Req>
              </ReqWrap>
            );
          })}

       
        {wait !== null &&
          _.uniqBy(wait, "from").map((d) => {
            chk[d.from-daysStartTerm] = chk[d.from-daysStartTerm] + 1;

            return (
              <ReqWaitWrap width={parseInt(d.from-daysStartTerm)} height={chk[d.from-daysStartTerm]} key={d.req_no}>
                <ReqWait
                  data={wait}
                  idx={d.from}
                  startDt={dt}
                  endDt={endDt}
                  season={season}
                  gender={gender}
                />
              </ReqWaitWrap>
            );
          })}
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  height: ${(props) => props.height <= 2 ? "550px" : (props.height * 220) + 148 + "px"};  
  position: relative;
  background-color: #ffffff;
  & + & {
    border-top: solid 2px #dddddd;
  }
  max-width:100%;
`;
const FlexBox = styled.div`
  display: flex;
`;
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  & + & {
    border-left: solid 2px #dddddd;
  }
`;

const ReqWrap = styled.div`
  position: absolute;
  margin-top: ${(props) => props.inputs_len == null ? '55px' : '155px'};
  margin-bottom:20px;
  top: ${(props) =>props.height === 1 ? "0px" : 200 * (props.height - 1) + "px"};
  left: ${(props) => props.width === 0 ? "5px" : props.width < 3 ? props.width*210+'px' : props.width*203+'px'};
`;

const Req = styled.div`
  border-radius: 15px;
  border: solid 2px #f3f3f3;
  box-shadow: 5px 6px 10px 0 rgba(0, 0, 0, 0.16);
  .head {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 15px;
    box-sizing: border-box;
    width: ${(props) => props.leng === 1 ? "180px" : props.leng * 180 + (props.leng - 1) * 20 + "px"};
    height: 48px;
    background-color: ${(props) => props.color || "#999999"};
    border-radius: 15px 15px 0 0;
    img {
      max-width: 160px;
      max-height: 25px;
    }
  }
  .body {
    position: relative;
    width: ${(props) => props.leng === 1 ? "180px" : props.leng * 180 + (props.leng - 1) * 20 + "px"};
    height: 135px;
    background-color: #f6f6f6;
    border-radius: 0 0 15px 15px;
    padding: 15px;
    font-size: 12px;
    font-weight: normal;
    color: #000000;
    overflow: hidden;
    .reqNm {
      font-size: 18px;
      font-weight: bold;
    }
    .company {
      color: #999999;
      margin-bottom: 5px;
    }
    .gap {
      margin-bottom: 5px;
    }
  }
  .icon {
    position: absolute;
    top: 20px;
    right: 10px;
    > img {
      width: 26px;
      margin-left: 5px;
    }
  }
`;

const Blank = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
  width: 200px;
  height: ${(props) =>
    props.height <= 2 ? "550px" : props.height * 210 + 130 + "px"};
  box-sizing: content-box;
  & + & {
    border-left: solid 2px #dddddd;
  }
`;

const ReqWaitWrap = styled.div`
  position: absolute;  
  margin-top: 125px;
  top: 210px;${(props) => props.height === 1 ? "0px" : 210 * (props.height - 1) + "px"};
  left: ${(props) => props.width === 0 ? "0px" : props.width < 3 ? props.width*210+'px' : props.width*205+'px'};
`;

export default React.memo(ReqBoard);
