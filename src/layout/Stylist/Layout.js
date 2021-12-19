import React from "react";
import styled from "styled-components";
import SideBar from "./SideBar";
import Header from "./Header";

const Container = styled.div`
  display: flex;
  background: #ffffff;
`;

const ContentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Main = styled.main`
  margin-top: 150px;
  margin-left: 380px;
  margin-right: 60px;
`;

export default function Layout({ children }) {
  return (
    <>
      <Container>
        <SideBar />
        <ContentsContainer>
          <Header />
          <Main>{children}</Main>
        </ContentsContainer>
      </Container>
    </>
  );
}
