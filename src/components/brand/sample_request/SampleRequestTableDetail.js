import React, { useState,useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { TextField } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { useQuery, useMutation } from "react-query";
import dayjs from "dayjs";

import CheckBoxOn from "assets/checkbox_on.png";
import CheckBoxOff from "assets/checkbox_off.png";
import ConfirmIcon from "assets/check_icon_w.svg";
import SampleRequestTableDetailItems from "./SampleRequestTableDetailItems";
import MessageDialog from "../../MessageDialog";
import SelectDialog from "components/brand/scheduler/SelectDialog";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
import utils from "utils";
import Constants from 'utils/constants';
import alertConfirm from 'react-alert-confirm';
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

function SampleRequestTableDetail({ open, setOpen, req_no }) {
  const [acceptList, setAcceptList] = useState([]);  
  const [rejectList, setRejectList] = useState([]);
  const [msg, setMsg] = useState("");
  const [msgDialog, setMsgDialog] = useState(false);
  const [rejectMsg, setRejectMsg] = useState("");
  const [isDuplicate, setDuplicate] = useState("");
  const [selectDialog, setselectDialog] = useState(false);
  const [rejectMsgDialog, setRejectMsgDialog] = useState(false);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);  
  const [updateDate, setUpdateDate] = useState(new Date().getTime());  

  useEffect(() => {
    //console.log('useEffectuseEffectuseEffect ',acceptList ,updateDate)
    setAcceptList(acceptList);
    setRejectList(rejectList);
  }, [updateDate])


  const handleAcceptList = useCallback(
    (showroom_no) => {
      //console.log('handleAcceptList 1 ',acceptList )
      //console.log('acceptList.includes(showroom_no) ',acceptList.includes(showroom_no) )

      setAcceptList(acceptList.includes(showroom_no) ? acceptList.filter((d) => d !== showroom_no) : [...acceptList, showroom_no]);    
      setUpdateDate(new Date().getTime());
      //console.log('acceptList 2 ',acceptList )
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
    
    let isDupCheck =  false;
    let isDupLookName = "";
    let strTarget_req_no = "";
    let strTarget_showroom_no = "";
    let strTarget_user_position = "";
    let strTarget_user_name = "";
    let strTarget_company_name = "";
    console.log('data.reservation_list',data.reservation_list)
    data.reservation_list.forEach((d2, i2) => {
      let targetShowroom = d2.showroom_no;
      console.log('targetShowroom',targetShowroom)
      const isSubCheck = (element) => element == targetShowroom;
      let isCheck = acceptList.some(isSubCheck);
     
      if ( isCheck) {
        if ( shooting_date === d2.date_info[0]?.photogrf_dt) {      
          isDupCheck = true;
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
    
    console.log('isDupCheck',isDupCheck)
    if ( isDupCheck && acceptList.length > 0 && rejectMsg.length === 0 ) {
      /* if (confirm( isDupLookName + "이(가) ["+strTarget_company_name + "]" + strTarget_user_name+ "에 승인된 정보가 있습니다? 그래도 승인하시겠습니까?")) { 
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
      } */
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
          /* if (confirm("선택된 정보로 승인하시겠습니까?")) {
            setMsgDialog(true);
          } */
          alertConfirm({
            title: Constants.appName,
            content: '선택된 정보로 승인하시겠습니까?',
            onOk: () => {setMsgDialog(true)},
            onCancel: () => {console.log('cancel')}
          });
        }
      } else if (rejectList.length > 0 && acceptList.length === 0) {
        /* if (confirm("선택된 정보로 거절 하시겠습니까?")) {
          setRejectMsgDialog(true);
        } */
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

  const query = useQuery(
    ["sample-request-detail", req_no],
    async () =>
      await apiObject.getRequestsDetail({
        req_no: req_no,
      })
  );

  const data = query.isLoading ? [] : utils.isEmpty(query.data) ? [] :query.data;  
  
    
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
        setOpen(false);
        query.refetch();
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
        showroom_list: value.showroom_list,
      }),
    {
      onSuccess: () => {
        utils.customAlert("처리 완료되었습니다.");
        setRejectList([]);
        query.refetch();
        setOpen(false);
      },
      onError: () => {
        utils.customAlert("거절 처리중 오류가 발생했습니다.");
      },
    }
  );

  if (query.isLoading) {
    return <Progress type="load" />;
  }
  if (sampleAccept.isLoading) {
    return <Progress type="upload" />;
  }
  if (sampleReject.isLoading) {
    return <Progress type="upload" />;
  }

  //console.log('isDuplicate',isDuplicate)
  return (
    <>
      <ExpandBodyWrap open={open}>
        <ExpandBody>
          {!utils.isEmpty(data.popup_list) &&
          <ItemContainer active={isdrawer}>
            {
            data.popup_list.map((d) => (
              <SampleRequestTableDetailItems
                key={d.showroom_no}
                data={d}
                acceptList={acceptList}
                handleAcceptList={handleAcceptList}
                rejectList={rejectList}
                handleRejectList={handleRejectList}
              />
            ))}
          </ItemContainer>
          }
          <DetailWrap active={isdrawer}>
            <Rows opt="sbt" active={isdrawer}>
              <Box active={isdrawer}>
                <InputWrap active={isdrawer}>
                  <InputTitle>매체명</InputTitle>
                  <StyleTextField
                    variant="outlined"
                    value={data.mgzn_nm}
                    placeholder="Magazine"
                    readOnly
                    disabled
                  />
                </InputWrap>
                <InputWrap active={isdrawer}>
                  <InputTitle>담당 기자/스타일리스트</InputTitle>
                  <StyleTextField
                    variant="outlined"
                    value={data.req_send_username}
                    placeholder="Editor/Stylist"
                    readOnly
                    disabled
                  />
                </InputWrap>
              </Box>
              <Box active={isdrawer}>
                <InputWrap active={isdrawer}>
                  <InputTitle>
                    연결 연락처
                    {/* <Required src={StarIcon} alt="require" /> */}
                    <Require>*</Require>
                  </InputTitle>
                  <Box>
                    <StyleTextField
                      variant="outlined"
                      value={data.contact_username}
                      placeholder="Contact"
                      readOnly
                      disabled
                    />
                    <StyleTextField
                      variant="outlined"
                      value={utils.phoneFormat(data.contact_phone_no)}
                      placeholder="Contact Number"
                      readOnly
                      disabled
                    />
                  </Box>
                </InputWrap>
              </Box>
            </Rows>
            <Rows active={isdrawer}>
              <InputWrap active={isdrawer} margin="-10px">
                <InputTitle>
                  촬영일<Require>*</Require>
                </InputTitle>
                <StyleTextField
                  variant="outlined"
                  value={dayjs.unix(data.shooting_date).format("MM/DD(ddd)")}
                  placeholder="Shooting Date"
                  readOnly
                  disabled
                />
              </InputWrap>
              <InputWrap active={isdrawer} margin="-10px">
                <InputTitle>
                  픽업일<Require>*</Require>
                </InputTitle>
                <StyleTextField
                  variant="outlined"
                  value={dayjs.unix(data.pickup_date).format("MM/DD(ddd)")}
                  placeholder="Pickup Date"
                  readOnly
                  disabled
                />
              </InputWrap>
              <InputWrap margin="-10px">
                <InputTitle>
                  반납일<Require>*</Require>
                </InputTitle>
                <StyleTextField
                  variant="outlined"
                  value={dayjs.unix(data.returning_date).format("MM/DD(ddd)")}
                  placeholder="Returning Date"
                  readOnly
                  disabled
                />
              </InputWrap>
              <InputWrap margin="-10px">
                <InputTitle>
                  촬영 시작 시간<Require>*</Require>
                </InputTitle>
                <StyleTextField
                  variant="outlined"
                  value={utils.timeFormat(data.shooting_start_time)}
                  placeholder="Returning Date"
                  readOnly
                  disabled
                />
              </InputWrap>
              <InputWrap margin="-10px">
                <InputTitle>
                  촬영 종료 시간<Require>*</Require>
                </InputTitle>
                <StyleTextField
                  variant="outlined"
                  value={utils.timeFormat(data.shooting_end_time)}
                  placeholder="Returning Date"
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            <Rows active={isdrawer}>
              <InputWrap margin="20px">
                <InputTitle>
                  수령 주소
                  {/* <Required src={StarIcon} alt="require" /> */}
                  <Require>*</Require>
                </InputTitle>
                <StyleTextField2
                  style={{ marginBottom: "10px" }}
                  variant="outlined"
                  value={data.dlvy_adres_nm}
                  placeholder="-"
                  readOnly
                  disabled
                />
                <StyleTextField2
                  variant="outlined"
                  value={data.adres_detail}
                  placeholder="-"
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            <Rows active={isdrawer}>
              <InputWrap margin="20px">
                <InputTitle>
                  배송 관련 메모<Require>*</Require>
                </InputTitle>
                <StyleTextField3
                  variant="outlined"
                  value={data.dlvy_atent_matter}
                  placeholder="-"
                  multiline
                  rows={4}
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            <Rows active={isdrawer}>
              <InputWrap margin="20px">
                <InputTitle>
                  촬영컨셉<Require>*</Require>
                </InputTitle>
                <StyleTextField2
                  variant="outlined"
                  value={data.photogrf_concept}
                  placeholder="-"
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            <Rows active={isdrawer}>
              <InputWrap margin="20px" width="96%">
                <InputTitle>
                  모델
                  {/* <Required src={StarIcon} alt="require" /> */}
                  <Require>*</Require>
                </InputTitle>
                <ModelWrap active={isdrawer}>
                  <CheckBoxWrap2>
                    <CheckBoxWrapDetail>
                      <CheckBoxImg
                        src={
                          data.celeb_list.length > 0 ? CheckBoxOn : CheckBoxOff
                        }
                        alt=""
                      />
                      셀러브리티
                    </CheckBoxWrapDetail>
                  </CheckBoxWrap2>
                  <ModelInput>
                    {data.celeb_list.length === 0 ? (
                      <ModelInputBox active={isdrawer}>
                        <StyleTextField5
                          variant="outlined"
                          value="-"
                          placeholder="-"
                          readOnly
                          disabled
                        />
                      </ModelInputBox>
                    ) : (
                      data.celeb_list.map((d) => (
                        <ModelInputBox active={isdrawer} key={d}>
                          <StyleTextField5
                            variant="outlined"
                            value={d}
                            placeholder="-"
                            readOnly
                            disabled
                          />
                        </ModelInputBox>
                      ))
                    )}
                  </ModelInput>
                </ModelWrap>
                <ModelWrap active={isdrawer}>
                  <CheckBoxWrap2>
                    <CheckBoxWrapDetail>
                      <CheckBoxImg
                        src={
                          data.model_list.length > 0 ? CheckBoxOn : CheckBoxOff
                        }
                        alt=""
                      />
                      패션 모델
                    </CheckBoxWrapDetail>
                  </CheckBoxWrap2>
                  <ModelInput>
                    {data.model_list.length === 0 ? (
                      <ModelInputBox>
                        <StyleTextField5
                          variant="outlined"
                          value="-"
                          placeholder="-"
                          readOnly
                          disabled
                        />
                      </ModelInputBox>
                    ) : (
                      data.model_list.map((d) => (
                        <ModelInputBox key={d}>
                          <StyleTextField5
                            variant="outlined"
                            value={d}
                            placeholder="-"
                            readOnly
                            disabled
                          />
                        </ModelInputBox>
                      ))
                    )}
                  </ModelInput>
                </ModelWrap>
              </InputWrap>
            </Rows>
            <Rows active={isdrawer}>
              <InputWrap margin="20px" width="96%">
                <InputTitle>
                  유가 여부
                  {/* <Required src={StarIcon} alt="require" /> */}
                  <Require>*</Require>
                </InputTitle>
                <ModelWrap active={isdrawer}>
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
                    <StyleTextField5
                      variant="outlined"
                      value={
                        data.own_paid_pictorial_yn
                          ? data.own_paid_pictorial_content
                          : "-"
                      }
                      placeholder="-"
                      readOnly
                      disabled
                    />
                  </div>
                </ModelWrap>
                <ModelWrap active={isdrawer}>
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
                    <StyleTextField5
                      variant="outlined"
                      value={
                        data.other_paid_pictorial_yn
                          ? data.other_paid_pictorial_content
                          : "-"
                      }
                      placeholder="-"
                      readOnly
                      disabled
                    />
                  </div>
                </ModelWrap>
              </InputWrap>
            </Rows>
            <Rows active={isdrawer}>
              <InputWrap margin="20px" width="96%">
                <InputTitle>로케촬영</InputTitle>
                <ModelWrap active={isdrawer}>
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
                    <StyleTextField5
                      variant="outlined"
                      value={data.loc_yn ? data.loc_value : "-"}
                      placeholder="-"
                      readOnly
                      disabled
                    />
                  </div>
                </ModelWrap>
              </InputWrap>
            </Rows>
           {/*  <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>당일연결 희망 / 가능 여부</InputTitle>
                <HopeBtnWrap active={isdrawer}>
                  <Btn active={data.today_connect} active2={isdrawer}>
                    <StyleCheckIcon />
                    Yes
                  </Btn>
                  <Btn active={!data.today_connect} active2={isdrawer}>
                    <StyleCheckIcon />
                    No
                  </Btn>
                </HopeBtnWrap>
              </InputWrap>
            </Rows> */}
            <Rows active={isdrawer}>
              <InputWrap margin="20px">
                <InputTitle>
                  페이지 수<Require>*</Require>
                </InputTitle>
                <StyleTextField2
                  variant="outlined"
                  value={data.page_cnt}
                  placeholder="-"
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>함께 들어가는 브랜드</InputTitle>
                <StyleTextField2
                  variant="outlined"
                  value={data.etc_brand_info}
                  placeholder="-"
                  readOnly
                  disabled
                />
              </InputWrap>
            </Rows>
            <Rows active={isdrawer}>
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
            <ConfirmBtnWrap>
              <ConfirmBtn onClick={handleClickConfirm}>
                <img src={ConfirmIcon} alt="confirm" />
                Confirm
              </ConfirmBtn>
            </ConfirmBtnWrap>
          </DetailWrap>
        </ExpandBody>
      </ExpandBodyWrap>

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

const ExpandBodyWrap = styled.div`
  border-bottom: 1px solid #dddddd;
  visibility: hidden;
  height: 0;
  width: 100%;
  ${(props) =>
    props.open &&
    css`
      visibility: visible;
      height: auto;
    `}
`;

const ExpandBody = styled.div`
  display: flex;
  padding: 20px 0;
`;
/* 1920 - 700 280 = */
const DetailWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;  
  width:97%;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "750px" : "750px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "750px" : "700px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "660px" : "330px")};
    
  }  
`;

const Rows = styled.div`
  
  @media (min-width: 1920px) {
    display: flex;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    display: ${(props) => (props.active ? "flex" : "relative")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
   
  }  
  margin-bottom: 40px;

  ${(props) =>
    props.opt === "sbt" &&
    css`
      justify-content: space-between;
    `}
`;

const Box = styled.div`
  display: flex;
  margin-bottom:10px;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (min-width: 1920px) {
    width: ${(props) => (props.active ? "700px" : "700px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: ${(props) => (props.active ? "700px" : "300px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "280px" : "280px")};
  }  
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${(props) => props.margin || "0"};
  width: ${(props) => props.width || "90%"};
  margin-bottom: 12px;
`;

const InputTitle = styled.div`
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const StyleTextField = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 13px 14px;
  }
  .MuiInputBase-root {
    width: 100%;
    height: 42px;
  }

  .MuiInputBase-root.Mui-disabled {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
  }

  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }

  margin-right: 20px;
`;

const StyleTextField2 = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 13px 14px;
  }
  .MuiInputBase-root {
    width: 100%;
    height: 42px;
  }

  .MuiInputBase-root.Mui-disabled {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
  }

  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }
  margin-right: 20px;
`;

const StyleTextField3 = styled(TextField)`
  .MuiOutlinedInput-multiline {
    padding: 13px 14px;
  }
  .MuiInputBase-root.Mui-disabled {
    color: #000000;
  }
  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }
  width: 97%;
`;

const StyleTextField4 = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 13px 14px;
  }
  .MuiInputBase-root {
    width: 300px;
    height: 42px;
  }

  .MuiInputBase-root.Mui-disabled {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
  }

  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }
`;

const StyleTextField5 = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 13px 14px;
  }
  .MuiInputBase-root {
    width: 100%;
    height: 42px;
  }

  .MuiInputBase-root.Mui-disabled {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
  }

  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }

  .MuiInputBase-input.Mui-disabled {
    color: #999999;
  }
`;

const ModelWrap = styled.div`
  display: flex;  
  margin-bottom: 20px;
`;

const CheckBoxWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  margin-right: 12px;
`;

const CheckBoxWrap2 = styled.div`
  display: flex;
  min-width: 120px;

  align-items: top;
  justify-content: left;
  font-size: 15px;
`;

const CheckBoxImg = styled.img`
  max-width: 20px;
  margin-right: 12px;
`;

const CheckBoxWrapDetail = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
`;

const Btn = styled.div`

  @media (min-width: 1920px) {
    width: ${(props) => (props.active2 ? "180px" : "180px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: ${(props) => (props.active2 ? "180px" : "180px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active2 ? "180px" : "130px")};
  } 
  height: 42px;
  margin-right:20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: solid 1px #dddddd;
  font-size: 16px;
  color: #999999;

  ${(props) =>
    props.active &&
    css`
      border-color: #7ea1b2;
      color: #7ea1b2;
    `}
`;

const Required = styled.img`
  margin-left: 8px;
`;

const Require = styled.span`
  color: #7ea1b2;
`;

const HopeBtnWrap = styled.div`
  display: flex;
  
  @media (min-width: 1920px) {
    width: ${(props) => (props.active ? "750px" : "750px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: ${(props) => (props.active ? "750px" : "700px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "660px" : "330px")};
  } 
`;

const StyleCheckIcon = styled(CheckIcon)`
  font-size: 16px;
  margin-right: 12px;
`;

const ModelInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    margin-left: 10px;
  }
`;

const ModelInputBox = styled.div`
  display: flex;
  & + & {
    margin-top: 10px;
  }
`;

const ConfirmBtnWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
  margin-top: 20px;
`;

const ConfirmBtn = styled.div`
  width: 200px;
  height: 60px;
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

export default React.memo(SampleRequestTableDetail);
