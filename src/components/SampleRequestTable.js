import React, { useState } from "react";
import styled from "styled-components";

import Pagination from "./Pagination";
import SampleRequestTableList from "./SampleRequestTableList";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const DataWrap = styled.div``;

const Header = styled.div`
  height: 50px;
  background-color: #eef4f8;
  display: flex;
  align-items: center;
  margin-right: 30px;
`;

const List = styled.div`
  width: ${(props) => props.width || "auto"};
  margin: 0 20px;
  font-size: 14px;
  font-weight: ${(props) => props.weight || "normal"};
  text-align: center;
`;

export default function SampleRequestTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <Container>
        <DataWrap>
          <Header>
            <List width="10%" weight="500">
              Logo
            </List>
            <List width="10%" weight="500">
              Thumbnail
            </List>
            <List width="20%" weight="500">
              Name
            </List>
            <List width="36%" weight="500">
              Magazines
            </List>
            <List width="12%" weight="500">
              Contact
            </List>
            <List width="8%" weight="500">
              Date
            </List>
            <List width="4%"></List>
          </Header>
          {data.map((d) => (
            <SampleRequestTableList data={d} key={d.request_no} />
          ))}
        </DataWrap>
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={10}
          totalCount={60}
        />
      </Container>
    </>
  );
}
