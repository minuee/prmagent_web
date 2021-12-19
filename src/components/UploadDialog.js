import React, { useState } from "react";
import {
  DialogTitle,
  DialogContent,
  Dialog,
  DialogActions,
  Divider,
} from "@material-ui/core";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import CheckIcon from "../assets/check_icon.png";
import UploadIcon from "../assets/upload_icon.png";

const useStyles = makeStyles((theme) => ({
  dialog: {},
  dialogTitle: {
    marginTop: "58px",
    textAlign: "center",
  },
  closeIcon: {
    fontSize: "24px",
  },
  inputText: {
    height: "0px",
    fontSize: "14px",
  },
  inputBgText: {
    height: "0px",
    fontSize: "14px",
    backgroundColor: "#f6f6f6",
  },
  checkIcon: {
    paddingTop: "5px",
    paddingRight: "5px",
    fontSize: "24px",
    color: "#7ea1b2",
  },
  TextField: {
    width: "340px",
    height: 0,
  },
}));

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
  .MuiDialog-paperWidthLg {
    width: 595px;
    height: 514px;
  }
  .MuiDialog-scrollPaper {
    position: fixed;
    top: 218px;
    left: 510px;
    align-items: unset;
    justify-content: unset;
  }
  .MuiDialogContent-root {
    padding: 40px 40px 0 42px;
  }
`;

const CloseIconBox = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const BottomWrap = styled.div`
  display: flex;
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

const Title = styled.div`
  font-size: 28px;
  font-weight: 900;
  color: #cccccc;
`;

const StyleDivider = styled(Divider)`
  margin: 16px 0;
  height: 2px;
  background-color: #dddddd;
`;

const SelectTxt = styled.div`
  font-size: 16px;
  color: #7ea1b2;
  text-align: right;
  margin-bottom: 16px;
`;

const Upload = styled.div`
  display: flex;
  justify-content: space-between;
`;

const UploadWrap = styled.div`
  width: 151px;
  height: 227px;
  border: 2px solid #dddddd;
  background-color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  color: #999999;
`;

const UploadIconImg = styled.div`
  margin-bottom: 10px;
`;

const BottomDivider = styled(Divider)`
  margin: 40px 0 30px 0;
  height: 2px;
  background-color: #dddddd;
`;

export default function UploadDialog({ open, setOpen, inputs, handleChange }) {
  const classes = useStyles();

  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <>
      <StyleDialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        maxWidth={"lg"}
        className={classes.dialog}
      >
        <DialogContent>
          <CloseIconBox>
            <CloseIcon className={classes.closeIcon} onClick={handleClose} />
          </CloseIconBox>
          <Title>Image Upload</Title>
          <StyleDivider />
          <SelectTxt>대표 이미지 선택</SelectTxt>
          <Upload>
            <UploadWrap>
              <>
                <input
                  accept="image/png"
                  id="runway-img-input"
                  type="file"
                  style={{
                    display: "none",
                  }}
                  onChange={handleChange}
                />
                <label
                  htmlFor="runway-img-input"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    cursor: "pointer",
                    width: "151px",
                    height: "227px",
                  }}
                >
                  {inputs.img_url === "" || inputs.img_url === null ? (
                    <>
                      <UploadIconImg>
                        <img src={UploadIcon} alt="runway_image" />
                      </UploadIconImg>
                      <div>Upload</div>
                      <div>Runway</div>
                      <div>Image</div>
                    </>
                  ) : (
                    <img src={inputs.img_url} alt="runway_image" />
                  )}
                </label>
              </>
            </UploadWrap>
            <UploadWrap>
              <UploadIconImg>
                <img src={UploadIcon} alt="runway_image" />
              </UploadIconImg>
              <div>Upload</div>
              <div>HR</div>
              <div>Image</div>
            </UploadWrap>
            <UploadWrap>
              <UploadIconImg>
                <img src={UploadIcon} alt="runway_image" />
              </UploadIconImg>
              <div>Upload</div>
              <div>LR</div>
              <div>Image</div>
            </UploadWrap>
          </Upload>
          <BottomDivider />
          <BottomWrap>
            <BtnWrap type="confirm">
              <BtnImgWrap>
                <img src={CheckIcon} alt="check"></img>
              </BtnImgWrap>
              <ConfirtTxt>Upload</ConfirtTxt>
            </BtnWrap>
          </BottomWrap>
        </DialogContent>
      </StyleDialog>
    </>
  );
}
