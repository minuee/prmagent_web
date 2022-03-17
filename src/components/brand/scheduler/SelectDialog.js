import React, { useState } from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import styled, { css } from "styled-components";
import { darken } from "polished";
import CloseIcon from "@material-ui/icons/Close";

import ConfirmedIcon from "assets/scheduler/confirmedIcon.svg";
import CheckIcon from "assets/check_icon.png";


import dayjs from "dayjs";
import _ from "lodash";
import utils from "utils";
import { DocDB } from "aws-sdk";

const StyleDialog = styled(Dialog)`
  .MuiDialogTitle-root {
    padding: 0;
  }
  .MuiPaper-rounded {
    border-radius: 0;
  }
  .MuiDialogContent-root:first-child {
    padding: 57px 20px 20px 20px;
  }
`;

const StyleDialogContent = styled(DialogContent)`
  width: 420px;
  height: 350px;
  display: flex;
  flex-direction: column;
`;

const CloseIconBox = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
`;

const Contents = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > img {
    width: 72px;
    height: 72px;
    margin-bottom: 20px;
  }
  .main {
    font-size: 18px;
    font-weight: bold;
    color: #222222;
  }
  .sub {
    font-size: 14px;
    font-weight: bold;
    color: #222222;
  }
`;


const SelectContents = styled.div`
  width: 90%;
  height: 100px;  
  align-items: center;
  justify-content: center;
  margin-left:5%;
  margin-right:5%;
  > img {
    width: 72px;
    height: 72px;
    margin-bottom: 20px;
  }
  .sub {
    font-size: 14px;
    font-weight: bold;
    color: #222222;
  }
`;

const SelectItemsWrap = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.checked ? "#7ea1b2" : "#ffffff"};
  border: ${(props) =>
    props.checked ? "solid 1px #7ea1b2" : "solid 1px #dddddd" };
  border-radius: 5px; 

  & {
    margin-top:10px
  }
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
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

const ConfirtTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
`;

const CancelTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #999999;
`;

export default function SelectDialog({
  open,
  nowRequester,
  nowReqNo,
  oldRequester,
  setOpen,
  handleConfirm,
  
}) {
  const [msgDialog, setMsgDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState(null);
  const [checked, setCheck] = useState(null);
  const handleClose = () => {
    setOpen(false);
  };

  const handleLocalConfirm = async() => {
    if ( utils.isEmpty(checked)) {
      utils.customAlert('먼저 촬영할 팀을 선택하세요');
      return;
    }else{
      let data = {
        first_target : {
          target_req_no : oldRequester.target_req_no,
          target_showroom_no : oldRequester.target_showroom_no,
          target_user_name : oldRequester.target_user_name,          
          target_company_name : oldRequester.target_company_name,           
        },
        second_target : {
          target_req_no : nowReqNo,
          target_showroom_no : oldRequester.target_showroom_no,
          target_user_name : nowRequester.req_user_nm || nowRequester.req_send_username,          
          target_company_name : nowRequester.company_name || nowRequester.compy_nm || nowRequester.mgzn_nm,
        },
        nowTarget : 'old'
      }
      if ( checked === 'new') {
        data = {
          first_target : {
            target_req_no : nowReqNo,
            target_showroom_no : oldRequester.target_showroom_no,
            target_user_name : nowRequester.req_user_nm || nowRequester.req_send_username,          
            target_company_name : nowRequester.company_name || nowRequester.compy_nm || nowRequester.mgzn_nm,
          },
          second_target  : {
            target_req_no : oldRequester.target_req_no,
            target_showroom_no : oldRequester.target_showroom_no,
            target_user_name : oldRequester.target_user_name,          
            target_company_name : oldRequester.target_company_name, 
          },
          nowTarget : 'new'
        } 
      }
      handleConfirm(data)
    }
  }

  return (
    <>
      <StyleDialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        maxWidth={"md"}
      >
        <StyleDialogContent>
          <CloseIconBox>
            <CloseIcon onClick={handleClose} />
          </CloseIconBox>
          <Contents>
            <div className="main">먼저 촬영할 팀을 선택하세요</div>
          </Contents>
          <SelectContents>
            <SelectItemsWrap checked={checked==='old'?true:false} onClick={()=>setCheck('old')}>
              <div className="sub">
                [{oldRequester.target_company_name}]{oldRequester.target_user_name}{/* {oldRequester.target_user_position} */}
              </div>
            </SelectItemsWrap>
            <SelectItemsWrap checked={checked==='new'?true:false} onClick={()=>setCheck('new')}>
              <div className="sub">
              [{nowRequester.company_name || nowRequester.compy_nm || nowRequester.mgzn_nm}]{nowRequester.req_user_nm || nowRequester.req_send_username}{/* {nowRequester.req_user_posi} */}
              </div>
            </SelectItemsWrap>
          </SelectContents>
          <BottomWrap>
            <BtnWrap type="cancel" onClick={()=>handleClose()}>
              <CancelTxt>Cancle</CancelTxt>
            </BtnWrap>
            <BtnWrap type="confirm" onClick={()=>handleLocalConfirm()}>
              <BtnImgWrap>
                <img src={CheckIcon} alt="check"></img>
              </BtnImgWrap>
              <ConfirtTxt>Confirm</ConfirtTxt>
            </BtnWrap>
          </BottomWrap>
        </StyleDialogContent>
      </StyleDialog>
    </>
  );
}
