import React, { useState } from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";
import { darken } from "polished";
import { TextField } from "@material-ui/core";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Constants from 'utils/constants';
import Items from "components/LookBookEditItems";
import Selectbox from "components/brand/lookbook/Selectbox";
import CancelIcon from "assets/close_icon.png";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

const MainContainer = styled.div`
  width: 94%;
  margin-left:25px;  
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "960px")};        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "600px")};    
  } 
`;

const TitelWrap = styled.div`
  margin-bottom: 60px;
  width:calc(100%-25px);
  margin-left:25px;
`;

const Title = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
`;


const InputContainer = styled.div`
  width:100%;
  
`;

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  margin-bottom: 20px;
`;

const InputTitle = styled.div`
  width: 125px;
  font-size: 20px;
  font-weight: 900;
`;

const InputTextField = styled(TextField)`
  width: 100%;

  .MuiOutlinedInput-input {
    padding: 11.5px 14px;
    font-size: 16px;
    font-weight: bold;
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
  width: 100%;  
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
`;

const BottomWrap = styled.div`
  display: flex;
  width:100%;
  justify-content: flex-end;
  margin-right:60px;
  margin-top:50px;
`;

const BtnWrap = styled.div`
  width: 140px;
  height: 50px;
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

export default function EditComponent({ data, lookbookNo }) {
  const history = useHistory();
  const queryClient = useQueryClient();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const [inputs, setInputs] = useState({
    lookbook_nm: data.lookbook_nm,
    season_se_cd: data.season_se_cd,
    gender_cd_id: data.gender_cd_id,
    made_for: data.made_for,
  });

  const [list, setList] = useState(data.list);
  const [delList, setDelList] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputs({ ...inputs, [e.target.name]: value });
  };

  const handleCancelBtn = () => {
    history.goBack();
  };

  const handleSelectData = (data) => {
    setList(
      list.some((d) => d.showroom_no === data)
        ? list.filter((v) => v.showroom_no !== data)
        : { ...list }
    );
    setDelList(
      delList.includes(data)
        ? delList.filter((d) => d !== data)
        : [...delList, data]
    );
  };

  const handleSaveClick = () => {
    alertConfirm({
      title: Constants.appName,
      content: '룩북을 수정하시겠습니까?',
      onOk: () => {editLookbook.mutate()},
      onCancel: () => {console.log('cancel')}
    });
    /* if (confirm("룩북을 수정하시겠습니까?")) {
      editLookbook.mutate();
    } */
  };

  const handleSaveAsClick = () => {
    /* if (confirm("새로운 룩븍을 등록하시겠습니까?")) {
      let newArr = [];
      list.map((v) => newArr.push(v.showroom_no));
      addLookbook.mutate(newArr);
    } */
    alertConfirm({
      title: Constants.appName,
      content: '새로운 룩븍을 등록하시겠습니까?',
      onOk: () => {
        let newArr = [];
        list.map((v) => newArr.push(v.showroom_no));
        addLookbook.mutate(newArr);
      },
      onCancel: () => {console.log('cancel')}
    });
  };

  const sampleCdQuery = useQuery(
    ["sample-cd-info"],
    async () => await apiObject.getSampleInfo(() => {})
  );

  const sampleCdData = sampleCdQuery.isLoading ? [] : sampleCdQuery.data;

  // edit
  const editLookbook = useMutation(
    () =>
      apiObject.editLookbook(
        {
          lookbook_no: lookbookNo,
          lookbook_nm: inputs.lookbook_nm,
          remove_showroom_list: delList,
          season_cd_id: inputs.season_se_cd,
          gender_cd_id: inputs.gender_cd_id,
          made_for: inputs.made_for,
        },
        () => {}
      ),
    {
      onSuccess: () => {
        utils.customAlert("정상적으로 수정되었습니다.");
        history.replace("/brand/lookbook/detail/" + lookbookNo);
      },
      onError: () => {
        utils.customAlert("수정 중 오류가 발생했습니다.");
        return;
      },
      onSettled: () => {
        queryClient.invalidateQueries(["lookbook-detail", lookbookNo]);
      },
    }
  );

  // add
  const addLookbook = useMutation(
    (value) =>
      apiObject.setLookbook(
        {
          lookbook_nm: inputs.lookbook_nm,
          showroom_list: value,
          season_cd_id: inputs.season_se_cd,
          gender_cd_id: inputs.gender_cd_id,
          made_for: inputs.made_for,
        },
        () => {}
      ),
    {
      onSuccess: (data) => {
        utils.customAlert("정상적으로 등록되었습니다.");
        history.replace("/brand/lookbook/detail/" + data.lookbook_no);
      },
      onError: () => {
        utils.customAlert("등록 중 오류가 발생했습니다.");
        return;
      },
    }
  );

  if (sampleCdQuery.isLoading) {
    return <Progress type="load" />;
  } else {
    console.log("LOADING COMPLETE");
  }

  if (addLookbook.isLoading) {
    return <Progress type="upload" />;
  }

  if (editLookbook.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <MainContainer>
      <TitelWrap>
        <Title>LookBook111</Title>
      </TitelWrap>
      <InputContainer active={isdrawer}>
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
            value={inputs.season_se_cd}
            options={sampleCdData.season}
            name="season_se_cd"
            handleChange={handleChange}
          />
        </InputWrap>
        <InputWrap>
          <InputTitle>Gender</InputTitle>
          <Selectbox
            value={inputs.gender_cd_id}
            options={sampleCdData.gender}
            name="gender_cd_id"
            handleChange={handleChange}
          />
        </InputWrap>
        <InputWrap>
          <InputTitle>Made for</InputTitle>
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
        {list !== undefined &&
          list.map((d) => (
            <Items
              key={d.showroom_no}
              data={d}
              list={list}
              handleDeleteItem={handleSelectData}
            />
          ))}
      </ItemContainer>

      <BottomWrap>
        <BtnWrap type="cancel" onClick={handleCancelBtn}>
          <BtnImgWrap>
            <img src={CancelIcon} alt="close"></img>
          </BtnImgWrap>
          <CancelTxt>Cancel</CancelTxt>
        </BtnWrap>
        <BtnWrap type="confirm" onClick={handleSaveClick}>
          <ConfirtTxt>저장</ConfirtTxt>
        </BtnWrap>
        <BtnWrap type="confirm" onClick={handleSaveAsClick}>
          <ConfirtTxt>다른이름으로 저장</ConfirtTxt>
        </BtnWrap>
      </BottomWrap>
    </MainContainer>
  );
}
