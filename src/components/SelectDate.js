import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { darken } from "polished";

import SelectDownIcon from "assets/select_down_icon.png";
import useOutsideClick from "./UseOutsideClick";
import { MONTH_FULL_CHANGE } from "mock/Mock";

const Drowdown = styled.div`
  display: flex;
  width: 200px;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  border-radius: 5px;
  padding: 5px;
`;

const SelectMain = styled.div`
  display: flex;
  font-size: 20px;
  font-weight: bold;
  justify-content: space-between;
  .date {
    display: flex;
  }
  .month {
    margin-right: 10px;
  }
  .year {
    font-weight: 300;
  }
`;

const SelectSub = styled.div`
  position: absolute;
  top: 38px;
  right: 0;
  z-index: 4;
  background-color: #ffffff;
  width: 200px;
  font-size: 16px;
  border: 1px solid #dadada;
  border-radius: 5px;
  transition: all 0.3s;
`;

const Sub = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  padding-left: 10px;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
`;

function SelectSeason({ value, options = null, handleChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const handleClick = useCallback(
    (year, month) => {
      setOpen(false);
      handleChange(year, month);
    },
    [open]
  );

  useOutsideClick(ref, () => {
    setOpen(false);
  });

  return (
    <>
      <Drowdown onClose={() => setOpen(false)} ref={ref}>
        <SelectMain onClick={() => setOpen(!open)}>
          <div className="date">
            <div className="month">
              {value.month === ""
                ? MONTH_FULL_CHANGE.find((v) => v.input === options[0].month)
                    .output
                : MONTH_FULL_CHANGE.find((v) => v.input === value.month).output}
            </div>
            <div className="year">
              {value.year === "" ? options[0].year : value.year}
            </div>
          </div>
          <div>
            <img src={SelectDownIcon} alt="date" />
          </div>
        </SelectMain>
        {open && (
          <SelectSub>
            {options.map((d) => (
              <Sub
                key={`${d.year}_${d.month}`}
                onClick={() => handleClick(d.year, d.month)}
              >
                {MONTH_FULL_CHANGE.find((v) => v.input === d.month).output +
                  " " +
                  d.year}
              </Sub>
            ))}
          </SelectSub>
        )}
      </Drowdown>
    </>
  );
}

export default React.memo(SelectSeason);
