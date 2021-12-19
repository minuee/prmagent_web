import React, { useState } from "react";
import styled, { css } from "styled-components";
import { lighten, darken } from "polished";
import BestIcon from "assets/best_icon.png";
import NewIcon from "assets/new_icon.png";
import MainIcon from "assets/main_icon.png";
import HideIcon from "assets/icon_hide.png";
import ImgCheckIcon from "assets/img_check_icon.png";

function DigitalShowroomItems({
  data,
  season,
  select,
  selectData,
  handleClick,
  handleSelectData,
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
              <ItemName>{data.showroom_nm}</ItemName>
              <EditDiv
                visible={mouseOver}
                onMouseOver={() => setEditOver(true)}
                onMouseLeave={() => setEditOver(false)}
              >
                Edit
              </EditDiv>
              <IconOuterWrap>
                {data.is_hot && (
                  <IconWrap>
                    <img src={BestIcon} alt="best" style={{width:'35px'}} />
                  </IconWrap>
                )}
                {data.is_new && (
                  <IconWrap>
                    <img src={NewIcon} alt="new" style={{width:'35px'}} />
                  </IconWrap>
                )}
                {data.mfrc_sample_yn && (
                  <IconWrap>
                    <img src={MainIcon} alt="new" style={{width:'35px'}}  />
                  </IconWrap>
                )}
              </IconOuterWrap>
              {data.show_yn === 'N' && (
              <HideOuterWrap>
                  <IconWrap>
                    <img src={HideIcon} alt="best" style={{width:'25px'}} />
                  </IconWrap>
              </HideOuterWrap>
              )}
            </ItemCardWrap>
          </Container>
        ) : (
          <Container>
            <ItemCardWrap select={select}>
              <ImgWrap>
                <Img imgUrl={data.image_url} />
              </ImgWrap>
              <ItemName>{data.showroom_nm}</ItemName>
              <IconOuterWrap>
                {data.is_hot && (
                  <IconWrap>
                    <img src={BestIcon} alt="best" style={{width:'35px'}} />
                  </IconWrap>
                )}
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

const Container = styled.div`
  position: relative;
`;

const ItemCardWrap = styled.div`
  width: 250px;
  height: 400px;
  background-color: #f1f2ea;
  border-radius: 10px;
  padding: 15px;
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

const HideOuterWrap = styled.div`
  & :nth-child(1){
    margin-top:165px;
    margin-left:5px;    
  }
`;

const IconOuterWrap = styled.div`
  & :nth-child(1){
    margin-left:10px
  }
  & :nth-child(2){
    margin-left:45px
  }
  & :nth-child(3){
    margin-left:80px
  }
`;
const ImgWrap = styled.div`
  display: flex;
  width: 220px;
  height: 330px;
  justify-content: center;
  overflow: hidden;
  align-items: center;
`;

const Img = styled.div`
  width: 220px;
  height: 330px;
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
        `}
`;

const ItemName = styled.div`
  width: 220px;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  margin-top: 19px;
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
  top: 28px;
  right: 20px;

  visibility: ${(props) => (props.visible ? "visible" : "hidden")};

  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
    color: #ffffff;
  }
`;

const IconWrap = styled.div`
  position: absolute;
  top: 25px;
  left: 5px;
  z-index: 3;
`;

const SelectWrap = styled.div`
  width: 210px;
  height: 315px;
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

export default React.memo(DigitalShowroomItems);
