import React, { useState } from "react";
import styled from "styled-components";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import Constants from 'utils/constants';
import { apiObject } from "api/api_stylist";
import Progress from "components/common/progress";
import AddComponent from "components/stylist/sample_requests/AddComponent";
import TemporarySaveDialog from "components/stylist/sample_requests/TemporarySaveDialog";

import utils from "utils";
import alertConfirm from 'react-alert-confirm';

export default function CreateRequestSample({ match }) {
  const history = useHistory();
  const brand_id = match.params.showroom_list.split("=")[0];
  const showroom_list = match.params.showroom_list.split("=")[1].split("+");
  const [tempDialog, setTempDialog] = useState(false);
    const [temporary, setTemporary] = useState("");

    const handleSubmit = (inputs) => {
      inputs.brand_id = brand_id;
      alertConfirm({
        title: Constants.appName,
        content: '샘플요청을 등록하시겠습니까?',
        onOk: () => {
          if (inputs.contact_user_id === "") {
            alert("연락받을 담당자를 선택해주세요.");
            return;
        }
        if (isNaN(inputs.photogrf_dt)) {
            alert("촬영일자를 선택해주세요.");
            return;
        }
        if (isNaN(inputs.duty_recpt_dt)) {
            alert("픽업일자를 선택해주세요.");
            return;
        }
        if (isNaN(inputs.return_prearnge_dt)) {
            alert("반납일자를 선택해주세요.");
            return;
        }
        if (isNaN(inputs.begin_dt)) {
            alert("시작시간을 선택해주세요.");
            return;
        }
        if (isNaN(inputs.end_dt)) {
            alert("종료시간을 선택해주세요.");
            return;
        }
        if (inputs.dlvy_adres_nm === "") {
            alert("배송받을 주소를 입력해주세요.");
            return;
        }
        if (inputs.adres_detail === "") {
            alert("상세주소를 입력해주세요.");
            return;
        }
        if (inputs.dlvy_atent_matter === "") {
            alert("배송 요청사항을 입력해주세요.");
            return;
        }
        if (inputs.photogrf_concept === "") {
            alert("촬영컨셉을 입력해주세요.");
            return;
        }
        if (!inputs.celeb_list_yn && !inputs.model_list_yn) {
            alert("모델정보를 입력해주세요.");
            return;
        }
        if (inputs.celeb_list_yn) {
            let cnt = 0;
            inputs.celeb_list.find((d) => d.trim() === "" && cnt++);
            if (cnt > 0) {
                alert("[셀럽] 모델명을 입력해주세요.");
                return;
            }
        }
        if (inputs.model_list_yn) {
            let cnt = 0;
            inputs.model_list.find((d) => d.trim() === "" && cnt++);
            if (cnt > 0) {
                alert("[패션 모델] 모델명을 입력해주세요.");
                return;
            }
        }
        if ( inputs.other_paid_pictorial_content === "" && inputs.own_paid_pictorial_content === "") {
            alert("유가화보 정보를 입력해주세요.");
            return;
        }
        if (inputs.loc_yn && inputs.loc_value === "") {
            alert("로케 촬영지 정보를 입력해주세요.");
            return;
        }
        if (inputs.page_cnt === "") {
            alert("페이지 수를 입력해주세요.");
            return;
        }
        setSampleRequest.mutate(inputs);
        },
        onCancel: () => {console.log('cancel')}
      });
      
  };

  const handleCancel = () => {
    history.replace("/stylist/digital_showroom");
  };

  const handleTemporarySave = (input) => {
    setTempDialog(!tempDialog);
    setTemporary(input);
};

const handleTemporarySaveConfirm = () => {
    localStorage.setItem("imsi", JSON.stringify(temporary));
    setTempDialog(false);
};

const handleTemporaryCancel = () => {
    setTempDialog(false);
};

  const sampleRequestQuery = useQuery(
    ["sample-request", brand_id, showroom_list],
    async () =>
      await apiObject.addSampleRequest({
        brand_id,
        showroom_list,
      })
  );

  const data = sampleRequestQuery.isLoading ? [] : sampleRequestQuery.data;

  const setSampleRequest = useMutation(
    ["set-sample-request"],
    (value) =>
      apiObject.setSampleRequest({
        brand_id: value.brand_id,
        duty_recpt_dt: value.duty_recpt_dt,
        photogrf_dt: value.photogrf_dt,
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
        loc_yn: value.loc_yn,
        loc_value: value.loc_value,
      }),
    {
      onSuccess: () => {
        alert("등록되었습니다.");
        history.replace("/stylist/sample_requests");
      },
      onError: () => {
        alert("등록 중 오류가 발생했습니다.");
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
    <>
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
      />
    </>
  );
}


const TitelWrap = styled.div`
  margin-bottom: 60px;
`;

const TitleTxt1 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: 100;
  line-height: ${Constants.titleFontSize};
  margin-bottom: 10px;
`;

const TitleTxt2 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-right: 40px;
`;
