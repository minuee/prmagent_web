import React, { useState, useCallback } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import dayjs from "dayjs";

import SearchIcon from "../assets/search.png";
import CheckBlankIcon from "../assets/table_blank_icon.png";
import CheckIcon from "../assets/table_check_icon.png";
import Pagination from "./Pagination";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeadWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 15px;
`;

const HeadLeft = styled.div`
  display: flex;
  margin-left: 5px;
`;

const AllCheckWrap = styled.div`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: solid 1px #dddddd;
  background-color: #f6f6f6;
  cursor: pointer;
  margin-right: 20px;
  transition: all 0.3s;

  &:hover {
    background-color: ${darken(0.1, "#f6f6f6")};
    border: solid 1px ${darken(0.1, "#dddddd")};
  }
`;

const DelBtn = styled.div`
  width: 72px;
  height: 42px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: solid 1px #dddddd;
  cursor: pointer;
  margin-right: 20px;
  transition: all 0.3s;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
  &:active {
    background-color: ${darken(0.2, "#ffffff")};
  }
`;

const SearchBox = styled.div`
  display: flex;
  float: right;
  border-radius: 5px;
  border: solid 1px #dddddd;
  width: 280px;
  height: 42px;
  box-sizing: border-box;
  border-radius: 10px;

  ${(props) =>
    props.focus
      ? css`
          background-color: ${darken(0.04, "#ffffff")};
        `
      : css``}
`;

const SearchInput = styled.input`
  width: 100%;
  border: none;
  background-color: #ffffff;
  border-radius: 10px;
  font-size: 14px;
  padding-left: 20px;

  :focus {
    outline: none;
    background-color: ${darken(0.04, "#ffffff")};
  }
`;

const SearchImgWrap = styled.div`
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Table = styled.table`
  border-spacing: 0;
  margin-bottom: 50px;
`;

const TheadTr = styled.tr`
  font-size: 14px;
  color: #555555;
  font-weight: 500;
  height: 50px;
  background-color: #eef4f8;
`;

const TheadTh = styled.th`
  border-bottom: 1px solid #dddddd;
  width: ${(props) => props.width || "auto"};
`;

const TheadDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const TBodyTr = styled.tr`
  text-align: center;
  height: 50px;
  font-size: 14px;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
`;

const LinkedTb = styled.td`
  cursor: pointer;
  text-align: left;
  text-indent: 20px;
`;

const StateWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const State = styled.div`
  width: 74px;
  height: 32px;
  border: solid 1px
    ${(props) => (props.theme === "brand" ? "#7ea1b2" : "#000000")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: ${(props) => (props.theme === "brand" ? "#7ea1b2" : "#000000")};

  ${(props) =>
    props.state &&
    css`
      ${props.theme === "brand"
        ? css`
            background-color: #7ea1b2;
            color: #ffffff;
          `
        : css`
            background-color: #000000;
            color: #ffffff;
          `}
    `}
`;

const CheckBoxTh = styled.th`
  width: 50px;
  border-bottom: 1px solid #dddddd;
`;

function QuestionTable({
  data,
  allCheck,
  setAllCheck,
  searchKeyword,
  handleSubmit,
  checked,
  handleChecked,
  handleDetail,
  theme = "brand",
  page,
  setPage,
  totalCount,
  setCheckedInit,
  handleDelete,
}) {
  const [onFocus, setOnFocus] = useState(false);

  const handleEnterPress = useCallback((e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  });

  return (
    <>
      <Container>
        <HeadWrap>
          <HeadLeft>
            <AllCheckWrap onClick={setAllCheck}>
              {allCheck ? (
                <img src={CheckIcon} alt="all_check" />
              ) : (
                <img src={CheckBlankIcon} alt="all_check" />
              )}
            </AllCheckWrap>
            <DelBtn onClick={handleDelete}>Delete</DelBtn>
            <SearchBox focus={onFocus} onKeyPress={handleEnterPress}>
              <SearchInput
                onFocus={() => setOnFocus(true)}
                onBlur={() => setOnFocus(false)}
                ref={searchKeyword}
                placeholder="검색"
              />
              <SearchImgWrap onClick={handleSubmit}>
                <img src={SearchIcon} alt="search" />
              </SearchImgWrap>
            </SearchBox>
          </HeadLeft>
        </HeadWrap>

        <Table>
          <thead>
            <TheadTr>
              <CheckBoxTh />
              <TheadTh width="60%">
                <TheadDiv>Title</TheadDiv>
              </TheadTh>
              <TheadTh>
                <TheadDiv>Date</TheadDiv>
              </TheadTh>
              <TheadTh>
                <TheadDiv>State</TheadDiv>
              </TheadTh>
            </TheadTr>
          </thead>
          <tbody>
            {totalCount === 0 ? (
              <TBodyTr>
                <td colSpan={4}>조회된 데이터가 없습니다.</td>
              </TBodyTr>
            ) : (
              data.map((d) => (
                <TBodyTr key={d.sys_inqry_no}>
                  <td>
                    <TheadDiv>
                      {checked.includes(d.sys_inqry_no) ? (
                        <img
                          src={CheckIcon}
                          alt="check"
                          onClick={() => handleChecked(d.sys_inqry_no)}
                        />
                      ) : (
                        <img
                          src={CheckBlankIcon}
                          alt="check"
                          onClick={() => handleChecked(d.sys_inqry_no)}
                        />
                      )}
                    </TheadDiv>
                  </td>
                  <LinkedTb onClick={() => handleDetail(d.sys_inqry_no)}>
                    {d.inqry_subj}
                  </LinkedTb>
                  <td>{dayjs.unix(d.inqry_dt).format("YYYY.MM.DD")}</td>
                  <td>
                    <StateWrap>
                      <State state={d.answer_yn} theme={theme}>
                        {d.answer_yn ? "답변 완료" : "답변 대기"}
                      </State>
                    </StateWrap>
                  </td>
                </TBodyTr>
              ))
            )}
          </tbody>
        </Table>
        <Pagination
          currentPage={page}
          setCurrentPage={setPage}
          pageSize={10}
          totalCount={totalCount}
          setCheckedInit={setCheckedInit}
        />
      </Container>
    </>
  );
}

export default React.memo(QuestionTable);
