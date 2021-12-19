import React from "react";
import { useHistory } from "react-router-dom";
import { Dialog, DialogContent } from "@material-ui/core";
import styled, { css } from "styled-components";
import { darken } from "polished";
import CloseIcon from "@material-ui/icons/Close";

import ConfirmCheckIcon from "../assets/confirm_check_icon.png";

const StyleDialog = styled(Dialog)`
  .MuiDialogTitle-root {
    padding: 0;
  }
  .MuiPaper-rounded {
    border-radius: 0;
  }
`;

const StyleDialogContent = styled(DialogContent)`
  width: 416px;
  height: 302px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CloseIconBox = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
`;

const ImgBox = styled.div`
  width: 72px;
  height: 72px;

  border-raduis: 15px;
  margin-bottom: 20px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #222222;
  margin-bottom: 5px;
`;

const SubTitle = styled.div`
  font-size: 12px;
  color: #999999;
  margin-bottom: 30px;
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const BtnWrap = styled.div`
  width: 160px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.type === "cancel" ? "#ffffff" : "#7ea1b2"};
  border: ${(props) =>
    props.type === "cancel" ? "solid 1px #dddddd" : "none"};
  border-radius: 5px;
  transition: all 0.3s;

  ${(props) =>
    props.type === "cancel" &&
    css`
      &:hover {
        background-color: ${darken(0.1, "#ffffff")};
      }
      &:active {
        background-color: ${darken(0.2, "#ffffff")};
      }
    `}

  ${(props) =>
    props.type === "confirm" &&
    css`
      &:hover {
        background-color: ${darken(0.1, "#7ea1b2")};
      }
      &:active {
        background-color: ${darken(0.2, "#7ea1b2")};
      }
    `} 

  & + & {
    margin-left: 10px;
  }
`;

const ConfirtTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
`;

export default function AlertDialog({ open }) {
  const history = useHistory();

  const handleConfirm = () => {
    history.push("/brand/lookbook");
  };

  const handleClose = () => {
    history.push("/brand/digital_showroom");
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
          <CloseIconBox>
            <CloseIcon onClick={handleClose} />
          </CloseIconBox>
          <ImgBox>
            <img src={ConfirmCheckIcon} alt="success" />
          </ImgBox>
          <Title>새로운 룩북이 생성되었습니다.</Title>
          <SubTitle>룩북 목록에서 확인하실 수 있습니다.</SubTitle>

          <BottomWrap>
            <BtnWrap type="confirm" onClick={handleConfirm}>
              <ConfirtTxt>Confirm</ConfirtTxt>
            </BtnWrap>
          </BottomWrap>
        </StyleDialogContent>
      </StyleDialog>
    </>
  );
}
