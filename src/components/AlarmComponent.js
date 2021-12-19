import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import AlarmIcon01 from "../assets/alarm_01.png";
import AlarmIcon02 from "../assets/alarm_02.png";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";


/* const handleDetail = (no) => {
  history.push("/magazine/sample_requests/detail/" + no);
}; */

export default function AlarmComponent({
  data,
  odd,
  type = "brand",
  handleDelete,
}) {  
  dayjs.extend(relativeTime);
  const history = useHistory();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const handleSampleRequest = (data) => {
    
    const {notice_type, req_no, data_info } = data;
    if (type === "brand") {
      if (notice_type === "req" || notice_type === 'confirm' || notice_type === 'confirmchange') {
        history.push("/brand/sample_requests/detail/" + req_no);
      } else if (notice_type === "send" || notice_type === "recv" ||  notice_type === 'sendout' ) {
        history.push("/brand/sample_requests/req");
      } else if ( type === 'returncheck') {
        history.push("/brand/sample_requests/req");
      } else if (notice_type === "cms" ) {
        history.push("/brand/notice/"+data.notice_id);
      } else {
        console.log("Wrong notice type");
      }
    } else if (type === "magazine") {
      if (notice_type === "req" || notice_type === 'confirm' || notice_type === 'confirmchange') {
        history.push("/magazine/sample_requests/detail/" + req_no);
      } else if (notice_type === "send" || notice_type === 'sendout' ) {
        history.push("/magazine/sample_requests");
      } else if (notice_type === "recv" || notice_type === 'returncheck') {
        history.push("/magazine/sample_requests");
      } else if (notice_type === "cms" ) {
        history.push("/magazine/notice/"+data.notice_id);
      } else if (notice_type === "brand" ) {
        history.push("/magazine/digital_showroom/"+data.brand_id);
      } else if (notice_type === "press" ) {        
        history.push("/magazine/press_release/detail/" + data.notice_id);
      } else if (notice_type === "showroom" ) {
        history.push("/magazine/digital_showroom/detail/" + data.notice_id);
      } else {
        console.log("Wrong notice type",data);
      }
   /*  } else if (type === "stylist") {
      if (notice_type === "req") {
        history.push("/stylist/sample_requests/detail/" + no);
      } else if (notice_type === "send") {
        history.push("/stylist/sample_requests");
      } else if (notice_type === "recv") {
        history.push("/stylist/sample_requests");
      } else {
        console.log("Wrong notice type");
      } */
    } else {
      console.log("Wrong type...");
    }
  };

  return (
    <>
      <Container>
        <AlarmWrap>
          <AlarmImg src={data.recv_cnfirm_yn ? AlarmIcon01 : AlarmIcon02} alt="" />
          <AlarmTxt>{dayjs.unix(data.send_dt).fromNow()}</AlarmTxt>
        </AlarmWrap>
        <ContentsWrap
          onClick={() => handleSampleRequest(data)}
          active={isdrawer}
          type={type}
        >
          <Title>{data.subj}</Title>
          <SubTitle>{data.cntent}</SubTitle>
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
