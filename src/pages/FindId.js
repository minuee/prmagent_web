import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import styled, { css } from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import { darken } from "polished";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";

import BaseButton from "components/BaseButton";
import Shutter from "assets/shutterstock.png";
import Logo from "assets/logo.svg";
import { useQuery, useMutation } from "react-query";
import isImageUrl from "is-image-url";
import { apiObject } from "api/api_common";
import Progress from "components/common/progress";
import CheckCircle from "assets/check_circle_blue.svg";
import utils from "utils";

const useStyles = makeStyles(() => ({
  textField: {
    width: "90%",
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

const MainContainer = styled.div`
  height: 100vh;display: flex;position: relative;
`;

const MainBox = styled.div`
  display: flex;      
  @media (min-width: 1920px) {
      width: 100vw;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {  
      width: 1440px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
      width: 1024x;
  }
`;

const ImgBox = styled.div`
  position: relative;
  @media (min-width: 1920px) {
      width: 640px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {  
      width: 640px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 424px;
  }
`;

const LoginImage = styled.img`
  @media (min-width: 1920px) {
    width: 640px;
    height: 1080px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {  
    width: 640px;
    height: 1080px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 424px;
    height: 1080px;
  }
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}") no-repeat center;
          background-size: cover;
        `
      : css``}
`;

const LogoImg = styled.img`
  position: absolute;left: 125px;top: 60px;
`;

const ShutterImg = styled.img`
  position: absolute;left: 0;
  @media (min-width: 1920px) {
    max-width: 640px;
    height: 1080px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {  
    width: 640px;    
    height: 1080px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 424px;
    height: 1080px;
  }
`;

const LoginBox = styled.div`    
    display: flex;align-items: flex-start;justify-content: center;
    padding-left:100px;
    flex-direction: column;    
    @media (min-width: 1920px) {
        width: 1280px;
    }
    @media (min-width: 1440px) and (max-width: 1919px) {  
        width: 800px;        
    }
    @media (min-width: 10px) and (max-width: 1439px) {
        width: 600px;
    }
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 32px;
`;

const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const InputWrap = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BtnWrap = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
`;

const NextBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 60px;
  background-color: #7ea1b2;
  color: #ffffff;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
  }
  &:active {
    background-color: ${darken(0.2, "#7ea1b2")};
  }
`;

const SearchIdBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 800px;
  height: 80px;
  border: 1px solid #dddddd;
  padding: 0 50px;
  font-size: 16px;
  margin-bottom: 60px;
`;

const IdImg = styled.img`
  width: 16px;
  margin-right: 10px;
`;

const IdBox = styled.div`
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const IdText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #222222;
`;

const JoinDt = styled.div`
  font-size: 16px;
  font-weight: normal;
  color: #555555;
`;

const BtnWrap2 = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BtnLogin = styled.div`
  width: 400px;
  height: 60px;
  background-color: #7ea1b2;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
  }
  &:active {
    background-color: ${darken(0.2, "#7ea1b2")};
  }
`;

const BtnFindPw = styled.div`
  width: 400px;
  height: 60px;
  border: solid 1px #dddddd;
  color: #999999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
  &:active {
    background-color: ${darken(0.2, "#ffffff")};
  }
`;

export default function FindId() {
  const history = useHistory();
  const classes = useStyles();
  const [nextPage, setNextPage] = useState(0);
  const [inputs, setInputs] = useState({
    name: "",
    mobile_no: "",
    auth_no: "",
  });
  const [res, setRes] = useState(null);

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextbtn = () => {
    // setNextPage(1);
    if (inputs.name.trim() === "") {
      utils.customAlert("이름을 입력해주세요.");
      return;
    } else if (inputs.mobile_no.trim() === "") {
      utils.customAlert("휴대폰번호를 입력해주세요.");
      return;
    } else if (inputs.auth_no.trim() === "") {
      utils.customAlert("인증번호를 입력해주세요.");
      return;
    }else{
      mobileAuthCheck.mutate({
        mobile_no: inputs.mobile_no,
        auth_no: inputs.auth_no,
      });
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleNextbtn();
    }
  };

  const handleClickAuth = () => {
    if (!utils.isMobile(inputs.mobile_no)) {
      utils.customAlert("올바른 형식의 휴대폰번호가 아닙니다.");
    } else {
      getMobileAuth.mutate();
    }
  };

  const loginImgQuery = useQuery(
    ["login-img"],
    async () => await apiObject.getLoginImg()
  );

  const loginImg = loginImgQuery.isLoading
    ? []
    : isImageUrl(loginImgQuery.data.full_adres)
    ? loginImgQuery.data.full_adres
    : null;

  const getMobileAuth = useMutation(
    () =>
      apiObject.getMobileAuthSend({
        mobile_no: inputs.mobile_no.replaceAll("-", ""),
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
        findEmail.mutate({
          name: inputs.name,
          mobile_no: inputs.mobile_no,
          auth_no: inputs.auth_no,
        });
      },
      onError: () => {
        utils.customAlert("인증번호가 유효하지 않습니다.");
      },
    }
  );

  const findEmail = useMutation(
    (value) =>
      apiObject.findEmail({
        name: value.name,
        mobile_no: value.mobile_no,
        auth_no: value.auth_no,
      }),
    {
      onSuccess: (data) => {
        data.list.length > 0
          ? setRes(data.list[0])
          : setRes({
              email: "",
              reg_dt: "",
            });
      },
      onError: () => {
        setRes({
          email: "",
          reg_dt: "",
        });
      },
      onSettled: () => {
        setNextPage(1);
      },
    }
  );

  if (loginImgQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <MainContainer>
        <MainBox>
          <ImgBox>
            <LoginImage src={loginImg} />
            <ShutterImg src={Shutter} alt="shutter" />
            {/* <LogoImg src={Logo} alt="logo" /> */}
          </ImgBox>
          <LoginBox>
            <Title>아이디 찾기</Title>
            {nextPage === 0 && (
              <>
                <SubTitle>회원정보에 등록한 휴대전화로 인증</SubTitle>
                <InputWrap>
                  <TextField
                    variant="outlined"
                    placeholder="이름"
                    name="name"
                    value={inputs.name}
                    onChange={handleChange}
                    className={classes.textField}
                    InputProps={{
                      classes: { input: classes.inputText, root: classes.root },
                    }}
                  />
                </InputWrap>
                <InputWrap>
                  <TextField
                    variant="outlined"
                    placeholder="휴대폰 번호"
                    name="mobile_no"
                    value={inputs.mobile_no}
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
                    handleClick={handleClickAuth}
                  />
                </InputWrap>
                <InputWrap>
                  <TextField
                    variant="outlined"
                    placeholder="인증번호 6자리 숫자 입력"
                    className={classes.textField}
                    name="auth_no"
                    value={inputs.auth_no}
                    onChange={handleChange}
                    InputProps={{
                      classes: {
                        input: classes.inputText,
                        root: classes.root2,
                      },
                    }}
                    onKeyPress={handleEnterPress}
                  />
                </InputWrap>
                <BtnWrap>
                  <NextBtn onClick={handleNextbtn}>다음</NextBtn>
                </BtnWrap>
              </>
            )}
            {nextPage === 1 && res !== null && (
              <>
                <SubTitle>고객님의 정보와 일치하는 아이디 목록입니다.</SubTitle>
                <SearchIdBox>
                  <IdBox>
                    {res.email === "" ? (
                      <IdText>해당 정보와 일치하는 고객정보가 없습니다.</IdText>
                    ) : (
                      <>
                        <IdImg
                          src={CheckCircle}
                          alt=""
                          style={{ width: "16px" }}
                        />

                        <IdText>{utils.emailMasking(res.email)}</IdText>
                      </>
                    )}
                  </IdBox>
                  {res.reg_dt !== "" && (
                    <JoinDt>
                      가입: {dayjs.unix(res.reg_dt).format("YYYY.MM.DD")}
                    </JoinDt>
                  )}
                </SearchIdBox>
                <BtnWrap2>
                  <BtnLogin onClick={() => history.replace("/")}>
                    로그인 하기
                  </BtnLogin>
                  <BtnFindPw onClick={() => history.replace("/find-pw")}>
                    비밀번호 찾기
                  </BtnFindPw>
                </BtnWrap2>
              </>
            )}
          </LoginBox>
        </MainBox>
      </MainContainer>
    </>
  );
}
