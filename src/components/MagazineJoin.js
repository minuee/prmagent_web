import React, { useState, useMemo, useRef } from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/styles";
import { TextField, Divider,Radio } from "@material-ui/core";

import { useHistory } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { Auth, AuthType } from "@psyrenpark/auth";
import { darken } from "polished";

import { apiObject } from "api/api_common";
import BaseButton from "components/BaseButton";
import SelectBox from "components/SelectBox";
import CheckBox from "components/CheckBox";
import AgreeDialog from "components/AgreeDialog";
import useOutsideClick from "components/UseOutsideClick";
import utils from "utils";

const useStyles = makeStyles(() => ({
  textField: {
    width: "100%",
  },
  textField2: {
    width: "370px",
    marginRight: "60px",
  },
  textField3: {
    width: "370px",
  },
  textField4: {
    width: "700px",
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
  width: 800px;
  min-height: 780px;
  height : 100%;
  padding-top: 38px;
`;

const InputWrap = styled.div`
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
  margin-top: 40px;
  float: right;
`;

const CompanyWrap = styled.div`
  position: relative;
`;
const RadioButtonWrap = styled.div`
  display: flex;
  align-items: center;
`;

const CompanySearch = styled.div`
  border: 1px solid #b7b7b7;
  border-top: none;
  position: absolute;
  width: 370px;
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

const Text = styled.div`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export default function MagazineJoin({ tos, privacy, marketing }) {
  const ref = useRef();
  const classes = useStyles();
  const history = useHistory();

  const [inputs, setInputs] = useState({
    name: "",
    user_se_cd : 'RUS001', //RUS001 : magzine,RUS002 : stylist
    company: "",
    mgzn_id: "",
    position: "",
    // myEditor: "",
    email: "",
    password: "",
    passwordCheck: "",
    contact: "",
    mobile_auth: "",
    myTeam: "",
  });

  const [checked, setChecked] = useState({
    checkedAll: false,
    service: false,
    userInfo: false,
    marketing: false,
  });

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

  const handleChangeUserType = (name, data) => {
    setInputs({ ...inputs, [name]: data });
  };

  const handleSubmit = () => {
    if (!checked.service && !checked.userInfo) {
      utils.customAlert("약관을 동의하셔야 합니다.");
      return;
    }
    // if (!utils.FalsyValueCheck(inputs, ["myTeam"])) {
    //   utils.customAlert("입력 필드 값들을 확인해주세요.");
    //   return;
    // }
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
    } else if (inputs.contact.trim() === "") {
      utils.customAlert("휴대폰번호를 입력해주세요.");
      return;
    } else if (inputs.mobile_auth.trim() === "") {
      utils.customAlert("인증번호를 입력해주세요.");
      return;
    } else {
      if (inputs.mobile_auth !== "" && inputs.contact !== "") {
        mobileAuthCheck.mutate({
          mobile_no: inputs.contact,
          auth_no: inputs.mobile_auth,
        });
      }
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
      company: d.mgzn_nm,
      mgzn_id: d.mgzn_id,
    });
  };

  const company_search = useMutation(
    ["mgzn-company-search"],
    (value) =>
      apiObject.getMagazineSearchCompany({ search_text: value.search_text }),
    {
      onSuccess: (data) => {
        setCompanyList(data.list);
      },
    }
  );

  useOutsideClick(ref, () => {
    setCompanySearch(false);
  });

  const signUpFunction = async () => {
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
          user_type: "MGZN",
          user_se_cd : inputs.user_se_cd,
          user_nm: inputs.name,
          mgzn_nm: inputs.company,
          mgzn_pos_cd: inputs.position,
          email_adres: inputs.email,
          phone_no: inputs.contact.replaceAll("-", ""),
          auth_no: inputs.mobile_auth,
          team_user_id: inputs.myTeam,
        },
      },
      async (data) => {
        data.userConfirmed && utils.customAlert("회원가입 되었습니다.");
        history.replace("/");
      },
      (error) => {
        console.log('errorerrorerror',error)
        if (error.code === "UsernameExistsException") {
          utils.customAlert("이미 가입된 이메일 주소입니다.");
        } else if (error.code === "InvalidParameterException" && error.message == "User is already confirmed." ) {
          utils.customAlert("이미 가입된 이메일 주소입니다.");
        } else if (error.code === "InvalidParameterException" && error.message != "User is already confirmed." ) {
          utils.customAlert("입력필드값을 확인해 주세요.");
        } else {
          utils.customAlert(error.message);
        }
      }
    );
  };

  // 매거진 직급 검색
  const magazinePosition = useQuery(
    ["magazine-position"],
    async () => await apiObject.getMagazinePosition(() => {})
  );
  const MAGAZINE_POSITION = useMemo(() =>
    magazinePosition.isLoading
      ? []
      : magazinePosition.data.list.map((item) => ({
          label: item.cd_nm,
          value: item.cd_id,
        }))
  );

  // 팀원 검색
  const handleTeamSearch = () => {
    inputs.mgzn_id !== "" && searchTeam.mutate({ mgzn_id: inputs.mgzn_id });
  };

  // 인증번호 조회
  const handleMobileAuth = () => {
    if (!utils.isMobile(inputs.contact)) {
      utils.customAlert("올바른 형식의 휴대폰번호가 아닙니다.");
    } else {
      getMobileAuth.mutate();
    }
  };

  // 팀원 검색
  const searchTeam = useMutation(
    (value) =>
      apiObject.getSearchTeamMember({
        search_type: "MAGAZINE",
        mgzn_id: value.mgzn_id,
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
      },
      onError: (error) => {
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
        signUpFunction();
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
            className={classes.textField2}
            InputProps={{
              classes: { input: classes.inputText, root: classes.root },
            }}
          />
          <RadioButtonWrap>            
            <Radio
              checked={inputs.user_se_cd === 'RUS001'}
              onChange={handleChange}
              value="RUS001"
              name="user_se_cd"
              inputProps={{ 'aria-label': 'RUS001' }}
            />
            <Text onClick={()=>handleChangeUserType('user_se_cd','RUS001')}>기자</Text>
            <Radio
              checked={inputs.user_se_cd === 'RUS002'}
              onChange={handleChange}
              value="RUS002"
              name="user_se_cd"
              inputProps={{ 'aria-label': 'RUS002' }}
            />
            <Text onClick={()=>handleChangeUserType('user_se_cd','RUS002')}>스타일리스트</Text>
          </RadioButtonWrap>
        </InputWrap>
        <InputWrap style={{ justifyContent: "space-between" }}>
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
                    key={d.mgzn_id}
                    onClick={() => handleCompanyClick(d)}
                  >
                    {d.mgzn_nm}
                  </CompanySearchResult>
                ))
              ) : (
                <CompanySearchNoResult>
                  검색결과가 없습니다.
                </CompanySearchNoResult>
              )}
            </CompanySearch>
          </CompanyWrap>
          <SelectBox
            width="370px"
            height="37px"
            text="직급"
            value={inputs.position}
            name="position"
            handleChange={handleChangeSelectBox}
            options={MAGAZINE_POSITION}
          />
        </InputWrap>
        {/* <InputWrap>
          <TextField
            variant="outlined"
            placeholder="My Editor"
            value={inputs.myEditor}
            name="myEditor"
            onChange={handleChange}
            className={classes.textField}
            InputProps={{
              classes: { input: classes.inputText, root: classes.root },
            }}
          />
        </InputWrap> */}
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
            type="password"
            value={inputs.password}
            name="password"
            onChange={handleChange}
            className={classes.textField2}
            InputProps={{
              classes: { input: classes.inputText, root: classes.root },
            }}
            helperText="*영문 대소문자/숫자/특수문자 포함 8-16자리"
          />
          <TextField
            variant="outlined"
            placeholder="비밀번호 확인"
            type="password"
            value={inputs.passwordCheck}
            name="passwordCheck"
            onChange={handleChange}
            className={classes.textField3}
            InputProps={{
              classes: { input: classes.inputText, root: classes.root },
            }}
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
            text="인증 번호 요청"
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
        {/* <InputWrap style={{ marginBottom: "40px" }} onClick={handleTeamSearch}>
          <SelectBox
            width="700px"
            height="37px"
            text="My Team"
            value={inputs.myTeam}
            name="myTeam"
            handleChange={handleChangeSelectBox}
            options={team}
          />
          <BaseButton
            width="100px"
            height="37px"
            type="filled"
            color="#7ea1b2"
            textColor="#ffffff"
            text="팀원검색"
          />
        </InputWrap> */}
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
          <TermWrap>
            <CheckBox
              checked={checked.userInfo}
              text1="개인정보 수집 이용 동의"
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
            width="400px"
            height="60px"
            color="#7ea1b2"
            textColor="#ffffff"
            fontSize="24px"
            fontWeight="bold"
            text="Sign Up"
            type="filled"
            handleClick={handleSubmit}
          />
        </ButtonWrap>
      </Container>

      <AgreeDialog
        open={agreeDialog.tos}
        setOpen={() => setAgreeDialog({ ...agreeDialog, tos: false })}
        title="서비스 이용 약관"
        contents={tos}
      />
      <AgreeDialog
        open={agreeDialog.privacy}
        setOpen={() => setAgreeDialog({ ...agreeDialog, privacy: false })}
        title="개인정보 수집"
        contents={privacy}
      />
      <AgreeDialog
        open={agreeDialog.market}
        setOpen={() => setAgreeDialog({ ...agreeDialog, market: false })}
        title="마켓팅 정보 수신"
        contents={marketing}
      />
    </>
  );
}
