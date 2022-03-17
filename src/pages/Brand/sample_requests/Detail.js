import React, { useState, useEffect, useRef, useCallback } from "react";
import styled, { css } from "styled-components";
import { darken, lighten } from "polished";
import { TextField } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import useOutsideClick from "components/UseOutsideClick";
import { useHistory } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import dayjs from "dayjs";
import ConfirmIcon from "assets/check_icon_w.svg";
import CheckBoxOn from "assets/checkbox_on.png";
import CheckBoxOff from "assets/checkbox_off.png";
import ReviseIcon from "assets/revise_icon.svg";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
import utils from "utils";
import Constants from 'utils/constants';
import ImgAcceptIcon from "assets/check_icon_large.svg";
import ImgRejectIcon from "assets/sample_reject_icon.svg";
import alertConfirm from 'react-alert-confirm';

import MessageDialog from "components/MessageDialog";
import SelectDialog from "components/brand/scheduler/SelectDialog";
import SampleRequestTableDetailItems from "components/brand/sample_request/SampleRequestTableDetailItems";


export default function SampleRequestsDetail({ match }) {
  const ref = useRef();
  const history = useHistory();
  const req_no = match.params.request_no;

  const [acceptList, setAcceptList] = useState([]);  
  const [rejectList, setRejectList] = useState([]);
  const [msg, setMsg] = useState("");
  const [msgDialog, setMsgDialog] = useState(false);
  const [rejectMsg, setRejectMsg] = useState("");
  const [isDuplicate, setDuplicate] = useState("");
  const [selectDialog, setselectDialog] = useState(false);
  const [rejectMsgDialog, setRejectMsgDialog] = useState(false);  
  const [updateDate, setUpdateDate] = useState(new Date().getTime());  

  useEffect(() => {    
    setAcceptList(acceptList);
    setRejectList(rejectList);
  }, [updateDate])


  const handleAcceptList = useCallback(
    (showroom_no) => {
      setAcceptList(acceptList.includes(showroom_no) ? acceptList.filter((d) => d !== showroom_no) : [...acceptList, showroom_no]);    
      setUpdateDate(new Date().getTime());      
    },
    [acceptList]
  );

  const handleRejectList = useCallback((showroom_no) => {
    if ( rejectList.includes(showroom_no) ) {
      setRejectList(prods => (prods.filter((d) => d !== showroom_no)));
    }else{
      setRejectList(prods => ([...prods, showroom_no]));
    }
  },
  [rejectList]
);


const handleSelectConfirm = useCallback(async(data) => {
  await setDuplicate({...isDuplicate,data})
  setselectDialog(false);    
  setMsgDialog(true);    
});
const handleClickConfirm = async() => {
  await setDuplicate("");
  await setUpdateDate(new Date().getTime());    
  
  const shooting_date = dayjs.unix(data.shooting_date).format("YYYY-MM-DD")
  
  let isDupCheck =  false;//동일일자확인
  let isDupJustCheck =  false; //기간내 중복확인
  let isDupLookName = "";
  let strTarget_req_no = "";
  let strTarget_showroom_no = "";
  let strTarget_user_position = "";
  let strTarget_user_name = "";
  let strTarget_company_name = "";
  let reservation = data.reservation_list.length > 0 ? data.reservation_list : data.reservation_list2;
  reservation.forEach((d2, i2) => {
    let targetShowroom = d2.showroom_no;
    let reservation_type = d2.date_info[0].reservation_type;
    const isSubCheck = (element) => element == targetShowroom;
    let isCheck = acceptList.some(isSubCheck);   
    if ( isCheck) {
      if ( shooting_date === d2.date_info[0]?.photogrf_dt) {      
        reservation_type === 'justcheck' ? isDupJustCheck = true : isDupCheck = true ;
        isDupLookName = d2.date_info[0]?.showroom_nm;
        strTarget_req_no = d2.date_info[0]?.target_req_no;
        strTarget_showroom_no = d2.date_info[0]?.target_showroom_no;
        strTarget_user_position = d2.date_info[0]?.target_user_position;
        strTarget_user_name = d2.date_info[0]?.target_user_name;
        strTarget_company_name = d2.date_info[0]?.target_company_name;
        setDuplicate({
          target_req_no : strTarget_req_no,
          target_showroom_no : strTarget_showroom_no,
          target_user_name : strTarget_user_name,
          target_user_position : strTarget_user_position,
          target_company_name : strTarget_company_name
        })
      }
    }      
  }); 
  
  if ( isDupCheck && acceptList.length > 0 && rejectMsg.length === 0 ) {
    alertConfirm({
      title: Constants.appName,
      content: isDupLookName + "이(가) ["+strTarget_company_name + "]" + strTarget_user_name+ "에 승인된 정보가 있습니다? 그래도 승인하시겠습니까?",
      onOk: () => {
        if (acceptList.length > 0 && rejectMsg.length === 0) {
          const today = dayjs().format("YYYY-MM-DD");
          const shooting_date = dayjs.unix(data.shooting_date).format("YYYY-MM-DD");          
          if (dayjs(today).diff(shooting_date, "day") > 0) {
            alertConfirm({
              title: Constants.appName,
              content: '이미 촬영일이 지난 요청입니다. 승인하시겠습니까?',
              onOk: () => {setselectDialog(true)},
              onCancel: () => {console.log('cancel')}
            });
          } else {
            setselectDialog(true)
          }        
        } else {
          utils.customAlert("선택된 요청이 없습니다. 다시 확인해주세요.");
          return;
        }
      },
      onCancel: () => {console.log('cancel')}
    });
  }else if ( isDupJustCheck && acceptList.length > 0 && rejectMsg.length === 0 ) {
    setDuplicate("");
    alertConfirm({
      title: Constants.appName,
      content: "촬영기간내 " + isDupLookName + "이(가) ["+strTarget_company_name + "]" + strTarget_user_name+ "에 승인된 정보가 있습니다. 그래도 승인하시겠습니까?",
      onOk: () => {
        setMsgDialog(true)
      },
      onCancel: () => {console.log('cancle')}
    });
  }else{    
    if (acceptList.length > 0 && rejectMsg.length === 0) {
      const today = dayjs().format("YYYY-MM-DD");
      const shooting_date = dayjs.unix(data.shooting_date).format("YYYY-MM-DD");
      if (dayjs(today).diff(shooting_date, "day") > 0) {
       /*  if (confirm("이미 촬영일이 지난 요청입니다. 승인하시겠습니까?")) {
          setMsgDialog(true);
        } */
        alertConfirm({
          title: Constants.appName,
          content: '이미 촬영일이 지난 요청입니다. 승인하시겠습니까?',
          onOk: () => {setMsgDialog(true)},
          onCancel: () => {console.log('cancel')}
        });
      } else {
        alertConfirm({
          title: Constants.appName,
          content: '선택된 정보로 승인하시겠습니까?',
          onOk: () => {setMsgDialog(true)},
          onCancel: () => {console.log('cancel')}
        });
      }
    } else if (rejectList.length > 0 && acceptList.length === 0) {
      alertConfirm({
        title: Constants.appName,
        content: '선택된 정보로 거절 하시겠습니까?',
        onOk: () => {setRejectMsgDialog(true)},
        onCancel: () => {console.log('cancel')}
      });
    } else {
      utils.customAlert("선택된 요청이 없습니다. 다시 확인해주세요.");
      return;
    }
  }
}

const handleAccept = useCallback((type) => {
  if (type === "accept") {
    sampleAccept.mutate({
      req_no: req_no,
      msg: msg,
      showroom_list: acceptList
    });
  } else if (type === "reject") {
    sampleReject.mutate({
      req_no: req_no,
      msg: rejectMsg,
      showroom_list: rejectList
    });
  }
});

  const detailQuery = useQuery(
    ["sample-request-detail", req_no],
    async () =>
      await apiObject.getRequestsDetail({
        req_no: req_no,
      })
  );

  const chgTime = (t) => {
    let time = t;
    let ampm = t > 12 ? "PM" : "AM";
    return (time % 12) + ":00 " + ampm;
  };
  
  const data = detailQuery.isLoading ? [] : detailQuery.data;

  const sampleAccept = useMutation(
    (value) =>
      apiObject.setRequestConfirm({
        req_no: value.req_no,
        showroom_list: value.showroom_list,
        msg: value.msg,
        isDuplicate : isDuplicate
      }),
    {
      onSuccess: () => {
        utils.customAlert("처리 완료되었습니다.");
        detailQuery.refetch();
        setAcceptList([]);
        setRejectList([]);
        setRejectMsgDialog(false);
        setMsgDialog(false);
      },
      onError: () => {
        utils.customAlert("승인 처리중 오류가 발생했습니다.");
      },
    }
  );

  const sampleReject = useMutation(
    (value) =>
      apiObject.setRequestRefuse({
        req_no: value.req_no,
        msg: value.msg,
        showroom_list: value.showroom_list,
      }),
    {
      onSuccess: () => {
        utils.customAlert("처리 완료되었습니다.");
        setRejectList([]);
        detailQuery.refetch();        
      },
      onError: () => {
        utils.customAlert("거절 처리중 오류가 발생했습니다.");
      },
    }
  );

  if (detailQuery.isLoading) {
    return <Progress type="load" />;
  }
  if (sampleAccept.isLoading) {
    return <Progress type="upload" />;
  }
  if (sampleReject.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      <TitelWrap>
        <TitleTxt1>
          Sample Request Detail
          {!utils.isEmpty(data.canc_dt) && 
          <TitleTxt2>
            홀딩요청 취소된 문서입니다.
            (취소일자 : {dayjs(data.canc_dt).format("YYYY/MM/DD(ddd)")})
          </TitleTxt2>
          }
        </TitleTxt1>
        <ConfirmBtnWrap>
          { utils.isEmpty(data.canc_dt) &&
          <ConfirmBtn onClick={handleClickConfirm}>
            <img src={ConfirmIcon} alt="confirm" />
            Confirm
          </ConfirmBtn>
          }
        </ConfirmBtnWrap>
      </TitelWrap>

      <InputContainer>        
        <DataWrap>
          <ImgWrap isData={data.popup_list.length > 0 ? true :false}>
            {/* {
            !utils.isEmpty(data.showroom_list) &&
            data.showroom_list.map((d) => (
              <ImgDiv key={d.showroom_no}>
                <Img imgUrl={d.image_url} />
                <ImgTitle>{d.showroom_nm}</ImgTitle>
                { d.showroom_status !== 'undecided' &&
                <ImgCover>
                  <img src={d.showroom_status == 'selected' ? ImgAcceptIcon : d.showroom_status == 'rejected' ? ImgRejectIcon : ImgAcceptIcon} alt="checked" />
                </ImgCover>
                }
              </ImgDiv>
            ))
            } */}

            {
            data.popup_list.map((d) => (
              <SampleRequestTableDetailItems
                key={d.showroom_no}
                data={d}
                acceptList={acceptList}
                handleAcceptList={handleAcceptList}
                rejectList={rejectList}
                handleRejectList={handleRejectList}
                pickup_date={data.pickup_date}
              />
            ))}
          </ImgWrap>
          <DetailWrap>
            <Rows>
              <Box>
                <InputWrap>
                  <InputTitle>매체명</InputTitle>
                  <InputRead>{data.mgzn_nm}</InputRead>
                </InputWrap>
              </Box>
              <Box>
                <InputWrap>
                  <InputTitle>
                    담당 기자/스타일리스트<Require>*</Require>
                  </InputTitle>
                  <InputRead>{data.req_send_username}</InputRead>
                </InputWrap>
              </Box>
            </Rows>
            <Rows>
              <Box>
                <InputWrap>
                  <InputTitle>
                    연결 연락처
                    {/* <Required src={StarIcon} alt="require" /> */}
                    <Require>*</Require>
                  </InputTitle>
                  <div style={{ display: "flex" }}>
                    <InputRead>{data.contact_username}</InputRead>
                    <InputRead>
                      {utils.phoneFormat(data.contact_phone_no)}
                    </InputRead>
                  </div>
                </InputWrap>
              </Box>
            </Rows>
            <Rows>
              <InputWrap margin="-10px">
                <InputTitle>
                  촬영일<Require>*</Require>
                </InputTitle>
                <InputRead2>
                  {dayjs.unix(data.shooting_date).format("MM/DD(ddd)")}
                </InputRead2>
              </InputWrap>
              <InputWrap margin="-10px">
                <InputTitle>
                  픽업일<Require>*</Require>
                </InputTitle>
                <InputRead2>
                  {dayjs.unix(data.pickup_date).format("MM/DD(ddd)")}
                </InputRead2>
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="-10px">
                <InputTitle>
                  반납일<Require>*</Require>
                </InputTitle>
                <InputRead2>
                  {dayjs.unix(data.returning_date).format("MM/DD(ddd)")}
                </InputRead2>
              </InputWrap>
              <InputWrap margin="-10px">
                <InputTitle>
                  촬영 시작 시간<Require>*</Require>
                </InputTitle>
                <InputRead2>{chgTime(data.shooting_start_time)}</InputRead2>
              </InputWrap>
              <InputWrap>
                <InputTitle>
                  촬영 종료 시간<Require>*</Require>
                </InputTitle>
                <InputRead2>{chgTime(data.shooting_end_time)}</InputRead2>
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>
                  수령 주소
                  {/* <Required src={StarIcon} alt="require" /> */}
                  <Require>*</Require>
                </InputTitle>
                <AddressWrap>
                  <AddressRead>{data.dlvy_adres_nm}</AddressRead>
                </AddressWrap>
                <AddressWrap style={{ marginTop: "10px" }}>
                  <AddressRead>{data.adres_detail}</AddressRead>
                </AddressWrap>
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>
                  배송 관련 메모<Require>*</Require>
                </InputTitle>
                <StyleTextField3
                  variant="outlined"
                  value={data.dlvy_atent_matter}
                  placeholder="Notes"
                  multiline
                  rows={4}
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>
                  촬영 컨셉<Require>*</Require>
                </InputTitle>
                <AddressWrap>
                  <AddressRead>{data.photogrf_concept}</AddressRead>
                </AddressWrap>
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>
                  모델
                  {/* <Required src={StarIcon} alt="require" /> */}
                  <Require>*</Require>
                </InputTitle>
                <ModelWrap>
                  <CheckBoxWrap>
                    <CheckBoxWrapDetail>
                      <CheckBoxImg
                        src={
                          data.celeb_list.length > 0 ? CheckBoxOn : CheckBoxOff
                        }
                        alt=""
                      />
                      셀러브리티
                    </CheckBoxWrapDetail>
                  </CheckBoxWrap>
                  <ModelInput>
                    {data.celeb_list.length > 0 ? (
                      data.celeb_list.map((d, i) => (
                        <ModelInputBox key={`${d}_${i}`}>
                          <ModelDiv>{d}</ModelDiv>
                        </ModelInputBox>
                      ))
                    ) : (
                      <ModelInputBox>
                        <ModelDiv>-</ModelDiv>
                      </ModelInputBox>
                    )}
                  </ModelInput>
                </ModelWrap>
                <ModelWrap>
                  <CheckBoxWrap>
                    <CheckBoxWrapDetail>
                      <CheckBoxImg
                        src={
                          data.model_list.length > 0 ? CheckBoxOn : CheckBoxOff
                        }
                        alt=""
                      />
                      패션 모델
                    </CheckBoxWrapDetail>
                  </CheckBoxWrap>
                  <ModelInput>
                    {data.model_list.length > 0 ? (
                      data.model_list.map((d, i) => (
                        <ModelInputBox key={`${d}_${i}`}>
                          <ModelDiv>{d}</ModelDiv>
                        </ModelInputBox>
                      ))
                    ) : (
                      <ModelInputBox>
                        <ModelDiv>-</ModelDiv>
                      </ModelInputBox>
                    )}
                  </ModelInput>
                </ModelWrap>
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>
                  유가 여부
                  {/* <Required src={StarIcon} alt="require" /> */}
                  <Require>*</Require>
                </InputTitle>
                <ModelWrap>
                  <CheckBoxWrap2>
                    <CheckBoxWrapDetail>
                      <CheckBoxImg
                        src={
                          data.own_paid_pictorial_yn ? CheckBoxOn : CheckBoxOff
                        }
                        alt=""
                      />
                      자사유가
                    </CheckBoxWrapDetail>
                  </CheckBoxWrap2>
                  <div>
                    <PaidDiv>
                      {data.own_paid_pictorial_yn
                        ? data.own_paid_pictorial_content
                        : "-"}
                    </PaidDiv>
                  </div>
                </ModelWrap>
                <ModelWrap>
                  <CheckBoxWrap2>
                    <CheckBoxWrapDetail>
                      <CheckBoxImg
                        src={
                          data.other_paid_pictorial_yn
                            ? CheckBoxOn
                            : CheckBoxOff
                        }
                        alt=""
                      />
                      타사유가
                    </CheckBoxWrapDetail>
                  </CheckBoxWrap2>
                  <div>
                    <PaidDiv>
                      {data.other_paid_pictorial_yn
                        ? data.other_paid_pictorial_content
                        : "-"}
                    </PaidDiv>
                  </div>
                </ModelWrap>
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>로케촬영</InputTitle>
                <ModelWrap>
                  <CheckBoxWrap2>
                    <CheckBoxWrapDetail>
                      <CheckBoxImg
                        src={data.loc_yn ? CheckBoxOn : CheckBoxOff}
                        alt=""
                      />
                      로케촬영
                    </CheckBoxWrapDetail>
                  </CheckBoxWrap2>
                  <div>
                    <PaidDiv>{data.loc_yn ? data.loc_value : "-"}</PaidDiv>
                  </div>
                </ModelWrap>
              </InputWrap>
            </Rows>
            {/* <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>당일연결 희망 / 가능여부</InputTitle>
                <HopeBtnWrap>
                  <Btn active={data.today_connect}>
                    <StyleCheckIcon />
                    Yes
                  </Btn>
                  <Btn active={!data.today_connect}>
                    <StyleCheckIcon />
                    No
                  </Btn>
                </HopeBtnWrap>
              </InputWrap>
            </Rows> */}
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>
                  페이지 수<Require>*</Require>
                </InputTitle>
                <AddressWrap>
                  <AddressRead>{data.page_cnt}</AddressRead>
                </AddressWrap>
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>함께 들어가는 브랜드</InputTitle>
                <AddressWrap>
                  <AddressRead>
                    {data.etc_brand_info === null ? "-" : data.etc_brand_info}
                  </AddressRead>
                </AddressWrap>
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>메시지</InputTitle>
                <StyleTextField3
                  variant="outlined"
                  value={data.message}
                  placeholder="-"
                  multiline
                  rows={4}
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            
          </DetailWrap>
        </DataWrap>
      </InputContainer>
      <MessageDialog
        open={msgDialog}
        setOpen={setMsgDialog}
        input={msg}
        setInput={setMsg}
        handleConfirm={() => handleAccept("accept")}
      />

      <MessageDialog
        open={rejectMsgDialog}
        setOpen={setRejectMsgDialog}
        input={rejectMsg}
        setInput={setRejectMsg}
        handleConfirm={() => handleAccept("reject")}
      />

      <SelectDialog
        open={selectDialog}
        nowRequester={data}
        nowReqNo={req_no}
        oldRequester={isDuplicate}
        setOpen={setselectDialog}        
        handleConfirm={handleSelectConfirm}
      />
    </>
  );
}


const TitelWrap = styled.div`
  margin-bottom: 30px;
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: 1480px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    min-width: 950px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: 600px
  }  
  display:flex;
  justify-content: space-between;
  align-items: center;
  
`;

const TitleTxt1 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};  
  display:flex;
  justify-content: center;
  align-items: center;
`;
const TitleTxt2 = styled.div`
  margin-left:20px;
  font-size: 15px;
  color:gray;
  line-height: 20px;  
`;
const InputContainer = styled.div`
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: 1480px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    min-width: 950px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: 600px
  }  
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 40px 0 60px 0;
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: 1480px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    min-width: 950px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: 600px
  }  
`;

const BtnImgWrap = styled.div`
  margin-right: 10px;
  display: flex;
`;

const BtnWrap = styled.div`
  width: 200px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.type === "cancel" ? "#ffffff" : "#000000"};
  border: ${(props) =>
    props.type === "cancel" ? "solid 1px #dddddd" : "none"};
  border-radius: 5px;
  transition: all 0.3s;

  ${(props) =>
    props.type === "cancel" &&
    css`
      &:hover {
        background-color: ${darken(0.1, "#ffffff")};
      }
      &:active {
        background-color: ${darken(0.2, "#ffffff")};
      }
    `}

  ${(props) =>
    props.type === "confirm" &&
    css`
      &:hover {
        background-color: ${lighten(0.3, "#000000")};
      }
      &:active {
        background-color: ${lighten(0.4, "#000000")};
      }
    `} 

  & + & {
    margin-left: 10px;
  }
`;

const ConfirtTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
`;

const BrandLogo = styled.img`
  max-height: 24px;
  margin-bottom: 30px;
`;

const DataWrap = styled.div`
  @media (min-width: 1920px) {
    display: flex;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    
  } 
`;

const InputWrap = styled.div`
  @media (min-width: 1920px) {
    display: flex;
    flex-direction: column;
    margin-right: ${(props) => props.margin || "0"};
    width: ${(props) => props.width || "auto"};
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 100%;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 100%;
  } 
`;

const ImgWrap = styled.div`
  max-height: 458px;
  display : ${(props) => (props.isData ? "flex" : "none")};
  @media (min-width: 1920px) {    
    flex-wrap: wrap;
    width: 660px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 100%;    
    overflow: hidden;
    overflow-X: scroll;
  }
  @media (min-width: 10px) and (max-width: 1439px) {    
    width: 100%;
    overflow: hidden;
    overflow-X: scroll;
  } 
`;

const DetailWrap = styled.div`
  display: flex;
  flex-direction: column;  
  @media (min-width: 1920px) {
    width: 750px;
    margin-left: 20px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 100%;  
    margin-top:20px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 100%;
    margin-top:20px;
  } 
`;

const Rows = styled.div`
  display: flex;
  margin-bottom: 40px;

  ${(props) =>
    props.opt === "sbt" &&
    css`
      justify-content: space-between;
    `}
`;

const Box = styled.div`
  display: flex;
`;

const InputTitle = styled.div`
  display: flex;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const StyleTextField3 = styled(TextField)`
  .MuiOutlinedInput-multiline {
    padding: 13px 14px;
  }
  .MuiInputBase-root.Mui-disabled {
    color: #999999;
  }
  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }
  @media (min-width: 1920px) {
    width: 740px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 720px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 580px
  }  
`;

const ModelWrap = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const CheckBoxWrap = styled.div`
  display: flex;
  min-width: 180px;

  align-items: top;
  justify-content: left;
  font-size: 20px;
  cursor: pointer;
`;

const CheckBoxWrap2 = styled.div`
  display: flex;
  min-width: 120px;

  align-items: top;
  justify-content: left;
  font-size: 20px;
  cursor: pointer;
`;

const CheckBoxWrapDetail = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
`;

const CheckBoxImg = styled.img`
  max-width: 20px;
  max-height: 20px;
  margin-right: 12px;
`;

const StyleCheckIcon = styled(CheckIcon)`
  font-size: 16px;
  margin-right: 12px;
`;

const Btn = styled.div`
  width: 360px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: solid 1px #dddddd;
  font-size: 16px;
  color: #999999;
  cursor: pointer;

  ${(props) =>
    props.active &&
    css`
      border-color: #7ea1b2;
      color: #7ea1b2;
    `}
`;

const ImgDiv = styled.div`
  width: 280px;
  height: 438px;
  border-radius: 10px;
  background-color: #eef4f8;
  padding: 20px 20px 0 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-right: 20px;
  margin-bottom: 20px;
`;

const Img = styled.div`
  width: 240px;
  height: 360px;
  border: solid 1px #dddddd;
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}") no-repeat center;
          background-size: contain;
          background-color: #e7e7e7;
        `
      : css`
          background-color: #dddddd;
        `}
`;

const ImgTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImgCover = styled.div`
  width: 240px;
  height: 360px;
  position: absolute;
  background-color: #7ea1b2;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const Require = styled.span`
  color: #7ea1b2;
`;

const HopeBtnWrap = styled.div`
  display: flex;
  justify-content: space-between;
  @media (min-width: 1920px) {
    width: 560px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 560px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 540px
  } 
`;

const InputRead = styled.div`
  
  height: 42px;
  @media (min-width: 1920px) {
    min-width: 140px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    min-width: 400px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: 280px;
  } 
  border-radius: 5px;
  border: 1px solid #dddddd;
  margin-right: 20px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-size: 16px;
  font-weight: 500;
  color: #999999;
`;

const InputRead2 = styled.div`
  
  height: 42px;
  @media (min-width: 1920px) {
    min-width: 140px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    min-width: 180px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: 180px;
  } 
  border-radius: 5px;
  border: 1px solid #dddddd;
  margin-right: 20px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-size: 16px;
  font-weight: 500;
  color: #999999;
`;

const AddressWrap = styled.div`
  display: flex;
  align-items: center;
`;

const AddressRead = styled.div`
  @media (min-width: 1920px) {
    width: 740px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 740px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 600px
  }  
  height: 42px;
  border-radius: 5px;
  border: 1px solid #dddddd;
  margin-right: 20px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-size: 16px;
  font-weight: 500;
  color: #999999;
`;

const ModelInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    margin-left: 10px;
    cursor: pointer;
  }
`;

const ModelInputBox = styled.div`
  display: flex;
  & + & {
    margin-top: 10px;
  }
`;

const ModelDiv = styled.div`
  
  height: 42px;
  @media (min-width: 1920px) {
    width: 560px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 560px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 400px
  } 
  border: 1px solid #dddddd;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-size: 16px;
  font-weight: 500;
  color: #999999;
`;

const PaidDiv = styled.div`  
  height: 42px;
  @media (min-width: 1920px) {
    width: 560px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 560px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 400px
  } 
  border: 1px solid #dddddd;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-size: 16px;
  font-weight: 500;
  color: #999999;
`;


const ConfirmBtnWrap = styled.div`
  display: flex;
  justify-content: center;    
`;

const ConfirmBtn = styled.div`
  width: 150px;
  height: 50px;
  border-radius: 5px;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);
  background-color: #7ea1b2;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

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
