import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { lighten, darken } from "polished";
import { TextField } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import dayjs from "dayjs";
import moment from "moment";
import { useQuery, useMutation } from "react-query";

import CancelIcon from "assets/close_icon.png";
import CheckBoxOn from "assets/checkbox_on.png";
import CheckBoxOff from "assets/checkbox_off.png";
import ImgCheckIcon from "assets/check_icon_large.svg";
import StarIcon from "assets/star_icon.svg";
import SelectInput from "components/common/selectInput";
import SelectInputAddress from "components/magazine/sample_requests/selectInputAddress";
// import DatePicker from "components/DatePicker";
import DatePicker from "components/SampleDatePicker";
import TimePicker from "components/TimePicker";
import AddressDialog from "components/AddressDialog";
import ModelAddBtn from "assets/model_add_btn.svg";
import ModelDelBtn from "assets/model_del_btn.svg";
import ModelTextInput from "components/magazine/sample_requests/ModelTextInput";
import { apiObject } from "api/api_magazine";
import Progress from "components/common/progress";
import utils from "utils";

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

const CancelTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #999999;
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

const StyleTextField2 = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 13px 14px;
    font-weight: 500;
  }
  .MuiInputBase-root {
    height: 42px;
    @media (min-width: 1920px) {
        width: 740px
    }
    @media (min-width: 1440px) and (max-width: 1919px) {
        width: 720px
    }
    @media (min-width: 10px) and (max-width: 1439px) {
        width: 580px
    }  
  }

  .MuiInputBase-root.Mui-disabled {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
  }

  .MuiOutlinedInput-notchedOutline {
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

const StyleTextField4 = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 13px 14px;
  }
  .MuiInputBase-root {
    height: 42px;
    @media (min-width: 1920px) {
        width: 620px
    }
    @media (min-width: 1440px) and (max-width: 1919px) {
        width: 620px
    }
    @media (min-width: 10px) and (max-width: 1439px) {
        width: 450px
    }  
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

const Img = styled.img`
  width: 240px;
  height: 360px;
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}") no-repeat center;
          background-size: cover;
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

const DelIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: #000000;
  border: solid 2px #f1f2ea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 18px;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
`;

const Required = styled.img`
  margin-left: 8px;
`;

const HopeBtnWrap = styled.div`
    display: flex;
    @media (min-width: 1920px) {
        width: 560px
    }
    @media (min-width: 1440px) and (max-width: 1919px) {
        width: 560px
    }
    @media (min-width: 10px) and (max-width: 1439px) {
        width: 540px
    } 
    justify-content: space-between;
`;
const SelectInputWrap = styled.div`  
  @media (min-width: 1920px) {
    width: 740px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 740px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 600px
  }   
`;
const InputRead = styled.div`
  @media (min-width: 1920px) {
    min-width: 140px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    min-width: 400px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: 280px;
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

const AddressWrap = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const AddressRead = styled.div`
  @media (min-width: 1920px) {
    width: 740px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 620px
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

const AddressBtn = styled.div`
  width: 100px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background-color: #000000;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background-color: ${darken(0.8, "#ffffff")};
  }
  &:active {
    background-color: ${darken(0.7, "#ffffff")};
  }
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

const Require = styled.span`
  color: #7ea1b2;
`;

export default function TemporaryComponent({
  data,
  imsi,
  brandId,
  handleCancel,
  handleSubmit,
  handleTemporarySave,
}) {

  console.log('imsiimsiimsi',imsi);
  const [inputs, setInputs] = useState({
    photogrf_concept: imsi.photogrf_concept,
    picalbm_chk: imsi.picalbm_chk,
    own_paid_pictorial_content: imsi.own_paid_pictorial_content,
    other_paid_pictorial_content: imsi.other_paid_pictorial_content,
    page_cnt: imsi.page_cnt,
    etc_brand: imsi.etc_brand,
    today_connect: imsi.today_connect,
    add_req_cntent: imsi.add_req_cntent,
    dlvy_adres_no : imsi.dlvy_adres_no,
    dlvy_adres_nm: imsi.dlvy_adres_nm,
    address: imsi.address,
    address_more: imsi.address_more,
    post_no: imsi.post_no,
    dlvy_atent_matter: imsi.dlvy_atent_matter,
    contact_user_id: imsi.contact_user_id,
    loc_yn: imsi.loc_yn,
    loc_value: imsi.loc_value,
  });
  const [showroomList, setShowroomList] = useState(data.showroom_info);
  const [shootingDt, setShootingDt] = useState(imsi.photogrf_dt || "");
  const [pickupDt, setPickupDt] = useState(imsi.duty_recpt_dt || "");
  const [returningDt, setReturningDt] = useState(imsi.return_prearnge_dt || "");
  const [startTime, setStartTime] = useState({
    hour: imsi.begin_dt.hour,
    ampm: imsi.begin_dt.ampm,
  });
  const [endTime, setEndTime] = useState({
    hour: imsi.end_dt.hour,
    ampm: imsi.end_dt.ampm,
  });
  const [year, setYear] = useState(dayjs().format("YYYY"));
  const [today, setToday] = useState(moment());

  const [address, setAddress] = useState(false);

  const [celebCheck, setCelebCheck] = useState(imsi.celeb_list_yn);
  const [celebList, setCelebList] = useState(imsi.celeb_list);
  const [celebCnt, setCelebCnt] = useState(imsi.celeb_list.length || 1);

  const [modelCheck, setModelCheck] = useState(imsi.model_list_yn);
  const [modelList, setModelList] = useState(imsi.model_list);
  const [modelCnt, setModelCnt] = useState(imsi.model_list.length || 1);

  const handleClick = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressClick = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
      dlvy_adres_no : e.target.value,
      address: shipping_dest_options.find((v) => v.value === e.target.value).nm,
      address_more: shipping_dest_options.find(
        (v) => v.value === e.target.value
      ).detail,
    });
  };

  const handleChangeStartTime = (ampm, newTime) => {
    setStartTime({
      hour: newTime,
      ampm: ampm,
    });
  };

  const handleChangeEndTime = (ampm, newTime) => {
    setEndTime({
      hour: newTime,
      ampm: ampm,
    });
  };

  const handleCelebAdd = () => {
    setCelebCnt(celebCnt + 1);
  };

  const handleCelebDel = (idx) => {
    setCelebList(celebList.filter((v, i) => i !== idx && v));
    setCelebCnt(celebCnt - 1);
  };

  const handleModelAdd = () => {
    setModelCnt(modelCnt + 1);
  };

  const handleModelDel = (idx) => {
    setModelList(modelList.filter((v, i) => i !== idx && v));
    setModelCnt(modelCnt - 1);
  };

  const handleShowroominfo = (data) => {
    if ( showroomList.length === 1 ) {
      utils.customAlert('최소 1개이상은 선택하셔야 합니다.');
      return;
    }else{
      setShowroomList(
        showroomList.some((d) => d.showroom_no === data)
          ? showroomList.filter((v) => v.showroom_no !== data)
          : { ...showroomList }
      );
    }
  };

  const handlePicalbmChk = (act) => {
    if (act === "own") {
      setInputs({
        ...inputs,
        picalbm_chk: "own",
        other_paid_pictorial_content: "",
      });
    }

    if (act === "other") {
      setInputs({
        ...inputs,
        picalbm_chk: "other",
        own_paid_pictorial_content: "",
      });
    }
  };

  const handleShootingDtClick = async(date) => {
    /* const dateFormat = moment(date).format("YYYY-MM-DD");
        const TodayFormat = moment().format("YYYY-MM-DD");
    let reservationArray =  [];
    await data.showroom_info.forEach((d2, i2) => {
        if ( !utils.isEmpty(d2.reservation_list) ) {
            reservationArray = reservationArray.concat(d2.reservation_list);
        }
    });        
    const isCheck = (element) => ( element.photogrf_dt == dateFormat || element.duty_recpt_dt == dateFormat || element.return_prearnge_dt == dateFormat);
    if ( reservationArray.some(isCheck) ) {
      utils.customAlert('해당일자에는 이미 예약이 되어 있습니다.');
      setShootingDt('');
      setPickupDt('');
      setReturningDt('');
      return false;
    }else if ( TodayFormat >=  dateFormat) {
        utils.customAlert('오늘보다 이전일자로는 예약이 불가합니다.');
        setShootingDt('');
        setPickupDt('');
        setReturningDt('');
        return false;
    }else{ */
      let pDt =
        moment(date).subtract({ day: 1 }).day() === 0
          ? moment(date).subtract({ day: 3 }).format("YYYY-MM-DD")
          : moment(date).subtract({ day: 1 }).day() === 6
          ? moment(date).subtract({ day: 2 }).format("YYYY-MM-DD")
          : moment(date).subtract({ day: 1 }).format("YYYY-MM-DD");
      for (let i = 0; i < unavailDt.length; i++) {
        unavailDt.find(
          (v) =>
            v === pDt &&
            (pDt =
              moment(pDt).subtract({ day: 1 }).day() === 0
                ? moment(pDt).subtract({ day: 3 }).format("YYYY-MM-DD")
                : moment(pDt).subtract({ day: 1 }).day() === 6
                ? moment(pDt).subtract({ day: 2 }).format("YYYY-MM-DD")
                : moment(pDt).subtract({ day: 1 }).format("YYYY-MM-DD"))
        );
      }

      let rDt =
        moment(date).add({ day: 1 }).day() === 6
          ? moment(date).add({ day: 3 }).format("YYYY-MM-DD")
          : moment(date).add({ day: 1 }).day() === 0
          ? moment(date).add({ day: 2 }).format("YYYY-MM-DD")
          : moment(date).add({ day: 1 }).format("YYYY-MM-DD");
      for (let i = 0; i < unavailDt.length; i++) {
        unavailDt.find(
          (v) =>
            v === rDt &&
            (rDt =
              moment(rDt).add({ day: 1 }).day() === 6
                ? moment(rDt).add({ day: 3 }).format("YYYY-MM-DD")
                : moment(rDt).add({ day: 1 }).day() === 0
                ? moment(rDt).add({ day: 2 }).format("YYYY-MM-DD")
                : moment(rDt).add({ day: 1 }).format("YYYY-MM-DD"))
        );
      }
      setPickupDt(pDt);
      setReturningDt(rDt);
      // console.log("pdt : ", pDt, ", rdt : ", rDt);
    //}
  };

  const handleSampleRequest = () => {
    let newShowroomList = [];
    showroomList.forEach((d) => newShowroomList.push(d.showroom_no));

    let requestBody = {
      duty_recpt_dt: dayjs(pickupDt).unix(),
      photogrf_dt: dayjs(shootingDt).unix(),
      begin_dt: utils.changeHour(startTime.ampm, startTime.hour),
      end_dt: utils.changeHour(endTime.ampm, endTime.hour),
      return_prearnge_dt: dayjs(returningDt).unix(),
      photogrf_concept: inputs.photogrf_concept,
      model_list: !modelCheck ? [] : modelList.filter((v) => v !== ""),
      model_list_yn: modelCheck,
      celeb_list: !celebCheck ? [] : celebList.filter((v) => v !== ""),
      celeb_list_yn: celebCheck,
      own_paid_pictorial_content: inputs.own_paid_pictorial_content,
      other_paid_pictorial_content: inputs.other_paid_pictorial_content,
      page_cnt: inputs.page_cnt,
      etc_brand: inputs.etc_brand,
      today_connect: inputs.today_connect ? "Y" : "N",
      add_req_cntent: inputs.add_req_cntent,
      dlvy_adres_no: inputs.dlvy_adres_no, 
      dlvy_adres_nm: inputs.address,
      adres_detail: inputs.address_more,
      dlvy_atent_matter: inputs.dlvy_atent_matter,
      showroom_list: newShowroomList,
      contact_user_id: inputs.contact_user_id,
      loc_yn: inputs.loc_yn,
      loc_value: inputs.loc_value,
    };
    handleSubmit(requestBody);
  };

  const handleTemporary = () => {
    let newShowroomList = [];
    showroomList.forEach((d) => newShowroomList.push(d.showroom_no));

    let requestBody = {
      brand_id: brandId,
      duty_recpt_dt: pickupDt,
      photogrf_dt: shootingDt,
      begin_dt: {
        hour: startTime.hour,
        ampm: startTime.ampm,
      },
      end_dt: {
        hour: endTime.hour,
        ampm: endTime.ampm,
      },
      return_prearnge_dt: returningDt,
      photogrf_concept: inputs.photogrf_concept,
      model_list: !modelCheck ? [] : modelList.filter((v) => v !== ""),
      model_list_yn: modelCheck,
      celeb_list: !celebCheck ? [] : celebList.filter((v) => v !== ""),
      celeb_list_yn: celebCheck,
      picalbm_chk: inputs.picalbm_chk,
      own_paid_pictorial_content: inputs.own_paid_pictorial_content,
      other_paid_pictorial_content: inputs.other_paid_pictorial_content,
      page_cnt: inputs.page_cnt,
      etc_brand: inputs.etc_brand,
      today_connect: inputs.today_connect,
      add_req_cntent: inputs.add_req_cntent,
      dlvy_adres_nm: inputs.dlvy_adres_nm,
      dlvy_adres_no: inputs.dlvy_adres_no, 
      address: inputs.address,
      address_more: inputs.address_more,
      post_no: inputs.post_no,
      dlvy_atent_matter: inputs.dlvy_atent_matter,
      showroom_list: newShowroomList,
      contact_user_id: inputs.contact_user_id,
      loc_yn: inputs.loc_yn,
      loc_value: inputs.loc_value,
    };

    // console.log("REQUEST BODY : ", requestBody);
    handleTemporarySave(requestBody);
  };

  const contact_options = data.contact_info.map((d) => ({
    value: d.user_id,
    label: d.mgzn_user_nm,
  }));

  let shipping_dest_options = [];
  data.user.forEach((d, i) => {
      if ( !utils.isEmpty(d.dlvy_adres_no) ) {
        shipping_dest_options.push({
          value: d.dlvy_adres_no,
          label: d.dlvy_adres_nm + " " + d.adres_detail,
          nm: d.dlvy_adres_nm,
          detail: d.adres_detail,
        })
      }
    }
  );

  const getHoliday = useQuery(
    ["sample-request-holiday", year, brandId],
    async () =>
      await apiObject.getBrandHoliday({
        year,
        brand_id: brandId,
      })
  );

/*   let reservationArray =  [];
  data.showroom_info.forEach((d2, i2) => {
      if ( !utils.isEmpty(d2.reservation_list) ) {
          d2.reservation_list.forEach((d3, i3) => {
              if ( !utils.isEmpty(d3.photogrf_dt)) reservationArray = reservationArray.concat(d3.photogrf_dt);
              if ( !utils.isEmpty(d3.duty_recpt_dt)) reservationArray = reservationArray.concat(d3.duty_recpt_dt);
              if ( !utils.isEmpty(d3.return_prearnge_dt)) reservationArray = reservationArray.concat(d3.return_prearnge_dt);
          })
      }
  });    
  const unavailDt2 = getHoliday.isLoading ? [] : reservationArray.concat(getHoliday.data.list.map((d) => dayjs.unix(d).format("YYYY-MM-DD")));   */  
  const unavailDt = getHoliday.isLoading ? [] : getHoliday.data.list.map((d) => dayjs.unix(d).format("YYYY-MM-DD"));
  if (getHoliday.isLoading) {
      return <Progress type="load" />;
  }
  return (
    <>
      <InputContainer>
        {data.brand_logo_url_adres !== null && (
          <BrandLogo src={data.brand_logo_url_adres} alt="logo" />
        )}
        <DataWrap>
          <ImgWrap isData={showroomList.length > 0 ? true :false}>
            {showroomList.map((d) => (
              <ImgDiv key={d.showroom_no}>
                <Img imgUrl={d.img_url_adres} />
                <ImgTitle>{d.showroom_nm}</ImgTitle>
                <ImgCover>
                  <img src={ImgCheckIcon} alt="checked" />
                </ImgCover>
                <DelIcon onClick={() => handleShowroominfo(d.showroom_no)}>
                  <CloseIcon />
                </DelIcon>
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
                <InputWrap>
                  <InputTitle>
                    담당 기자/스타일리스트<Require>*</Require>
                  </InputTitle>
                  <InputRead>{data.user_nm}</InputRead>
                </InputWrap>
              </Box>
            </Rows>
            <Rows>
              <Box>
                <InputWrap>
                  <InputTitle>연결 연락처<Require>*</Require></InputTitle>
                  <Box>
                    <SelectInput
                      width="140px"
                      height="42px"
                      name="contact_user_id"
                      options={contact_options}
                      value={inputs.contact_user_id}
                      handleClick={handleClick}
                    />
                    <InputRead>
                      {inputs.contact_user_id === ""
                        ? ""
                        : utils.phoneFormat(
                            data.contact_info.find(
                              (v) => v.user_id === inputs.contact_user_id
                            ).phone_no
                          )}
                    </InputRead>
                  </Box>
                </InputWrap>
              </Box>
            </Rows>
            <Rows>
              <InputWrap margin="10px">
                <InputTitle>
                  촬영일<Require>*</Require>
                </InputTitle>
                <DatePicker
                  shooting_yn={true}
                  dt={shootingDt}
                  setDt={setShootingDt}
                  unavailDt={unavailDt}
                  initDt={today}
                  setInitDt={setToday}
                  year={year}
                  setYear={setYear}
                  handleShootingDtClick={handleShootingDtClick}
                />
              </InputWrap>
              <InputWrap margin="10px">
                <InputTitle>
                  픽업일<Require>*</Require>
                </InputTitle>
                <DatePicker
                  dt={pickupDt}
                  setDt={setPickupDt}
                  unavailDt={unavailDt}
                  initDt={today}
                  setInitDt={setToday}
                  year={year}
                  setYear={setYear}
                  iseditable={false}
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="10px">
                <InputTitle>
                  반납일<Require>*</Require>
                </InputTitle>
                <DatePicker
                  dt={returningDt}
                  setDt={setReturningDt}
                  unavailDt={unavailDt}
                  initDt={today}
                  setInitDt={setToday}
                  year={year}
                  setYear={setYear}
                  iseditable={false}
                />
              </InputWrap>
              <InputWrap margin="10px">
                <InputTitle>촬영 시작 시간</InputTitle>
                <TimePicker
                  time={startTime}
                  setTime={setStartTime}
                  handleChange={handleChangeStartTime}
                />
              </InputWrap>
              <InputWrap>
                <InputTitle>촬영 종료 시간</InputTitle>
                <TimePicker
                  time={endTime}
                  setTime={setEndTime}
                  handleChange={handleChangeEndTime}
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>수령 주소<Require>*</Require></InputTitle>
                <SelectInputWrap>
                  <SelectInput
                    width="100%"
                    height="42px"
                    defaultValue="최근 배송지"
                    options={shipping_dest_options}
                    name="dlvy_adres_nm"
                    value={inputs.dlvy_adres_nm}
                    handleClick={handleAddressClick}
                  />
                </SelectInputWrap>
                <AddressWrap>
                  <AddressRead onClick={() => setAddress(true)}>
                    {inputs.address}
                  </AddressRead>
                  <AddressBtn onClick={() => setAddress(true)}>
                    주소검색
                  </AddressBtn>
                </AddressWrap>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.address_more}
                  name="address_more"
                  style={{ marginTop: "10px" }}
                  onChange={handleClick}
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>배송 관련 메모</InputTitle>
                <StyleTextField3
                  variant="outlined"
                  value={inputs.dlvy_atent_matter}
                  placeholder="배송 관련 메모를 입력해주세요."
                  name="dlvy_atent_matter"
                  multiline
                  rows={4}
                  onChange={handleClick}
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>촬영컨셉</InputTitle>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.photogrf_concept}
                  name="photogrf_concept"
                  placeholder="촬영컨셉을 입력해주세요."
                  onChange={handleClick}
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>
                  모델
                  <Require>*</Require>
                </InputTitle>
                <ModelWrap>
                  <CheckBoxWrap onClick={() => setCelebCheck(!celebCheck)}>
                    <CheckBoxWrapDetail>
                      <CheckBoxImg
                        src={celebCheck ? CheckBoxOn : CheckBoxOff}
                        alt=""
                      />
                      셀러브리트
                    </CheckBoxWrapDetail>
                  </CheckBoxWrap>
                  <ModelInput>
                    {[...Array(celebCnt)].map((d, i) => (
                      <ModelInputBox key={`${d}_${i}`}>
                        <ModelTextInput
                          checked={celebCheck}
                          placeHolder="셀러브리티 정보를 등록해주세요."
                          idx={i}
                          data={celebList}
                          setData={setCelebList}
                        />
                        { celebCheck &&
                          <img
                            src={i === 0 ? ModelAddBtn : ModelDelBtn}
                            onClick={i === 0 ? handleCelebAdd : () => handleCelebDel(i)}
                          />
                        }
                      </ModelInputBox>
                    ))}
                  </ModelInput>
                </ModelWrap>
                <ModelWrap>
                  <CheckBoxWrap onClick={() => setModelCheck(!modelCheck)}>
                    <CheckBoxWrapDetail>
                      <CheckBoxImg
                        src={modelCheck ? CheckBoxOn : CheckBoxOff}
                        alt=""
                      />
                      패션 모델
                    </CheckBoxWrapDetail>
                  </CheckBoxWrap>
                  <ModelInput>
                    {[...Array(modelCnt)].map((d, i) => (
                      <ModelInputBox key={`${d}_${i}`}>
                        <ModelTextInput
                          checked={modelCheck}
                          placeHolder="패션 모델 정보를 등록해주세요."
                          idx={i}
                          data={modelList}
                          setData={setModelList}
                        />
                        { modelCheck &&
                          <img
                            src={i === 0 ? ModelAddBtn : ModelDelBtn}
                            onClick={i === 0 ? handleModelAdd : () => handleModelDel(i)}
                          />
                        }
                      </ModelInputBox>
                    ))}
                  </ModelInput>
                </ModelWrap>
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>유가 여부</InputTitle>
                <ModelWrap>
                  <CheckBoxWrap2 onClick={() => handlePicalbmChk("own")}>
                    <CheckBoxWrapDetail>
                      <CheckBoxImg
                        src={
                          inputs.picalbm_chk === "own"
                            ? CheckBoxOn
                            : CheckBoxOff
                        }
                        alt=""
                      />
                      자사유가
                    </CheckBoxWrapDetail>
                  </CheckBoxWrap2>
                  <div>
                    <StyleTextField4
                      variant="outlined"
                      value={inputs.own_paid_pictorial_content}
                      name="own_paid_pictorial_content"
                      placeholder="브랜드명을 입력해주세요."
                      onChange={handleClick}
                      readOnly={inputs.picalbm_chk !== "own" ? true : false}
                      disabled={inputs.picalbm_chk !== "own" ? true : false}
                    />
                  </div>
                </ModelWrap>
                <ModelWrap>
                  <CheckBoxWrap2 onClick={() => handlePicalbmChk("other")}>
                    <CheckBoxWrapDetail>
                      <CheckBoxImg
                        src={
                          inputs.picalbm_chk === "other"
                            ? CheckBoxOn
                            : CheckBoxOff
                        }
                        alt=""
                      />
                      타사유가
                    </CheckBoxWrapDetail>
                  </CheckBoxWrap2>
                  <div>
                    <StyleTextField4
                      variant="outlined"
                      value={inputs.other_paid_pictorial_content}
                      name="other_paid_pictorial_content"
                      placeholder="브랜드명을 입력해주세요."
                      onChange={handleClick}
                      readOnly={inputs.picalbm_chk !== "other" ? true : false}
                      disabled={inputs.picalbm_chk !== "other" ? true : false}
                    />
                  </div>
                </ModelWrap>
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>로케촬영</InputTitle>
                <ModelWrap>
                  <CheckBoxWrap2
                    onClick={() =>
                      setInputs({ ...inputs, loc_yn: !inputs.loc_yn })
                    }
                  >
                    <CheckBoxWrapDetail>
                      <CheckBoxImg
                        src={inputs.loc_yn ? CheckBoxOn : CheckBoxOff}
                        alt=""
                      />
                      로케촬영
                    </CheckBoxWrapDetail>
                  </CheckBoxWrap2>
                  <div>
                    <StyleTextField4
                      variant="outlined"
                      value={inputs.loc_value}
                      name="loc_value"
                      placeholder="촬영지 정보를 입력해주세요."
                      onChange={handleClick}
                      readOnly={!inputs.loc_yn}
                      disabled={!inputs.loc_yn}
                    />
                  </div>
                </ModelWrap>
              </InputWrap>
            </Rows>
            {/* <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>당일연결 희망 / 가능 여부</InputTitle>
                <HopeBtnWrap>
                  <Btn
                    active={inputs.today_connect}
                    onClick={() =>
                      setInputs({ ...inputs, today_connect: true })
                    }
                  >
                    <StyleCheckIcon />
                    Yes
                  </Btn>
                  <Btn
                    active={!inputs.today_connect}
                    onClick={() =>
                      setInputs({ ...inputs, today_connect: false })
                    }
                  >
                    <StyleCheckIcon />
                    No
                  </Btn>
                </HopeBtnWrap>
              </InputWrap>
            </Rows> */}
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>페이지 수</InputTitle>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.page_cnt}
                  name="page_cnt"
                  placeholder="페이지 수를 입력해주세요."
                  onChange={handleClick}
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>함께 들어가는 브랜드</InputTitle>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.etc_brand}
                  name="etc_brand"
                  placeholder="함께 들어가는 브랜드를 입력해주세요."
                  onChange={handleClick}
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>메시지</InputTitle>
                <StyleTextField3
                  variant="outlined"
                  value={inputs.add_req_cntent}
                  name="add_req_cntent"
                  placeholder="메시지를 입력해주세요."
                  multiline
                  rows={4}
                  onChange={handleClick}
                />
              </InputWrap>
            </Rows>
            <Rows>
              <BottomWrap>
                <BtnWrap type="cancel" onClick={handleCancel}>
                  <BtnImgWrap>
                    <img src={CancelIcon} alt="close"></img>
                  </BtnImgWrap>
                  <CancelTxt>취소</CancelTxt>
                </BtnWrap>
                <BtnWrap type="cancel" onClick={handleTemporary}>
                  <CancelTxt>임시 저장</CancelTxt>
                </BtnWrap>
                <BtnWrap type="confirm" onClick={handleSampleRequest}>
                  <ConfirtTxt>홀딩 요청</ConfirtTxt>
                </BtnWrap>
              </BottomWrap>
            </Rows>
          </DetailWrap>
        </DataWrap>
      </InputContainer>

      <AddressDialog
        open={address}
        setOpen={setAddress}
        inputs={inputs}
        setInputs={setInputs}
      />
    </>
  );
}
