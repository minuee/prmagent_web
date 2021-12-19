import React, { useState } from "react";
import styled, { css } from "styled-components";
import SearchIcon from "../assets/search2.png";
import { darken } from "polished";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "../redux/state";


const SearchBox = styled.div`
  display: flex;
  float: right;
  border: none;
  @media (min-width: 1920px) {
    width: 600px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: 500px;    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "500px" : "250px")};    
  } 
  height: 52px;
  box-sizing: border-box;
  border-radius: 10px;

  ${(props) =>
    props.focus
      ? css`
          background-color: ${darken(0.1, "#f1f2ea")};
        `
      : css`
          background-color: #f1f2ea;
        `}
`;

const SearchInput = styled.input`
  width: 100%;
  border: none;
  background-color: #f1f2ea;
  border-radius: 10px;
  font-size: 16px;
  padding-left: 20px;

  :focus {
    outline: none;
    background-color: ${darken(0.1, "#f1f2ea")};
  }
`;

const SearchImgWrap = styled.div`
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default function MainSearchList({inputRef,handleEnterPress,handleSubmit}) {
  const [onFocus, setOnFocus] = useState(false);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);

  return (
    <>
      <SearchBox focus={onFocus} onKeyPress={handleEnterPress} active={isdrawer}>
        <SearchInput
          onFocus={() => setOnFocus(true)}
          onBlur={() => setOnFocus(false)}
          ref={inputRef}
          placeholder="검색어를 입력해주세요."
        />
        <SearchImgWrap onClick={handleSubmit}>
          <img src={SearchIcon} alt="search" style={{width:'30px'}}/>
        </SearchImgWrap>
      </SearchBox>
    </>
  );
}
