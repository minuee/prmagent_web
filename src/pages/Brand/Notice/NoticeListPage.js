import { apiObject } from "api/api_brand";
import SimpleTable from "components/SimpleTable";
import dayjs from "dayjs";
import React, { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";


import Constants from '../../../utils/constants';

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentPage,currentPageName } from "redux/state";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width:calc(100%-25px);
  margin-left:25px;
`;

const QuestionWrap = styled.div`
  width: 100%;  
`;

const Title = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  margin-bottom: 36px;
`;

const TBodyTr = styled.tr`
  text-align: center;
  height: 50px;
  font-size: 14px;
`;


export default function NoticePage(props) {
  //const [page, setPage] = useState(1);
  const [page, setPage] = useRecoilState(currentPage);
  const [pageName, setPageName] = useRecoilState(currentPageName);
  
  if( props.location.pathname !== pageName ) {
      setPage(1);
      setPageName(props.location.pathname)
  }


  const noticeQuery = useQuery(["notice", page], () =>
    apiObject.getNoticeList({ page })
  );
  const history = useHistory();
  let { url } = useRouteMatch();
  const queryClient = useQueryClient();

  const prefetchNoticeDetail = useCallback((notice_no) =>
    queryClient.prefetchQuery(
      ["notice", "detail", notice_no],
      () => apiObject.getNoticeDetail({ notice_no }),
      {
        staleTime: 10 * 1000,
      }
    )
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
        style: {
          width: "12%",
        },
      },
      {
        Header: "Date",
        accessor: "date",
      },
    ],
    []
  );
  const data = React.useMemo(
    () =>
      noticeQuery.isLoading
        ? []
        : noticeQuery.data.list.map((d) => ({
            ...d,
            date: dayjs.unix(d.reg_dt).format("YYYY-MM-DD"),
          })),
    [noticeQuery.data, page]
  );
  const handleRowClick = useCallback((e, { original }) => {
    console.log(original);
    history.push(`${url}/${original.notice_no}`);
  });
  const handleRowHover = useCallback((e, { original }) => {
    prefetchNoticeDetail(original.notice_no);
  });
  return (
    <Container>
      <QuestionWrap>
        <Title>Notice</Title>
        {data.length === 0 ?
          <TBodyTr>
            조회된 공지사항이 없습니다.
          </TBodyTr>
          :
          <SimpleTable
            data={data}
            columns={columns}
            getHeaderProps={(column) => ({
              style: {
                backgroundColor: "#eef4f8",
                padding: "1em",
              },
            })}
            getCellProps={(row) => ({
              style: {
                padding: "1em",
              },
            })}
            page={page}
            setPage={setPage}
            pageCount={
              noticeQuery.isLoading
                ? 1
                : Math.ceil(noticeQuery.data.total_count / 10)
            }
            onRowClick={handleRowClick}
            onRowHover={handleRowHover}
          />          
        }
      </QuestionWrap>
    </Container>
  );
}
