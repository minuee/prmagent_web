import React, { useState, useEffect } from "react";
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
    padding: 11px 12px;
    color: #999999;
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

export default function NoticeComponent() {
  const [notice, setNotice] = useState("");
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    setNotice(e.target.value);
  };

  const handleDelete = () => {
    /* if (confirm("???????????? ??????????????? ?????????????????????????")) {
      setNotice("");
      noticeUpdate.mutate(notice);
    } */
    alertConfirm({
      title: Constants.appName,
      content: '???????????? ??????????????? ?????????????????????????',
      onOk: () => {
        setNotice("");
        noticeUpdate.mutate(notice);
      },
      onCancel: () => {console.log('cancel')}
    });
  };

  const handleConfirm = () => {
    /* if (confirm("???????????? ??????????????? ?????????????????????????")) {
      noticeUpdate.mutate(notice);
    } */
    alertConfirm({
      title: Constants.appName,
      content: '???????????? ??????????????? ?????????????????????????',
      onOk: () => {
        noticeUpdate.mutate(notice);
      },
      onCancel: () => {console.log('cancel')}
    });
  };

  const noticeData = queryClient.getQueryData(["sendout-notice"]) || "";

  useEffect(() => {
    setNotice(noticeData.content);
  }, []);

  const noticeUpdate = useMutation(
    ["sendout-notice-update"],
    (value) => apiObject.setSendoutNotice({ content: value }),
    {
      onSuccess: () => {
        // utils.customAlert("???????????? ??????????????? ?????????????????????.");
        queryClient.invalidateQueries(["sendout-notice"]);
      },
      onError: () => {
        utils.customAlert("???????????? ???????????? ?????? ??? ????????? ??????????????????.");
      },
    }
  );

  if (noticeUpdate.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      <Container>
        <Title>???????????? ????????????</Title>
        <StyleDivider />
        <Contents>
          <ContentsTitle>
            ??????????????? ????????? ??????????????? ??????????????????.
          </ContentsTitle>
          <StyledTextField
            multiline
            rows={14}
            placeholder="Contents"
            variant="outlined"
            value={notice}
            onChange={handleChange}
          />
          <BottomWrap>
            <BtnWrap type="cancel" onClick={handleDelete}>
              <BtnImgWrap>
                <img src={CancelIcon} alt="close"></img>
              </BtnImgWrap>
              <CancelTxt>Delete</CancelTxt>
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
