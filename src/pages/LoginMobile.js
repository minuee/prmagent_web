import React, { useState,useEffect } from "react";
import styled, { css } from "styled-components";
import { lighten } from "polished";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  TextField,
  InputAdornment,
  Button,
  Divider,
} from "@material-ui/core";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useDispatch, useSelector } from "react-redux";
import { Auth, AuthType } from "@psyrenpark/auth";
import { useQuery } from "react-query";
import isImageUrl from "is-image-url";

import Shutter from "assets/shutterstock.png";
import Logo from "assets/logo.svg";
import { apiObject } from "api/api_common";
import Progress from "components/common/progress";
import utils from "utils";
const useStyles = makeStyles(() => ({
  textField: {
    width: "90%",
  },
  textHeight: {
    fontSize: "16px",
    height: "23px",
  },
}));

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;  
  align-items: center;
  justify-content: center;    
`;


const LoginBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;  
  flex-direction: column;
  background-color:white;
  height:100%;
  width:100%;
  margin-top: 50px;
`;

const LoginDiv = styled.div`
  width: 90%;
  margin-top: 150px;
  margin-bottom: 20px;
  text-align: center;
`;

const MG_BOT_20 = styled.div`
  width:100%;
  display: flex;
  align-items: center;
  justify-content: center;  
  margin-bottom: 20px;
`;

const MG_BOT_40 = styled.div`
  width:100%;
  display: flex;
  align-items: center;
  justify-content: center;  
  margin-bottom: 40px;
`;

const LoginTxt = styled(Typography)`
  font-size: 32px;
  font-weight: bold;
`;

const IconBox = styled(InputAdornment)`
  padding: 0 5px;
`;

const UserIcon = styled(PersonOutlineOutlinedIcon)`
  font-size: 30px;
  color: #9b9b9b;
`;

const PassIcon = styled(LockOutlinedIcon)`
  font-size: 30px;
  color: #9b9b9b;
`;

const LoginBtn = styled(Button)`
  width: 90%;
  height: 60px;
  line-height: 56px;
  font-size: 16px;
  font-weight: bold;
  background-color: #000000;
  color: #ffffff;
  &:hover {
    background-color: ${lighten(0.3, "#000000")};
  }
`;

const BotDiv = styled.div`  
  width: 100%;  
  display: flex;
  align-items: center;
  justify-content: center;  
  margin-bottom: 60px;
`;

const BotDiv2 = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;  
`;

const Copyright = styled(Typography)`
  color: #9b9b9b;
  margin-bottom: 60px;
`;

const ForgatPassword = styled(Typography)`
  color: #7ea1b2;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    font-weight: bold;
    text-decoration: underline;
  }
`;

const Divide = styled(Divider)`
  width: 95%;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const HelpBox = styled.div`
  display: flex;
  alignitems: center;
  cursor: pointer;
`;

const HelpTxt = styled(Typography)`
  line-height: 1.8;
  color: #7ea1b2;
  text-decoration: underline;
`;

const QuestionIcon = styled.div`
  width: 22px;
  height: 22px;
  background-color: #000000;
  border-radius: 50%;
  text-align: center;
  font-size: 12px;
  color: #ffffff;
  font-weight: bold;
  line-height: 25px;
  margin-right: 5px;
`;

const JoinText = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #7ea1b2;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    font-weight: 900;
  }
`;

export default function Login() {
  const classes = useStyles();
  const history = useHistory();

  const [login, setLogin] = useState({
    id: "",
    pass: "",
  });
  const reducer = useSelector((state) => state.reducer);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const handleJoinPage = () => {
    history.push("/join");
  };

  const handleLogin = () => {
    if ( login.id.trim() == '') {
      utils.customAlert("아이디를 입력해주세요.");
    }else if (login.pass.trim() == '' ) {
      utils.customAlert("비밀번호를 입력해주세요.");
    }else{
      Auth.signInProcess(
        {
          authType: AuthType.EMAIL,
          email: login.id.trim(),
          password: login.pass.trim(),
        },
        async (data) => {
          // 성공처리
          await history.push('/');
          localStorage.setItem("SET_MY_USER", JSON.stringify(data.username));
          dispatch({
            type: "SIGN_IN",
            payload: login.id,
          });
          dispatch({
            type: "SET_MY_USER",
            payload: data,
          });
        },
        (data) => {
        },
        (error) => {
          // 실패처리,
          if (error.code === "NotAuthorizedException") {
            utils.customAlert("아이디 또는 비밀번호를 확인해 주세요.");
          } else if (error.code === "UserNotFoundException") {
            utils.customAlert("존재하지 않는 아이디 입니다.");
          } else {
            utils.customAlert(error.message);
          }
        },
        () => {}
      );
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const linkurl = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const loginImgQuery = useQuery(
    ["login-img"],
    async () => await apiObject.getLoginImg()
  );

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
          <LoginBox>
            <LoginDiv>
              <img src={Logo} alt="logl" />
            </LoginDiv>
            <MG_BOT_20>
              <TextField
                className={classes.textField}
                InputProps={{
                  startAdornment: (
                    <IconBox position="start">
                      <UserIcon />
                    </IconBox>
                  ),
                  classes: { input: classes.textHeight },
                }}
                variant="outlined"
                name="id"
                value={login.id}
                onChange={handleChange}
                placeholder="ID"
              />
            </MG_BOT_20>
            <MG_BOT_40>
              <TextField
                className={classes.textField}
                InputProps={{
                  startAdornment: (
                    <IconBox position="start">
                      <PassIcon />
                    </IconBox>
                  ),
                  classes: { input: classes.textHeight },
                }}
                variant="outlined"
                type="password"
                name="pass"
                value={login.pass}
                onChange={handleChange}
                placeholder="PASSWORD"
                onKeyPress={handleEnterPress}
              />
            </MG_BOT_40>
            <MG_BOT_40>
              <LoginBtn variant="contained" onClick={handleLogin}>
                LOGIN
              </LoginBtn>
            </MG_BOT_40>
            
            <BotDiv2>
              <div style={{ display: "flex", alignItems: "center" }}>
                <JoinText onClick={handleJoinPage}>회원가입</JoinText>
                <div style={{width: "3px",height: "16px",backgroundColor: "#7ea1b2",margin: "0 11px",}}/>
                <ForgatPassword onClick={() => history.push("/find-id")}>
                  ID찾기
                </ForgatPassword>
                <div style={{width: "3px",height: "16px",backgroundColor: "#7ea1b2",margin: "0 11px",}}/>
                <ForgatPassword onClick={() => history.push("/find-pw")}>
                  PW찾기
                </ForgatPassword>
              </div>
            </BotDiv2>
            <Divide />
            <BotDiv>
              <HelpBox onClick={()=>linkurl('https://prmagnetkr.wixsite.com/website')}>
                <QuestionIcon>?</QuestionIcon>
                <HelpTxt>PR Magnet 페이지가 처음이신가요?</HelpTxt>
              </HelpBox>
            </BotDiv>
            <BotDiv>
              <Copyright>
                Copyright(C) PR Magnet, All rights reserved.
              </Copyright>
            </BotDiv>
            <BotDiv></BotDiv>
          </LoginBox>        
      </MainContainer>
    </>
  );
}
