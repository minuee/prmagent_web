import React, { useState, useEffect,useRef } from "react";
import styled, { css } from "styled-components";
import { TextField,makeStyles } from "@material-ui/core";
import { darken } from "polished";
import { useHistory } from "react-router-dom";
import { useQueryClient,useMutation } from "react-query";

import SelectBox from "components/LookAddSelectBox";
import YearSelectBox from "components/brand/digital_showroom/YearSelectBox";
import CategorySelectBox from "components/CategorySelectBox";
import ShoesSelectBox from "components/brand/digital_showroom/ShoesSelectBox";
import UploadDialog from "components/UploadDialog_v2";
import CheckBoxOn from "assets/checkbox_on.png";
import CheckBoxOff from "assets/checkbox_off.png";
import UploadIcon from "assets/upload_icon.png";
import SampleDelete from "assets/sample_del_button.svg";
import AddIconOff from "assets/add_icon_off.svg";
import AddIconOn from "assets/add_icon_on.svg";
import utils from "utils";
import { apiObject } from "api/api_brand";
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";



export default function AddSample({
  idx,
  commonData,
  setCommonData,
  handleDelSample,
  handleDuplicate,
  sample,
  setSample,
  duplicateChk,
  // inputs,
  // setInputs,
  season_data,
  color_data,
  buying_data,
  gender_data,
  material_data = null,
  category_data,
}) {

  const history = useHistory();
  
  const queryClient = useQueryClient();
  
  
  const [inputs, setInputs] = useState({
    still_life_img_yn: false,
    sample_img_yn: false,
    sample_image_list: [],
    sample_nm: "",
    gender_cd_id: "",
    buying_cd_id: [],
    color_cd_id: [],
    material_cd_id: "",
    size_cd_id: "",
    size_direct_input: "",
    sample_catgry_lrge_cl_cd: "",
    sample_catgry_middle_cl_cd: "",
    sample_catgry_direct_input: "",
    sku: "",
    etc: "",
    in_yn: false,
    caption_korean: "",
    caption_english: "",
    price: "",
    none_price: false
  });
  const [genderOptions, setGenderOptions] = useState(null);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  useEffect(() => {
    // setCommonData({
    //   ...commonData,
    //   sample_list: [...commonData.sample_list, inputs],
    // });
    sample[idx] = duplicateChk || inputs;
    setSample([...sample]);
  }, []);

  const [uploadDialog, setUploadDialog] = useState(false);

  const handleCommonChange = (n, d) => {
    setCommonData({
      ...commonData,
      [n]: d,
    });
    // setSample({
    //   ...sample,
    //   [n]: d,
    // });
  };

  const handleChange = (n, d) => {
    sample[idx][n] = d;
    setSample([...sample]);
  };



  const handleColorChange = async(d) => {    
    let newArr = sample[idx].color_cd_id;
    if ( newArr.includes(d) ) {
      await (newArr = newArr.filter((c) => c !== d))
    }else {
      await newArr.push(d);
    }    
    sample[idx].color_cd_id = newArr;
    setSample([...sample]);
  };

  const handleInputChange = (e) => {
    if (e.target.name === "price") {
      sample[idx][e.target.name] = utils.removeCommas(e.target.value);
      setSample([...sample]);
    } else if (e.target.name === "sample_catgry_direct_input") {
      sample[idx][e.target.name] = e.target.value;
      sample[idx]["sample_catgry_middle_cl_cd"] = "";
      setSample([...sample]);
    } else {
      sample[idx][e.target.name] = e.target.value;
      setSample([...sample]);
    }
  };

  const handleInputInit = (name) => {
    sample[idx][name] = "";
    setSample([...sample]);
  };

  const handleCategoryChange = (type, data) => {
    if (type === "large") {
      sample[idx].sample_catgry_lrge_cl_cd = data;
      setSample([...sample]);
    } else if (type === "middle") {
      sample[idx].sample_catgry_middle_cl_cd = data;
      setSample([...sample]);
    }
  };

  const handleImgCategory = (act) => {
    // commonData.sample_list[`${idx}`].img_category = c;
    // setCommonData({ ...commonData });
    if (act === "still") {
      if ( sample[idx].still_life_img_yn  ) {
        sample[idx].still_life_img_yn = !sample[idx].still_life_img_yn;
      }else{
        //if ( sample[idx].in_yn ) {
          sample[idx].still_life_img_yn = !sample[idx].still_life_img_yn;
        //}else{
          //utils.customAlert("누끼컷은 샘플입고시에만 가능합니다.");
          //return;
        //}
      }
      setSample([...sample]);
    }
    if (act === "look") {
      sample[idx].sample_img_yn = !sample[idx].sample_img_yn;
      setSample([...sample]);
    }
  };

  const handleUpload = (runway, hr, lr) => {
    if (runway.preview !== "") {
      // commonData.sample_list[`${idx}`].sample_image_list[0] = runway;
      // sample[idx].sample_image_list[0] = runway;
    }
    if (hr.preview !== "") {
      // commonData.sample_list[`${idx}`].sample_image_list[1] = hr;
      // sample[idx].sample_image_list[1] = hr;
    }
    if (lr.preview !== "") {
      // commonData.sample_list[`${idx}`].sample_image_list[2] = lr;
      // sample[idx].sample_image_list[2] = lr;
    }
    // setCommonData({ ...commonData });

    sample[idx].sample_image_list[0] = runway;
    sample[idx].sample_image_list[1] = hr;
    sample[idx].sample_image_list[2] = lr;
    setSample([...sample]);

    // setInputs({
    //   ...inputs,
    //   sample_list: {
    //     ...inputs,
    //     img_category: img_category,
    //     sample_image_list: [runway, hr, lr],
    //   },
    // });
  };

  const handleSeasonDirect = (e) => {
    setCommonData({ ...commonData, season_year_direct: e.target.value });
  };

  const handleCollectionDirect = (e) => {
    setCommonData({ ...commonData, season_direct_input: e.target.value });
  };

  const handleBuyingList = (d) => {
    let newArr = sample[idx].buying_cd_id;
    newArr.includes(d)
      ? (newArr = newArr.filter((c) => c !== d))
      : newArr.push(d);
    sample[idx].buying_cd_id = newArr;
    setSample([...sample]);
  };


  const sampleCdQuery = queryClient.getQueryData(["sample-cd-info"]);

  const SHOWE_SIZE_OPTION = sampleCdQuery.category.find(
    (v) => v.sample_catgry_lrge_cl_cd === "SCLC05"
  ).gender_size_list;

  const RTW_SIZE_OPTION = [
    {
      cd_id: "XS",
      cd_nm: "XS",
    },
    {
      cd_id: "S",
      cd_nm: "S",
    },
    {
      cd_id: "M",
      cd_nm: "M",
    },
    {
      cd_id: "L",
      cd_nm: "L",
    },
    {
      cd_id: "XL",
      cd_nm: "XL",
    },
  ];

  return (
    <>
      {sample[idx] !== undefined && sampleCdQuery !== undefined && (
        <Container>
          <SampleDelBtn>
            <DupBtn onClick={() => handleDuplicate(idx)}>사본 만들기</DupBtn>
            {sample.length > 1 && (
              <img
                src={SampleDelete}
                alt="delete"
                onClick={() => handleDelSample(idx)}
              />
            )}
          </SampleDelBtn>
          <ImgWrap
            imgYn={
              sample[idx].sample_image_list.find((v) => v.main_yn) === undefined
                ? false
                : true
            }
          >
            {sample[idx].sample_image_list.find((v) => v.main_yn) !==
              undefined &&
              sample[idx].sample_image_list.map(
                (h,idx2) =>
                  h.main_yn && (
                    <Img
                      key={idx2}
                      imgUrl={h.preview}
                      onClick={() => setUploadDialog(!uploadDialog)}
                    />
                  )
              )}
            {sample[idx].sample_image_list.find((v) => v.main_yn) ===
              undefined && (
              <>
                <UploadImg onClick={() => setUploadDialog(true)}>
                  <UploadIconWrap>
                    <img src={UploadIcon} alt="upload" />
                  </UploadIconWrap>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    Upload
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    Images
                  </div>
                </UploadImg>
              </>
            )}
            <UploadDialog
              open={uploadDialog}
              setOpen={setUploadDialog}
              inputs={sample[idx].sample_image_list}
              duplicateChk={duplicateChk}
              stillImgYn={sample[idx].still_life_img_yn}
              sampleImgYn={sample[idx].sample_img_yn}
              handleImgCategory={handleImgCategory}
              handleUpload={handleUpload}
            />
          </ImgWrap>
          <FormWrap active={isdrawer}>
            <LeftWrap active={isdrawer}>
              <InputWrap>
                <InputTitle>
                  Season
                  <span style={{ color: "red" }}>*</span>
                </InputTitle>
                <SeasonInput>
                  <SelectBoxDiv>
                    <YearSelectBox
                      width="150px"
                      height="40px"
                      name="season_year"
                      value={commonData.season_year}
                      handleChange={handleCommonChange}
                    />
                  </SelectBoxDiv>
                  {commonData.season_year === "None" && (
                    <InputTextField2
                      variant="outlined"
                      placeholder="직접입력"
                      value={commonData.season_year_direct}
                      name="직접입력"
                      type="number"
                      onChange={handleSeasonDirect}
                      inputProps={{
                        maxLength: 4,
                      }}
                    />
                  )}
                </SeasonInput>
                <SeasonNmWrap active={isdrawer}>
                  {season_data !== undefined &&
                    season_data.map((d,idx3) => (
                      <SeasonNm
                        key={idx3}
                        active={
                          commonData.season_cd_id === d.cd_id ? true : false
                        }
                        onClick={() =>
                          handleCommonChange("season_cd_id", d.cd_id)
                        }
                      >
                        {d.cd_nm}
                      </SeasonNm>
                    ))}
                  <SeasonNm
                    active={commonData.season_cd_id === "none" ? true : false}
                    onClick={() => handleCommonChange("season_cd_id", "none")}
                  >
                    <img
                      src={
                        commonData.season_cd_id === "none"
                          ? AddIconOn
                          : AddIconOff
                      }
                      style={{ width: "12px" }}
                      alt=""
                    />
                  </SeasonNm>
                </SeasonNmWrap>
                {commonData.season_cd_id === "none" && (
                  <InputWrap>
                    <InputTextField
                      variant="outlined"
                      placeholder="컬렉션 직접입력(20자이내)"
                      value={sample[idx].season_direct_input}
                      name="season_direct_input"
                      onChange={handleCollectionDirect}
                      inputProps={{maxLength: 20}}
                      style={{width:'300px'}}
                    />
                  </InputWrap>
                )}
              </InputWrap>
              <InputWrap>
                <InputTitle>
                  Sample name
                  <span style={{ color: "red" }}>*</span>
                </InputTitle>
                <InputTextField
                  variant="outlined"
                  placeholder="Sample Name(50자이내)"
                  value={sample[idx].sample_nm}
                  name="sample_nm"
                  inputProps={{
                    maxLength: 52,
                  }}
                  onChange={handleInputChange}
                />
              </InputWrap>
              <InputWrap>
                <InputTitle>Category<span style={{ color: "red" }}>*</span></InputTitle>
                <SelectBoxWrap>
                  <CategorySelectBox
                    value={sample[idx].sample_catgry_lrge_cl_cd}
                    subValue={sample[idx].sample_catgry_middle_cl_cd}
                    options={category_data}
                    handleChange={handleCategoryChange}
                    inputValue={sample[idx].sample_catgry_direct_input}
                    handleInputChange={handleInputChange}
                    handleInputInit={handleInputInit}
                    setGenderOptions={setGenderOptions}
                  />
                </SelectBoxWrap>
              </InputWrap>
              {sample[idx].sample_catgry_lrge_cl_cd === "SCLC05" && (
                <InputWrap>
                  <InputTitle>Shoes Size</InputTitle>
                  <SelectBoxDiv>
                    <ShoesSelectBox
                      width="140px"
                      height="42px"
                      name="size_cd_id"
                      value={sample[idx].size_cd_id}
                      options={SHOWE_SIZE_OPTION}
                      handleChange={handleChange}
                    />
                  </SelectBoxDiv>
                </InputWrap>
              )}
              {sample[idx].sample_catgry_lrge_cl_cd === "SCLC06" && (
                <InputWrap>
                  <InputTitle>RTW Size</InputTitle>
                  <SelectBox
                    width="140px"
                    height="42px"
                    name="size_direct_input"
                    value={RTW_SIZE_OPTION.find(
                      (v) => v.cd_id === sample[idx].size_direct_input
                    )}
                    options={RTW_SIZE_OPTION}
                    handleChange={handleChange}
                  />
                </InputWrap>
              )}
              <InputWrap>
                <InputTitle>Material</InputTitle>
                <SelectBox
                  width="100%"
                  height="42px"
                  name="material_cd_id"
                  value={sampleCdQuery.material.find(
                    (k) => k.cd_id === sample[idx].material_cd_id
                  )}
                  options={sampleCdQuery.material}
                  handleChange={handleChange}
                />
              </InputWrap>
              <InputWrap style={{ position: "relative" }}>
                <InputTitle>Price</InputTitle>
                <InputTextField3
                  variant="outlined"
                  // placeholder="Price"
                  value={utils.numberWithCommas(sample[idx].price)}
                  name="price"
                  // type="number"
                  onChange={handleInputChange}
                  disabled={sample[idx].none_price}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    fontSize: "16px",
                  }}
                >
                  원
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "-30px",
                    right: "0",
                    fontSize: "16px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleChange("none_price", !sample[idx].none_price)
                  }
                >
                  <img
                    src={sample[idx].none_price ? CheckBoxOn : CheckBoxOff}
                    alt=""
                    style={{
                      width: "20px",
                      marginRight: "8px",
                      marginBottom: "2px",
                    }}
                  />
                  가격미정
                </div>
              </InputWrap>
              <InputWrap>
                <InputTitle>SKU (Style #)</InputTitle>
                <InputTextField
                  variant="outlined"
                  value={sample[idx].sku}
                  name="sku"
                  placeholder="SKU"
                  onChange={handleInputChange}
                />
              </InputWrap>
              
            </LeftWrap>
            <RightWrap>
              <InputWrap margin="94px">
                <InputTitle>
                  Gender
                  <span style={{ color: "red" }}>*</span>
                </InputTitle>
                <SeasonNmWrap>
                  {gender_data !== undefined &&
                    gender_data.map((d,idx4) => (
                      <SeasonNm
                        key={idx4}
                        active={
                          sample[idx].gender_cd_id === d.cd_id ? true : false
                        }
                        onClick={() => handleChange("gender_cd_id", d.cd_id)}
                      >
                        {d.cd_nm}
                      </SeasonNm>
                    ))}
                </SeasonNmWrap>
              </InputWrap>
              <InputWrap margin="60px">
                <InputTitle>
                  Buying
                  <span style={{ color: "red" }}>*</span>
                </InputTitle>
                <SeasonNmWrap>
                  {buying_data !== undefined &&
                    buying_data.map((d,idx5) => (
                      <SeasonNm
                        key={idx5}
                        active={sample[idx].buying_cd_id.includes(d.cd_id)? true: false}
                        onClick={() => handleBuyingList(d.cd_id)}
                      >
                        {d.cd_nm}
                      </SeasonNm>
                    ))}
                </SeasonNmWrap>
              </InputWrap>
              <InputWrap margin="25px">
                <InputTitle>
                  Color
                  {/* <span style={{ color: "red" }}>*</span> */}
                </InputTitle>
                <ColorWrap active={isdrawer}>
                  {color_data !== undefined &&
                    color_data.map((d,idx1) => (
                      <Color
                        key={idx1}
                        active={sample[idx].color_cd_id.includes(d.cd_id)? true: false}
                        //active={sample[idx].color_cd_id === d.cd_id ? true : false}
                        //onClick={() => handleChange("color_cd_id", d.cd_id)}
                        onClick={() => handleColorChange(d.cd_id)}
                      >
                        <Circle
                          circleColor={d.color_value}
                          name={d.cd_nm === "멀티컬러" ? "Multi" : d.cd_nm}
                        />
                        <ColorTxt>{d.cd_nm}</ColorTxt>
                      </Color>
                    ))}
                </ColorWrap>
              </InputWrap>
              {/* <InputWrap>
                <InputTitle>Size</InputTitle>
                <InputTextField
                  variant="outlined"
                  placeholder="size"
                  value={sample[idx].size_direct_input}
                  name="size_direct_input"
                  onChange={handleInputChange}
                />
              </InputWrap> */}
              <InputWrap margin="44px">
                <InputTitle
                  onClick={() => handleChange("in_yn", !sample[idx].in_yn)}
                  style={{ cursor: "pointer" }}
                >
                  샘플 입고{" "}
                  <InImg
                    src={sample[idx].in_yn ? CheckBoxOn : CheckBoxOff}
                    alt="in"
                  />
                </InputTitle>
              </InputWrap>
              <InputWrap>
                <InputTitle>기타사항</InputTitle>
                <InputTextField
                  variant="outlined"
                  multiline
                  rows={5}
                  value={sample[idx].etc}
                  name="etc"
                  placeholder="Comments"
                  onChange={handleInputChange}
                />
              </InputWrap>
              <InputWrap>
                <InputTitle>국문 캡션</InputTitle>
                <InputTextField
                  variant="outlined"
                  multiline
                  rows={5}
                  value={sample[idx].caption_korean}
                  name="caption_korean"
                  placeholder="Korean"
                  onChange={handleInputChange}
                />
              </InputWrap>
              <InputWrap>
                <InputTitle>영문 캡션</InputTitle>
                <InputTextField
                  variant="outlined"
                  multiline
                  rows={5}
                  value={sample[idx].caption_english}
                  name="caption_english"
                  placeholder="English"
                  onChange={handleInputChange}
                />
              </InputWrap>
              
            </RightWrap>
          </FormWrap>
        </Container>
      )}
    </>
  );
}


const Container = styled.div`  
  width:100%;  
  display: flex;  
`;

const ImgWrap = styled.div`
  width: 152px;
  height: 228px;
  margin-right: 20px;
  font-size: 16px;
  font-weight: 500;
  color: #999999;
  position: relative;

  ${(props) =>
    !props.imgYn &&
    css`
      border: 2px solid #dddddd;
    `}
`;

const UploadImg = styled.div`
  width: 152px;
  height: 228px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
`;

const UploadIconWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10.5px;
`;

const Img = styled.div`
  width: 152px;
  height: 228px;
  cursor: pointer;
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

const FormWrap = styled.div`
  width: calc(100% - 160px);
`;
//width:600px;
const LeftWrap = styled.div`
  width: 100%;  
  margin-bottom: 50px; 
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => props.margin || "40px"};
`;

const InputTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`;

const SeasonNmWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 95%;
  @media (min-width: 1920px) {
    min-width: 600px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    min-width: ${(props) => props.active ? "600px" : "450px"};
  }
  @media (min-width: 10px) and (max-width: 1439px) {    
    min-width: ${(props) => props.active ? "600px" : "450px"};
  } 
`;

const SeasonNm = styled.div`
  height: 32px;
  padding: ${(props) => (props.shoes_size && "0px 25px") || "0px 15px"};
  font-size: 14px;
  font-weight: 500;
  border-radius: 500px;
  border: solid 1px #dddddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 8px;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
    border-color: #dddddd;
    color: #000000;
  }

  ${(props) =>
    props.active &&
    css`
      background-color: #7ea1b2;
      border-color: #7ea1b2;
      color: #ffffff;
    `}
`;

const InputTextField = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 11.5px 14px;
    font-size: 16px;
  }
  fieldset {
    border-color: #dddddd;
  }

  .MuiOutlinedInput-multiline {
    padding: 0;
  }
`;

const InputTextField2 = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 11.5px 14px;
    font-size: 16px;
  }
  fieldset {
    border-color: #dddddd;
  }

  .MuiOutlinedInput-multiline {
    padding: 0;
  }
  width: 443px;
`;

const InputTextField3 = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 11.5px 30px 11.5px 14px;
    font-size: 16px;
    text-align: right;
  }
  fieldset {
    border-color: #dddddd;
  }
  .MuiInputBase-input.Mui-disabled {
    opacity: 1;
    background-color: #f3f3f3;
    border-radius: 5px;
  }

  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }

  .MuiOutlinedInput-multiline {
    padding: 0;
  }
`;

const SelectBoxWrap = styled.div`
  display: flex;
  justify-content: space-between;
  
`;

const SelectBoxDiv = styled.div`
  margin-bottom: 12px;
`;

const RightWrap = styled.div`
  width: 100%;  
  margin-bottom: 50px; 

`;

const ColorWrap = styled.div`
  display: flex;
  width: 96%;
  @media (min-width: 1920px) {
    min-width: 600px;       
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    min-width: ${(props) => props.active ? "600px" : "450px"};
    margin-bottom: 70px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {    
    min-width: ${(props) => props.active ? "600px" : "450px"};
    margin-bottom: 70px;
  } 
  flex-wrap: wrap;
`;

const Color = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 500px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid #dddddd;
  margin-right: 8px;
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
    color: #000000;
  }

  ${(props) =>
    props.active &&
    css`
      background-color: #7ea1b2;
      border-color: #7ea1b2;
      color: #ffffff;
    `}
`;

const Circle = styled.div`
  width: 12px;
  height: 12px;
  margin-right: 5px;
  border-radius: 50%;

  ${(props) =>
    props.name === "화이트" &&
    css`
      border: 1px solid #dddddd;
    `}

  ${(props) =>
    props.name === "Multi"
      ? css`
          background-image: ${props.circleColor};
        `
      : css`
          background-color: ${(props) => props.circleColor};
        `}
`;

const ColorTxt = styled.div``;

const InImg = styled.img`
  max-width: 20px;
  margin-left: 8px;
`;

const SampleDelBtn = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  img {
    margin-left: 12px;
    cursor: pointer;
  }
`;

const DupBtn = styled.div`
  width: 108px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f7f7;
  border: solid 1px #dddddd;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
  &:active {
    background-color: ${darken(0.2, "#ffffff")};
  }
`;

const SeasonInput = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;