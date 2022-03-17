import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import ScrollContainer from "react-indiana-drag-scroll";
import moment from "moment";
import ReqBoard from "./ReqBoard";
import LookComponent from "components/brand/scheduler/LookComponent";
//import DailyMemo from "components/brand/scheduler/DailyMemo";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
export default function NewReqComponent({look,req,wait,memo,dt,endDt,season,gender,daysStartTerm,daysEndTerm}) {
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);  
  /* const week = [
    moment(dt).weekday(0),
    moment(dt).weekday(1),
    moment(dt).weekday(2),
    moment(dt).weekday(3),
    moment(dt).weekday(4),
    moment(dt).weekday(5),
    moment(dt).weekday(6)
  ]; */

 /*  const week = [];
  for(let i=daysStartTerm ; i<=daysEndTerm ; i++) {
    week.push(moment(dt).weekday(i))
  } */
  const [inputs, setInputs] = useState();
  const [h, setH] = useState([]);

  useEffect(() => {
    setInputs(req);
    let newArr = [];
    req.map(() => newArr.push(0));
    setH(newArr);
    return () => {};
  }, [req]);

  return (
    <>
      <LeftWrap active={isdrawer}>
        <div className="blank" />
        {look.map((d, i) => (
          <LookComponent key={`${d}_${i}_left`} data={d} height={h[i]} />
        ))}
      </LeftWrap>
      <StyleScrollContainer
        vertical={false}
        ignoreElements={"textarea, select"}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>         
          {inputs !== undefined &&
            inputs.map((d, i) => (
              <ReqBoard
                key={`${i}_request_Board`}
                data={d}
                dt={dt}
                memo={memo[i]}
                h={h}
                setH={setH}
                idx={i}
                wait={wait[i]}
                endDt={endDt}
                season={season}
                gender={gender}
                look={look}
                thisLook={look[i]}
                daysStartTerm={daysStartTerm}
                daysEndTerm={daysEndTerm}
              />
            ))}
        </div>
      </StyleScrollContainer>
    </>
  );
}

const StyleScrollContainer = styled(ScrollContainer)`
  width: ${(props) => props.width || "auto"};
  display: flex;
  position: relative;

  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  & + & {
    border-left: solid 2px #dddddd;
  }
`;
const FlexBox = styled.div`
  display: flex;
`;

const LeftWrap = styled.div`  
  @media (min-width: 1920px) {
    width: 240px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 240px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 180px;
  }  
  height: auto;
  .blank {
    height: 50px;
  }
`;
