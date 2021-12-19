import React, { useState } from "react";
import styled, { css } from "styled-components";
import { lighten } from "polished";
import { useHistory, useLocation } from "react-router-dom";

const MenuWrap = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuButton = styled.div`
  /* 공통 스타일 */
  display: flex;
  flex-direction: row;
  font-weight: bold;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
  cursor: pointer;
  :focus {
    outline: none;
  }

  /* 크기 */
  width: 280px;
  height: 60px;
  border-radius: 14px;
  font-size: 18px;
  line-height: 18px;
  transition: all 0.3s;

  /* 색상 */
  background-color: #7ea1b2;
  color: #ffffff;

  ${(props) =>
    props.selected
      ? css`
          background: #ffffff;
          color: #000000;
        `
      : css`
          &:hover {
            background: ${lighten(0.1, "#7ea1b2")};
          }
          &:active {
            background: ${lighten(0.2, "#7ea1b2")};
          }
        `}
`;

const ImgWrap = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 5px;
`;

const TextWrap = styled.div`
  padding-bottom: 3px;
`;

const SidebarNavigation = ({ menuList }) => {
  const [openState, setOpenState] = useState(
    menuList.map((d, idx) => (idx = false))
  );

  let location = useLocation();

  const history = useHistory();

  const handleMenuClick = (idx, target) => {
    const newOpenState = [...openState];
    newOpenState[idx] = !newOpenState[idx];
    setOpenState(newOpenState);
    history.push(target.link);
  };

  return menuList.map((item, idx) => (
    <React.Fragment key={item.link}>
      <MenuWrap>
        <MenuButton
          onClick={() => handleMenuClick(idx, item)}
          to={item.link}
          selected={location.pathname.startsWith(item.link)}
        >
          <ImgWrap>
            <img
              src={
                location.pathname.startsWith(item.link)
                  ? item.icon_on
                  : item.icon_off
              }
              alt={item.displayValue}
            />
          </ImgWrap>
          <TextWrap>{item.displayValue}</TextWrap>
        </MenuButton>
      </MenuWrap>
    </React.Fragment>
  ));
};

export default SidebarNavigation;
