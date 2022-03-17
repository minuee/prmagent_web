import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

const Container = styled.div`
  display: flex;
  margin-bottom: 10px;
  cursor: pointer;
`;

const InputWrap = styled.div`
  width: 358px;
  height: 45px;
  border-radius: 5px;
  border: solid 1px #dddddd;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
`;

const Date = styled.div`
  font-size: 16px;
  font-weight: 500;
  height: 20px;
  text-transform: uppercase;
  color: #000000;
`;

const ArrowDiv = styled.div`
  margin-right: 5px;
`;

function DateRangePickerComp({ startDt, endDt, open, setOpen }) {
  return (
    <>
      <Container onClick={() => setOpen(!open)}>
        <InputWrap>
          <Date>
            {dayjs(startDt).format("YYYY/MM/DD")} -{" "}
            {dayjs(endDt).format("YYYY/MM/DD")}
          </Date>
          <ArrowDiv>
            <img src="/images/common/select_down.svg" alt="" />
          </ArrowDiv>
        </InputWrap>
      </Container>
    </>
  );
}

export default React.memo(DateRangePickerComp);
