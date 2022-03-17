import React, { useState } from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import styled, { css } from "styled-components";
import { darken } from "polished";
import CloseIcon from "@material-ui/icons/Close";

import ConfirmedIcon from "assets/scheduler/confirmedIcon.svg";
import CheckIcon from "assets/check_icon.png";
import MessageDialog from "components/MessageDialog";

const StyleDialog = styled(Dialog)`
  .MuiDialogTitle-root {
    padding: 0;
  }
  .MuiPaper-rounded {
    border-radius: 0;
  }
  .MuiDialogContent-root:first-child {
    padding: 57px 20px 20px 20px;
  }
`;

const StyleDialogContent = styled(DialogContent)`
  width: 320px;
  height: 250px;
  display: flex;
  flex-direction: column;
`;

const CloseIconBox = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
`;

const Contents = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > img {
    width: 72px;
    height: 72px;
    margin-bottom: 20px;
  }
  .sub {
    font-size: 14px;
    font-weight: bold;
    color: #222222;
  }
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
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

const BtnImgWrap = styled.div`
  margin-right: 10px;
  display: flex;
`;

const ConfirtTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
`;

const CancelTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #999999;
`;

export default function ConfirmDialog({
  open,
  setOpen,
  inputs,
  setInputs,
  handleConfirm,
}) {
  const [msgDialog, setMsgDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (type) => {
    // handleConfirm(type);
    setMsgDialog(true);
    setOpen(false);
    setType(type);
  };

  const handleMsgConfirm = () => {
    setMsgDialog(false);
    setInputs({ ...inputs, msg: msg });
    handleConfirm(type);
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
          <Contents>
            <img src={ConfirmedIcon} alt="" />
            <div className="sub">요청을 승인하시겠습니까?</div>
          </Contents>
          <BottomWrap>
            <BtnWrap type="cancel" onClick={() => handleSubmit("refuse")}>
              <CancelTxt>Reject</CancelTxt>
            </BtnWrap>
            <BtnWrap type="confirm" onClick={() => handleSubmit("confirm")}>
              <BtnImgWrap>
                <img src={CheckIcon} alt="check"></img>
              </BtnImgWrap>
              <ConfirtTxt>Confirm</ConfirtTxt>
            </BtnWrap>
          </BottomWrap>
        </StyleDialogContent>
      </StyleDialog>

      <MessageDialog
        open={msgDialog}
        setOpen={setMsgDialog}
        input={msg}
        setInput={setMsg}
        handleConfirm={handleMsgConfirm}
      />
    </>
  );
}
