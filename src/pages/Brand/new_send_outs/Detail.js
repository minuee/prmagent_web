import React, { useState, useRef, useCallbac,useEffect } from "react";
import styled from "styled-components";
import { darken } from "polished";
import dayjs from "dayjs";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useQueryClient } from "react-query";
import { useReactToPrint } from "react-to-print";
import { useLocation } from 'react-router-dom';
import { apiObject } from "api/api_brand";
import RightArrow from "assets/sendout/rightArrow.svg";
import LeftArrow from "assets/sendout/leftArrow.svg";
import PrintIcon from "assets/sendout/printIcon.svg";
import RightArrowBox from "assets/sendout/rightArrowBox.svg";
import LeftArrowBox from "assets/sendout/leftArrowBox.svg";
import SettingDialog from "components/brand/send_outs/SettingDialog";
import SettingIcon from "assets/sheet/settingsIcon.svg";
import SendOutDetailItems from "components/brand/send_outs/SendoutDetailItems";
import PrintObject from "components/brand/send_outs/Print";
//import PrintObject from "components/brand/send_outs/NewPrint";
import Progress from "components/common/progress";

import Constants from 'utils/constants';
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
export default function SendOutDetail({ match }) {
  const location = useLocation();
  const low_data = match.params.timestamp.split("+");
  const view = match.params.view;
  const [timeStamp, setTimeStamp] = useState(low_data[0]);
  const [printDataIdx, setPrintDataIdx] = useState(0);
  const [printData, setPrintData] = useState(null);
  const [loadData, setLoadData] = useState(null);
  const [leftData, setLeftData] = useState(null);
  const [leftDataIdx, setLeftDataIdx] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isEachUpdate, setEachUpdate] = useState(false);
  const [paramsCount, setParamsCount] = useState(0);
  const printContentsRef = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const notice = queryClient.getQueryData(["sendout-notice"])?.content;
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const reducer = useSelector((state) => state.reducer);  
  const [myInfo, setMyInformation] = useState(
    utils.isEmpty(reducer.myUser.username) ? null : reducer.myUser.username
  );

  const handleArrowClick = (act) => {
    let index = low_data.indexOf(timeStamp);
    if (act === "prev") {
      setTimeStamp(low_data[index - 1]);
    } else if (act === "next") {
      setTimeStamp(low_data[index + 1]);
    }
    setPrintDataIdx(0);
  };

  const handlePageMoveBtn = (act) => {
    if (act === "prev") {
      setPrintDataIdx(printDataIdx - 1);
      const nowData = loadData.left.each_list[printDataIdx - 1].showroom_list[0].req_no;
      setPrintData(nowData);
    } else if (act == "next") {
      setPrintDataIdx(printDataIdx + 1);
      const nowData = loadData.left.each_list[printDataIdx + 1].showroom_list[0].req_no;
      setPrintData(nowData);
    }
  };

  const handleItemClick = (data2,idx,sdata,sdate) => {
    //const nowData = loadData.left.each_list[idx].showroom_list[0].req_no;
    const nowData = leftDataIdx[idx];
    setPrintDataIdx(idx);
    setPrintData(nowData);
  };
  const handlePrint = useReactToPrint({
    content: () => printContentsRef.current,
    onBeforeGetContent: (d) => {
      return d;
    },
  });


  const handleEachSendOut = (no,sampleNo) => {
    alertConfirm({
      title: Constants.appName,
      content: '발송처리 하시겠습니까?',
      onOk: () => {eachSendOut.mutate({ req_no: no,sampleNo})},
      onCancel: () => {console.log('cancel')}
    });
  };

  const eachSendOut = useMutation(
    ["brand-each-sendot"],
    (value) =>
      apiObject.setEachSendOut(
        {
          req_no: value.req_no,
          showroom_len : 1,
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

  const handleEachReturns = (no,sampleNo) => {
    alertConfirm({
      title: Constants.appName,
      content: '반납확인처리 하시겠습니까?',
      onOk: () => {setEachReturnCheck.mutate({ req_no: no,sampleNo})},
      onCancel: () => {console.log('cancel')}
    });
  };

  const setEachReturnCheck = useMutation(
    ["brand-each-returnchecke"],
    (value) =>
      apiObject.setEachReturnCheck(
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
  useEffect(async() => {
    const isCreateDoc = !utils.isEmpty(location.state?.is_CreateDoc) ? location.state.is_CreateDoc : false;    
    const screenProps = !utils.isEmpty(location.state?.screenState) ? location.state.screenState : [];       
    const paramData = await screenProps.filter((item) => item.date == timeStamp);
    console.log('isCreateDoc',isCreateDoc)
    setParamsCount(paramData) 
    if (timeStamp && paramData.length > 0 ) {
      setPrintData(paramData[0].req_no_list[0]);   
      let queryData = null;
      if ( view === "sendout" ) {
        queryData = await apiObject.getSendoutDetail({
            date: paramData[0].date,
            showroomList : paramData[0].showroom_list,
            reqnoList : paramData[0].req_no_list,
            is_list : isCreateDoc ? 'yes' : 'null'
          })
      }else{
        queryData = await apiObject.getReturnDetail({
            date: paramData[0].date,
            showroomList : paramData[0].showroom_list,
            reqnoList : paramData[0].req_no_list,
            is_list : isCreateDoc ? 'yes' : 'null'
        })
      }   

      console.log('queryData',queryData)
      let newLeftIdxArray = [];
      let newLeftArray = [];
      queryData.left.each_list.forEach((element) => {
        if ( !newLeftIdxArray.includes(element.showroom_list[0].req_no)) {
          newLeftIdxArray.push(element.showroom_list[0].req_no);
          newLeftArray.push(element)
        }
      })
      setLoadData(queryData);
      setLeftData(newLeftArray);
      setLeftDataIdx(newLeftIdxArray);
      setLoading(false);  
    }
  }, [timeStamp,isEachUpdate]);

  /* const queryData = useQuery(["sendout-return-detail", timeStamp], async () =>
    view === "sendout"
      ? await apiObject.getSendoutDetail({
          date: timeStamp,
          showroomList : paramData[0].showroom_list
        })
      : await apiObject.getReturnDetail({
          date: timeStamp,
          showroomList : paramData[0].showroom_list
        })
  ); */

  
  const data = isLoading ? [] : loadData;
  if (isLoading) {
    return <Progress type="load" />;
  }

  
  let newPrintData = isLoading ? null : data.right.filter((items) => items.req_no == printData )

  return (
    <>
      <div style={{ display: "flex",marginBottom:'50px'}}>
        <TitleTxt>
          {view === "sendout" ? "Send Out" : "Returns"}
          {/* <img src={ChevronDown} alt="" style={{ marginLeft: "12px" }} /> */}
        </TitleTxt>
        <SettingWrap onClick={() => setDialogOpen(!dialogOpen)}>
          <img src={SettingIcon} alt="" style={{ width: "32px" }} />
          {/* <SubTitleTxt>공지사항등록</SubTitleTxt> */}
        </SettingWrap>
      </div>
      <Container active={isdrawer}>
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
          {/* <LeftTotal>{data.left.each_list.length}</LeftTotal> */}
          <LeftTotal>{leftData.length}</LeftTotal>
          <LeftItmesWrap>
            <LeftItems active={isdrawer}>
              {leftData.map((d, i) => (
                <React.Fragment key={d.req_no}>
                  <SendOutDetailItems
                    data={d}
                    idx={i}
                    handleClick={handleItemClick}
                    view={view}
                    viewMode={'new'}
                  />                 
                </React.Fragment>
              ))}
            </LeftItems>
          </LeftItmesWrap>
        </LeftWrap>
        <RightWrap active={isdrawer}>
          <RightWrapArrow active={isdrawer}>
            {printDataIdx !== 0 && (
              <img
                src={LeftArrowBox}
                width={'50px'}
                alt="left_arrow_box"
                onClick={() => handlePageMoveBtn("prev")}
              />
            )}
          </RightWrapArrow>
          <PrintArea active={isdrawer}>
            <Print>
              <div ref={printContentsRef}>
                {/* <PrintObject data={data.right[printData]} footer={notice} view={view} /> */}
                <PrintObject 
                  data={newPrintData.length > 0 ? newPrintData[0] : null}
                  footer={notice} 
                  view={view} 
                  handleEachSendOut={handleEachSendOut}
                  handleEachReturns={handleEachReturns}
                />
              </div>
            </Print>
            <PrintBtnWrap>
              {/* { view === "sendout" ?
              <PrintBtn2 onClick={handleAllSendOut}>
                전체발송
              </PrintBtn2>
              :
              <PrintBtn2 onClick={handleAllReturns}>
                전체반납확인
              </PrintBtn2>
              } */}
              <PrintBtn onClick={handlePrint}>
                <img src={PrintIcon} alt="print" />
                Print
              </PrintBtn>
            </PrintBtnWrap>
          </PrintArea>
          <RightWrapArrow active={isdrawer}>
            {printDataIdx !== data.right.length - 1 && (
              <img
                src={RightArrowBox}
                width={'50px'}
                alt="right_arrow_box"
                onClick={() => handlePageMoveBtn("next")}
              />
            )}
          </RightWrapArrow>
        </RightWrap>
      </Container>

      <SettingDialog open={dialogOpen} setOpen={setDialogOpen} />
    </>
  );
}

const TitleTxt = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-right: 20px;  
  display: flex;
  width:calc(100%-25px);
  margin-left:25px;
  align-items: center;
  justify-content: center;  
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

const SubTitleTxt = styled.div`
  font-size: 18px;
  font-weight: bold;
  line-height: 40px;
  cursor: pointer;
  display: flex;  
  align-items: center;
  justify-content: center;
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
  margin-left:50px;
  width : calc( 100% - 350px);
  background-color: #f1f2ea;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  padding-top: 64px;
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
  margin-right:5%;
  margin-top: 20px;
  margin-bottom: 20px;
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

const PrintBtn2 = styled.div`
  width: 140px;
  height: 50px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);
  background-color: #000000;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  margin-right:10px;

`;
const SettingWrap = styled.div`
  display: flex;
  height: 38px;
  cursor: pointer;
`;
