import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";

import useOutsideClick from "components/UseOutsideClick";
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

const SeasonNmWrap = styled.div`
  width: 600px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const SeasonNm = styled.div`
  height: 32px;
  padding: 0px 25px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 500px;
  border: solid 1px #dddddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 10px;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
    border-color: #dddddd;
    color: #000000;
  }

  ${(props) =>
    props.active &&
    css`
      background-color: #7ea1b2;
      border-color: #7ea1b2;
      color: #ffffff;
    `}
`;

export default function ShoesSelectBox({
  width,
  height,
  value,
  options,
  handleChange,
}) {
  const [open, setOpen] = useState(false);
  const [womenOptions, setWomenOptions] = useState(options[0].size_list);
  const [manOptions, setManOptions] = useState(options[1].size_list);
  const [newValue, setNewValue] = useState(
    value === ""
      ? "-"
      : womenOptions.find((d) => d.size_cd_id === value)
      ? "Women"
      : "Men"
  );
  const ref = useRef();

  const handleClick = (data) => {
    setOpen(false);
    setNewValue(options.find((o) => (o.cd_id = data)));
  };

  useOutsideClick(ref, () => {
    setOpen(false);
  });

  const GENDER_OPTION = [
    {
      cd_id: "SSS001",
      cd_nm: "Women",
    },
    {
      cd_id: "SSS002",
      cd_nm: "Men",
    },
  ];

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
          <SelectTxt>{newValue}</SelectTxt>
          <SelectIcon>
            {/* {open ? <ExpandLessIcon /> : <ExpandMoreIcon />} */}
            <img src={open ? SelectUpIcon : SelectDownIcon} />
          </SelectIcon>
        </SelectBox>
        {open && (
          <DropMenus width={width}>
            {GENDER_OPTION.map((d) => (
              <Options
                key={d.cd_id}
                height={height}
                onClick={() => setNewValue(d.cd_nm)}
              >
                {d.cd_nm}
              </Options>
            ))}
          </DropMenus>
        )}
      </Container>
      <SeasonNmWrap>
        {newValue === "Women" &&
          womenOptions.map((d) => (
            <SeasonNm
              key={`women_${d.size_cd_id}`}
              active={value === d.size_cd_id ? true : false}
              onClick={() => handleChange("size_cd_id", d.size_cd_id)}
            >
              {d.size_nm.split(" ")[0]}
            </SeasonNm>
          ))}
        {newValue === "Men" &&
          manOptions.map((d) => (
            <SeasonNm
              key={`men_${d.size_cd_id}`}
              active={value === d.size_cd_id ? true : false}
              onClick={() => handleChange("size_cd_id", d.size_cd_id)}
            >
              {d.size_nm.split(" ")[0]}
            </SeasonNm>
          ))}
      </SeasonNmWrap>
    </>
  );
}
