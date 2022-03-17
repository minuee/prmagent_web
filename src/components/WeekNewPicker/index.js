import React, { useState, useRef } from "react";
import styled from "styled-components";
import 'moment/locale/ko';
import moment from "moment";
import InputComponent from "./InputComponent";
//import DatePicker from "./DatePicker";
import DatePicker from "./NewDatePicker";
import useOutsideClick from "components/UseOutsideClick";

const Container = styled.div`
  position: relative;
  width:250px;
`;

const DataPickerWrap = styled.div`
  height: auto;
  position: absolute;
  background-color: #ffffff;
  z-index: 9999;
`;

function DatePickerComp({ startDt, setStartDt, endDt, setEndDt,setDaysStartTerm,setDaysEndTerm,setDaysTermDates }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useOutsideClick(ref, () => {
    setOpen(false);
  });

 
  return (
    <>
      <Container ref={ref}>
        <InputComponent
          startDt={startDt}
          endDt={endDt}
          open={open}
          setOpen={setOpen}
        />
        { 
          open && (
          <DataPickerWrap>
            <DatePicker
              startDt={startDt}              
              setStartDt={setStartDt}
              endDt={endDt}
              setEndDt={setEndDt}
              setOpen={setOpen}
              setDaysStartTerm={setDaysStartTerm}
              setDaysEndTerm={setDaysEndTerm}
              setDaysTermDates={setDaysTermDates}
            />
          </DataPickerWrap>
        )}
      </Container>
    </>
  );
}

export default React.memo(DatePickerComp);
