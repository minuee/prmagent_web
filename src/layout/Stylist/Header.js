import React, { useRef, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import isImageUrl from "is-image-url";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as FavoritesOffIcon } from "assets/favorite_black.svg";
import { ReactComponent as FavoritesOnIcon } from "assets/favorite_blue.svg";
import { darken } from "polished";
import AlarmOffIcon from "assets/alarm_black.svg";
import AlarmOnIcon from "assets/alarm_blue.svg";
import SearchBox from "components/MainSearchBox";
import Progress from "components/common/progress";
import { apiObject } from "api/api_stylist";
import {
  Auth,
  CurrentAuthUiState,
  AuthType,
  UserState,
} from "@psyrenpark/auth";
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

const HeaderContainer = styled.div`
  height: 150px;
  @media (min-width: 1920px) {
    width: 1560px;   
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: 1030px; 
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 680px;
  }   
  background: #ffffff;
  position: fixed;
  display: flex;
  align-items: center;
  margin-left: 320px;
  z-index: 20;
  justify-content: space-between;
`;

const SearchWrap = styled.div`
  margin-left: 50px;
`;

const RightMenuWrap = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const FavoriteWrap = styled.div`
  width: 30px;
  margin-right: 20px;
  cursor: pointer;
  position: relative;
`;
const AlarmWrap = styled.div`
  width: 30px;
  margin-right: 20px;
  cursor: pointer;
  position: relative;
`;

const UserAvatar = styled.div`
  width: 235px;
  height: 72px;background-color: #ffffff;display: flex;cursor: pointer;
  align-items: center;
  justify-content: center;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const UserSettingWrap = styled.div`
  font-size: 18px;
  font-weight: bold;
  display: flex;
`;

const CompanyWrap = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #999999;
`;

const AlarmOnWrap = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #ff5000;
  position: absolute;
  top: 0px;
  right: 0px;
  border: 3px solid #ffffff;
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

export default function Header() {
  const history = useHistory();
  let location = useLocation();
  const searchRef = useRef("");
  const reducer = useSelector((state) => state.reducer);
  const dispatch = useDispatch();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const [view, setView] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const handleUserSetting = () => {
    history.push("/stylist/my_account");
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSubmit = () => {
    if (searchRef.current.value.length < 2) {
      alert("검색은 2글자 이상만 가능합니다.");
    } else {
      history.push(`/stylist/search/${searchRef.current.value.toString()}`, {
        keyword: searchRef.current.value.toString(),
      });
    }
  };

  const handleAlarm = () => {
    history.push("/stylist/alarm");
  };
  const handleFavorites = () => {
    history.push("/stylist/favorites");
  };

  // My info
  const myInfo = useQuery(
    ["stylist-myinfo"],
    async () => await apiObject.getMyInfo()
  );

  const data = useMemo(() => (myInfo.isLoading ? [] : myInfo.data));

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
      Auth.signOutProcess(
        {
          authType: AuthType.EMAIL,
        },
        async (data) => {
          // 성공처리

          dispatch({
            type: "SIGN_OUT",
          });
        },
        (error) => {
          // 실패처리,
          alert(error.message);
        }
      );
    }else{
      history.push("/stylist/my_account");
    }
  };

  if (myInfo.isLoading) {
    return <Progress path="load" />;
  }

  const profile_img = isImageUrl(data.img_full_path)
    ? data.img_full_path
    : null;

  return (
    <>
      <HeaderContainer active={isdrawer}>
        <SearchWrap>
          <SearchBox
            inputRef={searchRef}
            handleEnterPress={handleEnterPress}
            handleSubmit={handleSubmit}
          />
        </SearchWrap>
        <RightMenuWrap>
          <FavoriteWrap onClick={handleFavorites}>
            {location.pathname.startsWith("/stylist/favorites") ? (
              <FavoritesOnIcon />
            ) : (
              <FavoritesOffIcon />
            )}
          </FavoriteWrap>
          <AlarmWrap onClick={handleAlarm}>
            <img
              src={
                location.pathname.startsWith("/stylist/alarm")
                  ? AlarmOnIcon
                  : AlarmOffIcon
              }
              alt="alarm"
            />
            {data.unread_notifications && (
              <>
                <AlarmOnWrap />
              </>
            )}
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
              <UserSettingWrap>
                {data.style_list_user_nm} {data.user_position}
              </UserSettingWrap>
              <CompanyWrap>{data.mgzn_nm}</CompanyWrap>
            </UserWrap>
          </UserAvatar>
        </RightMenuWrap>
      </HeaderContainer>
    </>
  );
}
