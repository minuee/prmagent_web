import React, { useState } from "react";
import BorderedTitle from "components/BorderedTitle";
import { Box } from "@material-ui/core";
import { useLocation } from "react-router";
import { Fragment } from "react";

import ShowroomSearch from "components/brand/search/ShowroomSearch";
import LookbookSearch from "components/brand/search/LookbookSearch";
import SampleRequestSearch from "components/brand/search/SampleRequestSearch";
import ScheduleSearch from "components/brand/search/ScheduleSearch";
import SendoutSearch from "components/brand/search/SendoutSearch";
import PressSearch from "components/brand/search/PressSearch";

export default function SearchResultPage() {
  const [total, setTotal] = useState({
    showroom: 0,
    lookbook: 0,
    request: 0,
    schedule: 0,
    sendout: 0,
    press: 0,
  });
  const {
    state: { keyword },
  } = useLocation();

  return (
    <div>
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
    </div>
  );
}
