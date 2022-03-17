import React from "react";
import styled from "styled-components";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import moment from "moment";

const Container = styled.div`
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const LeftWrap = styled.div`
  display: flex;
`;

const Wrap = styled.div`
  & + & {
    margin-left: 20px;
  }
`;

const WrapRight = styled.div``;

const Text = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const InputWrap = styled.div`
  width: 140px;
  height: 42px;
  border-radius: 5px;
  border: solid 1px #dddddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
`;

const Date = styled.div`
  font-size: 16px;
  font-weight: 500;
  height: 20px;
  text-transform: uppercase;
`;

const ArrowDiv = styled.div`
  margin-top: 5px;
`;

const RightWrap = styled.div``;

const InputWrapRight = styled.div`
  width: 450px;
  height: 42px;
  border-radius: 5px;
  border: solid 1px #dddddd;
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

export default function DateRangePickerComp({ startDt, endDt }) {
  return (
    <>
      <Container>
        <LeftWrap>
          <Wrap>
            <Text>픽업일</Text>
            <InputWrap>
              <Date>
                {startDt === "" ? "-" : moment(startDt).format("MM/DD(ddd)")}
              </Date>
              <ArrowDiv>
                <ExpandMoreIcon />
              </ArrowDiv>
            </InputWrap>
          </Wrap>
          <Wrap>
            <Text>반납일</Text>
            <InputWrap>
              <Date>
                {endDt === "" ? "-" : moment(endDt).format("MM/DD(ddd)")}
              </Date>
              <ArrowDiv>
                <ExpandMoreIcon />
              </ArrowDiv>
            </InputWrap>
          </Wrap>
        </LeftWrap>

        <RightWrap>
          <WrapRight>
            <Text>요청일</Text>
            <InputWrapRight>
              <Date>
                {startDt !== "" && endDt !== ""
                  ? moment(startDt).format("MM/DD(ddd)") +
                    " - " +
                    moment(endDt).format("MM/DD(ddd)")
                  : "-"}
              </Date>
            </InputWrapRight>
          </WrapRight>
        </RightWrap>
      </Container>
    </>
  );
}
