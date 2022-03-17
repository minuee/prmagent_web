import React, { useState, useCallback } from "react";
import styled, { css } from "styled-components";
import dayjs from "dayjs";

import ByUrgency from "components/brand/sample_request/byUrgency";
import ByRequests from "components/brand/sample_request/byRequests";
import SampleRequestTitle from "components/SampleRequestTitle";
import DatePicker from "components/DatePicker/index_v2";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

const ContentsWrap = styled.div`
  margin-top: 30px;
  margin-bottom: 60px;
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "960px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "680px")};        
  }  
`;

const ContentsHead = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 40px;
  justify-content: space-between;
`;
const ContentsInsideHead = styled.div`
  display: flex;
  align-items: flex-end;
  
`;
const ContentsInsideHead2 = styled.div`
  display: flex;
  align-items: flex-end;
  
`;

const HeadBtn = styled.div`
  width: 134px;
  height: 42px;
  border-radius: 5px;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);
  background-color: #7ea1b2;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  margin-bottom: 8px;

  ${(props) =>
    !props.active &&
    css`
      opacity: 0.5;
      cursor: pointer;

      &:hover {
        opacity: 0.7;
      }
      &:active {
        opacity: 0.8;
      }
    `}

  & + & {
    margin-left: 8px;
  }
`;


const ContentsMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  width:100%;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "1030px")};
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "680px")};    
  }  
`;

export default function SampleRequests({ match }) {
  const req_type = match.params.type === "req" ? "request" : "urgency";
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer); 
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("PMS004");
  const [filter2, setFilter2] = useState(null);
  const [type, setType] = useState(req_type);
  const [dt, setDt] = useState(
    dayjs(dayjs().format("YYYY-MM-DD")).toISOString()
  );

  const handleFilter = useCallback(
    (filter) => {
      setFilter(filter);
      setFilterOpen(false);
    },
    [filter, filterOpen]
  );

  const handleFilter2 = useCallback(
    (filter2) => {
      setFilter2(filter2 == null ? 'not' : null );
    },
    [filter2]
  );

  return (
    <>
      <SampleRequestTitle
        open={filterOpen}
        setOpen={setFilterOpen}
        type={type}
        filter={filter}
        filter2={filter2}
        handleChange={handleFilter}
        handleChange2={handleFilter2}
      />
      <ContentsWrap active={isdrawer}> 
        <ContentsHead>
          <ContentsInsideHead>
          {type === "urgency" && <DatePicker dt={dt} setDt={setDt} />}
          <HeadBtn
            active={type === "urgency" && true}
            onClick={() => setType("urgency")}
          >
            픽업일별
          </HeadBtn>
          <HeadBtn
            active={type === "request" && true}
            onClick={() => setType("request")}
          >
            요청건별
          </HeadBtn>
          </ContentsInsideHead>          
        </ContentsHead>
        {type === "urgency" && (
          <ContentsMain active={isdrawer}>
            <ByUrgency dt={dayjs(dt).unix()} modelType={filter} />
          </ContentsMain>
        )}
        {type === "request" && <ByRequests modelType={filter}  filter={filter2} />}
      </ContentsWrap>
    </>
  );
}
