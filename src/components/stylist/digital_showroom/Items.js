import React, { useState } from "react";
import styled, { css } from "styled-components";
import { lighten, darken } from "polished";
import BestIcon from "assets/best_icon.png";
import NewIcon from "assets/new_icon.png";
import MainIcon from "assets/main_icon.png";
import ImgCheckIcon from "assets/img_check_icon.png";
import LikeOn from "assets/heart_icon_on.svg";
import LikeOff from "assets/heart_icon_off.svg";
import utils from "utils";
const Container = styled.div`
  position: relative;
`;

const ItemCardWrap = styled.div`
  width: 280px;
  height: 438px;
  background-color: #eef4f8;
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
        background-color: ${darken(0.1, "#eef4f8")};
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
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}") no-repeat center;
          background-size: cover;
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
  margin-top: ${(props) => (props.addTopPadding ==='대여중' ? "10px" : "20px")};
`;
const ItemAddName = styled.div`
  width: 240px;
  text-align: center;
  font-weight: 500;
  font-size: 13px;
  color : #ff0000;
  margin-top: 2px;
`;



const EditDiv = styled.div`
  width: 48px;
  height: 24px;
  border-radius: 60px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  position: absolute;
  top: 35px;
  right: 30px;

  visibility: ${(props) => (props.visible ? "visible" : "hidden")};

  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
    color: #ffffff;
  }
`;

const IconWrap = styled.div`
  position: absolute;
  top: 30px;
  left: 1px;
  z-index: 3;
`;

const SelectWrap = styled.div`
  width: 240px;
  height: 360px;
  background-color: #000000;
  opacity: 0.4;
  position: absolute;
  top: 20px;
  left: 37px;
  cursor: pointer;

  ${(props) =>
    props.active
      ? css`
          background-color: #7ea1b2;
          opacity: 0.8;
        `
      : css`
          &:hover {
            background-color: ${lighten(0.5, "#000000")};
          }
        `}
  ${(props) =>
    props.chkIcon &&
    !props.active &&
    css`
      background-color: ${lighten(0.5, "#000000")};
    `}
`;

const CheckIcon = styled.div`
  position: absolute;
  top: 180px;
  left: 132px;
  cursor: pointer;
`;

const LikeIcon = styled.div`
  position: absolute;
  bottom: 55px;
  right: 20px;

  cursor: pointer;
`;

export default function DigitalShowroomItems({
  data,
  season,
  select,
  selectData,
  handleClick,
  handleSelectData,
  handleFavShowroom,
}) {
  const [mouseOver, setMouseOver] = useState(false);
  const [editOver, setEditOver] = useState(false);
  const [checkOver, setCheckOver] = useState(false);

  return (
    <>
      {(season.value === data.season || season.value === 0) &&
        (!select ? (
          <Container>
            <ItemCardWrap
              onMouseOver={() => setMouseOver(true)}
              onMouseLeave={() => setMouseOver(false)}
              onClick={() =>
                handleClick(mouseOver, editOver, `${data.showroom_no}`)
              }
            >
              <ImgWrap>
                <Img imgUrl={data.image_url} />
              </ImgWrap>
              <ItemName /* addTopPadding={data.now_req_status_nm} */>{data.showroom_nm}</ItemName>
             {/*  { 
                data.now_req_status_nm === '대여중' &&
                <ItemAddName>
                  ({data.now_req_status_nm} {utils.dateToDate(data.duty_recpt_dt)} ~ {utils.dateToDate(data.return_prearnge_dt)})
                </ItemAddName>    
              } */}
              <IconOuterWrap>
                {/* {data.is_hot && (
                  <IconWrap>
                    <img src={BestIcon} alt="best" style={{width:'35px'}} />
                  </IconWrap>
                )} */}
                {data.is_new && (
                  <IconWrap>
                    <img src={NewIcon} alt="new" style={{width:'35px'}} />
                  </IconWrap>
                )}
                {data.mfrc_sample_yn && (
                  <IconWrap>
                    <img src={MainIcon} alt="new" style={{width:'35px'}} />
                  </IconWrap>
                )}
              </IconOuterWrap>
            </ItemCardWrap>
            <LikeIcon
              onClick={() => handleFavShowroom(data.is_fav ? "del" : "add", data.showroom_no)}
              addTopPadding={data.now_req_status_nm}
            >
              <img src={data.is_fav ? LikeOn : LikeOff} alt="like" />
            </LikeIcon>
          </Container>
        ) : (
          <Container>
            <ItemCardWrap select={select}>
              <ImgWrap>
                <Img imgUrl={data.image_url} />
              </ImgWrap>
              <ItemName>{data.showroom_nm}</ItemName>
              <IconOuterWrap>
                {/* {data.is_hot && (
                  <IconWrap>
                    <img src={BestIcon} alt="best" style={{width:'35px'}} />
                  </IconWrap>
                )} */}
                {data.is_new && (
                  <IconWrap>
                    <img src={NewIcon} alt="new" style={{width:'35px'}} />
                  </IconWrap>
                )}
                {data.mfrc_sample_yn && (
                  <IconWrap>
                    <img src={MainIcon} alt="new" style={{width:'35px'}} />
                  </IconWrap>
                )}
              </IconOuterWrap>
            </ItemCardWrap>
            <SelectWrap
              active={
                selectData.some(
                  (selectData) => selectData.showroom_no === data.showroom_no
                )
                  ? true
                  : false
              }
              chkIcon={checkOver}
              onClick={() => handleSelectData(data)}
            />
            <CheckIcon
              onMouseOver={() => setCheckOver(true)}
              onMouseLeave={() => setCheckOver(false)}
              onClick={() => handleSelectData(data)}
            >
              <img src={ImgCheckIcon} alt="check" />
            </CheckIcon>
          </Container>
        ))}
    </>
  );
}
