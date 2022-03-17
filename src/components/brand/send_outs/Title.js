import React, { useState, useRef, useCallback } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";

import SettingDialog from "components/brand/send_outs/SettingDialog";
import ChevronDown from "assets/sheet/chevronDown.svg";
import SettingIcon from "assets/sheet/settingsIcon.svg";
import useOutsideClick from "components/UseOutsideClick";
import WeekPicker from "components/WeekPicker";

import Constants from '../../../utils/constants';
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

function Title({view,setView,startDt,setStartDt,endDt,setEndDt,handleViewInit}) {
  const ref = useRef();
  const [viewOpen, setViewOpen] = useState(false);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const [dialogOpen, setDialogOpen] = useState(false);

  useOutsideClick(ref, () => {
    setViewOpen(false);
  });

  const handleViewClick = useCallback(
    (view) => {
      setView(view);
      setViewOpen(false);
      handleViewInit();
    },
    [view, viewOpen]
  );

  return (
    <>
      <Container>
        <div style={{ display: "flex" }}>
          <Wrap ref={ref}>
            <TitleTxt onClick={() => setViewOpen(!viewOpen)}>
              {view}
              <img src={ChevronDown} alt="" style={{ marginLeft: "12px" }} />
            </TitleTxt>
            {viewOpen && (
              <Popup>
                <PopupMenus
                  active={view === "Send Out"}
                  onClick={() => handleViewClick("Send Out")}
                >
                  Send Out
                </PopupMenus>
                <PopupMenus
                  active={view === "Returns"}
                  onClick={() => handleViewClick("Returns")}
                >
                  Returns
                </PopupMenus>
              </Popup>
            )}
          </Wrap>
          <SettingWrap onClick={() => setDialogOpen(!dialogOpen)}>
            <img src={SettingIcon} alt="" style={{ width: "32px" }} />
            {/* <SubTitleTxt>공지사항등록</SubTitleTxt> */}
          </SettingWrap>
        </div>
        <WeekPickerWrapper active={isdrawer}>
          <WeekPicker
            startDt={startDt}
            setStartDt={setStartDt}
            endDt={endDt}
            setEndDt={setEndDt}
          />
        </WeekPickerWrapper>
      </Container>

      <SettingDialog open={dialogOpen} setOpen={setDialogOpen} />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Wrap = styled.div`
  display: flex;
  width: 254px;
  position: relative;
`;

const WeekPickerWrapper = styled.div`
  @media (min-width: 1920px) {
    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "350px" : "280px")};
  }  
`;

const TitleTxt = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-right: 20px;
  margin-bottom: 30px;
  cursor: pointer;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;


const SubTitleTxt = styled.div`
  font-size: 20px;
  font-weight: bold;
  line-height: 30px;
  cursor: pointer;
  display: flex;  
  align-items: center;
  justify-content: center;
`;

const SettingWrap = styled.div`
  display: flex;
  height: 48px;
  cursor: pointer;
  align-items: flex-start;
  justify-content: center;
  
`;

const Popup = styled.div`
  position: absolute;
  top: 58px;
  display: flex;
  flex-direction: column;
  width: 234px;
  height: 152px;
  border: solid 1px #dddddd;
  background-color: #ffffff;
  padding: 30px 0px;
`;

const PopupMenus = styled.div`
  font-size: 20px;
  font-weight: 500;
  padding: 10px 40px;
  cursor: pointer;

  ${(props) =>
    props.active
      ? css`
          background-color: #7ea1b2;
          color: #ffffff;
          &:hover {
            background-color: ${darken(0.2, "#7ea1b2")};
          }
        `
      : css`
          background-color: #ffffff;
          color: #000000;
          &:hover {
            background-color: #dddddd;
          }
        `}
`;

export default React.memo(Title);
