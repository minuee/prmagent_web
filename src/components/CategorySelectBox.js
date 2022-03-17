import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import { TextField } from "@material-ui/core";
import { darken } from "polished";

import useOutsideClick from "./UseOutsideClick";
import SelectDownIcon from "assets/select_down_arrow.svg";
import SelectUpIcon from "assets/select_up_arrow.svg";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";


export default function CategorySelectBox({
  value = "",
  subValue = "",
  options = null,
  handleChange,
  inputValue,
  handleInputChange,
  handleInputInit,
  setGenderOptions,
}) {
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const [subOptions, setSubOptions] = useState(
    subValue === ""
      ? null
      : options.find((v) => v.sample_catgry_lrge_cl_cd === value).each_list
  );
  const ref = useRef();
  const subRef = useRef();

  const handleMainClick = (cd) => {
    setOpen(false);
    // setNewMainValue({
    //   sample_catgry_lrge_cl_cd: cd,
    //   sample_catgry_lrge_cl_nm: nm,
    // });
    setSubOptions(
      options.find((v) => v.sample_catgry_lrge_cl_cd === cd).each_list
    );
    setGenderOptions(
      options.find((v) => v.sample_catgry_lrge_cl_cd === cd).gender_size_list
    );
    handleChange("large", cd);
    handleChange("middle", "");
    handleInputInit("sample_catgry_direct_input");
    handleInputInit("size_direct_input");
  };

  const handleSubClick = (cd) => {
    setSubOpen(false);
    handleChange("middle", cd);
    handleInputInit("sample_catgry_direct_input");
    handleInputInit("size_direct_input");
  };

  useOutsideClick(ref, () => {
    setOpen(false);
  });

  useOutsideClick(subRef, () => {
    setSubOpen(false);
  });

  return (
    <>
      <Wrap>
        <div>
          <Container>
            <SubContainer >
              <SelectBox onClick={() => setOpen(!open)} active={open} ref={ref} isdrawer={isdrawer}>
                <SelectTxt>
                  {value === ""
                    ? "-"
                    : options.find((v) => v.sample_catgry_lrge_cl_cd === value)
                        .sample_catgry_lrge_cl_nm}
                </SelectTxt>
                <SelectIcon>
                  <img src={open ? SelectUpIcon : SelectDownIcon} />
                </SelectIcon>
              </SelectBox>
              {open && (
                <DropMenus>
                  {options !== undefined &&
                    options.map((d) => (
                      <Options
                        key={d.sample_catgry_lrge_cl_cd}
                        onClick={() =>
                          handleMainClick(d.sample_catgry_lrge_cl_cd)
                        }
                      >
                        {d.sample_catgry_lrge_cl_nm}
                      </Options>
                    ))}
                </DropMenus>
              )}
            </SubContainer>

            <SubContainer>
              <SelectBox onClick={() => setSubOpen(!subOpen)} ref={subRef} isdrawer={isdrawer}>
                <SelectTxt>
                  {subValue === ""
                    ? "-"
                    : options
                        .find((v) => v.sample_catgry_lrge_cl_cd === value)
                        .each_list.find(
                          (v) => v.sample_catgry_middle_cl_cd === subValue
                        ).sample_catgry_middle_cl_nm}
                </SelectTxt>
                <SelectIcon>
                  <img src={subOpen ? SelectUpIcon : SelectDownIcon} />
                </SelectIcon>
              </SelectBox>
              {subOpen && (
                <SubDropMenus>
                  {subOptions !== null && (
                    <>
                      <SubCategory>Sub Category</SubCategory>
                      {subOptions.map((d) => (
                        <SubOptions
                          key={d.sample_catgry_middle_cl_nm}
                          onClick={() =>
                            handleSubClick(d.sample_catgry_middle_cl_cd)
                          }
                        >
                          {d.sample_catgry_middle_cl_nm}
                        </SubOptions>
                      ))}
                    </>
                  )}
                </SubDropMenus>
              )}
            </SubContainer>
          </Container>
        </div>
        {subOptions &&
        <div>
          <CategoryDetailTextField
            variant="outlined"
            placeholder="직접입력"
            name="sample_catgry_direct_input"
            value={inputValue}
            onChange={handleInputChange}
            isdrawer={isdrawer}
          />
        </div>
        }
      </Wrap>
    </>
  );
}


const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
`;

const SubContainer = styled.div`
  & + & {
    margin-left: 10px;
  }
`;

const SelectBox = styled.div`
  
  @media (min-width: 1920px) {
    width: 295px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: ${(props) => props.isdrawer ? "270px" : "270px"};
  }
  @media (min-width: 10px) and (max-width: 1439px) {    
    width: ${(props) => props.isdrawer ? "295px" : "220px"};    
  } 
  height: 42px;
  border: 1px solid #dddddd;
  border-radius: 5px;
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  z-index: 3;

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
  width: 240px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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
  width: 295px;
  max-height: 421px;
  overflow: auto;
  font-size: 16px;
  font-weight: 500;
  color: #999999;
  border: 1px solid #dddddd;
  border-top: none;
  border-radius: 0 0 5px 5px;
  z-index: 3;
`;
const Options = styled.div`
  height: 42px;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
`;

const SubDropMenus = styled.div`
  width: 295px;
  position: absolute;
  padding: 40px 0 40px 40px;
  margin-top: 10px;
  border: solid 1px #dddddd;
  background-color: #ffffff;
  z-index: 2;
`;

const SubOptions = styled.div`
  font-size: 12px;
  cursor: pointer;
  color: #555555;

  &:hover {
    color: #000000;
    font-weight: bold;
  }

  & + & {
    margin-top: 15px;
  }
`;

const SubCategory = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 24px;
`;

const CategoryDetailTextField = styled(TextField)`

  @media (min-width: 1920px) {
    width: 295px;
    margin-left: 305px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: ${(props) => props.isdrawer ? "270px" : "270px"};    
    margin-left: ${(props) => props.isdrawer ? "280px" : "280px"};   
  }
  @media (min-width: 10px) and (max-width: 1439px) {    
    margin-left: ${(props) => props.isdrawer ? "305px" : "230px"};
    width: ${(props) => props.isdrawer ? "295px" : "220px"};    
  } 
  margin-top: 10px;
  

  .MuiOutlinedInput-input {
    padding: 11.5px 14px;
    font-size: 16px;
  }
  fieldset {
    border-color: #dddddd;
  }
`;