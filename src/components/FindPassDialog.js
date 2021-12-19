import React, { useState } from "react";
import {
  DialogTitle,
  DialogContent,
  Dialog,
  TextField,
} from "@material-ui/core";
import styled, { css } from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import BaseButton from "../components/BaseButton";
import TextComponent from "../components/TextComponent";

const useStyles = makeStyles((theme) => ({
  dialog: {
    margin: "20px",
  },
  dialogTitle: {
    margin: "40px 20px 24px 20px",
    textAlign: "center",
  },
  closeIcon: {
    fontSize: "24px",
  },
  dialogContent: {
    padding: "8px 70px 70px 70px",
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
  idTextField: {
    width: "340px",
  },
  newPassField: {
    width: "540px",
    height: 0,
  },
}));

const CloseIconBox = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const SubTitleDiv = styled.div`
  margin-bottom: 20px;
  ${(props) =>
    props.flex &&
    css`
      display: flex;
    `}
`;

const InputTitle = styled.div`
  margin-bottom: 10px;
`;

const ReqBtnBox = styled.div`
  margin-left: 8px;
`;

const NumInputBox = styled.div`
  margin-bottom: 10px;
  margin-left: 100px;
`;

const SearchIdBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 540px;
  height: 80px;
  border: 1px solid #dddddd;
  padding: 0 50px;
  font-size: 16px;
  margin-bottom: 24px;
`;

export default function FindPassDialog({ open, setOpen }) {
  const classes = useStyles();
  const [nextPage, setNextPage] = useState(0);
  const handleClose = () => {
    setOpen(!open);
    setNextPage(0);
  };

  const handleNextBtn = () => {
    // 인증번호 체크 후 이동
    setNextPage(nextPage + 1);
  };

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        maxWidth={"lg"}
        className={classes.dialog}
      >
        <DialogTitle id="simple-dialog-title" className={classes.dialogTitle}>
          <TextComponent
            width="600px"
            fontSize="28px"
            fontWeight="900"
            text={nextPage < 2 ? "비밀번호 찾기" : "비밀번호 재설정"}
          />
          <CloseIconBox>
            <CloseIcon className={classes.closeIcon} onClick={handleClose} />
          </CloseIconBox>
        </DialogTitle>
        {nextPage === 0 && (
          <DialogContent className={classes.dialogContent}>
            <SubTitleDiv>
              <TextComponent
                fontSize="16px"
                fontWeight="500"
                text="비밀번호를 찾고자 하는 아이디를 입력해 주세요."
              />
            </SubTitleDiv>
            <SearchIdBox>
              <TextField
                variant="outlined"
                placeholder="아이디"
                className={classes.idTextField}
                InputProps={{ classes: { input: classes.inputText } }}
              />
            </SearchIdBox>
            <div>
              <BaseButton
                height="60px"
                type="filled"
                color="#7ea1b2"
                fontSize="20px"
                textColor="#ffffff"
                hoverType="darken"
                text="다음"
                handleClick={handleNextBtn}
              />
            </div>
          </DialogContent>
        )}
        {nextPage === 1 && (
          <DialogContent className={classes.dialogContent}>
            <SubTitleDiv>
              <TextComponent
                fontSize="16px"
                fontWeight="500"
                text="회원정보에 등록한 휴대전화로 인증"
              />
            </SubTitleDiv>
            <SubTitleDiv flex={true}>
              <div>
                <TextComponent
                  width="100px"
                  height="37px"
                  fontSize="16px"
                  fontWeight="500"
                  lineHeight="37px"
                  text="이름"
                />
              </div>
              <InputTitle>
                <TextField
                  variant="outlined"
                  placeholder="이름"
                  className={classes.TextField}
                  InputProps={{ classes: { input: classes.inputText } }}
                />
              </InputTitle>
            </SubTitleDiv>
            <SubTitleDiv flex={true}>
              <div>
                <TextComponent
                  width="100px"
                  height="37px"
                  fontSize="16px"
                  fontWeight="500"
                  lineHeight="37px"
                  text="휴대폰번호"
                />
              </div>
              <InputTitle>
                <TextField
                  variant="outlined"
                  placeholder="휴대폰번호"
                  className={classes.TextField}
                  InputProps={{ classes: { input: classes.inputText } }}
                />
              </InputTitle>
              <ReqBtnBox>
                <BaseButton
                  width="100px"
                  height="37px"
                  color="#dddddd"
                  type="outlined"
                  hoverType="darken"
                  text="인증번호요청"
                />
              </ReqBtnBox>
            </SubTitleDiv>
            <SubTitleDiv flex={true}>
              <NumInputBox>
                <TextField
                  variant="outlined"
                  placeholder="인증번호 6자리 숫자 입력"
                  className={classes.TextField}
                  InputProps={{ classes: { input: classes.inputBgText } }}
                />
              </NumInputBox>
            </SubTitleDiv>
            <div>
              <BaseButton
                height="60px"
                type="filled"
                color="#7ea1b2"
                fontSize="20px"
                textColor="#ffffff"
                hoverType="darken"
                text="다음"
                handleClick={handleNextBtn}
              />
            </div>
          </DialogContent>
        )}
        {nextPage === 2 && (
          <DialogContent className={classes.dialogContent}>
            <SubTitleDiv>
              <TextComponent
                fontSize="16px"
                fontWeight="500"
                text="비밀번호를 변경해 주세요."
              />
            </SubTitleDiv>
            <SubTitleDiv>
              <TextField
                variant="outlined"
                placeholder="새 비밀번호"
                className={classes.newPassField}
                InputProps={{ classes: { input: classes.inputText } }}
              />
            </SubTitleDiv>
            <SubTitleDiv>
              <TextField
                variant="outlined"
                placeholder="새 비밀번호 확인"
                className={classes.newPassField}
                InputProps={{ classes: { input: classes.inputText } }}
              />
            </SubTitleDiv>
            <div
              style={{
                width: "540px",
                height: "100px",
                backgroundColor: "#f6f6f6",
                marginBottom: "20px",
              }}
            >
              CAPTCHA
            </div>
            <div>
              <BaseButton
                width="540px"
                height="60px"
                type="filled"
                color="#7ea1b2"
                fontSize="20px"
                textColor="#ffffff"
                hoverType="darken"
                text="확인"
                handleClick={handleClose}
              />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
