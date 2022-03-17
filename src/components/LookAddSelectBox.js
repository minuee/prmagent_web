import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";

import useOutsideClick from "./UseOutsideClick";
import SelectDownIcon from "assets/select_down_arrow.svg";
import SelectUpIcon from "assets/select_up_arrow.svg";

const Container = styled.div``;

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
  display: flex;
  img {
    width: 11px;
  }
`;

const DropMenus = styled.div`
  position: absolute;
  background-color: #ffffff;
  width: ${(props) => props.width || "auto"};
  max-height: 421px;
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

export default function LookAddSelectBox({
  width,
  height,
  name,
  value = null,
  options,
  handleChange,
}) {
  const [open, setOpen] = useState(false);
  // const [newValue, setNewValue] = useState({
  //   cd_id: value === null ? "" : value.cd_id,
  //   cd_nm: value === null ? "-" : value.cd_nm,
  // });
  const ref = useRef();

  const handleClick = (data) => {
    setOpen(false);
    // setNewValue(options.find((o) => (o.cd_id = data)));
    handleChange(name, data);
  };

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
          <SelectTxt>{value === null ? "-" : value.cd_nm}</SelectTxt>
          <SelectIcon>
            {/* {open ? <ExpandLessIcon /> : <ExpandMoreIcon />} */}
            <img src={open ? SelectUpIcon : SelectDownIcon} />
          </SelectIcon>
        </SelectBox>
        {open && (
          <DropMenus width={width}>
            {options !== undefined &&
              options.map((d, i) => (
                <Options
                  key={`${d.cd_id}_${i}`}
                  height={height}
                  onClick={() => handleClick(d.cd_id)}
                >
                  {d.cd_nm}
                </Options>
              ))}
          </DropMenus>
        )}
      </Container>
    </>
  );
}
