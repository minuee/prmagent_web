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

function limitdays({ handleClose }) {
  const [limitNumber, setLimitNumber] = useState(7);
  const queryClient = useQueryClient();

  const handleChange = useCallback(
    (e) => {
      setLimitNumber(e.target.value);
    },
    [limitNumber]
  );

  const handleConfirm = useCallback(() => {
    /* if (confirm("문의번호를 수정하시겠습니까?")) {
      limitNumberUpdate.mutate();
    } */
    if ( limitNumber < 1 ) { 
      utils.customAlert('최소 1일이상 입력하셔야 합니다.');
      setLimitNumber(1);
      return;
    }else if ( limitNumber > 60 ) {
      utils.customAlert('최대 60일까지만 입력가능합니다.');
      setLimitNumber(60);
      return;
    }else{
      alertConfirm({
        title: Constants.appName,
        content: '홀딩요청 최대기간을 설정하시겠습니까?',
        onOk: () => {
          limitNumberUpdate.mutate()
        },
        onCancel: () => {console.log('cancel')}
      });
    }
  });

  const limitNumberQuery =
    queryClient.getQueryData(["showroom-inquiry-number"]) || "";

  useEffect(() => {
    setLimitNumber(limitNumberQuery.limit_days);
  }, []);

  const limitNumberUpdate = useMutation(
    ["showroom-limit-number-update"],
    () =>
      apiObject.setlimitNumber(
        {
          limit_days: limitNumber,
        },
        () => {}
      ),
    {
      onSuccess: () => {
        utils.customAlert("홀딩요청 최대기간이 수정되었습니다.");
        queryClient.invalidateQueries(["showroom-limit-number"]);
      },
    }
  );

  if (limitNumberUpdate.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      <Container>
        <Title>홀딩요청 최대기간</Title>
        <StyleDivider />
        <Contents>
          <ContentsTitle>기간(일)</ContentsTitle>
          <StyledTextField
            placeholder="Contact"
            variant="outlined"
            value={limitNumber}
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

export default React.memo(limitdays);
