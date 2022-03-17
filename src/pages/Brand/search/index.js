import React, { useState } from "react";
import BorderedTitle from "components/BorderedTitle";
import { Box } from "@material-ui/core";
import { useLocation } from "react-router";
import { Fragment } from "react";
import styled from "styled-components";
import ShowroomSearch from "components/brand/search/ShowroomSearch";
import LookbookSearch from "components/brand/search/LookbookSearch";
import SampleRequestSearch from "components/brand/search/SampleRequestSearch";
import ScheduleSearch from "components/brand/search/ScheduleSearch";
import SendoutSearch from "components/brand/search/SendoutSearch";
import PressSearch from "components/brand/search/PressSearch";
import Constants from 'utils/constants';
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";

const Container = styled.div`  
  width:calc(100%-25px);
  margin-left:25px;  
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1870px" : "1400px")};
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    min-width: ${(props) => (props.active ? "1250px" : "940px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "974px" : "974px")};
  } 
`;

export default function SearchResultPage() {
  const [total, setTotal] = useState({
    showroom: 0,
    lookbook: 0,
    request: 0,
    schedule: 0,
    sendout: 0,
    press: 0,
  });
  const location = useLocation();
  const keyword = location.pathname.split('/brand/search/')[1];
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  //const [keyword, setKeyword] = useState(keywordTmp[1]);

  return (
    <Container active={isdrawer}>
      <Fragment>
        <BorderedTitle title="Search"></BorderedTitle>
        <Box mt={5} mb={7}>
          {total.showroom + total.lookbook + total.request + total.schedule + total.sendout + total.press >
          0 ? (
            <>
              <b>
                총{" "}{total.showroom + total.lookbook + total.request + total.schedule + total.sendout + total.press}건
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
        <LookbookSearch
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
        <SendoutSearch searchText={keyword} total={total} setTotal={setTotal} />
        <PressSearch searchText={keyword} total={total} setTotal={setTotal} />
      </Fragment>
    </Container>
  );
}
