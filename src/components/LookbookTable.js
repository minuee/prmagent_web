import React, { useState } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { useHistory } from "react-router-dom";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import dayjs from "dayjs";

import SearchIcon from "../assets/search.png";
import BookIcon from "../assets/book_icon.png";
import CheckBlankIcon from "../assets/table_blank_icon.png";
import CheckIcon from "../assets/table_check_icon.png";
import Pagination from "./Pagination";


/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "../redux/state";



const Container = styled.div`
  display: flex;
  flex-direction: column;
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "960px")};        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "600px")};    
  } 
  
`;

const HeadWrap = styled.div`
  display: flex;
  width: 96%;
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

const LookbookBtn = styled.div`
  width: 136px;
  height: 42px;
  border-radius: 5px;
  border: solid 1px #dddddd;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
  &:active {
    background-color: ${darken(0.2, "#ffffff")};
  }
`;

const LookbookIcon = styled.div`
  align-items: center;
  display: flex;
  margin-right: 7.8px;
`;

const Table = styled.table`
  border-spacing: 0;
  margin-bottom: 50px;
  width: 96%;
`;

const TheadTr = styled.tr`
  font-size: 14px;
  color: #555555;
  font-weight: 500;
  height: 50px;
  background-color: #eef4f8;
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
  &:hover {
    text-decoration: underline;
  }
`;

export default function LookbookTable({
  data,
  allCheck,
  setAllCheck,
  searchKeyword,
  handleSubmit,
  checked,
  handleChecked,
  handleDetail,
  page,
  setPage,
  totalCount,
  setCheckedInit,
  handleDelete,
}) {
  const history = useHistory();
  const [onFocus, setOnFocus] = useState(false);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer); 
  // const [currentPage, setCurrentPage] = useState(13);
  const [sortData, setSortData] = useState({
    lookbook_nm: false,
    season: false,
    gender: false,
    date_created: false,
    made_for: false,
  });

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleLookbookBtn = () => {
    history.push("/brand/lookbook/select");
  };

  const handleSort = (n) => {
    if (n === "lookbook_nm") {
      setSortData({
        lookbook_nm: !sortData.lookbook_nm,
        season: false,
        gender: false,
        date_created: false,
        made_for: false,
      });
      data.sort(function (a, b) {
        const upperCaseA = a.lookbook_nm.toUpperCase();
        const upperCaseB = b.lookbook_nm.toUpperCase();
        if (sortData.lookbook_nm) {
          if (upperCaseA < upperCaseB) return 1;
          if (upperCaseA > upperCaseB) return -1;
          if (upperCaseA === upperCaseB) return 0;
        } else {
          if (upperCaseB < upperCaseA) return 1;
          if (upperCaseB > upperCaseA) return -1;
          if (upperCaseB === upperCaseA) return 0;
        }
      });
    } else if (n === "season") {
      setSortData({
        lookbook_nm: false,
        season: !sortData.season,
        gender: false,
        date_created: false,
        made_for: false,
      });
      data.sort(function (a, b) {
        const upperCaseA = a.season.toUpperCase();
        const upperCaseB = b.season.toUpperCase();
        if (sortData.season) {
          if (upperCaseA < upperCaseB) return 1;
          if (upperCaseA > upperCaseB) return -1;
          if (upperCaseA === upperCaseB) return 0;
        } else {
          if (upperCaseB < upperCaseA) return 1;
          if (upperCaseB > upperCaseA) return -1;
          if (upperCaseB === upperCaseA) return 0;
        }
      });
    } else if (n === "gender") {
      setSortData({
        lookbook_nm: false,
        season: false,
        gender: !sortData.gender,
        date_created: false,
        made_for: false,
      });
      data.sort(function (a, b) {
        const upperCaseA = a.gender.toUpperCase();
        const upperCaseB = b.gender.toUpperCase();
        if (sortData.gender) {
          if (upperCaseA < upperCaseB) return 1;
          if (upperCaseA > upperCaseB) return -1;
          if (upperCaseA === upperCaseB) return 0;
        } else {
          if (upperCaseB < upperCaseA) return 1;
          if (upperCaseB > upperCaseA) return -1;
          if (upperCaseB === upperCaseA) return 0;
        }
      });
    } else if (n === "date_created") {
      setSortData({
        lookbook_nm: false,
        season: false,
        gender: false,
        date_created: !sortData.date_created,
        made_for: false,
      });
      data.sort(function (a, b) {
        if (sortData.date_created) {
          return b.date_created - a.date_created;
        } else {
          return a.date_created - b.date_created;
        }
      });
    } else if (n === "made_for") {
      setSortData({
        lookbook_nm: false,
        season: false,
        gender: false,
        date_created: false,
        made_for: !sortData.made_for,
      });
      data.sort(function (a, b) {
        const upperCaseA = a.made_for.toUpperCase();
        const upperCaseB = b.made_for.toUpperCase();
        if (sortData.made_for) {
          if (upperCaseA < upperCaseB) return 1;
          if (upperCaseA > upperCaseB) return -1;
          if (upperCaseA === upperCaseB) return 0;
        } else {
          if (upperCaseB < upperCaseA) return 1;
          if (upperCaseB > upperCaseA) return -1;
          if (upperCaseB === upperCaseA) return 0;
        }
      });
    } else {
      console.log("Wrong data");
    }
  };

  return (
    <>
      <Container active={isdrawer}>
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
                placeholder="Made For/Lookbook 검색"
              />
              <SearchImgWrap onClick={handleSubmit}>
                <img src={SearchIcon} alt="search" />
              </SearchImgWrap>
            </SearchBox>
          </HeadLeft>
          
          <LookbookBtn onClick={handleLookbookBtn}>
            <LookbookIcon>
              <img src={BookIcon} alt="lookbook" />
            </LookbookIcon>
            <div>룩북 생성</div>
          </LookbookBtn>
          
        </HeadWrap>

        <Table>
          <thead>
            <TheadTr>
              <th></th>
              <th>
                <TheadDiv onClick={() => handleSort("lookbook_nm")}>
                  LookBook Name
                  {sortData.lookbook_nm ? <ArrowDropUp /> : <ArrowDropDown />}
                </TheadDiv>
              </th>
              <th>
                <TheadDiv onClick={() => handleSort("season")}>
                  Season
                  {sortData.season ? <ArrowDropUp /> : <ArrowDropDown />}
                </TheadDiv>
              </th>
              <th>
                <TheadDiv onClick={() => handleSort("gender")}>
                  Gender
                  {sortData.gender ? <ArrowDropUp /> : <ArrowDropDown />}
                </TheadDiv>
              </th>
              <th>
                <TheadDiv onClick={() => handleSort("made_for")}>
                  받는 분
                  {sortData.made_for ? <ArrowDropUp /> : <ArrowDropDown />}
                </TheadDiv>
              </th>
              <th>
                <TheadDiv onClick={() => handleSort("date_created")}>
                  생성일
                  {sortData.date_created ? <ArrowDropUp /> : <ArrowDropDown />}
                </TheadDiv>
              </th>
            </TheadTr>
          </thead>
          <tbody>
            {totalCount > 0 ? (
              data.map((d) => (
                <TBodyTr key={d.lookbook_no}>
                  <td>
                    <TheadDiv>
                      {checked.includes(d.lookbook_no) ? (
                        <img
                          src={CheckIcon}
                          alt="check"
                          onClick={() => handleChecked(d.lookbook_no)}
                        />
                      ) : (
                        <img
                          src={CheckBlankIcon}
                          alt="check"
                          onClick={() => handleChecked(d.lookbook_no)}
                        />
                      )}
                    </TheadDiv>
                  </td>
                  <LinkedTb onClick={() => handleDetail(d.lookbook_no)}>
                    <b>{d.lookbook_nm}</b>
                  </LinkedTb>
                  <td>{d.season}</td>
                  <td>{d.gender}</td>
                  <td>{d.made_for || "-"}</td>
                  <td>{dayjs.unix(d.date_created).format("YYYY-MM-DD")}</td>
                </TBodyTr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "20px 0" }}
                >
                  조회된 데이터가 없습니다.
                </td>
              </tr>
            )}
            {}
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
