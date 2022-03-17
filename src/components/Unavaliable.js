import React, { useState, useCallback, useMemo } from "react";
import styled, { css } from "styled-components";
import { Divider } from "@material-ui/core";
import { darken } from "polished";
import { useQuery, useMutation } from "react-query";
import dayjs from "dayjs";
import moment from "moment";

import UnavailableItems from "./UnavailableItems";
import CancelIcon from "assets/close_icon.png";
import CheckIcon from "assets/check_icon.png";
import DatePicker from "components/UnavailablePicker/DatePicker";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';


function Unavailable({ handleClose }) {
  const [today, setToday] = useState(moment());
  const [dt, setDt] = useState([]);
  const [editYn, setEditYn] = useState(true);

  const [year, setYear] = useState(dayjs().format("YYYY"));

  const handleEditYn = useCallback(() => {
    setEditYn(!editYn);
    setDt([]);
  }, [editYn, dt]);

  const handleDtDelete = useCallback(
    (date) => {
      setDt(dt.includes(date) ? dt.filter((d) => d !== date) : [...dt, date]);
    },
    [dt]
  );

  const handleConfirm = useCallback(() => {
    if (editYn) {
      /* if (confirm("휴일을 등록하시겠습니까?")) {
        let newArr = [];
        dt.map((d) => newArr.push(dayjs(d).unix()));
        setHoliday.mutate(newArr);
      } */
      alertConfirm({
        title: Constants.appName,
        content: '휴일을 등록하시겠습니까?',
        onOk: () => {
          let newArr = [];
          dt.map((d) => newArr.push(dayjs(d).unix()));
          setHoliday.mutate(newArr);
        },
        onCancel: () => {console.log('cancel')}
      });
    } else {
      /* if (confirm("등록된 휴일을 해제하시겠습니까?")) {
        let newArr = [];
        dt.map((d) => newArr.push(dayjs(d).unix()));
        delHoliday.mutate(newArr);
      } */
      alertConfirm({
        title: Constants.appName,
        content: '등록된 휴일을 해제하시겠습니까?',
        onOk: () => {
          let newArr = [];
          dt.map((d) => newArr.push(dayjs(d).unix()));
          delHoliday.mutate(newArr);
        },
        onCancel: () => {console.log('cancel')}
      });
    }
  }, [editYn, dt]);

  const holidayQuery = useQuery(
    ["holiday", year],
    async () => await apiObject.getHoliday({ year })
  );

  const unavailDt = useMemo(
    () =>
      holidayQuery.isLoading
        ? []
        : holidayQuery.data.list.map((d) => dayjs.unix(d).format("YYYY-MM-DD")),
    [holidayQuery.data]
  );

  const setHoliday = useMutation(
    (value) => apiObject.setHoliday({ holiday_list: value }),
    {
      onSuccess: () => {
        setDt([]);
        setEditYn(true);
        holidayQuery.refetch();
      },
      onError: () => {
        utils.customAlert("휴일 등록중 오류가 발생했습니다.");
      },
    }
  );

  const delHoliday = useMutation(
    (value) => apiObject.delHoliday({ holiday_list: value }),
    {
      onSuccess: () => {
        setDt([]);
        setEditYn(true);
        holidayQuery.refetch();
      },
      onError: () => {
        utils.customAlert("휴일 해제중 발생했습니다.");
      },
    }
  );

  if (holidayQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <Container>
        <Title>쇼룸 휴무일 설정</Title>
        <StyleDivider />
        <Contents>
          <InputWraps>
            <DatePicker
              editYn={editYn}
              dt={dt}
              setDt={setDt}
              unavailDt={unavailDt}
              initDt={today}
              setInitDt={setToday}
              year={year}
              setYear={setYear}
            />
            <div style={{ marginLeft: "50px" }}>
              <SwitchWrap>
                <SwitchTxt>휴무일</SwitchTxt>
                <SwitchDiv onClick={handleEditYn}>
                  <input
                    type="checkbox"
                    style={{ display: "none" }}
                    checked={editYn}
                    readOnly
                  />
                  <Marble active={editYn ? "on" : "off"} />
                  <SwitchBtn active={editYn ? "on" : "off"}>등록</SwitchBtn>
                  <SwitchBtn active={!editYn ? "on" : "off"}>해제</SwitchBtn>
                </SwitchDiv>
              </SwitchWrap>
              <SelectDateWrap>
                <SwitchTxt>선택한 날짜</SwitchTxt>
                <SelectDateDiv>
                  {dt.length === 0
                    ? "날짜를 선택해 주세요."
                    : dt.map((d) => (
                        <UnavailableItems
                          key={d}
                          data={d}
                          handleClick={handleDtDelete}
                        />
                      ))}
                </SelectDateDiv>
              </SelectDateWrap>
            </div>
          </InputWraps>

          <BottomWrap>
            <BtnWrap type="cancel" onClick={handleClose}>
              <BtnImgWrap>
                <img src={CancelIcon} alt="close"></img>
              </BtnImgWrap>
              <CancelTxt>Cancel</CancelTxt>
            </BtnWrap>
            <BtnWrap type="confirm" onClick={handleConfirm}>
              <BtnImgWrap>
                <img src={CheckIcon} alt="check"></img>
              </BtnImgWrap>
              <ConfirtTxt>Confirm</ConfirtTxt>
            </BtnWrap>
          </BottomWrap>
        </Contents>
      </Container>
    </>
  );
}

const Container = styled.div``;

const Title = styled.div`
  font-weight: bold;
  font-size: 28px;
  margin-bottom: 15px;
`;

const StyleDivider = styled(Divider)`
  width: 100%;
  height: 2px;
  background-color: #dddddd;
  margin-bottom: 40px;
`;

const Contents = styled.div``;

const InputWraps = styled.div`
  display: flex;
  & + & {
    margin-top: 20px;
  }
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

const BtnWrap = styled.div`
  width: 160px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.type === "cancel" ? "#ffffff" : "#7ea1b2"};
  border: ${(props) =>
    props.type === "cancel" ? "solid 1px #dddddd" : "none"};
  border-radius: 5px;
  transition: all 0.3s;

  ${(props) =>
    props.type === "cancel" &&
    css`
      &:hover {
        background-color: ${darken(0.1, "#ffffff")};
      }
      &:active {
        background-color: ${darken(0.2, "#ffffff")};
      }
    `}

  ${(props) =>
    props.type === "confirm" &&
    css`
      &:hover {
        background-color: ${darken(0.1, "#7ea1b2")};
      }
      &:active {
        background-color: ${darken(0.2, "#7ea1b2")};
      }
    `} 

  & + & {
    margin-left: 10px;
  }
`;

const BtnImgWrap = styled.div`
  margin-right: 10px;
  display: flex;
`;

const CancelTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #999999;
`;

const ConfirtTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
`;

const SwitchWrap = styled.div`
  display: flex;
  align-items: center;
`;

const SwitchTxt = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
`;

const SwitchDiv = styled.div`
  width: 104px;
  height: 32px;
  border: 1px solid #e9e9e9;
  background-color: #f1f2ea;
  border-radius: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  color: #bababa;
  position: relative;
  cursor: pointer;
`;

const SwitchBtn = styled.div`
  width: 52px;
  text-align: center;
  transition: all 0.3s;
  padding-top: 2px;
  z-index: 2;

  ${(props) =>
    props.active === "on" &&
    css`
      color: #ffffff;
    `}
`;

const Marble = styled.div`
  width: 52px;
  height: 28px;
  border-radius: 500px;
  position: absolute;
  transition: all 0.3s;

  ${(props) =>
    props.active === "on"
      ? css`
          left: 1px;
          background-color: #7ea1b2;
        `
      : css`
          left: 49px;
          background-color: #000000;
        `}
`;

const SelectDateWrap = styled.div`
  margin-top: 50px;
`;

const SelectDateDiv = styled.div`
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
  width: 420px;
`;

export default React.memo(Unavailable);
