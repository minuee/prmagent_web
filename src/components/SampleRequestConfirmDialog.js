import React, { useCallback } from "react";
import styled, { css } from "styled-components";
import { Divider } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { darken } from "polished";
import dayjs from "dayjs";

import CancelIcon from "assets/close_icon.png";
import CheckIcon from "assets/check_icon.png";

const Container = styled.div`
  width: 390px;
  height: 361px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 5px 5px 25px 0 rgba(0, 0, 0, 0.16);
  position: absolute;
  z-index: 10;
  top: -327px;
  left: 168px;
  padding: 56px 30px 22px 30px;
`;

const ContentsWrap = styled.div``;

const StyleDivider = styled(Divider)`
  margin-top: 30px;
  margin-bottom: 20px;
  background-color: #dddddd;
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
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

const ConfirmTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
`;

const BtnImgWrap = styled.div`
  margin-right: 10px;
  display: flex;
`;

const CancelTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #999999;
`;

const ContentDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LogoImg = styled.img`
  max-height: 38px;
  min-height: 38px;
`;

const ReqUser = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-top: 14px;
`;

const CompNm = styled.div`
  font-size: 14px;
  color: #999999;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-top: 14px;
`;

const Period = styled.div`
  font-size: 12px;
  margin-top: 8px;
`;

const MainImg = styled.div`
  width: 124px;
  height: 190px;
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

function SampleRequestConfirmDialog({
  open,
  setOpen,
  data,
  title,
  titleImg,
  handleConfirm,
  handleReject,
}) {
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [open]);

  return (
    <>
      {open && (
        <Container>
          <CloseIconBox>
            <StyledCloseIcon onClick={handleClose} />
          </CloseIconBox>
          <ContentsWrap>
            <ContentDiv>
              <div>
                <LogoImg src={data.compy_logo_adres} alt="logo" />
                <ReqUser>
                  {data.req_user_nm} {data.req_user_posi}
                </ReqUser>
                <CompNm>{data.compy_nm}</CompNm>
                <Title>{title}</Title>
                <Period>
                  {dayjs.unix(data.duty_recpt_dt).format("M/DD")} -{" "}
                  {dayjs.unix(data.return_prearnge_dt).format("M/DD")}
                </Period>
              </div>
              <div>
                <MainImg imgUrl={titleImg} />
              </div>
            </ContentDiv>
            <StyleDivider />
            <BottomWrap>
              <BtnWrap type="cancel" onClick={handleReject}>
                <BtnImgWrap>
                  <img src={CancelIcon} alt="cancel"></img>
                </BtnImgWrap>
                <CancelTxt>Reject</CancelTxt>
              </BtnWrap>
              <BtnWrap type="confirm" onClick={handleConfirm}>
                <BtnImgWrap>
                  <img src={CheckIcon} alt="check"></img>
                </BtnImgWrap>
                <ConfirmTxt>Confirm</ConfirmTxt>
              </BtnWrap>
            </BottomWrap>
          </ContentsWrap>
        </Container>
      )}
    </>
  );
}

export default React.memo(SampleRequestConfirmDialog);
