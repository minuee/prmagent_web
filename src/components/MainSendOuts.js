import React, { useCallback,useState,useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";
import 'moment/locale/ko';
import moment from "moment";
import isImageUrl from "is-image-url";

import SendOutsIcon from "assets/send_outs.png";
import NoimgLogo from "assets/noimage/noimg_logo_b.svg";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Scrollbar } from "swiper";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/scrollbar/scrollbar.scss"; // *
import Constants from 'utils/constants';
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";

SwiperCore.use([Navigation, Scrollbar]);

function MainSendOut({ data = null, title, subTitle, type = "brand" }) {
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const history = useHistory();
  const handleClick = useCallback(
    (each_data,sdata) => {
      const now = new Date();
      const dayjsDate2 = new Date(now.setDate(now.getDate()+1)).getTime();//dayjs().subtract(10, 'day');    
      const sdate = moment().unix();
      if (type === "brand") {
        history.push("/brand/send_outs/req/" + each_data.req_no + "/sendout");
      }
      if (type === "magazine") {
        //history.push("/magazine/pickup/req/" + req_no + "/pickups");
        console.log('sdatasdata',sdata,each_data.req_no)
        if ( sdata.length > 0) {
          let viewType = "sendout";
          let reqNoData = [];
          let newSdata = sdata.filter((item) => item.req_no == each_data.req_no).map( item => {
            return item.showroom_no
          });
          console.log('newSdata',newSdata)
          history.push({
            //pathname: "/magazine/send_outs/" + sdate + "/" + viewType,
            pathname: "/magazine/pickup_single/" + sdate + "/" + viewType,
            state: {
              newArr : sdate,
              viewType : viewType,
              screenState : [{date: sdate, showroom_list : newSdata, req_no_list : [each_data.req_no]}]
            }
          });
        }else{
          history.push("/magazine/pickup/req/" + each_data.req_no + "/sendout/" + each_data.showroom_no);
        }
      }
      if (type === "stylist") {
        history.push("/stylist/pickup/req/" + each_data.req_no + "/sendout/" + each_data.showroom_no);        
      }
    },
    [type]
  );

  const [leftData, setLeftData] = useState([]);
  const [leftShowroomData, setLeftShowroomData] = useState([]);
  useEffect(async() => {
    const targetData = utils.isEmpty(data[0]?.each_list) ?[] : data[0].each_list;
    let newLeftIdxArray = [];
    let newLeftShowroomIdxArray = [];
    let newLeftArray = [];    
    await targetData.forEach((element) => {
      let req_no = element.showroom_list[0].req_no;
      if ( !newLeftIdxArray.includes(req_no)) {
        newLeftIdxArray.push(req_no);
        newLeftArray.push(element)
      }
      if ( !newLeftShowroomIdxArray.includes(req_no)) {
        newLeftShowroomIdxArray.push({req_no :req_no, showroom_no: element.showroom_list[0].showroom_no});
      }
    })          

    setLeftData(newLeftArray);
    setLeftShowroomData(newLeftShowroomIdxArray);
  }, []);

  //const targetData = utils.isEmpty(data[0]) ? [] : data[0].each_list;
  return (
    <>
      {data !== null && (
        <>
          <SampleWrap>
            <TxtWrap fontSize={Constants.titleFontSize} fontWeight="300" marginRight="12px">
              {title}
            </TxtWrap>
            <TxtWrap fontSize={Constants.titleFontSize} fontWeight="bold" style={{ display: "flex",alignItems:'center' }}>
              {subTitle}
              <img src={SendOutsIcon} alt="letter" style={{width:'35px',marginLeft:'10px'}} />              
            </TxtWrap>
          </SampleWrap>

          <NewRequestWrap isdrawer={isdrawer} >
            <RequestCntWrap>
              <TxtWrap
                fontSize="100px"
                lineHeight="1.2"
                color="#b2827e"
                textAlign="center"
                fontWeight="900"
              >
                {leftData.length}
              </TxtWrap>
            </RequestCntWrap>
            <StyledSwiper 
              isdrawer={isdrawer}  
              spaceBetween={10} 
              slidesPerView={leftData.length < 3 ? 1 : 2} 
              navigation
            >
              {leftData.map((item, i) => {
                const subItem = item.showroom_list[0];
                return (
                <SwiperSlide key={i}>
                  <CardWrap onClick={() => handleClick(subItem,leftShowroomData)}>
                    <CardImgCopm>
                      {
                        subItem.target_id_type === 'RUS000' ?
                        <img src={isImageUrl(subItem.brand_logo_adres) ? subItem.brand_logo_adres : NoimgLogo} alt="logo"/>
                        :
                        subItem.target_id_type === 'RUS001' ?
                        <img src={isImageUrl(subItem.mgzn_logo_adres) ? subItem.mgzn_logo_adres2 : NoimgLogo} alt="logo"/>
                        :
                        <img src={isImageUrl(subItem.mgzn_logo_adres) ? subItem.mgzn_logo_adres : NoimgLogo} alt="logo"/>
                      }                      
                    </CardImgCopm>
                    <CardComp>
                      <TxtWrap fontSize="15px" color="#999999">
                        {subItem.req_user_nm}{utils.isEmpty(subItem.req_user_position) ? ""  : subItem.req_user_position} →
                      </TxtWrap>
                    </CardComp>
                    <CardComp>
                      <TxtWrap fontSize="18px" fontWeight="bold">
                      {subItem.target_user_nm}{utils.isEmpty(subItem.target_user_position) ? "" : subItem.target_user_position}
                      </TxtWrap>
                    </CardComp>
                    {/* <CardComp>
                      <TxtWrap fontSize="13px">
                        {dayjs.unix(data[0].date).format("YYYY-MM-DD")} <TxtWrap fontSize="11px" color="#999999">ReqNo:{subItem.req_no}</TxtWrap>
                      </TxtWrap>
                    </CardComp> */}
                    
                  </CardWrap>
                </SwiperSlide>
                )
              })}
            </StyledSwiper>
          </NewRequestWrap>
        </>
      )}
    </>
  );
}

const SampleWrap = styled.div`
  width:98%;
  display: flex;
  margin-bottom: 34px;
  
`;

const NewRequestWrap = styled.div`
  width:98%;
  display: flex;
  align-items: center;
  height: 200px;
  border-radius: 15px;
  background-color: #b2827e33;
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
`;

const CardImgCopm = styled.div`
  margin-bottom: 15px;
  height: 35px;

  > img {
    max-width: 240px;
    max-height: 35px;
    min-height: 35px;
  }
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
    background: #b2827e33;
    border: solid 2px #ffffff;
    color: #ef4444;
  }
  .swiper-button-prev {
    left: 0;
    right: auto;
    top: 22px;
    width: 40px;
    height: 160px;
    background: #b2827e33;
    border: solid 2px #ffffff;
    color: #ef4444;
  }

  .swiper-button-prev.swiper-button-disabled,
  .swiper-button-next.swiper-button-disabled {
    opacity: 0;
  }
`;

export default React.memo(MainSendOut);
