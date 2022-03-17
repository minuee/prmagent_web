import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-query";

import FilterDialog from "components/FilterDialog";
import SettingDialog from "components/SettingDialog";
import DigitalShowroomTitle from "components/DigitalShowroomTitle";
import DigitalShowroomItems from "components/DigitalShowroomItems";
import CreateLookBook from "components/CreateLookBook";
import AlertDialog from "components/AlertDialog";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';


/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

const MainContainer = styled.div`
  width:100%;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1920px" : "1560px")};       
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
  
`;

const ContensWrap = styled.div`
  margin-left: -20px;
  width:98%;
`;

export default function Select() {
  const history = useHistory();
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const [filterData, setFilterData] = useState({
    gender_list: [],
    category_list: [],
    color_list: [],
    material_list: [],
    size_list: [],
    in_yn: null,
    still_life_img_yn: null,
  });
  const [settingDialogOpen, setSettingDialogOpen] = useState(false);
  const [lookbookBtn, setLookbookBtn] = useState(false);
  const [select, setSelect] = useState(false);
  const [selectData, setSelectData] = useState([]);
  const [createLookbook, setCreateLookbook] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);

  const handleAddBtnClick = () => {
    history.push("/brand/digital_showroom/add");
  };

  const handleLookBookClick = () => {
    history.push("/brand/lookbook/select");
  };

  const handleFilterClick = () => {
    setFilterDialogOpen(true);
  };

  const handleSettingsClick = () => {
    setSettingDialogOpen(true);
  };

  const handleSelectOnBtn = () => {
    setSelect(!select);
  };

  const handleSelectData = (no) => {
    setSelectData(
      selectData.includes(no)
        ? selectData.filter((d) => d !== no)
        : [...selectData, no]
    );
  };

  const handleCreateLookbook = () => {
    setCreateLookbook(true);
  };

  const handleCancel = () => {
    setCreateLookbook(false);
    setLookbookBtn(false);
    setSelect(false);
    setSelectData([]);
  };

  const handleCreate = (inputs, list) => { 
    /* if (confirm("룩북을 등록하시겠습니까?")) {
      addLookbook.mutate({
        lookbook_nm: inputs.lookbook_nm,
        season_cd_id: inputs.season_cd_id,
        gender_cd_id: inputs.gender_cd_id,
        made_for: inputs.made_for,
        showroom_list: list,
      });
    } */

    alertConfirm({
      title: Constants.appName,
      content: '룩북을 등록하시겠습니까?',
      onOk: () => {
        addLookbook.mutate({
          lookbook_nm: inputs.lookbook_nm,
          season_cd_id: inputs.season_cd_id,
          gender_cd_id: inputs.gender_cd_id,
          made_for: inputs.made_for,
          showroom_list: list,
        });
      },
      onCancel: () => {console.log('cancel')}
    });
  };

  const addLookbook = useMutation(
    ["create-lookbook"],
    (value) =>
      apiObject.setLookbook(
        {
          lookbook_nm: value.lookbook_nm,
          showroom_list: value.showroom_list,
          season_cd_id: value.season_cd_id,
          gender_cd_id: value.gender_cd_id,
          made_for: value.made_for,
        },
        () => {}
      ),
    {
      onSuccess: () => {
        setAlertDialog(true);
      },
      onError: () => {
        alert("룩북 등록 중 오류가 발생했습니다.");
      },
    }
  );

  if (addLookbook.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <MainContainer active={isdrawer}>  
      {!createLookbook ? (
        <>
          <TitelWrap>
            <DigitalShowroomTitle
              lookbookBtn={true}
              setLookbookBtn={setLookbookBtn}
              handleSelectOnBtn={handleSelectOnBtn}
              handleFilterClick={handleFilterClick}
            />
          </TitelWrap>

          <ContensWrap>
            <DigitalShowroomItems
              select={select}
              selectData={selectData}
              filterData={filterData}
              handleSelectData={handleSelectData}
              handleCreateLookbook={handleCreateLookbook}
            />
          </ContensWrap>

          <FilterDialog open={filterDialogOpen} setOpen={setFilterDialogOpen} />
          <SettingDialog
            open={settingDialogOpen}
            setOpen={setSettingDialogOpen}
          />
        </>
      ) : (
        <CreateLookBook
          selectData={selectData}
          handleCancel={handleCancel}
          handleCreate={handleCreate}
          handleSelectData={handleSelectData}
        />
      )}

      <AlertDialog open={alertDialog} setOpen={setAlertDialog} />
    </MainContainer>
  );
}
