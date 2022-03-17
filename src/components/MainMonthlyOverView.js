import React from "react";
import styled from "styled-components";

// import BarChartComp from "../components/BarChart";
// import PieChartComp from "../components/PieChart";

import BarChart from "./chart/NewBarChart";
import Doughnut from "./chart/NewDoughnutChart";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";


function MainMonthlyOverView({sampleData,sendData,magazineData,title,subTitle,type,}) {
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);

  return (
    <>
      <SampleWrap>
        <TxtWrap fontSize="34px" fontWeight="300" marginRight="12px">{title}</TxtWrap>
        <TxtWrap fontSize="34px" fontWeight="bold">{subTitle}</TxtWrap>
      </SampleWrap>
      <ChartContainer isdrawer={isdrawer}>
        {/* Sample Request Chart */}
        {sampleData.length > 0 && (
          <ChartWrap isdrawer={isdrawer}>           
            <BarChart data={sampleData} title={type === "brand" ? "Sample Requests" : "Confirmed Sample Requests"} />
          </ChartWrap>
        )}

        {/* Send Outs Chart */}
        {sendData.length > 0 && (
          <ChartWrap isdrawer={isdrawer}>           
            <BarChart data={sendData} title={type === "brand" ? "Send Outs" : "Pick Ups"} />
          </ChartWrap>
        )}

        {/* Send Outs Chart */}
        {magazineData.length > 0 && (
          <ChartWrap isdrawer={isdrawer}>            
            <Doughnut
              data={magazineData}
              title={type === "brand" ? "Send-Outs" : "Pickup"}
              subTitle={type === "brand" ? "by Magazines" : "by Brands"}
            />
          </ChartWrap>
        )}
      </ChartContainer>
    </>
  );
}

const SampleWrap = styled.div`
  width: 98%;  
  display: flex;
  margin-bottom: 34px;
`;

const TxtWrap = styled.div`
  font-size: ${(props) => props.fontSize || "12px"};
  color: ${(props) => props.color || "#000000"};
  font-weight: ${(props) => props.fontWeight || 500};
  margin-right: ${(props) => props.marginRight || 0};
  line-height: ${(props) => props.lineHeight || "unset"};
  text-align: ${(props) => props.textAlign || "left"};
`;

const ChartContainer = styled.div`
  width: 98%;  
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.isdrawer ? "1920px" : "1560px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    display: flex;justify-content: space-between;
    min-width: ${(props) => (props.isdrawer ? "1250px" : "960px")};   
  }
  @media (min-width: 10px) and (max-width: 1439px) {        
    display: ${(props) => (props.isdrawer ? "flex" : "relative")};
    min-width: ${(props) => (props.isdrawer ? "924px" : "610px")};
    justify-content: ${(props) => (props.isdrawer ? "space-between" : "center")};
  } 
`;

const ChartWrap = styled.div`
  @media (min-width: 1920px) {
    width: 340px;    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: ${(props) => (props.isdrawer ? "320px" : "320px")};   
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.isdrawer ? "300px" : "500px")};    
    margin-bottom:20px;
  } 
`;

export default React.memo(MainMonthlyOverView);
