import React, { useState, useCallback } from "react";
import styled, { css } from "styled-components";
import { darken, lighten } from "polished";
import { useParams, useHistory } from "react-router-dom";

import ShowroomPage from "./showroom";
import PressPage from "./press";
import FilterIcon from "assets/filter_icon.png";
import Constants from '../../../utils/constants';

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";



function Favorites() {
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const { brand_id, loc } = useParams();
  const history = useHistory();
  const [showBrandBtn, setShowBrandBtn] = useState(false);
  const [pressBrandBtn, setPressBrandBtn] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filterData, setFilterData] = useState({
    gender_list: [],
    category_list: [],
    color_list: [],
    material_list: [],
    size_list: [],
    in_yn: null,
    still_life_img_yn: null,
  });

  const handleFavTypeBtn = useCallback((favType) => {
    if (brand_id === undefined) {
      history.push(`/magazine/favorites/${favType}`);
    } else {
      history.push(`/magazine/favorites/${brand_id}/${favType}`);
    }
  });

  return (
    <Container active={isdrawer}>
      <TitleWrap>
        <TitleTxt>Favorites</TitleTxt>
      </TitleWrap>
      <BtnOuterWrap>
        <div style={{ display: "flex",justifyContent:'center',alignItems:'center'}}>
          <BtnWrap>
            <Btn
              active={loc === "show" || loc === undefined}
              onClick={() => handleFavTypeBtn("show")}
            >
              Digital Showroom
            </Btn>
            <Btn
              active={loc === "press"}
              style={{ width: "162px" }}
              onClick={() => handleFavTypeBtn("press")}
            >
              Press Release
            </Btn>
          </BtnWrap>
        </div>
        <div style={{ display: "flex",justifyContent:'center',alignItems:'center' }}>
          {(loc === "show" || loc === undefined) && (
              <AddBtn onClick={() => setShowBrandBtn(true)}>
                <div>BRANDS</div>
              </AddBtn>
            )}
            {loc === "press" && (
              <AddBtn onClick={() => setPressBrandBtn(true)}>
                <div>BRANDS</div>
              </AddBtn>
            )}
          {(loc === "show" || loc === undefined) && (
            <OptBtn onClick={() => setFilterDialogOpen(!filterDialogOpen)}>
              <OptBtnImgWrap>
                <img src={FilterIcon} alt="filter" />
              </OptBtnImgWrap>
              <div>Filter</div>
            </OptBtn>
          )}
        </div>
      </BtnOuterWrap>

      {(loc === "show" || loc === undefined) && (
        <ShowroomPage
          brandId={brand_id}
          brandOpen={showBrandBtn}
          setBrandOpen={setShowBrandBtn}
          filterOpen={filterDialogOpen}
          setFilterOpen={setFilterDialogOpen}
          filterData={filterData}
          setFilterData={setFilterData}
        />
      )}

      {loc === "press" && (
        <PressPage
          brandId={brand_id}
          open={pressBrandBtn}
          setOpen={setPressBrandBtn}
        />
      )}
    </Container>
  );
}

//active={isdrawer}
const Container = styled.div`  
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1000px" : "960px")};        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "600px")};    
  } 
`;


const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  width:96%;
`;

const TitleTxt = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-right: 40px;
  margin-bottom: 15px;
`;

const BtnOuterWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;  
  margin-bottom: 40px;
  width:96%;
`;
const OptBtn = styled.div`
  display: flex;
  width: 106px;
  height: 40px;
  border-radius: 5px;
  border: solid 1px #dddddd;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  cursor: pointer;
  transition: all 0.3s;
  margin-left: 12px;
  
  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }

  &:active {
    background-color: ${darken(0.2, "#ffffff")};
  }
`;

const OptBtnImgWrap = styled.div`
  margin-right: 8px;
  display: flex;
`;

const BtnWrap = styled.div`
  display: flex;
  align-items: center;  
`;

const Btn = styled.button`
  width: 196px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: ${(props) => (props.active ? "#000000" : "#dddddd")};
  border: none;
  cursor: pointer;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;

  ${(props) =>
    props.active
      ? css`
          &:hover {
            background-color: ${lighten(0.2, "#000000")};
          }
          &:active {
            background-color: ${lighten(0.3, "#000000")};
          }
        `
      : css`
          &:hover {
            background-color: ${darken(0.05, "#dddddd")};
          }
          &:active {
            background-color: ${darken(0.1, "#dddddd")};
          }
        `}

  & + & {
    margin-left: 8px;
  }
`;

const AddBtn = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background-color: #000000;
  min-width: 141px;
  height: 40px;
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

export default Favorites;
