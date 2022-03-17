import React, { useState } from "react";
import styled, { css } from "styled-components";
import { darken, lighten } from "polished";
import { useHistory } from "react-router-dom";
import SyncIcon from "@material-ui/icons/Sync";
import {Box} from "@material-ui/core";
import Items from "./Items";
import SelectSeason from "./SelectSeason";

import NoticeIcon from "assets/notice_icon.png";
import FilterIcon from "assets/filter_icon.png";
import TooltipIcon from "assets/information_icon.png";
import SelectDownIcon from "assets/select_down_icon.png";
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";

export default function DigitalShowroomItems({
  selectBtn = false,
  data,
  seasonData,
  currentBrandId,
  currentBrand,
  brandNotice,
  select,
  selectData,
  season,
  handleSelectData,
  handleCreate,
  handleChangeSeason,
  handleFavShowroom,
  handleBrandsBtn,
  handleFilterBtn,
  handleShowroomClick,
  handleSelectBtn = null,
}) {
  const history = useHistory();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const handleClick = (detailYn, editYn, idx) => {
    if (detailYn && !editYn) {
      history.push("/magazine/digital_showroom/detail/" + idx);
    } else {
      history.push("/magazine/digital_showroom/edit/" + idx);
    }
  };
  const [viewOpen, setViewOpen] = useState(false);

  const handleToggleClick = (view) => {
    setViewOpen(view)
  }
  const handleToggleClick2 = () => {
    if ( viewOpen ) {
    setViewOpen(false)
    }
  }
  
  if ( currentBrandId !== 'all' ) {
  return (
    <>      
      <TopContainer>
        <SelectWrap active={isdrawer}>
          <LeftWrap>
            <BrandTitle>{!utils.isEmpty(currentBrand.brand_nm)  ? currentBrand.brand_nm : null}</BrandTitle>
            {seasonData.length > 0  &&
              <SelectSeason
                value={season}
                options={seasonData}
                handleChange={handleChangeSeason}
              />
            }
          </LeftWrap>
          
          <ContactWrap active={isdrawer}>
            <ContactTopWrap>
              { data.pages[0].total_count > 0  &&
              <AddBtn onClick={handleSelectBtn}>
                  <div>홀딩 요청</div>
                </AddBtn>
              }
              
              <AddBtn onClick={handleBrandsBtn}>
                <div>BRANDS</div>
              </AddBtn>
              { data.pages[0].total_count > 0  &&
                <OptBtn width="106px" onClick={handleFilterBtn}>
                  <OptBtnImgWrap>
                    <img src={FilterIcon} alt="filter" />
                  </OptBtnImgWrap>
                  <OptTxtWrap>Filter</OptTxtWrap>
                </OptBtn>                
              }
            </ContactTopWrap>
            {/* <ContactMiddleWrap>
              { ( brandNotice?.notice !== "" && brandNotice?.notice !== null && currentBrandId !== 'all' ) && (
              <NoticeWrap>
                <ImgWrap>
                  <ImgDiv src={NoticeIcon} alt="notice" />
                </ImgWrap>
                <div>{brandNotice.notice}</div>
              </NoticeWrap>
            )}
            </ContactMiddleWrap> */}
            {/* {
              ( data.pages[0].total_count > 0  && currentBrandId !== 'all' ) &&
              <ContactBottomWrap>
                <ContactTxt>문의 : {brandNotice.inquiry_number}</ContactTxt>
                <ContactTxt>|</ContactTxt>
                <ContactTxt>
                  쇼룸 : {!utils.isEmpty(brandNotice.inquiry_charge) && (" "+brandNotice.inquiry_charge)}
                  {" "+utils.phoneFormat(brandNotice.showroom_inquiry_contact)}
                  {!utils.isEmpty(brandNotice.showroom_inquiry_email) && (" "+brandNotice.showroom_inquiry_email)}
                </ContactTxt>
              </ContactBottomWrap>
            } */}
          </ContactWrap>
        </SelectWrap>
        <NoticeOuterWrap>
          <ContactMiddleWrap active={isdrawer}>
            { ( brandNotice?.notice !== "" && brandNotice?.notice !== null && currentBrandId !== 'all' ) && (
            <NoticeWrap>
              <ImgWrap>
                <ImgDiv src={NoticeIcon} alt="notice" />
              </ImgWrap>
              <div>{brandNotice.notice}</div>
            </NoticeWrap>
            )}
          </ContactMiddleWrap>
        </NoticeOuterWrap>
        <InquiryOuterWrap>
          {
            ( data.pages[0].total_count > 0  && currentBrandId !== 'all' ) &&
            <ContactBottomWrap>
              <ContactTxt>소비자문의 : {brandNotice.inquiry_number}</ContactTxt>
              <ContactTxt>|</ContactTxt>
              <ContactTxt>
                쇼룸문의 : {!utils.isEmpty(brandNotice.inquiry_charge) && (" "+brandNotice.inquiry_charge)}
                {" "+utils.phoneFormat(brandNotice.showroom_inquiry_contact)}
                {!utils.isEmpty(brandNotice.showroom_inquiry_email) && (" "+brandNotice.showroom_inquiry_email)}
                {!utils.isEmpty(brandNotice.inquiry_charge2) && 
                <span style={{justifyContent:'center',alignItems:'center',cursor:'pointer'}}>
                  {"  "}<img src={SelectDownIcon} alt="more" onClick={() => handleToggleClick(!viewOpen)} style={{height:15}} />
                </span>
                
                }
                {
                  viewOpen && (
                  <Popup active={isdrawer}>
                      <PopupMenus >
                        추가담당자
                      </PopupMenus>
                      <PopupMenus2>
                        {!utils.isEmpty(brandNotice.inquiry_charge2) && (" "+brandNotice.inquiry_charge2)}
                        {" "+utils.phoneFormat(brandNotice.showroom_inquiry_contact2)}
                        {!utils.isEmpty(brandNotice.showroom_inquiry_email2) && (" "+brandNotice.showroom_inquiry_email2)}
                      </PopupMenus2>
                      { !utils.isEmpty(brandNotice.inquiry_charge3) &&
                      <PopupMenus>
                        추가담당자
                      </PopupMenus>
                      }
                      { !utils.isEmpty(brandNotice.inquiry_charge3) &&
                      <PopupMenus2>
                        {brandNotice.inquiry_charge3}
                        {" "}{brandNotice.showroom_inquiry_contact3}
                        {" "}{brandNotice.showroom_inquiry_email3}
                      </PopupMenus2>
                      }
                  </Popup>
                  )                
                }
              </ContactTxt>
            </ContactBottomWrap>
          }
        </InquiryOuterWrap>
        <Container>
          {
            data.pages.length > 0 ? 
            data.pages.map((group) =>
              group.list.length >  0 ? 
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
                  currentBrandId={currentBrandId}
                />
              ))
              :
              <Box bgcolor={"#f6f6f6"} width="100%">
                <Box
                  minHeight={"40vh"}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  fontSize={20}
                >
                  준비중입니다.
                </Box>
              </Box>
            )
            :
            <Box bgcolor={"#f6f6f6"} width="100%">
              <Box
                minHeight={"40vh"}
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize={20}
              >
                준비중입니다.
              </Box>
            </Box>
            
          }
        </Container>
      </TopContainer>
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
  }else{
    return (
      <>
        <SelectWrap active={isdrawer}>
          <LeftWrap>          
            <BrandTitle>전체</BrandTitle>          
            {seasonData.length > 0  &&
              <SelectSeason
                value={season}
                options={seasonData}
                handleChange={handleChangeSeason}
              />
            }
          </LeftWrap>
          <ContactWrap active={isdrawer}>
            <ContactTopWrap>
              <Info><img src={TooltipIcon} alt="tooltip"  style={{height:"30px"}} /></Info>
              <InfoTooltip>
                <div>브랜드{" "}선택{" "}후{" "}홀딩{" "}요청이{" "}가능합니다.{" "}(브랜드{" "}별)</div>
              </InfoTooltip>
              <AddBtn onClick={handleBrandsBtn}>
                <div>BRANDS</div>
              </AddBtn>              
              <OptBtn width="106px" onClick={handleFilterBtn}>
                <OptBtnImgWrap>
                  <img src={FilterIcon} alt="filter" />
                </OptBtnImgWrap>
                <OptTxtWrap>Filter</OptTxtWrap>
              </OptBtn>               
              
            </ContactTopWrap>            
          </ContactWrap>
        </SelectWrap>
        <Container>
          {
            data.pages.length > 0 ? 
            data.pages.map((group) =>
              group.list.length >  0 ? 
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
                  currentBrandId={currentBrandId}
                />
              ))
              :
              <Box bgcolor={"#f6f6f6"} width="100%">
                <Box
                  minHeight={"40vh"}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  fontSize={20}
                >
                  준비중입니다.
                </Box>
              </Box>
            )
            :
            <Box bgcolor={"#f6f6f6"} width="100%">
              <Box
                minHeight={"40vh"}
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize={20}
              >
                준비중입니다.
              </Box>
            </Box>
          }
        </Container>
      </>
    )
  }
}

const TopContainer = styled.div`

`;
const SelectWrap = styled.div`
  margin-bottom: 12px;  
  display: flex;
  justify-content: space-between;
  width:99%;
`;

const ContactWrap = styled.div`
  min-width:40%;
`;
const ContactTopWrap = styled.div`
  width:100%;
  display:flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom:10px;
  
`;
// width: ${(props) => (props.active ? "calc(100%-100px)" : "calc(100%-450px)")};
const ContactMiddleWrap = styled.div`
  width: calc( 100%-100px );
  left:0;
  height:30px;
  display:flex;
  align-items: center;
  justify-content: flex-start;
  overflow:hidden;  
  
`;
const InfoTooltip = styled.span`
  position: absolute;
  top: 150px;
  visibility: hidden;
  background-color: #7ea1b2;
  padding: 10px;
  opacity: 0;
  transition: all 0.5s;
  color:white;
`;
const Info = styled.div`
  margin-right:10px;
  &:hover {
    & + span {
      visibility: visible;
      opacity: 0.8;
    }
  }
`
const ContactBottomWrap = styled.div`
  display:flex;
  flex:1;
  align-items: center;  
`;


const ContactTxt = styled.div`
  align-items: center;
  justify-content: center;
  font-size: 18px;
  & + & {
    margin-left: 10px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  width:99%;
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
const LeftWrap = styled.div`
  
  margin-left:10px;
  z-index:5;
`;
const NoticeOuterWrap = styled.div`
  width:98%;
  margin-left:10px;    
`;
const InquiryOuterWrap = styled.div`
  width:98%;
  margin-left:10px;  
  margin-bottom:20px;

`;
const BrandTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
  padding-left:5px;
`;

const NoData = styled.div`
  display: flex;
  height: 500px;
  align-items: center;
  justify-content: center;
`;

const NoticeWrap = styled.div`
  display: flex;
  align-items: flex-end;
  font-size: 18px;
  cursor: pointer;
  margin-left: 5px;
  width:96%;
  overflow:hidden;  
  text-overflow: ellipsis;
  white-space: nowrap;  
`;

const ImgWrap = styled.div`
  height: 24px;
`;

const ImgDiv = styled.img`
  width: 20px;
  margin-right: 10px;
`;


const Popup = styled.div`
  position: absolute;
  top: 360px;
  left: ${(props) => (props.active ? "240px" : "510px")}; 
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 170px;
  border: solid 1px #dddddd;
  background-color: #ffffff;
  padding: 10px 0px;
  z-index:10;
  overflow:auto;  
`;

const PopupMenus = styled.div`
  font-size: 18px;
  font-weight: 500;
  padding: 5px 20px;
`;

const PopupMenus2 = styled.div`
  font-size: 15px;
  font-weight: 500;
  padding: 5px 30px 10px 30px;
  color:#555555;
`;
const AddBtn = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background-color: #555;
  min-width: 100px;
  height: 40px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 16px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);
  margin-right: 12px;
  &:hover {
    background-color: ${lighten(0.3, "#000000")};
  }

  &:active {
    background-color: ${lighten(0.5, "#000000")};
  }
`;


const OptBtn = styled.div`
  display: flex;
  width: ${(props) => props.width || "120px"};
  height: 40px;
  border-radius: 5px;
  border: solid 1px #dddddd;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  cursor: pointer;
  transition: all 0.3s;

  & + & {
    margin-left: 12px;
  }

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }

  &:active {
    background-color: ${darken(0.2, "#ffffff")};
  }
`;

const OptBtnImgWrap = styled.div`
  margin-right: 8px;
  display: flex;
`;

const OptTxtWrap = styled.div``;
