import { apiObject } from "api/api_stylist";
import SimpleTable from "components/SimpleTable";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentPage,currentPageName } from "redux/state";

const Container = styled.div`
  display: flex;
  @media (min-width: 1920px) {
    width: 1480px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 950px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 600px
  }  
`;

const QuestionWrap = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 56px;
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
  const prefetchNoticeDetail = (notice_no) =>
    queryClient.prefetchQuery(
      ["notice", "detail", notice_no],
      () => apiObject.getNoticeDetail({ notice_no }),
      {
        staleTime: 10 * 1000,
      }
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

  const handleRowClick = (e, { original }) => {
    console.log(original);
    history.push(`${url}/${original.notice_no}`);
  };
  const handleRowHover = (e, { original }) => {
    prefetchNoticeDetail(original.notice_no);
  };

  return (
    <Container>
      <QuestionWrap>
        <Title>Notice</Title>
        <SimpleTable
          data={data}
          columns={columns}
          getHeaderProps={() => ({
            style: {
              backgroundColor: "#eef4f8",
              padding: "1em",
            },
          })}
          getCellProps={() => ({
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
        ></SimpleTable>
      </QuestionWrap>
    </Container>
  );
}
