import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useRecoilState } from "recoil";
import LookbookTable from "components/LookbookTable";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
import { currentPage,currentPageName } from "../../../redux/state";
import utils from "utils";
import Constants from '../../../utils/constants';
import alertConfirm from 'react-alert-confirm';

const TitleTxt = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-bottom: 30px;
  width:calc(100%-25px);
  margin-left:25px;
`;

export default function LookBook(props) {
  const history = useHistory();

  const [allCheck, setAllCheck] = useState(false);
  const [checked, setChecked] = useState([]);
  //const [page, setPage] = useState(1);
  const [page, setPage] = useRecoilState(currentPage);
  const [pageName, setPageName] = useRecoilState(currentPageName);
  
  if( props.location.pathname !== pageName ) {
      setPage(1);
      setPageName(props.location.pathname)
  }
  const [searchKeyword, setSearchKeyword] = useState("");

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
        allValue.push(d.lookbook_no);
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
    history.push("/brand/lookbook/detail/" + no);
  };

  const handleSubmit = (e) => {
    setPage(1);
    setSearchKeyword(e.target.value);
    setAllCheck(false);
    lookbookListQuery.refetch({});
  };

  const handleDelete = () => {
    /* if (confirm("해당 룩북을 삭제하시겠습니까?")) {
      delLookbook.mutate();
    } */
    if ( checked.length == 0 ) {
      utils.customAlert('삭제할 룩북을 선택하세요');
      return;
    }else{
      alertConfirm({
        title: Constants.appName,
        content: '해당 룩북을 삭제하시겠습니까?',
        onOk: () => {delLookbook.mutate()},
        onCancel: () => {console.log('cancel')}
      });
    }
  };

  // list call
  const lookbookListQuery = useQuery(
    ["lookbook-list", page, searchKeyword],
    async () =>
      await apiObject.getLookbook({
        page,
        limit: 10,
        search_text: searchKeyword,
      }),
    { keepPreviousData: true }
  );

  const data = useMemo(
    () => (lookbookListQuery.isLoading ? [] : lookbookListQuery.data.list),
    [lookbookListQuery.data, page, searchKeyword]
  );

  // del list
  const delLookbook = useMutation(
    () =>
      apiObject.delLookbook(
        {
          lookbook_no_list: checked,
        },
        () => {}
      ),
    {
      onSuccess: () => {
        utils.customAlert("삭제 완료되었습니다.");
      },
      onError: () => {
        utils.customAlert("삭제 중 오류가 발생했습니다.");
      },
      onSettled: () => {
        lookbookListQuery.refetch({});
      },
    }
  );

  if (lookbookListQuery.isLoading) {
    return <Progress type="load" />;
  }

  if (delLookbook.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      <TitleTxt>LookBook</TitleTxt>
      <LookbookTable
        data={data}
        allCheck={allCheck}
        setAllCheck={handleAllChecked}
        checked={checked}
        handleChecked={handleChecked}
        handleDetail={handleDetail}
        page={page}
        setPage={setPage}
        totalCount={
          lookbookListQuery.isLoading ? 1 : lookbookListQuery.data.total_count
        }
        setCheckedInit={handleCheckedInit}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
      />
    </>
  );
}
