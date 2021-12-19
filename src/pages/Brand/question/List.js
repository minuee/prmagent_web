import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "react-query";
import { useHistory } from "react-router-dom";

import QuestionTable from "components/QuestionTable";
import Progress from "components/common/progress";
import { apiObject } from "api/api_brand";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentQuestionPage } from "redux/state";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';

const Container = styled.div`
  padding-top: 12px;
`;

export default function QuestionList(props) {
  const history = useHistory();
  const [allCheck, setAllCheck] = useState(false);
  const [checked, setChecked] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  //const [page, setPage] = useState(1);
  const [page, setPage] = useRecoilState(currentQuestionPage);
   
  const handleChecked = useCallback(
  (idx) => {
    setChecked(
      checked.includes(idx)
        ? checked.filter((c) => c !== idx)
        : [...checked, idx]
    );
  },
  [checked]
);

  const handleAllChecked = useCallback(() => {
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
  }, [checked, allCheck]);

  const handleCheckedInit = useCallback(() => {
    setAllCheck(false);
    setChecked([]);
  }, [checked, allCheck]);

  const handleDetail = useCallback((no) => {
    history.push("/brand/question/" + no);
  });

  const handleSubmit = useCallback(
    (e) => {
      setPage(1);
      setSearchKeyword(e.target.value);
      setAllCheck(false);
      qna_list.refetch({});
    },
    [page, searchKeyword, allCheck]
  );

  const handleDelete = useCallback(() => {
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
  });

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

  // qna delete
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
        utils.customAlert("삭제되었습니다.");
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
    <>
      <Container>
        <QuestionTable
          data={data}
          allCheck={allCheck}
          setAllCheck={handleAllChecked}
          checked={checked}
          handleChecked={handleChecked}
          handleDetail={handleDetail}
          page={page}
          setPage={setPage}
          totalCount={qna_list.isLoading ? 1 : qna_list.data.total_count}
          handleSubmit={handleSubmit}
          setCheckedInit={handleCheckedInit}
          handleDelete={handleDelete}
        />
      </Container>
    </>
  );
}
