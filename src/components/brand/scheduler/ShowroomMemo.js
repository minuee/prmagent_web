import React, { useState,useEffect } from "react";
import styled from "styled-components";
import { darken } from "polished";
import { useMutation, useQueryClient } from "react-query";
import { apiObject } from "api/api_brand";

import ConfirmIcon from "assets/check_icon_w.svg";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "assets/scheduler/CheckIcon.svg";
import utils from "utils";

export default function ShowroomMemo({open,setOpen,sno,snm,dt}) {
  const [msg, setMsg] = useState('');
  const [dailyMsg, setDailyMsg] = useState('');
  const onMaskClick = (e) => {
    setOpen(false);
  };

  useEffect(() => {
    if (sno !== null) {
      setMsg('');
      setDailyMsg('');
      getMemo.mutate(sno);
    }
  }, [sno]);

  const getMemo = useMutation(
    (value) => apiObject.getShowroomMemo({ showroom_no : value ,date : dt}),
    {
      onSuccess: (res) => {
        
        if ( res.memo != null ) {
          setMsg(res.memo.content);
          setDailyMsg(res.date_memo?.content);
        }
      },
      onError: (err) => {
        console.log('err',err)
      },
    }
  );

  return (
    <>
      <ModalOverlay open={open} />
      <ModalWrapper
        open={open}
        tabIndex="-1"
        onClick={open ? onMaskClick : null}
      >
        <ModalInner tabIndex="0">
          <Header>
            <Title>{snm}의 메모</Title>
            <StyledCloseIcon onClick={() => setOpen(false)} />
          </Header>
          <Content>
            <SubTitle>전체 메모</SubTitle>
            <TextArea value={msg} disabled={true} />
            {!utils.isEmpty(dt) &&
            <SubTitle>{utils.convertUnixToDate(dt,'MM.DD')} 메모</SubTitle>
            }
            {!utils.isEmpty(dt) &&
            <TextArea value={dailyMsg} disabled={true} />
            }
            <div>
              <ConfirmBtn onClick={() => onMaskClick()}>Close</ConfirmBtn>
            </div>
          </Content>
        </ModalInner>
      </ModalWrapper>
    </>
  );
}

const ModalWrapper = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.open ? "block" : "none")};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
`;
const SubTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
`;
const ModalOverlay = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.open ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: transparent;
  z-index: 999;
`;

const ModalInner = styled.div`
  box-sizing: border-box;
  position: relative;
  box-shadow: 10px 10px 20px 0 rgba(0, 0, 0, 0.16);
  background-color: #fff;
  border: solid 1px #bebebe;
  width: 413px;
  min-width: 413px;
  height: auto;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;

  :focus {
    outline: none;
  }
`;

const Content = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
`;
const StyledCloseIcon = styled(CloseIcon)`
  font-size: 35px;
  color: #000000;
  cursor: pointer;
  padding-top:10px;
`;

const Header = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

const ColorWrap = styled.div`
  display: flex;
  flex-direction: column;
  > div {
    display: flex;
  }
`;

const Color = styled.div`
  display: flex;
  width: 59px;
  height: 59px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.bg || "#ffffff"};
  cursor: pointer;

  > img {
    width: 24px;
    height: 24px;
  }
`;

const ConfirmBtn = styled.div`
  width: 100%;
  height: 42px;
  border-radius: 5px;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);
  background-color: #7ea1b2;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  > img {
    margin-right: 10px;
  }

  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
  }
  &:active {
    background-color: ${darken(0.2, "#7ea1b2")};
  }
`;

const BtnGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .delBtn {
    display: flex;
    width: 177px;
    height: 42px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    border: solid 1px #dddddd;
    background-color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    color: #999999;
    cursor: pointer;
    &:hover {
      background-color: ${darken(0.1, "#ffffff")};
    }
    &:active {
      background-color: ${darken(0.2, "#ffffff")};
    }
  }

  .saveBtn {
    display: flex;
    width: 177px;
    height: 42px;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    background-color: #7ea1b2;
    color: #ffffff;
    cursor: pointer;
    &:hover {
      background-color: ${darken(0.1, "#7ea1b2")};
    }
    &:active {
      background-color: ${darken(0.2, "#7ea1b2")};
    }
  }
`;

const TextArea = styled.textarea`
  width: 370px;
  height: 150px;
  padding: 14px;
  border-radius: 5px;
  margin-bottom: 20px;
  box-sizing: border-box;
  border: solid 1px #dddddd;
  font-size: 14px;
  color: #000000;
  font-family: "Noto Sans KR";
  ::placeholder {
    color: #999999;
  }
  resize: none;
  :focus {
    outline: none;
  }
`;
