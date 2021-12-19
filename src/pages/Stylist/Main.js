import React, { useMemo } from "react";
import dayjs from "dayjs";
import { useQuery } from "react-query";

import MainSampleRequest from "components/MainSampleReqeust";
import MainSendOuts from "components/MainSendOuts";
import MainMonthlyOverView from "components/MainMonthlyOverView";

import { apiObject } from "api/api_stylist";
import { MONTH_CHANGE } from "mock/Mock";
import Progress from "components/common/progress";
import utils from "utils";

export default function Main() {
  // home 통계자료 조회
  const stylistHomeData = useQuery(
    ["stylist-home"],
    async () =>
      await apiObject.getStylistHome({
        date: dayjs().unix(),
      })
  );

  const rowData = stylistHomeData.isLoading ? [] : stylistHomeData.data;

  if (stylistHomeData.isLoading) {
    return <Progress type="load" />;
  }

  const confirm_requests =
    !utils.isEmpty(rowData) ?
    rowData.cnfirm_request_total_count !== 0
      ? rowData.cnfirm_request.map((item) => ({
          req_no: item.req_no,
          brand_cnfirm_dt: item.brand_cnfirm_dt,
          company_nm: item.brand_nm,
          logo_url_adres: item.brand_logo_url_adres,
          editor_nm: item.editor_nm,
          editor_posi: item.editor_posi,
        }))
      : []
      : [];

  const todays_pickups =
    !utils.isEmpty(rowData) ?
    rowData.today_request_total_count !== 0
      ? rowData.today_request.map((item) => ({
          req_no: item.req_no,
          date: item.date,
          company_nm: item.brand_nm,
          logo_url_adres: item.brand_logo_url_adres,
          editor_nm: item.editor_nm,
          editor_posi: item.editor_posi,
        }))
      : []
    : [];

  const confirm_history =
    !utils.isEmpty(rowData) ?
    rowData.cnfirm_history !== null
      ? rowData.cnfirm_history.map((item) => ({
          name: MONTH_CHANGE.find((v) => v.input === item.month).output,
          value: item.count,
        }))
      : []
    : [];

  const pickup_history =
    !utils.isEmpty(rowData) ?
    rowData.pickup_history !== null
      ? rowData.pickup_history.map((item) => ({
          name: MONTH_CHANGE.find((v) => v.input === item.month).output,
          value: item.count,
        }))
      : []
    : [];

  const brand_ratio =
    !utils.isEmpty(rowData) ?
    rowData.brand_ratio.length !== 0
      ? rowData.brand_ratio.map((item) => ({
          name: item.brand_nm,
          value: item.count,
        }))
      : []
    : [];

  return (
    <>
      <MainSampleRequest
        data={confirm_requests}
        title="Confirmed"
        subTitle="Requests"
        type="stylist"
      />
      <MainSendOuts
        data={todays_pickups}
        title="Today's"
        subTitle="PickUps"
        type="stylist"
      />
      {confirm_history.length !== 0 &&
        pickup_history.length !== 0 &&
        brand_ratio.length !== 0 && (
          <MainMonthlyOverView
            sampleData={confirm_history}
            sendData={pickup_history}
            magazineData={brand_ratio}
            title="Today's"
            subTitle="Send outs"
            type="stylist"
          />
        )}
    </>
  );
}
