import React, { useState, useRef } from "react";
import styled from "styled-components";

import InputComponent from "./InputNewComponent";
import DatePicker from "./DateNewPicker";
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
  end_dt,
  setDt,
  setEndDt,
  unavailDt,
  initDt,
  setInitDt,
  year,
  setYear,
  handleShootingDtClick,
  iseditable = true,
  limitDays = 7
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useOutsideClick(ref, () => {
    setOpen(false);
  });

  return (
    <>
      <Container ref={ref}>
        <InputComponent dt={dt}  end_dt={end_dt}  open={open} setOpen={setOpen} />
        {( open && iseditable ) && (
          <DataPickerWrap>
            <DatePicker
              dt={dt}
              end_dt={end_dt}
              setStartDt={setDt}
              setEndDt={setEndDt}
              setOpen={setOpen}
              shooting_yn={shooting_yn}
              unavailDt={unavailDt}
              initDt={initDt}
              setInitDt={setInitDt}
              year={year}
              setYear={setYear}
              handleShootingDtClick={handleShootingDtClick}
              limitDays={limitDays}
            />
          </DataPickerWrap>
        )}
      </Container>
    </>
  );
}
