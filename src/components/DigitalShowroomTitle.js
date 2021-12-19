import React, { useMemo, useCallback, useState } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import SyncIcon from "@material-ui/icons/Sync";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";

import AddIcon from "assets/add_icon.png";
import NoticeIcon from "assets/notice_icon.png";
import BookIcon from "assets/book_icon.png";
import FilterIcon from "assets/filter_icon.png";
import SettingIcon from "assets/setting_icon.png";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer,currentToggleShow } from "redux/state";
import Constants from 'utils/constants';
import alertConfirm from 'react-alert-confirm';

function DigitalShowroom({
  handleAddBtnClick,
  lookbookBtn = false,
  handleLookBookClick = null,
  handleSelectOnBtn = null,
  handleFilterClick = null,
  handleSettingsClick = null,
  handleUpdateAllData = null,
}) {
  const history = useHistory();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);  
  const [toggleShow, setToggleShow] = useRecoilState(currentToggleShow);

  const handleShowroomClick = useCallback(() => {
    history.push("/brand/digital_showroom");
  });

  const handleChange2 = useCallback(async() => {
    if ( toggleShow ) { //전체비공개
      alertConfirm({
        title: Constants.appName,
        content: '해당 시즌에 등록된 정보를 모두 비공개처리하시겠습니까?',
        onOk: async() => {
          handleUpdateAllData('hide');
          setTimeout(() => setToggleShow(!toggleShow), 500);
        },
        onCancel: () => {setToggleShow(!toggleShow)}
      });
    }else{//전체공개
      alertConfirm({
        title: Constants.appName,
        content: '해당 시즌에 등록된 정보를 모두 공개처리하시겠습니까?',
        onOk: async() => {
          handleUpdateAllData('show');
          setTimeout(() => setToggleShow(!toggleShow), 500);
        },
        onCancel: () => {setToggleShow(!toggleShow)}
      });
    }
    //setToggleShow(!toggleShow);
  });

  const noticeQuery = useQuery(
    ["showroom-notice"],
    async () => await apiObject.getShowroomNotice({}),
    { keepPreviousData: true }
  );

  const notice = useMemo(
    () => (noticeQuery.isLoading ? "" : noticeQuery.data.notice_contents),
    [noticeQuery.data]
  );

  if (noticeQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <Container active={isdrawer}>
      {!lookbookBtn ? (
        <>
          <TitleTxt1>Digital<TitleTxt2>Showroom</TitleTxt2></TitleTxt1>
          <TitleTxt2Wrap active={isdrawer}>
            <TitleTxt2SubWrap>
              {notice !== "" && (
                <NoticeWrap>
                  <ImgWrap>
                    <ImgDiv src={NoticeIcon} alt="notice" />
                  </ImgWrap>
                  <div>{notice}</div>
                </NoticeWrap>
              )}
            </TitleTxt2SubWrap>
            <TitleTxt2SubWrap>
              <AddBtn width="136px" onClick={handleAddBtnClick}>
                <AddIconWrap>
                  <img src={AddIcon} alt="add" />
                </AddIconWrap>
                <OptTxtWrap>샘플 등록</OptTxtWrap>
              </AddBtn>
              <OptBtn width="96px" onClick={handleFilterClick}>
                <OptBtnImgWrap>
                  <img src={FilterIcon} alt="filter" />
                </OptBtnImgWrap>
                <OptTxtWrap>Filter</OptTxtWrap>
              </OptBtn>
              <Input>
                {/* <InputTitle>공개여부</InputTitle> */}
                
                <SwitchWrap>                  
                  <SwitchDiv onClick={() => handleChange2()}>
                      <input type="checkbox" style={{ display:"none"}} checked={toggleShow} readOnly/>
                      <Marble active={toggleShow? "on" : "off"} />
                      <SwitchBtn active={toggleShow ? "on" : "off"}>On</SwitchBtn>
                      <SwitchBtn active={toggleShow ? "on" : "off"}>Off</SwitchBtn>
                  </SwitchDiv>
                </SwitchWrap>
                
              </Input>
              <OptBtn width="120px" onClick={handleSettingsClick}>
                <OptBtnImgWrap>
                  <img src={SettingIcon} alt="setting" />
                </OptBtnImgWrap>
                <OptTxtWrap>Settings</OptTxtWrap>
              </OptBtn>
            </TitleTxt2SubWrap>
          </TitleTxt2Wrap>
        </>
      ) : (
        <>
          <TitleTxt2Wrap active={isdrawer}>
            <TitleTxt2SubWrap>
              <TitleTxt2>LookBook</TitleTxt2>
              <AddBtn onClick={handleSelectOnBtn}>
                <div>Select</div>
              </AddBtn>
            </TitleTxt2SubWrap>
            <TitleTxt2SubWrap>
              <OptBtn width="136px" onClick={handleShowroomClick}>
                <OptBtnImgWrap>
                  <SyncIcon />
                </OptBtnImgWrap>
                <OptTxtWrap>Showroom</OptTxtWrap>
              </OptBtn>
              <OptBtn width="96px" onClick={handleFilterClick}>
                <OptBtnImgWrap>
                  <img src={FilterIcon} alt="filter" />
                </OptBtnImgWrap>
                <OptTxtWrap>Filter</OptTxtWrap>
              </OptBtn>
            </TitleTxt2SubWrap>
          </TitleTxt2Wrap>
        </>
      )}
    </Container>
  );
}

const Input = styled.div`  
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right : 10px;
`;
const InputTitle = styled.div`
  font-size: 20px;
  font-weight: bold;  
 
`;


const SwitchWrap = styled.div`
  display: flex;
  align-items: center;

  & {
    margin-left:10px;
  }
`;

const SwitchTxt = styled.div`
    font-size: 18px;
    font-weight: bold;
    margin-right: 10px;
`;

const SwitchDiv = styled.div`
    width: 104px;
    height: 40px;
    border: 1px solid #e9e9e9;
    background-color: #f1f2ea;
    border-radius: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    color: #bababa;
    position: relative;
    cursor: pointer;
`;

const SwitchBtn = styled.div`
    width: 52px;
    text-align: center;
    transition: all 0.3s;
    padding-top: 2px;
    z-index: 2;

    ${(props) =>
        props.active === "on" &&
        css`color: #ffffff;`
    }
`;

const Marble = styled.div`
    width: 52px;
    height: 28px;
    border-radius: 500px;
    background-color: #000000;
    position: absolute;
    transition: all 0.3s;
    ${(props) => props.active === "on" ? css`left: 1px;` : css`left: 49px;`}
`;


const Container = styled.div`
  width:98%;  
`;
const TitleTxt1 = styled.div`
  display:flex;
  font-size: ${Constants.titleFontSize};
  font-weight: 100;
  line-height: ${Constants.titleFontSize};
  margin-bottom: 10px;
`;

const TitleTxt2 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-left: 10px;
`;

const TitleTxt2Wrap = styled.div`
  width: 100%;    
  
  @media (min-width: 1920px) {
    display: flex; 
    justify-content: space-between;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    display: flex; 
    justify-content: space-between;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    display: ${(props) => (props.active ? "flex" : "relative")};  
    justify-content: ${(props) => (props.active ? "space-between" : "flex-start")};  
    
  }   
`;

const TitleTxt2SubWrap = styled.div`
  display:flex;
  @media (min-width: 1920px) {
    align-items:center;
    justify-content: center;  
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    align-items:center;
    justify-content: center;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    margin-top : ${(props) => (props.active ? "0px" : "20px")};
  } 
`;

const NoticeWrap = styled.div`
  display: flex;
  align-items: flex-end;
  font-size: 18px;
  cursor: pointer;
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
  background-color: #7ea1b2;
  min-width: 128px;
  height: 40px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 16px;
  cursor: pointer;
  margin-left: 20px;
  margin-right: 20px;
  transition: all 0.3s;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);

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

const OptBtn = styled.div`
  display: flex;
  width: ${(props) => props.width || "120px"};
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

export default React.memo(DigitalShowroom);
