import React, { useState, useCallback } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import 'moment/locale/ko';
import moment from "moment";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import utils from "utils";

const Calendar = styled.div`
  width: 360px;
  border: 1px solid #bababa;
  padding: 24px 10px 8px 10px;
`;

const Head = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 18px;
`;

const HeadBtnWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeadBtn = styled.div`
  margin-right: 20px;
  cursor: pointer;
`;

const HeadBtn2 = styled.div`
  margin-left: 24px;
  cursor: pointer;
`;

const HeadTxt = styled.div`
  font-weight: 400;
  font-size: 16px;
  padding-bottom: 2px;
`;

const Body = styled.div`
  margin-top: 32px;
`;

const WeekWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Week = styled.div`
  width: calc(100% / 7);
  height: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => props.color || "#000000"};
`;

const DayWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  border-radius: 15px;
  cursor: pointer;
  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
`;

const DayBack = styled.div`
  width: calc(100% / 7);
  display: flex;
  justify-content: center;
  position: relative;

  ${(props) =>
    props.over === "start" &&
    props.start === "on" &&
    props.end === "on" &&
    css`
      background: linear-gradient(90deg, #ffffff 50%, #b4dbee 50%);
    `}
  ${(props) =>
    props.over === "on" &&
    props.start === "on" &&
    props.end === "on" &&
    css`
      background-color: #b4dbee;
    `}
    ${(props) =>
    props.over === "end" &&
    props.start === "on" &&
    props.end === "on" &&
    css`
      background: linear-gradient(90deg, #b4dbee 50%, #ffffff 50%);
    `}
`;

const Day = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;

  ${(props) =>
    props.type === "grayed" &&
    css`
      color: #999999;
      pointer-events: none;
    `}
  ${(props) =>
    props.unAvail &&
    css`
      color: #bebebe;
      pointer-events: none;
    `}

  ${(props) =>
    props.selected &&
    css`
      background-color: #7ea1b2;
      color: #000000;
    `}
`;

function DatePicker({ startDt, setStartDt, endDt, setEndDt, setOpen,setDaysStartTerm,setDaysEndTerm,setDaysTermDates }) {  
  const [initDt, setInitDt] = useState(startDt);
  const [tmpStartDt, setTmpStartDt] = useState(null);
  const [tmpEndDt, setTmpEndDt] = useState(null);

  const handleMonthChange = useCallback(
    (act) => {
      if (act === "prev") {
        setInitDt(moment(initDt).subtract({ month: 1 }));
      } else if (act === "next") {
        setInitDt(moment(initDt).add({ month: 1 }));
      }
    },
    [initDt]
  );

  const handleDtChangeOrigin = useCallback(
    (week) => {
      setStartDt(moment().day(0).week(week));
      setEndDt(moment().day(6).week(week));
      setOpen(false);
    },
    [startDt, endDt, open]
  );

  const handleDtChange = (dt) => {
    if (dt === "none") {
      return;
    } else {
		if ( tmpStartDt ===  null ) {
			setTmpStartDt(dt);
			if ( tmpEndDt !==  null ) {
				setTmpEndDt(null);
			}
		}else{
			if ( tmpStartDt !==  null && tmpEndDt ===  null ) {
				if ( tmpStartDt > dt) {
					let startWeek = moment(dt).weekday();
					let diffDays = moment(tmpStartDt).diff(moment(dt),'days');
					if ( diffDays < 2) {
						utils.customAlert('최소기간 2일이상 선택하세요');
						return false;
					}else if ( diffDays > 20) {
						utils.customAlert('최대기간 20일까지 가능합니다');
						return false;
					}else{
						setTmpStartDt(dt);setTmpEndDt(tmpStartDt);setStartDt(dt);setEndDt(tmpStartDt);setDaysStartTerm(startWeek);setDaysEndTerm(startWeek+diffDays);setDaysTermDates(utils.getDayArray(moment(dt).unix(),moment(tmpStartDt).unix()));setOpen(false);
					}
				}else{
					let startWeek = moment(tmpStartDt).weekday();
					let diffDays2 = moment(dt).diff(moment(tmpStartDt),'days');					
					if ( diffDays2 < 2) {
						utils.customAlert('최소기간 2일이상 선택하세요');
						return false;
					}else if ( diffDays2 > 20) {
						utils.customAlert('최대기간 20일까지 가능합니다');
						return false;
					}else{
						setTmpEndDt(dt);setStartDt(tmpStartDt);setEndDt(dt);setDaysStartTerm(startWeek);setDaysEndTerm(startWeek+diffDays2);setDaysTermDates(utils.getDayArray(moment(tmpStartDt).unix(),moment(dt).unix()));setOpen(false);
					}
				}
			}
		}

      /* if (startDt === "" && endDt === "") {
        setStartDt(dt);
      } else if (startDt !== "" && endDt === "") {
        if (moment(dt) < moment(startDt)) {
          setStartDt(dt);
        } else if (
          moment(dt).format("YYYY-MM-DD") ===
          moment(startDt).format("YYYY-MM-DD")
        ) {
          setStartDt(dt);
        } else {
          setEndDt(dt);
        }
      } else {
        setStartDt(dt);
        setEndDt("");
      } */
    }
  };


  function generate() {
    
    const strStartDtYear = moment(initDt).format('YYYY');
    const strStartDtMonth = moment(initDt).format('MM');
    let newSatrtDt = initDt;
    if ( strStartDtMonth == '12' ) {
      newSatrtDt = moment(new Date(strStartDtYear, 11, 1));
    }
    const today = newSatrtDt;
    const startWeek = today.clone().startOf("month").week() == 1 ? 49 : today.clone().startOf("month").week();
    const endWeek = today.clone().endOf("month").week() == 1 ? 53 : today.clone().endOf("month").week();
    let calendar = [];
    
    for (let week = startWeek; week <= endWeek; week++) {
      calendar.push(
        <DayWrap 
          //onClick={() => handleDtChange(week)}
        >
          {Array(7)
            .fill(0)
            .map((n, i) => {
              
              let current = today.clone().week(reWeek).startOf("week").add(n + i, "day");
              let isSelected = current.format("YYYY-MM-DD") === moment(tmpStartDt).format("YYYY-MM-DD") || current.format("YYYY-MM-DD") ===moment(tmpEndDt).format("YYYY-MM-DD") ? true: false;
              let isSelected2 = current.format("YYYY-MM-DD") === moment(startDt).format("YYYY-MM-DD") || current.format("YYYY-MM-DD") ===moment(endDt).format("YYYY-MM-DD") ? true: false;
              let isGrayed = current.format("MM") === today.format("MM") ? "" : "grayed";
              let isOver = "";
              if ( current.format("YYYY-MM-DD") === moment(startDt).format("YYYY-MM-DD") ) {
                isOver = "start";
              } else if ( current.format("YYYY-MM-DD") ===moment(endDt).format("YYYY-MM-DD") ) {
                isOver = "end";
              } else if ( current.isAfter(moment(startDt)) && current.isBefore(moment(endDt))) {
                isOver = "on";
              }
              return (
                <DayBack
                  key={`${current}_${i}`}
                  over={isOver}
                  start={startDt !== "" ? "on" : "off"}
                  end={endDt !== "" ? "on" : "off"}
                >
                  <Day
                    type={isGrayed}
                    key={current.format("YYYY-MM-DD")}
                    selected={isSelected ? true : isSelected2 }
                    onClick={isGrayed === "grayed" ? () => handleDtChange("none") : () => handleDtChange(current)}
                  >
                    <div>{current.format("D")}</div>
                  </Day>
                </DayBack>
                );
              })
			}
        </DayWrap>
      );
    }
    return calendar;
  }
  return (
    <>
      <Calendar>
        <Head>
          <HeadBtnWrap>
            <HeadBtn onClick={() => handleMonthChange("prev")}>
              <ArrowBackIosIcon style={{ fontSize: "16px" }} />
            </HeadBtn>
            <HeadTxt>{moment(initDt).format("YYYY.MM")}</HeadTxt>
            <HeadBtn2 onClick={() => handleMonthChange("next")}>
              <ArrowForwardIosIcon style={{ fontSize: "16px" }} />
            </HeadBtn2>
          </HeadBtnWrap>
        </Head>
        <Body>
          <WeekWrap>
            <Week color="#ff0000">
              <div>S</div>
            </Week>
            <Week>
              <div>M</div>
            </Week>
            <Week>
              <div>T</div>
            </Week>
            <Week>
              <div>W</div>
            </Week>
            <Week>
              <div>T</div>
            </Week>
            <Week>
              <div>F</div>
            </Week>
            <Week>
              <div>S</div>
            </Week>
          </WeekWrap>
          {generate()}
        </Body>
      </Calendar>
    </>
  );
}

export default React.memo(DatePicker);
