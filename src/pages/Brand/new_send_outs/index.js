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
import { currentDrawer,currentStartDt,currentEndDt,currentSendOutSelect,selectTarget } from "redux/state";

export default function SendOuts() {
  const history = useHistory();
  const { dt } = useParams();
  
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const [startDt, setStartDt] = useRecoilState(currentStartDt);
  const [endDt, setEndDt] = useRecoilState(currentEndDt);
  const [view, setView] = useRecoilState(currentSendOutSelect);
  
  const [leftData, setLeftData] = useState([]);
  const [checked, setChecked] = useState([]);
  const [total, setTotal] = useState(0);
  const [paramsChecked, setParamsChecked] = useRecoilState(selectTarget);

  const handleChecked = async(data, cnt) => {
    let showroomData = [];
    let reqNoData = [];
    await data.each_list.forEach((item,i) =>  {
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



/*   const handleChecked = useCallback(
    (day, cnt) => {
      setChecked(
        checked.includes(day)
          ? checked.filter((d) => d !== day)
          : [...checked, day]
      );
      checked.includes(day) ? setTotal(total - cnt) : setTotal(total + cnt);
    },
    [checked, total]
  ); */

 /*  const handleDetail = useCallback(() => {
    let newArr = "";
    let checkedData = checked.sort();
    checkedData.forEach((v, i) =>
      i !== checkedData.length - 1 ? (newArr += v + "+") : (newArr += v)
    );
    let viewType = view === "Send Out" ? "sendout" : "return";
    history.push("/brand/send_outs/" + newArr + "/" + viewType);
  }); */


  const handleDetail = async() => {
    let newArr = "";
    
    //let checkedData = checked.sort();
    const checkedData = await checked.sort(function(a, b) {
      return a.date > b.date;
    });
    await checkedData.forEach((v, i) =>
      i !== checkedData.length - 1 ? (newArr += v.date + "+") : (newArr += v.date)
    );
    let viewType = view === "Send Out" ? "sendout" : "return";
    
    //history.push("/magazine/pickup/" + newArr + "/" + viewType);
    const newCheckedData = Object.assign([],checked)
    //console.log('newCheckedData',checked)
    history.push({
      pathname: "/brand/send_outs/" + newArr + "/" + viewType,
      state: {  // location state
        newArr : newArr,
        viewType : viewType,
        screenState : newCheckedData
      }
    }); 
  }

/*   const handleEachDetail = useCallback((req_no) => {
    let viewType = view === "Send Out" ? "sendout" : "return";
    history.push("/brand/send_outs/req/" + req_no + "/" + viewType);
  }); */

  const handleEachDetail = (each_data,idx,sdata = [],sdate=null) => {
    console.log('handleEachDetail',each_data,sdata,sdate)
    if ( sdata.length > 0) {
      let viewType = view === "Send Out" ? "sendout" : "return";      
      let reqNoData = [];
      history.push({
        pathname: "/brand/send_outs/" + sdate + "/" + viewType,
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

  const handleViewInit = useCallback(() => {
    setChecked([]);
    setTotal(0);
  }, [checked, total]);

  const queryData = useQuery(
    ["sendout-scheduler", moment(startDt).unix(), moment(endDt).unix(), view],
    async () =>
      await apiObject.getSendouts({
        start_date: moment(startDt).unix(),
        fin_date: moment(endDt).unix(),
        pageState: view === "Send Out" ? "sendout" : "return",
      })
  );

  const data = queryData.isLoading ? [] : queryData.data.list; 
  
  if (queryData.isLoading) {
    return <Progress type="load" />;
  }
  
/* 
  useEffect(async() => {
    let newDataArray = [];  
    loadData.forEach(async(topelement) => {
      let newLeftIdxArray = [];
      let newLeftArray = [];      
      await topelement.each_list.forEach((element) => {
        if ( !newLeftIdxArray.includes(element.showroom_list[0].req_no)) {
          newLeftIdxArray.push(element.showroom_list[0].req_no);
          newLeftArray.push(element)
        }
      })
      newDataArray.push({
        date : topelement.date,
        day : topelement.day,
        month : topelement.month,
        year : topelement.year,
        each_list : newLeftArray
      })
    })
    console.log('newDataArray',newDataArray);
    setLeftData(newDataArray);
  }, [loadData]);

  console.log('leftData',leftData); */
  return (
    <Container active={isdrawer}>
      <Title
        view={view}
        setView={setView}
        startDt={startDt}
        setStartDt={setStartDt}
        endDt={endDt}
        setEndDt={setEndDt}
        handleViewInit={handleViewInit}
      />
      <InfoWrap>
        {(view === "Send Out" || view === "sendout" )
        ?
        (<><InfoText2>■ 발송완료</InfoText2><InfoText>■ 미발송</InfoText></>)
        :
        (<><InfoText2>■ 반납완료</InfoText2><InfoText>■ 미반납</InfoText></>)
        }
      </InfoWrap>
      <ContentsWrap>
        {data.length === 0 ? (
          <Nodata>해당 기간에 포함된 데이터가 존재하지 않습니다.</Nodata>
        ) : (
          data.map((d, i) => (
            <React.Fragment key={`${d.date}_${i}`}>
              <SendoutContent
                data={d}
                checked={checked}
                handleChecked={handleChecked}
                //handleEachDetail={handleEachDetail}
                handleClick={handleEachDetail}
                view={view}
              />
              {i !== data.length - 1 && <StyleDivider />}
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
