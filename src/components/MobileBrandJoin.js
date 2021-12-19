import React, { useState, useMemo, useRef,useEffect } from "react";
import styled from "styled-components";
import { darken } from "polished";
import { makeStyles } from "@material-ui/styles";
import { TextField, Divider } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Auth, AuthType } from "@psyrenpark/auth";

import BaseButton from "components/BaseButton";
import SelectBox from "components/SelectBox";
import CheckBox from "components/CheckBox";
import { apiObject } from "api/api_common";
import { useQuery, useMutation } from "react-query";
import AddressDialog from "components/AddressDialogMobile";
import AgreeDialog from "components/AgreeDialog";
import useOutsideClick from "components/UseOutsideClick";
import utils from "utils";

const useStyles = makeStyles(() => ({
  textField: {
    width: "100%",
  },
  textField2: {
    width: "90vw",
  },
  textField3: {
    width: "100%",
  },
  textField4: {
    width: "100%",
  },
  inputText: {
    height: 0,
    fontSize: "14px",
  },
  root: {
    borderRadius: "inherit",
  },
  root2: {
    borderRadius: "inherit",
    backgroundColor: "#f3f3f3",
  },
}));

const Container = styled.div`
  width: 90%;
  padding-top: 18px;
`;

const InputWrap = styled.div`
  width: 100%;;  
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  
`;

const TermWrap = styled.div`
  width: 220px;
  display: flex;
  align-items: center;
`;

const ButtonWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;  
  margin-top: 30px;
  margin-bottom : 30px;
  justify-content: flex-end;
  align-items: flex-end;
  
`;

const CompanyWrap = styled.div`
  position: relative;
`;

const CompanySearch = styled.div`
  border: 1px solid #b7b7b7;
  border-top: none;
  position: absolute;
  width: 100%;;
  max-height: 401px;
  overflow: auto;
  z-index: 1;
  background-color: #fafafa;
  visibility: ${(props) => (props.active ? "visible" : "hidden")};
`;

const CompanySearchResult = styled.div`
  cursor: pointer;
  height: 40px;
  font-size: 14px;
  padding-left: 13px;
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.4);

  &:hover {
    color: #000000;
    background-color: ${darken(0.1, "#ffffff")};
  }
`;

const CompanySearchNoResult = styled.div`
  cursor: pointer;
  height: 40px;
  font-size: 14px;
  padding-left: 13px;
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.4);
`;

const Input = styled.input`
  display: none;
`;
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function BrandJoin({ tos, privacy, marketing }) {
  const ref = useRef();
  const fileInput = useRef();
  const classes = useStyles();
  const history = useHistory();
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  console.log('windowDimensions',windowDimensions)
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [inputs, setInputs] = useState({
    name: "",
    company: "",
    brand_id: "",
    position: "",
    email: "",
    password: "",
    passwordCheck: "",
    address: "",
    address_more: "",
    post_no: "",
    contact: "",
    mobile_auth: "",
    myTeam: "",
    logo_url: {
      file_name: "",
      img_url: "",
      file: null,
    },
    logo_yn: false,
  });

  const [checked, setChecked] = useState({
    checkedAll: false,
    service: false,
    userInfo: false,
    marketing: false,
  });

  const [address, setAddress] = useState(false);
  const [team, setTeam] = useState("");
  const [agreeDialog, setAgreeDialog] = useState({
    tos: false,
    privacy: false,
    market: false,
  });
  const [companySearch, setCompanySearch] = useState(false);
  const [companyList, setCompanyList] = useState([]);

  const handleChecked = (act) => {
    if (act === "all") {
      setChecked({
        checkedAll: !checked.checkedAll,
        service: !checked.checkedAll,
        userInfo: !checked.checkedAll,
        marketing: !checked.checkedAll,
      });
    } else if (act === "service") {
      setChecked({
        ...checked,
        service: !checked.service,
      });
    } else if (act === "userInfo") {
      setChecked({
        ...checked,
        userInfo: !checked.userInfo,
      });
    } else if (act === "marketing") {
      setChecked({
        ...checked,
        marketing: !checked.marketing,
      });
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputs({ ...inputs, [e.target.name]: value });
  };

  const handleChangeSelectBox = (name, data) => {
    setInputs({ ...inputs, [name]: data });
  };

  const handleSubmit = () => {
    if (!checked.service && !checked.userInfo) {
      utils.customAlert("약관을 동의하셔야 합니다.");
      return;
    }
    if (inputs.name.trim() === "") {
      utils.customAlert("이름을 입력해주세요.");
      return;
    } else if (inputs.company.trim() === "") {
      utils.customAlert("회사를 입력해주세요.");
      return;
    } else if (inputs.position.trim() === "") {
      utils.customAlert("직급을 입력해주세요.");
      return;
    } else if (inputs.email.trim() === "") {
      utils.customAlert("이메일주소를 입력해주세요.");
      return;
    } else if (inputs.password === "") {
      utils.customAlert("비밀번호를 입력해주세요.");
      return;
    } else if (inputs.passwordCheck === "") {
      utils.customAlert("비밀번호 확인값을 입력해주세요.");
      return;
    } else if (inputs.password !== inputs.passwordCheck) {
      utils.customAlert("비밀번호가 맞지 않습니다.");
      return;
    } else if (!utils.isPassword(inputs.password)) {
      utils.customAlert(
        "비밀번호는 영어대소문자/숫자/특수문자를 혼합하여 8~16자리 이내로 입력해주세요."
      );
      return;
   
    } else if (inputs.address.trim() === "") {
      utils.customAlert("주소를 입력해주세요.");
      return;
    } else if (inputs.address_more.trim() === "") {
      utils.customAlert("상세주소를 입력해주세요.");
      return;
    } else if (inputs.contact.trim() === "") {
      utils.customAlert("휴대폰번호를 입력해주세요.");
      return;
    } else if (inputs.mobile_auth.trim() === "") {
      utils.customAlert("인증번호를 입력해주세요.");
      return;
    }
    // if (!utils.FalsyValueCheck(inputs, ["myTeam", "brand_id"])) {
    //   utils.customAlert("입력 필드 값들을 확인해주세요.");
    //   console.log("inputs : ", inputs);
    //   return;
    // }
    else {
      if (inputs.mobile_auth !== "" && inputs.contact !== "") {
        mobileAuthCheck.mutate({
          mobile_no: inputs.contact,
          auth_no: inputs.mobile_auth,
        });
      }
    }
  };

  useOutsideClick(ref, () => {
    setCompanySearch(false);
  });

  const signUpFunction = async (logo_url) => {
    Auth.signUpProcess(
      {
        email: inputs.email,
        password: inputs.password,
        authType: AuthType.EMAIL,
        lang: "en",
        cognitoRegComm: {
          signup_type: "email",
          Lang: "en",
          lang: "en",
          user_nm: inputs.name,
          user_type: "BRAND",
          brand_nm: inputs.company,
          brand_pos_cd: inputs.position,
          email_adres: inputs.email,
          adres: inputs.address,
          adres_detail: inputs.address_more,
          post_no: inputs.post_no,
          phone_no: inputs.contact.replaceAll("-", ""),
          auth_no: inputs.mobile_auth,
          team_user_id: inputs.myTeam,
          logo_url: logo_url || "",
        },
      },
      async (data) => {
        data.userConfirmed && utils.customAlert("회원가입 되었습니다.");
        history.replace("/");
      },
      (error) => {
        if (error.code === "UsernameExistsException") {
          utils.customAlert("이미 가입된 이메일 주소입니다.");
        } else if (error.code === "InvalidParameterException") {
          utils.customAlert("입력필드값을 확인해 주세요.");
        } else {
          utils.customAlert(error.message);
        }
      }
    );
  };

  // 브랜드 직급 검색
  const brandPosition = useQuery(
    ["brand-position"],
    async () => await apiObject.getBrandPosition(() => {})
  );
  const BRAND_POSITION_DATA = useMemo(() =>
    brandPosition.isLoading
      ? []
      : brandPosition.data.list.map((item) => ({
          label: item.cd_nm,
          value: item.cd_id,
        }))
  );

  const handleTeamSearch = () => {
    inputs.brand_id !== "" && searchTeam.mutate({ brand_id: inputs.brand_id });
  };

  const handleMobileAuth = () => {
    if (!utils.isMobile(inputs.contact)) {
      utils.customAlert("올바른 형식의 휴대폰번호가 아닙니다.");
    } else {
      getMobileAuth.mutate();
    }
  };

  const handleCompanyChange = (e) => {
    setCompanySearch(true);
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
    company_search.mutate({ search_text: e.target.value });
  };

  const handleCompanyClick = (d) => {
    setCompanySearch(false);
    setInputs({
      ...inputs,
      company: d.brand_nm,
      brand_id: d.brand_id,
      logo_yn: d.brand_logo_url_adres !== null ? true : false,
    });
  };

  const handleImgUpload = ({ target }) => {
    console.log("target : ", target.files[0]);
    const name = target.accept.includes("image/png") ? "images" : "noImage";
    let img = new Image();
    img.src = URL.createObjectURL(target.files[0]);
    img.onload = function () {
      if (name === "images") {
        let maxSize = 1024 * 1024 * 1;
        if (target.files[0].size > maxSize) {
          utils.customAlert("로고이미지 사이즈는 1MB 이내로 등록 가능합니다.");
          fileInput.current.value = "";
          return;
        } else {
          setInputs({
            ...inputs,
            logo_url: {
              file_name: target.files[0].name,
              img_url: URL.createObjectURL(target.files[0]),
              file: target.files[0],
            },
          });
          fileInput.current.value = "";
        }
      } else {
        console.log("No Image file...");
        fileInput.current.value = "";
        return;
      }
    };
  };

  const company_search = useMutation(
    ["brand-company-search"],
    (value) =>
      apiObject.getBrandSearchCompany({ search_text: value.search_text }),
    {
      onSuccess: (data) => {
        setCompanyList(data.list);
      },
    }
  );

  const uploadLogo = useMutation(
    (value) =>
      apiObject.uplaodBrandLogo({
        file: value.file,
      }),
    {
      onSuccess: (data) => {
        signUpFunction(data.url);
      },
      onError: () => {
        utils.customAlert("로고 이미지 업로드 중 오류가 발생했습니다.");
      },
    }
  );

  // 팀원 검색
  const searchTeam = useMutation(
    (value) =>
      apiObject.getSearchTeamMember({
        search_type: "BRAND",
        brand_id: value.brand_id,
      }),
    {
      onSuccess: (data) => {
        data.list.length > 0 &&
          setTeam(
            data.list.map((item) => ({
              value: item.user_id,
              label: item.position + " " + item.user_nm,
            }))
          );
        console.log("success: ", data);
      },
      onError: (error) => {
        console.log("failed: ", error);
      },
    }
  );

  // 인증번호 발송
  const getMobileAuth = useMutation(
    () =>
      apiObject.getMobileAuthSend({
        mobile_no: inputs.contact.replaceAll("-", ""),
      }),
    {
      onSuccess: () => {
        utils.customAlert("인증번호가 발송되었습니다.");
      },
      onError: () => {
        utils.customAlert("인증번호 발송중 오류가 발생했습니다.");
      },
    }
  );

  // 인증번호 체크
  const mobileAuthCheck = useMutation(
    (value) =>
      apiObject.getMoblieAuthCheck({
        mobile_no: value.mobile_no,
        auth_no: value.auth_no,
      }),
    {
      onSuccess: () => {
        inputs.logo_url.file === null
          ? signUpFunction()
          : uploadLogo.mutate({ file: inputs.logo_url.file });
      },
      onError: () => {
        utils.customAlert("인증번호가 유효하지 않습니다.");
      },
    }
  );

  return (
    <>
      <Container>
        <InputWrap>
          <TextField
            variant="outlined"
            placeholder="이름"
            value={inputs.name}
            name="name"
            onChange={handleChange}
            className={classes.textField}
            InputProps={{
              classes: { input: classes.inputText, root: classes.root },
            }}
          />
        </InputWrap>
        <InputWrap>
          <CompanyWrap ref={ref} onFocus={() => setCompanySearch(true)}>
            <TextField
              variant="outlined"
              placeholder="회사명"
              value={inputs.company}
              name="company"
              onChange={handleCompanyChange}
              autoComplete="off"
              className={classes.textField2}
              InputProps={{
                classes: { input: classes.inputText, root: classes.root },
              }}
            />
            <CompanySearch active={companySearch}>
              {companyList.length > 0 ? (
                companyList.map((d) => (
                  <CompanySearchResult
                    key={d.brand_id}
                    onClick={() => handleCompanyClick(d)}
                  >
                    {d.brand_nm}
                  </CompanySearchResult>
                ))
              ) : (
                <CompanySearchNoResult>
                  검색결과가 없습니다.
                </CompanySearchNoResult>
              )}
            </CompanySearch>
          </CompanyWrap>
        </InputWrap>
        <InputWrap>
          <SelectBox
            width="90vw"
            height="37px"
            text="직급"
            value={inputs.position}
            name="position"
            handleChange={handleChangeSelectBox}
            options={BRAND_POSITION_DATA}
          />
        </InputWrap>
        <InputWrap>
          <TextField
            variant="outlined"
            placeholder="E-mail"
            value={inputs.email}
            name="email"
            onChange={handleChange}
            className={classes.textField}
            InputProps={{
              classes: { input: classes.inputText, root: classes.root },
            }}
          />
        </InputWrap>
        <InputWrap style={{ height: "60px", alignItems: "flex-start" }}>
          <TextField
            variant="outlined"
            placeholder="비밀번호"
            value={inputs.password}
            name="password"
            onChange={handleChange}
            type="password"
            className={classes.textField2}
            helperText="*영문 대소문자/숫자/특수문자 포함 8-16자리"
            InputProps={{
              classes: { input: classes.inputText, root: classes.root },
            }}
          />
        </InputWrap>
        <InputWrap style={{ height: "40px", alignItems: "flex-start" }}>
          <TextField
            variant="outlined"
            placeholder="비밀번호 확인"
            value={inputs.passwordCheck}
            name="passwordCheck"
            onChange={handleChange}
            type="password"
            className={classes.textField3}
            InputProps={{
              classes: { input: classes.inputText, root: classes.root },
            }}
          />
        </InputWrap>
        <InputWrap onClick={() => setAddress(true)}>
          <TextField
            variant="outlined"
            placeholder="주소"
            value={inputs.address}
            name="address"
            onChange={handleChange}
            className={classes.textField4}
            InputProps={{
              classes: { input: classes.inputText, root: classes.root },
            }}
            disabled
          />
          <BaseButton
            width="100px"
            height="37px"
            type="filled"
            color="#7ea1b2"
            textColor="#ffffff"
            text="우편번호"
          />
        </InputWrap>
        <InputWrap>
          <TextField
            variant="outlined"
            className={classes.textField}
            placeholder="상세주소"
            InputProps={{
              classes: { input: classes.inputText, root: classes.root },
            }}
            value={inputs.address_more}
            name="address_more"
            onChange={handleChange}
          />
        </InputWrap>
        <InputWrap>
          <TextField
            variant="outlined"
            placeholder="휴대폰 번호"
            value={inputs.contact}
            name="contact"
            onChange={handleChange}
            className={classes.textField4}
            InputProps={{
              classes: { input: classes.inputText, root: classes.root },
            }}
          />
          <BaseButton
            width="100px"
            height="37px"
            type="filled"
            color="#7ea1b2"
            textColor="#ffffff"
            text="인증번호요청"
            handleClick={handleMobileAuth}
          />
        </InputWrap>
        <InputWrap>
          <TextField
            variant="outlined"
            placeholder="인증번호 6자리 숫자 입력"
            className={classes.textField}
            value={inputs.mobile_auth}
            name="mobile_auth"
            onChange={handleChange}
            InputProps={{
              classes: { input: classes.inputText, root: classes.root2 },
            }}
          />
        </InputWrap>
        <InputWrap onClick={handleTeamSearch}>
          <SelectBox
            width="75vw"
            height="37px"
            text="My Team"
            value={inputs.myTeam}
            name="myTeam"
            handleChange={handleChangeSelectBox}
            options={team}
          />
          <BaseButton
            width="15vw"
            height="37px"
            type="filled"
            color="#7ea1b2"
            textColor="#ffffff"
            text="팀원검색"
          />
        </InputWrap>
        {inputs.company !== "" && !inputs.logo_yn && (
          <InputWrap style={{ marginBottom: "40px" }}>
            <TextField
              variant="outlined"
              placeholder="1mb 미만의 로고 이미지"
              value={inputs.logo_url.file_name}
              name="logo_url"
              className={classes.textField4}
              InputProps={{
                classes: { input: classes.inputText, root: classes.root },
              }}
              readOnly
              disabled
            />
            <label htmlFor="logo_url">
              <BaseButton
                width="100px"
                height="37px"
                type="filled"
                color="#7ea1b2"
                textColor="#ffffff"
                text="로고 업로드"
              />
            </label>
          </InputWrap>
        )}
        <InputWrap>
          <CheckBox
            checked={checked.checkedAll}
            text1="전체동의"
            handleChange={() => handleChecked("all")}
            handleClick={() => handleChecked("all")}
          />
        </InputWrap>
        <Divider style={{ marginBottom: "20px" }} />
        <InputWrap style={{ justifyContent: "flex-start" }}>
          <TermWrap>
            <CheckBox
              checked={checked.service}
              text1="서비스 이용 약관 동의"
              text2="(필수)"
              handleChange={() => handleChecked("service")}
              handleClick={() => setAgreeDialog({ ...agreeDialog, tos: true })}
            />
          </TermWrap>
        </InputWrap>
        <InputWrap style={{ justifyContent: "flex-start" }}>
          <TermWrap>
            <CheckBox
              checked={checked.userInfo}
              text1="개인정보 수집 이용 동의"
              text2="(필수)"
              handleChange={() => handleChecked("userInfo")}
              handleClick={() =>
                setAgreeDialog({ ...agreeDialog, privacy: true })
              }
            />
          </TermWrap>
          {/* <TermWrap>
            <CheckBox
              checked={checked.marketing}
              text1="마케팅 정보 수신"
              text2="(선택)"
              handleChange={() => handleChecked("marketing")}
              handleClick={() =>
                setAgreeDialog({ ...agreeDialog, market: true })
              }
            />
          </TermWrap> */}
        </InputWrap>
        <ButtonWrap>
          <BaseButton
            width="200px"
            height="50px"
            color="#7ea1b2"
            textColor="#ffffff"
            fontSize="20px"
            fontWeight="bold"
            text="Sign Up"
            type="filled"
            handleClick={handleSubmit}
          />
        </ButtonWrap>
      </Container>

      <AddressDialog
        open={address}
        setOpen={setAddress}
        inputs={inputs}
        setInputs={setInputs}
      />

      <AgreeDialog
        open={agreeDialog.tos}
        setOpen={() => setAgreeDialog({ ...agreeDialog, tos: false })}
        title="서비스 이용 약관"
        contents={tos}
      />
      <AgreeDialog
        open={agreeDialog.privacy}
        setOpen={() => setAgreeDialog({ ...agreeDialog, privacy: false })}
        title="개인정보 수집 이용 동의"
        contents={privacy}
      />
      <AgreeDialog
        open={agreeDialog.market}
        setOpen={() => setAgreeDialog({ ...agreeDialog, market: false })}
        title="마켓팅 정보 수신"
        contents={marketing}
      />

      <Input
        accept="image/png"
        id="logo_url"
        name="logo"
        type="file"
        onChange={handleImgUpload}
        ref={fileInput}
      />
    </>
  );
}
