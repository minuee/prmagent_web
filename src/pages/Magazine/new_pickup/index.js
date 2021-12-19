import React, { useState } from "react";
import {Box} from "@material-ui/core";
import styled from "styled-components";
import { darken } from "polished";
import moment from "moment";
import { useQuery } from "react-query";
import { Divider } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import Title from "components/magazine/send_outs/TitleNew";
import SendoutContent from "components/magazine/send_outs/SendoutContent";
import { apiObject } from "api/api_magazine";
import Progress from "components/common/progress";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer,currentPickupStartDt,currentPickupEndDt,currentSendOutSelect,currentPickupMenu,currentPickupSelect,selectTarget } from "redux/state";
import { CodeStarNotifications } from "aws-sdk";
import utils from "utils";
import Constants from 'utils/constants';


export default function SendOuts() {
  const history = useHistory();
  //const [view, setView] = useState("Pickups");  
  //const [brandId, setBrandId] = useState(currentPickupSelect);
  //const [startDt, setStartDt] = useState(moment().weekday(0));
  //const [endDt, setEndDt] = useState(moment().weekday(6));
  const [view, setView] = useRecoilState(currentPickupMenu);
  const [brandId, setBrandId] = useRecoilState(currentPickupSelect);
  const [startDt, setStartDt] = useRecoilState(currentPickupStartDt);
  const [endDt, setEndDt] = useRecoilState(currentPickupEndDt);

  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const [checked, setChecked] = useState([]);
  const [paramsChecked, setParamsChecked] = useRecoilState(selectTarget);
  const [total, setTotal] = useState(0);

  const handleChecked = async(data, cnt) => {
    console.log('data.date',data.date)
    let showroomData = [];
    let reqNoData = [];
    await data.each_list.forEach((item,i) => 
      {
        showroomData.push(item.showroom_list[0].showroom_no);
        reqNoData.push(item.showroom_list[0].req_no);
      }
    )
    //setChecked(checked.includes(day)? checked.filter((d) => d !== day): [...checked, day]);
    let op = await checked.filter(item => (item.date === data.date));
    console.log('opopop',op)
    await setChecked(
      op.length === 0
      ? 
      [...checked, {date: data.date, showroom_list : showroomData, req_no_list : reqNoData}]
      :
      checked.filter((d) => d.date !== data.date)
    )
    op.length === 0 ? setTotal(total + cnt) : setTotal(total - cnt);
    setParamsChecked(checked)
  };

  const handleDetail = async() => {
    let newArr = "";
    
    //let checkedData = checked.sort();
    const checkedData = await checked.sort(function(a, b) {
      return a.date > b.date;
    });
    await checkedData.forEach((v, i) =>
      i !== checkedData.length - 1 ? (newArr += v.date + "+") : (newArr += v.date)
    );
    let viewType = view === "pickups" ? "pickups" : "sendout";
    
    //history.push("/magazine/pickup/" + newArr + "/" + viewType);
    const newCheckedData = Object.assign([],checked)
    history.push({
      pathname: "/magazine/pickup/" + newArr + "/" + viewType,
      state: {  // location state
        newArr : newArr,
        viewType : viewType,
        screenState : newCheckedData
      }
    }); 
  }

  const handleEachDetailOld = (each_data) => {
    console.log('handleEachDetail',each_data)
    let viewType = view === "pickups" ? "pickups" : "sendout";
    history.push("/magazine/pickup/req/" + each_data.req_no + "/" + viewType+ "/" + each_data.showroom_no);
  };

  const handleEachDetail = (each_data,idx,sdata = [],sdate=null) => {    
    if ( sdata.length > 0) {
      let viewType = view === "pickups" ? "pickups" : "sendout";
      let reqNoData = [];
      history.push({
        pathname: "/magazine/pickup/" + sdate + "/" + viewType,
        state: {
          newArr : sdate,
          viewType : viewType,
          screenState : [{date: sdate, showroom_list : sdata, req_no_list : [each_data.req_no]}]
        }
      });

    }else{
      let viewType = view === "Send Out" ? "sendout" : "return";
      history.push("/brand/send_outs/req/" + each_data.req_no + "/" + viewType+ "/" + each_data.showroom_no);
    }
  };

  const handleBrandId = (e) => {
    if ( e.target.value !== brandId ) {
      setBrandId(e.target.value);
    }
  };

  const handleViewInit = () => {
    setChecked([]);
    setTotal(0);
  };

  const queryData = useQuery(
    [
      "pickup-scheduler",
      moment(startDt).unix(),
      moment(endDt).unix(),
      view,
      brandId,
    ],
    async () =>
      view === "pickups"
        ? await apiObject.getPickupSchedule({
            start_date: moment(startDt).unix(),
            fin_date: moment(endDt).unix(),
            brand_id: brandId,
          })
        : await apiObject.getSendoutSchedule({
            start_date: moment(startDt).unix(),
            fin_date: moment(endDt).unix(),
            brand_id: brandId,
          })
  );

  const data = queryData.isLoading ? [] : queryData.data.list;
  const brandList = queryData.isLoading
    ? []
    : queryData.data.brand_list.map((d) => ({
        cd_id: d.brand_id,
        cd_nm: d.brand_nm,
      }));

  if (queryData.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <Container active={isdrawer}>
      <Title
        view={view}
        setView={setView}
        startDt={startDt}
        setStartDt={setStartDt}
        endDt={endDt}
        setEndDt={setEndDt}
        brandId={brandId}
        brandList={brandList}
        handleBrandId={handleBrandId}
        handleViewInit={handleViewInit}
      />
      <InfoWrap>
        {(view === "Send Out" || view === "sendout" )
        ?
        (<><InfoText2>■ 반납완료</InfoText2><InfoText>■ 미반납</InfoText></>)
        :
        (<><InfoText2>■ 수령완료</InfoText2><InfoText>■ 미수령</InfoText></>)
        }
      </InfoWrap>
      <ContentsWrap>
        {
        data.length === 0 ?
        <Box
          minHeight={"30vh"}
          width={"100%"}
          display="flex"
          justifyContent="center"
          alignItems="center"
          fontSize={20}
        >
          해당 기간에 포함된 데이터가 존재하지 않습니다.
        </Box>
        :
        data.map((d, i) => (
          <React.Fragment key={i}>
            <SendoutContent
              data={d}
              checked={checked}
              handleChecked={handleChecked}
              handleClick={handleEachDetail}
              view={view}
            />
            {i !== data.length - 1 && <StyleDivider />}
          </React.Fragment>
        ))}
      </ContentsWrap>
      {total > 0 && (
        <CreactBox onClick={handleDetail}>
          <TextWrap>
            <div>Total Number Of</div>
            <div className="bold">{view === "pickups" ? "Pickup" : "Send Out"} : </div>
            <div className="total">{total}</div>
          </TextWrap>
          <CreateBtn >Create Document</CreateBtn>
        </CreactBox>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width:100%;
  padding-left:25px;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1200px" : "960px")};        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "600px")};    
  } 
`;

const ContentsWrap = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f1f2ea;
  border-radius: 15px;
`;

const StyleDivider = styled(Divider)`
  height: 2px;
  background-color: #dddddd;
`;

const CreactBox = styled.div`
  display: flex;
  width: 647px;
  height: 120px;
  background-color: #ffffff;
  bottom: 0;
  right: 60px;
  padding: 0 40px;
  justify-content: space-between;
  align-items: center;
  border: solid 1px #dddddd;
  border-radius: 20px 20px 0 0;
  box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.16);
  position: fixed;
  z-index: 5;
`;


const InfoWrap = styled.div`
display: flex;
align-items: center;
justify-content : flex-end;
`;
const InfoText = styled.div`
  font-size: 15px;
  padding-right:20px;
  color:${Constants.nonCheckColor};
`;
const InfoText2 = styled.div`
  font-size: 15px;
  padding-right:20px;
  color:${Constants.checkColor};
`;
const TextWrap = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 300;
  color: #000000;

  .bold {
    font-weight: bold;
    margin-left: 5px;
  }
  .total {
    font-size: 72px;
    font-weight: bold;
    color: #7ea1b2;
    margin-left: 5px;
  }
`;

const CreateBtn = styled.div`
  width: 189px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);
  background-color: #7ea1b2;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
  }
  &:active {
    background-color: ${darken(0.2, "#7ea1b2")};
  }
`;
