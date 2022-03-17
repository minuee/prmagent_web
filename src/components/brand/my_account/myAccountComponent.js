import React, { useState,useEffect } from "react";
import styled, { css } from "styled-components";
import {TextField,Divider,Button,Box,makeStyles,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,} from "@material-ui/core";
import { darken } from "polished";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Auth, AuthType } from "@psyrenpark/auth";
import isImageUrl from "is-image-url";

import Progress from "components/common/progress";
import UploadIcon from "assets/upload_icon.png";
import CameraIcon from "assets/camera_icon.svg";
import SelectBox from "components/SelectBox2";
import AddressDialog from "components/AddressDialog";
import { apiObject as apiCommon } from "api/api_common";
import { apiObject } from "api/api_brand";
import { Fragment } from "react";
import dayjs from "dayjs";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { ReactComponent as rightChevron } from "assets/right_chevron.svg";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';

const RightChevron = styled(rightChevron)`
  transform: rotate(-90deg);
  margin-left: 4px;
`;
const Container = styled.div`
  display: flex;
  margin-bottom: 80px;
  justify-content: center;
  width:calc(100%-25px);
  margin-left:25px;
  
  padding-left: ${(props) => (props.active ? "100px" : "10px")};  
`;
const AccountWrap = styled.div`  
  width : 100%;
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
`;
const StyleDivider = styled(Divider)`
  height: 2px;
  background-color: #dddddd;
  margin: 16px 0 40px 0;
`;
const InputWrap = styled.div`
  display: flex;
  
`;
const SelectBoxWrap = styled.div`
  width : 100%; 
  margin-right:20px;

  @media (min-width: 1920px) {    
    max-width : 370px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    max-width : 370px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    margin-bottom:20px;
  } 
  
`;
const ImgWrap = styled.div`
 
  @media (min-width: 1920px) {
    width: 150px;
    height: 150px;    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 150px;
    height: 150px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "200px" : "150px")};
    height: ${(props) => (props.active ? "200px" : "150px")};
    margin-left: ${(props) => (props.active ? "50px" : "0px")};    
  } 
`;
const RightWrap = styled.div`
  width: calc(100% - 220px);
  margin-left:50px;
`;
const ImgDiv = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border: solid 2px #dddddd;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #999999;
  font-size: 16px;
  font-weight: 500;

  img {
    margin-bottom: 10px;
  }

  input {
    display: none;
  }

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    width: 150px;
    height: 150px;
  }
`;
const Camera = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const InputDiv = styled.div`  
  display: flex;
  align-items: center;
  margin-bottom: 20px;  
`;

const InputDiv2 = styled.div`
  align-items: center;
  @media (min-width: 1920px) {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;  
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;  
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    display: relative
    justify-content: center;
    margin-bottom: 20px;  
  } 
`;
const InputDiv4 = styled.div`
  @media (min-width: 1920px) {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;  
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;  
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    display: relative
    justify-content: center;
    margin-bottom: 20px;  
  } 
`;
const InputDiv3 = styled.div`
  @media (min-width: 1920px) {
    width:100%;
    margin-bottom: 20px;  
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width:100%;
    margin-bottom: 20px;  
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "100%" : "100%")};
  } 
`;
const StyleTextField = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 13px 14px;
    border-radius: 0;
  }
  .MuiInputBase-root {
    @media (min-width: 1920px) {
      width: 800px;
    }
    @media (min-width: 1440px) and (max-width: 1919px) {
      width: 800px;
    }
    @media (min-width: 10px) and (max-width: 1439px) {
      width: ${(props) => (props.active ? "470px" : "370px")};
    } 
    height: 36px;
    border-radius: 0px;
  }

  .MuiInputBase-root.Mui-disabled {
    font-size: 14px;
    font-weight: 500;
    color: #000000;
  }

  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }

  margin-right: 20px;
`;
const StyleTextField2 = styled(TextField)`
  @media (min-width: 1920px) {
    width: 370px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 370px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    
    width: ${(props) => (props.active ? "470px" : "370px")};
  } 
  margin-right:20px;
  .MuiOutlinedInput-input {
    padding: 13px 14px;
    border-radius: 0;
  }
  .MuiInputBase-root {
    @media (min-width: 1920px) {
      width: 370px;
    }
    @media (min-width: 1440px) and (max-width: 1919px) {
      width: 370px;
    }
    @media (min-width: 10px) and (max-width: 1439px) {
      margin-bottom: 20px;
      width: ${(props) => (props.active ? "470px" : "370px")};
    } 
    height: 36px;
    border-radius: 0px;
  }

  .MuiInputBase-root.Mui-disabled {
    font-size: 14px;
    font-weight: 500;
    color: #000000;
  }

  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }

  .MuiInputBase-input.Mui-disabled {
    color: #999999;
  }
`;
const StyleTextField3 = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 13px 14px;
    border-radius: 0;
  }
  .MuiInputBase-root {    
    @media (min-width: 1920px) {
      width: 702px;margin-right: 20px;
    }
    @media (min-width: 1440px) and (max-width: 1919px) {
      width: 702px;margin-right: 20px;
    }
    @media (min-width: 10px) and (max-width: 1439px) {
      width: ${(props) => (props.active ? "370px" : "270px")};
    } 
    height: 36px;
    border-radius: 0px;
  }

  .MuiInputBase-root.Mui-disabled {
    font-size: 14px;
    font-weight: 500;
    color: #000000;
  }

  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }

  
`;
const AddressButton = styled.div`
  min-width: 100px;
  height: 36px;
  background-color: #7ea1b2;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
`;
const SubDivTitle = styled.div`
  display: flex;
  align-items: top;
  justify-content: flex-start;
  margin-bottom:10px;
  width: 100%;
  
  & + & {
    margin-bottom: 24px;
  }
`;
const SubDiv = styled.div`
  display: flex;
  align-items: top;
  justify-content: flex-start;
  width: 100%;
  & + & {
    margin-bottom: 24px;
  }
`;
const SubText = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: bold;
  color: #222222;
  margin-right: 70px;

  .opt {
    font-weight: 500;
    margin-left:10px;
  }
`;
const SubDateDiv = styled.div`
  display: flex;
  color: #555555;
  font-size: 14px;
  align-items: flex-end;

  .dt {
    font-size: 14px;
    font-weight: 500;
    color: #222222;
    margin-left: 5px;
  }
`;


const ButtonNoWrap = styled.div`
  width:100%;
  display: flex;  
  align-items:center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  
`;

const BoxWrap = styled.div`  
  display: flex;  
  align-items:flex-end;
  justify-content: flex-start;  
  margin-top:20px;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 60px;
  margin-right: 30px;
  @media (min-width: 1920px) {
    margin-right: 30px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    margin-right: 30px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    margin-right: ${(props) => (props.active ? "100px" : "30px")};    
  } 
  div {
    width: 300px;
    height: 50px;
    color: #ffffff;
    font-size: 20px;
    font-weight: 500;
    background-color: #7ea1b2;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: ${darken(0.1, "#7ea1b2")};
    }
    &:active {
      background-color: ${darken(0.2, "#7ea1b2")};
    }
  }
`;
const Profile = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}") no-repeat center;
          background-size: cover;
        `
      : css`
          background: url(/images/noimage/noimg_profile.svg) no-repeat center;
          background-size: contain;
        `}
`;
const billingLogic = async ({subscript_type = "MONTH",buyer_email = "",buyer_name = "",buyer_tel = "",buyer_addr = "",buyer_postcode = "",successCallback = () => {},}) => {
  const IMP = window.IMP; // 생략해도 괜찮습니다.
  IMP.init("imp52519973"); //가맹점 초기화 imp52519973 imp40696986
  // customer_uid와 merchant_uid 발급받음
  //INSERT.CUSTOMER.UUID
  try {
    const response = await apiObject.postBillingsBefore({ subscript_type });

    if (response.success && !response.already_paid) {
      const merchant_uid = response.merchant_uid; //주문번호
      const customer_uid = response.customer_uid; //고객번호
      IMP.request_pay(
        {
          // param
          pg: "html5_inicis",
          pay_method: "card", // "card"만 지원됩니다
          merchant_uid, // 빌링키 발급용 주문번호
          customer_uid, // 카드(빌링키)와 1:1로 대응하는 값
          name: "최초인증결제",
          amount: 0, // 0 으로 설정하여 빌링키 발급만 진행합니다.
          buyer_email,
          buyer_name,
          buyer_tel,
          buyer_addr,
          buyer_postcode,
        },
        async function (response) {
          if (response.success) {
            await apiObject.postBillings({ customer_uid });
            successCallback();
            utils.customAlert("결제 성공");
          } else {
            console.error('error3333',JSON.stringify(response));
            utils.customAlert("결제를 취소하였습니다.");
          }
        }
      );
    } else {
      utils.customAlert("주문번호 발급 실패");
      return;
    }
  } catch (error) {
    console.error('error2122',error);
  }
};

const useStyles = makeStyles((theme) => ({
  toggleBtnRoot: {
    borderRadius: 0,
    boxSizing: "border-box",
    border: "solid 2px #dddddd",
    width: 190,
    "&:not(:first-child)": {
      marginLeft: theme.spacing(2),
      border: "solid 2px #dddddd",
    },
  },
  selectedToggleBtn: {
    border: "solid 2px #7ea1b2",
    backgroundColor: "white",
    "&:not(:first-child)": {
      border: "solid 2px #7ea1b2",
    },
  },
  toggleBtnLabel: {
    display: "flex",
    flexDirection: "column",
  },
  cancelBtnWrap : {
    marginLeft: "22px",color: "#7ea1b2",fontSize: 14,fontWeight: "bold",textDecoration: "underline",transform: "translateY(8px)"
  },
  cancelBtn: {
    color: "#7ea1b2",
    fontSize: 14,
    fontWeight: "bold",
  },
  dialogPaper: {
    minWidth: 600,
  },
  diabledBtnRoot: {
    color: "white !important",
  },
}));

export default function MyAccountComponent({ data, position }) {
  const size = { width: window.innerWidth || document.body.clientWidth, height: window.innerHeight || document.body.clientHeight };
  
  const [windowWidth, setWindowWidth] = useState(size.width);
  const updateWindowDimensions = () => {
    const size2 = { width: window.innerWidth || document.body.clientWidth, height: window.innerHeight || document.body.clientHeight };
    setWindowWidth(size2.width);    
  };

  let nowDate = new Date();
  const classes = useStyles();
  const [billingChangeDialog, setBillingChangeDialog] = useState(false);
  const [billingCancelDialogOpen, setBillingCancelDialogOpen] = useState(false);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const changeBilling = useMutation(
    (value) => apiObject.postBillingsChange({ subscript_type: value }),
    {
      onSettled: () => queryClient.invalidateQueries(["brand-myinfo"]),
    }
  );

  const cancelBilling = useMutation((value) => apiObject.postBillingsCancel(value), {
    onSettled: () => {
      queryClient.invalidateQueries(["brand-myinfo"]);
      setBillingCancelDialogOpen(false);
    },
  });
  const [inputs, setInputs] = useState({
    name: data.brand_user_nm,
    company: data.brand_id,
    company_nm: data.brand_nm,
    position: data.user_position_id,
    email: data.email_adres,
    phone_no: data.phone_no,
    oldPassword: "",
    newPassword: "",
    newPasswordCheck: "",
    address: data.adres,
    address_more: data.adres_detail,
    post_no: data.post_no,
    team: data.teammate_id || "",
  });
  const [profileImg, setProfileImg] = useState({
    img_full_url: isImageUrl(data.img_full_path) ? data.img_full_path : null,
    img_url_adres: data.img_url_adres,
    file: null,
  });
  const [subCheck, setSubCheck] = useState(data.next_subscr_type || "");
  const [address, setAddress] = useState(false);
  const queryClient = useQueryClient();

  const handleImgUpload = ({ target }) => {
    const name = target.accept.includes("image/png") ? "images" : "noImage";
    const name2 = target.accept.includes("image/jpeg") ? "images" : "noImage";
    const name3 = target.accept.includes("image/jpg") ? "images" : "noImage";
    let img = new Image();
    img.src = URL.createObjectURL(target.files[0]);
    img.onload = function () {
      if (name === "images" || name2 === "images" || name3 === "images") {
        setProfileImg({
          img_full_url: URL.createObjectURL(target.files[0]),
          file: target.files[0],
        });
      } else {
        console.log("No Image file...");
      }
    };
  };

  const handleChangeSelectBox = (name, data) => {
    setInputs({ ...inputs, [name]: data });
  };

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSaveClick = () => {
    alertConfirm({
      title: Constants.appName,
      content: '사용자 정보를 수정하시겠습니까?',
      onOk: () => {
        if ( inputs.oldPassword === "" && inputs.newPassword === "" && inputs.newPasswordCheck === "" ) {
          editMyAccount.mutate({
            user_nm: inputs.name,
            post_no: inputs.post_no,
            adres: inputs.address,
            adres_detail: inputs.address_more,
            brand_pos_cd: inputs.position,
            phone_no: inputs.phone_no,
            team_user_id: inputs.team,
            file: profileImg.file,
            img_url: profileImg.img_url_adres,
          });
        } else {
          if (inputs.newPassword !== inputs.newPasswordCheck) {
            utils.customAlert("비밀번호를 확인해 주세요.");
            return;
          } else changePasswordFunction();
        }
      },
      onCancel: () => {console.log('cancel')}
    });
  };

  const changePasswordFunction = async () => {
    Auth.changePasswordProcess(
      {
        // 만약 화면 이동을 하였다면 이 변수는 이전화면에서 가져와야할 필요가 있다. (라우팅 porps,redux, context등을 이용)
        email: inputs.email,
        oldPassword: inputs.oldPassword,
        newPassword: inputs.newPassword,
        authType: AuthType.EMAIL,
      },
      async () => {
        // 성공처리
        // 정상적으로 패스워드 변경
        // 로그아웃 시켜 로그인 화면으로 이동시키는 편이 좋음
        editMyAccount.mutate({
          user_nm: inputs.name,
          post_no: inputs.post_no,
          adres: inputs.address,
          adres_detail: inputs.address_more,
          brand_pos_cd: inputs.position,
          phone_no: inputs.phone_no,
          team_user_id: inputs.team,
          file: profileImg.file,
          img_url: profileImg.img_url_adres,
        });
      },
      (error) => {
        // 실패처리
        utils.customAlert("비밀번호 변경중 오류가 발생했습니다. : ", error);
      }
    );
  };

  const editMyAccount = useMutation(
    (value) =>
      apiObject.setMyProfile(
        {
          user_nm: value.user_nm,
          post_no: value.post_no,
          adres: value.adres,
          adres_detail: value.adres_detail,
          brand_pos_cd: value.brand_pos_cd,
          phone_no: value.phone_no,
          team_user_id: value.team_user_id,
          file: value.file,
          img_url: value.img_url,
        },
        () => {}
      ),
    {
      onSuccess: () => {
        utils.customAlert("수정되었습니다.");
        setInputs({
          ...inputs,
          oldPassword: "",
          newPassword: "",
          newPasswordCheck: "",
        });
      },
      onError: () => {
        utils.customAlert("수정 중 오류가 발생했습니다.");
      },
      onSettled: () => {
        queryClient.invalidateQueries(["brand-myinfo"]);
      },
    }
  );

  // 팀원 검색
  const teamSearchQuery = useQuery(
    ["brand-team-search", inputs.company],
    async () =>
      await apiCommon.getSearchTeamMember({
        search_type: "BRAND",
        brand_id: inputs.company,
      })
  );

  const team_options = teamSearchQuery.isLoading
    ? []
    : teamSearchQuery.data.list.map((item) => ({
        label: item.user_nm + " " + item.position,
        value: item.user_id,
      }));

  if (teamSearchQuery.isLoading) {
    return <Progress type="load" />;
  }

  if (editMyAccount.isLoading) {
    return <Progress type="upload" />;
  }

  // useEffect(() => {

  //   return () => {};
  // }, [subCheck]);
  const handleSubcheck = (event, newPayType) => {
    // if (newPayType !== null) {
    //   setSubCheck(newPayType);
    // }
    /* if (data.subscription_canceled && !data.subscription_ended) {
      utils.customAlert("구독 만료 후 재신청 가능합니다.");
    } else if (!data.subscr_yn) {
      setSubCheck(newPayType);
    } else if (newPayType !== null && newPayType !== subCheck) {
      utils.customAlert("구독 취소 후 변경 가능합니다.");
    } */
    setSubCheck(newPayType);
  };

  const handleDialogClose = () => {
    setBillingChangeDialog(false);
    setBillingCancelDialogOpen(false);
  };

  const cancelSubscription = (e) => {
    e.preventDefault();
    setBillingCancelDialogOpen(true);
  };

  const handleBillingBtnFree = () => {
    console.log('subCheck',subCheck)
    if ( subCheck == '' ) {
      utils.customAlert('먼저 구독하기 옵션(Monthly OR Yearly)를 선택해주세요');
      return;
    }else{
      if (data.subscr_yn) {
        alertConfirm({
          title: Constants.appName,
          content: '현재 구독중입니다만 갱신하여 구독신청하시겠습니까?',
          onOk: () => {
            billingLogic({
              subscript_type: subCheck,
              buyer_email: data.email_adres,
              buyer_name: data.brand_user_nm,
              buyer_tel: data.phone_no,
              buyer_addr: `${data.adres} ${data.adres_detail}`,
              buyer_postcode: data.post_no,
              successCallback: () => queryClient.invalidateQueries(["brand-myinfo"]),
            });
            
          },
          onCancel: () => {console.log('cancel')}
        });
      } else {
        billingLogic({
          subscript_type: subCheck,
          buyer_email: data.email_adres,
          buyer_name: data.brand_user_nm,
          buyer_tel: data.phone_no,
          buyer_addr: `${data.adres} ${data.adres_detail}`,
          buyer_postcode: data.post_no,
          successCallback: () => queryClient.invalidateQueries(["brand-myinfo"]),
        });
      }
    }
  };

  const handleBillingBtn = () => {
    if (data.subscr_yn) {
      setBillingChangeDialog(true);
    } else {
      billingLogic({
        subscript_type: "MONTH",
        buyer_email: data.email_adres,
        buyer_name: data.brand_user_nm,
        buyer_tel: data.phone_no,
        buyer_addr: `${data.adres} ${data.adres_detail}`,
        buyer_postcode: data.post_no,
        successCallback: () => queryClient.invalidateQueries(["brand-myinfo"]),
      });
    }
  };

  console.log('ddd',data)

  return (
    <>
      <Container active={isdrawer}>
        <AccountWrap active={isdrawer}>
          <Title>My Account</Title>
          <StyleDivider />
          <InputWrap  active={isdrawer}>
            <ImgWrap active={isdrawer}>
              <ImgDiv>
                <input
                  //accept="image/jpg"
                  accept="image/gif, image/jpeg,image/jpg, image/png"
                  id="my_profile"
                  name="profile"
                  type="file"
                  onChange={handleImgUpload}
                />
                <label htmlFor="my_profile">
                  {profileImg === null || profileImg === "" ? (
                    <>
                      <img src={UploadIcon} alt="upload" />
                      <div>Upload</div>
                      <div>Profile</div>
                      <div>Image</div>
                      <Camera>
                        <img src={CameraIcon} />
                      </Camera>
                    </>
                  ) : (
                    <Profile imgUrl={profileImg.img_full_url} />
                  )}
                </label>
              </ImgDiv>
            </ImgWrap>
            <RightWrap active={isdrawer}>
              <InputDiv active={isdrawer}>
                <StyleTextField
                  variant="outlined"
                  value={inputs.name}
                  placeholder="Name"
                  name="name"
                  onChange={handleChange}
                  active={isdrawer}
                />
              </InputDiv>
              <InputDiv4 active={isdrawer}>
                <SelectBoxWrap active={isdrawer}>
                  <SelectBox
                    width="370px"
                    height="37px"
                    text="Position"
                    value={inputs.position}
                    name="position"
                    handleChange={handleChangeSelectBox}
                    options={position}
                    isdrawer={isdrawer}
                    addWidth={"370px"}
                  />
                </SelectBoxWrap>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.company_nm}
                  placeholder="Company"
                  name="company"
                  disabled
                  active={isdrawer}
                />                
              </InputDiv4>
              <InputDiv2 active={isdrawer}>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.email}
                  placeholder="E-mail"
                  name="email"
                  onChange={handleChange}
                  readOnly
                  disabled
                  active={isdrawer}
                />
                <StyleTextField2
                  variant="outlined"
                  value={inputs.oldPassword}
                  placeholder="현재 비밀번호"
                  type="password"
                  name="oldPassword"
                  onChange={handleChange}
                  active={isdrawer}
                />
              </InputDiv2>
              <InputDiv2 active={isdrawer}>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.newPassword}
                  placeholder="새 비밀번호"
                  type="password"
                  name="newPassword"
                  onChange={handleChange}
                  active={isdrawer}
                />
                <StyleTextField2
                  variant="outlined"
                  value={inputs.newPasswordCheck}
                  placeholder="새 비밀번호 확인"
                  type="password"
                  name="newPasswordCheck"
                  onChange={handleChange}
                  active={isdrawer}
                />
              </InputDiv2>
              <InputDiv
                style={{ marginBottom: "10px" }}
                onClick={() => setAddress(true)}
              >
                <StyleTextField3
                  variant="outlined"
                  placeholder="My Address"
                  value={inputs.address}
                  name="adres"
                  onChange={handleChange}
                  readOnly
                  active={isdrawer}
                />
                <AddressButton>우편번호</AddressButton>
              </InputDiv>
              <InputDiv>
                <StyleTextField
                  variant="outlined"
                  value={inputs.address_more}
                  name="address_more"
                  onChange={handleChange}
                  active={isdrawer}
                />
              </InputDiv>
              <InputDiv active={isdrawer}>
                <SelectBox
                  width="370px"
                  height="37px"
                  text="지정된 팀원이 없습니다."
                  value={inputs.team}
                  name="team"
                  handleChange={handleChangeSelectBox}
                  options={team_options}
                  isdrawer={isdrawer}
                  addWidth={"470px"}
                />
              </InputDiv>
              <SubDivTitle active={isdrawer}>
                <SubText>
                  구독하기
                  { data.subscr_type === "TRIAL" &&
                      <div className="opt">
                        (무료 이용중)
                      </div>
                    }
                </SubText>
              </SubDivTitle>
              <SubDiv active={isdrawer}>
                <Box dispaly="flex">
                  <Box display="flex" mb={2.5}>
                    <ToggleButtonGroup
                      value={subCheck}
                      exclusive
                      onChange={handleSubcheck}
                      aria-label="payment-type"
                    >
                      <ToggleButton
                        classes={{
                          root: classes.toggleBtnRoot,
                          selected: classes.selectedToggleBtn,
                          label: classes.toggleBtnLabel,
                        }}
                        value="MONTH"
                        aria-label="Monthly"
                      >
                        <Box color="#000" fontSize={20} fontWeight="bold">
                          Monthly
                        </Box>
                        <Box color="#000" fontSize={16} fontWeight="normal">
                        {Constants.monthlyPrice}만원/월
                        </Box>
                      </ToggleButton>
                      <ToggleButton
                        classes={{
                          root: classes.toggleBtnRoot,
                          selected: classes.selectedToggleBtn,
                          label: classes.toggleBtnLabel,
                        }}
                        value="YEAR"
                        aria-label="Yearly"
                      >
                        <Box color="#000" fontSize={20} fontWeight="bold">
                          Yearly
                        </Box>
                        <Box color="#000" fontSize={16} fontWeight="normal">
                          {Constants.yearPrice}만원/연(월{Constants.yearPrice/12}만원)
                        </Box>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                  {( data.subscr_end_dt > parseInt(dayjs(nowDate).unix())  && data.subscr_yn && data.subscription_canceled == false ) ?
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    disableElevation
                    onClick={handleBillingBtnFree}
                    classes={{disabled: classes.diabledBtnRoot}}
                  >
                    구독신청하기
                    <RightChevron />
                  </Button>
                  :
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    disableElevation
                    disabled={ (data.subscr_type === "TRIAL" &&!data.next_subscr_type) || (data.subscr_yn && subCheck === data.next_subscr_type) || subCheck === ""}
                    onClick={handleBillingBtn}
                    classes={{disabled: classes.diabledBtnRoot}}
                  >
                    {data.trial_subscr_available
                      ? "Subscribe after a 3-month free trial"
                      : "구독하기 "}
                    <RightChevron />
                  </Button>
                  }
                  {/* <Button
                    onClick={() => billingLogic({
                      subscript_type: "MONTH",
                      buyer_email: data.email_adres,
                      buyer_name: data.brand_user_nm,
                      buyer_tel: data.phone_no,
                      buyer_addr: `${data.adres} ${data.adres_detail}`,
                      buyer_postcode: data.post_no,
                      successCallback: () => queryClient.invalidateQueries(["brand-myinfo"]),
                    })}
                    color="primary"
                    autoFocus
                  >구독</Button> */}
                </Box>
              </SubDiv>
              {data.subscr_yn ? (
                <BoxWrap>
                  <div>
                    <SubDateDiv active={isdrawer}>
                      <div>구독시작일 : </div>
                      <div className="dt">
                        {dayjs.unix(data.subscr_begin_dt).format("YYYY-MM-DD") || ""}
                      </div>
                    </SubDateDiv>
                    <Box mb={1.5}></Box>
                    <SubDateDiv active={isdrawer}>
                      <div>구독만료일 : </div>
                      <div className="dt">
                        {dayjs.unix(data.subscr_end_dt).format("YYYY-MM-DD") || ""}
                      </div>
                      { data.subscription_canceled &&
                      <div>
                        (구독결제취소완료 {dayjs.unix(data.subscr_canc_dt).format("YYYY-MM-DD") || ""}) 
                      </div>
                      }
                    </SubDateDiv>
                  </div>
                  {
                  //data.next_subscr_type && ( and data.subscr_type != 'TRIAL' )
                    ( data.subscr_end_dt > parseInt(dayjs(nowDate).unix())  && data.subscr_yn && data.subscription_canceled == false ) &&
                    <Box className={classes.cancelBtnWrap}>
                      <Button
                        className={classes.cancelBtn}
                        href="#"
                        onClick={cancelSubscription}
                      >
                        구독 결제 취소하기
                      </Button>
                    </Box>
                  }
                </BoxWrap>
              ) : (
                <ButtonNoWrap>구독정보 없음</ButtonNoWrap>
              )}
              <ButtonWrap active={isdrawer}>
                <div onClick={handleSaveClick}>Save</div>
              </ButtonWrap>
            </RightWrap>
          </InputWrap>
        </AccountWrap>
      </Container>

      <AddressDialog
        open={address}
        setOpen={setAddress}
        inputs={inputs}
        setInputs={setInputs}
      />

      <Dialog
        maxWidth="lg"
        open={billingChangeDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-billing-Change"
        aria-describedby="billing type change dialog"
        classes={{
          paperWidthLg: classes.dialogPaper,
        }}
      >
        <DialogTitle id="alert-dialog-billing-Change">
          구독 방식을 변경하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="billing type change dialog">
            구독 방식을 변경합니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            취소
          </Button>
          <Button
            onClick={() => changeBilling.mutate(subCheck)}
            color="primary"
            autoFocus
          >
            변경
          </Button>
         
        </DialogActions>
      </Dialog>
      
      <Dialog
        maxWidth="lg"
        open={billingCancelDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-billing-Change"
        aria-describedby="billing type change dialog"
        classes={{
          paperWidthLg: classes.dialogPaper,
        }}
      >
        <DialogTitle id="alert-dialog-billing-Change">
          구독 결제를 취소하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="billing type change dialog">
            지금 구독을 종료해도 {dayjs.unix(data.subscr_end_dt).format("YYYY-MM-DD") || "예정 말료일"}까지는 계속 서비스를 이용할 수 있습니다.
          </DialogContentText>
          <DialogContentText id="billing type change dialog">
            {dayjs.unix(data.subscr_end_dt).format("YYYY-MM-DD") ||"예정 말료일"}에 예정된 다음 결제가 취소됩니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            닫기
          </Button>
          <Button
            onClick={() => cancelBilling.mutate(data.subscr_no)}
            color="primary"
            autoFocus
          >
            구독 결제취소하기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
