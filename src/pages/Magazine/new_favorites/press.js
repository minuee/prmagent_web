import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import { useMutation, useInfiniteQuery } from "react-query";
import { CircularProgress } from "@material-ui/core";

import PressReleaseItems from "components/magazine/press_release/PressReleaseItems";
import BrandsDialog from "components/magazine/favorites/BrandsDialog";
import useIntersectionObserver from "components/useIntersectionObserver";
import { apiObject } from "api/api_magazine";
import Progress from "components/common/progress";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";

function FavPressRelease({ brandId, open, setOpen }) {
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const handleLikeClick = useCallback((no, dibs_yn) => {
    dibs_yn
      ? offFavPress.mutate({ brand_press_no: no })
      : onFavPress.mutate({ brand_press_no: no });
  });

  // list call
  const getPressList = useCallback(({ pageParam = 1 }) =>
    apiObject.getPressFavorites({
      page: pageParam,
      limit: 10,
      brand_id: brandId,
    })
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery(["fav-press-list", brandId], getPressList, {
    getNextPageParam: (lastPage) => lastPage.next_page ?? false,
  });

  const loadMoreButtonRef = useRef();

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const brand_list = status === "loading" ? [] : data.pages[0].brand_list;

  const current_brand_info =
    status === "loading" ? [] : data.pages[0].current_brand_info;

  const onFavPress = useMutation(
    (value) => apiObject.onFavPress({ brand_press_no: value.brand_press_no }),
    {
      onSuccess: () => {
        refetch({ refetchPage: (page, index) => index === 0 });
      },
      onError: () => {
        utils.customAlert("즐겨찾기 등록 중 오류가 발생했습니다.");
      },
      onSettled: () => {},
    }
  );

  const offFavPress = useMutation(
    (value) => apiObject.offFavPress({ brand_press_no: value.brand_press_no }),
    {
      onSuccess: () => {
        refetch({ refetchPage: (page, index) => index === 0 });
      },
      onError: () => {
        utils.customAlert("즐겨찾기 해제 중 오류가 발생했습니다.");
      },
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
      {brandId && <BrandTitle>{current_brand_info.brand_nm}</BrandTitle>}
      <MainContents active={isdrawer}>
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
      <ButtonDiv active={isdrawer}>
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
        open={open}
        setOpen={setOpen}
        data={brand_list}
        loc="press"
        currentData={current_brand_info === null ? "" : current_brand_info}
      />
    </>
  );
}

const MainContents = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin-left: -20px;
  width:100%;
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

const ButtonDiv = styled.div`
  display: flex;
  width:100%;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1200px" : "960px")};        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "600px")};    
  } 
  justify-content: center;
  margin-bottom: 40px;
  font-size: 20px;
  cursor: pointer;
`;

const BrandTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export default FavPressRelease;
