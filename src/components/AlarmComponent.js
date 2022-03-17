import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "react-query";
import { apiObject } from "api/api_brand";


import AlarmIcon01 from "../assets/alarm_01.png";
import AlarmIcon02 from "../assets/alarm_02.png";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";


/* const handleDetail = (no) => {
  history.push("/magazine/sample_requests/detail/" + no);
}; */

export default function AlarmComponent({data,odd,type = "brand",handleDelete}) {  
  dayjs.extend(relativeTime);
  const history = useHistory();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);


  const handleSampleRequest = async(data) => {    
    const {notice_type,notice_notifi_no, req_no, date_info } = data;
    console.log("handleSampleRequest...",data);
    let showroomData = [];
    let pickup_date = null;
    let return_date = null;
    let shoting_date = null;
    let selectEachList = null;
    if ( !utils.isEmpty(date_info)) {
      await date_info.forEach((subItem,i) => {
          if ( subItem.req_no === req_no ) {
            showroomData.push(subItem.showroom_no);
            pickup_date = subItem.pickup_date;
            return_date = subItem.return_date;
            shoting_date = subItem.shoting_date;
          }
        }
      )
    }
    console.log("notice_type",notice_type,type)
    if (type === "brand") {
      if (notice_type === "req" || notice_type === 'confirm' || notice_type === 'confirmchange' || notice_type === 'cancel' ) {
        history.push("/brand/sample_requests/detail/" + req_no);
      } else if (notice_type === "return" || notice_type === "sendout"  ) {
        handleEachDetailBrand('return',req_no,showroomData,return_date)
      }else if ( notice_type === 'pickup' ||  notice_type === 'notpickup' ) {
        console.log("notice_typ22222e",req_no,showroomData,return_date); 
        handleEachDetailBrand('sendout',req_no,showroomData,return_date)
      } else if ( type === 'returncheck') {
        history.push("/brand/sample_requests/req");
      } else if (notice_type === "cms" ) {
        history.push("/brand/notice/"+data.notice_id);
      } else if (notice_type === "subscribe" ) {
         if ( !utils.isEmpty(notice_notifi_no)) {
          apiObject.getNoticeReadCheck(notice_notifi_no)
        }
        utils.customAlert('해당내용은 상세페이지를 제공하지 않습니다.');
        return;
      } else {
        console.log("Wrong notice type");
      }
    } else if (type === "magazine") {
      if (notice_type === "req" || notice_type === 'confirm' ) {
        history.push("/magazine/sample_requests/detail/" + req_no);
      } else if (notice_type === "cms" ) {
        history.push("/magazine/notice/"+data.notice_id);
      } else if (notice_type === "showroom" ) {
        history.push("/magazine/digital_showroom/detail/" + data.notice_id);
      } else if (notice_type === "notpickup" || notice_type === 'sendout'  ) {
        handleEachDetailMagazine('pickups',req_no,showroomData,pickup_date)
      } else if (notice_type === "pickup" ) {
        handleEachDetailMagazine2('sendout',req_no,showroomData,return_date)
      } else if ( notice_type === 'confirmchange') {
        handleEachDetailMagazine('pickups',req_no,showroomData,shoting_date)
      } else if ( notice_type === 'returncheck' || notice_type === "return" ) {    
        //console.log("notice_typ22222e",req_no,showroomData,return_date);  
        handleEachDetailMagazine('sendout',req_no,showroomData,pickup_date)      
      } else if (notice_type === "brand" ) {
        history.push("/magazine/digital_showroom/"+data.brand_id);
      } else if (notice_type === "press" ) {        
        history.push("/magazine/press_release/detail/" + data.notice_id);      
      } else {
        console.log("Wrong notice type",data);
      }
    } else {
      console.log("Wrong type...");
    }
  };
  //handleEachDetail22 20211218000414 ['20210715000167'] 1640563200
/*  0:
 date: 1640563200
req_no_list: ['20211218000414']
showroom_list: ['20210715000167']
 */
  const handleEachDetailBrand = (viewType,req_no,sdata = [],sdate=null) => {       
    if ( sdata.length > 0) {      
      history.push({
        pathname: "/brand/send_outs/" + sdate + "/" + viewType,
        state: {
          newArr : sdate,
          viewType,
          screenState : [{date: sdate, showroom_list : sdata, req_no_list : [req_no]}]
        }
      });
    }
  };

  const handleEachDetailMagazine = (viewType,req_no,sdata = [],sdate=null) => {      
    if ( sdata.length > 0) {
      history.push({
        pathname: "/magazine/pickup/" + sdate + "/" + viewType,
        state: {
          newArr : sdate,
          viewType,
          screenState : [{date: sdate, showroom_list : sdata, req_no_list : [req_no]}]
        }
      });
    }else{
      history.push({
        pathname: "/magazine/pickup_single/" + sdate + "/" + viewType,
        state: {
          newArr : sdate,
          viewType,
          screenState : [{date: sdate, showroom_list : sdata, req_no_list : [req_no]}]
        }
      });
    }
  };

  const handleEachDetailMagazine2 = (viewType,req_no,sdata = [],sdate=null) => {      
    history.push({
      pathname: "/magazine/sendout_single/" + sdate + "/" + viewType,
      state: {
        newArr : sdate,
        viewType,
        screenState : [{date: sdate, showroom_list : sdata, req_no_list : [req_no]}]
      }
    });

  };

  return (
    <>
      <Container>
        <AlarmWrap>
          <AlarmImg src={data.recv_cnfirm_yn ? AlarmIcon02 : AlarmIcon01} alt="" />
          <AlarmTxt>{dayjs.unix(data.send_dt).fromNow()}</AlarmTxt>
        </AlarmWrap>
        <ContentsWrap
          onClick={() => handleSampleRequest(data)}
          active={isdrawer}
          type={type}
        >
          <Title>{data.subj}</Title>
          <SubTitle>{data.cntent}</SubTitle>
          {(data.notice_type == 'subscribe' && data.subscr_begin_de ) &&
          <SubTitle>구독기간 : {dayjs.unix(data.subscr_begin_de).format("YYYY년 MM월 DD일")} ~ {dayjs.unix(data.subscr_end_de).format("YYYY년 MM월 DD일")}</SubTitle>
          }
          <Date>{dayjs.unix(data.send_dt).format("MM월 DD일 A h:mm")}</Date>
          <CloseIconWrap onClick={(e) => e.stopPropagation()}>
            <CloseIcon onClick={() => handleDelete(data.notice_id)} />
          </CloseIconWrap>
        </ContentsWrap>
      </Container>
    </>
  );
}

const Container = styled.div`
  margin-bottom: 24px;
`;

const AlarmWrap = styled.div`
  display: flex;
  align-items: center;
`;

const AlarmImg = styled.img`
  margin-right: 8px;
`;

const AlarmTxt = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const ContentsWrap = styled.div`
  width:95%;
  height: 103px;
  border-radius: 10px;
  border: solid 1px #dddddd;
  margin-left: 40px;
  padding: 16px;
  position: relative;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const SubTitle = styled.div`
  font-size: 14px;
  color: #555555;
  margin-bottom: 8px;
`;

const Date = styled.div`
  font-size: 13px;
  color: #999999;
`;

const CloseIconWrap = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  > svg {
    font-size: 28px;
  }
`;