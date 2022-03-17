import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { darken } from "polished";
import dayjs from "dayjs";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import { apiObject } from "api/api_brand";
import PrintIcon from "assets/sendout/printIcon.svg";
import SettingDialog from "components/brand/send_outs/SettingDialog";
import SettingIcon from "assets/sheet/settingsIcon.svg";
import SendOutDetailItems from "components/brand/send_outs/SendoutDetailItems";
import PrintObject from "components/brand/send_outs/Print";
import Progress from "components/common/progress";

import Constants from 'utils/constants';
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";


export default function SendOutRequestDetail() {
  const { req_no, view , showroom_no} = useParams();
  const printContentsRef = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const handleItemClick = useCallback((data,idx) => {
    console.log(idx);
  });

  const handlePrint = useReactToPrint({
    content: () => printContentsRef.current,
    onBeforeGetContent: (d) => {
      return d;
    },
  });

  const queryData = useQuery(["sendout-return-detail-req"], () =>
    view === "sendout"
      ? apiObject.getSendoutDetailReq({
          req_no: req_no,
          showroom_no : showroom_no
        })
      : apiObject.getReturnDetailReq({
          req_no: req_no,
          showroom_no : showroom_no
        })
  );

  const noticeQuery = useQuery(
    ["sendout-notice"],
    async () => await apiObject.getSendoutNotice()
  );

  const data = queryData.isLoading ? [] : queryData.data;
  if (queryData.isLoading || noticeQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <div style={{ display: "flex" }}>
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
            <div className="text">
              {dayjs.unix(data.left.date).format("M/DD (ddd)")}
            </div>
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
          <PrintArea>
            <Print>
              <div ref={printContentsRef}>
                <PrintObject
                  data={data.right}
                  footer={noticeQuery.data.content}
                  view={view}
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
  margin-right: 56px;
  margin-bottom: 50px;
  display: flex;

  width:calc(100%-25px);
  margin-left:25px;
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
/*min-width: 456px;*/
const LeftWrap = styled.div`
  display: flex;
  min-height: 592px;
  max-height: 1092px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  @media (min-width: 1920px) {
    width: 300px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 280px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 200px
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
  align-items: center;
`;

const LeftItems = styled.div`
  display: flex;
  width: 336px;
  justify-content: flex-start;
  flex-wrap: wrap;
`;
/*min-width: 1049px;*/
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
  min-height: 810px;
  background-color: #f1f2ea;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  padding-top: 64px;
`;

const RightWrapArrow = styled.div`
  min-width: 152px;
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
  width: 90%;
  display: flex;
  justify-content: flex-end;
  margin-right:10%;
  margin-top: 20px;
  margin-bottom: 20px;
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
  height: 38px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
`;
