import React from "react";
import styled from "styled-components";
import { lighten } from "polished";
import Constants from 'utils/constants';
import SelectDate from "components/SelectDate";

const HeadWrap = styled.div`
  margin-bottom: 64px;
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TitleTxt1 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: 100;
  line-height: ${Constants.titleFontSize};
  margin-bottom: 10px;
`;

const TitleTxt2 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-right: 40px;
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
  background-color: #000000;
  min-width: 141px;
  height: 50px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 16px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);

  &:hover {
    background-color: ${lighten(0.3, "#000000")};
  }

  &:active {
    background-color: ${lighten(0.5, "#000000")};
  }
`;

const BrandTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export default function PressReleaseTitle({
  value,
  searchOptions,
  currentBrand,
  handleChange,
  handleBrandsBtn,
}) {
  return (
    <>
      <HeadWrap>
        <TitleTxt1>Press</TitleTxt1>
        <TitleTxt2Wrap>
          <TitleTxt2SubWrap>
            <TitleTxt2>Release</TitleTxt2>
            <AddBtn onClick={handleBrandsBtn}>
              <div>BRANDS</div>
            </AddBtn>
          </TitleTxt2SubWrap>
        </TitleTxt2Wrap>
      </HeadWrap>
      <BrandTitle>{currentBrand.brand_nm}</BrandTitle>
      {searchOptions.length > 0 && (
        <BottomWrap>
          <SelectDate
            value={value}
            options={searchOptions}
            handleChange={handleChange}
          />
        </BottomWrap>
      )}
    </>
  );
}
