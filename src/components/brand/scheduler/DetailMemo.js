import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useMutation, useQueryClient } from "react-query";
import { apiObject } from "api/api_brand";
import moment from "moment";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';

import MemoDialog from "./MemoDialog";

function DetailMemo({ data }) {
  const [msg, setMsg] = useState();
  const [color, setColor] = useState("#c18c8c");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleConfirm = useCallback((type) => {
    if (type === "update") {
      /* if (confirm("메모를 변경하시겠습니까?")) {
        const memoUpdateObj = {
          color: color,
          showroom_no: data.showroom_no,
          content: msg,
          date: data.memo_dt,
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
            date: data.memo_dt,
          };
          updateMemo.mutate(memoUpdateObj);
        },
        onCancel: () => {console.log('cancel')}
      });
    } else if (type === "delete") {
      /* if (confirm("메모를 삭제하시겠습니까?")) {
        deleteMemo.mutate(data.memo_no);
      } */
      alertConfirm({
        title: Constants.appName,
        content: '메모를 삭제하시겠습니까?',
        onOk: () => {
          deleteMemo.mutate(data.memo_no);
        },
        onCancel: () => {console.log('cancel')}
      });
    } else {
      console.log("Wrong type");
    }
  });

  const updateMemo = useMutation(
    (value) => apiObject.createMemo({ ...value }),
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
    setMsg(data.content);
    setColor(data.color);
  }, [data]);

  return (
    <>
      <Memo
        bColor={data.color || "#999999"}
        onClick={(e) => {
          setOpen(!open), e.stopPropagation();
        }}
      >
        <div className="date">
          {moment.unix(data.memo_dt).locale("en").format("M/D (ddd)")}
        </div>
        {data.content}
      </Memo>

      <MemoDialog
        open={open}
        setOpen={setOpen}
        msg={msg}
        setMsg={setMsg}
        color={color}
        setColor={setColor}
        handleConfirm={handleConfirm}
        editYn={true}
      />
    </>
  );
}

const Memo = styled.div`
  width: 96%;
  height: 90px;
  border-radius: 10px;
  border: solid 2px ${(props) => props.bColor || "#999999"};
  margin-left : 2%;
  margin-right : 2%;  
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
  cursor: pointer;
  .date {
    text-transform: uppercase;
    font-size: 12px;
    margin-bottom: 2px;
  }
`;

export default React.memo(DetailMemo);
