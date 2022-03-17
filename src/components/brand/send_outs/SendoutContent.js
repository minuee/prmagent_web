import React,{useEffect,useState} from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import SendoutDetailItems from "./SendoutDetailItems";
import CheckBoxOn from "assets/sendout/checkBox_on.svg";
import CheckBoxOff from "assets/sendout/checkBox_off.svg";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

export default function SendoutContent({data,checked,handleChecked,handleClick,view}) {
  
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
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
    <ContentsBox active={isdrawer}>
      <ContentsTitle>
        <ContentsTitleText
          onClick={() => handleChecked(data.date,leftData, leftData.length,leftShowroomData)}
        >
          {dayjs.unix(data.date).format("M/DD(ddd)")}
          <img
            src={ op.length > 0 ? CheckBoxOn : CheckBoxOff}
            alt=""
            style={{ marginLeft: "10px" }}
          />
        </ContentsTitleText>
        {/* <ContentsTitleSum>{data.each_list.length}</ContentsTitleSum> */}
      </ContentsTitle>
      <ItemWrap active={isdrawer}>
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
  display: flex;
  width:100%;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1200px" : "960px")};        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "630px")};    
  } 
  padding: 23px 23px 13px 23px;
`;

const ContentsTitle = styled.div`
  width: 130px;
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
  font-size: 70px;
  font-weight: bold;
  color: #7ea1b2;
  display: flex;
  align-items: center;
  height: 100px;
`;

const ItemWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-left:20px;
  width:100%;
  @media (min-width: 1920px) {
    min-width: 1350px;    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1050px" : "800px")};        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "750px" : "580px")};    
  } 
`;
