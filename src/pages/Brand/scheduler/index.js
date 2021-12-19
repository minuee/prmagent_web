import React, { useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import { apiObject } from "api/api_brand";
import { useParams } from "react-router-dom";
import moment from "moment";

import TitleComponent from "components/brand/scheduler/TitleComponent";
import NewReqComponent from "components/brand/scheduler/NewReqComponent";
import WeekPicker from "components/WeekPicker";
import Progress from "components/common/progress";

import Constants from '../../../utils/constants';

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

export default function Scheduler() {
  const { dt } = useParams();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const [startDate, setStartDate] = useState(
    dt === undefined ? moment().weekday(0) : moment.unix(dt).weekday(0)
  );
  const [endDate, setEndDate] = useState(
    dt === undefined ? moment().weekday(6) : moment.unix(dt).weekday(6)
  );
  const [season, setSeason] = useState(0);
  const [seasonQuery, setSeasonQuery] = useState({
    season_year: null,
    season_cd_id: null,
  });
  const [gender, setGender] = useState("0");
  const handleSeasonQuery = useCallback(
    (season_year, season_cd_id) => {
      setSeasonQuery({
        season_year: season_year,
        season_cd_id: season_cd_id,
      });
    },
    [seasonQuery]
  );
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

  const getSchedulerQuery = useQuery(
    [
      "brand",
      "scheduler",
      moment(startDate).unix(),
      moment(endDate).unix(),
      seasonQuery.season_year,
      seasonQuery.season_cd_id,
      gender === "0" ? null : gender,
    ],
    () =>
      apiObject.getScheduler({
        startDate: moment(startDate).unix(),
        endDate: moment(endDate).unix(),
        season_year: seasonQuery.season_year,
        season_cd_id: seasonQuery.season_cd_id,
        gender: gender === "0" ? null : gender,
      }),
    {
      enabled: startDate !== false && endDate !== false,
    }
  );

  const lookData = useMemo(
    () =>
      getSchedulerQuery.isLoading
        ? []
        : getSchedulerQuery.data.list.map((item) => ({
            showroom_no: item.showroom_no,
            showroom_nm: item.showroom_nm,
            images: item.image_list,
            memo_list: item.showroom_memo_list,
          })),
    [getSchedulerQuery]
  );

  const memoData = useMemo(
    () =>
      getSchedulerQuery.isLoading
        ? []
        : getSchedulerQuery.data.list.map((d) =>
            d.memo_list === null
              ? null
              : d.memo_list.map((item) => ({
                  ...item,
                  showroom_no: d.showroom_no,
                }))
          ),
    [getSchedulerQuery]
  );

  const reqData = useMemo(
    () =>
      getSchedulerQuery.isLoading
        ? []
        : getSchedulerQuery.data.list.map((d) =>
            d.req_list === null
              ? null
              : d.req_list.map((item) => ({
                  ...item,
                  showroom_no: d.showroom_no,
                  from:
                    item.start_dt <= moment(startDate).weekday(0).unix()
                      ? 0
                      : moment.unix(item.start_dt).weekday(),
                  to:
                    item.end_dt >= moment(startDate).weekday(6).unix()
                      ? 6
                      : moment.unix(item.end_dt).weekday(),
                }))
          ),
    [getSchedulerQuery]
  );

  const reqWaitData = useMemo(
    () =>
      getSchedulerQuery.isLoading
        ? []
        : getSchedulerQuery.data.list.map((d) =>
            d.req_wait_list === null
              ? null
              : d.req_wait_list.map((item) => ({
                  ...item,
                  showroom_no: d.showroom_no,
                  from:
                    item.start_dt <= moment(startDate).weekday(0).unix()
                      ? 0
                      : moment.unix(item.start_dt).weekday(),
                  to:
                    item.end_dt >= moment(startDate).weekday(6).unix()
                      ? 6
                      : moment.unix(item.end_dt).weekday(),
                }))
          ),
    [getSchedulerQuery]
  );

  const seasonData = useMemo(
    () =>
      getSchedulerQuery.isLoading
        ? []
        : getSchedulerQuery.data.season_list.map((d, i) => ({
            value: i,
            season_year: d.season_year,
            season_cd_id: d.season_cd_id,
            label:
              d.season_year === null
                ? d.season_text
                : d.season_year + " " + d.season_text,
          })),
    [getSchedulerQuery]
  );

  if (getSchedulerQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <TitleTxt>Scheduler</TitleTxt>
      <SelectWrap>
        <TitleComponent
          data={seasonData}
          season={season}
          setSeason={setSeason}
          setSeasonQuery={handleSeasonQuery}
          gender={gender}
          setGender={setGender}
          handleChange={handleChangeSeason}
        />
      </SelectWrap>
      <SchedulerConainer active={isdrawer}>
        <WeekSelect active={isdrawer}>
          <WeekPicker
            startDt={startDate}
            setStartDt={setStartDate}
            endDt={endDate}
            setEndDt={setEndDate}
          />
        </WeekSelect >
        {
          lookData.length === 0 ? 
          (
            <NoData>검색된 스케쥴이 없습니다.</NoData>
          ) 
          : 
          (
          <LookScheduler>
            <LookSchedulerWrap>
              <NewReqComponent
                look={lookData}
                req={reqData}
                wait={reqWaitData}
                memo={memoData}
                dt={startDate}
                endDt={endDate}
                season={seasonQuery}
                gender={gender}
              />
            </LookSchedulerWrap>
          </LookScheduler>
          )
        }
      </SchedulerConainer>
    </>
  );
}

const TitleTxt = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-right: 40px;
  margin-bottom: 30px;
  width:calc(100%-25px);
  margin-left:25px;
`;

const SchedulerConainer = styled.div`
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1870px" : "1400px")};
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    min-width: ${(props) => (props.active ? "1250px" : "960px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "600px")};
  }  
  height: auto;
  background-color: #f1f2ea;
  border-radius: 15px;
  padding: 16px 16px 16px 0;
`;

const WeekSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 15px;
  @media (min-width: 1920px) {
    padding-left : 250px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    padding-left : 250px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    padding-left : 180px;
  } 
  
  padding-top:5px;
`;

const LookScheduler = styled.div``;

const LookSchedulerWrap = styled.div`
  display: flex;
`;

const SelectWrap = styled.div`
  display: flex;
  margin-bottom: 20px;
  width:calc(100%-25px);
  margin-left:25px;
`;

const NoData = styled.div`
  display: flex;
  margin: 20px;
  font-size: 20px;
  justify-content: center;
  font-weight: bold;
`;
