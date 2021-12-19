import React, { useState } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "react-query";

import DigitalShowroomTitle from "components/stylist/digital_showroom/DigitalShowroomTitle";
import DigitalShowroomItems from "components/stylist/digital_showroom/DigitalShowroomItems";
import CreateRequestSample from "components/stylist/digital_showroom/CreateRequestSample";
import FilterDialog from "components/stylist/digital_showroom/FilterDialog";
import BrandsDialog from "components/stylist/digital_showroom/BrandsDialog";
import { apiObject } from "api/api_stylist";
import Progress from "components/common/progress";

const TitleWrap = styled.div`
  margin-bottom: 60px;
`;

const ContensWrap = styled.div`
  margin-left: -20px;
`;

export default function DigitalShowroom() {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [brandsDialogOpen, setBrandsDialogOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [selectData, setSelectData] = useState([]);
  const [createRequestSample, setCreateRequestSample] = useState(false);
  const [page, setPage] = useState(1);
  const [brandId, setBrandId] = useState(null);
  const [season, setSeason] = useState({
    season_year: "",
    season_cd_id: "",
    label: "",
  });

  const handleFilterBtn = () => {
    setFilterDialogOpen(true);
  };

  const handleBrandsBtn = () => {
    setBrandsDialogOpen(true);
  };

  const handleSelectData = (no) => {
    console.log("CHECK");
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
    setCreateRequestSample(true);
  };

  const handleSetBrand = (id) => {
    setBrandId(id);
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

  const handleCancel = () => {};

  const handleCreate = () => {};

  // list call
  const showroomListQuery = useQuery(
    ["shoroom-list", page, brandId, season.season_year, season.season_cd_id],
    async () =>
      await apiObject.getShowroomList({
        page,
        limit: 10,
        brand_id: brandId,
        season_year: season.season_year,
        season_cd_id: season.season_cd_id,
      })
  );

  const data = showroomListQuery.isLoading ? [] : showroomListQuery.data.list;
  const season_list = showroomListQuery.isLoading
    ? []
    : showroomListQuery.data.season_list.map((item) => ({
        season_year: item.season_year,
        season_cd_id: item.season_cd_id,
        label: item.season_year + " " + item.season_text,
      }));
  const current_brand_info = showroomListQuery.isLoading
    ? []
    : showroomListQuery.data.current_brand_info;
  const brand_list = showroomListQuery.isLoading
    ? []
    : showroomListQuery.data.brand_list;
  const brand_notice = showroomListQuery.isLoading
    ? []
    : showroomListQuery.data.brand_notice;

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

  if (showroomListQuery.isLoading) {
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
      {!createRequestSample ? (
        <>
          <TitleWrap>
            <DigitalShowroomTitle
              selectBtn={true}
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

          <FilterDialog open={filterDialogOpen} setOpen={setFilterDialogOpen} />
          <BrandsDialog
            open={brandsDialogOpen}
            setOpen={setBrandsDialogOpen}
            data={brand_list}
            currentData={current_brand_info}
            handleSetBrand={handleSetBrand}
          />
        </>
      ) : (
        <CreateRequestSample
          selectData={selectData}
          currentBrand={current_brand_info}
          handleCancel={handleCancel}
          handleCreate={handleCreate}
          handleSelectData={handleSelectData}
        />
      )}
    </>
  );
}
