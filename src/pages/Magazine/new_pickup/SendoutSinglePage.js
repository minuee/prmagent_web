import React, { useState, useRef,useEffect } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import dayjs from "dayjs";
import { useQuery,useMutation } from "react-query";
import { useReactToPrint } from "react-to-print";
import { useLocation,useHistory } from 'react-router-dom';
import { apiObject } from "api/api_magazine";
import RightArrow from "assets/sendout/rightArrow.svg";
import LeftArrow from "assets/sendout/leftArrow.svg";
import PrintIcon from "assets/sendout/printIcon.svg";
import RightArrowBox from "assets/sendout/rightArrowBox.svg";
import LeftArrowBox from "assets/sendout/leftArrowBox.svg";
import ChevronDown from "assets/sheet/chevronDown.svg";
import SendOutDetailItems from "components/magazine/send_outs/SendoutDetailItemsSingle";
import PrintObject from "components/magazine/send_outs/PrintSingle";
import Progress from "components/common/progress";
import utils from "utils";
import { times } from "lodash";
import Constants from 'utils/constants';
import alertConfirm from 'react-alert-confirm';

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer,currentPage,currentPageName,currentScreenState } from "redux/state";

export default function SendOutDetail({ match }) {
  const location = useLocation();
  const history = useHistory();
  const low_data = match.params.timestamp.split("+");
  const view = match.params.view;

  const [timeStamp, setTimeStamp] = useState(low_data[0]);
  const [localScreenState, setLocalScreenState] = useRecoilState(currentScreenState);
  const [printData, setPrintData] = useState(0);
  const [loadData, setLoadData] = useState(null);
  const [leftData, setLeftData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const printContentsRef = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);

  const [isEachUpdate, setEachUpdate] = useState(false);

  useEffect(async() => {
    let screenProps = []   
    let paramData = [];
    if ( location?.state?.screenState != undefined) {
      screenProps = location.state.screenState;
      setLocalScreenState(location.state.screenState)
    }else{
      if ( !utils.isEmpty(localScreenState)) {
        screenProps = localScreenState;
      }else{
        utils.customAlert('잘못된 접근입니다.');
        history.goBack();
      }
    }
    paramData = await screenProps.filter((item) => item.date == timeStamp);
    if (timeStamp && paramData.length > 0 ) {
      let queryData = null;
      if ( view === "pickups" ) {
        queryData = await apiObject.getPickupDetail({
            date: timeStamp,
            showroomList : paramData[0].showroom_list,
            reqnoList : paramData[0].req_no_list
          })

         
      }else{
        queryData = await apiObject.getSendoutDetail({
            date: timeStamp,
            showroomList : paramData[0].showroom_list,
            reqnoList : paramData[0].req_no_list
        })
      }
      
      let newLeftIdxArray = [];
      let newLeftArray = [];
      if ( queryData != null ) {
        queryData.left.each_list.forEach((element) => {
          if ( !newLeftIdxArray.includes(element.showroom_list[0].req_no)) {
            newLeftIdxArray.push(element.showroom_list[0].req_no);
            newLeftArray.push(element)
          }
        })   
      }
  
      setLoadData(queryData);
      setLeftData(newLeftArray);
      setLoading(false);  
    }
  }, [timeStamp,isEachUpdate]);
  

  const handleArrowClick = (act) => {
    let index = low_data.indexOf(timeStamp);
    if (act === "prev") {
      setTimeStamp(low_data[index - 1]);
    } else if (act === "next") {
      setTimeStamp(low_data[index + 1]);
    }
    setPrintData(0);
  };

  const handlePageMoveBtn = (act) => {
    if (act === "prev") {
      setPrintData(printData - 1);
    } else if (act == "next") {
      setPrintData(printData + 1);
    }
  };

  const handleItemClick = (idx) => {

    if ( printData !== idx && data.right.length > 1) {
      setPrintData(idx);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printContentsRef.current,
    onBeforeGetContent: (d) => {
      return d;
    },
  });

  const handleEachPickup= (no,sampleNo) => {
    alertConfirm({
      title: Constants.appName,
      content: '픽업처리 하시겠습니까?',
      onOk: () => {eachPickups.mutate({ req_no: no,sampleNo})},
      onCancel: () => {console.log('cancel')}
    });
  };

  const eachPickups = useMutation(
    ["brand-each-pickup"],
    (value) =>
      apiObject.setEachPickup(
        {
          req_no: value.req_no,
          sample_no: value.sampleNo
        },
        () => {}
      ),
    {
      onSuccess: () => {
        setEachUpdate(!isEachUpdate)
        utils.customAlert("처리되었습니다.");
      },
      onError: (error) => {
        utils.customAlert("처리 중 오류가 발생했습니다.");
      },
    }
  );

  const handleEachReturn= (no,sampleNo) => {
    alertConfirm({
      title: Constants.appName,
      content: '반납처리 하시겠습니까?',
      onOk: () => {eachReturns.mutate({ req_no: no,sampleNo})},
      onCancel: () => {console.log('cancel')}
    });
  };

  const nothingClick = () => {
  }

  const eachReturns = useMutation(
    ["brand-each-return"],
    (value) =>
      apiObject.setEachReturn(
        {
          req_no: value.req_no,
          sample_no: value.sampleNo
        },
        () => {}
      ),
    {
      onSuccess: () => {
        setEachUpdate(!isEachUpdate)
        utils.customAlert("처리되었습니다.");
      },
      onError: (error) => {
        utils.customAlert("처리 중 오류가 발생했습니다.");
      },
    }
  );

  const data = isLoading ? [] : loadData;
  if (isLoading) {
    return <Progress type="load" />;
  }else{

    return (
      <>
        <div style={{ display: "flex" }}>
          <TitleTxt>
            {view === "pickups" ? "Pickup" : "Send Out"}
            {/* <img src={ChevronDown} alt="" style={{ marginLeft: "12px" }} /> */}
          </TitleTxt>
        </div>
        <Container  active={isdrawer}>
          <LeftWrap active={isdrawer}>
            <LeftTitle>
              {low_data.length > 1 && low_data.indexOf(timeStamp) !== 0 ? (
                <div className="arrow" onClick={() => handleArrowClick("prev")}>
                  <img src={LeftArrow} alt="left" />
                </div>
              ) : (
                <div className="arrow" />
              )}
              <div className="text">
                {dayjs.unix(data.left.date).format("M/DD (ddd)")}
              </div>
              {low_data.length > 1 &&
              low_data.indexOf(timeStamp) !== low_data.length - 1 ? (
                <div className="arrow" onClick={() => handleArrowClick("next")}>
                  <img src={RightArrow} alt="right" />
                </div>
              ) : (
                <div className="arrow" />
              )}
            </LeftTitle>
            <LeftTotal>{leftData.length}</LeftTotal>
            <LeftItmesWrap>
              <LeftItems>
                {leftData.map((d, i) => (
                  <React.Fragment key={d.req_no}>
                    <SendOutDetailItems
                      data={d}
                      idx={i}
                      handleClick={()=>nothingClick()}
                      view={view}
                      viewMode={'new'}
                    />
                    {i % 2 === 1 && <br />}
                  </React.Fragment>
                ))}
              </LeftItems>
            </LeftItmesWrap>
          </LeftWrap>
          <RightWrap active={isdrawer}>
            
            {!utils.isEmpty(data.right[printData]) &&
            <PrintArea active={isdrawer}>
              <Print>
                <div ref={printContentsRef}>
                  <PrintObject 
                    data={data.right[printData]} 
                    footer="" 
                    view={view}
                    handleEachPickup={handleEachPickup}
                    handleEachReturn={handleEachReturn}
                  />
                </div>
              </Print>
              <PrintBtnWrap>
                <PrintBtn onClick={handlePrint}>
                  <img src={PrintIcon} alt="print" />
                  Print
                </PrintBtn>
              </PrintBtnWrap>
            </PrintArea>
            }
            
          </RightWrap>
        </Container>
      </>
    );
  }
}

const TitleTxt = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-left: 26px;
  margin-bottom: 100px;
  display: flex;
`;

const Container = styled.div`
  display: flex;
  width:calc(100%-25px);
  margin-left:25px;  
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1870px" : "1400px")};
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    min-width: ${(props) => (props.active ? "1250px" : "940px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "974px" : "974px")};
  } 
`;


const LeftWrap = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1920px) {
    width: ${(props) => (props.active ? "300px" : "300px")};
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: ${(props) => (props.active ? "300px" : "300px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "200px" : "200px")};
  } 
`;


const LeftTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 500;

  .text {
    margin: 0 10px;
  }
  .arrow {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;


const LeftTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  font-weight: bold;
  color: #7ea1b2;
  margin-bottom: 40px;
`;

const LeftItmesWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
`;


const LeftItems = styled.div`
  display: flex;  
  @media (min-width: 1920px) {
    width : 336px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width : 336px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {    
    width: ${(props) => (props.active ? "336px" : "200px")};
  } 
  justify-content: center;
  flex-wrap: wrap;
`;


const RightWrap = styled.div`
  
  @media (min-width: 1920px) {
    width : 774px;
    margin-right:50px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width : 700px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width : 700px;
  } 
  background-color: #f1f2ea;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  padding:64px 30px 64px 30px;
`;

const RightWrapArrow = styled.div`
  @media (min-width: 1920px) {
    width: ${(props) => (props.active ? "152px" : "152px")};
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: ${(props) => (props.active ? "100px" : "60px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "100px" : "60px")};
  } 
  display: flex;
  height: 100%;
  padding-bottom: 156px;
  align-items: center;
  justify-content: center;

  > img {
    cursor: pointer;
    max-width : 40px;
  }
`;

const PrintArea = styled.div`
  width: 700px;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const Print = styled.div`
  width: 94%;
  margin-left:3%;
  min-height: 592px;
  max-height: 1092px;
  padding: 30px;
  background-color: #ffffff;
  position: relative;
  overflow: auto;
`;


const PrintBtnWrap = styled.div`
  width: 95%;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right:5%;
`;

const PrintBtn = styled.div`
  width: 150px;
  height: 60px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);
  background-color: #7ea1b2;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;

  > img {
    margin-right: 10px;
  }

  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
  }
  &:active {
    background-color: ${darken(0.2, "#7ea1b2")};
  }
`;

const SettingWrap = styled.div`
  display: flex;
  height: 48px;
  cursor: pointer;
`;
