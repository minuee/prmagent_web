import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { lighten, darken } from "polished";
import { TextField } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import dayjs from "dayjs";
import moment from "moment";
import { useQuery, useMutation } from "react-query";

import ReviseIcon from "assets/revise_icon.svg";
import CancelIcon from "assets/close_icon.png";
import CheckBoxOn from "assets/checkbox_on.png";
import CheckBoxOff from "assets/checkbox_off.png";
import ImgCheckIcon from "assets/check_icon_large.svg";
import StarIcon from "assets/star_icon.svg";
import SelectInput from "components/common/selectInput";
import DatePicker from "components/DatePicker";
import SampleDatePicker from "components/SampleDatePicker";
import TimePicker from "components/TimePicker";
import AddressDialog from "components/AddressDialog";
import ModelAddBtn from "assets/model_add_btn.svg";
import ModelDelBtn from "assets/model_del_btn.svg";
import ModelTextInput from "components/magazine/sample_requests/ModelTextInput";
import utils from "utils";
import Progress from "components/common/progress";
import { apiObject } from "api/api_magazine";

export default function AddComponent({
  data,
  options,
  handleCancel,
  handleSubmit,
}) {
  const [inputs, setInputs] = useState({
    photogrf_concept: data.photogrf_concept,
    own_paid_pictorial_content: data.own_paid_pictorial_content,
    other_paid_pictorial_content: data.other_paid_pictorial_content,
    picalbm_chk: data.own_paid_pictorial_yn ? "own" : "other",
    page_cnt: data.page_cnt,
    etc_brand: data.etc_brand_info,
    today_connect: data.today_connect,
    add_req_cntent: data.message,
    dlvy_adres_nm:data.dlvy_adres_nm,
    dlvy_adres_no : data.dlvy_adres_no,
    address: data.dlvy_adres_nm,
    address_more: data.adres_detail,
    post_no: "",
    dlvy_atent_matter: data.dlvy_atent_matter,
    contact_user_id: data.contact_user_id,
    loc_yn: data.loc_yn,
    loc_value: data.loc_value,
  });
  const brandId = data.brand_id;
  const [showroomList, setShowroomList] = useState(data.showroom_list);
  const [shootingDt, setShootingDt] = useState(
    dayjs.unix(data.shooting_date).toISOString()
  );
  const [pickupDt, setPickupDt] = useState(
    dayjs.unix(data.pickup_date).toISOString()
  );
  const [returningDt, setReturningDt] = useState(
    dayjs.unix(data.returning_date).toISOString()
  );
  const [startTime, setStartTime] = useState({
    hour: data.shooting_start_time % 12,
    ampm: data.shooting_start_time > 12 ? "PM" : "AM",
  });
  const [endTime, setEndTime] = useState({
    hour: data.shooting_end_time % 12,
    ampm: data.shooting_end_time > 12 ? "PM" : "AM",
  });

  const [address, setAddress] = useState(false);

  const [celebCheck, setCelebCheck] = useState(
    data.celeb_list.length > 0 ? true : false
  );
  const [celebList, setCelebList] = useState(data.celeb_list);
  const [celebCnt, setCelebCnt] = useState(data.celeb_list.length);

  const [modelCheck, setModelCheck] = useState(
    data.model_list.length > 0 ? true : false
  );
  const [modelList, setModelList] = useState(data.model_list);
  const [modelCnt, setModelCnt] = useState(data.model_list.length);
  const [year, setYear] = useState(dayjs().format("YYYY"));
  const [today, setToday] = useState(moment());

  const handleClick = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleShootingDtClick = async(date) => {
    const dateFormat = moment(date).format("YYYY-MM-DD");
    const TodayFormat = moment().format("YYYY-MM-DD");
    let reservationArray =  [];
    await data.showroom_info.forEach((d2, i2) => {
        if ( !utils.isEmpty(d2.reservation_list) ) {
            reservationArray = reservationArray.concat(d2.reservation_list);
        }
    });        
    const isCheck = (element) => ( element.photogrf_dt == dateFormat || element.duty_recpt_dt == dateFormat || element.return_prearnge_dt == dateFormat);
    //const isReservation = reservationArray.some(isCheck);
    //console.log('isReservation',isReservation)
    if ( reservationArray.some(isCheck) ) {
        alert('해당일자에는 이미 예약이 되어 있습니다.');
        setShootingDt(dayjs.unix(data.shooting_date).toISOString())       
        return false;
    }else if ( TodayFormat >=  dateFormat) {
        alert('오늘보다 이전일자로는 예약이 불가합니다.');
        setShootingDt(dayjs.unix(data.shooting_date).toISOString())  
        return false;
    }else{

        let pDt = moment(date).subtract({ day: 1 }).day() === 0
            ? moment(date).subtract({ day: 3 }).format("YYYY-MM-DD")
            : moment(date).subtract({ day: 1 }).day() === 6
            ? moment(date).subtract({ day: 2 }).format("YYYY-MM-DD")
            : moment(date).subtract({ day: 1 }).format("YYYY-MM-DD");
        for (let i = 0; i < unavailDt2.length; i++) {unavailDt2.find((v) => v === pDt &&
            (pDt =
                moment(pDt).subtract({ day: 1 }).day() === 0
                ? moment(pDt).subtract({ day: 3 }).format("YYYY-MM-DD")
                : moment(pDt).subtract({ day: 1 }).day() === 6
                ? moment(pDt).subtract({ day: 2 }).format("YYYY-MM-DD")
                : moment(pDt).subtract({ day: 1 }).format("YYYY-MM-DD"))
            );
        }

        let rDt = moment(date).add({ day: 1 }).day() === 6
            ? moment(date).add({ day: 3 }).format("YYYY-MM-DD")
            : moment(date).add({ day: 1 }).day() === 0
            ? moment(date).add({ day: 2 }).format("YYYY-MM-DD")
            : moment(date).add({ day: 1 }).format("YYYY-MM-DD");
        for (let i = 0; i < unavailDt2.length; i++) {
          unavailDt2.find((v) =>v === rDt &&
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
    }
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
      alert('최소 1개이상은 선택하셔야 합니다.');
      return;
    }else{
      setShowroomList(
        showroomList.some((d) => d.showroom_no === data)
          ? showroomList.filter((v) => v.showroom_no !== data)
          : { ...showroomList }
      );
    }
  };

  const handleSampleRequest = () => {
    let newShowroomList = [];
    showroomList.forEach((d) => newShowroomList.push(d.showroom_no));

    let newModelList = [];
    modelList.forEach((d) => d !== "" && newModelList.push(d));

    let newCelebList = [];
    celebList.forEach((d) => d !== "" && newCelebList.push(d));

    let requestBody = {
      duty_recpt_dt: dayjs(pickupDt).unix(),
      photogrf_dt: dayjs(shootingDt).unix(),
      begin_dt: utils.changeHour(startTime.ampm, startTime.hour),
      end_dt: utils.changeHour(endTime.ampm, endTime.hour),
      return_prearnge_dt: dayjs(returningDt).unix(),
      photogrf_concept: inputs.photogrf_concept,
      model_list: newModelList,
      celeb_list: newCelebList,
      own_paid_pictorial_content:
        inputs.picalbm_chk === "own" ? inputs.own_paid_pictorial_content : null,
      other_paid_pictorial_content:
        inputs.picalbm_chk === "other"
          ? inputs.other_paid_pictorial_content
          : null,
      page_cnt: inputs.page_cnt,
      etc_brand: inputs.etc_brand,
      today_connect: inputs.today_connect ? "Y" : "N",
      add_req_cntent: inputs.add_req_cntent,
      dlvy_adres_no : inputs.dlvy_adres_no === 0 ? '0' :  inputs.dlvy_adres_no,
      dlvy_adres_nm: inputs.address,
      adres_detail: inputs.address_more,
      dlvy_atent_matter: inputs.dlvy_atent_matter,
      showroom_list: newShowroomList,
      contact_user_id: inputs.contact_user_id,
      loc_yn: inputs.loc_yn,
      loc_value: inputs.loc_value,
    };
    handleSubmit(requestBody);
    // console.log("REQ BODY : ", requestBody);
  };

  const contact_options = options.contact_info.map((d) => ({
    value: d.user_id,
    label: d.mgzn_user_nm,
  }));

  /* const shipping_dest_options = options.user.map((d) => ({
    value: d.dlvy_adres_no,
    label: d.dlvy_adres_nm,
  })); */
  let shipping_dest_options = [];
  options.user.forEach((d, i) => {
    if ( !utils.isEmpty(d.dlvy_adres_no) ) {
      shipping_dest_options.push({
        value: d.dlvy_adres_no,
        label: d.dlvy_adres_nm,
        nm: d.dlvy_adres_nm,
        detail: d.adres_detail,
      })
    }
  });

  const getHoliday = useQuery(["sample-request-holiday", year, brandId],
    async () => await apiObject.getBrandHoliday({year,brand_id: brandId,})
  );
  let reservationArray =  [];
  data.reservation_list.forEach((d2, i2) => {
    if ( !utils.isEmpty(d2.photogrf_dt)) reservationArray = reservationArray.concat(d2.photogrf_dt);
    if ( !utils.isEmpty(d2.duty_recpt_dt)) reservationArray = reservationArray.concat(d2.duty_recpt_dt);
    if ( !utils.isEmpty(d2.return_prearnge_dt)) reservationArray = reservationArray.concat(d2.return_prearnge_dt);
  });
  const unavailDt2 = getHoliday.isLoading ? [] : reservationArray.concat(getHoliday.data.list.map((d) => dayjs.unix(d).format("YYYY-MM-DD")));
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
          <ImgWrap>
            {showroomList.map((d) => (
              <ImgDiv key={d.showroom_no}>
                <Img imgUrl={d.image_url} />
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
            <Rows opt="sbt">
              <Box>
                <InputWrap>
                  <InputTitle>Magazine</InputTitle>
                  <InputRead>{data.mgzn_nm}</InputRead>
                </InputWrap>
                <InputWrap>
                  <InputTitle>Editor/Stylist</InputTitle>
                  <InputRead>{options.user_nm}</InputRead>
                </InputWrap>
              </Box>
              <Box>
                <InputWrap>
                  <InputTitle>
                    Contact
                    <Required src={StarIcon} alt="require" />
                  </InputTitle>
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
                        : options.contact_info.find(
                            (v) => v.user_id === inputs.contact_user_id
                          ).phone_no}
                    </InputRead>
                  </Box>
                </InputWrap>
              </Box>
            </Rows>
            <Rows>
              <InputWrap margin="10px">
                <InputTitle>Shooting Date</InputTitle>
                <SampleDatePicker
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
                <InputTitle>Pickup Date</InputTitle>
                <DatePicker dt={pickupDt} setDt={setPickupDt} />
              </InputWrap>
              <InputWrap margin="10px">
                <InputTitle>Returning Date</InputTitle>
                <DatePicker dt={returningDt} setDt={setReturningDt} />
              </InputWrap>
              <InputWrap margin="10px">
                <InputTitle>Start Time</InputTitle>
                <TimePicker
                  time={startTime}
                  setTime={setStartTime}
                  handleChange={handleChangeStartTime}
                />
              </InputWrap>
              <InputWrap>
                <InputTitle>End Time</InputTitle>
                <TimePicker
                  time={endTime}
                  setTime={setEndTime}
                  handleChange={handleChangeEndTime}
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>
                  Shipping destination
                  <Required src={StarIcon} alt="require" />
                </InputTitle>
                <SelectInput
                  width="740px"
                  height="42px"
                  name="dlvy_adres_nm"
                  defaultValue="Last delivery address"
                  options={shipping_dest_options}
                  value={inputs.dlvy_adres_nm}
                  handleClick={handleAddressClick}
                />
                <AddressWrap>
                  <AddressRead onClick={() => setAddress(true)}>
                    {inputs.address === ""
                      ? inputs.dlvy_adres_nm
                      : inputs.address}
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
                <InputTitle>Shipping Notes</InputTitle>
                <StyleTextField3
                  variant="outlined"
                  value={inputs.dlvy_atent_matter}
                  placeholder="Notes"
                  name="dlvy_atent_matter"
                  multiline
                  rows={4}
                  onChange={handleClick}
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>Shooting concept</InputTitle>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.photogrf_concept}
                  name="photogrf_concept"
                  placeholder="Shooting"
                  onChange={handleClick}
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>
                  Model
                  <Required src={StarIcon} alt="require" />
                </InputTitle>
                <ModelWrap>
                  <CheckBoxWrap onClick={() => setCelebCheck(!celebCheck)}>
                    <CheckBoxWrapDetail>
                      <CheckBoxImg
                        src={celebCheck ? CheckBoxOn : CheckBoxOff}
                        alt=""
                      />
                      Celeb
                    </CheckBoxWrapDetail>
                  </CheckBoxWrap>
                  <ModelInput>
                    {[...Array(celebCnt)].map((d, i) => (
                      <ModelInputBox key={`${d}_${i}`}>
                        <ModelTextInput
                          checked={celebCheck}
                          placeHolder="Celeb"
                          idx={i}
                          data={celebList}
                          setData={setCelebList}
                        />
                        <img
                          src={i === 0 ? ModelAddBtn : ModelDelBtn}
                          onClick={
                            i === 0 ? handleCelebAdd : () => handleCelebDel(i)
                          }
                        />
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
                      Fashion Model
                    </CheckBoxWrapDetail>
                  </CheckBoxWrap>
                  <ModelInput>
                    {[...Array(modelCnt)].map((d, i) => (
                      <ModelInputBox key={`${d}_${i}`}>
                        <ModelTextInput
                          checked={modelCheck}
                          placeHolder="Model"
                          idx={i}
                          data={modelList}
                          setData={setModelList}
                        />
                        <img
                          src={i === 0 ? ModelAddBtn : ModelDelBtn}
                          onClick={
                            i === 0 ? handleModelAdd : () => handleModelDel(i)
                          }
                        />
                      </ModelInputBox>
                    ))}
                  </ModelInput>
                </ModelWrap>
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>
                  Paid editorial
                  <Required src={StarIcon} alt="require" />
                </InputTitle>
                <ModelWrap>
                  <CheckBoxWrap2
                    onClick={() => setInputs({ ...inputs, picalbm_chk: "own" })}
                  >
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
                      name="picalbm_cntent"
                      placeholder="Brand"
                      onChange={handleClick}
                      readOnly={inputs.picalbm_chk !== "own" ? true : false}
                      disabled={inputs.picalbm_chk !== "own" ? true : false}
                    />
                  </div>
                </ModelWrap>
                <ModelWrap>
                  <CheckBoxWrap2
                    onClick={() =>
                      setInputs({ ...inputs, picalbm_chk: "other" })
                    }
                  >
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
                      placeholder="Brand"
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
                <InputTitle>Location shooting</InputTitle>
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
                      placeholder="촬영지 입력"
                      onChange={handleClick}
                      readOnly={!inputs.loc_yn}
                      disabled={!inputs.loc_yn}
                    />
                  </div>
                </ModelWrap>
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px" width="100%">
                <InputTitle>Hope to connect</InputTitle>
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
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>Number of pages</InputTitle>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.page_cnt}
                  name="page_cnt"
                  placeholder="Number of pages"
                  onChange={handleClick}
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>Other brands</InputTitle>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.etc_brand}
                  name="etc_brand"
                  placeholder="Different brand"
                  onChange={handleClick}
                />
              </InputWrap>
            </Rows>
            <Rows>
              <InputWrap margin="20px">
                <InputTitle>Message</InputTitle>
                <StyleTextField3
                  variant="outlined"
                  value={inputs.add_req_cntent}
                  name="add_req_cntent"
                  placeholder="Message"
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
                  <CancelTxt>Cancel</CancelTxt>
                </BtnWrap>
                <BtnWrap type="confirm" onClick={handleSampleRequest}>
                  <BtnImgWrap>
                    <img src={ReviseIcon} alt="close"></img>
                  </BtnImgWrap>
                  <ConfirtTxt>Revise</ConfirtTxt>
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


const InputContainer = styled.div``;

const BottomWrap = styled.div`
  display: flex;
  min-width: 740px;
  justify-content: flex-end;
  margin: 40px 0 60px 0;
`;

const BtnImgWrap = styled.div`
  margin-right: 10px;
  display: flex;
`;

const BtnIcon = styled.img`
  margin-right: 10px;
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
`;

const DataWrap = styled.div`
  display: flex;
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${(props) => props.margin || "0"};
  width: ${(props) => props.width || "auto"};
`;

const ImgWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 660px;
  min-width: 660px;
  max-height: 458px;
`;

const DetailWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  width: 710px;
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
    width: 740px;
    height: 42px;
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
  width: 740px;
`;

const StyleTextField4 = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 13px 14px;
  }
  .MuiInputBase-root {
    width: 620px;
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
  min-width: 740px;
  max-width: 740px;
  justify-content: space-between;
`;

const InputRead = styled.div`
  min-width: 140px;
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
  min-width: 620px;
  max-width: 620px;
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
