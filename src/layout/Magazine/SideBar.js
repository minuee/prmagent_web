import React from "react";
import styled from "styled-components";
import SideLogo from "../../assets/logo_m.svg";
import SidebarNavigation from "./SidebarNavigation";
import MiniSidebarNavigation from "./MiniSidebarNavigation";
import { SidebarList } from "./SidebarNavigationConst";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Auth,
  CurrentAuthUiState,
  AuthType,
  UserState,
} from "@psyrenpark/auth";
import utils from "utils";

/* const SideContainer = styled.div`
  position: fixed;
  display: block;
  overflow-y: auto;
  flex-direction: column;
  min-width: 320px;
  background: #7ea1b2;
  border-top-right-radius: 35px;
  border-bottom-right-radius: 35px;
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.16);
  z-index: 20;
  height: 100vh;
  ::-webkit-scrollbar {
    display: none;
  }
`; */


const HideSideContainer = styled.div`
  min-width: 50px;
  height: 100vh;
  display: flex;
  transition: all 0.3s;  
  overflow-y: auto;
  flex-direction: column;
  background: #7ea1b2;
`;
const SideContainer = styled.div`
  min-width: ${(props) => (props.active ? 0 : "320px")};
  height: 100vh;
  display: ${(props) => (props.active ? "none" : "flex")};
  transition: all 0.3s;
  visibility: ${(props) => (props.active ? "hidden" : "visible")};
  overflow-y: auto;
  flex-direction: column;
  background: #7ea1b2;
  border-top-right-radius: 35px;
  border-bottom-right-radius: 35px;
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.16);
  ::-webkit-scrollbar {
    display: none;
  }
`;

const MainLogo = styled.div`
  background: #7ea1b2;
  width: 100%;
  height: 225px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const MainLogoImg = styled.img`
  max-height: 120px;
`;

const BottomMenuWrap = styled.div`
  margin: 20px 0 80px 40px;
  display: flex;
  flex-direction: column;
`;

const MenuTxt = styled.div`
  width: 80px;
  font-size: 16px;
  font-weight: 500;
  opacity: 0.5;
  color: #ffffff;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  & + & {
    margin-top: 14px;
  }
`;

export default function SideBar({ open }) {
  const history = useHistory();
  const reducer = useSelector((state) => state.reducer);
  const dispatch = useDispatch();

  const handleQuestion = () => {
    history.push("/magazine/question");
  };

  const handleSignOut = async () => {
    Auth.signOutProcess(
      {
        authType: AuthType.EMAIL,
      },
      async (data) => {
        // ????????????
        dispatch({
          type: "SIGN_OUT",
        });
      },
      (error) => {
        // ????????????,
        utils.customAlert(error.message);
      }
    );
  };

  const gotoNoticePage = () => {
    history.push("/magazine/notice");
  };

  if ( open ) {
    return (
      <HideSideContainer active={open}>          
        <div>
          <MiniSidebarNavigation menuList={SidebarList} />           
        </div>
      </HideSideContainer>
    );
  }else{
    return (
      <>
        <SideContainer>
          <MainLogo onClick={() => history.push("/magazine/home")}>
            <MainLogoImg src={SideLogo} alt="" />
          </MainLogo>
          <div>
            <SidebarNavigation menuList={SidebarList} />
            <BottomMenuWrap>
              <MenuTxt onClick={gotoNoticePage}>Notice</MenuTxt>
              {/* <MenuTxt onClick={handleSignOut}>Sign out</MenuTxt> */}
              <MenuTxt onClick={handleQuestion}>Help</MenuTxt>
            </BottomMenuWrap>
          </div>
        </SideContainer>
      </>
    );
  }
}
