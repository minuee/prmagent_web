import React, { useState, useCallback, useEffect } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import moment from "moment";
import { useQuery } from "react-query";
import { Divider } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";

import Title from "components/brand/send_outs/TitleNew";
import SendoutContent from "components/brand/send_outs/SendoutContent";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
import Constants from 'utils/constants';


/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer,currentStartDt,currentEndDt,currentSendOutSelect,selectTarget,currentIsFilter } from "redux/state";

export default function SendOuts() {
  const history = useHistory();
  const { dt } = useParams();
  
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const [startDt, setStartDt] = useRecoilState(currentStartDt);
  const [endDt, setEndDt] = useRecoilState(currentEndDt);
  const [view, setView] = useRecoilState(currentSendOutSelect);
  const [isFilter, setIsFilter] = useRecoilState(currentIsFilter);  
  //const [isFilter, setIsFilter] = useState('all');

  const [leftData, setLeftData] = useState([]);
  const [checked, setChecked] = useState([]);
  const [total, setTotal] = useState(0);
  const [paramsChecked, setParamsChecked] = useRecoilState(selectTarget);

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

  const handleDetail = async() => {
    let newArr = "";
    const checkedData = await checked.sort(function(a, b) {
      return a.date > b.date;
    });
    await checkedData.forEach((v, i) =>
      i !== checkedData.length - 1 ? (newArr += v.date + "+") : (newArr += v.date)
    );
    let viewType = view === "Send Out" ? "sendout" : "return";
    const newCheckedData = Object.assign([],checked)    
    console.log('newCheckedData',newCheckedData)
    history.push({
      pathname: "/brand/send_outs/" + newArr + "/" + viewType,
      state: {  // location state
        newArr : newArr,
        viewType : viewType,
        is_CreateDoc : true,
        screenState : newCheckedData
      }
    }); 
  }
  const handleEachDetail = async(each_data,idx,sdata = [],sdate=null) => {   
    //console.log('handleEachDetail',idx,sdata,sdate)
    if ( sdata.length > 0) {
      let newShowroomIdxArray = [];
      await sdata.forEach((element) => {
        if ( each_data.req_no == element.reqNo) {
          newShowroomIdxArray.push(element.showroom_no);
        }
      })          
      let viewType = view === "Send Out" ? "sendout" : "return";      
      let reqNoData = [];
      history.push({
        pathname: "/brand/send_outs/" + sdate + "/" + viewType,
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
  };
 
  const handleFilter = useCallback(async() => {
    await setIsFilter(isFilter == 'all' ? 'not' : 'all' );    
    setTimeout(() => {
      refetch()
    }, 200);
    
  }, [isFilter]);

  const handleViewInit = useCallback(() => {
    setChecked([]);
    setTotal(0);
  }, [checked, total]);

  const {isLoading,error, data, refetch } = useQuery(
    ["sendout-scheduler", moment(startDt).unix(), moment(endDt).unix(), view],
    async () =>    
      await apiObject.getSendouts({
        start_date: moment(startDt).unix(),
        fin_date: moment(endDt).unix(),
        is_not_finished : isFilter,
        pageState: view === "Send Out" ? "sendout" : "return",
      })
  );

  const queryData = isLoading ? [] : data.list; 
  
  if (isLoading) {
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
        handleViewInit={handleViewInit}
      />
      <InfoWrap>
        {(view === "Send Out" || view === "sendout" )
        ?
        (<><InfoText2>■ 발송완료</InfoText2><InfoText onClick={() => handleFilter()} isFilter={isFilter}>■ 미발송</InfoText></>)
        :
        (<><InfoText2>■ 반납완료</InfoText2><InfoText onClick={() => handleFilter()} isFilter={isFilter}>■ 미반납</InfoText></>)
        }
      </InfoWrap>
      <ContentsWrap>
        {queryData.length === 0 ? (
          <Nodata>해당 기간에 포함된 데이터가 존재하지 않습니다.</Nodata>
        ) : (
          queryData.map((d, i) => (
            <React.Fragment key={`${d.date}_${i}`}>
              <SendoutContent
                data={d}
                checked={checked}
                handleChecked={handleChecked}
                //handleEachDetail={handleEachDetail}
                handleClick={handleEachDetail}
                view={view}
              />
              {i !== queryData.length - 1 && <StyleDivider />}
            </React.Fragment>
          ))
        )}
      </ContentsWrap>
      {total > 0 && (
        <CreactBox  active={isdrawer}>
          <TextWrap active={isdrawer}>
            <div>Total Number Of</div>
            <div className="bold">{view} : </div>
            <div className="total">{total}</div>
          </TextWrap>
          <CreateBtn onClick={handleDetail}>Create Document</CreateBtn>
        </CreactBox>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1200px" : "960px")};        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "630px")};    
  } 
`;

const ContentsWrap = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f1f2ea;
  border-radius: 15px;
  width: 99%;
`;

const StyleDivider = styled(Divider)`
  height: 2px;
  background-color: #dddddd;
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
const CreactBox = styled.div`
  display: flex;
  @media (min-width: 1920px) {
    width: 647px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 647px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "647px" : "500px")};
  } 
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

const TextWrap = styled.div`
  display: flex;
  align-items: center;
  @media (min-width: 1920px) {
    font-size: 20px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    font-size: 20px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    font-size: ${(props) => (props.active ? "20px" : "15px")};
  } 
  font-weight: 300;
  color: #000000;

  .bold {
    font-weight: bold;
    margin-left: 5px;
  }
  .total {
    font-size: 50px;
    font-weight: bold;
    color: #7ea1b2;
    margin-left: 5px;
  }
`;

const CreateBtn = styled.div`
  width: 170px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);
  background-color: #7ea1b2;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
  }
  &:active {
    background-color: ${darken(0.2, "#7ea1b2")};
  }
`;

const Nodata = styled.div`
  height: 186px;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  padding-left: 30px;
`;
