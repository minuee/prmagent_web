import React, { useState, useMemo } from "react";
import styled, { css } from "styled-components";
import { useQuery } from "react-query";
import isImageUrl from "is-image-url";
import {BrowserView,MobileView,isBrowser,isMobile} from "react-device-detect";

import { apiObject } from "api/api_common";
import LoginImg from "assets/unnamed.png";
import Shutter from "assets/shutterstock.png";
import Logo from "assets/new_logo.png";
import TextComponent from "components/TextComponent";
import JoinTab from "components/JoinTab";
import BrandJoin from "components/BrandJoin";
import MagazineJoin from "components/MagazineJoin";
import StylistJoin from "components/StylistJoin";
import Progress from "components/common/progress";
import utils from "utils";

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
        background: url("${(props) => props.imgUrl}") no-repeat center;
        background-size: contain;
        `
        : css`
        background: url(/images/unnamed.png) no-repeat center;
        background-size: contain;
        `}
    `;

const ShutterImg = styled.img`
    position: absolute;left: 0;
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

const LogoImg = styled.img`
    position: absolute;left: 125px;top: 60px;
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
    width: 1280px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 1024px;
  }
`;
const JoinDiv = styled.div`
    width: 800px;margin-bottom: 35px;margin-top: 30px;
`;

export default function Join() {
    const [nowTab, setNowTab] = useState(0);

    // 이용약관 조회
    const tosContents = useQuery(
        ["tos-contents"],
        async () => await apiObject.getTos(() => {})
    );
    const TOS = useMemo(() =>
        tosContents.isLoading ? [] : tosContents.data.tos
    );

    // 개인정보 수집이용동의
    const privacyContents = useQuery(
        ["privacy-contents"],
        async () => await apiObject.getPrivacyPolicy(() => {})
    );
    const PRIVACY = useMemo(() =>
        privacyContents.isLoading ? [] : privacyContents.data.privacy_policy
    );

    // 마케팅 정보 수신 동의
    const MARKETING = "<p>마케팅 정보 수신</p>";
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

    let logoHieght = utils.getImageSize("h", loginImg);

    return (
        <>
            <MainContainer shutter={loginImg}>
                <MainBox>
                    {/* <ImgBox>
                        <LoginImage src={loginImg} alt="Login" />
                        <ShutterImg src={Shutter} alt="shutter" />
                    </ImgBox> */}
                    <LoginBox>
                        <JoinDiv>
                            <TextComponent fontSize="32px" fontWeight="bold" text="회원가입" />
                        </JoinDiv>
                        <JoinTab nowTab={nowTab} setNowTab={setNowTab} />
                            {
                                nowTab === 0 && (
                                <BrandJoin tos={TOS} privacy={PRIVACY} marketing={MARKETING} />
                                )
                            }
                            {
                                nowTab === 1 && (
                                    <MagazineJoin tos={TOS} privacy={PRIVACY} marketing={MARKETING} />
                                )
                            }
                            {       
                                nowTab === 2 && (
                                    <StylistJoin tos={TOS} privacy={PRIVACY} marketing={MARKETING} />
                                )
                            }
                    </LoginBox>
                </MainBox>
            </MainContainer>
        </>
    );
}
