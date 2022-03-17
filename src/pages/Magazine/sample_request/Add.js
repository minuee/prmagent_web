import React, { useState,useEffect } from "react";
import styled from "styled-components";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";

import { apiObject } from "api/api_magazine";
import Progress from "components/common/progress";
import AddComponent from "components/magazine/sample_requests/AddComponent";
import TemporarySaveDialog from "components/magazine/sample_requests/TemporarySaveDialog";
import Constants from 'utils/constants';
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

export default function CreateRequestSample({ match }) {
    const history = useHistory();
    const brand_id = match.params.showroom_list.split("=")[0];
    const showroom_list = match.params.showroom_list.split("=")[1].split("+");
    const [tempDialog, setTempDialog] = useState(false);
    const [temporary, setTemporary] = useState("");
    const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
    const [isRegistOk, setisRegistOk] = useState(true);

    /* useEffect(() => {
        if ( isRegistOk ) {
            const unblock = history.block("이 페이지를 나가시겠습니다?");
            return () => {
            unblock();
            };
        }
      }, [history]); */

    const handleSubmit = (inputs) => {
        inputs.brand_id = brand_id;
        alertConfirm({
            title: Constants.appName,
            content: '샘플요청을 등록하시겠습니까?',
            onOk: () => {
                if (inputs.req_user_id === "") {
                    utils.customAlert("담당기자/스타일리스트를 선택해주세요");
                    return;
                }
                if (inputs.contact_user_id === "") {
                    utils.customAlert("연락받을 담당자를 선택해주세요.");
                    return;
                }
                if (isNaN(inputs.photogrf_dt)) {
                    utils.customAlert("촬영일자를 선택해주세요.");
                    return;
                }
                if (isNaN(inputs.photogrf_end_dt)) {
                    utils.customAlert("촬영일자를 선택해주세요.");
                    return;
                }
                if (isNaN(inputs.duty_recpt_dt)) {
                    utils.customAlert("픽업일자를 선택해주세요.");
                    return;
                }
                if (isNaN(inputs.return_prearnge_dt)) {
                    utils.customAlert("반납일자를 선택해주세요.");
                    return;
                }
                /*  if (isNaN(inputs.begin_dt)) {
                    utils.customAlert("시작시간을 선택해주세요.");
                    return;
                }
                if (isNaN(inputs.end_dt)) {
                    utils.customAlert("종료시간을 선택해주세요.");
                    return;
                } */
                if (inputs.dlvy_adres_nm === "") {
                    utils.customAlert("배송받을 주소를 입력해주세요.");
                    return;
                }
                if (inputs.adres_detail === "") {
                    utils.customAlert("상세주소를 입력해주세요.");
                    return;
                }
                /* if (inputs.dlvy_atent_matter === "") {
                    utils.customAlert("배송 요청사항을 입력해주세요.");
                    return;
                } */
                /* if (inputs.photogrf_concept === "") {
                    utils.customAlert("촬영컨셉을 입력해주세요.");
                    return;
                } */
                if (!inputs.celeb_list_yn && !inputs.model_list_yn) {
                    utils.customAlert("모델정보를 입력해주세요.");
                    return;
                }
                if (inputs.celeb_list_yn) {
                    let cnt = 0;
                    inputs.celeb_list.find((d) => d.trim() === "" && cnt++);
                    if (cnt > 0) {
                        utils.customAlert("[셀럽] 모델명을 입력해주세요.");
                        return;
                    }
                }
                if (inputs.model_list_yn) {
                    let cnt = 0;
                    inputs.model_list.find((d) => d.trim() === "" && cnt++);
                    if (cnt > 0) {
                        utils.customAlert("[패션 모델] 모델명을 입력해주세요.");
                        return;
                    }
                }
                 if ( inputs.other_paid_pictorial_content === "" && inputs.own_paid_pictorial_content === "" && inputs.none_paid_pictorial_content === "") {
                    utils.customAlert("유가 정보를 입력해주세요.");
                    return;
                }
                if (inputs.loc_yn && inputs.loc_value === "") {
                    utils.customAlert("로케 촬영지 정보를 입력해주세요.");
                    return;
                }
                /* if (inputs.page_cnt === "") {
                    utils.customAlert("페이지 수를 입력해주세요.");
                    return;
                } */
                setSampleRequest.mutate(inputs);
            },
            onCancel: () => {console.log('cancel')}
          });
    };

    const handleCancel = () => {
        history.replace("/magazine/digital_showroom");
    };

    const handleTemporarySave = (inputs) => {
        setTempDialog(!tempDialog);
        setTemporary(inputs);
    };

    const handleTemporarySaveConfirm = () => {
        localStorage.setItem("imsi", JSON.stringify(temporary));
        setTempDialog(false);
    };

    const handleTemporaryCancel = () => {
        setTempDialog(false);
    };

    const sampleRequestQuery = useQuery(["sample-request", brand_id, showroom_list],
        async () => await apiObject.addSampleRequest({brand_id,showroom_list,})
    );

    const data = sampleRequestQuery.isLoading ? [] : sampleRequestQuery.data;

    const setSampleRequest = useMutation(["set-sample-request"],(value) =>
        apiObject.setSampleRequest({
            brand_id: value.brand_id,
            duty_recpt_dt: value.duty_recpt_dt,
            photogrf_dt: value.photogrf_dt,
            photogrf_end_dt: value.photogrf_end_dt,
            begin_dt: value.begin_dt,
            end_dt: value.end_dt,
            return_prearnge_dt: value.return_prearnge_dt,
            photogrf_concept: value.photogrf_concept,
            model_list: value.model_list,
            celeb_list: value.celeb_list,
            own_paid_pictorial_content: value.own_paid_pictorial_content,
            other_paid_pictorial_content: value.other_paid_pictorial_content,
            page_cnt: value.page_cnt,
            etc_brand: value.etc_brand,
            today_connect: value.today_connect,
            add_req_cntent: value.add_req_cntent,
            dlvy_adres_no : value.dlvy_adres_no,    
            dlvy_adres_nm: value.dlvy_adres_nm,
            adres_detail: value.adres_detail,
            dlvy_atent_matter: value.dlvy_atent_matter,
            showroom_list: value.showroom_list,
            contact_user_id: value.contact_user_id,
            req_user_id: value.req_user_id,
            loc_yn: value.loc_yn,
            loc_value: value.loc_value,
        }),
        {
            onSuccess: () => {
                setisRegistOk(false)
                setTimeout(() => {
                    utils.customAlert("등록되었습니다.");
                    history.replace("/magazine/sample_requests");
                }, 200);
                
            },
            onError: () => {
                utils.customAlert("등록 중 오류가 발생했습니다.");
                return;
            },
        }
    );

    if (sampleRequestQuery.isLoading) {
        return <Progress type="load" />;
    }

    if (setSampleRequest.isLoading) {
        return <Progress type="upload" />;
    }



    return (
        <Container active={isdrawer}>
            <TitelWrap>
                <TitleTxt1>Sample</TitleTxt1>
                <TitleTxt2>Requests</TitleTxt2>
            </TitelWrap>

            <AddComponent
                data={data}
                brandId={brand_id}
                handleCancel={handleCancel}
                handleTemporarySave={handleTemporarySave}
                handleSubmit={handleSubmit}
            />

            <TemporarySaveDialog
                open={tempDialog}
                setOpen={setTempDialog}
                title="임시 저장"
                subTitle="기존 임시 저장 파일은 현재 내용으로 대체됩니다."
                handleConfirm={handleTemporarySaveConfirm}
                handleCancel={handleTemporaryCancel}
                cancelBtn = "아니요"
                confirmBtn = "네"
            />
        </Container>
    );
}
const Container = styled.div`  
  width:calc(100%-25px);  
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1200px" : "960px")};        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "600px")};    
  } 
`;

const TitelWrap = styled.div`
    margin-bottom: 30px;
    display : flex;
    width:calc(100%-25px);
    margin-left:25px;
`;

const TitleTxt1 = styled.div`
    font-size: ${Constants.titleFontSize};
    font-weight: 100;
    line-height: ${Constants.titleFontSize};
    margin-bottom: 10px;
    padding-right:10px;
`;

const TitleTxt2 = styled.div`
    font-size: ${Constants.titleFontSize};
    font-weight: bold;
    line-height: ${Constants.titleFontSize};
    margin-right: 40px;
`;
