import React,{useEffect,useState} from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import SendoutDetailItems from "./SendoutDetailItems";
import CheckBoxOn from "assets/sendout/checkBox_on.svg";
import CheckBoxOff from "assets/sendout/checkBox_off.svg";

export default function SendoutContent({data,checked,handleChecked,handleClick,view}) {
  let op = checked.filter(item => (item.date === data.date));
  const [leftData, setLeftData] = useState([]);
  const [leftShowroomData, setLeftShowroomData] = useState([]);
  
  useEffect(async() => {
    let newLeftIdxArray = [];
    let newLeftShowroomIdxArray = [];
    let newLeftArray = [];    
    await data.each_list.forEach((element) => {
      if ( !newLeftIdxArray.includes(element.showroom_list[0].req_no)) {
        newLeftIdxArray.push(element.showroom_list[0].req_no);
        newLeftArray.push(element)
      }
      newLeftShowroomIdxArray.push({reqNo : element.showroom_list[0].req_no , showroom_no : element.showroom_list[0].showroom_no});  
    })              
    setLeftData(newLeftArray);
    
    setLeftShowroomData(newLeftShowroomIdxArray);
  }, [data]);
  return (
    <ContentsBox>
      <ContentsTitle>
        {data.date < Math.floor(new Date()/1000) ?
        <ContentsTitleText onClick={() => handleChecked(data.date,leftData, leftData.length,leftShowroomData)} >
          {dayjs.unix(data.date).format("M/DD(ddd)")}
          <img
            src={ op.length > 0 ? CheckBoxOn : CheckBoxOff}
            alt=""
            style={{ marginLeft: "10px" }}
          />
        </ContentsTitleText>
        :
        <ContentsTitleText>{dayjs.unix(data.date).format("M/DD(ddd)")} </ContentsTitleText>
        }
        <ContentsTitleSum>{/* data.each_list.length} */}</ContentsTitleSum>
      </ContentsTitle>
      <ItemWrap>
        {leftData.map((d,i2) => (
          <SendoutDetailItems
            key={d.i2}
            data={d}
            sdata={leftShowroomData}
            sdate={data.date}
            handleClick={handleClick}
            view={view}
            viewMode={'new'}
          />
        ))}
      </ItemWrap>
    </ContentsBox>
  );
}

const ContentsBox = styled.div`
  width:99%;
  display: flex;
  padding: 30px;
`;

const ContentsTitle = styled.div`
  width: 170px;
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
  max-width: calc(99% - 170px);
`;
