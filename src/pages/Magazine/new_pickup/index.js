import React, { useState,useCallback } from "react";
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
import { currentDrawer,currentPickupStartDt,currentPickupEndDt,currentSendOutSelect,currentPickupMenu,currentPickupSelect,selectTarget,currentIsFilter } from "redux/state";
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
  //const [isFilter, setIsFilter] = useState('all');
  const [isFilter, setIsFilter] = useRecoilState(currentIsFilter);  
  const setTmpStartDt = async(val) => {
    setChecked([]);
    setTotal(0);
    setStartDt(val)
  } 
  const setTmpEndDt = async(val) => {
    setChecked([]);
    setTotal(0);
    setEndDt(val)
  } 
  const handleChecked = async(date, data, cnt, sdata = []) => {
    let showroomData = [];
    let reqNoData = [];
    await data.forEach((item,i) =>  {
      reqNoData.push(item.showroom_list[0].req_no);
    })
    await sdata.forEach((item2,i) =>  {
      showroomData.push(item2.showroom_no);
    })
    const setReqNo = new Set(reqNoData);
    const uniqueReqNo = await reqNoData.filter((val, idx) => {
      return reqNoData.indexOf(val) === idx;
    });
    const setShowroom = new Set(showroomData);
    const uniqueShowroom = await showroomData.filter((val, idx) => {
      return showroomData.indexOf(val) === idx;
    });
    let op = await checked.filter(item => (item.date === date));
    if ( op.length === 0 ) {
      await setChecked([...checked, {date: date, showroom_list : uniqueShowroom, req_no_list : uniqueReqNo}]);
    }else{
      await setChecked(checked.filter((d) => d.date !== date));
    }
    op.length === 0 ? setTotal(total + cnt) : setTotal(total - cnt);
    setParamsChecked(checked)
  };
  
  const handleCheckedOld = async(data, cnt) => {
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
    const checkedData = await checked.sort(function(a, b) {
      return a.date > b.date;
    });
    await checkedData.forEach((v, i) =>
      i !== checkedData.length - 1 ? (newArr += v.date + "+") : (newArr += v.date)
    );
    let viewType = view === "pickups" ? "pickups" : "sendout";
    const newCheckedData = Object.assign([],checked)    
    //console.log('newCheckedData',newCheckedData)
    history.push({
      pathname: "/magazine/pickup/" + newArr + "/" + viewType,
      state: {  // location state
        newArr : newArr,
        viewType : viewType,
        is_CreateDoc : true,
        screenState : newCheckedData
      }
    }); 
  }

  const handleDetailOld = async() => {
    let newArr = "";
    const checkedData = await checked.sort(function(a, b) {
      return a.date > b.date;
    });
    await checkedData.forEach((v, i) =>
      i !== checkedData.length - 1 ? (newArr += v.date + "+") : (newArr += v.date)
    );
    let viewType = view === "pickups" ? "pickups" : "sendout";
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

/*   const handleEachDetailOld = (each_data) => {
    let viewType = view === "pickups" ? "pickups" : "sendout";
    history.push("/magazine/pickup/req/" + each_data.req_no + "/" + viewType+ "/" + each_data.showroom_no);
  }; */

  const handleEachDetail = async(each_data,idx,sdata = [],sdate=null) => {    
    console.log('newLeftShowroomIdxArray',sdate,Math.floor(new Date()/1000) )
    if ( sdate < Math.floor(new Date()/1000) ) {
      if ( sdata.length > 0) {
        let newShowroomIdxArray = [];
        await sdata.forEach((element) => {
          if ( each_data.req_no == element.reqNo) {
            newShowroomIdxArray.push(element.showroom_no);
          }
        })    
        let viewType = view === "pickups" ? "pickups" : "sendout";
        let reqNoData = [];
        history.push({
          pathname: "/magazine/pickup_single/" + sdate + "/" + viewType,
          state: {
            newArr : sdate,
            viewType : viewType,
            screenState : [{date: sdate, showroom_list : newShowroomIdxArray, req_no_list : [each_data.req_no]}]
          }
        });

      }else{
        let viewType = view === "Send Out" ? "sendout" : "return";
        history.push("/brand/send_outs/req/" + each_data.req_no + "/" + viewType+ "/" + each_data.showroom_no);
      }
    }else{
      utils.customAlert('픽업일이후부터 조회가 가능합니다.')
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

  const handleFilter = useCallback(async() => {
    await setIsFilter(isFilter == 'all' ? 'not' : 'all' );    
  }, [isFilter]);

  const queryData = useQuery(
    ["pickup-scheduler",moment(startDt).unix(),moment(endDt).unix(),view,brandId,isFilter],
    async () =>
      view === "pickups"
        ? await apiObject.getPickupSchedule({
            start_date: moment(startDt).unix(),
            fin_date: moment(endDt).unix(),
            brand_id: brandId,
            is_not_finished : isFilter,
          })
        : await apiObject.getSendoutSchedule({
            start_date: moment(startDt).unix(),
            fin_date: moment(endDt).unix(),
            brand_id: brandId,
            is_not_finished : isFilter,
          })
  );

  const data = queryData.isLoading ? [] : queryData.data.list;
  
  if (queryData.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <Container active={isdrawer}>
      <Title
        view={view}
        setView={setView}
        startDt={startDt}
        setStartDt={setTmpStartDt}
        endDt={endDt}
        setEndDt={setTmpEndDt}
        handleBrandId={handleBrandId}
        handleViewInit={handleViewInit}
      />
      <InfoWrap>
        {(view === "Send Out" || view === "sendout" )
        ?
        (<><InfoText2>■ 반납완료</InfoText2><InfoText onClick={() => handleFilter()} isFilter={isFilter}>■ 미반납</InfoText></>)
        :
        (<><InfoText2>■ 수령완료</InfoText2><InfoText onClick={() => handleFilter()} isFilter={isFilter}>■ 미수령</InfoText></>)
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
  margin-right:10px;
  margin-bottom:10px;

`;
const InfoText = styled.div`
  width: 90px;
  height: 30px;
  border-radius: 5px;  
  display: flex;
  border : ${(props) => (props.isFilter == 'not' ? "solid 1px #000000" : "solid 1px #dddddd")};    
  background-color:  ${(props) => (props.isFilter == 'not' ? "#000000" : "#ffffff")};    
  font-size: 15px;
  align-items: center;
  justify-content: center;  
  cursor: pointer;  
  color:${Constants.nonCheckColor};
`;
const InfoText2 = styled.div`
  width: 90px;
  height: 30px;
  border-radius: 5px;  
  display: flex;
  border : solid 1px #dddddd;    
  font-size: 15px;  
  align-items: center;
  justify-content: center;  
  cursor: pointer;
  color:${Constants.checkColor};
  margin-right: 10px;
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
