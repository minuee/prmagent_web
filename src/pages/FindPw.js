import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import styled, { css } from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import { darken } from "polished";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Auth, CurrentAuthUiState, AuthType } from "@psyrenpark/auth";

import BaseButton from "components/BaseButton";
import Shutter from "assets/shutterstock.png";
import Logo from "assets/logo.svg";
import { useQuery } from "react-query";
import isImageUrl from "is-image-url";
import { apiObject } from "api/api_common";
import Progress from "components/common/progress";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';

const useStyles = makeStyles(() => ({
  textField: {
    width: "90%",
  },
  textField2: {
    width: "90vw",
  },
  textField3: {
    width: "100%",
  },
  textField4: {
    width: "100%",
  },
  inputText: {
    height: 0,
    width: "200px",
    fontSize: "14px",
  },
  root: {
    borderRadius: "inherit",
  },
  root2: {
    borderRadius: "inherit",
    backgroundColor: "#f3f3f3",
  },
}));

const MainContainer = styled.div`
  height: 100vh;display: flex;position: relative;
`;

const MainBox = styled.div`
  display: flex;      
  @media (min-width: 1920px) {
      width: 100vw;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {  
      width: 1440px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
      width: 1024x;
  }
`;

const ImgBox = styled.div`
  position: relative;
  @media (min-width: 1920px) {
      width: 640px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {  
      width: 640px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 424px;
  }
`;

const LoginImage = styled.img`
  @media (min-width: 1920px) {
    width: 640px;height: 1080px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {  
    width: 640px;height: 1080px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 424px;height: 1080px;
  }
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}") no-repeat center;
          background-size: cover;
        `
      : css``}
`;

const LogoImg = styled.img`
  position: absolute;left: 125px;top: 60px;
`;

const ShutterImg = styled.img`
  position: absolute;left: 0;
  @media (min-width: 1920px) {
    max-width: 640px;height: 1080px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {  
    width: 640px;height: 1080px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 424px;height: 1080px;
  }
`;

const LoginBox = styled.div`
  display: flex;align-items: flex-start;justify-content: center;padding-left:100px;flex-direction: column;    
  @media (min-width: 1920px) {
      width: 1280px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {  
      width: 800px;        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
      width: 600px;
  } 
`;

const Title = styled.div`
  font-size: 28px;font-weight: bold;margin-bottom: 32px;
`;

const SubTitle = styled.div`
  font-size: 16px;font-weight: 500;margin-bottom: 20px;
`;

const InputWrap = styled.div`
  margin-bottom: 20px;display: flex;align-items: center;justify-content: space-between;
`;

const BtnWrap = styled.div`
  margin-top: 40px;display: flex;justify-content: flex-end;
`;

const NextBtn = styled.div`
  display: flex;align-items: center;justify-content: center;width: 400px;height: 60px;background-color: #7ea1b2;color: #ffffff;font-size: 20px;font-weight: 500;cursor: pointer;
  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
  }
  &:active {
    background-color: ${darken(0.2, "#7ea1b2")};
  }
`;

export default function FindPw() {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
    email: "",
    auth_no: "",
    password: "",
    passwordCheck: "",
  });

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = () => {
    if (inputs.email.trim() === "") {
      utils.customAlert("???????????? ??????????????????.");
      return;
    } else if (inputs.auth_no.trim() === "") {
      utils.customAlert("??????????????? ??????????????????.");
      return;
    } else if (inputs.password.trim() === "") {
      utils.customAlert("??????????????? ??????????????????.");
      return;
    } else if (inputs.passwordCheck.trim() === "") {
      utils.customAlert("??????????????? ??????????????????.");
      return;
    }else{
      /* if (confirm("??????????????? ?????????????????????????")) {
        inputs.password === inputs.passwordCheck
          ? confirmForgotPasswordFunction()
          : utils.customAlert("??????????????? ??????????????????.");
      } */
      alertConfirm({
        title: Constants.appName,
        content: '??????????????? ?????????????????????????',
        onOk: () => {
          inputs.password === inputs.passwordCheck ? confirmForgotPasswordFunction() : utils.customAlert("??????????????? ??????????????????.");
        },
        onCancel: () => {console.log('cancel')}
      });
    }
  };

  const loginImgQuery = useQuery(
    ["login-img"],
    async () => await apiObject.getLoginImg()
  );

  const forgotPasswordFunction = async () => {
    Auth.forgotPasswordProcess(
      {
        email: inputs.email,
        authType: AuthType.EMAIL,
      },
      async (data) => {
        // ???????????? ??? ?????? ?????? ?????????
        utils.customAlert("??????????????? ?????????????????????.");
        // ???????????? ?????? 2????????? ??????
      },
      (error) => {
        // ????????????,
        utils.customAlert("???????????? ????????? ????????? ??????????????????.");
      }
    );
  };

  const confirmForgotPasswordFunction = async () => {
    Auth.confirmForgotPasswordProcess(
      {
        // ?????? ?????? ????????? ???????????? ??? ????????? ?????????????????? ??????????????? ????????? ??????. (????????? porps,redux, context?????? ??????)
        email: inputs.email,
        code: inputs.auth_no,
        newPassword: inputs.password, //?????? ????????? newPassword ??????.
        authType: AuthType.EMAIL,
      },
      async () => {
        // ???????????? ??? ???????????? ??????
        // ???????????? ???????????? ????????? ??????
        // ?????? ???????????? ???????????????
        utils.customAlert("??????????????? ??????????????? ?????????????????????.");
        Auth.signInProcess(
          {
            authType: AuthType.EMAIL,
            email: inputs.email,
            password: inputs.password,
          },
          async (data) => {
            dispatch({
              type: "SIGN_IN",
              payload: inputs.email,
            });
          },
          (data) => {
          },
          (error) => {
            // ????????????,
            if (error.code === "NotAuthorizedException") {
              utils.customAlert("????????? ?????? ??????????????? ????????? ?????????.");
            } else if (error.code === "UserNotFoundException") {
              utils.customAlert("???????????? ?????? ????????? ?????????.");
            } else {
              utils.customAlert(error.message);
            }
          }
        );
      },
      (error) => {
        // ?????? ?????? ??????
        utils.customAlert("???????????? ????????? ????????? ??????????????????.");
      }
    );
  };

  const loginImg = loginImgQuery.isLoading
    ? []
    : isImageUrl(loginImgQuery.data.full_adres)
    ? loginImgQuery.data.full_adres
    : null;

  if (loginImgQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <MainContainer>
        <MainBox>
          <ImgBox>
            <LoginImage src={loginImg} />
            <ShutterImg src={Shutter} alt="shutter" />
            {/* <LogoImg src={Logo} alt="logo" /> */}
          </ImgBox>
          <LoginBox>
            <Title>???????????? ????????????</Title>
            <SubTitle>
              ??????????????? ??????????????? ?????? ???????????? ????????? ?????????.
            </SubTitle>
            <InputWrap>
              <TextField
                variant="outlined"
                placeholder="E-MAIL"
                name="email"
                value={inputs.email}
                onChange={handleChange}
                className={classes.textField4}
                InputProps={{
                  classes: { input: classes.inputText, root: classes.root },
                }}
              />
              <BaseButton
                width="110px"
                height="37px"
                type="filled"
                color="#7ea1b2"
                textColor="#ffffff"
                text="??????????????????"
                handleClick={forgotPasswordFunction}
              />
            </InputWrap>
            <InputWrap>
              <TextField
                variant="outlined"
                placeholder="???????????? 6?????? ?????? ??????"
                className={classes.textField}
                name="auth_no"
                value={inputs.auth_no}
                onChange={handleChange}
                InputProps={{
                  classes: {
                    input: classes.inputText,
                    root: classes.root2,
                  },
                }}
                // onKeyPress={handleEnterPress}
              />
            </InputWrap>
            <InputWrap>
              <TextField
                variant="outlined"
                placeholder="??? ????????????"
                type="password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
                className={classes.textField}
                InputProps={{
                  classes: { input: classes.inputText, root: classes.root },
                }}
              />
            </InputWrap>
            <InputWrap>
              <TextField
                variant="outlined"
                placeholder="??? ???????????? ??????"
                type="password"
                name="passwordCheck"
                value={inputs.passwordCheck}
                onChange={handleChange}
                className={classes.textField}
                InputProps={{
                  classes: { input: classes.inputText, root: classes.root },
                }}
              />
            </InputWrap>
            <BtnWrap>
              <NextBtn onClick={handlePasswordChange}>??????</NextBtn>
            </BtnWrap>
          </LoginBox>
        </MainBox>
      </MainContainer>
    </>
  );
}
