import React, { useRef, useCallback, useState } from "react";
import styled, { css } from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import isImageUrl from "is-image-url";
import { darken } from "polished";
import AlarmOnIcon from "assets/alarm_black.svg";
import AlarmOffIcon from "assets/alarm_blue.svg";
import SearchBox from "components/MainSearchBox";
import {Auth,CurrentAuthUiState,AuthType,UserState} from "@psyrenpark/auth";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";

function Header({ data, open }) {
    const history = useHistory();
    let location = useLocation();
    const searchRef = useRef("");
    const reducer = useSelector((state) => state.reducer);
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState(null);
    const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
    const [view, setView] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);

    const handleUserSetting = useCallback(() => {
        history.push("/brand/my_account");
    });

    const handleEnterPress = useCallback((e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    });

    const handleSubmit = useCallback(() => {
        setSearchText(searchRef.current.value);
        if (searchRef.current.value.length < 2) {
            utils.customAlert("검색은 2글자 이상만 가능합니다.");
        } else {
            history.push(`/brand/search/${searchRef.current.value.toString()}`, {
                keyword: searchRef.current.value.toString(),
            });
        }
    }, [searchText]);

    const handleAlarm = useCallback(() => {
        history.push("/brand/alarm");
    });

    const profile_img = isImageUrl(data.img_full_path) ? data.img_full_path : null;

    const handleToggleClick = (view) => {
        setViewOpen(view)
        if ( view ){
            setTimeout(() => setViewOpen(false), 5000);
        }
    }
    const handleViewClick = (view) => {
        setView(view);
        setViewOpen(false);
        if ( view === 'LogOut' ) {
            Auth.signOutProcess({
                authType: AuthType.EMAIL,
            },async (data) => {
                // 성공처리
                await history.push('/login');
                let state = { ...history.location.state };
                await delete state.transaction;
                await  history.replace({ ...history.location, state });
                dispatch({type: "SIGN_OUT",});
            },
            (error) => {
                // 실패처리,
                utils.customAlert(error.message);
            }
            );
        }else{
            history.push("/brand/my_account");
        }
    };

    return (
        <>
        <HeaderContainer active={isdrawer}>
            <HeaderDataContainer 
                //</HeaderContainer>style={{display: "flex",alignItems: "center",justifyContent: "space-between",minWidth: "1000px",width: "1480px",}}
            >
                <SearchWrap>
                    <SearchBox inputRef={searchRef} handleEnterPress={handleEnterPress} handleSubmit={handleSubmit}/>
                </SearchWrap>
                <RightMenuWrap>
                    <AlarmWrap onClick={handleAlarm}>
                        <img src={ location.pathname.startsWith("/brand/alarm") ? AlarmOnIcon : AlarmOffIcon} alt="alarm" style={{maxHeight:50}} />
                        {
                            data.unread_notifications && (
                            <>
                                <AlarmOnWrap />
                            </>
                            )
                        }
                    </AlarmWrap>
                    <UserAvatar onClick={() => handleToggleClick(!viewOpen)}>
                        <Avatar imgUrl={profile_img} />
                        {viewOpen && (
                        <Popup>
                            <PopupMenus
                            active={view === "MyAccount"}
                            onClick={() => handleViewClick("MyAccount")}
                            >
                            My Account
                            </PopupMenus>
                            <PopupMenus
                            active={view === "LogOut"}
                            onClick={() => handleViewClick("LogOut")}
                            >
                            Log Out
                            </PopupMenus>
                        </Popup>
                        )}
                        <UserWrap>
                            <UserSettingWrap>{data.brand_user_nm} {data.user_position}</UserSettingWrap>
                            <CompanyWrap>{data.brand_nm}</CompanyWrap>
                        </UserWrap>
                    </UserAvatar>
                </RightMenuWrap>
            </HeaderDataContainer>
        </HeaderContainer>
        </>
    );
}

const HeaderContainer = styled.div`
    display: flex;
    height: 150px;padding: 0 60px;    
    align-items: center;
    justify-content: space-between;
    z-index: 20;    
    width:100%;
    @media (min-width: 1920px) {
        min-width: ${(props) => (props.active ? "1920px" : "1560px")};    
    }
    @media (min-width: 1440px) and (max-width: 1919px) {          
        min-width: ${(props) => (props.active ? "1250px" : "1030px")};    
    }
    @media (min-width: 10px) and (max-width: 1439px) {
        min-width: ${(props) => (props.active ? "974px" : "680px")};
    }    
`;
const HeaderDataContainer = styled.div`
    display: flex;    
    align-items: center;
    justify-content: space-between;
    width : 100%
`;
const SearchWrap = styled.div`
    
`;

const RightMenuWrap = styled.div`
    width: 275px;height: 150px;display: flex;justify-content: flex-end;align-items:center
`;

const AlarmWrap = styled.div`
    width: 40px;margin-right: 20px;cursor: pointer;position: relative;
`;

const UserAvatar = styled.div`
    width: 165px;height: 50px;background-color: #ffffff;display: flex;cursor: pointer;
`;

const Avatar = styled.div`
    width: 45px;height: 45px;border-radius: 50%;margin-right: 10px;
    ${(props) =>
    props.imgUrl !== null
    ? css`
        background: url("${(props) => props.imgUrl}") no-repeat center;
        background-size: cover;
    `
    : css`
        background: url(/images/noimage/noimg_profile.svg) no-repeat center;
        background-size: contain;
    `}
`;

const UserWrap = styled.div`
    display: flex;flex-direction: column;justify-content: center;
`;

const UserSettingWrap = styled.div`
    font-size: 18px;font-weight: bold;display: flex;
`;

const CompanyWrap = styled.div`
    font-size: 14px;font-weight: 500;color: #999999;
`;

const AlarmOnWrap = styled.div`
    width: 14px;height: 14px;border-radius: 50%;background-color: #ff5000;position: absolute;top: 0px;right: 0px;border: 3px solid #ffffff;
`;

const AlarmOn = styled.div`
    width: 10px;height: 10px;border-radius: 50%;background-color: red;position: absolute;top: 3px;right: 3px;
`;

const Popup = styled.div`
  position: absolute;
  top: 100px;
  display: flex;
  flex-direction: column;
  width: 234px;
  height: 152px;
  border: solid 1px #dddddd;
  background-color: #ffffff;
  padding: 30px 0px;
`;

const PopupMenus = styled.div`
  font-size: 20px;
  font-weight: 500;
  padding: 10px 40px;
  cursor: pointer;

  ${(props) =>
    props.active
      ? css`
          background-color: #7ea1b2;
          color: #ffffff;
          &:hover {
            background-color: ${darken(0.2, "#7ea1b2")};
          }
        `
      : css`
          background-color: #ffffff;
          color: #000000;
          &:hover {
            background-color: #dddddd;
          }
        `}
`;
export default React.memo(Header);