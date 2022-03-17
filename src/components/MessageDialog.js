import React, { useCallback } from "react";
import { Dialog, DialogContent, TextField } from "@material-ui/core";
import styled, { css } from "styled-components";
import { darken } from "polished";
import CloseIcon from "@material-ui/icons/Close";

import CheckIcon from "../assets/check_icon.png";

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
  width: 520px;
  height: 327px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const CloseIconBox = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StyleTextField = styled(TextField)`
  .MuiInputBase-input {
    font-size: 12px;
  }
  .MuiOutlinedInput-root {
    border-radius: 5px;
  }
  .MuiOutlinedInput-multiline {
    padding: 12px;
  }
  .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }

  margin-bottom: 24px;
`;

const BottomWrap = styled.div`
  display: flex;
  margin-top:15px;
  justify-content: flex-end;
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

function AlertDialog({ open, setOpen, input, setInput, handleConfirm,handleMsgConfirmSkip }) {
  const handleChange = useCallback(
    (e) => {
      console.log('AlertDialog',e.target.value)
      setInput(e.target.value);
    },
    [input]
  );
  

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [open]);

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
          <Title>Message</Title>
          <StyleTextField
            variant="outlined"
            multiline
            rows={5}
            placeholder="200자 이내의 메시지를 입력해주세요."
            value={input}
            onChange={handleChange}
          />
          <BottomWrap>
            <BtnWrap type="cancel" onClick={handleMsgConfirmSkip}>
              <CancelTxt>Skip</CancelTxt>
            </BtnWrap>
            <BtnWrap type="confirm" onClick={handleConfirm}>
              <BtnImgWrap>
                <img src={CheckIcon} alt="check"></img>
              </BtnImgWrap>
              <ConfirtTxt>Confirm</ConfirtTxt>
            </BtnWrap>
          </BottomWrap>
        </StyleDialogContent>
      </StyleDialog>
    </>
  );
}

export default React.memo(AlertDialog);
