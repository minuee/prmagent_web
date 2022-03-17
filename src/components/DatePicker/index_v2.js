import React, { useState, useRef } from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import DatePicker from "./DatePicker";
import useOutsideClick from "components/UseOutsideClick";
import SelectDownIcon from "assets/select_down_icon.png";

const Container = styled.div`
  position: relative;
`;

const DataPickerWrap = styled.div`
  height: 420px;
  position: absolute;
  background-color: #ffffff;
  z-index: 9999;
`;

const Day = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #7ea1b2;
`;

const Date = styled.div`
  width: 138px;
  height: 58px;
  font-size: 48px;
  font-weight: 300;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 60px;
`;

const SelectImg = styled.img`
  margin-left: 20px;
`;

export default function DatePickerComp({ dt, setDt }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useOutsideClick(ref, () => {
    setOpen(false);
  });

  return (
    <>
      <Container ref={ref}>
        <Day>{dayjs(dt).format("dddd")}</Day>
        <Date onClick={() => setOpen(!open)}>
          {dayjs(dt).format("MM.DD")}
          <SelectImg src={SelectDownIcon} alt="select_down" />
        </Date>
        {open && (
          <DataPickerWrap>
            <DatePicker dt={dt} setDt={setDt} setOpen={setOpen} />
          </DataPickerWrap>
        )}
      </Container>
    </>
  );
}
