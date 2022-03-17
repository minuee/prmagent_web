import React, { useState, useRef } from "react";
import styled from "styled-components";
import { darken } from "polished";

import SelectDownIcon from "assets/select_down_icon.png";
import useOutsideClick from "components/UseOutsideClick";

const Drowdown = styled.div`
  display: flex;
  width: 240px;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  border-radius: 5px;
  padding: 5px;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
`;

const SelectMain = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: bold;
`;

const SelectSub = styled.div`
  position: absolute;
  top: 38px;
  right: 0;
  z-index: 4;
  background-color: #ffffff;
  width: 240px;
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

export default function SelectSeason({ value, options, handleChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const handleClick = (season_year, season_cd_id, label) => {
    setOpen(false);
    handleChange(season_year, season_cd_id, label);
  };

  useOutsideClick(ref, () => {
    setOpen(false);
  });

  return (
    <>
      <Drowdown onClose={() => setOpen(false)} ref={ref}>
        <SelectMain onClick={() => setOpen(!open)}>
          <div>{value.label === "" ? options[0].label : value.label}</div>
          <div>
            <img src={SelectDownIcon} alt="2020 F/W" />
          </div>
        </SelectMain>
        {open && (
          <SelectSub>
            {options.map((d) => (
              <Sub
                key={d.label}
                onClick={() =>
                  handleClick(d.season_year, d.season_cd_id, d.label)
                }
              >
                {d.label}
              </Sub>
            ))}
          </SelectSub>
        )}
      </Drowdown>
    </>
  );
}
