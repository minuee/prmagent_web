import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import { Divider, TextField } from "@material-ui/core";
import { darken } from "polished";
import { useMutation, useQueryClient } from "react-query";

import CancelIcon from "assets/close_icon.png";
import CheckIcon from "assets/check_icon.png";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';


function ShowroomInquiry({ handleClose }) {
  const [showroom, setShowroom] = useState({
    contact: "",
    email: "",
    inquiry_charge : ""
  });
  const queryClient = useQueryClient();

  const handleChange = useCallback(
    (e) => {
      setShowroom({ ...showroom, [e.target.name]: e.target.value });
    },
    [showroom]
  );

  const handleConfirm = useCallback(() => {
    /* if (confirm("쇼룸 문의정보를 수정하시겠습니까?")) {
      showroomInquiryUpdate.mutate();
    } */
    alertConfirm({
      title: Constants.appName,
      content: '쇼룸 문의정보를 수정하시겠습니까?',
      onOk: () => {showroomInquiryUpdate.mutate()},
      onCancel: () => {console.log('cancel')}
    });
  });

  const showroomInquiryQuery = queryClient.getQueryData(["showroom-inquiry"]);  
  useEffect(() => {
    setShowroom({
      contact: showroomInquiryQuery !== undefined ? showroomInquiryQuery.showroom_inquiry_contact : "",
      inquiry_charge: showroomInquiryQuery !== undefined ? showroomInquiryQuery.inquiry_charge : "",
      email: showroomInquiryQuery !== undefined ? showroomInquiryQuery.showroom_inquiry_email : "",
    });
  }, []);

  const showroomInquiryUpdate = useMutation(
    ["showroom-inquiry-update"],
    () =>
      apiObject.setShowroomInquiry(
        {
          showroom_inquiry_contact: showroom.contact,
          inquiry_charge: showroom.inquiry_charge,
          showroom_inquiry_email: showroom.email,
        },
        () => {}
      ),
    {
      onSuccess: () => {
        alert("쇼룸 문의정보가 수정되었습니다.");
        queryClient.invalidateQueries(["showroom-inquiry"]);
      },
    }
  );

  if (showroomInquiryUpdate.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      <Container>
        <Title>쇼룸 문의번호</Title>
        <StyleDivider />
        <Contents>
          <InputWraps>
            <ContentsTitle>Charge</ContentsTitle>
            <StyledTextField
              placeholder="담당자명"
              variant="outlined"
              name="inquiry_charge"
              value={showroom.inquiry_charge}
              onChange={handleChange}
            />
          </InputWraps>
          <InputWraps>
            <ContentsTitle>Contact</ContentsTitle>
            <StyledTextField
              placeholder="Contact"
              variant="outlined"
              name="contact"
              value={showroom.contact}
              onChange={handleChange}
            />
          </InputWraps>
          <InputWraps>
            <ContentsTitle>E-mail</ContentsTitle>
            <StyledTextField
              placeholder="E-mail"
              variant="outlined"
              name="email"
              value={showroom.email}
              onChange={handleChange}
            />
          </InputWraps>
          <BottomWrap>
            <BtnWrap type="cancel" onClick={handleClose}>
              <BtnImgWrap>
                <img src={CancelIcon} alt="close"></img>
              </BtnImgWrap>
              <CancelTxt>Cancel</CancelTxt>
            </BtnWrap>
            <BtnWrap type="confirm" onClick={handleConfirm}>
              <BtnImgWrap>
                <img src={CheckIcon} alt="check"></img>
              </BtnImgWrap>
              <ConfirtTxt>Confirm</ConfirtTxt>
            </BtnWrap>
          </BottomWrap>
        </Contents>
      </Container>
    </>
  );
}

const Container = styled.div``;

const Title = styled.div`
  font-weight: bold;
  font-size: 28px;
  margin-bottom: 15px;
`;

const StyleDivider = styled(Divider)`
  width: 100%;
  height: 2px;
  background-color: #dddddd;
  margin-bottom: 40px;
`;

const Contents = styled.div``;

const InputWraps = styled.div`
  & + & {
    margin-top: 20px;
  }
`;

const ContentsTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 12px;
`;

const StyledTextField = styled(TextField)`
  width: 100%;

  .MuiInputBase-root {
    font-size: 16px;
    color: #999999;
  }
  .MuiInputBase-input {
    padding: 10px 12px;
  }
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 212px;
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

export default React.memo(ShowroomInquiry);
