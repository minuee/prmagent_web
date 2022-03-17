import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import { TextField, Divider,makeStyles } from "@material-ui/core";
import { darken } from "polished";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import dayjs from "dayjs";
import _ from "lodash";
import useOutsideClick from "components/UseOutsideClick";
import SampleAddIcon from "assets/sample_add_icon.png";
//import EditSample from "components/brand/digital_showroom/EditSample";
import AddSample from "components/brand/digital_showroom/AddSample";
import CancelIcon from "assets/close_icon.png";
import CheckIcon from "assets/check_icon.png";
import { apiObject } from "api/api_brand";
import SelectFeaturedImageDialog from "components/brand/digital_showroom/SelectFeatuerdImageDialog";
import Progress from "components/common/progress";
import utils from 'utils';
import Constants from 'utils/constants'

import 'react-alert-confirm/dist/index.css';
import alertConfirm from 'react-alert-confirm';

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";


const useStyles = makeStyles(() => ({
  textField: {
    width: "100%",
  },
  textField2: {
    width: "250px",
    marginRight: "0px",
  },  
  inputText: {
    height: 0,
    fontSize: "14px",
  },
  root: {
    borderRadius: "inherit",
  },
  root2: {
    borderRadius: "inherit",
    backgroundColor: "#f3f3f3",
  },
}));

export default function EditComponent({ data, size, sampleOptions, sampleNo }) {
  const START_YEAR = 2017;
  const END_YEAR = dayjs().year() + 1;
  const history = useHistory();
  const classes = useStyles();
  const ref = useRef();
  const [open, setOpen] = useState(false);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);  
  const [commonData, setCommonData] = useState({
    showroom_no: sampleNo,
    showroom_nm : data.showroom_nm,
    show_yn : data.show_yn,    
    replacement_showroom: data.replacement_showroom_no,
    season_year:
      data.season_year >= START_YEAR && data.season_year <= END_YEAR
        ? data.season_year
        : "None",
    season_year_direct:
      data.season_year < START_YEAR || data.season_year > END_YEAR
        ? data.season_year
        : "",
    season_cd_id: data.season_cd_id,
    season_direct_input: data.season_direct_input || "",
    mfrc_sample_yn: data.mfrc_sample_yn,
  });

  const [parentinputs, setParentInputs] = useState({
    search_showroom: data.replacement_showroom_nm,    
  });
  const [sampleCnt, setSampleCnt] = useState(size);
  const [brandShowroomList, setBrandShowroomList] = useState([]);
  const dupChk = data.sample_list.map((d) => ({
    sample_no: d.sample_no,
    still_life_img_yn: d.still_life_img_yn,
    sample_img_yn: d.sample_img_yn,
    sample_nm: d.sample_nm,
    sample_catgry_lrge_cl_cd: d.sample_catgry_lrge_cl_cd,
    sample_catgry_middle_cl_cd: d.sample_catgry_middle_cl_cd.trim(),
    sample_catgry_direct_input: d.sample_catgry_direct_input || "",
    material_cd_id: d.material_cd_id,
    price: d.price || "",
    none_price: d.price === null ? true : false,
    sku: d.sku || "",
    caption_korean: d.caption_korean || "",
    gender_cd_id: d.gender_cd_id,
    buying_cd_id: d.buying_cd_id,
    color_cd_id: d.color_cd_id,
    size_cd_id: d.size_cd_id.trim() || "",
    size_direct_input: d.size_direct_input || "",
    in_yn: d.in_yn,
    etc: d.etc || "",
    caption_english: d.caption_english || "",
    del_yn: false,
    sample_image_list: d.sample_image_list.map((v) => ({
      url: v.url,
      uploadYn: false,
      preview: v.full_url,
      img_type: v.img_type,
      file: null,
      main_yn: v.main_yn,
      showroom_main_yn: v.showroom_main_yn,
    })),
  }));

  const [duplicateChk, setDuplicateChk] = useState(dupChk);
  const [sampleList, setSampleList] = useState([]);
  const [sampleDelList, setSampleDelList] = useState([]);
  const [companySearch, setCompanySearch] = useState(false);
  const handleShowroomMainImg = (url) => {
    sampleList.map((d, i) =>
      d.sample_image_list.find((v, j) => {
        if (v.url === url) {
          sampleList[i].sample_image_list[j].showroom_main_yn = true;
          setSampleList([...sampleList]);
        } else {
          sampleList[i].sample_image_list[j].showroom_main_yn = false;
          setSampleList([...sampleList]);
        }
      })
    );
  };

  const handleConfirm = () => {
    
    if ( commonData.season_year === "" && commonData.season_year_direct === "") {
      utils.customAlert("시즌연도를 입력해주세요.");
      return;
    } else if (commonData.season_cd_id === "") {
      utils.customAlert("컬렉션을 선택해주세요.");
      return;
    } else if ( commonData.season_cd_id === "none" && commonData.season_direct_input === "" ) {
      utils.customAlert("컬렉션을 입력해주세요.");
      return;
    }
    let isOk = 0;
    for ( let num = 0; num < sampleList.length ; num++) {
      let d = sampleList[num];
      if (d.sample_image_list.length === 0) {
        utils.customAlert("이미지를 등록해주세요.");
        break;
      } else if (d.sample_nm === "") {
        utils.customAlert("샘플명을 입력해주세요.");
        break;
      } else if ( d.sample_catgry_middle_cl_cd === "" && d.sample_catgry_direct_input === "" ) {
        utils.customAlert("카테고리를 선택해주세요.");
        break;
      } else if (d.gender_cd_id.trim() === "") {
        utils.customAlert("성별을 선택해주세요.");
        break;
      } else if (d.buying_cd_id.length === 0) {
        utils.customAlert("구매정보를 선택해주세요.");
        break;
      /* } else if (d.color_cd_id.length === 0) {
        utils.customAlert("색상을 선택해주세요.");
        break; */
      }else{ 
        if ( d.price === "") d.price = null;
        isOk++;
      }
    }
    
    if ( isOk == sampleList.length ) {
      alertConfirm({
        title: Constants.appName,
        content: '수정하시겠습니까?',
        onOk: () => {
          updateShowroom.mutate();

            /* sampleList.forEach((d) => {
              if (d.sample_image_list.length === 0) {
                utils.customAlert("이미지를 등록해주세요.");
                return;
              } else if (d.sample_nm === "") {
                utils.customAlert("샘플명을 입력해주세요.");
                return;
              } else if ( d.sample_catgry_middle_cl_cd === "" && d.sample_catgry_direct_input === "" ) {
                utils.customAlert("카테고리를 선택해주세요.");
                return;
              } else if (d.gender_cd_id === "") {
                utils.customAlert("성별을 선택해주세요.");
                return;
              } else if (d.buying_cd_id.length === 0) {
                utils.customAlert("구매정보를 선택해주세요.");
                break;
                return ;
              } else if (d.color_cd_id.length === 0) {
                utils.customAlert("색상을 선택해주세요.");
                return;
              } else {
                if ( d.price === "") d.price = null;
                isCanUpdate = true
                if ( isCanUpdate)  updateShowroom.mutate(); 
              } 
            });    */
            
        },
        onCancel: () => {console.log('cancel')}
      });
    }

    /* if (confirm("수정하시겠습니까?")) {
      /* if (commonData.showroom_nm === "") {
        utils.customAlert("룩 타이틀을 입력해주세요.");
        return; 
      if (
        commonData.season_year === "" &&
        commonData.season_year_direct === ""
      ) {
        utils.customAlert("시즌연도를 입력해주세요.");
        return;
      } else if (commonData.season_cd_id === "") {
        utils.customAlert("컬렉션을 선택해주세요.");
        return;
      } else if (
        commonData.season_cd_id === "none" &&
        commonData.season_direct_input === ""
      ) {
        utils.customAlert("컬렉션을 입력해주세요.");
        return;
      }
      sampleList.forEach((d) => {
        if (d.sample_image_list.length === 0) {
          utils.customAlert("이미지를 등록해주세요.");
          return;
        } else if (d.sample_nm === "") {
          utils.customAlert("샘플명을 입력해주세요.");
          return;
        } else if ( d.sample_catgry_middle_cl_cd === "" && d.sample_catgry_direct_input === "" ) {
          utils.customAlert("카테고리를 선택해주세요.");
          return;
        } else if (d.gender_cd_id === "") {
          utils.customAlert("성별을 선택해주세요.");
          return;
        } else if (d.buying_cd_id.length === 0) {
          utils.customAlert("구매정보를 선택해주세요.");
          return;
        /* } else if (d.color_cd_id.length === 0) {
          utils.customAlert("색상을 선택해주세요.");
          return; 
        } else if (d.price === "") {
          d.price = null;
        }
        updateShowroom.mutate();
      }); */

    //}
  };

  const handleCancel = () => {
    history.push("/brand/digital_showroom");
  };

  const handleDelete = () => {
    alertConfirm({
      title: Constants.appName,
      content: '등록 정보를 삭제하시겠습니까?',
      onOk: () => {deleteShowroom.mutate()},
      onCancel: () => {console.log('cancel')}
    });    
  };

  const handleChange = (n, d) => {
    setCommonData({
      ...commonData,
      [n]: d,
    });
  };

  const handleChangeTextField = (e) => {
    setCommonData({
      ...commonData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSample = () => {
    setSampleCnt(sampleCnt + 1);
    setDuplicateChk([...duplicateChk, null]);
  };

  const handleDelSample = (idx) => {
    if (_.has(duplicateChk[idx], "sample_no")) {
      let delNo = duplicateChk[idx].sample_no;
      setSampleDelList([...sampleDelList, delNo]);
    }
    let newArr = [];
    duplicateChk.map((d, i) => i !== idx && newArr.push(d));
    setDuplicateChk(newArr);
    setSampleList(sampleList.filter((v, i) => i !== idx));
    setSampleCnt(sampleCnt - 1);
  };

  const handleDuplicate = (idx) => {
    let newArr = {
      still_life_img_yn : sampleList[idx].still_life_img_yn,      
      sample_img_yn: sampleList[idx].sample_img_yn,
      sample_nm: sampleList[idx].sample_nm,
      sample_catgry_lrge_cl_cd: sampleList[idx].sample_catgry_lrge_cl_cd,
      sample_catgry_middle_cl_cd: sampleList[idx].sample_catgry_middle_cl_cd,
      sample_catgry_direct_input: sampleList[idx].sample_catgry_direct_input,
      material_cd_id: sampleList[idx].material_cd_id,
      price: sampleList[idx].price,
      sku: sampleList[idx].sku,
      caption_korean: sampleList[idx].caption_korean,
      gender_cd_id: sampleList[idx].gender_cd_id,
      buying_cd_id: sampleList[idx].buying_cd_id,
      color_cd_id: sampleList[idx].color_cd_id,
      size_cd_id: sampleList[idx].size_cd_id,
      size_direct_input: sampleList[idx].size_direct_input,
      in_yn: sampleList[idx].in_yn,
      etc: sampleList[idx].etc,
      captoin_english: sampleList[idx].captoin_english,
      del_yn: false,
      sample_image_list: sampleList[idx].sample_image_list.map((v) => ({
        url: v.url,
        uploadYn: v.uploadYn,
        preview: v.preview,
        img_type: v.img_type,
        file: v.file,
        main_yn: v.main_yn,
      })),
    };

    setDuplicateChk([...duplicateChk, _.cloneDeep(newArr)]);
    setSampleCnt(sampleCnt + 1);
  };

  const updateShowroom = useMutation(
    () =>
      apiObject.updateShowroom(
        {
          showroom_no: sampleNo,
          showroom_nm: commonData.showroom_nm,
          season_year: commonData.season_year_direct === "" ? commonData.season_year : commonData.season_year_direct,
          season_cd_id: commonData.season_cd_id,
          mfrc_sample_yn: commonData.mfrc_sample_yn,
          show_yn: commonData.show_yn,
          replacement_showroom : commonData.replacement_showroom,
          sample_list: duplicateChk,
          delete_sample_no_list: sampleDelList,
        },
        () => {}
      ),
    {
      onSuccess: () => {
        utils.customAlert("정상적으로 수정되었습니다.");
        //history.replace("/brand/digital_showroom");
      },
      onError: () => {
        utils.customAlert("수정 중 오류가 발생했습니다.");
        return;
      },
    }
  );

  const deleteShowroom = useMutation(
    () =>
      apiObject.deleteShowroom({
        showroom_no: sampleNo,
      }),
    {
      onSuccess: () => {
        utils.customAlert("삭제 되었습니다.");
        history.replace("/brand/digital_showroom");
      },
      onError: () => {
        utils.customAlert("삭제 중 오류가 발생했습니다.");
        return;
      },
    }
  );


  const handleCompanyChange = (e) => {    
    setCompanySearch(true);    
    setParentInputs({
      ...parentinputs,      
      [e.target.name]: e.target.value,
    });
    brand_showroom_search.mutate({ search_text: e.target.value, showroom_no : sampleNo});
  };

  const handleCompanyClick = (d) => {
    setCompanySearch(false);
    setParentInputs({
      ...parentinputs,
      search_showroom : d.showroom_nm
    });  
    setCommonData({
      ...commonData,
      replacement_showroom: d.showroom_no
    });  
  };
  useOutsideClick(ref, () => {
    setCompanySearch(false);
  });

  const brand_showroom_search = useMutation(
    ["brand-showroom-search"],
    (value) =>
      apiObject.getBrandSearch({ search_text: value.search_text, showroom_no :  value.showroom_no }),
    {
      onSuccess: (data) => {
        setBrandShowroomList(data.list);
      },
    }
  );

  if (updateShowroom.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      <Container>
        <TitleWrap active={isdrawer}>
          <TitleTxt>
            <StyleTextField
              variant="outlined"
              value={commonData.showroom_nm}
              placeholder="Look Title"
              name="showroom_nm"
              onChange={handleChangeTextField}
            />
          </TitleTxt>          
          <StyledDivider />
        </TitleWrap>
        <CommonDataWrap>
          <ReplaceOuterWrap>
          { !utils.isEmpty(sampleNo) &&
              <InputWrap>
                <InputTitle>대체제안</InputTitle>     
                <div>
                  <CompanyWrap ref={ref} onFocus={() => setCompanySearch(true)}>
                    <TextField
                      variant="outlined"
                      placeholder="대체제안_쇼룸명"
                      value={parentinputs.search_showroom}
                      name="search_showroom"
                      onChange={handleCompanyChange}
                      autoComplete="off"
                      className={classes.textField2}
                      InputProps={{
                        classes: { input: classes.inputText, root: classes.root },
                      }}
                    />
                    <CompanySearch active={companySearch}>
                      {brandShowroomList.length > 0 ? (
                        brandShowroomList.map((d,idx) => (
                          <CompanySearchResult
                            key={idx}
                            onClick={() => handleCompanyClick(d)}
                          >
                            [{d.season_year} {d.season_se_id}]{d.showroom_nm}
                          </CompanySearchResult>
                        ))
                      ) : (
                        <CompanySearchNoResult>
                          검색결과가 없습니다.
                        </CompanySearchNoResult>
                      )}
                    </CompanySearch>
                  </CompanyWrap>                  
                </div>
              </InputWrap>
            }
          </ReplaceOuterWrap>
          <SwitchOuterWrap>
            <SwitchWrap>
              <SwitchTxt>공개여부</SwitchTxt>
              <SwitchDiv onClick={() => handleChange("show_yn", commonData.show_yn === 'Y' ? 'N' : 'Y')}>
                <input type="checkbox" style={{ display:"none"}} checked={commonData.show_yn === 'Y' ? true : false} readOnly/>
                <Marble active={commonData.show_yn === 'Y' ? "on" : "off"} />
                <SwitchBtn active={commonData.show_yn === 'Y' ? "on" : "off"}>On</SwitchBtn>
                <SwitchBtn active={!commonData.show_yn === 'Y' ? "on" : "off"}>Off</SwitchBtn>
              </SwitchDiv>
            </SwitchWrap>
            <SwitchWrap>
              <SwitchTxt>주력상품</SwitchTxt>
              <SwitchDiv onClick={() => handleChange("mfrc_sample_yn", !commonData.mfrc_sample_yn)}>
                <input type="checkbox" style={{ display:"none"}} checked={commonData.mfrc_sample_yn} readOnly/>
                <Marble active={commonData.mfrc_sample_yn ? "on" : "off"} />
                <SwitchBtn active={commonData.mfrc_sample_yn ? "on" : "off"}>On</SwitchBtn>
                <SwitchBtn active={!commonData.mfrc_sample_yn ? "on" : "off"}>Off</SwitchBtn>
              </SwitchDiv>
            </SwitchWrap>
          </SwitchOuterWrap>
        </CommonDataWrap>

        {[...Array(sampleCnt)].map((n, index) => (
          <ContentsWrap key={index} active={isdrawer}>
            <AddSample
              idx={index}
              commonData={commonData}
              setCommonData={setCommonData}
              sample={sampleList}
              setSample={setSampleList}
              duplicateChk={duplicateChk[index]}
              handleDelSample={handleDelSample}
              handleDuplicate={handleDuplicate}
              season_data={sampleOptions.season}
              color_data={sampleOptions.color}
              buying_data={sampleOptions.buying}
              gender_data={sampleOptions.gender}
              material_data={sampleOptions.material}
              category_data={sampleOptions.category}
            />
          </ContentsWrap>
        ))}

        <AddSampleBtn onClick={handleAddSample} active={isdrawer}>
          <AddIcon src={SampleAddIcon} alt="add" />
          Add Sample
        </AddSampleBtn>

        <BottomWrap active={isdrawer}>
          <BottomBtnGroup active={isdrawer}>
            <SelectFeaturedBtn onClick={() => setOpen(!open)} active={isdrawer}>
            대표 이미지 선택
            </SelectFeaturedBtn>
          </BottomBtnGroup>
          <BottomBtnGroup2 active={isdrawer}>
            <BtnWrap type="cancel" onClick={handleDelete} active={isdrawer}>
              <CancelTxt>Delete</CancelTxt>
            </BtnWrap>
            <BtnWrap type="cancel" onClick={handleCancel} active={isdrawer}>
              <BtnImgWrap>
                <img src={CancelIcon} alt="close"></img>
              </BtnImgWrap>
              <CancelTxt>Cancel</CancelTxt>
            </BtnWrap>
            <BtnWrap type="confirm" onClick={handleConfirm} active={isdrawer}>
              <BtnImgWrap>
                <img src={CheckIcon} alt="check"></img>
              </BtnImgWrap>
              <ConfirtTxt>Confirm</ConfirtTxt>
            </BtnWrap>
          </BottomBtnGroup2>
        </BottomWrap>
      </Container>

      <SelectFeaturedImageDialog
        open={open}
        setOpen={setOpen}
        data={sampleList}
        editYn={true}
        handleConfirm={handleShowroomMainImg}
      />
    </>
  );
}

const Container = styled.div`  
  width:100%;  
`;

const TitleWrap = styled.div`  
  margin-bottom: 16px;
  justify-content: space-between;
  align-items: center;
  width:96%;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1920px" : "1560px")};     
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "960px")};
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "920px" : "600px")};
  } 
`;


const TitleTxt = styled.div``;

const CommonDataWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;  
  width:96%;
  margin-top:20px;
`;

const ReplaceOuterWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;  
  width:48%;
`;

const SwitchOuterWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;  
  width:48%;
`;
const SwitchWrap = styled.div`
  display: flex;
  align-items: center;

  & {
    margin-left:10px;
  }
`;

const SwitchTxt = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
`;

const SwitchDiv = styled.div`
  width: 104px;
  height: 32px;
  border: 1px solid #e9e9e9;
  background-color: #f1f2ea;
  border-radius: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  color: #bababa;
  position: relative;
  cursor: pointer;
`;

const SwitchBtn = styled.div`
  width: 52px;
  text-align: center;
  transition: all 0.3s;
  padding-top: 2px;
  z-index: 2;

  ${(props) =>
    props.active === "on" &&
    css`
      color: #ffffff;
    `}
`;

const Marble = styled.div`
  width: 52px;
  height: 28px;
  border-radius: 500px;
  background-color: #000000;
  position: absolute;
  transition: all 0.3s;

  ${(props) =>
    props.active === "on"
      ? css`
          left: 1px;
        `
      : css`
          left: 49px;
        `}
`;

const StyledDivider = styled(Divider)`
  height: 2px;
  background-color: #dddddd;
  width:100%;
`;

const StyleTextField = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 0;
    font-size: 28px;
    font-weight: 900;
    color: #cccccc;
  }
  fieldSet {
    border: none;
  }
`;

const ContentsWrap = styled.div`
display: flex;
padding: 40px 0;
border-bottom: 2px solid #dddddd;
position: relative;
width: 96%;
`;

const AddSampleBtn = styled.div`
width: 96%;
height: 60px;
background-color: #f1f2ea;
font-size: 20px;
color: #999999;
margin-bottom: 60px;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
`;

const AddIcon = styled.img`
  margin-right: 5.5px;
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
  width:96%;
`;

const BtnWrap = styled.div`
  @media (min-width: 1920px) {
    width: 150px;height: 60px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: 150px;height: 60px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {    
    width: ${(props) => (props.active ? "150px" : "120px")};
    height: ${(props) => (props.active ? "60px" : "50px")};    
  } 
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.type === "cancel" ? "#ffffff" : "#7ea1b2"};
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
        background-color: ${darken(0.1, "#7ea1b2")};
      }
      &:active {
        background-color: ${darken(0.2, "#7ea1b2")};
      }
    `} 

  & + & {
    margin-left: 20px;
  }
`;

const BtnImgWrap = styled.div`
  margin-right: 10px;
  display: flex;
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

const BottomBtnGroup = styled.div`
  display: flex;
`;
const BottomBtnGroup2 = styled.div`
  display: flex;
`;

const SelectFeaturedBtn = styled.div`
  @media (min-width: 1920px) {
    width: 200px;height: 60px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: 200px;height: 60px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {    
    width: ${(props) => (props.active ? "200px" : "180px")};
    height: ${(props) => (props.active ? "60px" : "50px")};    
  } 
  border-radius: 5px;
  border: solid 1px #dddddd;
  background-color: #f3f3f3;
  font-size: 15px;
  font-weight: bold;
  color: #999999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background-color: ${darken(0.05, "#f3f3f3")};
  }
  &:active {
    background-color: ${darken(0.1, "#f3f3f3")};
  }
`;


const CompanyWrap = styled.div`
  position: relative;
`;

const CompanySearch = styled.div`
  border: 1px solid #b7b7b7;
  border-top: none;
  position: absolute;
  width: 250px;
  max-height: 401px;
  overflow: auto;
  z-index: 1;
  background-color: #fafafa;
  visibility: ${(props) => (props.active ? "visible" : "hidden")};
`;

const CompanySearchResult = styled.div`
  cursor: pointer;
  height: 40px;
  width: 250px;
  font-size: 14px;
  padding-left: 13px;
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.4);

  &:hover {
    color: #000000;
    background-color: ${darken(0.1, "#ffffff")};
  }
`;

const CompanySearchNoResult = styled.div`
  cursor: pointer;
  height: 40px;
  font-size: 14px;
  padding-left: 13px;
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.4);
`;

const InputWrap = styled.div`
  display: flex;
`;
const InputTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-right: 12px;
  display: flex;
  align-items: center;
`;