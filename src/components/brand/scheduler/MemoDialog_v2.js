import React, { useState, useEffect, useMemo } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import moment from "moment";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { apiObject } from "api/api_brand";

import SelectBox from "./MemoSelectBox";
import ConfirmIcon from "assets/check_icon_w.svg";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "assets/scheduler/CheckIcon.svg";
import Progress from "components/common/progress";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';

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

function MemoDialog({ open, setOpen, selectLook, selectDate, nowDt,thisLook }) {
  const [color, setColor] = useState("#c18c8c");
  const [msg, setMsg] = useState("");
  const [editYn, setEditYn] = useState(false);
  const [look, setLook] = useState(thisLook != null ? thisLook.showroom_no : null);
  const [date, setDate] = useState(null);
  const queryClient = useQueryClient();

  const onMaskClick = (e) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  const handleConfirm = (type) => {
    if (type === "create") {
      /* if (confirm("메모를 등록하시겠습니까?")) {
        const createMemoObj = {
          color: color,
          showroom_no: look,
          content: msg,
          date: date,
        };
        createMemo.mutate(createMemoObj);
      } */
      alertConfirm({
        title: Constants.appName,
        content: '메모를 등록하시겠습니까?',
        onOk: () => {
          const createMemoObj = {
            color: color,
            showroom_no: look,
            content: msg,
            date: date,
          };
          createMemo.mutate(createMemoObj);
        },
        onCancel: () => {console.log('cancel')}
      });
    } else if (type === "update") {
      /* if (confirm("메모를 변경하시겠습니까?")) {
        const updateMemoObj = {
          color: color,
          showroom_no: look,
          content: msg,
          date: date,
        };
        updateMemo.mutate(updateMemoObj);
      } */
      alertConfirm({
        title: Constants.appName,
        content: '메모를 변경하시겠습니까?',
        onOk: () => {
          const updateMemoObj = {
            color: color,
            showroom_no: look,
            content: msg,
            date: date,
          };
          updateMemo.mutate(updateMemoObj);
        },
        onCancel: () => {console.log('cancel')}
      });
    } else if (type === "delete") {
      /* if (confirm("메모를 삭제하시겠습니까?")) {
        deleteMemo.mutate();
      } */
      alertConfirm({
        title: Constants.appName,
        content: '메모를 삭제하시겠습니까?',
        onOk: () => {deleteMemo.mutate()},
        onCancel: () => {console.log('cancel')}
      });
    } else {
      console.log("Wrong type");
    }
  };

  const selectQuery = useQuery(
    ["brand", "scheduler", "week-memo", look, date],
    () =>
      apiObject.searchMemo({
        showroom_no: look,
        date: date,
      })
  );

  const selectMemo = useMemo(() =>
    selectQuery.isLoading ? null : selectQuery.data.memo
  );

  const createMemo = useMutation(
    (value) => apiObject.createMemo({ ...value }),
    {
      onSuccess: () => {
        utils.customAlert("메모가 등록되었습니다.");
        queryClient.invalidateQueries(["brand", "scheduler"]);
        setOpen(false);
        setMsg("");
        setLook(null);
        setDate(null);
      },
      onError: () => {
        utils.customAlert("메모 등록 중 오류가 발생했습니다.");
      },
    }
  );

  const updateMemo = useMutation(
    (value) => apiObject.createMemo({ ...value }),
    {
      onSuccess: () => {
        utils.customAlert("메모가 변경되었습니다.");
        queryClient.invalidateQueries(["brand", "scheduler"]);
        setOpen(false);
        setMsg("");
        setLook(null);
        setDate(null);
      },
      onError: () => {
        utils.customAlert("메모 변경 중 오류가 발생했습니다.");
      },
    }
  );

  const deleteMemo = useMutation(
    () => apiObject.deleteMemo({ memo_no: selectMemo.memo_no }),
    {
      onSuccess: () => {
        utils.customAlert("메모가 삭제되었습니다.");
        queryClient.invalidateQueries(["brand", "scheduler"]);
        setOpen(false);
        setMsg("");
        setLook(null);
        setDate(null);
      },
      onError: () => {
        utils.customAlert("메모 삭제 중 오루가 발생했습니다.");
      },
    }
  );

  useEffect(() => {
    look === null && setLook(selectLook[0].value);
    date === null && setDate(moment(nowDt).unix());
    if (msg === "" && selectMemo !== null) {
      setColor(selectMemo.color);
      setMsg(selectMemo.content);
      setEditYn(true);
    }
  }, [selectLook, selectDate, selectMemo]);

  if (selectQuery.isLoading) {
    return <Progress type="load" />;
  }

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
            <SelectWrap>
              <SelectBox
                value={look}
                setValue={setLook}
                opt={selectLook}
                width={"370px"}
              />
            </SelectWrap>
            <SelectWrap>
              <SelectBox
                value={date}
                setValue={setDate}
                opt={selectDate}
                width={"370px"}
              />
            </SelectWrap>
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
  text-transform: initial;

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

const SelectWrap = styled.div`
  display: flex;
  margin-bottom: 20px;
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

export default React.memo(MemoDialog);
