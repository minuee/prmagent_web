import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import { Divider } from "@material-ui/core";
import { darken, lighten } from "polished";
import { useMutation } from "react-query";

import UploadIcon from "assets/upload_icon.png";
import CheckIcon from "assets/check_icon.png";
import ImgCheckIcon from "assets/img_check_icon.png";
import CheckBoxOn from "assets/checkbox_on.png";
import CheckBoxOff from "assets/checkbox_off.png";
import DelBtnImg from "assets/press_img_del_btn.svg";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
import utils from "utils";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

const Container = styled.div`
  
  @media (min-width: 1920px) {
    width: ${(props) => (props.isdrawer ? "595px" : "595px")};    
    left: 160px; 
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: ${(props) => (props.isdrawer ? "595px" : "595px")};      
    left: 160px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.isdrawer ? "595px" : "580px")};
    left: ${(props) => (props.isdrawer ? "100px" : "30px")};
  } 
  height: 546px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 5px 5px 25px 0 rgba(0, 0, 0, 0.16);
  position: absolute;
  z-index: 2;
  top: -2px;
  padding: 40px 40px 30px 42px;
`;

const CloseIconBox = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const StyledCloseIcon = styled(CloseIcon)`
  font-size: 24px;
  color: #000000;
`;

const ContentsWrap = styled.div``;

const Title = styled.div`
  font-size: 28px;
  font-weight: 900;
  color: #cccccc;
`;

const StyleDivider = styled(Divider)`
  height: 2px;
  background-color: #dddddd;
  margin: 16px 0;
`;

const BottomDivider = styled(Divider)`
  height: 2px;
  background-color: #dddddd;
  margin: 20px 0 30px 0;
`;

const SelectTxt = styled.div`
  font-size: 16px;
  color: #7ea1b2;
  text-align: right;
  margin-bottom: 16px;
`;

const Upload = styled.div`
  display: flex;
  justify-content: space-between;
`;

const UploadWrap = styled.div`
  width: 151px;
  height: 227px;
  border: ${(props) => (props.imgYn ? "none" : "2px solid #dddddd")};
  background-color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  color: #999999;
  position: relative;

  img {
    max-width: 152px;
    max-height: 228px;
  }

  input {
    display: none;
  }

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    width: 151px;
    height: 227px;
  }
`;

const UploadIconImg = styled.div`
  margin-bottom: 10px;
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const BtnWrap = styled.div`
  width: 160px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.type === "cancel" ? "#ffffff" : "#7ea1b2"};
  border: ${(props) =>
    props.type === "cancel" ? "solid 1px #dddddd" : "none"};
  border-radius: 5px;
  transition: all 0.3s;

  ${(props) =>
    props.type === "cancel" &&
    css`
      &:hover {
        background-color: ${darken(0.1, "#ffffff")};
      }
      &:active {
        background-color: ${darken(0.2, "#ffffff")};
      }
    `}

  ${(props) =>
    props.type === "confirm" &&
    css`
      &:hover {
        background-color: ${darken(0.1, "#7ea1b2")};
      }
      &:active {
        background-color: ${darken(0.2, "#7ea1b2")};
      }
    `} 

  & + & {
    margin-left: 10px;
  }
`;

const BtnImgWrap = styled.div`
  margin-right: 10px;
  display: flex;
`;

const ConfirmTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
`;

const ImgCheckIconWrap = styled.div`
  cursor: pointer;
  position: absolute;
  top: 85px;
  left: 55px;
`;

const ImgCoverWrap = styled.div`
  width: 152px;
  height: 228px;
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

const ImgCategoryWrap = styled.div`
  display: flex;
  margin-top: 20px;
`;

const ImgCategoryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  > img {
    max-width: 20px;
    margin-right: 5px;
  }

  & + & {
    margin-left: 40px;
  }
`;

const Img = styled.div`
  width: 152px;
  height: 228px;
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

const DelBtnDiv = styled.div`
  position: absolute;
  right: 0;
  z-index: 10;
  cursor: pointer;
`;

export default function UploadDialog_v2({
  open,
  setOpen,
  editYn = false,
  duplicateChk = null,
  inputs,
  stillImgYn,
  sampleImgYn,
  handleUpload,
  handleImgCategory,
}) {
  const [runwayImg, setRunwayImg] = useState({
    url: "",
    uploadYn: false,
    preview: "",
    img_type: "RUNWAY",
    file: null,
    main_yn: false,
    showroom_main_yn: false,
  });
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const [hrImg, setHrImg] = useState({
    url: "",
    uploadYn: false,
    preview: "",
    img_type: "HR",
    file: null,
    main_yn: false,
    showroom_main_yn: false,
  });

  const [lrImg, setLrImg] = useState({
    url: "",
    uploadYn: false,
    preview: "",
    img_type: "LR",
    file: null,
    main_yn: false,
    showroom_main_yn: false,
  });

  const [imgMouseOver, setImgMouseOver] = useState({
    runway: false,
    hr: false,
    lr: false,
  });

  useEffect(() => {
    if (editYn) {
      inputs.map((v) =>
        v.img_type === "RUNWAY"
          ? setRunwayImg({
              url: v.url,
              uploadYn: false,
              full_url: v.full_url,
              img_type: v.img_type,
              file: null,
              main_yn: v.main_yn,
              showroom_main_yn: false,
            })
          : v.img_type === "HR"
          ? setHrImg({
              url: v.url,
              uploadYn: false,
              full_url: v.full_url,
              img_type: v.img_type,
              file: null,
              main_yn: v.main_yn,
              showroom_main_yn: false,
            })
          : v.img_type === "LR"
          ? setLrImg({
              url: v.url,
              uploadYn: false,
              full_url: v.full_url,
              img_type: v.img_type,
              file: null,
              main_yn: v.main_yn,
              showroom_main_yn: false,
            })
          : ""
      );
      // setRunwayImg(inputs[0]);
      // setHrImg(inputs[1]);
      // setLrImg(inputs[2]);
    }
    if (duplicateChk !== null) {
      duplicateChk.sample_image_list.map((v) =>
        v.img_type === "RUNWAY"
          ? setRunwayImg(v)
          : v.img_type === "HR"
          ? setHrImg(v)
          : v.img_type === "LR"
          ? setLrImg(v)
          : ""
      );
    }
  }, [inputs]);

  const handleClose = () => {
    setOpen(!open);
    // setRunwayImg(inputs[0]);
    // setHrImg(inputs[1]);
    // setLrImg(inputs[2]);
  };

  const handleImgUpload = ({ target }) => {
    const name = target.accept.includes("image/png, image/jpg")
      ? "images"
      : "noImage";
    let img = new Image();
    img.src = URL.createObjectURL(target.files[0]);
    img.onload = function () {
      if (name === "images") {
        if (target.name === "runway") {
          setRunwayImg({
            ...runwayImg,
            preview: URL.createObjectURL(target.files[0]),
            file: target.files[0],
            img_type: "RUNWAY",
            uploadYn: true,
          });
          target.value = "";
        } else if (target.name === "hr") {
          setHrImg({
            ...hrImg,
            preview: URL.createObjectURL(target.files[0]),
            file: target.files[0],
            img_type: "HR",
            uploadYn: true,
          });
        } else if (target.name === "lr") {
          setLrImg({
            ...lrImg,
            preview: URL.createObjectURL(target.files[0]),
            file: target.files[0],
            img_type: "LR",
            uploadYn: true,
          });
        } else {
          console.log("Input name is wrong!");
        }
      } else {
        console.log("No Image file...");
      }
    };
  };

  const handleFeaturedClick = (type) => {
    if (type === "runway") {
      setRunwayImg({
        ...runwayImg,
        main_yn: !runwayImg.main_yn,
      });
      setHrImg({
        ...hrImg,
        main_yn: false,
      });
      setLrImg({
        ...lrImg,
        main_yn: false,
      });
    } else if (type === "hr") {
      setRunwayImg({
        ...runwayImg,
        main_yn: false,
      });
      setHrImg({
        ...hrImg,
        main_yn: !hrImg.main_yn,
      });
      setLrImg({
        ...lrImg,
        main_yn: false,
      });
    } else if (type === "lr") {
      setRunwayImg({
        ...runwayImg,
        main_yn: false,
      });
      setHrImg({
        ...hrImg,
        main_yn: false,
      });
      setLrImg({
        ...lrImg,
        main_yn: !lrImg.main_yn,
      });
    } else {
      console.log("parameter is wrong!");
    }
  };

  const handleConfirm = () => {
    if (!runwayImg.main_yn && !hrImg.main_yn && !lrImg.main_yn) {
      utils.customAlert("대표이미지를 선택해 주세요.");
      return;
    } else {
      if (!stillImgYn && !sampleImgYn) {
        utils.customAlert("이미지 타입을 선택해 주세요.");
        return;
      } else {
        if (runwayImg.uploadYn) {
          uploadImage.mutate({ file: runwayImg.file, type: "runway" });
        }
        if (hrImg.uploadYn) {
          uploadImage.mutate({ file: hrImg.file, type: "hr" });
        }
        if (lrImg.uploadYn) {
          uploadImage.mutate({ file: lrImg.file, type: "lr" });
        }
        handleUpload(runwayImg, hrImg, lrImg);
        setOpen(!open);
      }
    }
  };

  const handleDeleteImg = (act) => {
    if (act === "runway") {
      setRunwayImg({
        url: "",
        preview: "",
        img_type: "RUNWAY",
        file: null,
        main_yn: false,
        showroom_main_yn: false,
      });
    } else if (act === "hr") {
      setHrImg({
        url: "",
        preview: "",
        img_type: "HR",
        file: null,
        main_yn: false,
        showroom_main_yn: false,
      });
    } else if (act === "lr") {
      setLrImg({
        url: "",
        preview: "",
        img_type: "LR",
        file: null,
        main_yn: false,
        showroom_main_yn: false,
      });
    }
  };

  const uploadImage = useMutation(
    (file) =>
      apiObject.uploadShowroomImg(
        { file: file.file, type: file.type },
        () => {}
      ),
    {
      onSuccess: (data) => {
        if (data.type === "runway") {
          runwayImg.url = data.url;
          runwayImg.uploadYn = false;
          setRunwayImg({ ...runwayImg });
        } else if (data.type === "hr") {
          hrImg.url = data.url;
          hrImg.uploadYn = false;
          setHrImg({ ...hrImg });
        } else if (data.type === "lr") {
          lrImg.url = data.url;
          lrImg.uploadYn = false;
          setLrImg({ ...lrImg });
        } else {
          console.log("wrong type");
        }
      },
      onError: () => {
        utils.customAlert("이미지 업로드중 오류가 발생했습니다.");
        return;
      },
      onSettled: () => {},
    }
  );

  if (uploadImage.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      {open && (
        <Container isdrawer={isdrawer}>
          <CloseIconBox>
            <StyledCloseIcon onClick={handleClose} />
          </CloseIconBox>
          <ContentsWrap>
            <Title>Image Upload</Title>
            <StyleDivider />
            <SelectTxt>대표 이미지 선택</SelectTxt>
            <Upload>
              <UploadWrap
                imgYn={
                  (runwayImg.preview === "" ||
                    runwayImg.preview === undefined) &&
                  runwayImg.full_url === undefined
                    ? false
                    : true
                }
              >
                {(runwayImg.preview === "" ||
                  runwayImg.preview === undefined) &&
                runwayImg.full_url === undefined ? (
                  <>
                    <input
                      accept="image/png, image/jpg"
                      id="runway-img-input"
                      name="runway"
                      type="file"
                      onChange={handleImgUpload}
                    />
                    <label htmlFor="runway-img-input">
                      <>
                        <UploadIconImg>
                          <img src={UploadIcon} alt="runway_image" />
                        </UploadIconImg>
                        <div>Upload</div>
                        <div>Runway</div>
                        <div>Image</div>
                      </>
                    </label>
                  </>
                ) : (
                  <>
                    <DelBtnDiv onClick={() => handleDeleteImg("runway")}>
                      <img src={DelBtnImg} alt="" />
                    </DelBtnDiv>
                    <ImgCoverWrap
                      onClick={() => handleFeaturedClick("runway")}
                      active={runwayImg.main_yn}
                      hoverChk={imgMouseOver.runway}
                    />
                    <Img
                      imgUrl={
                        runwayImg.preview === undefined
                          ? runwayImg.full_url
                          : runwayImg.preview
                      }
                    />
                    <ImgCheckIconWrap
                      onClick={() => handleFeaturedClick("runway")}
                      onMouseOver={() =>
                        setImgMouseOver({ ...imgMouseOver, runway: true })
                      }
                      onMouseLeave={() =>
                        setImgMouseOver({ ...imgMouseOver, runway: false })
                      }
                    >
                      <img src={ImgCheckIcon} alt="check" />
                    </ImgCheckIconWrap>
                  </>
                )}
              </UploadWrap>
              <UploadWrap
                imgYn={
                  (hrImg.preview === "" || hrImg.preview === undefined) &&
                  hrImg.full_url === undefined
                    ? false
                    : true
                }
              >
                {(hrImg.preview === "" || hrImg.preview === undefined) &&
                hrImg.full_url === undefined ? (
                  <>
                    <input
                      accept="image/png, image/jpg"
                      id="hr-img-input"
                      name="hr"
                      type="file"
                      onChange={handleImgUpload}
                    />
                    <label htmlFor="hr-img-input">
                      <>
                        <UploadIconImg>
                          <img src={UploadIcon} alt="hr_image" />
                        </UploadIconImg>
                        <div>Upload</div>
                        <div>HR</div>
                        <div>Image</div>
                      </>
                    </label>
                  </>
                ) : (
                  <>
                    <DelBtnDiv onClick={() => handleDeleteImg("hr")}>
                      <img src={DelBtnImg} alt="" />
                    </DelBtnDiv>
                    <ImgCoverWrap
                      onClick={() => handleFeaturedClick("hr")}
                      active={hrImg.main_yn}
                      hoverChk={imgMouseOver.hr}
                    />
                    <Img
                      imgUrl={
                        hrImg.preview === undefined
                          ? hrImg.full_url
                          : hrImg.preview
                      }
                    />
                    <ImgCheckIconWrap
                      onClick={() => handleFeaturedClick("hr")}
                      onMouseOver={() =>
                        setImgMouseOver({ ...imgMouseOver, hr: true })
                      }
                      onMouseLeave={() =>
                        setImgMouseOver({ ...imgMouseOver, hr: false })
                      }
                    >
                      <img src={ImgCheckIcon} alt="check" />
                    </ImgCheckIconWrap>
                  </>
                )}
              </UploadWrap>
              <UploadWrap
                imgYn={
                  (lrImg.preview === "" || lrImg.preview === undefined) &&
                  lrImg.full_url === undefined
                    ? false
                    : true
                }
              >
                {(lrImg.preview === "" || lrImg.preview === undefined) &&
                lrImg.full_url === undefined ? (
                  <>
                    <input
                      accept="image/png, image/jpg"
                      id="lr-img-input"
                      name="lr"
                      type="file"
                      onChange={handleImgUpload}
                    />
                    <label htmlFor="lr-img-input">
                      <>
                        <UploadIconImg>
                          <img src={UploadIcon} alt="lr_image" />
                        </UploadIconImg>
                        <div>Upload</div>
                        <div>LR</div>
                        <div>Image</div>
                      </>
                    </label>
                  </>
                ) : (
                  <>
                    <DelBtnDiv onClick={() => handleDeleteImg("lr")}>
                      <img src={DelBtnImg} alt="" />
                    </DelBtnDiv>
                    <ImgCoverWrap
                      onClick={() => handleFeaturedClick("lr")}
                      active={lrImg.main_yn}
                      hoverChk={imgMouseOver.lr}
                    />
                    <Img
                      imgUrl={
                        lrImg.preview === undefined
                          ? lrImg.full_url
                          : lrImg.preview
                      }
                    />
                    <ImgCheckIconWrap
                      onClick={() => handleFeaturedClick("lr")}
                      onMouseOver={() =>
                        setImgMouseOver({ ...imgMouseOver, lr: true })
                      }
                      onMouseLeave={() =>
                        setImgMouseOver({ ...imgMouseOver, lr: false })
                      }
                    >
                      <img src={ImgCheckIcon} alt="check" />
                    </ImgCheckIconWrap>
                  </>
                )}
              </UploadWrap>
            </Upload>
            <ImgCategoryWrap>
              <ImgCategoryBox onClick={() => handleImgCategory("still")}>
                <img
                  src={stillImgYn ? CheckBoxOn : CheckBoxOff}
                  alt="checkbox"
                />
                Still Life Images
              </ImgCategoryBox>
              <ImgCategoryBox onClick={() => handleImgCategory("look")}>
                <img
                  src={sampleImgYn ? CheckBoxOn : CheckBoxOff}
                  alt="checkbox"
                />
                Lookbook Images
              </ImgCategoryBox>
            </ImgCategoryWrap>
            <BottomDivider />
            <BottomWrap>
              <BtnWrap type="confirm" onClick={handleConfirm}>
                <BtnImgWrap>
                  <img src={CheckIcon} alt="check"></img>
                </BtnImgWrap>
                <ConfirmTxt>Upload</ConfirmTxt>
              </BtnWrap>
            </BottomWrap>
          </ContentsWrap>
        </Container>
      )}
    </>
  );
}
