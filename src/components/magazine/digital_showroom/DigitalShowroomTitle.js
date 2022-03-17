import React from "react";
import styled from "styled-components";
import { darken, lighten } from "polished";
import { useHistory } from "react-router-dom";
import SyncIcon from "@material-ui/icons/Sync";

import NoticeIcon from "assets/notice_icon.png";
import FilterIcon from "assets/filter_icon.png";
import Constants from 'utils/constants';
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

const Container = styled.div`
  width:calc(100%-25px);
  margin-left:25px;  
`;

const TitleTxt1 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: 100;
  line-height: ${Constants.titleFontSize};
  display: flex;
  
`;
const Bolding =  styled.div`
  font-weight: bold;
  margin-left: 10px;
`;

const TitleTxt2 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-left: 20px;
`;

const TitleTxt2Wrap = styled.div`
  width:99%;
  @media (min-width: 1920px) {
    display: flex;  
    justify-content: space-between;
  
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    display: flex;  
    justify-content: space-between;
  
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    display: relative;  
    justify-content: flex-start ;
  
  }   
`;

const TitleTxt2SubWrap = styled.div`
  display: flex;
  @media (min-width: 1920px) {

  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    margin-top: ${(props) => props.addTopPadding ? "20px" : "0px"};
  } 
`;

const NoticeWrap = styled.div`
  display: flex;
  align-items: flex-end;
  font-size: 18px;
  cursor: pointer;
  margin-left: 20px;
`;

const ImgWrap = styled.div`
  height: 24px;
`;

const ImgDiv = styled.img`
  width: 20px;
  margin-right: 10px;
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

const OptBtn = styled.div`
  display: flex;
  width: ${(props) => props.width || "120px"};
  height: 50px;
  border-radius: 5px;
  border: solid 1px #dddddd;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  cursor: pointer;
  transition: all 0.3s;

  & + & {
    margin-left: 12px;
  }

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

const OptTxtWrap = styled.div``;

export default function DigitalShowroom({
  selectBtn = false,
  notice,
  handleBrandsBtn,
  handleSelectBtn = null,
  handleFilterBtn = null,
}) {
  const history = useHistory();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const handleShowroomClick = () => {
    history.push("/magazine/digital_showroom");
  };

  return (
    <>
      {!selectBtn ? (
        <Container>
          <TitleTxt1>Digital <Bolding>Showroom</Bolding></TitleTxt1>          
        </Container>
      ) : (
        <Container>
          <TitleTxt1>Sample <TitleTxt2>Requests</TitleTxt2></TitleTxt1>
        </Container>
      )}
    </>
  );
}
