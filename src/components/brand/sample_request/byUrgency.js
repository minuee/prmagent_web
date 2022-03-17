import React, { useRef,useState } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { useInfiniteQuery } from "react-query";
import { CircularProgress } from "@material-ui/core";

import SampleRequestItems from "components/SampleRequestItems";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
import MemoIconBlack from "assets/scheduler/memoIcon.svg";
import ShowroomMemo from "components/brand/scheduler/ShowroomMemo";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

const ItemWrap = styled.div`
  width: 360px;
  border-radius: 10px;
  background-color: #f1f2ea;
  padding: 20px 14px;
  margin-bottom: 20px;
  margin-left: 20px;
`;

const ImgDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const Img = styled.div`
  width: 200px;
  height: 300px;
  
  border: solid 1px #dddddd;
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}") no-repeat center;
          background-size: contain;
          background-color: #e7e7e7;
        `
      : css`
          background-color: #dddddd;
        `}
`;

const ItemTitle = styled.div`
  display: flex;
  justify-content: center;
  font-size: 15px;
  font-weight: bold;
  margin-top: 17px;
  .memo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    border-radius: 50%;
    cursor: pointer;
 
    &:hover {
      background-color: ${darken(0.2, "#ffffff")};
    }
    &:active {
      background-color: ${darken(0.3, "#ffffff")};
    }
    > img {
    }
  }
`;

const RequestWrap = styled.div`
  margin-top: 19px;
  width: 336px;
  display: flex;
  flex-wrap: wrap;
  min-height: 290px;
`;

const ButtonDiv = styled.div`
  display: flex;  
  width:100%;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1480px" : "1480px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "1000px")};
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "960px" : "640px")};
  }  
  justify-content: center;
  margin-bottom: 40px;
  font-size: 20px;
  cursor: pointer;
`;

export default function ByUrgency({ dt, modelType }) {
  const [open, setOpen] = useState(false);
  const [sno, setNowno] = useState(null);
  const [snm, setNowsnm] = useState(null);
  const urgencyData = ({ pageParam = 1 }) =>
    apiObject.getUrgency({
      page: pageParam,
      limit: 8,
      date: dt,
      model_type: modelType,
    });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(["urgency", dt, modelType], urgencyData, {
    getNextPageParam: (lastPage) => lastPage.next_page ?? false,
  });

  const loadMoreButtonRef = useRef();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);  

  if (status === "loading") {
    return <Progress type="load" />;
  }

  const openShowroomMemo = async(no,nm) => {
    await setNowno(no);
    await setNowsnm(nm)
    if ( sno != null) {
      setOpen(!open)
    }
  }
  return (
    <>
      {data.pages[0].total_count === 0 ? (
        <div>조회된 데이터가 없습니다.</div>
      ) : (
        data.pages.map((group) =>
          group.request_list.map((d, i) => (
            <>
              <ItemWrap key={i} active={isdrawer}>
                <ImgDiv>
                  <Img imgUrl={d.image_url} />
                </ImgDiv>
                <ItemTitle>
                  {d.showroom_nm}
                  <div className="memo" onClick={() => openShowroomMemo(d.showroom_no,d.showroom_nm)}>
                    <img src={MemoIconBlack} alt="memo" />
                  </div>
                </ItemTitle>
                <RequestWrap>
                  {d.user_info.map((v) => (
                    <SampleRequestItems
                      key={v.req_no}
                      data={v}
                      title={d.showroom_nm}
                      titleImg={d.image_url}
                      showroomNo={d.showroom_no}                      
                    />
                  ))}
                </RequestWrap>
              </ItemWrap>
              {(i + 1) % 3 === 0 && <br />}
            </>
          ))
        )
      )}
      <ButtonDiv active={isdrawer}>
        <div ref={loadMoreButtonRef} onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? (
            <CircularProgress />
          ) : hasNextPage ? (
            "더보기"
          ) : (
            ""
          )}
        </div>
      </ButtonDiv>
      <ShowroomMemo
        open={open}
        setOpen={setOpen}
        sno={sno}
        snm={snm}
        dt={dt}
      />
    </>
  );
}
