import React, { useState,useCallback } from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import styled, { css } from "styled-components";
import { darken } from "polished";
import CloseIcon from "@material-ui/icons/Close";

import ConfirmedIcon from "assets/scheduler/confirmedIcon.svg";
import CheckIcon from "assets/check_icon.png";
import MessageDialog from "components/MessageDialog";
import SelectDialog from "./SelectDialog";
import _ from "lodash";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';


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
  width: 320px;
  height: 250px;
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
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

export default function ConfirmDialog({
  open,
  setOpen,
  inputs,
  rdata,
  data,
  setInputs,
  handleConfirm,
  isDuplicate,
  setDuplicate
}) {
  const [msgDialog, setMsgDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState(null);
  //const [isDuplicate, setDuplicate] = useState("");

  const [selectDialog, setselectDialog] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async(type) => {
    if ( type === 'confirm' ) {
      //console.log('data.photogrf_dt',data[0].photogrf_dt)
      //const today = dayjs().format("YYYY-MM-DD");
      const shooting_dt = data[0].photogrf_dt;
      // console.log('shooting_dt',shooting_dt)
      const showroomNo = inputs.showroom_no[0];
      //console.log('showroomNo',showroomNo)
      let isDupCheck =  false;
      let isDupLookName = "";
      let strTarget_req_no = "";
      let strTarget_showroom_no = "";
      let strTarget_user_position = "";
      let strTarget_user_name = "";
      let strTarget_company_name = "";
      
      rdata.reservation_list.forEach((d2, i2) => {
        let targetShowroom = d2.showroom_no;
        console.log('targetShowroom',targetShowroom);      
        if ( showroomNo === targetShowroom ) {
          if ( shooting_dt === d2.date_info[0]?.photogrf_dt) {      
            isDupCheck = true;
            isDupLookName = d2.date_info[0]?.showroom_nm;
            strTarget_req_no = d2.date_info[0]?.target_req_no;
            strTarget_showroom_no = d2.date_info[0]?.target_showroom_no;
            strTarget_user_position = d2.date_info[0]?.target_user_position;
            strTarget_user_name = d2.date_info[0]?.target_user_name;
            strTarget_company_name = d2.date_info[0]?.target_company_name;
            setDuplicate({
              target_req_no : strTarget_req_no,
              target_showroom_no : strTarget_showroom_no,
              target_user_name : strTarget_user_name,
              target_user_position : strTarget_user_position,
              target_company_name : strTarget_company_name
            })
          }
        }      
      }); 
      //console.log('isDupCheck',isDupCheck);
      if ( isDupCheck ) {
        /* if (confirm( isDupLookName + "이(가) ["+strTarget_company_name + "]" + strTarget_user_name+ "에 승인된 정보가 있습니다. 그래도 승인하시겠습니까?")) {
          
        } */

        alertConfirm({
          title: Constants.appName,
          content: isDupLookName + "이(가) ["+strTarget_company_name + "]" + strTarget_user_name+ "에 승인된 정보가 있습니다. 그래도 승인하시겠습니까?",
          onOk: () => {
            console.log('isDupLookName',isDupLookName);
            setType(type);
            setOpen(false);
            setselectDialog(true)
          },
          onCancel: () => {console.log('cancle')}
        });


      }else{
        setMsgDialog(true);
        setOpen(false);
        setType(type);
      }
    }else{
      setMsgDialog(true);
      setOpen(false);
      setType(type);
    }

  };

  const handleMsgConfirm = () => {
    setMsgDialog(false);
    setInputs({ ...inputs, msg: msg });
    handleConfirm(type);
  };

  const handleSelectConfirm = useCallback(async(data) => {
    await setDuplicate({...isDuplicate,data})
    setselectDialog(false);    
    setMsgDialog(true);    
  });

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
            <img src={ConfirmedIcon} alt="" />
            <div className="sub">요청을 승인하시겠습니까?</div>
          </Contents>
          <BottomWrap>
            <BtnWrap type="cancel" onClick={() => handleSubmit("refuse")}>
              <CancelTxt>Reject</CancelTxt>
            </BtnWrap>
            <BtnWrap type="confirm" onClick={() => handleSubmit("confirm")}>
              <BtnImgWrap>
                <img src={CheckIcon} alt="check"></img>
              </BtnImgWrap>
              <ConfirtTxt>Confirm</ConfirtTxt>
            </BtnWrap>
          </BottomWrap>
        </StyleDialogContent>
      </StyleDialog>

      <MessageDialog
        open={msgDialog}
        setOpen={setMsgDialog}
        input={msg}
        setInput={setMsg}
        handleConfirm={handleMsgConfirm}
      />
      <SelectDialog
        open={selectDialog}
        nowRequester={data[0]}
        nowReqNo={data[0].req_no}
        oldRequester={isDuplicate}
        setOpen={setselectDialog}        
        handleConfirm={handleSelectConfirm}
      />

    </>
  );
}
