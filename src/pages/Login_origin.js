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
    width: "560px",
  },
  textHeight: {
    fontSize: "16px",
    height: "23px",
  },
}));

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;  
  ${(props) =>
    props.shutter !== null
      ? css`
          background: url("${(props) => props.shutter}");
          background-size: 1024px 1024px;
          background-position: left;
          background-repeat: repeat;
        `
      : css``}
`;

const MainBox = styled.div`
  display: flex;  
  height: 100%;
  width:100%;
  align-items: center;
  justify-content: flex-end;   
  @media (min-width: 1920px) {
    min-width: 1920px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {  
    min-width: 1440px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: 1024x;
  }
`;

const ImgBox = styled.div`
  position: relative;
  @media (min-width: 1920px) {
    width: 640px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {  
    width: 440px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 0px;
  }
  
`;

const LoginImage = styled.img`  
  @media (min-width: 1920px) {
    width: 640px;
    height: 1080px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {  
    width: 440px;
    height: 1080px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 0;
    height: 0px;
  }
  
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}");
          background-size: cover;
        `
      : css``}
`;

const ShutterImg = styled.img`
  position: absolute;
  left: 0;
  @media (min-width: 1920px) {
    max-width: 640px;
    height: 1080px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {  
    max-width: 440px;    
    height: 1080px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 0;
  }
`;

const LoginBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;  
  flex-direction: column;
  background-color:white;
  height:100%;
  @media (min-width: 1920px) {
    width: 1280px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {  
    width: 1000px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 1024px;
  }
`;

const LoginDiv = styled.div`
  width: 560px;
  margin-bottom: 20px;
  text-align: center;
`;

const MG_BOT_20 = styled.div`
  margin-bottom: 20px;
`;

const MG_BOT_40 = styled.div`
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
  width: 560px;
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
  display: flex;
  width: 560px;
  justify-content: space-between;
  margin-bottom: 60px;
`;

const BotDiv2 = styled.div`
  display: flex;
  width: 560px;
  justify-content: space-between;
`;

const Copyright = styled(Typography)`
  color: #9b9b9b;
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
  width: 560px;
  margin-bottom: 60px;
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
      utils.customAlert("???????????? ??????????????????.");
    }else if (login.pass.trim() == '' ) {
      utils.customAlert("??????????????? ??????????????????.");
    }else{
      Auth.signInProcess(
        {
          authType: AuthType.EMAIL,
          email: login.id.trim(),
          password: login.pass.trim(),
        },
        async (data) => {
          // ????????????
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
          // ????????????,
          if (error.code === "NotAuthorizedException") {
            utils.customAlert("????????? ?????? ??????????????? ????????? ?????????.");
          } else if (error.code === "UserNotFoundException") {
            utils.customAlert("???????????? ?????? ????????? ?????????.");
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
      <MainContainer shutter={loginImg}>
        <MainBox>
          {/* <ImgBox>
            <LoginImage src={loginImg} />
            <ShutterImg src={Shutter} alt="shut ter" />            
          </ImgBox> */}
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
            <BotDiv>
              <div>
                <Copyright>
                  Copyright(C) PR Magnet, All rights reserved.
                </Copyright>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ForgatPassword onClick={() => history.push("/find-id")}>
                  ???????????????
                </ForgatPassword>
                <div
                  style={{
                    width: "3px",
                    height: "16px",
                    backgroundColor: "#7ea1b2",
                    margin: "0 11px",
                  }}
                />
                <ForgatPassword onClick={() => history.push("/find-pw")}>
                  ???????????? ??????
                </ForgatPassword>
              </div>
            </BotDiv>
            <Divide />
            <BotDiv2>
              <HelpBox 
                onClick={()=>linkurl('https://prmagnetkr.wixsite.com/website')}>
                <QuestionIcon>?</QuestionIcon>
                <HelpTxt>PR Magnet ???????????? ???????????????????</HelpTxt>
              </HelpBox>
              <div>
                <JoinText onClick={handleJoinPage}>???????????? ??????</JoinText>
              </div>
            </BotDiv2>
          </LoginBox>
        </MainBox>
      </MainContainer>
    </>
  );
}
