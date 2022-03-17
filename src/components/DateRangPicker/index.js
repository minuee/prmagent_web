import React, { useState } from "react";
import styled from "styled-components";

import InputComponent from "./InputComponent";
import DateRangePicker from "./DateRangePicker";

const DataRangePickerWrap = styled.div`
  height: 420px;
`;

export default function DateRangePickerComp() {
  const [startDt, setStartDt] = useState("");
  const [endDt, setEndDt] = useState("");
  const unAvailDt = ["2021-01-11", "2021-01-22"];

  return (
    <>
      <InputComponent startDt={startDt} endDt={endDt} />
      <DataRangePickerWrap>
        <DateRangePicker
          startDt={startDt}
          setStartDt={setStartDt}
          endDt={endDt}
          setEndDt={setEndDt}
          unAvailDt={unAvailDt}
        />
      </DataRangePickerWrap>
    </>
  );
}
