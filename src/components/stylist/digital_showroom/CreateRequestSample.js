import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { TextField } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import useOutsideClick from "components/UseOutsideClick";

import CheckBoxOn from "assets/checkbox_on.png";
import CheckBoxOff from "assets/checkbox_off.png";
import ImgCheckIcon from "assets/check_icon_large.svg";
import StarIcon from "assets/star_icon.svg";
import Constants from '../../../utils/constants';

const TitelWrap = styled.div`
  margin-bottom: 60px;
`;

const TitleTxt1 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: 100;
  line-height: ${Constants.titleFontSize};
  margin-bottom: 10px;
`;

const TitleTxt2 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-right: 40px;
`;

const InputContainer = styled.div``;

const BottomWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 40px 0 60px 0;
`;

const BtnWrap = styled.div`
  width: 200px;
  height: 60px;
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

const CancelTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #999999;
`;

const ConfirtTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
`;

const BrandLogo = styled.img`
  max-height: 24px;
`;

const DataWrap = styled.div`
  display: flex;
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${(props) => props.margin || "0"};
  width: ${(props) => props.width || "auto"};
`;

const ImgWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 710px;
  max-height: 458px;
`;

const DetailWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  width: 710px;
`;

const Rows = styled.div`
  display: flex;
  margin-bottom: 40px;

  ${(props) =>
    props.opt === "sbt" &&
    css`
      justify-content: space-between;
    `}
`;

const Box = styled.div`
  display: flex;
`;

const InputTitle = styled.div`
  display: flex;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const StyleTextField = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 13px 14px;
  }
  .MuiInputBase-root {
    width: 140px;
    height: 42px;
  }

  .MuiInputBase-root.Mui-disabled {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
  }

  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }

  margin-right: 20px;
`;

const StyleTextField2 = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 13px 14px;
  }
  .MuiInputBase-root {
    width: 690px;
    height: 42px;
  }

  .MuiInputBase-root.Mui-disabled {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
  }

  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }
  margin-right: 20px;
`;

const StyleTextField3 = styled(TextField)`
  .MuiOutlinedInput-multiline {
    padding: 13px 14px;
  }
  .MuiInputBase-root.Mui-disabled {
    color: #000000;
  }
  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }
  width: 690px;
`;

const StyleTextField4 = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 13px 14px;
  }
  .MuiInputBase-root {
    width: 515px;
    height: 42px;
  }

  .MuiInputBase-root.Mui-disabled {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
  }

  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }
`;

const ModelWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const CheckBoxWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const CheckBoxImg = styled.img`
  max-width: 20px;
  margin-right: 12px;
`;

const StyleCheckIcon = styled(CheckIcon)`
  font-size: 16px;
  margin-right: 12px;
`;

const Btn = styled.div`
  width: 335px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: solid 1px #dddddd;
  font-size: 16px;
  color: #999999;

  ${(props) =>
    props.active &&
    css`
      border-color: #7ea1b2;
      color: #7ea1b2;
    `}
`;

const ImgDiv = styled.div`
  width: 280px;
  height: 438px;
  border-radius: 10px;
  background-color: #eef4f8;
  padding: 20px 20px 0 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-right: 20px;
  margin-bottom: 20px;
`;

const Img = styled.img`
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

const ImgTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImgCover = styled.div`
  width: 240px;
  height: 360px;
  position: absolute;
  background-color: #7ea1b2;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DelIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: #000000;
  border: solid 2px #f1f2ea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 18px;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
`;

const Required = styled.img`
  margin-left: 8px;
`;

const HopeBtnWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function CreateRequestSample({
  selectData,
  handleSelectData,
  handleCancel,
  handleCreate,
}) {
  const ref = useRef();

  const [selectOpen, setSelectOpen] = useState(false);

  const [inputs, setInputs] = useState({
    title: "",
    caption: "Korean",
    madeFor: "",
    item_no_arr: [],
  });

  useOutsideClick(ref, () => {
    setSelectOpen(false);
  });

  const handleSubmit = () => {
    setInputs({
      ...inputs,
      item_no_arr: selectData,
    });
    handleCreate(inputs);
  };

  console.log("SELECTED DATA : ", selectData);

  return (
    <>
      <TitelWrap>
        <TitleTxt1>Sample</TitleTxt1>
        <TitleTxt2>Requests</TitleTxt2>
      </TitelWrap>

      <InputContainer>
        <BrandLogo src="/images/test/gucci_logo.png" alt="logo" />
        <DataWrap>
          <ImgWrap>
            {selectData.map((d) => (
              <ImgDiv key={d.showroom_no}>
                <Img imgUrl={d.image_url} />
                <ImgTitle>{d.showroom_nm}</ImgTitle>
                <ImgCover>
                  <img src={ImgCheckIcon} alt="checked" />
                </ImgCover>
                <DelIcon onClick={() => handleSelectData(d)}>
                  <CloseIcon />
                </DelIcon>
              </ImgDiv>
            ))}
            {/* <ImgDiv>
              <Img src="/images/test/look01.png" alt="img" />
              <ImgTitle>Look #1</ImgTitle>
              <ImgCover>
                <img src={ImgCheckIcon} alt="checked" />
              </ImgCover>
              <DelIcon>
                <CloseIcon />
              </DelIcon>
            </ImgDiv>
            <ImgDiv>
              <Img src="/images/test/look02.png" alt="img" />
              <ImgTitle>Look #2</ImgTitle>
              <ImgCover>
                <img src={ImgCheckIcon} alt="checked" />
              </ImgCover>
              <DelIcon>
                <CloseIcon />
              </DelIcon>
            </ImgDiv>
            <ImgDiv>
              <Img src="/images/test/look03.png" alt="img" />
              <ImgTitle>Look #3</ImgTitle>
              <ImgCover>
                <img src={ImgCheckIcon} alt="checked" />
              </ImgCover>
              <DelIcon>
                <CloseIcon />
              </DelIcon>
            </ImgDiv>
            <ImgDiv>
              <Img src="/images/test/look04.png" alt="img" />
              <ImgTitle>Look #4</ImgTitle>
              <ImgCover>
                <img src={ImgCheckIcon} alt="checked" />
              </ImgCover>
              <DelIcon>
                <CloseIcon />
              </DelIcon>
            </ImgDiv> */}
          </ImgWrap>
          <DetailWrap>
            <Rows opt="sbt">
              <Box>
                <InputWrap>
                  <InputTitle>Magazine</InputTitle>
                  <StyleTextField
                    variant="outlined"
                    // value={data.magazine}
                    placeholder="Magazine"
                    readOnly
                    disabled
                  />
                </InputWrap>
                <InputWrap>
                  <InputTitle>Editor/Stylist</InputTitle>
                  <StyleTextField
                    variant="outlined"
                    // value={data.editor}
                    placeholder="Editor/Stylist"
                    readOnly
                    disabled
                  />
                </InputWrap>
              </Box>
              <Box>
                <InputWrap>
                  <InputTitle>
                    Contact
                    <Required src={StarIcon} alt="require" />
                  </InputTitle>
                  <Box>
                    <StyleTextField
                      variant="outlined"
                      // value={data.contact}
                      placeholder="Contact"
                      readOnly
                      disabled
                    />
                    <StyleTextField
                      variant="outlined"
                      // value={data.contact_phone}
                      placeholder="Contact Number"
                      readOnly
                      disabled
                    />
                  </Box>
                </InputWrap>
              </Box>
            </Rows>
            <Rows>
              <InputWrap>
                <InputTitle>Shooting Date</InputTitle>
                <StyleTextField
                  variant="outlined"
                  // value={data.shooting_dt}
                  placeholder="Shooting Date"
                  readOnly
                  disabled
                />
              </InputWrap>
              <InputWrap>
                <InputTitle>Pickup Date</InputTitle>
                <StyleTextField
                  variant="outlined"
                  // value={data.pickup_dt}
                  placeholder="Pickup Date"
                  readOnly
                  disabled
                />
              </InputWrap>
              <InputWrap margin="20px">
                <InputTitle>Returning Date</InputTitle>
                <StyleTextField
                  variant="outlined"
                  // value={data.returning_dt}
                  placeholder="Returning Date"
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>
                  Shipping destination
                  <Required src={StarIcon} alt="require" />
                </InputTitle>
                <StyleTextField2
                  variant="outlined"
                  // value={data.shipping}
                  placeholder="Shipping destination"
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>Shipping Notes</InputTitle>
                <StyleTextField3
                  variant="outlined"
                  // value={data.shipping_note}
                  placeholder="Notes"
                  multiline
                  rows={4}
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>촬영컨셉</InputTitle>
                <StyleTextField2
                  variant="outlined"
                  // value={data.shooting}
                  placeholder="Shooting"
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>Shooting time</InputTitle>
                <StyleTextField2
                  variant="outlined"
                  // value={data.shooting_time}
                  placeholder="Shooting time"
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>
                  Model
                  <Required src={StarIcon} alt="require" />
                </InputTitle>
                <ModelWrap>
                  <CheckBoxWrap>
                    <CheckBoxImg src={CheckBoxOn} alt="" />
                    Celeb
                  </CheckBoxWrap>
                  <div>
                    <StyleTextField4
                      variant="outlined"
                      // value={data.model_type === "Celeb" ? data.model_nm : ""}
                      placeholder="Celeb"
                      readOnly
                      disabled
                    />
                  </div>
                </ModelWrap>
                <ModelWrap>
                  <CheckBoxWrap>
                    <CheckBoxImg src={CheckBoxOff} alt="" />
                    Fashion Model
                  </CheckBoxWrap>
                  <div>
                    <StyleTextField4
                      variant="outlined"
                      // value={data.model_type === "Model" ? data.model_nm : ""}
                      placeholder="Model"
                      readOnly
                      disabled
                    />
                  </div>
                </ModelWrap>
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>
                  유가화보
                  <Required src={StarIcon} alt="require" />
                </InputTitle>
                <ModelWrap>
                  <CheckBoxWrap>
                    <CheckBoxImg src={CheckBoxOff} alt="" />
                    유가화보
                  </CheckBoxWrap>
                  <div>
                    <StyleTextField4
                      variant="outlined"
                      // value={data.paid_ed_yn ? data.paid_ed_brand : ""}
                      placeholder="Brand"
                      readOnly
                      disabled
                    />
                  </div>
                </ModelWrap>
              </InputWrap>
            </Rows>
            {/* <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>당일연결 희망 / 가능 여부</InputTitle>
                <HopeBtnWrap>
                  <Btn active={true}>
                    <StyleCheckIcon />
                    Yes
                  </Btn>
                  <Btn active={false}>
                    <StyleCheckIcon />
                    No
                  </Btn>
                </HopeBtnWrap>
              </InputWrap>
            </Rows> */}
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>Number of pages</InputTitle>
                <StyleTextField2
                  variant="outlined"
                  // value={data.number_of_pages}
                  placeholder="Number of pages"
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>함께 들어가는 브랜드</InputTitle>
                <StyleTextField2
                  variant="outlined"
                  // value={data.other_brands}
                  placeholder="Different brand"
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>Message</InputTitle>
                <StyleTextField3
                  variant="outlined"
                  // value={data.msg}
                  placeholder="Message"
                  multiline
                  rows={4}
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
          </DetailWrap>
        </DataWrap>
      </InputContainer>

      <BottomWrap>
        <BtnWrap type="cancel" onClick={handleCancel}>
          <CancelTxt>임시 저장</CancelTxt>
        </BtnWrap>
        <BtnWrap type="confirm" onClick={handleSubmit}>
          <ConfirtTxt>홀딩 요청</ConfirtTxt>
        </BtnWrap>
      </BottomWrap>
    </>
  );
}
