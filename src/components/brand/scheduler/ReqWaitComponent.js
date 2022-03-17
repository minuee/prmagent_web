import React, { useState, useCallback } from "react";
import styled, { css } from "styled-components";
import AddIcon from "assets/scheduler/add_icon.svg";
import CloseIcon from "assets/scheduler/closeBtnIcon.svg";
import BoxAddIcon from "assets/scheduler/addIcon.svg";
import ConfirmDialog from "./ConfirmDialogNew";
import { useMutation, useQueryClient,useQuery } from "react-query";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
import moment from "moment";
import dayjs from "dayjs";
import _ from "lodash";
import utils from "utils";

function ReqWaitComponent({ data, idx, startDt, endDt, season, gender }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDuplicate, setDuplicate] = useState("");
  const [inputs, setInputs] = useState({
    req_no: null,
    showroom_no: null,
    msg: null,
  });
  console.log('inputsinputs',inputs)
  const requestConfirm = useMutation(
    () =>
      apiObject.setRequestConfirm({
        req_no: inputs.req_no,
        showroom_list: [`${inputs.showroom_no}`],
        msg: inputs.msg,
        isDuplicate : isDuplicate
      }),
    {
      onSuccess: () => {        
        queryClient.invalidateQueries([
          "brand",
          "scheduler",
          moment(startDt).unix(),
          moment(endDt).unix,
          season.season_year,
          season.season_cd_id,
          gender === 0 ? null : gender,
        ]);
        window.alert("승인 되었습니다.");
        setOpen(false);
        setDialogOpen(false);
      },
      onError: () => {
        utils.customAlert("처리 중 오류가 발생했습니다.");
        setDialogOpen(false);
      },
    }
  );

  const requestRefuse = useMutation(
    () =>
      apiObject.setRequestRefuse({
        req_no: inputs.req_no,
        showroom_list: [`${inputs.showroom_no}`],
        msg: inputs.msg,
      }),
    {
      onSuccess: () => {
        //utils.customAlert("거부 처리되었습니다.");
        queryClient.invalidateQueries([
          "brand",
          "scheduler",
          moment(startDt).unix(),
          moment(endDt).unix,
          season.season_year,
          season.season_cd_id,
          gender === 0 ? null : gender,
        ]);
        setOpen(false);
        setDialogOpen(false);
        window.alert("거부 처리되었습니다.");
      },
      onError: () => {
        utils.customAlert("처리 중 오류가 발생했습니다.");
        setDialogOpen(false);
      },
    }
  );

  const handleConfirmDailogOpen = useCallback(
    (req_no, showroom_no, d,idx) => {
      setDialogOpen(true);
      setInputs({ ...inputs, req_no: req_no, showroom_no: [`${showroom_no}`] });
    },
    [dialogOpen, inputs]
  );

  const handleSubmit = useCallback(async(type) => {
    if (type === "confirm") {
      requestConfirm.mutate();
    } else if (type === "refuse") {
      requestRefuse.mutate();
    } else {
      console.log("Wrong type...");
    }
  });
  
  const query = useQuery(
    ["showroom-request-reservation", data[0].req_no],
    async () =>
      await apiObject.getRequestsReservation({
        req_no: data[0].req_no,
      })
  );

  const rdata = query.isLoading ? [] : utils.isEmpty(query.data) ? [] :query.data;  

  if (query.isLoading) {
    return <Progress type="load" />;
  }
  
  if (requestConfirm.isLoading || requestRefuse.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      <Container>
        <img src={AddIcon} alt="" onClick={() => setOpen(!open)} />
        {/* {data.length > 1 && (
          <AddIconNum onClick={() => setOpen(!open)}>{data.length}</AddIconNum>
        )} */}
        {_.filter(data, { from: idx }).length > 1 && (
          <AddIconNum onClick={() => setOpen(!open)}>
            {_.filter(data, { from: idx }).length}
          </AddIconNum>
        )}
        {open && (
          <Popup position={idx < 5 ? "right" : "left"}>
            {idx < 5 && <Triangle position="left" />}
            <Contents>
              <ContentsHead>
                <div className="title">Requests</div>
                <Title onClick={() => setOpen(false)}>
                  Close
                  <img src={CloseIcon} alt="" />
                </Title>
              </ContentsHead>
              <ContentsBody>
                {_.filter(data, { from: idx }).map((d) => (
                  <ContentsBox key={d.req_no}>
                    <img className="logo" src={d.mgzn_logo_adres} alt="" />
                    <div className="reqNm">{d.req_user_nm}</div>
                    <div className="mgzn">{d.company_name}</div>
                    <img
                      className="confirm"
                      src={BoxAddIcon}
                      alt=""
                      onClick={() =>
                        handleConfirmDailogOpen(d.req_no, d.showroom_no,d,idx)
                      }
                    />
                  </ContentsBox>
                ))}
              </ContentsBody>
            </Contents>
            {idx >= 5 && <Triangle position="right" />}
          </Popup>
        )}
      </Container>

      <ConfirmDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        inputs={inputs}
        rdata={rdata}
        data={data}
        setInputs={setInputs}
        handleConfirm={handleSubmit}
        isDuplicate={isDuplicate}
        setDuplicate={setDuplicate}        
      />
    </>
  );
}

const Container = styled.div`
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 184px;
  height: 197px;
  position: relative;
  
  > img {
    width: 56px;
    height: 56px;
    cursor: pointer;
  }
`;

const AddIconNum = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  background-color: #7ea1b2;
  border-radius: 50%;
  top: 65px;
  right: 60px;
`;

const Popup = styled.div`
  position: absolute;
  display: flex;
  width: 400px;
  height: 340px;
  ${(props) =>
    props.position === "right"
      ? css`
          left: 120px;
        `
      : css`
          right: 120px;
        `}
  align-items: center;
`;

const Triangle = styled.div`
  width: 0;
  height: 0;
  ${(props) =>
    props.position === "left"
      ? css`
          border-bottom: 10px solid transparent;
          border-left: 10px solid transparent;
          border-right: 10px solid #000000;
          border-top: 10px solid transparent;
        `
      : css`
          border-bottom: 10px solid transparent;
          border-left: 10px solid #000000;
          border-right: 10px solid transparent;
          border-top: 10px solid transparent;
        `}
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 380px;
  height: 100%;
  border-radius: 10px;
  background-color: #000000;
  z-index: 10;
`;

const ContentsHead = styled.div`
  width: 100%;
  height: 40px;
  padding: 10px 15px 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  > img {
    margin-left: 5px;
  }
`;

const ContentsBody = styled.div`
  width: 100%;
  height: 338px;
  overflow: auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20px;
`;

const ContentsBox = styled.div`
  width: 160px;
  height: 120px;
  background-color: #ffffff;
  padding: 14px;
  border-radius: 20px;
  margin-bottom: 10px;
  position: relative;

  .logo {
    max-height: 25px;
    max-width: 120px;
    margin-bottom: 12px;
  }
  .reqNm {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .mgzn {
    font-size: 12px;
    color: #999999;
  }
  .confirm {
    position: absolute;
    top: -7px;
    right: -7px;
    cursor: pointer;
  }
`;

export default React.memo(ReqWaitComponent);
