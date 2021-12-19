import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useMutation, useInfiniteQuery } from "react-query";
import { CircularProgress } from "@material-ui/core";

import PressReleaseTitle from "components/stylist/press_release/PressReleaseTitle";
import PressReleaseItems from "components/stylist/press_release/PressReleaseItems";
import BrandsDialog from "components/stylist/digital_showroom/BrandsDialog";
import useIntersectionObserver from "components/useIntersectionObserver";
import { apiObject } from "api/api_stylist";
import Progress from "components/common/progress";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentPressSelect } from "redux/state";

const HeadWrap = styled.div`
  margin-bottom: 34px;
`;

const MainContents = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin-left: -20px;
  @media (min-width: 1920px) {
    width: 1560px;   
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: 1040px; 
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 680px;
  }   
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  font-size: 20px;
  cursor: pointer;
`;

export default function PressRelease({ match }) {
  const BRAND_ID =
    match.params.brand_id === undefined ? null : match.params.brand_id;
  const [brandsDialogOpen, setBrandsDialogOpen] = useState(false);
  /* const [season, setSeason] = useState({
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

  const handleLikeClick = (no, dibs_yn) => {
    dibs_yn
      ? offFavPress.mutate({ brand_press_no: no })
      : onFavPress.mutate({ brand_press_no: no });
  };

  const handleBrandsBtn = () => {
    setBrandsDialogOpen(true);
  };

  // list call
  const getPressList = ({ pageParam = 1 }) =>
    apiObject.getPressList({
      page: pageParam,
      limit: 10,
      brand_id: BRAND_ID,
      req_month: season.month,
      req_year: season.year,
    });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery(
      ["press-list", BRAND_ID, season.year, season.month],
      getPressList,
      {
        getNextPageParam: (lastPage) => lastPage.next_page ?? false,
      }
    );

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

  const brand_list = status === "loading" ? [] : data.pages[0].brand_list;

  const current_brand_info =
    status === "loading" ? [] : data.pages[0].current_brand_info;

  const onFavPress = useMutation(
    (value) => apiObject.onFavPress({ brand_press_no: value.brand_press_no }),
    {
      onSuccess: () => {
        alert("즐겨찾기가 등록되었습니다.");
        getPressList.refetch();
      },
      // onError: () => {
      //   alert("즐겨찾기 등록 중 오류가 발생했습니다.");
      // },
    }
  );

  const offFavPress = useMutation(
    (value) => apiObject.offFavPress({ brand_press_no: value.brand_press_no }),
    {
      onSuccess: () => {
        alert("즐겨찾기가 해제되었습니다.");
        getPressList.refetch();
      },
      // onError: () => {
      //   alert("즐겨찾기 해제 중 오류가 발생했습니다.");
      // },
    }
  );

  if (status === "loading") {
    return <Progress type="load" />;
  }
  if (onFavPress.isLoading) {
    return <Progress type="upload" />;
  }
  if (offFavPress.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      <HeadWrap>
        <PressReleaseTitle
          value={season}
          searchOptions={seasonData}
          currentBrand={current_brand_info === null ? "" : current_brand_info}
          handleChange={handleChangeSelectbox}
          handleBrandsBtn={handleBrandsBtn}
        />
      </HeadWrap>
      <MainContents>
        {data.pages[0].total_count === 0 ? (
          <div style={{ marginLeft: "20px" }}>등록된 보도자료가 없습니다.</div>
        ) : (
          data.pages.map((group) =>
            group.list.map((d) => (
              <PressReleaseItems
                key={d.brand_press_no}
                data={d}
                handleLikeClick={handleLikeClick}
              />
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

      <BrandsDialog
        open={brandsDialogOpen}
        setOpen={setBrandsDialogOpen}
        data={brand_list}
        loc="press"
        currentData={current_brand_info === null ? "" : current_brand_info}
      />
    </>
  );
}
