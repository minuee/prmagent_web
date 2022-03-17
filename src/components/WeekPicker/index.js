import React, { useState, useRef } from "react";
import styled from "styled-components";
import 'moment/locale/ko';
import moment from "moment";
import InputComponent from "./InputComponent";
import DatePicker from "./DatePicker";
import useOutsideClick from "components/UseOutsideClick";

const Container = styled.div`
  position: relative;
  width:250px;
`;

const DataPickerWrap = styled.div`
  height: auto;
  position: absolute;
  right:0px;
  background-color: #ffffff;
  z-index: 9999;
`;

function DatePickerComp({ startDt, setStartDt, endDt, setEndDt}) {
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
            />
          </DataPickerWrap>
        )}
      </Container>
    </>
  );
}

export default React.memo(DatePickerComp);
