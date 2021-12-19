import React, { useState, useCallback } from "react";
import { Dialog } from "@material-ui/core";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import NoticeComponent from "../components/NoticeComponent";
import InquiryNumber from "../components/InquiryNumber";
import ShowroomInquiry from "../components/ShowroomInquiry";
import Unavailable from "../components/Unavaliable";
import SettingIcon from "../assets/setting_icon_w.png";

function SettingDialog({ open, setOpen }) {
  const classes = useStyles();
  const [onMenu, setOnMenu] = useState("notice");

  const handleClose = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const handleClick = useCallback(
    (menu) => {
      setOnMenu(menu);
    },
    [onMenu]
  );

  return (
    <>
      <StyleDialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        maxWidth={"lg"}
      >
        {/* <div style={{ width: "1200px", height: "630px", display: "flex" }}> */}
        <ModalWrapper >
          <CloseIconBox>
            <CloseIcon className={classes.closeIcon} onClick={handleClose} />
          </CloseIconBox>
          <SideWrap>
            <TitleWrap>
              <ImgWrap>
                <img src={SettingIcon} alt="setting" />
              </ImgWrap>
              <div>공지사항등록</div>
            </TitleWrap>
            <MenusWrap>
              <Menu
                active={onMenu === "notice" ? true : false}
                onClick={() => handleClick("notice")}
              >
                공지사항
              </Menu>
              <Menu
                active={onMenu === "inquiry" ? true : false}
                onClick={() => handleClick("inquiry")}
              >
                소비자 문의번호
              </Menu>
              <Menu
                active={onMenu === "showroom" ? true : false}
                onClick={() => handleClick("showroom")}
              >
                쇼룸 문의번호
              </Menu>
              <Menu
                active={onMenu === "unavailable" ? true : false}
                onClick={() => handleClick("unavailable")}
              >
                쇼룸 휴무일 설정
              </Menu>
            </MenusWrap>
          </SideWrap>
          <ContentsWrap>
            {onMenu === "notice" && (
              <NoticeComponent handleClose={handleClose} />
            )}
            {onMenu === "inquiry" && (
              <InquiryNumber handleClose={handleClose} />
            )}
            {onMenu === "showroom" && (
              <ShowroomInquiry handleClose={handleClose} />
            )}
            {onMenu === "unavailable" && (
              <Unavailable handleClose={handleClose} />
            )}
          </ContentsWrap>
        </ModalWrapper>
      </StyleDialog>
    </>
  );
}

const useStyles = makeStyles(() => ({
  closeIcon: {
    fontSize: "24px",
  },
}));

const StyleDialog = styled(Dialog)`
  align-items: center;
  justify-content: center;
  @media (min-width: 1920px) {
    width: 1140px 
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: 1140px  
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 900px
  } 
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0);
  }
  .MuiPaper-rounded {
    border-radius: 20px;
  }
  .MuiDialogTitle-root {
    padding: 0;
  }
`;
const ModalWrapper= styled.div`
  @media (min-width: 1920px) {
    width: 1040px 
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: 1040px  
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 800px
  } 
  height: 630px;
  display: flex;
`;
const CloseIconBox = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const SideWrap = styled.div`
  width: 240px;
  height: 100%;
  background-color: #000000;
`;

const ContentsWrap = styled.div`
  @media (min-width: 1920px) {
    width: 800px 
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: 800px  
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 600px
  } 
  padding: 58px 80px 40px 80px;
  overflow: auto;
`;

const TitleWrap = styled.div`
  display: flex;
  height: 100px;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
  font-weight: 900;
  padding-left: 20px;
  border-bottom: 1px solid #707070;
`;

const ImgWrap = styled.div`
  display: flex;
  margin-right: 10px;
`;

const MenusWrap = styled.div``;

const Menu = styled.div`
  color: #ffffff;
  display: flex;
  align-items: center;
  padding-left: 20px;
  height: 72px;
  font-size: 16px;
  cursor: pointer;
  ${(props) =>
    props.active &&
    css`
      background-color: #7ea1b2;
      font-weight: bold;
    `}

  &:hover {
    background-color: #7ea1b2;
  }
  &:active {
    background-color: ${darken(0.1, "#7ea1b2")};
  }
`;

export default React.memo(SettingDialog);
