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

function InquiryNumber({ handleClose }) {
  const [inquiryNumber, setInquiryNumber] = useState("");
  const queryClient = useQueryClient();

  const handleChange = useCallback(
    (e) => {
      setInquiryNumber(e.target.value);
    },
    [inquiryNumber]
  );

  const handleConfirm = useCallback(() => {
    /* if (confirm("문의번호를 수정하시겠습니까?")) {
      inquiryNumberUpdate.mutate();
    } */
    alertConfirm({
      title: Constants.appName,
      content: '문의번호를 수정하시겠습니까?',
      onOk: () => {
        inquiryNumberUpdate.mutate()
      },
      onCancel: () => {console.log('cancel')}
    });
  });

  const inquiryNumberQuery =
    queryClient.getQueryData(["showroom-inquiry-number"]) || "";

  useEffect(() => {
    setInquiryNumber(inquiryNumberQuery.inquiry_number);
  }, []);

  const inquiryNumberUpdate = useMutation(
    ["showroom-inquiry-number-update"],
    () =>
      apiObject.setInquiryNumber(
        {
          inquiry_number: inquiryNumber,
        },
        () => {}
      ),
    {
      onSuccess: () => {
        utils.customAlert("문의번호가 수정되었습니다.");
        queryClient.invalidateQueries(["showroom-inquiry-number"]);
      },
    }
  );

  if (inquiryNumberUpdate.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      <Container>
        <Title>소비자 문의번호</Title>
        <StyleDivider />
        <Contents>
          <ContentsTitle>Contact</ContentsTitle>
          <StyledTextField
            placeholder="Contact"
            variant="outlined"
            value={inquiryNumber}
            onChange={handleChange}
          />
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

const ContentsTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 12px;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  height: 320px;

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

export default React.memo(InquiryNumber);
