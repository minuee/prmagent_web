import React, { useMemo } from "react";
import dayjs from "dayjs";
import { useQuery, useQueryClient } from "react-query";
import styled from "styled-components";
import MainSampleRequest from "components/MainSampleReqeust";
import MainSendOuts from "components/MainSendOutsBrand";
import MainMonthlyOverView from "components/MainMonthlyOverView";
import Subscr from "components/common/subscr";
import { apiObject } from "api/api_brand";
import { MONTH_CHANGE } from "mock/Mock";

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

function Main() {
  //
  const queryClient = useQueryClient();
  const subscr_yn = queryClient.getQueryData(["brand-myinfo"]).subscr_yn;
  
  // home 통계자료 조회
  const brandHomeData = useQuery(
    ["brand-home"],
    async () =>
      await apiObject.getBrandHome({
        date: dayjs().unix(),
      })
  );

  const sample_request = useMemo(() =>
    brandHomeData.isLoading
      ? []
      : brandHomeData.data.new_request.map((item) => ({
          req_no: item.req_no,
          brand_cnfirm_dt: item.brand_cnfirm_dt,
          company_nm: item.mgzn_nm,
          logo_url_adres: item.mgzn_logo_url_adres,
          editor_nm: item.editor_nm,
          editor_posi: item.editor_posi,
        }))
  );
  const send_outs = useMemo(() =>
    brandHomeData.isLoading ? [] : brandHomeData.data.today_sendout
  );
  /* const send_outs = useMemo(() =>
    brandHomeData.isLoading
      ? []
      : brandHomeData.data.today_request.map((item) => ({
          req_no: item.req_no,
          date: item.date,
          company_nm: item.mgzn_nm,
          logo_url_adres: item.mgzn_logo_url_adres,
          editor_nm: item.editor_nm,
          editor_posi: item.editor_posi,
        }))
  ); */
  const sample_history = useMemo(() =>
    brandHomeData.isLoading
      ? []
      : brandHomeData.data.cnfirm_history.map((item) => ({
          name: MONTH_CHANGE.find((v) => v.input === item.month).output,
          value: item.count,
        }))
  );
  const sendouts_history = useMemo(() =>
    brandHomeData.isLoading
      ? []
      : brandHomeData.data.pickup_history.map((item) => ({
          name: MONTH_CHANGE.find((v) => v.input === item.month).output,
          value: item.count,
        }))
  );
  const magazine_ratio = useMemo(() =>
    brandHomeData.isLoading
      ? []
      : brandHomeData.data.mgzn_ratio.map((item) => ({
          name: item.mgzn_nm,
          value: item.count,
        }))
  );

  return (
    <>
      {subscr_yn ? (
        <MainConainer>
          <MainSampleRequest data={sample_request} title="New" subTitle="Sample Requests" />
          <MainSendOuts data={send_outs} title="Today's" subTitle="Send Outs" />
          {
            sample_history.lanegh !== 0 && sendouts_history.length !== 0 && magazine_ratio.length !== 0 && (
              <MainMonthlyOverView
                sampleData={sample_history}
                sendData={sendouts_history}
                magazineData={magazine_ratio}
                title="Monthly"
                subTitle="Overview"
                type="brand"
              />
            )}
        </MainConainer>
      ) : (
        <Subscr />
      )}
    </>
  );
}



export default React.memo(Main);