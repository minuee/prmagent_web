import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { darken } from "polished";

import AddIcon from "../assets/add_icon.png";
import SelectDate from "./SelectDate";

import Constants from '../utils/constants';


const MainContainer = styled.div`
  width: 98%;
`;

const HeadWrap = styled.div`  
  margin-bottom: 34px;
  display: flex;
  justify-content: space-between;
  align-items: center;    
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TitleTxt1 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: 100;
  display: flex;
  line-height: ${Constants.titleFontSize};  
`;

const TitleTxt2 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-left: 10px;
`;

const TitleTxt2Wrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TitleTxt2SubWrap = styled.div`
  display: flex;
`;

const AddBtn = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background-color: #7ea1b2;
  min-width: 108px;
  height: 40px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 16px;
  cursor: pointer;
  margin-right: 20px;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);
  transition: all 0.3s;

  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
  }

  &:active {
    background-color: ${darken(0.2, "#7ea1b2")};
  }
`;

const AddIconWrap = styled.div`
  margin-right: 10px;
`;

function PressReleaseTitle({ value, searchOptions, handleChange }) {
  const history = useHistory();

  const handleAddBtn = useCallback(() => {
    history.push("/brand/press_release/add");
  });

  return (
    <MainContainer>
      <HeadWrap>
        <TitleTxt1>Press<TitleTxt2>Release</TitleTxt2></TitleTxt1>
        <AddBtn onClick={handleAddBtn}>
          <AddIconWrap>
            <img src={AddIcon} alt="add" />
          </AddIconWrap>
          <div>ADD</div>
        </AddBtn>
        
      </HeadWrap>
      {searchOptions.length > 0 && (
        <BottomWrap>
          <SelectDate
            value={value}
            options={searchOptions}
            handleChange={handleChange}
          />
        </BottomWrap>
      )}
    </MainContainer>
  );
}

export default React.memo(PressReleaseTitle);
