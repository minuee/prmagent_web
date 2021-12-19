import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { lighten } from "polished";
import moment from "moment";

import MemoIcon from "assets/scheduler/memoIcon_w.svg";
import MemoDialog from "./MemoDialog_v2";
import MemoComponent from "components/brand/scheduler/DetailMemo";

function DailyMemo({ data, index, look,inputs }) {
  const [open, setOpen] = useState(false);
  const [selectLook, setSelectLook] = useState(null);

  const weekDateOptions = [
    {
      value: moment(moment(data).weekday(0)).unix(),
      label: moment(moment(data).weekday(0)).locale("en").format("M/D (ddd)"),
    },
    {
      value: moment(moment(data).weekday(1)).unix(),
      label: moment(moment(data).weekday(1)).locale("en").format("M/D (ddd)"),
    },
    {
      value: moment(moment(data).weekday(2)).unix(),
      label: moment(moment(data).weekday(2)).locale("en").format("M/D (ddd)"),
    },
    {
      value: moment(moment(data).weekday(3)).unix(),
      label: moment(moment(data).weekday(3)).locale("en").format("M/D (ddd)"),
    },
    {
      value: moment(moment(data).weekday(4)).unix(),
      label: moment(moment(data).weekday(4)).locale("en").format("M/D (ddd)"),
    },
    {
      value: moment(moment(data).weekday(5)).unix(),
      label: moment(moment(data).weekday(5)).locale("en").format("M/D (ddd)"),
    },
    {
      value: moment(moment(data).weekday(6)).unix(),
      label: moment(moment(data).weekday(6)).locale("en").format("M/D (ddd)"),
    },
  ];

  useEffect(() => {
    setSelectLook(
      look.map((d) => ({
        value: d.showroom_no,
        label: d.showroom_nm,
      }))
    );
  }, [look]);

  return (
    <>
    <Date idx={index}>
      {moment(data).format("M/D (ddd)")}
      <MemoIconWrap onClick={() => setOpen(!open)}>
        <img src={MemoIcon} alt="" />
      </MemoIconWrap>
      {selectLook !== null && (
        <MemoDialog
          open={open}
          setOpen={setOpen}
          selectLook={selectLook}
          selectDate={weekDateOptions}
          nowDt={data}
        />
      )}
    </Date>
    {
      inputs !== null &&
        inputs.map(
          (d) =>
            moment(data).weekday() === moment.unix(d.memo_dt).weekday() && (
              <MemoWrap>
                <MemoComponent key={d.memo_no} data={d} />
              </MemoWrap>
              
            )
        )
    }
    </>
  );
}

const Date = styled.div`
  min-width: 200px;
  height: 50px;
  background-color: #000000;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
  ${(props) =>
    props.idx === 0 &&
    css`
      border-top-left-radius: 15px;
    `}
  ${(props) =>
    props.idx === 6 &&
    css`
      border-top-right-radius: 15px;
    `}
`;

const MemoIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  margin-left: 15px;
  &:hover {
    background-color: ${lighten(0.2, "#000000")};
  }
  &:active {
    background-color: ${lighten(0.3, "#000000")};
  }
`;

const MemoWrap = styled.div`
  width: 100%;
  align-items: center;
  justify-content: center; 
  
`;

export default React.memo(DailyMemo);
