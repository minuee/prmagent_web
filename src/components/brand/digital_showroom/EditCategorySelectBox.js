import React, { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import { TextField } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { darken } from "polished";

import useOutsideClick from "../../UseOutsideClick";

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
  width: 295px;
  height: 42px;
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
  width: 240px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const SelectIcon = styled.div`
  padding-top: 3px;
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
  width: 295px;
  margin-top: 10px;
  margin-left: 305px;

  .MuiOutlinedInput-input {
    padding: 11.5px 14px;
    font-size: 16px;
  }
  fieldset {
    border-color: #dddddd;
  }
`;

export default function CategorySelectBox({
  mainValue = null,
  subValue = null,
  options,
  handleChange,
  inputValue,
  handleInputChange,
  handleInputInit,
  setGenderOptions,
}) {
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [newMainValue, setNewMainValue] = useState({
    sample_catgry_lrge_cl_cd: "",
    sample_catgry_lrge_cl_nm: "-",
  });
  const [newSubValue, setNewSubValue] = useState(null);
  const [subOptions, setSubOptions] = useState(null);

  const ref = useRef();
  const subRef = useRef();

  const handleMainClick = (cd, nm) => {
    setOpen(false);
    setNewMainValue({
      sample_catgry_lrge_cl_cd: cd,
      sample_catgry_lrge_cl_nm: nm,
    });
    setSubOptions(
      options.find((v) => v.sample_catgry_lrge_cl_cd === cd).each_list
    );
    setGenderOptions(
      options.find((v) => v.sample_catgry_lrge_cl_cd === cd).gender_size_list
    );
    setNewSubValue(null);
    handleInputInit("sample_catgry_direct_input");
  };

  const handleSubClick = (cd, nm) => {
    setSubOpen(false);
    handleChange(cd);
    setNewSubValue(nm);
    handleInputInit("sample_catgry_direct_input");
  };

  useOutsideClick(ref, () => {
    setOpen(false);
  });

  useOutsideClick(subRef, () => {
    setSubOpen(false);
  });

  useEffect(() => {
    setNewMainValue({
      sample_catgry_lrge_cl_cd: mainValue[0] || "",
      sample_catgry_lrge_cl_nm: mainValue[1] || "-",
    });
    setNewSubValue(subValue);
  }, [mainValue, subValue]);

  return (
    <>
      <Wrap>
        <div>
          <Container>
            <SubContainer>
              <SelectBox
                onClick={() => setOpen(!open)}
                active={open}
                onClose={() => setOpen(false)}
                ref={ref}
              >
                <SelectTxt>{newMainValue.sample_catgry_lrge_cl_nm}</SelectTxt>
                <SelectIcon>
                  {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </SelectIcon>
              </SelectBox>
              {open && (
                <DropMenus>
                  {options !== undefined &&
                    options.map((d) => (
                      <Options
                        key={d.sample_catgry_lrge_cl_cd}
                        onClick={() =>
                          handleMainClick(
                            d.sample_catgry_lrge_cl_cd,
                            d.sample_catgry_lrge_cl_nm
                          )
                        }
                      >
                        {d.sample_catgry_lrge_cl_nm}
                      </Options>
                    ))}
                </DropMenus>
              )}
            </SubContainer>

            <SubContainer>
              <SelectBox
                onClick={() => setSubOpen(!subOpen)}
                onClose={() => setSubOpen(false)}
                ref={subRef}
              >
                <SelectTxt>
                  {newSubValue === null ? "-" : newSubValue}
                </SelectTxt>
                <SelectIcon>
                  {subOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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
                            handleSubClick(
                              d.sample_catgry_middle_cl_cd,
                              d.sample_catgry_middle_cl_nm
                            )
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
        <div>
          <CategoryDetailTextField
            variant="outlined"
            placeholder="직접입력"
            name="sample_catgry_direct_input"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
      </Wrap>
    </>
  );
}
