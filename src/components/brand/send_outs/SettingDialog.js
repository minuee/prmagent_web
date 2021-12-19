import React, { useState, useCallback } from "react";
import { Dialog } from "@material-ui/core";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { useQuery } from "react-query";

import SettingIcon from "assets/setting_icon_w.png";
import Sheet from "./SendoutSheet";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

const useStyles = makeStyles(() => ({
  closeIcon: {
    fontSize: "24px",
  },
}));


function SettingDialog({ open, setOpen }) {
  const classes = useStyles();
  const [onMenu, setOnMenu] = useState("sheet");
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);

  const handleClose = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const handleClick = useCallback(
    (menu) => {
      setOnMenu(menu);
    },
    [onMenu]
  );

  const noticeQuery = useQuery(
    ["sendout-notice"],
    async () => await apiObject.getSendoutNotice()
  );

  if (noticeQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <StyleDialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        maxWidth={"lg"}
      >
        <WeekPickerWrapper active={isdrawer}>
          <CloseIconBox>
            <CloseIcon className={classes.closeIcon} onClick={handleClose} />
          </CloseIconBox>
          <SideWrap>
            <TitleWrap>
              <ImgWrap>
                <img src={SettingIcon} alt="setting" />
              </ImgWrap>
              <div>Settings</div>
            </TitleWrap>
            <MenusWrap>
              <Menu
                active={onMenu === "sheet" ? true : false}
                onClick={() => handleClick("sheet")}
              >
                연결시트 안내사항
              </Menu>
            </MenusWrap>
          </SideWrap>
          <ContentsWrap>{onMenu === "sheet" && <Sheet />}</ContentsWrap>
        </WeekPickerWrapper>
      </StyleDialog>
    </>
  );
}


const WeekPickerWrapper = styled.div`
  display: flex;
  height:630px;
  @media (min-width: 1920px) {
    width:1000px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width:1000px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width:900px
  }  
`;

const StyleDialog = styled(Dialog)`
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
  width: 100%;
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
