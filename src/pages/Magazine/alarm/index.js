import React, { useRef,useState } from "react";
import styled from "styled-components";
import { Divider, CircularProgress } from "@material-ui/core";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";

import AlarmComponent from "components/AlarmComponent";
import { apiObject } from "api/api_magazine";
import useIntersectionObserver from "components/useIntersectionObserver";
import Progress from "components/common/progress";


/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';
import utils from "utils";

const Container = styled.div`
  display: flex;
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

const Main = styled.div`  
  width: 99%;
  
`;

const Title = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
`;

const StyleDivider = styled(Divider)`
  height: 2px;
  background-color: #dddddd;
  margin-top: 16px;
  margin-bottom: 40px;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  font-size: 20px;
  cursor: pointer;
`;

export default function Alarm() {
  const queryClient = useQueryClient();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);

  const [targetid, setTargetID] = useState(null);
  const [checked, setChecked] = useState([]);


  const handleDelete = (id, type) => {
    /* if (confirm("해당 알림을 삭제하시겠습니까?")) {
      setTargetID(id)
      delAlarm.mutate({ alarm_id: id, notifi_type: type });
    } */

    alertConfirm({
      title: Constants.appName,
      content: '해당 알림을 삭제하시겠습니까?',
      onOk: () => {
        setTargetID(id)
        delAlarm.mutate({ alarm_id: id, notifi_type: type });
      },
      onCancel: () => {console.log('cancel')}
    });
  };

  const getAlarmList = ({ pageParam = 1 }) =>
    apiObject.getAlarm({ page: pageParam });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(["magazine-alarm"], getAlarmList, {
    getNextPageParam: (lastPage) => lastPage.next_page ?? false,
  });

  const loadMoreButtonRef = useRef();

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  // alarm delete
  const delAlarm = useMutation(
    ["magazine-alarm-delete"],
    (value) =>
      apiObject.delAlarm(
        {
          alarm_id: value.alarm_id,
          notice_type: value.notifi_type,
        },
        () => {}
      ),
    {
      onSuccess: () => {
        utils.customAlert("정상적으로 삭제되었습니다.");
        setChecked(checked.push(targetid))
        queryClient.invalidateQueries(["magazine-alarm"]);
        setTargetID(null)
      },
    }
  );

  if (delAlarm.isLoading) {
    return <Progress type="upload" />;
  }


  return (
    <>
      <Container active={isdrawer}>
        <Main>
          <Title>Notification</Title>
          <StyleDivider />
          {status === "loading" ? (
            <Progress type="load" />
          ) : (
            <>
              {data.pages.map((group, idx) =>
                group.list.length === 0 ? (
                  <div>조회된 데이터가 없습니다.</div>
                ) : (
                  <React.Fragment key={idx}>
                    {group.list.map((d, i) => (
                      <AlarmComponent
                        key={d.notice_id}
                        data={d}
                        odd={i % 2}
                        type="magazine"
                        handleDelete={() =>
                          handleDelete(d.notice_id, d.notice_type)
                        }
                      />
                    ))}
                  </React.Fragment>
                )
              )}
              <ButtonDiv>
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
            </>
          )}
        </Main>
      </Container>
    </>
  );
}
