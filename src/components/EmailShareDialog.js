import React from "react";
import { Dialog, DialogContent, Divider, TextField } from "@material-ui/core";
import styled, { css } from "styled-components";
import { darken } from "polished";
import CloseIcon from "@material-ui/icons/Close";

import CancelIcon from "../assets/close_icon.png";
import CheckIcon from "../assets/check_icon.png";

const StyleDialog = styled(Dialog)`
  .MuiDialogTitle-root {
    padding: 0;
  }
  .MuiPaper-rounded {
    border-radius: 20px;
  }
  .MuiDialogContent-root:first-child {
    padding: 58px 80px;
  }
`;

const StyleDialogContent = styled(DialogContent)`
  width: 960px;

  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  width: 100%;
`;

const StyleDivider = styled(Divider)`
  margin: 15px 0 40px 0;
  height: 2px;
  background-color: #dddddd;
`;

const InputWrap = styled.div`
  margin-bottom: 20px;
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
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

const ConfirmTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
`;

const StyleTextField = styled(TextField)`
  width: 100%;
  font-size: 16px;

  .MuiInputBase-root {
    background-color: #f6f6f6;
  }

  .MuiOutlinedInput-root {
    border-radius: 5px;
  }

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;

const StyleTextField2 = styled(TextField)`
  width: 100%;
  font-size: 16px;

  .MuiOutlinedInput-root {
    border-radius: 5px;
  }
`;

const BtnImgWrap = styled.div`
  margin-right: 10px;
  display: flex;
`;

const CancelTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #999999;
`;

const ChipWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const Chip = styled.div`
  font-size: 16px;
  font-weight: 500;
  height: 36px;
  border-radius: 60px;
  border: solid 1px #707070;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  margin-bottom: 10px;
  margin-right: 12px;
`;

const StyleCloseIcon = styled(CloseIcon)`
  font-size: 20px;
  margin-left: 20px;
  cursor: pointer;
`;

export default function EmailShareDialog({
  open,
  setOpen,
  inputs,
  setInputs,
  handleChange,
  handleConfirm,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      setInputs({
        ...inputs,
        email: [...inputs.email, e.target.value],
      });
      e.target.value = "";
    }
  };

  const handleDelete = (data) => {
    setInputs({
      ...inputs,
      email: inputs.email.includes(data)
        ? inputs.email.filter((d) => d !== data)
        : [...inputs.email, data],
    });
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
          <Title>
            E-mail Share
            <StyleDivider />
          </Title>
          <InputWrap>
            <StyleTextField
              variant="outlined"
              placeholder="Email"
              onKeyPress={handleEnterPress}
            />
          </InputWrap>
          <ChipWrap>
            {inputs.email.length > 0 &&
              inputs.email.map((d, i) => (
                <Chip key={`${d}_${i}`}>
                  {d}
                  <StyleCloseIcon onClick={() => handleDelete(d)} />
                </Chip>
              ))}
          </ChipWrap>
          <InputWrap>
            <StyleTextField2
              variant="outlined"
              placeholder="Message"
              multiline
              rows={14}
              name="message"
              value={inputs.message}
              onChange={handleChange}
            />
          </InputWrap>
          <BottomWrap>
            <BtnWrap type="cancel" onClick={handleClose}>
              <BtnImgWrap>
                <img src={CancelIcon} alt="cancel"></img>
              </BtnImgWrap>
              <CancelTxt>Cancel</CancelTxt>
            </BtnWrap>
            <BtnWrap type="confirm" onClick={handleConfirm}>
              <BtnImgWrap>
                <img src={CheckIcon} alt="check"></img>
              </BtnImgWrap>
              <ConfirmTxt>Confirm</ConfirmTxt>
            </BtnWrap>
          </BottomWrap>
        </StyleDialogContent>
      </StyleDialog>
    </>
  );
}
