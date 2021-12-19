import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import SendoutDetailItems from "./SendoutDetailItems";
import CheckBoxOn from "assets/sendout/checkBox_on.svg";
import CheckBoxOff from "assets/sendout/checkBox_off.svg";

export default function SendoutContent({
  data,
  checked,
  handleChecked,
  handleEachDetail,
}) {
  return (
    <ContentsBox>
      <ContentsTitle>
        <ContentsTitleText
          onClick={() => handleChecked(data.date, data.each_count)}
        >
          {dayjs.unix(data.date).format("M/DD(ddd)")}
          <img
            src={checked.includes(data.date) ? CheckBoxOn : CheckBoxOff}
            alt=""
            style={{ marginLeft: "10px" }}
          />
        </ContentsTitleText>
        <ContentsTitleSum>{data.each_count}</ContentsTitleSum>
      </ContentsTitle>
      <ItemWrap>
        {data.each_list.map((d) => (
          <SendoutDetailItems
            key={d.req_no}
            data={d}
            handleClick={() => handleEachDetail(d.req_no)}
          />
        ))}
      </ItemWrap>
    </ContentsBox>
  );
}

const ContentsBox = styled.div`
  display: flex;
  padding: 33px 33px 13px 33px;
`;

const ContentsTitle = styled.div`
  width: 190px;
  display: flex;
  flex-direction: column;
`;

const ContentsTitleText = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ContentsTitleSum = styled.div`
  font-size: 80px;
  font-weight: bold;
  color: #7ea1b2;
  display: flex;
  align-items: center;
  height: 100px;
`;

const ItemWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
