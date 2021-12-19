import React, { useState } from "react";
import {
  DialogTitle,
  DialogContent,
  Dialog,
  TextField,
} from "@material-ui/core";
import styled, { css } from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
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
  justify-content: space-between;
  align-items: center;
  width: 540px;
  height: 80px;
  border: 1px solid #dddddd;
  padding: 0 50px;
  font-size: 16px;
  margin-bottom: 24px;
`;

const IdBox = styled.div`
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const BtnBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 540px;
`;

export default function FindIdDialog({ open, setOpen }) {
  const classes = useStyles();
  const [nextPage, setNextPage] = useState(0);
  const handleClose = () => {
    setOpen(!open);
    setNextPage(0);
  };

  const handleNextBtn = () => {
    // 인증번호 체크 후 이동
    setNextPage(1);
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
            text="아이디 찾기"
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
        {nextPage === 1 && (
          <DialogContent className={classes.dialogContent}>
            <SubTitleDiv>
              <TextComponent
                fontSize="16px"
                fontWeight="500"
                text="고객님의 정보와 일치하는 아이디 목록입니다."
              />
            </SubTitleDiv>
            <SearchIdBox>
              <IdBox>
                <div>
                  <CheckCircleOutlineIcon className={classes.checkIcon} />
                </div>
                <div>
                  <TextComponent fontSize="16px" text="wasfff662" />
                </div>
              </IdBox>
              <div>
                <TextComponent
                  fontSize="16px"
                  color="#555555"
                  text="가입:2020.05.22"
                />
              </div>
            </SearchIdBox>
            <BtnBox>
              <div>
                <BaseButton
                  width="250px"
                  height="60px"
                  type="filled"
                  fontSize="20px"
                  textColor="#ffffff"
                  color="#7ea1b2"
                  text="로그인하기"
                />
              </div>
              <div>
                <BaseButton
                  width="250px"
                  height="60px"
                  type="outlined"
                  fontSize="20px"
                  color="#999999"
                  text="비밀번호 찾기"
                />
              </div>
            </BtnBox>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
