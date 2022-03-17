import React from "react";
import styled from "styled-components";
import { darken } from "polished";

import ConfirmIcon from "assets/check_icon_w.svg";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "assets/scheduler/CheckIcon.svg";

export default function MemoDialog({
  open,
  setOpen,
  msg,
  setMsg,
  color,
  setColor,
  handleConfirm,
  editYn,
}) {
  const COLOR_OPTIONS_01 = [
    "#c18c8c",
    "#c1a68c",
    "#b8c18c",
    "#8cc1a7",
    "#8cc1c1",
    "#8cafc1",
    "#908cc1",
  ];
  const COLOR_OPTIONS_02 = [
    "#af8cc1",
    "#e1c668",
    "#c1c3c3",
    "#b0a581",
    "#e1af7b",
    "#d78979",
    "#e6e667",
  ];

  const onMaskClick = (e) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

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
            <StyledCloseIcon onClick={() => setOpen(false)} />
          </Header>
          <ColorWrap>
            <div>
              {COLOR_OPTIONS_01.map((d) => (
                <Color key={d} bg={d} onClick={() => setColor(d)}>
                  {color === d && <img src={CheckIcon} alt="" />}
                </Color>
              ))}
            </div>
            <div>
              {COLOR_OPTIONS_02.map((d) => (
                <Color key={d} bg={d} onClick={() => setColor(d)}>
                  {color === d && <img src={CheckIcon} alt="" />}
                </Color>
              ))}
            </div>
          </ColorWrap>
          <Content>
            <TextArea
              value={msg || ""}
              placeholder="메모를 입력해 주세요."
              onChange={(v) => setMsg(v.target.value)}
            />

            <div>
              {editYn ? (
                <BtnGroup>
                  <div
                    className="delBtn"
                    onClick={() => handleConfirm("delete")}
                  >
                    Delete
                  </div>
                  <div
                    className="saveBtn"
                    onClick={() => handleConfirm("update")}
                  >
                    Save
                  </div>
                </BtnGroup>
              ) : (
                <ConfirmBtn onClick={() => handleConfirm("create")}>
                  <img src={ConfirmIcon} alt="confirm" />
                  Confirm
                </ConfirmBtn>
              )}
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
  font-size: 24px;
  color: #000000;
  cursor: pointer;
`;

const Header = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  height: 300px;
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
