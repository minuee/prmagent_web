import React, { useState } from "react";
import styled, { css } from "styled-components";
import { TextField, Divider } from "@material-ui/core";
import { darken } from "polished";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Auth, AuthType } from "@psyrenpark/auth";
import isImageUrl from "is-image-url";

import UploadIcon from "assets/upload_icon.png";
import CameraIcon from "assets/camera_icon.svg";
import SubCheckOn from "assets/sub_check_on.svg";
import SubCheckOff from "assets/sub_check_off.svg";
import SelectBox from "components/SelectBox";
import AddressDialog from "components/AddressDialog";
import { apiObject as apiCommon } from "api/api_common";
import { apiObject } from "api/api_stylist";
import Progress from "components/common/progress";
import utils from "utils";



export default function MyAccountComponent({ data, position }) {
  const [inputs, setInputs] = useState({
    name: data.style_list_user_nm || "",
    company: data.company_nm || "",
    phone_no: data.phone_no || "",
    position: data.user_position_id || "",
    email: data.email_adres || "",
    oldPassword: "",
    newPassword: "",
    newPasswordCheck: "",
    passwordCheck: "",
    team: data.teammate_id || "",
  });
  const [profileImg, setProfileImg] = useState({
    img_full_url: isImageUrl(data.img_full_path) ? data.img_full_path : null,
    img_url_adres: data.img_url_adres,
    file: null,
  });
  const [subCheck, setSubCheck] = useState("month");
  const [address, setAddress] = useState(false);
  const [team, setTeam] = useState("");
  const queryClient = useQueryClient();

  const handleImgUpload = ({ target }) => {
    const name = target.accept.includes("image/png") ? "images" : "noImage";
    let img = new Image();
    img.src = URL.createObjectURL(target.files[0]);
    img.onload = function () {
      if (name === "images") {
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
    if (confirm("사용자 정보를 수정하시겠습니까?")) {
      if (
        inputs.oldPassword === "" &&
        inputs.newPassword === "" &&
        inputs.newPasswordCheck === ""
      ) {
        editMyAccount.mutate({
          user_nm: inputs.name,
          compy_nm: inputs.company,
          stylist_pos_cd: inputs.position,
          phone_no: inputs.phone_no,
          team_user_id: inputs.myTeam,
          file: profileImg.file,
          img_url: profileImg.img_url_adres,
        });
      } else {
        if (inputs.newPassword !== inputs.newPasswordCheck) {
          alert("비밀번호를 확인해 주세요.");
          return;
        } else changePasswordFunction();
      }
    }
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
          compy_nm: inputs.company,
          stylist_pos_cd: inputs.position,
          phone_no: inputs.phone_no,
          team_user_id: inputs.myTeam,
          file: profileImg.file,
          img_url: profileImg.img_url_adres,
        });
      },
      (error) => {
        // 실패처리
        if (error.code === "NotAuthorizedException") {
          alert("기존 비밀번호가 일치하지 않습니다.");
        } else {
          alert(error.message);
        }
      }
    );
  };

  const editMyAccount = useMutation(
    ["stylist", "my-account-edit"],
    (value) =>
      apiObject.setMyProfile(
        {
          user_nm: value.user_nm,
          compy_nm: value.compy_nm,
          stylist_pos_cd: value.stylist_pos_cd,
          phone_no: value.phone_no,
          team_user_id: value.team_user_id,
          file: value.file,
          img_url: value.img_url,
        },
        () => {}
      ),
    {
      onSuccess: () => {
        alert("수정되었습니다.");
        setInputs({
          ...inputs,
          oldPassword: "",
          newPassword: "",
          newPasswordCheck: "",
        });
      },
      onError: () => {
        alert("수정 중 오류가 발생했습니다.");
      },
      onSettled: () => {
        queryClient.invalidateQueries(["stylist-myinfo"]);
      },
    }
  );

  // 팀원 검색
  const teamSearchQuery = useQuery(
    ["stylist-team-search", inputs.company],
    async() =>      
      await apiCommon.getSearchTeamMember({
        search_type: "STYLIST",        
        brand_id : null,
        mgzn_id : null,
        compy_nm: inputs.company,
      })
  );

  const team_options = teamSearchQuery.isLoading
    ? 
    []
    : 
    !utils.isEmpty(teamSearchQuery.data) ?
    teamSearchQuery.data.list.map((item) => ({
        label: item.user_nm + " " + item.position,
        value: item.user_id,
      }))
    :
    [];

  if (teamSearchQuery.isLoading) {
    return <Progress type="load" />;
  }

  if (editMyAccount.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <>
      <Container>
        <AccountWrap>
          <Title>My Account</Title>
          <StyleDivider />
          <InputWrap>
            <ImgWrap>
              <ImgDiv>
                <input
                  accept="image/png"
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
            <RightWrap>
              <InputDiv>
                <StyleTextField
                  variant="outlined"
                  value={inputs.name}
                  placeholder="Name"
                  name="name"
                  onChange={handleChange}
                />
              </InputDiv>
              <InputDiv>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.company}
                  placeholder="Company Name"
                  name="company"
                  onChange={handleChange}
                  readOnly
                  disabled
                />
              </InputDiv>
              <InputDiv>
                <SelectBox
                  width="370px"
                  height="37px"
                  text="Position"
                  value={inputs.position}
                  name="position"
                  handleChange={handleChangeSelectBox}
                  options={position}
                />
              </InputDiv>
              <InputDiv>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.email}
                  placeholder="E-mail"
                  name="email"
                  onChange={handleChange}
                  readOnly
                  disabled
                />
              </InputDiv>
              <InputDiv>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.oldPassword}
                  placeholder="Existing Password"
                  type="password"
                  name="oldPassword"
                  onChange={handleChange}
                />
              </InputDiv>
              <InputDiv>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.newPassword}
                  placeholder="New Password"
                  type="password"
                  name="newPassword"
                  onChange={handleChange}
                />
              </InputDiv>
              <InputDiv>
                <StyleTextField2
                  variant="outlined"
                  value={inputs.newPasswordCheck}
                  placeholder="Confirm New Password"
                  type="password"
                  name="newPasswordCheck"
                  onChange={handleChange}
                />
              </InputDiv>
              <InputDiv style={{ marginBottom: "36px" }}>
                <SelectBox
                  width="370px"
                  height="37px"
                  text="지정된 팀원이 없습니다."
                  value={inputs.team}
                  name="team"
                  handleChange={handleChangeSelectBox}
                  options={team_options}
                />
              </InputDiv>
              
              <ButtonWrap>
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
    </>
  );
}


const Container = styled.div`
  display: flex;
  margin-bottom: 80px;  
  justify-content: center;
`;

const AccountWrap = styled.div`  
  @media (min-width: 1920px) {    
    width: 992px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 992px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 750px;
  } 
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

const ImgWrap = styled.div`
  @media (min-width: 1920px) {    
    width: 150px;
    height: 150px;
    margin-right: 40px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 150px;
    height: 150px;
    margin-right: 40px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 150px;
    height: 150px;
    margin-right: 30px;
  
  } 
`;

const RightWrap = styled.div`  
  @media (min-width: 1920px) {    
    width: 800px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 800px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 500px;
  }   
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
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyleTextField = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 13px 14px;
    border-radius: 0;
  }
  .MuiInputBase-root {
    width: 370px;
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
  .MuiOutlinedInput-input {
    padding: 13px 14px;
    border-radius: 0;
  }
  .MuiInputBase-root {
    width: 370px;
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

const SubDiv = styled.div`
  display: flex;
  align-items: top;
  margin-bottom: 24px;
`;

const SubText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #222222;
  margin-right: 70px;
`;

const SubCheck = styled.div`
  width: 205px;
  height: 156px;
  border-radius: 20px;
  background-color: ${(props) => (props.active ? "#999999" : "#dddddd")};
  margin-right: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${darken(0.3, "#ffffff")};
  }
  &:active {
    background-color: ${darken(0.4, "#ffffff")};
  }

  img {
    max-width: 56px;
    max-height: 56px;
    margin-right: 20px;
  }

  .month_text {
    font-size: 20px;
    font-weight: bold;
    color: #ffffff;
  }

  .month_text2 {
    font-size: 16px;
    color: #fcfcfc;
  }

  .text1 {
    font-size: 14px;
    color: #fcfcfc;
  }

  .text2 {
    font-size: 14px;
    color: #fcfcfc;
    text-decoration: underline;
  }
`;

const MonthlySub = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const SubDateDiv = styled.div`
  margin-left: 155px;
  margin-bottom: 12px;
  display: flex;
  color: #555555;
  font-size: 14px;

  .dt {
    font-size: 14px;
    font-weight: 500;
    color: #222222;
    margin-left: 5px;
  }
  .cancel {
    margin-left: 22px;
    color: #7ea1b2;
    font-size: 14px;
    font-weight: bold;
    text-decoration: underline;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 60px;

  div {
    width: 300px;
    height: 60px;
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