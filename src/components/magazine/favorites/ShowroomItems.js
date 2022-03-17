import React, { useCallback } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { useHistory } from "react-router-dom";
import LikeOn from "assets/heart_icon_on.svg";

function FavShowroomItems({ data, handleLikeClick }) {
  const history = useHistory();

  const handleDetail = useCallback((no) => {
    history.push(`/magazine/digital_showroom/detail/${no}`);
  });

  return (
    <>
      <Container>
        <ItemCardWrap onClick={() => handleDetail(data.showroom_no)}>
          <ImgWrap>
            <Img imgUrl={data.img_url_adres} />
          </ImgWrap>
          <ItemName>({data.brand_nm}){data.showroom_nm}</ItemName>
        </ItemCardWrap>
        <LikeIconWrap onClick={() => handleLikeClick(data.showroom_no)}>
          <img src={LikeOn} alt="like" />
        </LikeIconWrap>
      </Container>
    </>
  );
}

const Container = styled.div`
  position: relative;
`;

const ItemCardWrap = styled.div`
  width: 280px;
  height: 438px;
  background-color: #f1f2ea;
  border-radius: 10px;
  padding: 20px;
  margin-left: 17px;
  margin-bottom: 34px;
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: ${darken(0.1, "#f1f2ea")};
  }
`;

const ImgWrap = styled.div`
  display: flex;
  width: 240px;
  height: 360px;
  justify-content: center;
  overflow: hidden;
  align-items: center;
`;

const Img = styled.div`
  width: 240px;
  height: 360px;
  border: solid 1px #dddddd;
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}") no-repeat center;
          background-size: contain;
          background-color: #e7e7e7;
        `
      : css`
          background-color: #dddddd;
        `}}
`;

const ItemName = styled.div`
  width: 210px;  
  font-weight: 500;
  font-size: 14px;
  margin-top: 15px;
  overflow:hidden;
`;

const LikeIconWrap = styled.div`
  position: absolute;
  bottom: 12px;
  right: 20px;
  bottom: 45px;
  cursor: pointer;
`;

export default React.memo(FavShowroomItems);
