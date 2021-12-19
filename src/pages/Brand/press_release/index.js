import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useInfiniteQuery } from "react-query";
import { CircularProgress } from "@material-ui/core";

import PressReleaseTitle from "components/PressReleaseTitle";
import PressReleaseItems from "components/PressReleaseItems";
import useIntersectionObserver from "components/useIntersectionObserver";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";


/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentPressSelect } from "redux/state";


export default function PressRelease() {
 /*  const [season, setSeason] = useState({
    year: "",
    month: "",
  }); */
  const [season, setSeason] = useRecoilState(currentPressSelect);
  const handleChangeSelectbox = (year, month) => {
    setSeason({
      year: year,
      month: month,
    });
  };

  // list call
  const getPressList = ({ pageParam = 1 }) =>
    apiObject.getPressList({
      page: pageParam,
      limit: 10,
      year: season.year,
      month: season.month,
    });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery(["press-list", season.year, season.month], getPressList, {
      getNextPageParam: (lastPage) => lastPage.next_page ?? false,
    });

  const loadMoreButtonRef = useRef();

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const seasonData =
    status === "loading"
      ? []
      : data.pages[0].season_list.map((item) => ({
          year: item.year,
          month: item.month,
        }));

  console.log('season',season)
  if (status === "loading") {
    return <Progress type="load" />;
  }

  return (
    <MainContainer>
      <HeadWrap>
        <PressReleaseTitle
          value={season}
          searchOptions={seasonData}
          handleChange={handleChangeSelectbox}
        />
      </HeadWrap>
      <MainContents>
        {data.pages[0].total_count === 0 ? (
          <div style={{ marginLeft: "20px" }}>등록된 보도자료가 없습니다.</div>
        ) : (
          data.pages.map((group) =>
            group.list.map((d) => (
              <PressReleaseItems key={d.brand_press_no} data={d} isBrand={true} />
            ))
          )
        )}
      </MainContents>
      <ButtonDiv>
        <div ref={loadMoreButtonRef} onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? (
            <CircularProgress />
          ) : hasNextPage ? (
            "더보기"
          ) : (
            ""
          )}
        </div>
      </ButtonDiv>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "960px")};        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "640px")};    
  }  
`;
const HeadWrap = styled.div`
  margin-bottom: 34px;
`;

const MainContents = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin-left: -20px;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  font-size: 20px;
  cursor: pointer;
`;
