import React, { useState, useCallback } from "react";
import styled, { css } from "styled-components";
import { TextField } from "@material-ui/core";
import { darken } from "polished";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";

import CancelIcon from "assets/close_icon.png";
import CheckIcon from "assets/check_icon.png";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';

const TitleWrap = styled.div`
  margin-bottom: 20px;
`;

const ContentsWrap = styled.div`
  margin-bottom: 62px;
`;

const StyleTextField = styled(TextField)`
  width: 100%;

  .MuiOutlinedInput-input {
    padding: 8px 14px;
    font-size: 14px;
  }
  .MuiOutlinedInput-root {
    border-radius: 0;
    height: 36px;
  }
`;

const StyleMultiTextFiled = styled(TextField)`
  width: 100%;

  .MuiOutlinedInput-multiline {
    padding: 14px;
    font-size: 14px;
  }

  .MuiOutlinedInput-root {
    border-radius: 0;
  }
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 80px 0;
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

function QuestionAdd() {
  const history = useHistory();
  const [inputs, setInputs] = useState({
    subject: "",
    content: "",
  });

  const handleChange = useCallback(
    (e) => {
      setInputs({
        ...inputs,
        [e.target.name]: e.target.value,
      });
    },
    [inputs]
  );

  const handleCancel = useCallback(() => {
    setInputs({
      subject: "",
      content: "",
    });
  }, [inputs]);

  const handleConfirm = useCallback(() => {
    /* if (confirm("??????????????? ?????????????????????????")) {
      setQna.mutate();
    } */
    alertConfirm({
      title: Constants.appName,
      content: '??????????????? ?????????????????????????',
      onOk: () => {
        setQna.mutate()
      },
      onCancel: () => {console.log('cancel')}
    });
  });

  const setQna = useMutation(
    ["qna-add"],
    () =>
      apiObject.setQna(
        {
          subject: inputs.subject,
          content: inputs.content,
        },
        () => {}
      ),
    {
      onSuccess: () => {
        utils.customAlert("?????????????????????.");
        setInputs({
          subject: "",
          content: "",
        });
        history.push("/brand/question/list");
      },
      onError: () => {
        utils.customAlert("????????? ????????? ??????????????????.");
      },
    }
  );

  if (setQna.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      <TitleWrap>
        <StyleTextField
          variant="outlined"
          value={inputs.subject}
          name="subject"
          onChange={handleChange}
          placeholder="????????? ??????????????????."
        />
      </TitleWrap>
      <ContentsWrap>
        <StyleMultiTextFiled
          variant="outlined"
          placeholder="??????????????? ??????????????????."
          value={inputs.content}
          name="content"
          onChange={handleChange}
          multiline
          rows={28}
        />
      </ContentsWrap>
      <BottomWrap>
        <BtnWrap type="cancel" onClick={handleCancel}>
          <BtnImgWrap>
            <img src={CancelIcon} alt="close"></img>
          </BtnImgWrap>
          <CancelTxt>Cancel</CancelTxt>
        </BtnWrap>
        <BtnWrap type="confirm" onClick={handleConfirm}>
          <BtnImgWrap>
            <img src={CheckIcon} alt="check"></img>
          </BtnImgWrap>
          <ConfirtTxt>?????? ??????</ConfirtTxt>
        </BtnWrap>
      </BottomWrap>
    </>
  );
}

export default React.memo(QuestionAdd);
