import React, { useState } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";

import BestIcon from "assets/best_icon.png";
import NewIcon from "assets/new_icon.png";
import MainIcon from "assets/main_icon.png";
import CloseIcon from "@material-ui/icons/Close";
import utils from "utils";

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

  ${(props) =>
    !props.select &&
    css`
      cursor: pointer;
      &:hover {
        background-color: ${darken(0.1, "#f1f2ea")};
      }
    `}
`;

const IconOuterWrap = styled.div`
  & :nth-child(1){
    margin-left:10px
  }
  & :nth-child(2){
    margin-left:50px
  }
  & :nth-child(3){
    margin-left:90px
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
  border: solid 1px #ddddd;
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}") no-repeat center;
          background-size: contain;
          background-color: #e7e7e7;
        `
      : css`
          background-color: #dddddd;
        `}
`;

const ItemName = styled.div`
  width: 240px;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  margin-top: 19px;
`;

const EditDiv = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 60px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  position: absolute;
  top: 10px;
  right: 10px;

  visibility: ${(props) => (props.visible ? "visible" : "hidden")};

  &:hover {
    background-color: #000000;
    color: #ffffff;
  }

  > svg {
    font-size: 20px;
  }
`;

const IconWrap = styled.div`
  position: absolute;
  top: 30px;
  left: 1px;
  z-index: 3;
`;

export default function CreateLookBookItems({
  data,
  selectData,
  handleDeleteItem,
}) {
  const [mouseOver, setMouseOver] = useState(false);

  const handleClick = () => {
    if (selectData.length === 1) {
      utils.customAlert("최소 1개 이상의 룩을 등록해야합니다.");
      return;
    } else {
      handleDeleteItem(data);
    }
  };

  return (
    <>
      <Container>
        <ItemCardWrap
          onMouseOver={() => setMouseOver(true)}
          onMouseLeave={() => setMouseOver(false)}
          onClick={handleClick}
        >
          <ImgWrap>
            {/* {data.images.map(
                (h) =>
                  h.main_yn === true && (
                    <Img key={h.img_url} src={h.img_url} alt={data.item_nm} />
                  )
              )} */}
            <Img imgUrl={data.image_url} />
          </ImgWrap>
          <ItemName>{data.showroom_nm}</ItemName>
          <EditDiv
            // visible={true}
            visible={mouseOver}
          >
            <CloseIcon />
          </EditDiv>
          <IconOuterWrap>
            {/* {data.is_hot && (
              <IconWrap>
                <img src={BestIcon} alt="best" style={{width:'35px'}}/>
              </IconWrap>
            )} */}
            {data.is_new && (
              <IconWrap>
                <img src={NewIcon} alt="new" style={{width:'35px'}}/>
              </IconWrap>
            )}
            {data.mfrc_sample_yn && (
              <IconWrap>
                <img src={MainIcon} alt="new" style={{width:'35px'}} />
              </IconWrap>
            )}
          </IconOuterWrap>
        </ItemCardWrap>
      </Container>
    </>
  );
}
