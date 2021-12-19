import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useInfiniteQuery } from "react-query";
import { CircularProgress } from "@material-ui/core";
import dayjs from "dayjs";
import { useHistory } from "react-router-dom";

import { apiObject } from "api/api_stylist";
import Progress from "components/common/progress";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

export default function PickupSearch({ searchText, total, setTotal }) {
  const history = useHistory();
  const [cnt, setCnt] = useState(0);
  const getSearchList = ({ pageParam = 1 }) =>
    apiObject.getPickupSearch({ page: pageParam, search_text: searchText });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    ["main-search-stylist", "pickup", searchText],
    getSearchList,
    {
      getNextPageParam: (lastPage) => lastPage.next_page ?? false,
    }
  );
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  useEffect(() => {
    if (status !== "loading") {
      data.pages.map((d) => {
        if (d.pickup.length === 0) {
          setCnt(0);
        } else {
          setCnt(parseInt(d.pickup[0].total_count));
          setTotal({ ...total, pickup: parseInt(d.pickup[0].total_count) });
        }
      });
    }
  }, [data, status]);

  return (
    <Container>
      <Title>Pickups ({cnt})</Title>
      {status === "loading" ? (
        <Progress type="load" />
      ) : (
        <>
          {data.pages.map(
            (group, idx) =>
              group.pickup.length !== 0 && (
                <React.Fragment key={idx}>
                  <ItemWrap active={isdrawer}>
                    {group.pickup.map((d, i) => (
                      <Item
                        key={`${i}_items`}
                        onClick={() => history.push(`/stylist/pickup`)}
                        active={isdrawer}
                      >
                        <Img imgUrl={d.img_url_adres} />
                        <TextWrap active={isdrawer}>
                          <div className="title">{d.contact_user_nm}</div>
                          <div className="season">
                            {dayjs.unix(d.recpt_dt).format("YYYY-MM-DD")}
                            <span style={{ margin: "0 10px" }}>|</span>
                            {d.brand_nm}
                          </div>
                        </TextWrap>
                      </Item>
                    ))}
                  </ItemWrap>
                </React.Fragment>
              )
          )}

          <ButtonDiv>
            <div onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? (
                <CircularProgress />
              ) : hasNextPage ? (
                "더보기"
              ) : (
                ""
              )}
            </div>
          </ButtonDiv>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  font-size: 20px;
  cursor: pointer;
`;

const ItemWrap = styled.div`
  @media (min-width: 1920px) {
    display: flex;
    flex-wrap: wrap;
    width: ${(props) => (props.active ? "1870px" : "1400px")};
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    display: flex;
    flex-wrap: ${(props) => (props.active ? "wrap" : "wrap")};
    width: ${(props) => (props.active ? "1470px" : "1020px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {   
    display: ${(props) => (props.active ? "flex" : "relative")};     
    flex-wrap: ${(props) => (props.active ? "wrap" : "no-wrap")};
    width: ${(props) => (props.active ? "974px" : "600px")};
  } 
`;

const Item = styled.div`
  @media (min-width: 1920px) {
    display: flex;  
    min-width: 650px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    display: flex;
    width: ${(props) => (props.active ? "650px" : "480px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    display: flex;
    width: ${(props) => (props.active ? "460px" : "600px")};    
  } 
  margin-bottom: 20px;
  margin-right: 20px;
  box-sizing: border-box;
  border: solid 1px #ffffff;
  cursor: pointer;
  &:hover {
    background-color: #eeeeee;
    border: solid 1px #cccccc;
  }
`;

const Img = styled.div`
  min-width: 150px;
  min-height: 150px;
  border: solid 1px #dddddd;
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}") no-repeat center;
          background-size: contain;
          background-color: #e7e7e7;
        `
      : css`
          background-color: #dddddd;
        `}
`;

const TextWrap = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .title {
    font-size: 20px;
    font-weight: 500;
    @media (min-width: 1920px) {      
      min-width: 540px;
    }
    @media (min-width: 1440px) and (max-width: 1919px) {      
      width: ${(props) => (props.active ? "480px" : "310px")};
    }
    @media (min-width: 10px) and (max-width: 1439px) {      
      width: ${(props) => (props.active ? "300px" : "430px")};
    } 
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .season {
    font-size: 14px;
    font-weight: normal;
    color: #999999;
  }
`;
