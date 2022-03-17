import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { darken, lighten } from "polished";

import ConfirmIcon from "assets/check_icon_w.svg";
import CloseIcon from "@material-ui/icons/Close";
import ImgCheckIcon from "assets/img_check_icon.png";
import CheckIcon from "assets/scheduler/CheckIcon.svg";

const IMAGE_URL = "https://fpr-prod-file.s3-ap-northeast-2.amazonaws.com/";
import utils from "utils";
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
export default function SelectFeaturedImageDialog({
  open,
  setOpen,
  data,
  editYn = false,
  handleConfirm,
}) {
  const [selectImg, setSelectImg] = useState(null);
  const [imgList, setImageList] = useState([]);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);

  const onMaskClick = (e) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  const handleUpload = () => {
    if (selectImg === null) {
      utils.customAlert("대표이미지를 선택해주세요!");
    } else {      
      setOpen(false);
      handleConfirm(selectImg);
    }
  };

  useEffect(() => {
    let newArr = [];
    data.map((d) =>
      d.sample_image_list.map((item) => {
        item.url !== "" && newArr.push(item.url);
      })
    );
    setImageList(newArr);
    if (editYn && selectImg === null) {
      data.map((d) =>
        d.sample_image_list.find(
          (v) => v.showroom_main_yn && setSelectImg(v.url)
        )
      );
    }
  }, [data, open]);

  return (
    <>
      <ModalOverlay open={open} />
      <ModalWrapper
        open={open}
        tabIndex="-1"
        onClick={open ? onMaskClick : null}
      >
        <ModalInner tabIndex="0" active={isdrawer}>
          <Header>
            <StyledCloseIcon onClick={() => setOpen(false)} />
          </Header>
          <Content>
            <Title>대표 이미지 선택</Title>
            <ImagesWrap>
              {imgList.length > 0 &&
                imgList.map((item, i) => (
                  <React.Fragment key={`${item}_${i}`}>
                    <Images
                      imgUrl={item}
                      lastYn={(i + 1) % 5 === 0 ? true : false}
                    >
                      <ImgCoverWrap
                        onClick={() => setSelectImg(item)}
                        active={item === selectImg}
                      />
                      {item === selectImg && (
                        <ImgCheckIconWrap>
                          <img src={ImgCheckIcon} alt="check" />
                        </ImgCheckIconWrap>
                      )}
                    </Images>
                    {(i + 1) % 5 === 0 && <br />}
                  </React.Fragment>
                ))}
            </ImagesWrap>
            <BtnGroup>
              <ConfirmBtn onClick={handleUpload}>
                <img src={ConfirmIcon} alt="confirm" />
                Upload
              </ConfirmBtn>
            </BtnGroup>
          </Content>
        </ModalInner>
      </ModalWrapper>
    </>
  );
}

const ModalWrapper = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.open ? "block" : "none")};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
`;

const ModalOverlay = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.open ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: transparent;
  z-index: 999;
`;
/*width: 1040px;
  min-width: 1040px;
  */
const ModalInner = styled.div`
  box-sizing: border-box;
  position: relative;
  box-shadow: 5px 5px 25px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  border-radius: 20px;
  @media (min-width: 1920px) {
    width: ${(props) => (props.active ? "1040px" : "1040px")};     
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: ${(props) => (props.active ? "1040px" : "1040px")};      
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "920px" : "920px")};
  } 
  height: auto;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;

  :focus {
    outline: none;
  }
`;

const Content = styled.div`
  display: flex;
  padding: 0 80px 30px 80px;
  flex-direction: column;
`;
const StyledCloseIcon = styled(CloseIcon)`
  font-size: 24px;
  color: #000000;
  cursor: pointer;
`;

const Header = styled.div`
  width: 100%;
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
`;

const ConfirmBtn = styled.div`
  width: 160px;
  height: 42px;
  border-radius: 5px;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);
  background-color: #7ea1b2;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  > img {
    margin-right: 10px;
  }

  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
  }
  &:active {
    background-color: ${darken(0.2, "#7ea1b2")};
  }
`;

const BtnGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #000000;
  padding-bottom: 16px;
  border-bottom: solid 2px #dddddd;
`;

const ImagesWrap = styled.div`
  display: flex;
  padding: 40px 0;
  flex-wrap: wrap;
  width: 100%;
  height: 520px;
  overflow: auto;
  border-bottom: solid 2px #dddddd;
  margin-bottom: 30px;
`;

const Images = styled.div`
  background-color: #dddddd;
  width: 160px;
  height: 226px;
  margin-bottom: 20px;
  border: solid 1px #dddddd;
  position: relative;
  margin-right: ${(props) => (props.lastYn ? 0 : "15px")};
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => IMAGE_URL + props.imgUrl}") no-repeat
            center;
          background-size: contain;
          background-color: #e7e7e7;
        `
      : css`
          background-color: #dddddd;
        `}
`;

const ImgCoverWrap = styled.div`
  width: 158px;
  height: 224px;
  position: absolute;
  background-color: ${(props) => (props.active ? "#7ea1b2" : "#000000")};
  opacity: ${(props) => (props.active ? "0.75" : "0.2")};
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.active ? darken(0.1, "#7ea1b2") : lighten(0.5, "#000000")};
  }

  ${(props) =>
    props.hoverChk &&
    css`
      background-color: ${(props) =>
        props.active ? darken(0.1, "#7ea1b2") : lighten(0.5, "#000000")};
    `}
`;

const ImgCheckIconWrap = styled.div`
  cursor: pointer;
  position: absolute;
  top: 85px;
  left: 55px;
`;
