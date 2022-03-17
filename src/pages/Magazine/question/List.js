import React, { useState } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "react-query";
import { useHistory } from "react-router-dom";

import QuestionTable from "components/QuestionTable";
import { apiObject } from "api/api_magazine";
import Progress from "components/common/progress";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer,currentQuestionPage } from "redux/state";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';

const Container = styled.div`
  padding-top: 12px;
  width: 100%;
`;

export default function QuestionList() {
  const history = useHistory();
  const [allCheck, setAllCheck] = useState(false);
  const [checked, setChecked] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useRecoilState(currentQuestionPage);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const handleChecked = (idx) => {
    setChecked(
      checked.includes(idx)
        ? checked.filter((c) => c !== idx)
        : [...checked, idx]
    );
  };

  const handleAllChecked = () => {
    if (allCheck) {
      setChecked([]);
      setAllCheck(false);
    } else {
      let allValue = [];
      data.forEach((d) => {
        allValue.push(d.sys_inqry_no);
      });
      setChecked(allValue);
      setAllCheck(true);
    }
  };

  const handleCheckedInit = () => {
    setAllCheck(false);
    setChecked([]);
  };

  const handleDetail = (no) => {
    history.push("/magazine/question/" + no);
  };

  const handleSubmit = (e) => {
    setPage(1);
    setSearchKeyword(e.target.value);
    setAllCheck(false);
    qna_list.refetch({});
  };

  const handleDelete = () => {
    /* if (confirm("문의내역을 삭제하시겠습니까?")) {
      delQna.mutate();
    } */

    alertConfirm({
      title: Constants.appName,
      content: '문의내역을 삭제하시겠습니까?',
      onOk: () => {
        delQna.mutate()
      },
      onCancel: () => {console.log('cancel')}
    });
  };

  // List call
  const qna_list = useQuery(
    ["qna", page, searchKeyword],
    async () =>
      await apiObject.getQnaList({
        page,
        limit: 10,
        search_text: searchKeyword,
      }),
    { keepPreviousData: true }
  );

  const data = qna_list.isLoading ? [] : qna_list.data.list;

  // qnd delete
  const delQna = useMutation(
    ["qna-delete"],
    () =>
      apiObject.delQna(
        {
          del_list: checked,
        },
        () => {}
      ),
    {
      onSuccess: () => {
        utils.customAlert("삭제 성공!");
        qna_list.refetch({});
      },
      onError: () => {
        utils.customAlert("삭제중 오류가 발생했습니다.");
      },
    }
  );

  if (qna_list.isLoading) {
    return <Progress type="load" />;
  }

  if (delQna.isLoading) {
    return <Progress type="upload" />;
  }

  return (    
    <Container active={isdrawer}>
      <QuestionTable
        data={data}
        allCheck={allCheck}
        setAllCheck={handleAllChecked}
        checked={checked}
        handleChecked={handleChecked}
        handleDetail={handleDetail}
        theme="magazine"
        page={page}
        setPage={setPage}
        totalCount={qna_list.isLoading ? 1 : qna_list.data.total_count}
        handleSubmit={handleSubmit}
        setCheckedInit={handleCheckedInit}
        handleDelete={handleDelete}
      />
    </Container>
  );
}
