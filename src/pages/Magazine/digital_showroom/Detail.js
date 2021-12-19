import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";

import PrevArrow from "assets/prev_arrow.png";
import NextArrow from "assets/next_arrow.png";
import { apiObject } from "api/api_magazine";
import DetailList from "components/magazine/digital_showroom/DetailList";
import Progress from "components/common/progress";
import utils from "utils";
import Constants from 'utils/constants';

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";


export default function DigitalShowroomDetail({ match }) {
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const history = useHistory();
  const handleClick = (no) => {
    history.push("/magazine/digital_showroom/detail/" + no);
  };

  const showroomDetailQuery = useQuery(
    ["showroom-detail", match.params.item_no],
    async () =>
      await apiObject.getShowroomDetail({ showroom_no: match.params.item_no })
  );

  const data = showroomDetailQuery.isLoading ? [] : showroomDetailQuery.data;

  if (showroomDetailQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <Container active={isdrawer}>
        <Title>
          <Text1>Digital</Text1>
          <Text2>Showroom</Text2>
        </Title>
        <ContentsWrap active={isdrawer} dataLength={utils.isEmpty(data.sample_list)?0:data.sample_list.length}>
          <BtnLeftWrap>
            {data.prev_showroom_no !== null && (
              <PrevBtn onClick={() => handleClick(data.prev_showroom_no)}>
                <img src={PrevArrow} alt="prev" style={{width:25}} />
              </PrevBtn>
            )}
          </BtnLeftWrap>
          {data.sample_list.map((v, idx) => (
            <DetailList
              key={idx}
              showroomNm={idx === 0 && data.showroom_nm}
              data={v}
              mainImg={v.sample_image_list.find((d) => d.main_yn).full_url}
              season_year={data.season_year}
              season_text={data.season_text}
            />
          ))}
           <BtnRightWrap>
            {data.next_showroom_no !== null && (
              <NextBtn onClick={() => handleClick(data.next_showroom_no)}>
                <img src={NextArrow} alt="next" style={{width:25}} />
              </NextBtn>
            )}
          </BtnRightWrap>
        </ContentsWrap>
        {/* <BtnWrap>
          {data.prev_showroom_no === null ? (
            <PrevBtn />
          ) : (
            <PrevBtn onClick={() => handleClick(data.prev_showroom_no)}>
              <img src={PrevArrow} alt="prev" />
            </PrevBtn>
          )}
          {data.next_showroom_no !== null && (
            <NextBtn onClick={() => handleClick(data.next_showroom_no)}>
              <img src={NextArrow} alt="next" />
            </NextBtn>
          )}
        </BtnWrap> */}
      </Container>
    </>
  );
}


const Container = styled.div`
  position: relative;
  width:calc(100%-25px);  
`;

const Title = styled.div`
  display:flex;
  margin-bottom: 30px;
  width:calc(100%-25px);
  margin-left:25px;  
`;

const Text1 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: 100;
  line-height: ${Constants.titleFontSize};
  margin-bottom: 10px;
`;

const Text2 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-left: 10px;
`;
const ContentsWrap = styled.div`
  display: ${(props) => (props.dataLength === 0 ? "flex" : "relative")};
  justify-content: ${(props) => (props.dataLength === 0 ? "center" : "flex-start")};  
  width:100%;  
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1920px" : "1560px")};         
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "960px")};      
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width : ${(props) => (props.active ? "100%" : "100%")};    
  } 
`;

const BtnWrap = styled.div`
  display: flex;
  min-width: 50px;
  max-width: 50px;
  margin-top: 325px;
  justify-content: center;
`;

// const BtnWrap = styled.div`
//   position: absolute;
//   top: 425px;
//   display: flex;
//   max-width: 1365px;
//   min-width: 1160px;
//   justify-content: space-between;
//   margin: 0 100px;
// `;


const BtnLeftWrap = styled.div`
  position: fixed;
  top: 200px;    
  z-index:9999;
  justify-content: center;
  width:40px;
  
`;
const BtnRightWrap = styled.div`
  position: fixed;
  top: 200px;
  right : 100px;
  z-index:9999;
  justify-content: center;
  width:40px;
  
`;
const PrevBtn = styled.div`
  display:flex;
  width: 35px;
  height: 35px;
  background-color:#7ea1b2;
  opacity:0.5;
  cursor: pointer;
  justify-content: center;
  align-items:center;
`;

const NextBtn = styled.div`
  display:flex;
  width: 35px;
  height: 35px;
  background-color:#7ea1b2;
  opacity:0.5;
  cursor: pointer;
  justify-content: center;
  align-items:center;
`;