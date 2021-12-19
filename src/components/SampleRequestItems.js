import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { useQuery,useMutation } from "react-query";
import dayjs from "dayjs";
import PlusIcon from "../assets/request_plus_icon.png";
import SampleRequestPreviewDialog from "./SampleRequestPreviewDialog";
import SampleRequestConfirmDialog from "./SampleRequestConfirmDialog";
import MessageDialog from "./MessageDialog";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";
import SelectDialog from "components/brand/scheduler/SelectDialog";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';

const Request = styled.div`
  width: 158px;
  height: 120px;
  padding: 14px;
  border-radius: 20px;
  background-color: #ffffff;
  position: relative;
  margin-right: 10px;
  margin-bottom: 10px;
`;

const CompanyLogo = styled.img`
  max-height: 24.5px;
  min-height: 24.5px;
  margin-bottom: 7px;
`;

const RequestPlusIcon = styled.img`
  position: absolute;
  top: -7px;
  right: 4px;
  z-index: 2;
`;

const RequestNm = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
`;

const RequestCompany = styled.div`
  font-size: 12px;
  color: #999999;
  margin-top: 5px;
  width: 132px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

function SampleRequestItems({ data, title, titleImg, showroomNo ,fetchNextPage }) {
  const [open, setOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [msgDialog, setMsgDialog] = useState(false);
  const [msg, setMsg] = useState("");
  const [isDuplicate, setDuplicate] = useState("");
  const [selectDialog, setselectDialog] = useState(false);

  const handleMainClick = useCallback(() => {
    setOpen(!open);
    setConfirmDialog(false);
  }, [open, confirmDialog]);

  const handleSubClick = () => {
    setConfirmDialog(!confirmDialog);
    setOpen(false);
  };

  const handleSelectConfirm = useCallback(async(data) => {
    await setDuplicate({...isDuplicate,data})
    setselectDialog(false);    
    setMsgDialog(true);    
  });

  const handleMsgDialogOpen = async() => {
    await setDuplicate("");

    const today = dayjs().format("YYYY-MM-DD");
    const shooting_dt = dayjs.unix(data.photogrf_dt).format("YYYY-MM-DD");
    console.log('showroomNo',showroomNo)
    let isDupCheck =  false;
    let isDupLookName = "";
    let strTarget_req_no = "";
    let strTarget_showroom_no = "";
    let strTarget_user_position = "";
    let strTarget_user_name = "";
    let strTarget_company_name = "";
    rdata.reservation_list.forEach((d2, i2) => {
      let targetShowroom = d2.showroom_no;
      console.log('targetShowroom',targetShowroom)
     
      if ( showroomNo === targetShowroom ) {
        if ( shooting_dt === d2.date_info[0]?.photogrf_dt) {      
          isDupCheck = true;
          isDupLookName = d2.date_info[0]?.showroom_nm;
          strTarget_req_no = d2.date_info[0]?.target_req_no;
          strTarget_showroom_no = d2.date_info[0]?.target_showroom_no;
          strTarget_user_position = d2.date_info[0]?.target_user_position;
          strTarget_user_name = d2.date_info[0]?.target_user_name;
          strTarget_company_name = d2.date_info[0]?.target_company_name;
          setDuplicate({
            target_req_no : strTarget_req_no,
            target_showroom_no : strTarget_showroom_no,
            target_user_name : strTarget_user_name,
            target_user_position : strTarget_user_position,
            target_company_name : strTarget_company_name
          })
        }
      }      
    }); 
    
    console.log('isDupCheck',isDupCheck)

    if ( isDupCheck ) {
      if (confirm( isDupLookName + "이(가) ["+strTarget_company_name + "]" + strTarget_user_name+ "에 승인된 정보가 있습니다. 그래도 승인하시겠습니까?")) {        
       
        if (dayjs(today).diff(shooting_dt, "day") > 0) {
         /*  if (confirm("이미 촬영일이 지난 요청입니다. 승인하시겠습니까?")) {
            setConfirmDialog(false);
            setselectDialog(true)
          } else {
            setConfirmDialog(false);
          } */
          alertConfirm({
            title: Constants.appName,
            content: '이미 촬영일이 지난 요청입니다. 승인하시겠습니까?',
            onOk: () => {
              setConfirmDialog(false);
              setselectDialog(true)
            },
            onCancel: () => {setConfirmDialog(false);}
          });

        } else {
          setConfirmDialog(false);
          setselectDialog(true)
        }
      }
      alertConfirm({
        title: Constants.appName,
        content: isDupLookName + "이(가) ["+strTarget_company_name + "]" + strTarget_user_name+ "에 승인된 정보가 있습니다. 그래도 승인하시겠습니까?",
        onOk: () => {
          if (dayjs(today).diff(shooting_dt, "day") > 0) {
            /* if (confirm("이미 촬영일이 지난 요청입니다. 승인하시겠습니까?")) {
              setConfirmDialog(false);
              setselectDialog(true)
            } else {
              setConfirmDialog(false);
            } */
            alertConfirm({
              title: Constants.appName,
              content: '이미 촬영일이 지난 요청입니다. 승인하시겠습니까?',
              onOk: () => {
                setConfirmDialog(false);
                setselectDialog(true)
              },
              onCancel: () => {setConfirmDialog(false);}
            });

          } else {
            setConfirmDialog(false);
            setselectDialog(true)
          }
        },
        onCancel: () => {console.log('cancle')}
      });
    }else{
      if (dayjs(today).diff(shooting_dt, "day") > 0) {
        alertConfirm({
          title: Constants.appName,
          content: '이미 촬영일이 지난 요청입니다. 승인하시겠습니까?',
          onOk: () => {
            setConfirmDialog(false);
            setMsgDialog(true);
          },
          onCancel: () => {
            setConfirmDialog(false);
          }
        });
        /*  if (confirm("이미 촬영일이 지난 요청입니다. 승인하시겠습니까?")) {
          setConfirmDialog(false);
          setMsgDialog(true);
        } else {
          setConfirmDialog(false);
        } */
      } else {
        setConfirmDialog(false);
        setMsgDialog(true);
      }
    }
  };

  const handleConfirm = () => {
    alertConfirm({
      title: Constants.appName,
      content: '요청을 승인하시겠습니까?',
      onOk: () => {
        setMsgDialog(false);   
        samepleConfirm.mutate({
          req_no: data.req_no,
          msg: msg,
          showroom_list: [showroomNo],
        });
      },
      onCancel: () => {console.log('cancel')}
    });
    /* if (confirm("요청을 승인하시겠습니까????")) {
      samepleConfirm.mutate({
        req_no: data.req_no,
        msg: msg,
        showroom_list: [showroomNo],
      });
    } */
  };

  const handleReject = () => {
    /* if (confirm("요청을 거절하시겠습니까?")) {
      samepleRefuse.mutate({
        req_no: data.req_no,
        showroom_list: [showroomNo],
      });
    } */
    alertConfirm({
      title: Constants.appName,
      content: '요청을 거절하시겠습니까?',
      onOk: () => {
        setMsgDialog(false);  
        samepleRefuse.mutate({
          req_no: data.req_no,
          showroom_list: [showroomNo],
        });
      },
      onCancel: () => {console.log('cancel')}
    });
  };

  const samepleConfirm = useMutation(
    (value) =>
      apiObject.setRequestConfirm({
        req_no: value.req_no,
        showroom_list: value.showroom_list,
        msg: value.msg === "" ? null : value.msg,
        isDuplicate : isDuplicate
      }),
    {
      onSuccess: () => {
        //utils.customAlert("승인 처리 되었습니다.");        
        alert("승인 처리 되었습니다.");
      },
      onError: () => {
        utils.customAlert("승인 처리중 오류가 발생했습니다.");        
      },
    }
  );

  const samepleRefuse = useMutation(
    (value) =>
      apiObject.setRequestRefuse({
        req_no: value.req_no,
        showroom_list: value.showroom_list,
      }),
      {
      onSuccess: () => {        
        //utils.customAlert("거절 처리 되었습니다.");
        alert("거절 처리 되었습니다.");
        
      },
      onError: () => {
        utils.customAlert("거절 처리중 오류가 발생했습니다.");
        
      },
      }
  );

  const query = useQuery(
    ["showroom-request-reservation", data.req_no],
    async () =>
      await apiObject.getRequestsReservation({
        req_no: data.req_no,
      })
  );

  const rdata = query.isLoading ? [] : utils.isEmpty(query.data) ? [] :query.data;  
  //console.log('rdata',rdata)

  if (query.isLoading) {
    return <Progress type="load" />;
  }

  if (samepleConfirm.isLoading) {
    return <Progress type="upload" />;
  }

  if (samepleRefuse.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      <div style={{ position: "relative" }}>
        <Request onClick={handleMainClick}>
          <CompanyLogo src={data.compy_logo_adres} alt={data.company} />
          <RequestNm>
            {data.req_user_nm} {data.req_user_posi}
          </RequestNm>
          <RequestCompany>
            {data.compy_nm} &#183;{" "}
            {data.celeb_list.length > 0
              ? data.celeb_list[0]
              : data.model_list[0]}{" "}
            {data.celeb_list.length > 0 ? "C" : "M"}
          </RequestCompany>
        </Request>
        <RequestPlusIcon src={PlusIcon} alt="" onClick={handleSubClick} />
        <SampleRequestPreviewDialog open={open} setOpen={setOpen} data={data} />
        <SampleRequestConfirmDialog
          open={confirmDialog}
          setOpen={setConfirmDialog}
          data={data}
          title={title}
          titleImg={titleImg}
          handleConfirm={handleMsgDialogOpen}
          handleReject={handleReject}
        />
        <MessageDialog
          open={msgDialog}
          setOpen={setMsgDialog}
          input={msg}
          setInput={setMsg}
          handleConfirm={handleConfirm}
        />
        <SelectDialog
          open={selectDialog}
          nowRequester={data}
          nowReqNo={data.req_no}
          oldRequester={isDuplicate}
          setOpen={setselectDialog}        
          handleConfirm={handleSelectConfirm}
        />
      </div>
    </>
  );
}

export default React.memo(SampleRequestItems);
