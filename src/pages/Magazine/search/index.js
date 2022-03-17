import React, { useState } from "react";
import BorderedTitle from "components/BorderedTitle";
import { Box } from "@material-ui/core";
import { useLocation } from "react-router";
import { Fragment } from "react";
import styled from "styled-components";
import ShowroomSearch from "components/magazine/search/ShowroomSearch";
import SampleRequestSearch from "components/magazine/search/SampleRequestSearch";
import ScheduleSearch from "components/magazine/search/ScheduleSearch";
import PickupSearch from "components/magazine/search/PickupSearch";
import SendoutSearch from "components/magazine/search/SendoutSearch";
import PressSearch from "components/magazine/search/PressSearch";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";
const Container = styled.div`  
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1200px" : "960px")};        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "600px")};    
  } 
`;


export default function SearchResultPage() {
  const [total, setTotal] = useState({
    showroom: 0,
    request: 0,
    schedule: 0,
    pickup: 0,
    sendout: 0,
    press: 0,
  });
  const location = useLocation();
  const keyword = location.pathname.split('/magazine/search/')[1];
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);  
  return (
    <Container active={isdrawer}>
      <Fragment>
        <BorderedTitle title="Search"></BorderedTitle>
        <Box mt={5} mb={7}>
          {total.showroom +
            total.request +
            total.schedule +
            total.pickup +
            total.sendout +
            total.press >
          0 ? (
            <>
              <b>
                총{" "}
                {total.showroom +
                  total.request +
                  total.schedule +
                  total.pickup +
                  total.sendout +
                  total.press}
                건
              </b>
              의 검색결과가 있습니다.
            </>
          ) : (
            <>
              <b>"{keyword}"</b> (과) 일치하는 검색 결과가 없습니다.
            </>
          )}
        </Box>
        <ShowroomSearch
          searchText={keyword}
          total={total}
          setTotal={setTotal}
        />
        <SampleRequestSearch
          searchText={keyword}
          total={total}
          setTotal={setTotal}
        />
        <ScheduleSearch
          searchText={keyword}
          total={total}
          setTotal={setTotal}
        />
        <PickupSearch searchText={keyword} total={total} setTotal={setTotal} />
        <SendoutSearch searchText={keyword} total={total} setTotal={setTotal} />
        <PressSearch searchText={keyword} total={total} setTotal={setTotal} />
      </Fragment>
    </Container>
  );
}
