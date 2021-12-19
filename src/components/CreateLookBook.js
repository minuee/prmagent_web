import React, { useState, useMemo } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { TextField } from "@material-ui/core";
import { useQuery } from "react-query";

import Items from "components/CreateLookBookItems";
import Selectbox from "components/brand/lookbook/Selectbox";
import CancelIcon from "assets/close_icon.png";
import { apiObject } from "api/api_brand";
import utils from "../utils";
import Progress from "components/common/progress";
import Constants from '../utils/constants';


const Container = styled.div`
  width : 95%;
`;
const TitelWrap = styled.div`
  margin-bottom: 60px;
`;

const Title = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
`;

const InputContainer = styled.div``;

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  margin-bottom: 20px;
`;

const InputTitle = styled.div`
  min-width: 125px;
  font-size: 20px;
  font-weight: 900;
`;

const InputTextField = styled(TextField)`
  width: 100%;

  .MuiOutlinedInput-input {
    padding: 11.5px 14px;
    font-size: 16px;
  }
  fieldset {
    border-color: #dddddd;
    border-radius: 5px;
  }

  .MuiOutlinedInput-multiline {
    padding: 0;
  }
`;

const ItemContainer = styled.div`
  margin-left: -20px;
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  width: 98%;
  position: relative;
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 40px 0 60px 0;
`;

const BtnWrap = styled.div`
  width: 200px;
  height: 60px;
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
    margin-left: 10px;
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

export default function CreateLookBook({
  selectData,
  handleSelectData,
  handleCancel,
  handleCreate,
}) {
  const [inputs, setInputs] = useState({
    lookbook_nm: "",
    // made_for_mgzn_id: "",
    made_for: "",
    season_cd_id: "",
    gender_cd_id: "",
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setInputs({ ...inputs, [e.target.name]: value });
  };

  const handleSubmit = () => {
    if (!utils.FalsyValueCheck(inputs, [])) {
      utils.customAlert("필드값을 확인해주세요.");
    } else {
      let newArr = [];
      selectData.map((v) => {
        newArr.push(v.showroom_no);
      });
      handleCreate(inputs, newArr);
    }
  };

  const sampleCdQuery = useQuery(
    ["sample-cd-info"],
    async () => await apiObject.getSampleInfo(() => {})
  );

  const sampleCdData = useMemo(() =>
    sampleCdQuery.isLoading ? [] : sampleCdQuery.data
  );

  if (sampleCdQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <Container>
      <TitelWrap>
        <Title>LookBook</Title>
      </TitelWrap>
      <InputContainer>
        <InputWrap>
          <InputTitle>Title</InputTitle>
          <InputTextField
            variant="outlined"
            placeholder="Title"
            value={inputs.lookbook_nm}
            name="lookbook_nm"
            onChange={handleChange}
          />
        </InputWrap>
        <InputWrap>
          <InputTitle>Season</InputTitle>
          <Selectbox
            value={inputs.season_cd_id}
            options={sampleCdData.season}
            name="season_cd_id"
            handleChange={handleChange}
          />
          {/* <CaptionWrap ref={seasonRef} active={selectSeasonOpen}>
            <MainMenu onClick={handleSeasonOpen}>
              <div>
                {inputs.season_cd_id === ""
                  ? "-"
                  : sampleCdData.season.find(
                      (v) => v.cd_id === inputs.season_cd_id
                    ).cd_nm}
              </div>
              {selectSeasonOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </MainMenu>
            {selectSeasonOpen && (
              <SubMenu>
                {sampleCdData.season.map((d) => (
                  <div
                    key={d.cd_id}
                    onClick={() => handleSelectbox("season_cd_id", d.cd_id)}
                  >
                    {d.cd_nm}
                  </div>
                ))}
              </SubMenu>
            )}
          </CaptionWrap> */}
        </InputWrap>
        <InputWrap>
          <InputTitle>Gender</InputTitle>
          <Selectbox
            value={inputs.gender_cd_id}
            options={sampleCdData.gender}
            name="gender_cd_id"
            handleChange={handleChange}
          />
          {/* <CaptionWrap ref={genderRef} active={selectGenderOpen}>
            <MainMenu onClick={handleGenderOpen}>
              <div>
                {inputs.gender_cd_id === ""
                  ? "-"
                  : sampleCdData.gender.find(
                      (v) => v.cd_id === inputs.gender_cd_id
                    ).cd_nm}
              </div>
              {selectGenderOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </MainMenu>
            {selectGenderOpen && (
              <SubMenu>
                {sampleCdData.gender.map((d) => (
                  <div
                    key={d.cd_id}
                    onClick={() => handleSelectbox("gender_cd_id", d.cd_id)}
                  >
                    {d.cd_nm}
                  </div>
                ))}
              </SubMenu>
            )}
          </CaptionWrap> */}
        </InputWrap>
        <InputWrap>
          <InputTitle>Made for</InputTitle>
          {/* <CaptionWrap ref={refMgzn} active={mgznSelectOpen}>
            <MainMenu onClick={handleMgznOpen}>
              <div>
                {inputs.made_for_mgzn_id === ""
                  ? "-"
                  : mgznCompanyData.find(
                      (v) => v.mgzn_id === inputs.made_for_mgzn_id
                    ).mgzn_nm}
              </div>
              {mgznSelectOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </MainMenu>
            {mgznSelectOpen && (
              <SubMenu>
                {mgznCompanyData.map((d) => (
                  <div
                    key={d.mgzn_id}
                    onClick={() =>
                      handleSelectbox("made_for_mgzn_id", d.mgzn_id)
                    }
                  >
                    {d.mgzn_nm}
                  </div>
                ))}
              </SubMenu>
            )}
          </CaptionWrap> */}
          <InputTextField
            variant="outlined"
            placeholder="Made for"
            value={inputs.made_for}
            name="made_for"
            onChange={handleChange}
          />
        </InputWrap>
      </InputContainer>

      <ItemContainer>
        {selectData.map((d) => (
          <Items
            key={d.showroom_no}
            data={d}
            selectData={selectData}
            handleDeleteItem={handleSelectData}
          />
        ))}
      </ItemContainer>

      <BottomWrap>
        <BtnWrap type="cancel" onClick={handleCancel}>
          <BtnImgWrap>
            <img src={CancelIcon} alt="close"></img>
          </BtnImgWrap>
          <CancelTxt>Cancel</CancelTxt>
        </BtnWrap>
        <BtnWrap type="confirm" onClick={handleSubmit}>
          <ConfirtTxt>룩북 생성하기</ConfirtTxt>
        </BtnWrap>
      </BottomWrap>
    </Container>
  );
}
