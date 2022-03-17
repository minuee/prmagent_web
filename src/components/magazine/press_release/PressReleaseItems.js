import React, { useState,useCallback, useRef } from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { darken } from "polished";

import PressIcon03 from "assets/press_icon_03.png";
import PressIcon04 from "assets/press_icon_04.png";
import LikeOn from "assets/heart_icon_on.svg";
import LikeOff from "assets/heart_icon_off.svg";
import useOutsideClick from "components/UseOutsideClick";
import utils from "utils";
const Container = styled.div`
  position: relative;
`;

const ItemCardWrap = styled.div`
  width: 280px;
  height: 448px;
  background-color: #f1f2ea;
  border-radius: 10px;
  padding: 20px;
  margin-left: 17px;
  margin-bottom: 34px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
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

const PressIconWrap = styled.div``;

const PressDetailWrap = styled.div`
  display: flex;
  align-itesm: center;
  cursor: pointer;
`;

const PressIcon = styled.div`
  width: ${(props) => (props.active ? "32px" : "97px")};
  height: 32px;
  border-radius: 100px;
  background-color: #000000;
  position: absolute;
  top: 30px;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.active ? "center" : "space-between")};
  padding: ${(props) => (props.active ? "0" : "0 20px")};
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  .MuiSvgIcon-root {
    font-size: 28px;
  }

  &:hover {
    background-color: #908cc1;
  }
`;

const LikeIconWrap = styled.div`
  position: absolute;
  bottom: 12px;
  right: 20px;
  bottom: 45px;
  cursor: pointer;
`;

export default function PressReleaseItems({ data, handleLikeClick }) {
  const history = useHistory();
  const ref = useRef();
  const [open, setOpen] = useState(false);

  useOutsideClick(ref, () => {
    setOpen(false);
  });

  const handleDetail = (press_no) => {
    history.push("/magazine/press_release/detail/" + press_no);
  };


  const handleFileDownload = () => {
    if ( !utils.isEmpty(data.word_file_full_adres)) {
      let chk = data.word_file_full_adres.split(".").pop().toLowerCase();
      if (chk === "pdf") {
        utils.downloadURI(data.word_file_full_adres, "application/pdf");
      } else if (chk === "doc" || chk === "docx") {
        utils.downloadURI(data.word_file_full_adres, "application/msword");
      } else {
        utils.customAlert("등록된 파일이 pdf/doc 파일이 아닙니다.");
        return false;
      }
    }else{
      utils.customAlert("등록된 파일이 없습니다.");
      return false;
    }
  };

  
  return (
    <>
      <Container>
        <ItemCardWrap >
          <ImgWrap onClick={() => handleDetail(data.brand_press_no)}>
            <Img imgUrl={data.img_url_adres} />
          </ImgWrap>
          <ItemName>{data.title}</ItemName>
          {/* <PressIconWrap>
            <PressIcon
              active={!open}
              onMouseOver={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              {!open ? (
                <MoreVertIcon />
              ) : (
                <>
                  <PressDetailWrap onClick={()=>handleFileDownload()}>
                    <img src={PressIcon03} alt="download" />
                  </PressDetailWrap>
                  <PressDetailWrap
                    onClick={() => handleDetail(data.brand_press_no)}
                  >
                    <img src={PressIcon04} alt="detail" />
                  </PressDetailWrap>
                </>
              )}
            </PressIcon>
          </PressIconWrap> */}
        </ItemCardWrap>
        <LikeIconWrap
          onClick={() => handleLikeClick(data.brand_press_no, data.dibs_yn)}
        >
          <img src={data.dibs_yn ? LikeOn : LikeOff} alt="like" />
        </LikeIconWrap>
      </Container>
    </>
  );
}
