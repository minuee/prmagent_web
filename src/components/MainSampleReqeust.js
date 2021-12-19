import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";
import isImageUrl from "is-image-url";

import Letter from "assets/letter.png";
import NoimgLogo from "assets/noimage/noimg_logo_b.svg";
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Scrollbar } from "swiper";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/scrollbar/scrollbar.scss"; // *

import Constants from '../utils/constants';
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

SwiperCore.use([Navigation, Scrollbar]);

function MainSampleRequest({ data = null, title, subTitle, type = "brand" }) {
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  //console.log('MainSampleRequest',isdrawer)
  const history = useHistory();
  const handleClick = useCallback(
    (req_no) => {
      if (type === "brand") {
        history.push("/brand/sample_requests/req");
      }
      if (type === "magazine") {
        history.push("/magazine/sample_requests/detail/" + req_no);
      }
      if (type === "stylist") {
        history.push("/stylist/sample_requests/detail/" + req_no);
      }
    },
    [type]
  );

  return (
    <>
      {data !== null && (
        <>
          <SampleWrap isdrawer={isdrawer}>
            <TxtWrap fontSize={Constants.titleFontSize} fontWeight="300" marginRight="12px">
              {title}
            </TxtWrap>
            <TxtWrap fontSize={Constants.titleFontSize} fontWeight="bold" style={{ display: "flex" ,alignItems:'center',}}>
              {subTitle}
              <img src={Letter} alt="letter" style={{width:'35px',marginLeft:'10px'}} />
            </TxtWrap>
          </SampleWrap>
          <NewRequestWrap isdrawer={isdrawer}>
            <RequestCntWrap>
              <TxtWrap
                fontSize="100px"
                lineHeight="1.2"
                color="#7ea1b2"
                textAlign="center"
                fontWeight="900"
              >
                {data.length}
              </TxtWrap>
            </RequestCntWrap>
            <StyledSwiper isdrawer={isdrawer} spaceBetween={10} slidesPerView={isdrawer ? 2 : 1} navigation>
              {data.map((d, i) => (
                <SwiperSlide key={`${d.req_no}_${i}`}>
                  <CardWrap onClick={() => handleClick(d.req_no)}>
                    <CardImgCopm>
                      <img
                        src={
                          isImageUrl(d.logo_url_adres)
                            ? d.logo_url_adres
                            : NoimgLogo
                        }
                        style={{maxWidth: '240px',maxHeight: '35px',minHeight: '35px'}}
                        alt="logo"
                      />
                    </CardImgCopm>
                    <CardComp>
                      <TxtWrap fontSize="18px" fontWeight="bold">
                        {d.editor_nm} {d.editor_posi}
                      </TxtWrap>
                    </CardComp>
                    <CardComp>
                      <TxtWrap fontSize="16px">
                        {d.brand_cnfirm_dt === null
                          ? "-"
                          : dayjs.unix(d.brand_cnfirm_dt).format("YYYY-MM-DD")}
                      </TxtWrap>
                    </CardComp>
                    <CardComp>
                      <TxtWrap fontSize="12px" color="#999999">
                        {d.company_nm}
                      </TxtWrap>
                    </CardComp>
                  </CardWrap>
                </SwiperSlide>
              ))}
            </StyledSwiper>
          </NewRequestWrap>
        </>
      )}
    </>
  );
}

const SampleWrap = styled.div`
  width: 98%;
  display: flex;
  margin-bottom: 34px;  
`;

const NewRequestWrap = styled.div`
  width: 98%;
  display: flex;
  align-items: center;
  height: 200px;
  border-radius: 15px;
  background-color: #7ea1b233;
  padding: 16px 30px;
  margin-bottom: 60px;
`;

const RequestCntWrap = styled.div`
  min-width: 104px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 66px;
`;

const ImgWrap = styled.div`
  margin-left: 8px;   
  align-items: center;
  justify-content: center;  
`;

const TxtWrap = styled.div`
  font-size: ${(props) => props.fontSize || "12px"};
  color: ${(props) => props.color || "#000000"};
  font-weight: ${(props) => props.fontWeight || "normal"};
  margin-right: ${(props) => props.marginRight || 0};
  line-height: ${(props) => props.lineHeight || "unset"};
  text-align: ${(props) => props.textAlign || "left"};
`;

const CardWrap = styled.div`
  width: 240px;
  height: 160px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-sizing: border-box;
  cursor: pointer;

  .img {
    max-height: 38px;
  }
`;

const CardComp = styled.div`
  margin-bottom: 5px;
  display:flex;
  align-items: center;
  justify-content: center;
`;

const CardImgCopm = styled.div`
  display:flex;
  margin-bottom: 15px;  
  height: 35px;
  align-items: center;
  justify-content: center;
  
`;

const StyledSwiper = styled(Swiper)`
  width:95%;
  
  height: 160px;
  .swiper-slide {
    width: 240px !important;
    min-width: 240px;
  }
  .swiper-button-next {
    right: 0;
    left: auto;
    top: 22px;
    width: 40px;
    height: 160px;
    background: #7ea1b233;
    border: solid 2px #ffffff;
  }
  .swiper-button-prev {
    left: 0;
    right: auto;
    top: 22px;
    width: 40px;
    height: 160px;
    background: #7ea1b233;
    border: solid 2px #ffffff;
  }

  .swiper-button-prev.swiper-button-disabled,
  .swiper-button-next.swiper-button-disabled {
    opacity: 0;
  }
`;

export default React.memo(MainSampleRequest);
