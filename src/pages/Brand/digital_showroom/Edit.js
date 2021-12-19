import React, { useMemo } from "react";
import { useQuery } from "react-query";
import styled, { css } from "styled-components";
import EditComponent from "components/brand/digital_showroom/EditComponent";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

const MainContainer = styled.div`
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1920px" : "1560px")};
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "960px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "600px")};      
  } 
`;

export default function DigitalShowroomEdit({ match }) {

  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer); 
  const { isLoading, data } = useQuery(
    ["brand-showroom-edit", match.params.item_no],
    async () =>
      await apiObject.getShowroomDetail({ showroom_no: match.params.item_no })
  );

  const sampleCdQuery = useQuery(
    ["sample-cd-info"],
    async () => await apiObject.getSampleInfo(() => {})
  );

  const sampleCdData = useMemo(() =>
    sampleCdQuery.isLoading ? [] : sampleCdQuery.data
  );

  if (isLoading) {
    return <Progress type="load" />;
  }

  return (
    <MainContainer active={isdrawer}>
      <EditComponent
        data={data}
        size={data.sample_list.length}
        sampleOptions={sampleCdData}
        sampleNo={match.params.item_no}
      />
    </MainContainer>
  );
}
