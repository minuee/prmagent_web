import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { useMutation, useInfiniteQuery } from "react-query";
import { CircularProgress } from "@material-ui/core";
import { apiObject } from "api/api_magazine";

import useIntersectionObserver from "components/useIntersectionObserver";
import FavShowroomItems from "components/stylist/favorites/ShowroomItems";
import FilterDialog from "components/stylist/digital_showroom/FilterDialog";
import BrandsDialog from "components/stylist/favorites/BrandsDialog";
import Progress from "components/common/progress";
import { isEmpty } from "lodash";

function FavoriteShowroom({
  brandId,
  brandOpen,
  setBrandOpen,
  filterOpen,
  setFilterOpen,
  filterData,
  setFilterData,
}) {
  const handleLikeClick = useCallback((no) => {
    delFavShowroom.mutate({ showroom_no: no });
  });

  // list call
  const showroomListQuery = ({ pageParam = 1 }) =>
    apiObject.getFavorites({
      page: pageParam,
      limit: 10,
      brand_id: brandId,
      gender_list: filterData.gender_list,
      category_list: filterData.category_list,
      color_list: filterData.color_list,
      size_list: filterData.size_list,
      wrhousng_yn: filterData.in_yn,
      still_life_img_yn: filterData.still_life_img_yn,
      material_list: filterData.material_list,
    });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery(
    [
      "fav-showroom-list",
      brandId,
      filterData.gender_list,
      filterData.category_list,
      filterData.color_list,
      filterData.size_list,
      filterData.in_yn,
      filterData.still_life_img_yn,
      filterData.material_list,
    ],
    showroomListQuery,
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

  const current_brand_info =
    status === "loading" ? [] : data?.pages[0].current_brand_info;
  const brand_list = status === "loading" ? [] : !isEmpty(data?.pages[0].brand_list) ? data.pages[0].brand_list : [];

  const delFavShowroom = useMutation(
    ["fav-del-showroom"],
    (value) =>
      apiObject.delFavShowroom({
        showroom_no: value.showroom_no,
      }),
    {
      onSuccess: () => {
        refetch({ refetchPage: (page, index) => index === 0 });
      },
      onError: () => {
        alert("쇼룸 즐겨찾기 삭제중 오류가 발생했습니다.");
      },
    }
  );

  if (status === "loading") {
    return <Progress type="load" />;
  }

  if (delFavShowroom.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      {brandId && <BrandTitle>{current_brand_info.brand_nm}</BrandTitle>}
      <MainContents>
        {data?.pages[0].total_count === 0 ? (
          <div style={{ marginLeft: "20px" }}>등록된 보도자료가 없습니다.</div>
        ) : (
          data?.pages.map((group) =>
            group.list.map((d) => (
              <FavShowroomItems
                key={d.showroom_no}
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
        open={brandOpen}
        setOpen={setBrandOpen}
        data={brand_list}
        loc="show"
        currentData={current_brand_info === null ? "" : current_brand_info}
      />
      <FilterDialog
        open={filterOpen}
        setOpen={setFilterOpen}
        filterData={filterData}
        setFilterData={setFilterData}
      />
    </>
  );
}

const BrandTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const MainContents = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (min-width: 1920px) {
    width: 1480px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 950px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 600px
  }  
  position: relative;
  margin-left: -20px;
`;

const ButtonDiv = styled.div`
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
  justify-content: center;
  margin-bottom: 40px;
  font-size: 20px;
  cursor: pointer;
`;

export default FavoriteShowroom;
