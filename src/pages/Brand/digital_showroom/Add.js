import React, { useState, useMemo, useEffect } from "react";
import styled, { css } from "styled-components";
import { TextField, Divider } from "@material-ui/core";
import { darken } from "polished";
import { useHistory,useLocation } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import _ from "lodash";

import SampleAddIcon from "assets/sample_add_icon.png";
import CancelIcon from "assets/close_icon.png";
import CheckIcon from "assets/check_icon.png";
import RequiredIcon from "assets/require_icon.svg";
import AddSample from "components/brand/digital_showroom/AddSample";
import SelectFeaturedImageDialog from "components/brand/digital_showroom/SelectFeatuerdImageDialog";
import TemporarySaveDialog from "components/brand/digital_showroom/TemporarySaveDialog";
import { apiObject } from "api/api_brand";
import Constants from 'utils/constants';

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';

export default function DigitalShowroomAdd() {
    const history = useHistory();
    const location = useLocation();
    const [isLoad, setIsLoad] = useState(1);
    const screenState = utils.isEmpty(location.state) ? null : JSON.parse(location.state.screenState);
    console.log('isLoad',isLoad);
    const [commonData, setCommonData] = useState({
        showroom_nm: "",
        season_year: "",
        season_year_direct: "",
        season_cd_id: "",
        season_direct_input: "",
        mfrc_sample_yn: "",
        show_yn : 'N'
    });
    const [sampleList, setSampleList] = useState([]);    
    const [sampleCnt, setSampleCnt] = useState(1);

  /*   useEffect(() => {
        console.log(history);
        const unblock = history.block("이 페이지를 나가시겠습니다?");
        return () => {
          unblock();
        };
      }, [history]); */
    
    useEffect(async() => {
        console.log('screenState',screenState);
        if ( isLoad === 1 && !utils.isEmpty(screenState) ) {
            console.log('screenState33333',screenState);
            setCommonData({
                showroom_nm: utils.isEmpty(screenState.lookData.showroom_nm) ? "" : screenState.lookData.showroom_nm,
                season_year: utils.isEmpty(screenState.lookData.season_year) ? "" : screenState.lookData.season_year,
                season_year_direct: utils.isEmpty(screenState.lookData.season_year_direct) ? "" : screenState.lookData.season_year_direct,
                season_cd_id: utils.isEmpty(screenState.lookData.season_cd_id) ? "" : screenState.lookData.season_cd_id,
                season_direct_input: utils.isEmpty(screenState.lookData.season_direct_input) ? "" : screenState.lookData.season_direct_input,
                mfrc_sample_yn: utils.isEmpty(screenState.lookData.mfrc_sample_yn) ? "" : screenState.lookData.mfrc_sample_yn,
                show_yn: utils.isEmpty(screenState.lookData.show_yn) ? "" : screenState.lookData.show_yn,
            });
            setSampleList(utils.isEmpty(screenState.sampleList) ? [] : screenState.sampleList);
            setIsLoad(2);
            //setSampleCnt(utils.isEmpty(screenState.sampleList) ? 0 : screenState.sampleList.length);
        }
      }, [screenState]);
    
    
    const [duplicateChk, setDuplicateChk] = useState([null]);
    const [open, setOpen] = useState(false);
    const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);

    const [tempDialog, setTempDialog] = useState(false);
    const [temporary, setTemporary] = useState("");

    // 취소 버튼 handler
    const handleCancel = () => {
        //history.push("/brand/digital_showroom");
        history.goBack();
    };

    // 등록 버튼 handler
    const handleConfirm = () => {
        alertConfirm({
            title: Constants.appName,
            content: '등록하시겠습니까?',
            onOk: () => {
                if ( commonData.season_year === "" && commonData.season_year_direct === "" ) {
                    utils.customAlert("시즌연도를 입력해주세요.");
                    return;
                } else if (commonData.season_cd_id === "") {
                    utils.customAlert("컬렉션을 선택해주세요.");
                    return;
                } else if ( commonData.season_cd_id === "none" && commonData.season_direct_input === "" ) {
                    utils.customAlert("컬렉션을 입력해주세요.");
                    return;
                }
                sampleList.forEach(async(d,i) => {
                    console.log('d.sample_image_list',d.sample_image_list)
                    const mainCheck  = await d.sample_image_list.filter(item => item.showroom_main_yn == true);
                    if (d.sample_image_list.length === 0) {
                        utils.customAlert("이미지를 등록해주세요.");
                        return;
                    } else if (d.sample_image_list.length > 0) {
                        console.log('sampleList',mainCheck, mainCheck.length)
                        if ( mainCheck.length === 0 ) {
                            utils.customAlert("대표이미지를 선택해주세요.");
                            return;
                        }
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
                        return; */
                    } else if (d.price === "") {
                        d.price = null;
                    }
                    uploadData.mutate();
                });
            },
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
        let newArr = [];
        duplicateChk.map((d, i) => i !== idx && newArr.push(d));
        setSampleList(sampleList.filter((v, i) => i !== idx));
        setSampleCnt(sampleCnt - 1);
    };

    const handleDuplicate = (idx) => {
        setDuplicateChk([...duplicateChk, _.cloneDeep(sampleList[idx])]);
        setSampleCnt(sampleCnt + 1);
    };

    // 대표이미지 선택 handler
    const handleShowroomMainImg = (url) => {
        sampleList.map((d, i) =>
            d.sample_image_list.find((v, j) => {
                if (v.url === url) {
                    sampleList[i].sample_image_list[j].showroom_main_yn = true;
                    setSampleList([...sampleList]);
                }
            })
        );
    };

    const sampleCdQuery = useQuery(
        ["sample-cd-info"], async () => await apiObject.getSampleInfo(() => {})
    );

    const sampleCdData = useMemo(() => sampleCdQuery.isLoading ? [] : sampleCdQuery.data);
    const uploadData = useMutation(() => apiObject.createShowroom(
        {
            showroom_nm: commonData.showroom_nm,
            season_year: commonData.season_year_direct === "" ? commonData.season_year : commonData.season_year_direct, 
            season_cd_id: commonData.season_cd_id === "none" ? null : commonData.season_cd_id,
            season_direct_input: commonData.season_cd_id === "none" ? commonData.season_direct_input: null,
            mfrc_sample_yn: commonData.mfrc_sample_yn,
            show_yn : commonData.show_yn,
            sample_list: sampleList,
        },
        () => {}
    ),
    {
        onSuccess: () => {
            utils.customAlert("정상적으로 등록되었습니다.");
            history.replace("/brand/digital_showroom");
        },
        onError: () => {
            utils.customAlert("등록 중 오류가 발생했습니다.");
            return;
        },
    });

    const handleTemporarySave = () => {
        const tmpData = {
            lookData : commonData,
            sampleList: sampleList
        }        
        setTempDialog(!tempDialog);
        setTemporary(tmpData);
    };
    
    const handleTemporarySaveConfirm = async() => {        
        await localStorage.setItem("showroomimsi", JSON.stringify(temporary));
        setTempDialog(false);
    };
    const handleTemporaryCancel = () => {
        setTempDialog(false);
    };

    return (
        <MainContainer active={isdrawer}>
            {
            commonData !== undefined && (
            <>
                <TitleWrap>
                    <TitleTxt>
                        <StyleTextField
                            variant="outlined"
                            value={commonData.showroom_nm}
                            placeholder="Look Title(50자이내)"
                            name="showroom_nm"
                            inputProps={{
                                maxLength: 52,
                              }}
                            onChange={handleChangeTextField}
                        />
                        {/* <span style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}>*</span> */}
                    </TitleTxt>
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
                                <input type="checkbox" style={{ display: "none" }} checked={commonData.mfrc_sample_yn} readOnly />
                                <Marble active={commonData.mfrc_sample_yn ? "on" : "off"} />
                                <SwitchBtn active={commonData.mfrc_sample_yn ? "on" : "off"}>On</SwitchBtn>
                                <SwitchBtn active={!commonData.mfrc_sample_yn ? "on" : "off"}>Off</SwitchBtn>
                            </SwitchDiv>
                        </SwitchWrap>
                    </SwitchOuterWrap>
                </TitleWrap>
                <StyledDivider />
                {
                    [...Array(sampleCnt)].map((n, index) => (
                    <ContentsWrap key={index}>
                        <AddSample
                            idx={index}
                            commonData={commonData}
                            setCommonData={setCommonData}
                            sample={sampleList}
                            setSample={setSampleList}
                            duplicateChk={duplicateChk[index]}
                            handleDelSample={handleDelSample}
                            handleDuplicate={handleDuplicate}
                            // inputs={inputs}
                            // setInputs={setInputs}
                            season_data={sampleCdData.season}
                            color_data={sampleCdData.color}
                            buying_data={sampleCdData.buying}
                            gender_data={sampleCdData.gender}
                            material_data={sampleCdData.material}
                            category_data={sampleCdData.category}
                        />
                    </ContentsWrap>
                    ))
                }
                <AddSampleBtn onClick={handleAddSample}>
                    <AddIcon src={SampleAddIcon} alt="add" />
                    Add Sample
                </AddSampleBtn>
                <BottomWrap>
                    <BottomBtnGroup>
                        <SelectFeaturedBtn onClick={() => setOpen(!open)}>대표 이미지 선택</SelectFeaturedBtn>
                    </BottomBtnGroup>
                    <BottomBtnGroup>
                        <BtnWrap type="cancel" onClick={handleCancel} active={isdrawer}>
                            <BtnImgWrap><img src={CancelIcon} alt="close"></img></BtnImgWrap>
                            <CancelTxt>취소</CancelTxt>
                        </BtnWrap>
                        <BtnWrap type="cancel" onClick={handleTemporarySave} active={isdrawer}>                            
                            <CancelTxt>임시 저장</CancelTxt>
                        </BtnWrap>
                        <BtnWrap type="confirm" onClick={handleConfirm} active={isdrawer}>
                            <BtnImgWrap><img src={CheckIcon} alt="check"></img></BtnImgWrap>
                            <ConfirtTxt>등록</ConfirtTxt>
                        </BtnWrap>
                    </BottomBtnGroup>
                </BottomWrap>
            </>
            )
            }
            <SelectFeaturedImageDialog
                open={open}
                setOpen={setOpen}
                data={sampleList}
                handleConfirm={handleShowroomMainImg}
            />
            <TemporarySaveDialog
                open={tempDialog}
                setOpen={setTempDialog}
                title="임시 저장"
                subTitle="기존 임시 저장 파일은 현재 내용으로 대체됩니다."
                handleConfirm={handleTemporarySaveConfirm}
                handleCancel={handleTemporaryCancel}
            />
        </MainContainer>
    );
}

const MainContainer = styled.div`
    width: calc(100%-25px);
    margin-left:25px;
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

const TitleWrap = styled.div`
    width: calc(100%-25px);    
    display: flex;
    margin-bottom: 16px;
    justify-content: space-between;
    align-items: center;
`;

const TitleTxt = styled.div``;
const SwitchOuterWrap = styled.div`
  display: flex;
  align-items: center;
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
        css`color: #ffffff;`
    }
`;

const Marble = styled.div`
    width: 52px;
    height: 28px;
    border-radius: 500px;
    background-color: #000000;
    position: absolute;
    transition: all 0.3s;
    ${(props) => props.active === "on" ? css`left: 1px;` : css`left: 49px;`}
`;

const StyledDivider = styled(Divider)`
    height: 2px;
    background-color: #dddddd;
`;

const StyleTextField = styled(TextField)`
    .MuiOutlinedInput-input {
        padding: 0;
        font-size: 28px;
        font-weight: 900;
        color: #cccccc;
        min-width:350px;
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
    width: 100%;
`;

const AddSampleBtn = styled.div`
    width: 100%;
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
`;

const BtnWrap = styled.div`    
    width: ${(props) => props.active ? "200px" : "150px"};
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: ${(props) => props.type === "cancel" ? "#ffffff" : "#7ea1b2"};
    border: ${(props) => props.type === "cancel" ? "solid 1px #dddddd" : "none"};
    border-radius: 5px;
    transition: all 0.3s;
    ${(props) => props.type === "cancel" && 
        css`
        &:hover {
            background-color: ${darken(0.1, "#ffffff")};
        }
        &:active {
            background-color: ${darken(0.2, "#ffffff")};
        }
    `}

    ${(props) => props.type === "confirm" &&
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

const SelectFeaturedBtn = styled.div`    
    width: ${(props) => props.active ? "264px" : "244px"};
    height: 60px;
    border-radius: 5px;
    border: solid 1px #dddddd;
    background-color: #f3f3f3;
    font-size: 16px;
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
