import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import { darken, lighten } from "polished";
import { TextField } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import useOutsideClick from "components/UseOutsideClick";
import { useHistory } from "react-router-dom";
import { useQuery,useMutation } from "react-query";
import dayjs from "dayjs";

import CheckBoxOn from "assets/checkbox_on.png";
import CheckBoxOff from "assets/checkbox_off.png";
import ReviseIcon from "assets/revise_icon.svg";
import { apiObject } from "api/api_magazine";
import Progress from "components/common/progress";
import utils from "utils";
import Constants from 'utils/constants';
import ImgAcceptIcon from "assets/check_icon_large.svg";
import ImgRejectIcon from "assets/sample_reject_icon.svg";
import 'react-alert-confirm/dist/index.css';
import alertConfirm from 'react-alert-confirm';

const domain = window.location.href.split("magazine/sample_requests")[0];

export default function SampleRequestsDetail({ match }) {
  const ref = useRef();
  const history = useHistory();
  const req_no = match.params.request_no;
  const [selectOpen, setSelectOpen] = useState(false);
  const [temporary, setTemporary] = useState("");

  useOutsideClick(ref, () => {
    setSelectOpen(false);
  });

  const handleCancleBtn = async() => {    
    let confirmList = [];
    const today = dayjs().unix();
    if ( today > data.shooting_date ) {
      utils.customAlert('촬영일 이전에만 취소가 가능합니다!')
    }else{
      alertConfirm({
        title: Constants.appName,
        content: '홀딩요청을 취소하시겠습니까?',
        onOk: () => {cancleSampleRequest.mutate()},
        onCancel: () => {console.log('cancel')}
      });
    }
  };

  // cancel
  const cancleSampleRequest = useMutation(
    ["cancel-sample-request"],
    () => apiObject.cancelSampleRequest({ req_list: [req_no] , cancel_list : [req_no]}),
    {
      onSuccess: () => {
        utils.customAlert("정상적으로 취소처리 되었습니다.");
        history.goBack();
      },
      onError: () => {
        utils.customAlert("취소 중 오류가 발생했습니다.");
      },
    }
  );

  const handleReviseBtn = async() => {    
    //console.log('data.req_status_cd',data.req_status_cd)
    let confirmList = [];
    const today = dayjs().unix();
    if ( today > data.shooting_date && data.req_status_cd !== 'RS0001') {
      utils.customAlert('촬영일 이전에만 수정이 가능합니다!')
    }else{
      history.push("/magazine/sample_requests/edit/" + match.params.request_no);
    }
    /* await data.showroom_list.forEach((d, i) => {
        if ( d.showroom_status != 'undecided' ) {
          confirmList.push({showroom_no:d.showroom_no})
        }
      }
    );    
    if ( data.showroom_list.length === confirmList.length) {
      utils.customAlert('승인/거절등 처리가 완료되어 수정이 불가한 상태입니다.')
    }else{
      history.push("/magazine/sample_requests/edit/" + match.params.request_no);
    } */
  };

  const detailQuery = useQuery(
    ["sample-request-detail", req_no],
    async () =>
      await apiObject.detailSampleRequest({
        req_no: req_no,
      })
  );

  const chgTime = (t) => {
    let time = t;
    let ampm = t > 12 ? "PM" : "AM";
    return (time % 12) + ":00 " + ampm;
  };
  
  const data = detailQuery.isLoading ? [] : detailQuery.data;

  const handleMoveReplacement = (idx) => {
    history.push("/magazine/digital_showroom/detail/" + idx);
  };
  /* const handleMoveReplacement = (idx) => {
    const newWindow = window.open(domain + "magazine/ndigital_showroom/detail/" + idx, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  } */

  const handleReqeust = async(brand_id,idx) => {
    const temporary = {
      photogrf_concept: data.photogrf_concept,
      picalbm_chk: data.picalbm_chk,
      own_paid_pictorial_content: data.own_paid_pictorial_content,
      other_paid_pictorial_content: data.other_paid_pictorial_content,
      page_cnt: data.page_cnt,
      etc_brand: data.etc_brand,
      today_connect: data.today_connect,
      add_req_cntent: data.add_req_cntent,
      dlvy_adres_nm: data.dlvy_adres_nm,
      dlvy_adres_no : data.dlvy_adres_no,
      address: data.dlvy_adres_nm,
      address_more: data.adres_detail,
      post_no: data.post_no,
      dlvy_atent_matter: data.dlvy_atent_matter,
      contact_user_id: data.contact_user_id,
      req_user_id: data.req_user_id,
      loc_yn: data.loc_yn,
      loc_value: data.loc_value,
      photogrf_dt : dayjs.unix(data.shooting_date).format("YYYY-MM-DD"),
      photogrf_end_dt : dayjs.unix(data.shooting_end_date).format("YYYY-MM-DD"),
      duty_recpt_dt : dayjs.unix(data.pickup_date).format("YYYY-MM-DD"),
      return_prearnge_dt : dayjs.unix(data.returning_date).format("YYYY-MM-DD"),
      celeb_list_yn : data.celeb_list.length > 0 ? true : false,
      celeb_list : data.celeb_list,
      model_list_yn : data.model_list.length > 0 ? true : false,
      model_list : data.model_list,
      begin_dt : {
        hour : data.shooting_start_time, 
        ampm : data.shooting_start_time > 12 ? 'pm' : 'am'
      },
      end_dt : {
        hour : data.shooting_end_time,
        ampm : data.shooting_end_time > 12 ? 'pm' : 'am'
      }
    }
    await localStorage.setItem("imsi", JSON.stringify(temporary));
    history.push("/magazine/sample_requests/temporary/"+brand_id+"=" + idx);
  };

  if (detailQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <TitelWrap>
        <TitleTxt1>
          My Requests
          {!utils.isEmpty(data.canc_dt) && 
          <TitleTxt2>
            홀딩요청 취소하신 문서입니다.
            (취소일자 : {dayjs(data.canc_dt).format("YYYY/MM/DD(ddd)")})
          </TitleTxt2>
          }
        </TitleTxt1>
      </TitelWrap>

      <InputContainer>
        {data.brand_logo_url_adres !== null && (
          <BrandLogo src={data.brand_logo_url_adres} alt="logo" />
        )}
        <DataWrap>
          <ImgWrap isData={data.showroom_list.length > 0 ? true :false}>
            {
            !utils.isEmpty(data.showroom_list) &&
            data.showroom_list.map((d) => (
              <ImgDiv key={d.showroom_no}>
                <Img imgUrl={d.image_url} />
                <ImgTitle>{d.showroom_nm}</ImgTitle>
                <ImgCover>
                  { ( data.req_status_cd === 'RS0004' || data.req_status_cd === 'RS0010' ) ?
                  <img src={ImgRejectIcon } alt="checked" />
                  :
                  ( data.req_status_cd === 'RS0003' || data.req_status_cd === 'RS0006' ) ?
                  <img src={ImgAcceptIcon } alt="checked" />
                  :
                  null
                  }
                  </ImgCover>
                { ( d.showroom_status === 'rejected' && !utils.isEmpty(d.replacement_showroom_no) ) &&
                  <AddDiv>
                    <BtnWrap2  onClick={()=>handleMoveReplacement(d.replacement_showroom_no)}>
                      <ConfirtTxt2>대체 제안</ConfirtTxt2>
                    </BtnWrap2>
                    <BtnWrap2  onClick={() => handleReqeust(data.brand_id,d.replacement_showroom_no)}>
                      <ConfirtTxt2>대체홀딩신청</ConfirtTxt2>
                    </BtnWrap2>
                  </AddDiv>
                }
              </ImgDiv>
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
                  {data.shooting_date != data.shooting_end_date && "~"+dayjs.unix(data.shooting_end_date).format("MM/DD(ddd)")}
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
                {(data.own_paid_pictorial_yn == "" && data.own_paid_pictorial_yn  == "") && 
                  <ModelWrap>
                    <CheckBoxWrap2>
                      <CheckBoxWrapDetail>
                        <CheckBoxImg src={CheckBoxOn} alt=""/>
                        유가 없음
                      </CheckBoxWrapDetail>
                    </CheckBoxWrap2>
                  </ModelWrap>
                }
                { data.own_paid_pictorial_yn &&
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
                }
                { data.other_paid_pictorial_yn && 
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
              }
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
            <Rows>
              <BottomWrap>
                { (data.req_status_cd == 'RS0003' &&  !data.is_sendout && dayjs.unix(data.shooting_date).format("YYYY-MM-DD") > dayjs(new Date()).format('YYYY-MM-DD') ) && 
                <BtnWrap type="confirm" onClick={handleCancleBtn}>
                  <BtnImgWrap>
                    <img src={ReviseIcon} alt="close"></img>
                  </BtnImgWrap>
                  <ConfirtTxt>홀딩취소</ConfirtTxt>
                </BtnWrap>
                }
                <BtnWrap type="confirm" onClick={handleReviseBtn}>
                  <BtnImgWrap>
                    <img src={ReviseIcon} alt="close"></img>
                  </BtnImgWrap>
                  <ConfirtTxt>수정</ConfirtTxt>
                </BtnWrap>
              </BottomWrap>
            </Rows>
          </DetailWrap>
        </DataWrap>
      </InputContainer>
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
`;

const TitleTxt1 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-bottom: 10px;
  display:flex;
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
  width: 98%;
  
  
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


const AddDiv = styled.div`
  width: 100%;
  height: 60px;
  align-items: center;
  justify-content:center;
  display: flex;
`;

const BtnWrap2 = styled.div`  
  padding : 8px 10px 5px 10px;  
  cursor: pointer;
  background-color: #7ea1b2;  
  border-radius: 5px;  
  & {
    margin-left:5px;
  }
  
`;

const ConfirtTxt2 = styled.div`
  font-size: 15px;
  font-weight: 900;
  color: #ffffff;
  align-items: center;
  justify-content: center;
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
