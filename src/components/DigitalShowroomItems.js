import React, { useState, useRef, useMemo, useCallback } from "react";

import styled from "styled-components";
import { darken } from "polished";
import { useHistory } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "react-query";
import { CircularProgress,Box } from "@material-ui/core";

import useIntersectionObserver from "components/useIntersectionObserver";
import { apiObject } from "api/api_brand";
import Items from "components/brand/digital_showroom/Items";
import SelectSeason from "components/SelectSeason";
import Progress from "components/common/progress";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer,currentShowRoomSelect } from "redux/state";
import utils from "utils";

function DigitalShowroomItems({select,selectData,filterData,handleSelectData,handleCreateLookbook,handleCopyData=null}) {
  const history = useHistory();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const [season, setSeason] = useRecoilState(currentShowRoomSelect);
  //const [season, setSeason] = useState(currentShowRoomSelect);

  const handleClick = useCallback((detailYn, editYn, idx) => {
    if (detailYn && !editYn) {
      history.push("/brand/digital_showroom/detail/" + idx);
    } else {
      history.push("/brand/digital_showroom/edit/" + idx);
    }
  });

  const handleChangeSeason = useCallback(
    (season_year, season_cd_id, label) => {
      setSeason({
        season_year: season_year,
        season_cd_id: season_cd_id,
        label: label,
      });
    },
    [season]
  );

  // showroom list call
  const getShowroomList = ({ pageParam = 1 }) =>
    apiObject.getShowroomList({
      page: pageParam,
      limit: 10,
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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery(
      [
        "showroom-list",
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
      getShowroomList,
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

  const seasonData = useMemo(
    () =>
      status === "loading"
        ? []
        : data.pages[0].season_list.map((item) => ({
            season_year: item.season_year,
            season_cd_id: item.season_cd_id,
            label: item.season_year + " " + item.season_text,
          })),
    [data]
  );

  const showroomInquiryQuery = useQuery(
    ["showroom-inquiry"],
    async () => await apiObject.getShowroomInquiry({}),
    { keepPreviousData: true }
  );

  const showroomInquiry = useMemo(
    () => (showroomInquiryQuery.isLoading ? [] : showroomInquiryQuery.data),
    [showroomInquiryQuery.data]
  );

  const inquiryNumberQuery = useQuery(
    ["showroom-inquiry-number"],
    async () => await apiObject.getInquiryNumber(),
    { keepPreviousData: true }
  );

  const inquiryNumber = useMemo(
    () =>
      inquiryNumberQuery.isLoading
        ? ""
        : inquiryNumberQuery.data,
    [inquiryNumberQuery.data]
  );


 

  if (status === "loading") {
    return <Progress type="load" />;
  }else{
    if ( handleCopyData != null ) {
      handleCopyData(season,seasonData)
    }
  }

  

  return (
    <>
      <SelectWrap active={isdrawer}>
        {seasonData.length > 0 ? (
          <SelectSeason
            value={season}
            options={seasonData}
            handleChange={handleChangeSeason}
          />
        ) : (
          <div />
        )}
        <ContactWrap>
          {!utils.isEmpty(inquiryNumber.inquiry_number) && (
            <ContactTxt>문의 : {inquiryNumber.inquiry_number}</ContactTxt>
          )}
          {inquiryNumber !== null &&
            showroomInquiry.showroom_inquiry_contact !== null && (
              <ContactTxt>|</ContactTxt>
            )}
          {showroomInquiry.showroom_inquiry_contact !== null && (
            <ContactTxt>
              쇼룸 : 
              {!utils.isEmpty(showroomInquiry.inquiry_charge) && (" "+showroomInquiry.inquiry_charge)}
              {" "+utils.phoneFormat(showroomInquiry.showroom_inquiry_contact)}
              {!utils.isEmpty(showroomInquiry.showroom_inquiry_email) && (" "+showroomInquiry.showroom_inquiry_email)}
            </ContactTxt>
          )}
        </ContactWrap>
      </SelectWrap>
      {data.pages.length > 0 ? (
        <>
          {data.pages[0].total_count > 0 ? (
            <>
              <Container>
                {data.pages.map((group) =>
                  group.list.map((d) => (
                    <Items
                      key={`${d.showroom_no}`}
                      data={d}
                      season={season}
                      select={select}
                      selectData={selectData}
                      handleClick={handleClick}
                      handleSelectData={handleSelectData}
                    />
                  ))
                )}
              </Container>
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
              {selectData.length > 0 && (
                <SelectInfoWrap>
                  <SelectIconTxtWrap>
                    <SelectInfoTxt1>Total</SelectInfoTxt1>
                    <SelectInfoTxt2>Number of Samples</SelectInfoTxt2>
                    <SelectInfoTxt1>Selected :</SelectInfoTxt1>
                    <SelectInfoTxt3>{selectData.length}</SelectInfoTxt3>
                  </SelectIconTxtWrap>
                  <SelectIconBtnWrap>
                    <CreateBtn onClick={handleCreateLookbook}>
                    룩북 생성하기
                    </CreateBtn>
                  </SelectIconBtnWrap>
                </SelectInfoWrap>
              )}
            </>
          ) : (
            <Box bgcolor={"#f6f6f6"} width="100%" marginLeft="25px">
              <Box
                minHeight={"40vh"}
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize={20}
              >
                조회된 데이터가 없습니다.
              </Box>
            </Box>
          )}
        </>
      ):
      <Box bgcolor={"#f6f6f6"} width="100%" marginLeft="25px">
        <Box
          minHeight={"40vh"}
          display="flex"
          justifyContent="center"
          alignItems="center"
          fontSize={20}
        >
          조회된 데이터가 없습니다.
        </Box>
      </Box>
    }
    </>
  );
}

const SelectWrap = styled.div`
  margin-bottom: 32px;
  margin-left: 20px;
  
  justify-content: space-between;
  width:100%;  
  @media (min-width: 1920px) {    
    display: flex;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    display: flex;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    display: ${(props) => (props.active ? "flex" : "relative")};    
  } 
`;

const ContactWrap = styled.div`
  display: flex;
`;

const ContactTxt = styled.div`
  font-size: 18px;
  font-weight: 300;

  & + & {
    margin-left: 10px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
`;

const SelectInfoWrap = styled.div`
  width: 727px;
  height: 120px;
  border: solid 1px #dddddd;
  box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  position: fixed;
  bottom: 0px;
  right: 60px;
  border-radius: 20px 20px 0 0;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  z-index: 5;
`;

const SelectIconTxtWrap = styled.div`
  display: flex;
`;

const SelectIconBtnWrap = styled.div`
  display: flex;
  align-items: center;
`;

const SelectInfoTxt1 = styled.div`
  font-size: 20px;
  display: flex;
  align-items: center;
  margin-right: 8px;
`;
const SelectInfoTxt2 = styled.div`
  font-size: 20px;
  font-weight: 900;
  display: flex;
  align-items: center;
  margin-right: 8px;
`;
const SelectInfoTxt3 = styled.div`
  font-size: 72px;
  font-weight: 900;
  color: #7ea1b2;
  display: flex;
  align-items: center;
`;

const CreateBtn = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background-color: #7ea1b2;
  padding: 0 24px;
  height: 50px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 16px;
  cursor: pointer;
  margin-right: 20px;
  transition: all 0.3s;

  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
  }

  &:active {
    background-color: ${darken(0.2, "#7ea1b2")};
  }
`;

const NoData = styled.div`
  display: flex;
  height: 500px;
  align-items: center;
  justify-content: center;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  font-size: 20px;
  cursor: pointer;
`;

export default React.memo(DigitalShowroomItems);
