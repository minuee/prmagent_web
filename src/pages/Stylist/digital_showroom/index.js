import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useMutation, useInfiniteQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

import DigitalShowroomTitle from "components/stylist/digital_showroom/DigitalShowroomTitle";
import DigitalShowroomItems from "components/stylist/digital_showroom/DigitalShowroomItems";
import useIntersectionObserver from "components/useIntersectionObserver";
import FilterDialog from "components/stylist/digital_showroom/FilterDialog";
import BrandsDialog from "components/stylist/digital_showroom/BrandsDialog";
import TemporarySaveDialog from "components/stylist/sample_requests/TemporarySaveDialog";
import { apiObject } from "api/api_stylist";
import Progress from "components/common/progress";
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer,currentShowRoomSelect } from "redux/state";

const TitleWrap = styled.div`
  margin-bottom: 60px;
`;

const ContensWrap = styled.div`
  margin-left: -20px;
`;

const ButtonDiv = styled.div`
  display: flex;
  @media (min-width: 1920px) {
    width: 1560px;   
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: 1040px; 
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 680px;
  }   
  justify-content: center;
  margin-bottom: 40px;
  font-size: 20px;
  cursor: pointer;
`;

export default function DigitalShowroom({ match }) {
  const history = useHistory();
  const BRAND_ID =
    match.params.brand_id === undefined ? null : match.params.brand_id;
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filterData, setFilterData] = useState({
    gender_list: [],
    category_list: [],
    color_list: [],
    material_list: [],
    size_list: [],
    in_yn: null,
    still_life_img_yn: null,
  });
  const [brandsDialogOpen, setBrandsDialogOpen] = useState(false);
  const [tempDialogOpen, setTempDialogOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [selectData, setSelectData] = useState([]);
  /* const [season, setSeason] = useState({
    season_year: "",
    season_cd_id: "",
    label: "",
  }); */
  const [season, setSeason] = useRecoilState(currentShowRoomSelect);

  const handleFilterBtn = () => {
    setFilterDialogOpen(true);
  };

  const handleBrandsBtn = () => {
    setBrandsDialogOpen(true);
    setSelect(false);
  };

  const handleSelectData = (no) => {
    setSelectData(
      selectData.includes(no)
        ? selectData.filter((d) => d !== no)
        : [...selectData, no]
    );
  };

  const handleSelectBtn = () => {
    setSelect(!select);
  };

  const handleCreateRequestSample = () => {
    let imsi = JSON.parse(localStorage.getItem("imsi"));

    if (imsi !== null && imsi.brand_id === current_brand_info.brand_id) {
      setTempDialogOpen(true);
    } else {
      let param = "";
      selectData.map((d, i) =>
        i === 0
          ? (param = d.showroom_no)
          : (param = param + "+" + d.showroom_no)
      );
      history.push(
        "/stylist/sample_requests/add/" +
          current_brand_info.brand_id +
          "=" +
          param
      );
    }
  };

  const handleMoveTemporarySave = () => {
    let imsi = JSON.parse(localStorage.getItem("imsi"));
    let showroomList = "";
    imsi.showroom_list.map((d, i) =>
      i === 0 ? (showroomList = d) : (showroomList = showroomList + "+" + d)
    );
    history.push(
      "/stylist/sample_requests/temporary/" +
        current_brand_info.brand_id +
        "=" +
        showroomList
    );
  };

  const handleMoveTemporaryCancel = () => {
    let param = "";
    selectData.map((d, i) =>
      i === 0 ? (param = d.showroom_no) : (param = param + "+" + d.showroom_no)
    );
    history.push(
      "/stylist/sample_requests/add/" +
        current_brand_info.brand_id +
        "=" +
        param
    );
  };

  const handleChangeSeason = (season_year, season_cd_id, label) => {
    setSeason({
      season_year: season_year,
      season_cd_id: season_cd_id,
      label: label,
    });
  };

  const handleFavShowroom = (act, no) => {
    if (act === "add") {
      setFavShowroom.mutate({ showroom_no: no });
    }

    if (act === "del") {
      delFavShowroom.mutate({ showroom_no: no });
    }
  };

  // list call
  const showroomListQuery = ({ pageParam = 1 }) =>
    apiObject.getShowroomList({
      page: pageParam,
      limit: 10,
      brand_id: BRAND_ID,
      season_year: season.season_year,
      season_cd_id: season.season_cd_id,
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
  } = useInfiniteQuery(
    [
      "showroom-list",
      BRAND_ID,
      season.season_year,
      season.season_cd_id,
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

  const season_list =
    status === "loading"
      ? []
      : data.pages[0].season_list.map((item) => ({
          season_year: item.season_year,
          season_cd_id: item.season_cd_id,
          label: item.season_year + " " + item.season_text,
        }));
  const current_brand_info =
    status === "loading" ? [] : data.pages[0].current_brand_info;
  const brand_list = status === "loading" ? [] : data.pages[0].brand_list;
  const brand_notice = status === "loading" ? [] : data.pages[0].brand_notice;

  const setFavShowroom = useMutation(
    ["fav-set-showroom"],
    (value) =>
      apiObject.setFavShowroom({
        showroom_no: value.showroom_no,
      }),
    {
      onSuccess: () => {
        showroomListQuery.refetch({});
      },
      onError: () => {
        alert("쇼룸 즐겨찾기 등록중 오류가 발생했습니다.");
      },
    }
  );

  const delFavShowroom = useMutation(
    ["fav-del-showroom"],
    (value) =>
      apiObject.delFavShowroom({
        showroom_no: value.showroom_no,
      }),
    {
      onSuccess: () => {
        showroomListQuery.refetch({});
      },
      onError: () => {
        alert("쇼룸 즐겨찾기 삭제중 오류가 발생했습니다.");
      },
    }
  );

  if (status === "loading") {
    return <Progress type="load" />;
  }

  if (setFavShowroom.isLoading) {
    return <Progress type="upload" />;
  }

  if (delFavShowroom.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      <TitleWrap>
        <DigitalShowroomTitle
          notice={brand_notice}
          handleBrandsBtn={handleBrandsBtn}
          handleSelectBtn={handleSelectBtn}
          handleFilterBtn={handleFilterBtn}
        />
      </TitleWrap>
      <ContensWrap>
        <DigitalShowroomItems
          data={data}
          seasonData={season_list}
          currentBrand={current_brand_info}
          brandNotice={brand_notice}
          select={select}
          selectData={selectData}
          season={season}
          handleSelectData={handleSelectData}
          handleCreate={handleCreateRequestSample}
          handleChangeSeason={handleChangeSeason}
          handleFavShowroom={handleFavShowroom}
        />
      </ContensWrap>
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

      <FilterDialog
        open={filterDialogOpen}
        setOpen={setFilterDialogOpen}
        filterData={filterData}
        setFilterData={setFilterData}
      />
      <BrandsDialog
        open={brandsDialogOpen}
        setOpen={setBrandsDialogOpen}
        data={brand_list}
        loc="showroom"
        currentData={current_brand_info}
      />
      <TemporarySaveDialog
        open={tempDialogOpen}
        setOpen={setTempDialogOpen}
        title="임시 저장 파일"
        subTitle="임시 저장된 샘플 요청 파일이 있습니다. 파일을 여시겠습니까?"
        handleConfirm={handleMoveTemporarySave}
        handleCancel={handleMoveTemporaryCancel}
      />
    </>
  );
}
