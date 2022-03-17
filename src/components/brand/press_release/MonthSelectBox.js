import React, { useState, useRef, useCallback } from "react";
import styled, { css } from "styled-components";
import SelectDownIcon from "assets/select_down_arrow.svg";
import SelectUpIcon from "assets/select_up_arrow.svg";
import { darken } from "polished";

import useOutsideClick from "components/UseOutsideClick";
import { MONTH_FULL_CHANGE } from "mock/Mock";

const Container = styled.div`
  width: 100%;
  position: relative;
`;

const SelectBox = styled.div`
  width: ${(props) => props.width || "auto"};
  height: ${(props) => props.height || "auto"};
  border: 1px solid #dddddd;
  border-radius: 5px;
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  ${(props) =>
    props.active &&
    css`
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    `}
`;

const SelectTxt = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const SelectIcon = styled.div`
  padding-top: 3px;
`;

const DropMenus = styled.div`
  position: absolute;
  background-color: #ffffff;
  width: ${(props) => props.width || "auto"};
  max-height: 379px;
  overflow: auto;
  font-size: 16px;
  font-weight: 500;
  color: #999999;
  border: 1px solid #dddddd;
  border-top: none;
  border-radius: 0 0 5px 5px;
  z-index: 2;
`;
const Options = styled.div`
  height: ${(props) => props.height || "auto"};
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
`;

function MonthSelectBox({ width, height, name, value = null, handleChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const handleClick = useCallback(
    (data) => {
      setOpen(false);
      handleChange(name, data);
    },
    [open]
  );

  useOutsideClick(ref, () => {
    setOpen(false);
  });

  return (
    <>
      <Container>
        <SelectBox
          width={width}
          height={height}
          onClick={() => setOpen(!open)}
          active={open}
          onClose={() => setOpen(false)}
          ref={ref}
        >
          <SelectTxt>
            {value === ""
              ? "-"
              : MONTH_FULL_CHANGE.find((v) => v.input === value).output}
          </SelectTxt>
          <SelectIcon>
            {/* {open ? <ExpandLessIcon /> : <ExpandMoreIcon />} */}
            <img src={open ? SelectUpIcon : SelectDownIcon} />
          </SelectIcon>
        </SelectBox>
        {open && (
          <DropMenus width={width}>
            {MONTH_FULL_CHANGE.map((d) => (
              <Options
                key={d.input}
                height={height}
                onClick={() => handleClick(d.input)}
              >
                {d.output}
              </Options>
            ))}
          </DropMenus>
        )}
      </Container>
    </>
  );
}

export default React.memo(MonthSelectBox);
