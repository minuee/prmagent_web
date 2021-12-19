import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { useHistory } from "react-router-dom";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import dayjs from "dayjs";

import CheckBlankIcon from "assets/table_blank_icon.png";
import CheckIcon from "assets/table_check_icon.png";
import Pagination from "components/Pagination";
import CheckBlank from "assets/sample_check_blank.png";
import Checked from "assets/sample_check.png";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer,currentPage,currentPageName } from "redux/state";

import utils from "utils";

export default function SampleRequestTable({
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
  onFilter,
  setOnFilter,
  filter,
  setFilter,
  handleFilter,
  reqStatus,
  setReqStatus,
}) {
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(13);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  console.log('datadata',data)
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
          </HeadLeft>
        </HeadWrap>

        <Table>
          <thead>
            <TheadTr>
              <th></th>
              <th style={{ width: "50%" }}>
                <TheadDiv onClick={() => handleFilter(false, "brand")}>
                  브랜드
                  {filter.brand ? <ArrowDropUp /> : <ArrowDropDown />}
                </TheadDiv>
              </th>
              <th>
                <TheadDiv
                  onClick={() =>
                    handleFilter(!onFilter.shooting_dt, "shooting_dt")
                  }
                >
                  촬영일{(filter.shooting_dt ? <ArrowDropUp /> : <ArrowDropDown />)}
                </TheadDiv>
              </th>
              <th>
                <TheadDiv
                  onClick={() => handleFilter(!onFilter.req_dt, "req_dt")}
                >
                  요청일{(filter.req_dt ? <ArrowDropUp /> : <ArrowDropDown />)}
                </TheadDiv>
              </th>
              <th>
                <TheadDiv onClick={() => handleFilter(false, "req_status")}>
                  요청 진행 상황
                  {filter.req_status ? (
                    <>
                      <ArrowDropUp />
                      <SubMenu>
                        <Sub onClick={() => setReqStatus("All")}>
                          <CheckImg
                            src={reqStatus === "All" ? Checked : CheckBlank}
                            alt="check"
                          />
                          All
                        </Sub>
                        <Sub onClick={() => setReqStatus("pending")}>
                          <CheckImg
                            src={reqStatus === "pending" ? Checked : CheckBlank}
                            alt="check"
                          />
                          홀딩 대기
                        </Sub>
                        <Sub onClick={() => setReqStatus("confirmed")}>
                          <CheckImg
                            src={
                              reqStatus === "confirmed" ? Checked : CheckBlank
                            }
                            alt="check"
                          />
                          홀딩 완료
                        </Sub>
                        <Sub onClick={() => setReqStatus("canceled")}>
                          <CheckImg
                            src={
                              reqStatus === "canceled" ? Checked : CheckBlank
                            }
                            alt="check"
                          />
                          홀딩 취소
                        </Sub>
                      </SubMenu>
                    </>
                  ) : (
                    <ArrowDropDown />
                  )}
                </TheadDiv>
              </th>
            </TheadTr>
          </thead>
          <tbody>
            {totalCount === 0 ? (
              <TBodyTr>
                <td colSpan={5}>조회된 데이터가 없습니다.</td>
              </TBodyTr>
            ) : (
              data.map((d) => (
                <TBodyTr key={d.req_no}>
                  { d.req_status_nm == 'pending' ?
                  <td>
                    <TheadDiv>
                      {checked.includes(d.req_no) ? (
                        <img
                          src={CheckIcon}
                          alt="check"
                          onClick={() => handleChecked(d.req_no)}
                        />
                      ) : (
                        <img
                          src={CheckBlankIcon}
                          alt="check"
                          onClick={() => handleChecked(d.req_no)}
                        />
                      )}
                    </TheadDiv>
                  </td>
                  :
                  <td></td>
                  }
                  <LinkedTb onClick={() => handleDetail(d.req_no)}>
                    {d.brand_nm}
                  </LinkedTb>
                  <td>
                    {dayjs
                      .unix(d.expected_photograph_date)
                      .format("YYYY-MM-DD")}
                  </td>
                  <td>{dayjs.unix(d.req_dt).format("YYYY-MM-DD")}</td>
                  <td>
                      {utils.replaceStatus1(d.req_status_nm)}</td>
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



const Container = styled.div`
  display: flex;
  flex-direction: column;
  width:100%;
  padding-left:25px;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1200px" : "960px")};        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "600px")};    
  } 
`;

const HeadWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 15px;
`;

const HeadLeft = styled.div`
  width: 100%;
  display: flex;
  margin-left: 5px;
  justify-content: space-between;
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

const TheadDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
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
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`;

const SubMenu = styled.div`
  position: absolute;
  top: 36px;
  width: 148px;
  height: 144px;
  border: solid 1px #dddddd;
  padding: 15px 14px;
  background-color: #ffffff;
`;

const Sub = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: normal;
  color: #555555;
  height: 16px;
  cursor: pointer;

  &:hover {
    color: #000000;
  }

  & + & {
    margin-top: 16px;
  }
`;

const CheckImg = styled.img`
  margin-right: 5px;
`;
