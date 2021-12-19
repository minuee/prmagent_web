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
      utils.customAlert("이메일을 입력해주세요.");
      return;
    } else if (inputs.auth_no.trim() === "") {
      utils.customAlert("인증번호를 입력해주세요.");
      return;
    } else if (inputs.password.trim() === "") {
      utils.customAlert("비밀번호를 입력해주세요.");
      return;
    } else if (inputs.passwordCheck.trim() === "") {
      utils.customAlert("비밀번호를 입력해주세요.");
      return;
    }else{
      /* if (confirm("비밀번호를 변경하시겠습니까?")) {
        inputs.password === inputs.passwordCheck
          ? confirmForgotPasswordFunction()
          : utils.customAlert("비밀번호를 확인해주세요.");
      } */
      alertConfirm({
        title: Constants.appName,
        content: '비밀번호를 변경하시겠습니까?',
        onOk: () => {
          inputs.password === inputs.passwordCheck ? confirmForgotPasswordFunction() : utils.customAlert("비밀번호를 확인해주세요.");
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
        // 성공처리 및 인증 메일 발송됨
        utils.customAlert("인증메일이 발송되었습니다.");
        // 패스워드 분실 2단계로 이동
      },
      (error) => {
        // 실패처리,
        utils.customAlert("인증메일 발송중 오류가 발생했습니다.");
      }
    );
  };

  const confirmForgotPasswordFunction = async () => {
    Auth.confirmForgotPasswordProcess(
      {
        // 만약 화면 이동을 하였다면 이 변수는 이전화면에서 가져와야할 필요가 있다. (라우팅 porps,redux, context등을 이용)
        email: inputs.email,
        code: inputs.auth_no,
        newPassword: inputs.password, //새로 지정할 newPassword 이다.
        authType: AuthType.EMAIL,
      },
      async () => {
        // 성공처리 및 패스워드 변경
        // 성공하면 자동으로 로그인 되니
        // 바로 메인으로 이동하면됨
        utils.customAlert("비밀번호가 정상적으로 변경되었습니다.");
        Auth.signInProcess(
          {
            authType: AuthType.EMAIL,
            email: inputs.email,
            password: inputs.password,
          },
          async (data) => {
            console.log("signInFuntion -> data", data);
            dispatch({
              type: "SIGN_IN",
              payload: inputs.email,
            });
          },
          (data) => {
            console.log("signInFuntion -> reconfirm", data);
          },
          (error) => {
            // 실패처리,
            console.log("signInFuntion -> error", error);
            if (error.code === "NotAuthorizedException") {
              utils.customAlert("아이디 또는 비밀번호를 확인해 주세요.");
            } else if (error.code === "UserNotFoundException") {
              utils.customAlert("존재하지 않는 아이디 입니다.");
            } else {
              utils.customAlert(error.message);
            }
          }
        );
      },
      (error) => {
        // 코드 잘못 입력
        utils.customAlert("비밀번호 변경중 오류가 발생했습니다.");
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
            <Title>비밀번호 변경하기</Title>
            <SubTitle>
              비밀번호를 변경하고자 하는 이메일을 입력해 주세요.
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
                text="인증코드요청"
                handleClick={forgotPasswordFunction}
              />
            </InputWrap>
            <InputWrap>
              <TextField
                variant="outlined"
                placeholder="인증코드 6자리 숫자 입력"
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
                placeholder="새 비밀번호"
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
                placeholder="새 비밀번호 확인"
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
              <NextBtn onClick={handlePasswordChange}>변경</NextBtn>
            </BtnWrap>
          </LoginBox>
        </MainBox>
      </MainContainer>
    </>
  );
}
