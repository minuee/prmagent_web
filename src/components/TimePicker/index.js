import React, { useState, useRef } from "react";
import styled from "styled-components";

import InputComponent from "./InputComponent";
import TimePicker from "./TimePicker";
import useOutsideClick from "components/UseOutsideClick";

const Container = styled.div`
  position: relative;
`;

const DataPickerWrap = styled.div`
  height: 420px;
  left: 50px;
  position: absolute;
  background-color: white;
  z-index: 9999;
`;

export default function TimePickerComp({ time, handleChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useOutsideClick(ref, () => {
    setOpen(false);
  });

  return (
    <>
      <Container ref={ref}>
        <InputComponent time={time} open={open} setOpen={setOpen} />
        {open && (
          <DataPickerWrap>
            <TimePicker
              time={time}
              setOpen={setOpen}
              handleChange={handleChange}
            />
          </DataPickerWrap>
        )}
      </Container>
    </>
  );
}
