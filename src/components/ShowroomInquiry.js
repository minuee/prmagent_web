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
    contact2: "",
    contact3: "",
    email: "",
    email2: "",
    email3: "",
    inquiry_charge : "",
    inquiry_charge2 : "",
    inquiry_charge3 : ""
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
      contact : showroomInquiryQuery !== undefined ? showroomInquiryQuery.showroom_inquiry_contact : "",
      contact2 : showroomInquiryQuery !== undefined ? showroomInquiryQuery.showroom_inquiry_contact2 : "",
      contact3 : showroomInquiryQuery !== undefined ? showroomInquiryQuery.showroom_inquiry_contact3 : "",
      inquiry_charge : showroomInquiryQuery !== undefined ? showroomInquiryQuery.inquiry_charge : "",
      inquiry_charge2 : showroomInquiryQuery !== undefined ? showroomInquiryQuery.inquiry_charge2 : "",
      inquiry_charge3 : showroomInquiryQuery !== undefined ? showroomInquiryQuery.inquiry_charge3 : "",
      email : showroomInquiryQuery !== undefined ? showroomInquiryQuery.showroom_inquiry_email : "",
      email2 : showroomInquiryQuery !== undefined ? showroomInquiryQuery.showroom_inquiry_email2 : "",
      email3 : showroomInquiryQuery !== undefined ? showroomInquiryQuery.showroom_inquiry_email3 : "",
    });
  }, []);

  const showroomInquiryUpdate = useMutation(
    ["showroom-inquiry-update"],
    () =>
      apiObject.setShowroomInquiry(
        {
          showroom_inquiry_contact: showroom.contact,
          showroom_inquiry_contact2: showroom.contact2,
          showroom_inquiry_contact3: showroom.contact3,
          inquiry_charge: showroom.inquiry_charge,
          inquiry_charge2: showroom.inquiry_charge2,
          inquiry_charge3: showroom.inquiry_charge3,
          showroom_inquiry_email: showroom.email,
          showroom_inquiry_email2: showroom.email2,
          showroom_inquiry_email3: showroom.email3
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
        <Title>쇼룸 문의번호 <Title2>(최대3명까지)</Title2></Title>
        <StyleDivider />
        <Contents>
          <InputWraps>
            <ContentsTitle>Charge</ContentsTitle>
            <FiledDataWraps>
              <StyledTextField
                placeholder="1st 담당자명"
                variant="outlined"
                name="inquiry_charge"
                value={showroom.inquiry_charge}
                onChange={handleChange}
              />
              <StyledTextField
                placeholder="2nd 담당자명"
                variant="outlined"
                name="inquiry_charge2"
                value={showroom.inquiry_charge2}
                onChange={handleChange}
              />
              <StyledTextField
                placeholder="3rd 담당자명"
                variant="outlined"
                name="inquiry_charge3"
                value={showroom.inquiry_charge3}
                onChange={handleChange}
              />
            </FiledDataWraps>
           
          </InputWraps>
          <InputWraps>
            <ContentsTitle>Contact</ContentsTitle>
            <FiledDataWraps>
              <StyledTextField
                placeholder="1st Contact"
                variant="outlined"
                name="contact"
                value={showroom.contact}
                onChange={handleChange}
              />
              <StyledTextField
                placeholder="2nd Contact"
                variant="outlined"
                name="contact2"
                value={showroom.contact2}
                onChange={handleChange}
              />
                <StyledTextField
                placeholder="3rd Contact"
                variant="outlined"
                name="contact3"
                value={showroom.contact3}
                onChange={handleChange}
              />
            </FiledDataWraps>
           
          </InputWraps>
          <InputWraps>
            <ContentsTitle>E-mail</ContentsTitle>
           
              <StyledTextField
                placeholder="1st E-mail"
                variant="outlined"
                name="email"
                value={showroom.email}
                onChange={handleChange}
              />
               <StyledTextField
                placeholder="2nd E-mail"
                variant="outlined"
                name="email2"
                value={showroom.email2}
                onChange={handleChange}
              />
              <StyledTextField
                placeholder="3rd E-mail"
                variant="outlined"
                name="email3"
                value={showroom.email3}
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
  display: flex;
  font-weight: bold;
  font-size: 28px;
  margin-bottom: 15px;
  align-items: center;
`;
const Title2 = styled.div`
  font-size: 15px;
  display: flex;
  margin-left: 15px;
  justify-content: center;
  align-items: center;
  color: #999999;
  
`;
const StyleDivider = styled(Divider)`
  width: 100%;
  height: 2px;
  background-color: #dddddd;
  margin-bottom: 20px;
`;

const Contents = styled.div``;

const InputWraps = styled.div`
  & + & {
    margin-top: 20px;
  }
`;
const FiledDataWraps = styled.div`
  display: flex;
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
  margin-top: 30px;
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
