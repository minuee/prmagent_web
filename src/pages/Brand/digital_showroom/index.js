import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import FilterDialog from "components/FilterDialog";
import SettingDialog from "components/SettingDialog";
import DigitalShowroomTitle from "components/DigitalShowroomTitle";
import DigitalShowroomItems from "components/DigitalShowroomItems";
import TemporarySaveDialog from "components/brand/digital_showroom/TemporarySaveDialog";
import utils from "utils";
import { apiObject } from "api/api_brand";
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import Progress from "components/common/progress";

function DigitalShowroom() {
  const history = useHistory();
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filterData, setFilterData] = useState({
    gender_list: [],
    category_list: [],
    color_list: [],
    material_list: [],
    size_list: [],
    in_yn: null,
    still_life_img_yn: null,
  });

  const [tempDialogOpen, setTempDialogOpen] = useState(false);
  const [settingDialogOpen, setSettingDialogOpen] = useState(false);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const [lookbookBtn, setLookbookBtn] = useState(false);
  const [select, setSelect] = useState(false);
  // const [selectData, setSelectData] = useState([]);
  const [selectData, setSelectData] = useState({});
  const [createLookbook, setCreateLookbook] = useState(false);

  const [showroomImsi, setShowroomImsi] = useState(false);
  const [targetSeasonData, setTargetSeasonData] = useState('');

  const handleAddBtnClick = useCallback(async() => {
    const tmpData = localStorage.getItem("showroomimsi");
    //console.log('showroomImsi',tmpData)
    if (tmpData !== null ) {
        setShowroomImsi(tmpData)
        setTempDialogOpen(true);
    } else {
      
      history.push("/brand/digital_showroom/add");
    }
  });

  const handleLookBookClick = useCallback(() => {
    history.push("/brand/lookbook/select");
  });

  const handleFilterClick = useCallback(() => {
    setFilterDialogOpen(true);
  }, [filterDialogOpen]);

  const handleSettingsClick = useCallback(() => {
    setSettingDialogOpen(true);
  }, [settingDialogOpen]);

  const handleSelectOnBtn = useCallback(() => {
    setSelect(!select);
  }, [select]);

  const handleSelectData = useCallback(
    (data) => {
      setSelectData(
        selectData.some(
          (selectData) => selectData.showroom_no === data.showroom_no
        )
          ? selectData.filter((v) => v.showroom_no !== data.showroom_no)
          : { ...selectData }
      );
    },
    [selectData]
  );

  const handleCreateLookbook = useCallback(() => {
    setCreateLookbook(true);
  }, [createLookbook]);

  const handleMoveTemporarySave = () => {
    //const showroomImsi2 = JSON.parse(localStorage.getItem("showroomimsi"));   
    
    history.push({
      pathname: "/brand/digital_showroom/add",
      state: {  // location state
        screenState : showroomImsi
      }
    }); 
  };

  const handleMoveTemporaryCancel = async() => {
    await localStorage.removeItem("showroomimsi");
    history.push("/brand/digital_showroom/add");
  };

  const handleCopyData = async(season,seasonData) => {    
    console.log('season',season)  
    console.log('seasonData',seasonData[0])  
    let tmpSeasonData = null;
    if ( !utils.isEmpty(season.season_year)) {
      tmpSeasonData = {
        season_year: season.season_year,
        season_cd_id: season.season_cd_id,       
      }
    }else {
      if ( seasonData.length > 0 ) {
        tmpSeasonData = {
          season_year: seasonData[0].season_year,
          season_cd_id: seasonData[0].season_cd_id,       
        }
      }
    }
    if ( utils.isEmpty(targetSeasonData)) {
      console.log('tmpSeasonData',tmpSeasonData)  
      setTargetSeasonData(tmpSeasonData)
    }
  };

  const setAllUpdate = useMutation(
    ["brand-showroom-allupdate"],
    (value) =>
      apiObject.setShowroomAllUpdate(
        {
          gubun: value.gubun, // show or hide        
          season_year: value.season_year,
          season_cd_id: value.season_cd_id          
        },
        () => {}
      ),
    {
      onSuccess: () => {
        utils.customAlert("수정되었습니다.");
      },
      onError: () => {
        utils.customAlert("수정 중 오류가 발생했습니다.");
      },
    }
  );
  const handleUpdateAllData = async(mode) => {
    if ( utils.isEmpty(targetSeasonData)) {
      utils.customAlert('시즌정보가 없습니다.');
      return;
    }else{
      setAllUpdate.mutate({
        gubun: mode, // show or hide        
        season_year: targetSeasonData.season_year,
        season_cd_id: targetSeasonData.season_cd_id
      });
    }
  }
  
  if (setAllUpdate.isLoading) {
    return <Progress type="upload" />;
  }

  

  return (
    <>
      <>
        <TitelWrap active={isdrawer}>
          <DigitalShowroomTitle
            lookbookBtn={lookbookBtn}
            setLookbookBtn={setLookbookBtn}
            handleAddBtnClick={handleAddBtnClick}
            handleLookBookClick={handleLookBookClick}
            handleSelectOnBtn={handleSelectOnBtn}
            handleFilterClick={handleFilterClick}
            handleSettingsClick={handleSettingsClick}
            handleUpdateAllData={handleUpdateAllData}
          />
        </TitelWrap>

        <ContensWrap active={isdrawer}>
          <DigitalShowroomItems
            select={select}
            selectData={selectData}
            filterData={filterData}
            handleSelectData={handleSelectData}
            handleCreateLookbook={handleCreateLookbook}
            handleCopyData={handleCopyData}
          />
        </ContensWrap>

        <FilterDialog
          open={filterDialogOpen}
          setOpen={setFilterDialogOpen}
          filterData={filterData}
          setFilterData={setFilterData}
        />
        <SettingDialog
          open={settingDialogOpen}
          setOpen={setSettingDialogOpen}
        />

        <TemporarySaveDialog
          open={tempDialogOpen}
          setOpen={setTempDialogOpen}
          title="임시 저장 파일"
          subTitle="임시 저장된 샘플 요청 파일이 있습니다. 파일을 여시겠습니까?"
          handleConfirm={handleMoveTemporarySave}
          handleCancel={handleMoveTemporaryCancel}
        />
      </>
    </>
  );
}

const TitelWrap = styled.div`
  margin-bottom: 30px;
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "960px")};        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "680px")};    
  } 
`;

const ContensWrap = styled.div`  
  width:96%;  
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "960px")};
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "680px")};    
  } 
`;



export default React.memo(DigitalShowroom);
