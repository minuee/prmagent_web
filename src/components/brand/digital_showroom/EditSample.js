import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { TextField } from "@material-ui/core";
import { darken } from "polished";
import { useHistory } from "react-router-dom";
import { useQueryClient } from "react-query";

import SelectBox from "components/LookAddSelectBox";
import YearSelectBox from "components/brand/digital_showroom/YearSelectBox";
import CategorySelectBox from "components/CategorySelectBox";
import ShoesSelectBox from "components/brand/digital_showroom/ShoesSelectBox";
import UploadDialog from "components/UploadDialog_v2";
import CheckBoxOn from "assets/checkbox_on.png";
import CheckBoxOff from "assets/checkbox_off.png";
import UploadIcon from "assets/upload_icon.png";
import SampleDelete from "assets/sample_del_button.svg";
import utils from "utils";

const ImgWrap = styled.div`
  width: 152px;
  height: 228px;
  margin-right: 40px;
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

const LeftWrap = styled.div`
  width: 600px;
  margin-right: 88px;
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
  min-width: 600px;
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

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
    border-color: #dddddd;
    color: #000000;
  }

  & + & {
    margin-left: 8px;
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

const SelectBoxWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SelectBoxDiv = styled.div`
  margin-bottom: 12px;
`;

const RightWrap = styled.div`
  width: 600px;
`;

const ColorWrap = styled.div`
  display: flex;
  width: 560px;
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
  cursor: pointer;
`;

const SampleDelBtn = styled.div`
  position: absolute;
  right: 60px;
  display: flex;

  img {
    margin-left: 12px;
    cursor: pointer;
  }
`;

const DupBtn = styled.div`
  width: 118px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
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
  });
  const [genderOptions, setGenderOptions] = useState(null);

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
      sample[idx].still_life_img_yn = !sample[idx].still_life_img_yn;
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

  const handleBuyingList = (d) => {
    let newArr = sample[idx].buying_cd_id;
    newArr.includes(d)
      ? (newArr = newArr.filter((c) => c !== d))
      : newArr.push(d);
    sample[idx].buying_cd_id = newArr;
    setSample([...sample]);
  };

  const sampleCdQuery = queryClient.getQueryData(["sample-cd-info"]);


  return (
    <>
      {sample[idx] !== undefined && sampleCdQuery !== undefined && (
        <>
          <SampleDelBtn>
            <DupBtn onClick={() => handleDuplicate(idx)}>사본 만들기</DupBtn>
            {idx > 0 && (
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
                (h) =>
                  h.main_yn && (
                    <Img
                      key={h.full_url}
                      imgUrl={h.full_url}
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
          <LeftWrap>
            <InputWrap>
              <InputTitle>Season</InputTitle>
              <SeasonInput>
                <SelectBoxDiv>
                  <YearSelectBox
                    width="140px"
                    height="42px"
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
                  />
                )}
              </SeasonInput>
              <SeasonNmWrap>
                {season_data !== undefined &&
                  season_data.map((d) => (
                    <SeasonNm
                      key={d.cd_id}
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
              </SeasonNmWrap>
            </InputWrap>
            <InputWrap>
              <InputTitle>Sample name</InputTitle>
              <InputTextField
                variant="outlined"
                placeholder="name"
                value={sample[idx].sample_nm}
                name="sample_nm"
                onChange={handleInputChange}
              />
            </InputWrap>
            <InputWrap>
              <InputTitle>Category</InputTitle>
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
            {genderOptions !== null && (
              <InputWrap>
                <InputTitle>Shoes Size</InputTitle>
                <SelectBoxDiv>
                  <ShoesSelectBox
                    width="140px"
                    height="42px"
                    name="size_cd_id"
                    value={sample[idx].size_cd_id}
                    options={genderOptions}
                    handleChange={handleChange}
                  />
                </SelectBoxDiv>
              </InputWrap>
            )}
            <InputWrap>
              <InputTitle>Material</InputTitle>
              <SelectBox
                width="598px"
                height="42px"
                name="material_cd_id"
                value={sampleCdQuery.material.find(
                  (k) => k.cd_id === sample[idx].material_cd_id
                )}
                options={sampleCdQuery.material}
                handleChange={handleChange}
              />
            </InputWrap>
            <InputWrap>
              <InputTitle>Price</InputTitle>
              <InputTextField
                variant="outlined"
                placeholder="Price"
                value={utils.numberWithCommas(sample[idx].price)}
                name="price"
                // type="number"
                onChange={handleInputChange}
              />
            </InputWrap>
            <InputWrap>
              <InputTitle>SKU (Style #)</InputTitle>
              <InputTextField
                variant="outlined"
                multiline
                rows={5}
                value={sample[idx].sku}
                name="sku"
                placeholder="SKU"
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
          </LeftWrap>
          <RightWrap>
            <InputWrap>
              <InputTitle>영문 캡션</InputTitle>
              <SeasonNmWrap>
                {gender_data !== undefined &&
                  gender_data.map((d) => (
                    <SeasonNm
                      key={d.cd_id}
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
            <InputWrap margin={sample[idx].category === "Shoes" ? "104px" : null}>
              <InputTitle>Stock</InputTitle>
              <SeasonNmWrap>
                {buying_data !== undefined &&
                  buying_data.map((d) => (
                    <SeasonNm
                      key={d.cd_id}
                      active={
                        sample[idx].buying_cd_id.includes(d.cd_id)
                          ? true
                          : false
                      }
                      onClick={() => handleBuyingList(d.cd_id)}
                    >
                      {d.cd_nm}
                    </SeasonNm>
                  ))}
              </SeasonNmWrap>
            </InputWrap>
            <InputWrap
              margin={sample[idx].category === "Shoes" ? "174px" : "72px"}
            >
              <InputTitle>Color</InputTitle>
              <ColorWrap>
                {color_data !== undefined &&
                  color_data.map((d) => (
                    <Color
                      key={d.cd_id}
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
            <InputWrap>
              <InputTitle>Size</InputTitle>
              <InputTextField
                variant="outlined"
                placeholder="size"
                value={sample[idx].size_direct_input}
                name="size_direct_input"
                onChange={handleInputChange}
              />
            </InputWrap>
            <InputWrap margin="82px">
              <InputTitle>
                샘플 입고{" "}
                <InImg
                  src={sample[idx].in_yn ? CheckBoxOn : CheckBoxOff}
                  alt="in"
                  onClick={() => handleChange("in_yn", !sample[idx].in_yn)}
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
              <InputTitle>Caption</InputTitle>
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
        </>
      )}
    </>
  );
}
