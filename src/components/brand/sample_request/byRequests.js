import React, { useState } from "react";
import styled from "styled-components";
import { useQuery } from "react-query";

import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
import { COMPANY_COLOR_LIST } from "mock/Mock";
import Pagination from "components/Pagination";

import SampleRequestTableList from "components/SampleRequestTableList";

const Container = styled.div`
  display: flex;
`;
 
const EContainer = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
`;
const Body = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #eef4f8;
`;

const List = styled.div`
  width: ${(props) => props.width || "auto"};
  margin: 0 20px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #555555;
`;

export default function ByRequest({ modelType }) {
  const [page, setPage] = useState(1);
  const requestsData = useQuery(
    ["requests-data", modelType, page],
    async () =>
      await apiObject.getRequests({
        model_type: modelType,
        page: page,
        limit: 5,
      })
  );

  const handleCheck = () => {};

  const data = requestsData.isLoading ? [] : requestsData.data.request_list;

  if (requestsData.isLoading) {
    return <Progress type="load" />;
  }
  return (
    <>
      <Container>
        <Body>
          <List width="10%">Logo</List>
          <List width="10%">Thumbnail</List>
          <List width="20%">Name</List>
          <List width="24%">Magazines</List>
          <List width="22%">Contact</List>
          <List width="10%">Date</List>
          <List width="4%"></List>
        </Body>
      </Container>
      {
      data.length === 0 ? (
        <EContainer>조회된 데이터가 없습니다.</EContainer>
      ) : (
      data.map((d, i) => (
        <SampleRequestTableList
          key={d.req_no}
          data={d}
          // circleColor={COMPANY_COLOR_LIST[i % 19]}
        />
      ))
      )
    }
      <div style={{ width: "100%", marginTop: "50px" }}>
        <Pagination
          currentPage={page}
          setCurrentPage={setPage}
          pageSize={5}
          totalCount={
            requestsData.isLoading ? 1 : requestsData.data.total_count
          }
          setCheckedInit={handleCheck}
        />
      </div>
    </>
  );
}
