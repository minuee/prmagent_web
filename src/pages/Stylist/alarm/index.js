import React, { useRef } from "react";
import styled from "styled-components";
import { Divider, CircularProgress } from "@material-ui/core";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";

import AlarmComponent from "components/AlarmComponent";
import { apiObject } from "api/api_stylist";
import useIntersectionObserver from "components/useIntersectionObserver";
import Progress from "components/common/progress";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';

const Container = styled.div`
  display: flex;
  
`;

const Main = styled.div`
  margin-top: 20px;
  @media (min-width: 1920px) {
    width: 1480px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 950px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 600px
  }  
`;

const Title = styled.div`
  font-size: 28px;
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

  const handleDelete = (id, type) => {
   /*  if (confirm("해당 알림을 삭제하시겠습니까?")) {
      delAlarm.mutate({ alarm_id: id, notifi_type: type });
    } */
    alertConfirm({
      title: Constants.appName,
      content: '해당 알림을 삭제하시겠습니까?',
      onOk: () => {
        delAlarm.mutate({ alarm_id: id, notifi_type: type });
      },
      onCancel: () => {console.log('cancel')}
    });
  };

  const getAlarmList = ({ pageParam = "" }) =>
    apiObject.getAlarm({ next_token: pageParam });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(["stylist-alarm"], getAlarmList, {
    getNextPageParam: (lastPage) => lastPage.has_next && lastPage.next_token,
  });

  const loadMoreButtonRef = useRef();

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  // alarm delete
  const delAlarm = useMutation(
    ["stylist-alarm-delete"],
    (value) =>
      apiObject.delAlarm(
        {
          alarm_id: value.alarm_id,
          notifi_type: value.notifi_type,
        },
        () => {}
      ),
    {
      onSuccess: () => {
        alert("정상적으로 삭제되었습니다.");
        queryClient.invalidateQueries(["stylist-alarm"]);
      },
    }
  );

  if (delAlarm.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      <Container>
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
                        type="stylist"
                        handleDelete={() =>
                          handleDelete(d.notice_id, d.notifi_type)
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
