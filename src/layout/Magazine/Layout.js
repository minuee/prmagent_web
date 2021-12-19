import React from "react";
import styled from "styled-components";
import SideBar from "./SideBar";
import Header from "./Header";

import HideOff from "assets/hide_button_off.svg";
import HideOn from "assets/hide_button_on.svg";
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";


const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    background: #ffffff;
    
`;

const ContentsContainer = styled.div`
  width:100%;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1920px" : "1560")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {        
    min-width: ${(props) => (props.active ? "1440px" : "1080px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {    
    min-width: ${(props) => (props.active ? "1024px" : "660px")};
  }  
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
    height: calc(100vh - 150px);
    padding: 0 30px 80px 30px;
    overflow: auto;
    width:100%;    
    @media (min-width: 1920px) {      
      min-width: ${(props) => (props.active ? "1920px" : "1560px")};
    }
    @media (min-width: 1440px) and (max-width: 1919px) {                
      min-width: ${(props) => (props.active ? "1440px" : "1080px")};
    }
    @media (min-width: 10px) and (max-width: 1439px) {      
      min-width: ${(props) => (props.active ? "1024px" : "680px")};
    }
`;

const MainWrap = styled.div`
    width:100%;    
    @media (min-width: 1920px) {
      min-width: "1920px";                
    }
    @media (min-width: 1440px) and (max-width: 1919px) {          
      min-width: ${(props) => (props.active ? "1300px" : "900px")};
    }
    @media (min-width: 10px) and (max-width: 1439px) {
      min-width: ${(props) => (props.active ? "964px" : "620px")};
    }
`;

const HideBtn = styled.div`
    width: 32px;
    height: 82px;
    background-color: #7ea1b2;
    position: absolute;
    display: flex;
    align-items: center;
    padding-left: 7px;
    top: 50px;
    left: ${(props) => (props.active ? "50px" : "320px")};
    z-index: 999;
    border-top-right-radius: 18px;
    border-bottom-right-radius: 18px;
    cursor: pointer;
    box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.12);
`;


export default function Layout({ hasRightMargin = true,children }) {

  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);

  return (
    <>
      <Container>
        <SideBar open={isdrawer}/>
        <HideBtn active={isdrawer} onClick={() => setIsDrawer(!isdrawer)}>
            <img src={isdrawer ? HideOn : HideOff} alt="" />
        </HideBtn>
        <ContentsContainer active={isdrawer}>
          <Header open={isdrawer} />
          <Main active={isdrawer} hasRightMargin={hasRightMargin}>              
            <MainWrap active={isdrawer}>
              {children}
            </MainWrap>
          </Main>
        </ContentsContainer>
      </Container>
    </>
  );
}
