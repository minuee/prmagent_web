import React, { useState, useRef } from "react";
import styled from "styled-components";

import InputComponent from "./InputComponent";
import DatePicker from "./DatePicker";
import useOutsideClick from "components/UseOutsideClick";

const Container = styled.div`
  position: relative;
`;

const DataPickerWrap = styled.div`
  height: 420px;
  position: absolute;
  background-color: #ffffff;
  z-index: 9999;
`;

export default function DatePickerComp({
  shooting_yn = false,
  dt,
  setDt,
  unavailDt,
  initDt,
  setInitDt,
  year,
  setYear,
  handleShootingDtClick,
  iseditable = true
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useOutsideClick(ref, () => {
    setOpen(false);
  });

  return (
    <>
      <Container ref={ref}>
        <InputComponent dt={dt} open={open} setOpen={setOpen} />
        {( open && iseditable ) && (
          <DataPickerWrap>
            <DatePicker
              dt={dt}
              setDt={setDt}
              setOpen={setOpen}
              shooting_yn={shooting_yn}
              unavailDt={unavailDt}
              initDt={initDt}
              setInitDt={setInitDt}
              year={year}
              setYear={setYear}
              handleShootingDtClick={handleShootingDtClick}
            />
          </DataPickerWrap>
        )}
      </Container>
    </>
  );
}
