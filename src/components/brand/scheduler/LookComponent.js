import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { useMutation, useQueryClient } from "react-query";
import { apiObject } from "api/api_brand";

import MemoIconBlack from "assets/scheduler/memoIcon.svg";
import MemoDialog from "components/brand/scheduler/MemoDialog";
import Progress from "components/common/progress";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';

function LookComponent({ data, height }) {

  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const [color, setColor] = useState("#c18c8c");

  const handleConfirm = useCallback((type) => {
    if (type === "create") {
      /* if (confirm("메모를 등록하시겠습니까?")) {
        const memoCreateObj = {
          color: color,
          showroom_no: data.showroom_no,
          content: msg,
        };
        createMemo.mutate(memoCreateObj);
      } */
      alertConfirm({
        title: Constants.appName,
        content: '메모를 등록하시겠습니까?',
        onOk: () => {
          const memoCreateObj = {
            color: color,
            showroom_no: data.showroom_no,
            content: msg,
          };
          createMemo.mutate(memoCreateObj);
        },
        onCancel: () => {console.log('cancel')}
      });
    } else if (type === "update") {
      /* if (confirm("메모를 변경하시겠습니까?")) {
        const memoUpdateObj = {
          color: color,
          showroom_no: data.showroom_no,
          content: msg,
          memo_no: data?.memo_list?.[0]?.memo_no,
        };
        updateMemo.mutate(memoUpdateObj);
      } */
      alertConfirm({
        title: Constants.appName,
        content: '메모를 변경하시겠습니까?',
        onOk: () => {
          const memoUpdateObj = {
            color: color,
            showroom_no: data.showroom_no,
            content: msg,
            memo_no: data?.memo_list?.[0]?.memo_no,
          };
          updateMemo.mutate(memoUpdateObj);
        },
        onCancel: () => {console.log('cancel')}
      });
    } else if (type === "delete") {
      /* if (confirm("메모를 삭제하시겠습니까?")) {
        deleteMemo.mutate(data?.memo_list?.[0]?.memo_no);
      } */
      alertConfirm({
        title: Constants.appName,
        content: '메모를 삭제하시겠습니까?',
        onOk: () => {
          deleteMemo.mutate(data?.memo_list?.[0]?.memo_no);
        },
        onCancel: () => {console.log('cancel')}
      });
    } else {
      console.log("Wrong type");
    }
  });

  const createMemo = useMutation(
    (value) => apiObject.createMemo({ ...value }),
    {
      onSuccess: () => {
        utils.customAlert("메모가 등록되었습니다.");
        queryClient.invalidateQueries(["brand", "scheduler"]);
        setOpen(false);
      },
      onError: () => {
        utils.customAlert("메모 등록 중 오류가 발생했습니다.");
      },
    }
  );

  const updateMemo = useMutation(
    (value) => apiObject.updateMemo({ ...value }),
    {
      onSuccess: () => {
        utils.customAlert("메모가 변경되었습니다.");
        queryClient.invalidateQueries(["brand", "scheduler"]);
        setOpen(false);
      },
      onError: () => {
        utils.customAlert("메모 변경 중 오류가 발생했습니다.");
      },
    }
  );

  const deleteMemo = useMutation(
    (value) => apiObject.deleteMemo({ memo_no: value }),
    {
      onSuccess: () => {
        utils.customAlert("메모가 삭제되었습니다.");
        queryClient.invalidateQueries(["brand", "scheduler"]);
        setMsg(null);
        setOpen(false);
      },
      onError: () => {
        utils.customAlert("메모 삭제 중 발생했습니다.");
      },
    }
  );

  useEffect(() => {
    if (data.memo_list !== null) {
      setMsg(data.memo_list[0].content);
      setColor(data.memo_list[0].color);
    }
  }, [data]);

  if (createMemo.isLoading || updateMemo.isLoading || deleteMemo.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <Left height={height}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <LookImg imgUrl={data.images} active={isdrawer} />
        <LookNm>
          {data.showroom_nm}
          <div className="memo" onClick={() => setOpen(!open)}>
            <img src={MemoIconBlack} alt="memo" />
          </div>
        </LookNm>
        <LookMemo bColor={data.memo_list !== null && data.memo_list[0].color}>
          {data.memo_list !== null && data.memo_list[0].content}
        </LookMemo>
      </div>

      <MemoDialog
        open={open}
        setOpen={setOpen}
        msg={msg}
        setMsg={setMsg}
        color={color}
        setColor={setColor}
        handleConfirm={handleConfirm}
        editYn={data.memo_list === null ? false : true}
      />
    </Left>
  );
}

const Left = styled.div`
  display: flex;
  justify-content: center;  
  padding: 20px;
  height: ${(props) =>
    props.height <= 2 ? "550px" : props.height * 210 + 130 + "px"};
  box-sizing: border-box;
  & + & {
    border-top: solid 2px #dddddd;
  }
`;

const LookImg = styled.div`
  

  @media (min-width: 1920px) {
    width: 220px;height: 310px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 220px;height: 310px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "144px" : "144px")};
    height : ${(props) => (props.active ? "216px" : "216px")};
  } 

  margin-bottom: 20px;
  border: solid 1px #dddddd;
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}") no-repeat center;
          background-size: contain;
          background-color: #e7e7e7;
        `
      : css`
          background-color: #dddddd;
        `}
`;

const LookNm = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 20px;
  .memo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    margin-left: 20px;
    &:hover {
      background-color: ${darken(0.2, "#ffffff")};
    }
    &:active {
      background-color: ${darken(0.3, "#ffffff")};
    }
    > img {
    }
  }
`;

const LookMemo = styled.div`
  width: 158px;
  height: 83px;
  border-radius: 10px;
  border: solid 2px ${(props) => props.bColor || "#999999"};
  padding: 10px;
  overflow: auto;
`;

export default React.memo(LookComponent);
