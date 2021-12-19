import React, { useState } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";

const Container = styled.div`
  width: 200px;
  height: 230px;
  border: 1px solid #bababa;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const TimeWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Time = styled.div`
  display: flex;
  justify-content: center;
  min-width: 120px;
  font-size: 40px;
  font-weight: 500;
  color: #999999;
`;

const AmpmWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const AmpmBtn = styled.div`
  width: 60px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  & + & {
    margin-top: 5px;
  }

  ${(props) =>
    props.active
      ? css`
          background-color: #7ea1b2;
          color: #ffffff;
          &:hover {
            background-color: ${darken(0.1, "#7ea1b2")};
          }
          &:active {
            background-color: ${darken(0.2, "#7ea1b2")};
          }
        `
      : css`
          background-color: #ffffff;
          border: solid 1px #dddddd;
          &:hover {
            background-color: ${darken(0.1, "#ffffff")};
          }
          &:active {
            background-color: ${darken(0.2, "#ffffff")};
          }
        `}
`;

const SelectWrap = styled.div``;

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Select = styled.div`
  width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weigth: 500;
  border-radius: 2px;
  cursor: pointer;

  ${(props) =>
    props.active
      ? css`
          background-color: #7ea1b2;
          color: #ffffff;
          &:hover {
            background-color: ${darken(0.1, "#7ea1b2")};
          }
          &:active {
            background-color: ${darken(0.2, "#7ea1b2")};
          }
        `
      : css`
          background-color: #ffffff;
          border: solid 1px #dddddd;
          &:hover {
            background-color: ${darken(0.1, "#ffffff")};
          }
          &:active {
            background-color: ${darken(0.2, "#ffffff")};
          }
        `}
`;

const BtnWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const Btn = styled.div`
  width: 60px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: 1px solid #dddddd;
  background-color: #ffffff;
  cursor: pointer;

  & + & {
    margin-left: 10px;
  }

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
  &:active {
    background-color: ${darken(0.1, "#ffffff")};
  }
`;

export default function DateRangePicker({ time, setOpen, handleChange }) {
  const [ampm, setAmpm] = useState(time.ampm === "" ? "AM" : time.ampm);
  const [newTime, setNewTime] = useState(time.hour === "" ? "12" : time.hour);

  const handleTimeChange = () => {
    handleChange(ampm, newTime);
    setOpen(false);
  };

  return (
    <>
      <Container>
        <TimeWrap>
          <Time>{newTime}:00</Time>
          <AmpmWrap>
            <AmpmBtn
              active={ampm === "AM" ? true : false}
              onClick={() => setAmpm("AM")}
            >
              AM
            </AmpmBtn>
            <AmpmBtn
              active={ampm === "PM" ? true : false}
              onClick={() => setAmpm("PM")}
            >
              PM
            </AmpmBtn>
          </AmpmWrap>
        </TimeWrap>
        <SelectWrap>
          <Wrap>
            <Select
              active={newTime === "1" ? true : false}
              onClick={() => setNewTime("1")}
            >
              1
            </Select>
            <Select
              active={newTime === "2" ? true : false}
              onClick={() => setNewTime("2")}
            >
              2
            </Select>
            <Select
              active={newTime === "3" ? true : false}
              onClick={() => setNewTime("3")}
            >
              3
            </Select>
            <Select
              active={newTime === "4" ? true : false}
              onClick={() => setNewTime("4")}
            >
              4
            </Select>
          </Wrap>
          <Wrap>
            <Select
              active={newTime === "5" ? true : false}
              onClick={() => setNewTime("5")}
            >
              5
            </Select>
            <Select
              active={newTime === "6" ? true : false}
              onClick={() => setNewTime("6")}
            >
              6
            </Select>
            <Select
              active={newTime === "7" ? true : false}
              onClick={() => setNewTime("7")}
            >
              7
            </Select>
            <Select
              active={newTime === "8" ? true : false}
              onClick={() => setNewTime("8")}
            >
              8
            </Select>
          </Wrap>
          <Wrap>
            <Select
              active={newTime === "9" ? true : false}
              onClick={() => setNewTime("9")}
            >
              9
            </Select>
            <Select
              active={newTime === "10" ? true : false}
              onClick={() => setNewTime("10")}
            >
              10
            </Select>
            <Select
              active={newTime === "11" ? true : false}
              onClick={() => setNewTime("11")}
            >
              11
            </Select>
            <Select
              active={newTime === "12" ? true : false}
              onClick={() => setNewTime("12")}
            >
              12
            </Select>
          </Wrap>
        </SelectWrap>
        <BtnWrap>
          <Btn onClick={() => setOpen(false)}>Cancel</Btn>
          <Btn onClick={handleTimeChange}>OK</Btn>
        </BtnWrap>
      </Container>
    </>
  );
}
