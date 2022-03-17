import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";

import PrevArrow from "assets/prev_arrow.png";
import NextArrow from "assets/next_arrow.png";
import { apiObject } from "api/api_stylist";
import DetailList from "components/brand/digital_showroom/DetailList";
import Progress from "components/common/progress";
import Constants from 'utils/constants';
export default function DigitalShowroomDetail({ match }) {
  const history = useHistory();

  const { isLoading, data } = useQuery(
    ["stylist-showroom-detail", match.params.item_no],
    async () =>
      await apiObject.getShowroomDetail({ showroom_no: match.params.item_no })
  );

  const handleClick = (no) => {
    history.push("/stylist/digital_showroom/detail/" + no);
  };

  if (isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <Container>
        <Title>
          <Text1>Digital</Text1>
          <Text2>Showroom</Text2>
        </Title>
        <ContentsWrap>
          <BtnWrap>
            {data.prev_showroom_no !== null && (
              <PrevBtn onClick={() => handleClick(data.prev_showroom_no)}>
                <img src={PrevArrow} alt="prev" />
              </PrevBtn>
            )}
          </BtnWrap>
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
          <BtnWrap>
            {data.next_showroom_no !== null && (
              <NextBtn onClick={() => handleClick(data.next_showroom_no)}>
                <img src={NextArrow} alt="next" />
              </NextBtn>
            )}
          </BtnWrap>
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
`;

const Title = styled.div`
  margin-bottom: 60px;
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
`;

const ContentsWrap = styled.div`
  display: flex;
  @media (min-width: 1920px) {
    width: 1480px;   
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: 960px; 
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 600px;
  }   
`;

const BtnWrap = styled.div`
  display: flex;
  min-width: 100px;
  max-width: 100px;
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

const PrevBtn = styled.div`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const NextBtn = styled.div`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;
