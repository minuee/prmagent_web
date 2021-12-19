import React, { useMemo } from "react";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import styled from "styled-components";
import MainSampleRequest from "components/MainSampleReqeust";
import MainSendOuts from "components/MainSendOuts";
import MainPickups from "components/MainPickups";
import MainMonthlyOverView from "components/MainMonthlyOverView";

import { apiObject } from "api/api_magazine";
import { MONTH_CHANGE } from "mock/Mock";
import Progress from "components/common/progress";

const MainConainer = styled.div`
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
`;


export default function Main() {
  // home 통계자료 조회
  const magazineHomeData = useQuery(
    ["magazine-home"],
    async () =>
      await apiObject.getMagazineHome({
        date: dayjs().unix(),
      })
  );

  const rowData = magazineHomeData.isLoading ? [] : magazineHomeData.data;

  if (magazineHomeData.isLoading) {
    return <Progress type="load" />;
  }

  const confirm_requests =
    rowData.cnfirm_request_total_count !== 0
      ? rowData.cnfirm_request.map((item) => ({
          req_no: item.req_no,
          brand_cnfirm_dt: item.brand_cnfirm_dt,
          company_nm: item.brand_nm,
          logo_url_adres: item.brand_logo_url_adres,
          editor_nm: item.editor_nm,
          editor_posi: item.editor_posi,
        }))
      : [];

  const todays_pickups = rowData.today_request_total_count !== 0 ? rowData.today_request: [];
  const today_sendouts = rowData.today_sendout.length !== 0 ? rowData.today_sendout: [];

  const confirm_history =
    rowData.cnfirm_history !== null
      ? rowData.cnfirm_history.map((item) => ({
          name: MONTH_CHANGE.find((v) => v.input === item.month).output,
          value: item.count,
        }))
      : [];

  const pickup_history =
    rowData.pickup_history !== null
      ? rowData.pickup_history.map((item) => ({
          name: MONTH_CHANGE.find((v) => v.input === item.month).output,
          value: item.count,
        }))
      : [];

  const brand_ratio =
    rowData.brand_ratio.length !== 0
      ? rowData.brand_ratio.map((item) => ({
          name: item.brand_nm,
          value: item.count,
        }))
      : [];

  return (
    <MainConainer>
      <MainSampleRequest
        data={confirm_requests}
        title="Confirmed"
        subTitle="Requests"
        type="magazine"
      />      
      <MainPickups
        data={todays_pickups}
        title="Today's"
        subTitle="Pickups"
        type="magazine"
      />
      <MainSendOuts
        data={today_sendouts}
        title="Today's"
        subTitle="Send Outs"
        type="magazine"
      />
      
      {confirm_history.length !== 0 &&
        pickup_history.length !== 0 &&
        brand_ratio.length !== 0 && (
          <MainMonthlyOverView
            sampleData={confirm_history}
            sendData={pickup_history}
            magazineData={brand_ratio}
            title="Monthly"
            subTitle="Overview"
            type="magazine"
          />
        )}
    </MainConainer>
  );
}