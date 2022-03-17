import React, { useState, useCallback } from "react";
import styled, { css } from "styled-components";
import { lighten } from "polished";
import { useHistory, useLocation } from "react-router-dom";

const MiniSidebarNavigation = ({ menuList }) => {
  const [openState, setOpenState] = useState(
    menuList.map((d, idx) => (idx = false))
  );

  let location = useLocation();

  const history = useHistory();

  const handleMenuClick = useCallback(
    (idx, target) => {
      const newOpenState = [...openState];
      newOpenState[idx] = !newOpenState[idx];
      setOpenState(newOpenState);
      history.push(target.link);
    },
    [openState]
  );

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
              src={location.pathname.startsWith(item.link) ? item.icon_on : item.icon_off }
              alt={item.displayValue}
            />
          </ImgWrap>
        </MenuButton>
      </MenuWrap>
    </React.Fragment>
  ));
};

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
  width: 40px;
  height: 40px;
  border-radius: 5px;
  
  
  /* 색상 */
  background-color: #7ea1b2;
  color: #ffffff;

  ${(props) =>
    props.selected
      ? css`
          background: #fff;
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
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 5px;
`;

const TextWrap = styled.div`
  padding-bottom: 3px;
`;

export default React.memo(MiniSidebarNavigation);
