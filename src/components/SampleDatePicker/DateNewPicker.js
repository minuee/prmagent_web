import React, { useState, useCallback } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import 'moment/locale/ko';
import moment from "moment";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import utils from "utils";
import contants from "utils/constants";
const Calendar = styled.div`
  width: 360px;
  border: 1px solid #bababa;
  padding: 24px 10px 8px 10px;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
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
  cursor: pointer;

  ${(props) =>
    props.type === "prev" &&
    css`
      color: #999999;
      pointer-events: none;
    `}
  ${(props) =>
    props.unAvail &&
    css`
      ${(props) =>
        props.shootingYn
          ? css`
              color: #bebebe;
            `
          : css`
              color: #bebebe;
              pointer-events: none;
            `}
    `}

  ${(props) =>
    props.selected &&
    css`
      background-color: #7ea1b2;
      color: #000000;
    `}

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
`;

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ff0000;
  margin-right: 4px;
  margin-bottom: 2px;
`;

const AvailWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AvailTxt = styled.div`
  font-weight: 300;
  font-size: 12px;
  color: #bebebe;
`;

const DayUnAvailableChk = styled.div`
  width: 4px;
  height: 4px;
  background-color: #ff0000;
  position: absolute;
  border-radius: 50%;
  top: 5px;
  right: 10px;
`;

export default function DatePicker({
  dt,
  end_dt,
  setStartDt,
  setEndDt,
  setOpen,
  shooting_yn,
  initDt,
  setInitDt,
  unavailDt,
  year,
  setYear,
  handleShootingDtClick,
  limitDays = 7
}) {
  // const [initDt, setInitDt] = useState(moment());

  const [tmpStartDt, setTmpStartDt] = useState(null);
  const [tmpEndDt, setTmpEndDt] = useState(null);
  const handleMonthChange = (act) => {
    if (act === "prev") {
      setInitDt(moment(initDt).subtract({ month: 1 }));
      moment(initDt).subtract({ month: 1 }).format("YYYY") !== year &&
        setYear(moment(initDt).subtract({ month: 1 }).format("YYYY"));
    } else if (act === "next") {
      setInitDt(moment(initDt).add({ month: 1 }));
      moment(initDt).add({ month: 1 }).format("YYYY") !== year &&
        setYear(moment(initDt).add({ month: 1 }).format("YYYY"));
    }
  };

  const handleDtChangeOrigin = (date) => {
    //setDt(date);
    setOpen(false);
    shooting_yn && handleShootingDtClick(date);
  };

  const handleDtChange = (sdt) => {
    
    if (sdt === "none") {
      return;
    } else {
      if ( moment(sdt).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD') ) {
        utils.customAlert('오늘이전날짜는 불가합니다.');
        return false;
      }else{
        if ( tmpStartDt ===  null ) {
          setTmpStartDt(sdt);
          if ( tmpEndDt !==  null ) {
            setTmpEndDt(null);
          }
        }else{
          if ( tmpStartDt !==  null && tmpEndDt ===  null ) {
            if ( tmpStartDt > sdt) {
              
              let diffDays = moment(tmpStartDt).diff(moment(sdt),'days');
              if ( diffDays < 0) {
                utils.customAlert('최소 1일이상 선택하세요');
                return false;
              }else if ( diffDays > limitDays) {
                utils.customAlert('최대 '+limitDays+'일까지 가능합니다');
                return false;
              }else{
                setTmpStartDt(sdt);setTmpEndDt(tmpStartDt);setStartDt(sdt);setEndDt(tmpStartDt);handleShootingDtClick(sdt,tmpStartDt);setOpen(false);
              }
            }else{
              let diffDays2 = moment(sdt).diff(moment(tmpStartDt),'days');					
              if ( diffDays2 < 0) {
                utils.customAlert('최소 1일이상 선택하세요');
                return false;
              }else if ( diffDays2 > limitDays ) {
                utils.customAlert('최대 '+limitDays+'일까지 가능합니다');
                return false;
              }else{
                setTmpEndDt(sdt);setStartDt(tmpStartDt);setEndDt(sdt);handleShootingDtClick(tmpStartDt,sdt);setOpen(false);
              }
            }
          }
        }
      }
    }
  };

  function generate() {
    const today = initDt;
    const startWeek = today.clone().startOf("month").week();
    const endWeek = today.clone().endOf("month").week() === 1 ? 53 : today.clone().endOf("month").week();
    let calendar = [];
    for (let week = startWeek; week <= endWeek; week++) {
      calendar.push(
        <DayWrap>
          {Array(7)
            .fill(0)
            .map((n, i) => {
              let current = today
                .clone()
                .week(week)
                .startOf("week")
                .add(n + i, "day");
              let isSelected =  current.format("YYYY-MM-DD") === moment(dt).format("YYYY-MM-DD") || current.format("YYYY-MM-DD") === moment(tmpStartDt).format("YYYY-MM-DD") ? true : false;
              let isSelected2 =  current.format("YYYY-MM-DD") === moment(end_dt).format("YYYY-MM-DD") || current.format("YYYY-MM-DD") === moment(tmpEndDt).format("YYYY-MM-DD") ? true : false;
              let isSelected3 =  current.format("YYYY-MM-DD") >= moment(dt).format("YYYY-MM-DD") && current.format("YYYY-MM-DD") <= moment(end_dt).format("YYYY-MM-DD") ? true : false;
              let isPassDay = current.format("YYYY-MM-DD") < today.format("YYYY-MM-DD");
              let isGrayed = current.format("MM") === today.format("MM") ? "" : "grayed";
              let unAvailable = unavailDt.find((v) => v === current.format("YYYY-MM-DD"))? true: false;
              let holiday = moment(current).day() === 0 || moment(current).day() === 6 ? true : false;
              return (
                <DayBack key={`${current}_${i}`}>
                  <Day
                    type={isGrayed}
                    key={current.format("YYYY-MM-DD")}
                    selected={isSelected ?  true : isSelected2 ? true : isSelected3}
                    unAvail={isPassDay ? true : shooting_yn ? unAvailable : holiday || unAvailable}
                    shootingYn={shooting_yn}
                    onClick={() => handleDtChange(current)}
                  >
                    <div>{current.format("D")}</div>
                  </Day>
                  {unAvailable && <DayUnAvailableChk />}
                </DayBack>
              );
            })}
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
            <HeadTxt>{moment(initDt).format("MM")}</HeadTxt>
            <HeadBtn2 onClick={() => handleMonthChange("next")}>
              <ArrowForwardIosIcon style={{ fontSize: "16px" }} />
            </HeadBtn2>
          </HeadBtnWrap>
          <AvailWrap>
            <Circle />
            <AvailTxt>Unavailable</AvailTxt>
          </AvailWrap>
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
