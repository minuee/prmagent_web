import React, { useState, useMemo } from "react";
import styled, { css } from "styled-components";
import { useQuery } from "react-query";
import isImageUrl from "is-image-url";
import { apiObject } from "api/api_common";
import LoginImg from "assets/unnamed.png";
import Shutter from "assets/shutterstock.png";
import Logo from "assets/new_logo.png";
import TextComponent from "components/TextComponent";
import JoinTab from "components/JoinTab";
import MobileJoinTab from "components/MobileJoinTab";
import BrandJoin from "components/MobileBrandJoin";
import MagazineJoin from "components/MobileMagazineJoin";
import StylistJoin from "components/MobileStylistJoin";
import Progress from "components/common/progress";
import { Divider } from "@material-ui/core";
import utils from "utils";
const { innerWidth: width, innerHeight: height } = window;
const MainContainer = styled.div`
    display: flex;justify-content: center;align-items: center;
    width: 100%;
    background-color:white;
`;

const MainBox = styled.div`
    display: flex;width: 100%;
`;

const LoginBox = styled.div`
    display: flex;align-items: center;justify-content: center;width: 100%;flex-direction: column;
`;

const JoinDiv = styled.div`
    width: 90%;height:40px;margin-top:15px;margin-bottom: 15px;
`;

const SelectDiv = styled.div`
    width: 90%;margin-bottom: 5px;height:50px
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
        <MainContainer>
            <MainBox>
                <LoginBox>
                    <JoinDiv>
                        <TextComponent fontSize="20px" fontWeight="bold" text="회원가입" />
                    </JoinDiv>
                    <SelectDiv>
                        <MobileJoinTab nowTab={nowTab} setNowTab={setNowTab} />                            
                        <Divider style={{ marginTop: "5px" }} />
                    </SelectDiv>
                    {
                        nowTab === 1 ?
                        <MagazineJoin tos={TOS} privacy={PRIVACY} marketing={MARKETING} />
                        :
                        nowTab === 2 ?
                        <StylistJoin tos={TOS} privacy={PRIVACY} marketing={MARKETING} />
                        :
                        <BrandJoin tos={TOS} privacy={PRIVACY} marketing={MARKETING} />
                    }                   
                </LoginBox>
            </MainBox>
        </MainContainer>
    );
}
