import React from "react";
import styled from "styled-components";
import { darken } from "polished";
import { useHistory } from "react-router-dom";

import Items from "./Items";
import SelectSeason from "./SelectSeason";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";


export default function DigitalShowroomItems({
  data,
  seasonData,
  currentBrand,
  brandNotice,
  select,
  selectData,
  season,
  handleSelectData,
  handleCreate,
  handleChangeSeason,
  handleFavShowroom,
}) {
  const history = useHistory();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  

  const handleClick = (detailYn, editYn, idx) => {
    if (detailYn && !editYn) {
      history.push("/stylist/digital_showroom/detail/" + idx);
    } else {
      history.push("/stylist/digital_showroom/edit/" + idx);
    }
  };

  return (
    <>
      {data.pages[0].total_count > 0 ? (
        <>
          <SelectWrap active={isdrawer}>
            <LeftWrap>
              <BrandTitle>{currentBrand.brand_nm}</BrandTitle>
              <SelectSeason
                value={season}
                options={seasonData}
                handleChange={handleChangeSeason}
              />
            </LeftWrap>
            <ContactWrap>
              <ContactTxt>문의 : {brandNotice.inquiry_number}</ContactTxt>
              <ContactTxt>|</ContactTxt>
              <ContactTxt>
                쇼룸 : {brandNotice.showroom_inquiry_contact}
              </ContactTxt>
            </ContactWrap>
          </SelectWrap>

          <Container>
            {data.pages.map((group) =>
              group.list.map((d) => (
                <Items
                  key={d.showroom_no}
                  data={d}
                  season={season}
                  select={select}
                  selectData={selectData}
                  handleClick={handleClick}
                  handleSelectData={handleSelectData}
                  handleFavShowroom={handleFavShowroom}
                />
              ))
            )}
          </Container>
        </>
      ) : (
        <NoData>조회된 데이터가 없습니다.</NoData>
      )}
      {selectData.length > 0 && (
        <SelectInfoWrap>
          <SelectIconTxtWrap>
            <SelectInfoTxt1>Total</SelectInfoTxt1>
            <SelectInfoTxt2>Number of Samples</SelectInfoTxt2>
            <SelectInfoTxt1>Selected :</SelectInfoTxt1>
            <SelectInfoTxt3>{selectData.length}</SelectInfoTxt3>
          </SelectIconTxtWrap>
          <SelectIconBtnWrap>
            <CreateBtn onClick={handleCreate}>Request Samples</CreateBtn>
          </SelectIconBtnWrap>
        </SelectInfoWrap>
      )}
    </>
  );
}

const SelectWrap = styled.div`
  margin-bottom: 32px;  
  display: flex;
  justify-content: space-between;
  @media (min-width: 1920px) {
    width: 1480px;   
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
      width: 950px; 
  }
  @media (min-width: 10px) and (max-width: 1439px) {
      width: 600px;      
  }  
`;

const ContactWrap = styled.div`
  display: flex;
`;

const ContactTxt = styled.div`
  font-size: 18px;

  & + & {
    margin-left: 10px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  @media (min-width: 1920px) {
    width: 1480px;   
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
      width: 1030px; 
  }
  @media (min-width: 10px) and (max-width: 1439px) {
      width: 600px;      
  }  
`;

const SelectInfoWrap = styled.div`
  width: 727px;
  height: 120px;
  border: solid 1px #dddddd;
  box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  position: fixed;
  bottom: 0px;
  right: 60px;
  border-radius: 20px 20px 0 0;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  z-index: 5;
`;

const SelectIconTxtWrap = styled.div`
  display: flex;
`;

const SelectIconBtnWrap = styled.div`
  display: flex;
  align-items: center;
`;

const SelectInfoTxt1 = styled.div`
  font-size: 20px;
  display: flex;
  align-items: center;
  margin-right: 8px;
`;
const SelectInfoTxt2 = styled.div`
  font-size: 20px;
  font-weight: 900;
  display: flex;
  align-items: center;
  margin-right: 8px;
`;
const SelectInfoTxt3 = styled.div`
  font-size: 72px;
  font-weight: 900;
  color: #7ea1b2;
  display: flex;
  align-items: center;
`;

const CreateBtn = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background-color: #000000;
  padding: 0 24px;
  height: 50px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 16px;
  cursor: pointer;
  margin-right: 20px;
  transition: all 0.3s;

  &:hover {
    background-color: ${darken(0.7, "#ffffff")};
  }

  &:active {
    background-color: ${darken(0.8, "#ffffff")};
  }
`;
const LeftWrap = styled.div``;
const BrandTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const NoData = styled.div`
  display: flex;
  height: 500px;
  align-items: center;
  justify-content: center;
`;
