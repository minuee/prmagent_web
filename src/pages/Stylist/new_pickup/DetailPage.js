import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { useReactToPrint } from "react-to-print";

import { apiObject } from "api/api_stylist";
import RightArrow from "assets/sendout/rightArrow.svg";
import LeftArrow from "assets/sendout/leftArrow.svg";
import PrintIcon from "assets/sendout/printIcon.svg";
import RightArrowBox from "assets/sendout/rightArrowBox.svg";
import LeftArrowBox from "assets/sendout/leftArrowBox.svg";
import ChevronDown from "assets/sheet/chevronDown.svg";
import SendOutDetailItems from "components/magazine/send_outs/SendoutDetailItems";
import PrintObject from "components/magazine/send_outs/Print";
import Progress from "components/common/progress";
import Constants from 'utils/constants';
export default function SendOutDetail({ match }) {
  const low_data = match.params.timestamp.split("+");
  const view = match.params.view;
  const [timeStamp, setTimeStamp] = useState(low_data[0]);
  const [printData, setPrintData] = useState(0);
  const printContentsRef = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);

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
    setPrintData(idx);
  };

  const handlePrint = useReactToPrint({
    content: () => printContentsRef.current,
    onBeforeGetContent: (d) => {
      return d;
    },
  });

  const queryData = useQuery(["sendout-return-detail", timeStamp], async () =>
    view === "pickups"
      ? await apiObject.getPickupDetail({
          date: timeStamp,
        })
      : await apiObject.getSendoutDetail({
          date: timeStamp,
        })
  );

  const data = queryData.isLoading ? [] : queryData.data;
  console.log('datatttt',data)
  if (queryData.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <TitleTxt>
          {view === "pickups" ? "Pickups" : "Send Out"}
          {/* <img src={ChevronDown} alt="" style={{ marginLeft: "12px" }} /> */}
        </TitleTxt>
      </div>
      <Container>
        <LeftWrap>
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
          <LeftTotal>{data.left.each_count}</LeftTotal>
          <LeftItmesWrap>
            <LeftItems>
              {data.left.each_list.map((d, i) => (
                <React.Fragment key={d.req_no}>
                  <SendOutDetailItems
                    data={d}
                    idx={i}
                    handleClick={handleItemClick}
                  />
                  {i % 2 === 1 && <br />}
                </React.Fragment>
              ))}
            </LeftItems>
          </LeftItmesWrap>
        </LeftWrap>
        <RightWrap>
          <RightWrapArrow>
            {printData !== 0 && (
              <img
                src={LeftArrowBox}
                alt="left_arrow_box"
                onClick={() => handlePageMoveBtn("prev")}
              />
            )}
          </RightWrapArrow>
          <PrintArea>
            <Print>
              <div ref={printContentsRef}>
                <PrintObject data={data.right[printData]} footer="" />
              </div>
            </Print>
            <PrintBtnWrap>
              <PrintBtn onClick={handlePrint}>
                <img src={PrintIcon} alt="print" />
                Print
              </PrintBtn>
            </PrintBtnWrap>
          </PrintArea>
          <RightWrapArrow>
            {printData !== data.right.length - 1 && (
              <img
                src={RightArrowBox}
                alt="right_arrow_box"
                onClick={() => handlePageMoveBtn("next")}
              />
            )}
          </RightWrapArrow>
        </RightWrap>
      </Container>
    </>
  );
}

const TitleTxt = styled.div`
  font-size: 48${Constants.titleFontSize}px;
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-right: 56px;
  margin-bottom: 130px;
  display: flex;
`;

const Container = styled.div`
  @media (min-width: 1920px) {
    width: 1480px;   
    display: flex;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: 960px; 
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 600px;
  } 
`;

const LeftWrap = styled.div`
  @media (min-width: 1920px) {
    min-width: 456px;
    display: flex;
    flex-direction: column;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: 960px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 600px;
  }   
`;

const LeftTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
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
`;

const LeftItems = styled.div`
  display: flex;
  width: 336px;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const RightWrap = styled.div`
  @media (min-width: 1920px) {
    width : 1049px;
    min-height: 1210px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width : 960px
    min-height: 1010px;
    margin-bottom: 64px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width : 600px;    
    height: auto;
    overflow: hidden;
    overflow-X: scroll;
    margin-bottom: 64px;
  } 
  background-color: #f1f2ea;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  padding-top: 64px;
`;


const RightWrapArrow = styled.div`
  @media (min-width: 1920px) {
    width: 152px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 152px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 60px
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
  height: 100%;
  width : 95%;    
  margin-left:20px;
  margin-right:20px;
  @media (min-width: 1920px) {

  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    padding-bottom: 50px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    overflow: hidden;
    overflow-X: scroll;
    padding-bottom: 50px;
  }
`;

const Print = styled.div`
  @media (min-width: 1920px) {
    width: 100%;
    min-height: 1092px;
    height: auto;
    padding: 50px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 100%;
    min-height: 892px;
    height: auto;
    padding: 30px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 800px;
    height: auto;
    padding: 20px;
  } 

  background-color: #ffffff;
  position: relative;
  overflow: auto;
`;

const PrintBtnWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
`;

const PrintBtn = styled.div`
  width: 200px;
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
