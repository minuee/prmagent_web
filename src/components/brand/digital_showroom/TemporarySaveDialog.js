import React from "react";
import { Dialog, DialogContent, TextField } from "@material-ui/core";
import styled, { css } from "styled-components";
import { darken } from "polished";

import CloseIcon from "assets/close_icon.svg";
import CheckIcon from "assets/check_icon.svg";

const StyleDialog = styled(Dialog)`
  .MuiDialogTitle-root {
    padding: 0;
  }
  .MuiPaper-rounded {
    border-radius: 0;
  }
  .MuiDialogContent-root:first-child {
    padding: 40px 0 0 0;
  }
`;

const StyleDialogContent = styled(DialogContent)`
  width: 416px;
  height: 172px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const SubTitle = styled.div`
  font-size: 12px;
  color: #999999;
  margin-bottom: 30px;
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 60px;
`;

const BtnWrap = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: solid 1px #dddddd;
  color: ${(props) => (props.type === "cancel" ? "#999999" : "#7ea1b2")};
  ${(props) =>
    props.type === "confirm" &&
    css`
      border-left: none;
    `}
  transition: all 0.3s;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
  &:active {
    background-color: ${darken(0.2, "#ffffff")};
  }
`;

const BtnImgWrap = styled.div`
  margin-right: 10px;
  display: flex;
`;

const ConfirtTxt = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #7ea1b2;
`;

const CancelTxt = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #999999;
`;

export default function TemporarySaveDialog({
  open,
  setOpen,
  title,
  subTitle,
  handleConfirm,
  handleCancel,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyleDialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        maxWidth={"md"}
      >
        <StyleDialogContent>
          <Title>{title}</Title>
          <SubTitle>{subTitle}</SubTitle>
          <BottomWrap>
            <BtnWrap type="cancel" onClick={handleCancel}>
              <BtnImgWrap>
                <img src={CloseIcon} alt="close" style={{ width: "12px" }} />
              </BtnImgWrap>
              <CancelTxt>새로 등록</CancelTxt>
            </BtnWrap>
            <BtnWrap type="confirm" onClick={handleConfirm}>
              <BtnImgWrap>
                <img src={CheckIcon} alt="check" />
              </BtnImgWrap>
              <ConfirtTxt>파일 열기</ConfirtTxt>
            </BtnWrap>
          </BottomWrap>
        </StyleDialogContent>
      </StyleDialog>
    </>
  );
}
