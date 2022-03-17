import React,{useEffect,useState} from "react";
import styled, { css } from "styled-components";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import utils from "utils";
import isImageUrl from "is-image-url";
import NoimgLogo from "assets/noimage/noimg_logo_b.svg";
import { ConsoleView } from "react-device-detect";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import Constants from '../../../utils/constants';


export default function SendoutDetailItems({data,sdata=[],sdate,idx = null,handleClick = false, view,viewMode=null}) {  
  const data2 = viewMode === 'new' ? data.showroom_list[0] : data;    
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const [leftroomData, setShowroomData] = useState([]);
 /*  useEffect(async() => {
    let newShowroomIdxArray = [];
    sdata.forEach((element) => {
      if ( data2.req_no == element.reqNo) {
        newShowroomIdxArray.push(element.showroom_no);
      }
    })          
    setShowroomData(newShowroomIdxArray);
  }, [data]); */
  console.log('1111',data2)
  return (
    <Container
      link={idx !== null ? true : false}
      onClick={() => handleClick(data2,idx,sdata,sdate)}
      active={isdrawer}
    >
      {/* <Head bg={data2.brand_color || "#ddd"}>
        <img src={isImageUrl(data2.mgzn_logo_adres) ? data2.mgzn_logo_adres : NoimgLogo } alt="mgzn_logo" />
      </Head> */}
      {  (view === "Send Out" || view === "sendout" )? 
      <Head bg={data2.sendout_yn ? data2.mgzn_color || "#ddd" : Constants.nonCheckColor}>
        <img src={isImageUrl(data2.mgzn_logo_adres) ? data2.mgzn_logo_adres : NoimgLogo } alt="mgzn_logo" />
      </Head>
      :
      <Head bg={ ( data2.returncheck_yn || (data2.return_yn && data2.return_user_magazine )) ? data2.mgzn_color || "#ddd" : Constants.nonCheckColor}>
        <img src={isImageUrl(data2.mgzn_logo_adres) ? data2.mgzn_logo_adres : NoimgLogo } alt="mgzn_logo" />
      </Head>
      }

      {
        (view === "Send Out" || view === "sendout" )?
        <Contents>
          <div className="title">
            <div>
              {data2.target_user_nm} {data2.target_user_position}
              {data2.target_id_type === 'RUS001' && "("+data2.target_company_nm +")"}
            </div>
            <ArrowRightAltIcon />
          </div>
          <div className="sub">
            {data2.req_user_nm} {data2.req_user_position}
          </div>
         {/*  <div className="sub2">
            SNo {data2.req_no} 
          </div> */}
        </Contents>
        :
        <Contents>
        <div className="title">
          <div>
            {data2.req_user_nm} {utils.isEmpty(data2.req_user_position) ? data2.brand_nm  : data2.req_user_position}
          </div>
          <ArrowRightAltIcon />
        </div>
        <div className="sub">          
          {data2.target_user_nm} {data2.target_user_position}  
          {data2.target_id_type === 'RUS001' && "("+data2.target_company_nm +")"}
        </div>
        {/* <div className="sub2">
          SNo {data2.req_no} 
        </div> */}
      </Contents>
    }
    </Container>
  );
}

const Container = styled.div`
  width: 168px;
  height: 120px;
  border-radius: 10px;
  border: solid 2px #f3f3f3;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 20px;
  cursor: pointer; 
  
  ${(props) =>
    props.link &&
    css`
      cursor: pointer;
    `}
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  background-color: ${(props) => props.bg || "#ffffff"};

  > img {
    max-width: 140px;
    max-height: 25px;
  }
`;

const Contents = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;

  .title {
    display: flex;
    height: 20px;
    align-items: center;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 5px;
    width: 138px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    > svg {
      margin-bottom: 3px;
    }
  }
  .sub {
    font-size: 13px;
    font-weight: 500;
    width: 138px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sub2 {
    font-size: 12px;
    color:#999999;
    font-weight: 300;
    width: 138px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
