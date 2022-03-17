import React, { useState, useRef, useEffect,useCallback } from "react";
import styled, { css } from "styled-components";
import { Divider, TextField } from "@material-ui/core";
import { darken } from "polished";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";

import UploadIcon from "assets/upload_icon.png";
import AddImgIcon from "assets/sample_add_icon.png";
import CancelIcon from "assets/close_icon.png";
import CheckIcon from "assets/check_icon.png";
import DelBtnImg from "assets/press_img_del_btn.svg";
import YearSelectBox from "components/brand/digital_showroom/YearSelectBox";
import MonthSelectBox from "components/brand/press_release/MonthSelectBox";
import PdfUpload from "assets/press_pdf_upload.svg";
import { apiObject } from "api/api_brand";
import Progress from "components/common/progress";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";
import Constants from 'utils/constants';
import alertConfirm from 'react-alert-confirm';
import { Storage } from "@psyrenpark/storage";
import { v4 as uuidv4 } from "uuid";
export default function PressReleaseAdd() {
  const history = useHistory();
  const addImgRef = useRef(null);
  const addPdfRef = useRef(null);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);

  /* useEffect(() => {
    const unblock = history.block("이 페이지를 나가시겠습니다?");
    return () => {
      unblock();
    };
  }, [history]); */

  const [inputs, setInputs] = useState({
    title: "",
    contents: "",
    monthly_year: "",
    monthly_month: "",
    link: "",
    inquiry_charge : "",
    inquiry_email : "",
    inquiry_tel : "",
    show_yn : "N"
  });

  const [mainImg, setMainImg] = useState({
    img_url: "",
    file: null,
  });

  /* const [addImg, setAddImg] = useState({
    img_url: "",
    file: null,
  }); */
  const [addImg, setAddImg] = useState([]);

  const [addPdf, setAddPdf] = useState({
    file_name: "",
    file: null,
  });

  const handleChange = useCallback(
    (e) => {
      setInputs({
        ...inputs,
        [e.target.name]: e.target.value,
      });
    },
    [inputs]
  );

  const handleChange2 = (n, d) => {
    setInputs({
        ...inputs,
        [n]: d,
    });
  };
  const handleMainImgUpload = useCallback(
    ({ target }) => {
      const name = target.accept.includes("image/png") ? "images" : "noImage";
      const name2 = target.accept.includes("image/jpeg") ? "images" : "noImage";
      const name3 = target.accept.includes("image/jpg") ? "images" : "noImage";
      let img = new Image();
      if (target.files[0] !== undefined) {
        img.src = URL.createObjectURL(target.files[0]);
        img.onload = function () {
          if (name === "images" || name2 === "images" ||  name3 === "images") {
            setMainImg({
              img_url: URL.createObjectURL(target.files[0]),
              file: target.files[0],
            });
            target.value === "";
          } else {
            console.log("No Image file...");
          }
        };
      }
    },
    [mainImg]
  );

  const handleAddImgUpload = useCallback(
    ({ target }) => {
      if ( addImg.length > 5 ) {
        utils.customAlert('5개까지 추가로 가능합니다.');
        return false;
      }else {
        const name = target.accept.includes("image/png") ? "images" : "noImage";
        const name2 = target.accept.includes("image/jpeg") ? "images" : "noImage";
        const name3 = target.accept.includes("image/jpg") ? "images" : "noImage";
        let img = new Image();
        img.src = URL.createObjectURL(target.files[0]);
        img.onload = function () {
          if (name === "images" || name2 === "images" || name3 === "images") {
            addImg.push({
              img_url: URL.createObjectURL(target.files[0]),
              file: target.files[0],
            });          
            setAddImg(addImg);
            addImgRef.current.value = "";
          } else {
            console.log("No Image file...");
          }
        };
      }
    },
    [addImg]
  );

  const handleAddPdfUpload = useCallback(
    ({ target }) => {
      setAddPdf({
        file_name: target.files[0].name,
        file: target.files[0],
      });
      addPdfRef.current.value = "";
    },
    [addPdf]
  );

  const handleAddImgDelBtn = useCallback((idx) => {
    setAddImg(
      addImg.filter((item,index) => index != idx)
    )
   /*  setAddImg(addImg.push({
      img_url: "",
      file: null,
    })); */
  }, [addImg]);

  const handleSelectChange = useCallback(
    (n, d) => {
      setInputs({
        ...inputs,
        [n]: d,
      });
    },
    [inputs]
  );

  const setPress = useMutation(
    ["brand-press-add"],
    (value) =>
      apiObject.setPress(
        {
          title: value.title,
          contents: value.contents,
          monthly_year: value.monthly_year,
          monthly_month: value.monthly_month,
          link: value.link,
          inquiry_charge : value.inquiry_charge,
          inquiry_email : value.inquiry_email,
          inquiry_tel : value.inquiry_tel,
          show_yn: value.show_yn,
          main_img_file: value.main_img_file,
          add_img_file: value.add_img_file,
          add_img_list: value.add_img_list,
          word_file: value.word_file,
        },
        () => {}
      ),
    {
      onSuccess: () => {
        utils.customAlert("등록되었습니다.");
        history.replace("/brand/press_release");
      },
      onError: () => {
        utils.customAlert("등록 중 오류가 발생했습니다.");
      },
    }
  );

  const addImgUpload = useCallback(async(add_img_file) => {
    let newArr = [];
    if (add_img_file.length > 0 ) {      
      for (let index = 0; index < add_img_file.length; index++) {
        let d2 = add_img_file[index];
        if (typeof d2 == 'object') {   
          let d = d2.file;       
          let file_name = uuidv4();
          let file_extension = d.name.substring(d.name.lastIndexOf("."), d.name.length).toLowerCase();
          let key = `press/images/${file_name}${file_extension}`;
          try {
            let data = await Storage.put({
              key,
              object: d,
              config: {
                contentType: ( file_extension == '.jpg' || file_extension == '.jpeg' ) ? "image/jpg" : "image/png",
                level: "public",
              },
            });
            const str =  `public/${data.key}`;
            await newArr.push(str.toString());            
          } catch (error) {
            console.error(error);
            return error;
          }
        }else{
          newArr.push(d2.toString());        
        }        
      }
    }
    return  newArr;
  })

  const handleConfirm = useCallback(() => {

    alertConfirm({
      title: Constants.appName,
      content: '보도자료를 등록하시겠습니까?',
      onOk: async() => {
        if (inputs.title === "") {
          utils.customAlert("타이틀을 입력해주세요.");
          return;
        }
        if (inputs.contents === "") {
          utils.customAlert("내용을 입력해주세요.");
          return;
        }
        if (inputs.monthly_year === "") {
          utils.customAlert("연도를 선택해주세요.");
          return;
        }
        if (inputs.monthly_month === "") {
          utils.customAlert("달을 선택해주세요.");
          return;
        }
        /* if (inputs.link === "") {
          utils.customAlert("링크정보를 입력해주세요.");
          return;
        } */
        if (mainImg.file === null) {
          utils.customAlert("메인 이미지를 등록해주세요.");
          return;
        }
        const addImgToArray = await addImgUpload(addImg);
        setPress.mutate({
          title: inputs.title,
          contents: inputs.contents,
          monthly_year: inputs.monthly_year,
          monthly_month: inputs.monthly_month,
          link: inputs.link,
          inquiry_charge : inputs.inquiry_charge,
          inquiry_email : inputs.inquiry_email,
          inquiry_tel : inputs.inquiry_tel,
          show_yn : inputs.show_yn,
          main_img_file: mainImg.file,
          add_img_file: null,
          add_img_list : addImgToArray,
          word_file: addPdf.file,
        });
      },
      onCancel: () => {console.log('cancel')}
    });
  });

  const handleCancel = useCallback(() => {
    history.push("/brand/press_release");
  });

  if (setPress.isLoading) {
    return <Progress type="upload" />;
  }

  return (
    <MainContainer active={isdrawer}>        
      <Title>Press Release</Title>
      <StyleDivider />
      <ContentsOuterWrap>
        <ContentsImageWrap>
          <ImgUpload>
            <UploadBox>
              <input
                accept="image/gif, image/jpeg,image/jpg, image/png"
                id="main-img"
                name="main-img"
                type="file"
                onChange={handleMainImgUpload}
              />
              <label htmlFor="main-img">
                {mainImg.img_url === "" ? (
                  <>
                    <div>
                      <UploadImg src={UploadIcon} alt="upload" />
                    </div>
                    <div>대표</div>
                    <div>이미지</div>
                    <div>업로드</div>
                  </>
                ) : (
                  <MainImg imgUrl={mainImg.img_url} />
                )}
              </label>
            </UploadBox>
          </ImgUpload>
        </ContentsImageWrap>
        <ContentsWrap active={isdrawer}>
          <InputWrap1 active={isdrawer}>
            <Input>
              <InputTitle>공개여부</InputTitle>
              <div>
                <SwitchWrap>                  
                  <SwitchDiv onClick={() => handleChange2("show_yn", inputs.show_yn === 'Y' ? 'N' : 'Y')}>
                      <input type="checkbox" style={{ display:"none"}} checked={inputs.show_yn === 'Y' ? true : false} readOnly/>
                      <Marble active={inputs.show_yn === 'Y' ? "on" : "off"} />
                      <SwitchBtn active={inputs.show_yn === 'Y' ? "on" : "off"}>On</SwitchBtn>
                      <SwitchBtn active={!inputs.show_yn === 'Y' ? "on" : "off"}>Off</SwitchBtn>
                  </SwitchDiv>
                </SwitchWrap>
              </div>
            </Input>
            <Input>
              <InputTitle>Title</InputTitle>
              <div>
                <StyleTextField
                  variant="outlined"
                  placeholder="Title"
                  value={inputs.title}
                  name="title"
                  onChange={handleChange}
                />
              </div>
            </Input>
            <Input>
              <InputTitle>Text</InputTitle>
              <div>
                <StyleMultiTextField
                  variant="outlined"
                  placeholder="Text"
                  value={inputs.contents}
                  name="contents"
                  multiline
                  rows={7}
                  onChange={handleChange}
                />
              </div>
            </Input>
          </InputWrap1>
    
          <InputWrap2 active={isdrawer}>
            <Input>
              <InputTitle>Word / PDF File</InputTitle>
              <label htmlFor="add-pdf">
                <PdfUploadDiv>
                  {addPdf.file_name === "" ? "File Upload" : addPdf.file_name}
                  <PdfUploadBtn>
                    <img src={PdfUpload} alt="pdf" />
                  </PdfUploadBtn>
                </PdfUploadDiv>
              </label>
            </Input>
            <Input>
              <InputTitle>Date</InputTitle>
              <SelectWrap>
                <YearSelectBox
                  width="100%"
                  height="42px"
                  name="monthly_year"
                  value={inputs.monthly_year}
                  handleChange={handleSelectChange}
                />
                <MonthSelectBox
                  width="100%"
                  height="42px"
                  name="monthly_month"
                  value={inputs.monthly_month}
                  handleChange={handleSelectChange}
                />
              </SelectWrap>
            </Input>
            <Input>
              <InputTitle>Link</InputTitle>
              <div>
                <StyleTextField
                  variant="outlined"
                  placeholder="Link"
                  value={inputs.link}
                  name="link"
                  onChange={handleChange}
                />
              </div>
            </Input>
            <Input>
              <InputTitle>문의담당자</InputTitle>
              <div>
                <StyleTextFieldShort
                  variant="outlined"
                  placeholder="문의담당자명을 입력하세요"
                  value={inputs.inquiry_charge}
                  name="inquiry_charge"
                  onChange={handleChange}
                />
              </div>
            </Input>
            <Input>
              <InputTitle>문의연락처</InputTitle>
              <div>
                <StyleTextFieldShort
                  variant="outlined"
                  placeholder="문의연락처를 입력하세요"
                  value={inputs.inquiry_tel}
                  name="inquiry_tel"
                  onChange={handleChange}
                />
              </div>
            </Input>
            <Input>
              <InputTitle>문의이메일</InputTitle>
              <div>
                <StyleTextField
                  variant="outlined"
                  placeholder="문의이메일을 입력하세요"
                  value={inputs.inquiry_email}
                  name="inquiry_email"
                  onChange={handleChange}
                />
              </div>
            </Input>
          </InputWrap2>
        </ContentsWrap>
      </ContentsOuterWrap>

      <AddImgWrap>
        <label htmlFor="add-img">
          <AddImgBtn>
            <AddImg src={AddImgIcon} alt="add" />
            이미지 업로드
          </AddImgBtn>
        </label>
      </AddImgWrap>
      <ImagesWrap active={addImg.length > 0 ? true : false}>
        {addImg.map((d,index) => (
          d.img_url !== "" && (
          <AddImg_ imgUrl={d.img_url} key={index}>
            <DelAddImg onClick={()=>handleAddImgDelBtn(index)}>
              <img src={DelBtnImg} alt="del img" />
            </DelAddImg>
          </AddImg_>
          )
        ))
        }
        {/* {addImg.img_url !== "" && (
          <AddImg_ imgUrl={addImg.img_url}>
            <DelAddImg onClick={handleAddImgDelBtn}>
              <img src={DelBtnImg} alt="del img" />
            </DelAddImg>
          </AddImg_>
        )} */}
      </ImagesWrap>

      <AddInputs
        ref={addImgRef}
        accept="image/gif, image/jpeg,image/jpg, image/png"
        id="add-img"
        name="add-img"
        type="file"
        onChange={handleAddImgUpload}
      />

      <AddInputs
        ref={addPdfRef}
        accept="application/pdf,application/msword,
        application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        id="add-pdf"
        name="add-pdf"
        type="file"
        onChange={handleAddPdfUpload}
      />

      <BottomWrap>
        <BtnWrap type="cancel" onClick={handleCancel}>
          <BtnImgWrap>
            <img src={CancelIcon} alt="close"></img>
          </BtnImgWrap>
          <CancelTxt>Cancel</CancelTxt>
        </BtnWrap>
        <BtnWrap type="confirm" onClick={handleConfirm}>
          <BtnImgWrap>
            <img src={CheckIcon} alt="check"></img>
          </BtnImgWrap>
          <ConfirtTxt>Confirm</ConfirtTxt>
        </BtnWrap>
      </BottomWrap>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    width: ${(props) => (props.active ? "1920px" : "1560px")};
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: ${(props) => (props.active ? "1250px" : "960px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "100%" : "100%")};  
  } 
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #cccccc;
`;

const StyleDivider = styled(Divider)`
  height: 2px;
  background-color: #dddddd;
  margin: 18px 0 18px 0;
`;
const ContentsOuterWrap = styled.div`
  display: flex;
  margin-top: 50px;
`;
const ContentsImageWrap = styled.div`
  display: flex;
`;
const ContentsWrap = styled.div`
  width : 96%;
  min-width: 300px;
`;

const ImgUpload = styled.div`
  margin-right: 40px;
`;

const InputWrap1 = styled.div`
  width:96%;
`;

const InputWrap2 = styled.div`
  width:96%;
  margin-top:20px;
`;

const UploadBox = styled.div`
  width: 152px;
  height: 228px;
  border: solid 2px #dddddd;
  font-size: 16px;
  font-weight: 500;
  color: #999999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  input {
    display: none;
  }

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    width: 152px;
    height: 228px;
  }
`;

const UploadImg = styled.img`
  margin-bottom: 5px;
`;

const InputTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 14px;
`;

const Input = styled.div`
  & + & {
    margin-top: 40px;
  }
`;

const StyleTextField = styled(TextField)`
  width: 100%;
  .MuiOutlinedInput-root {
    height: 42px;
    border-radius: 5px;
    font-size: 16px;
  }
  .MuiOutlinedInput-input {
    padding: 13px 14px;
  }
  .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }
`;

const StyleTextFieldShort = styled(TextField)`
  width: 300px;
  .MuiOutlinedInput-root {
    height: 42px;
    border-radius: 5px;
    font-size: 16px;
  }
  .MuiOutlinedInput-input {
    padding: 13px 14px;
  }
  .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }
`;

const StyleMultiTextField = styled(TextField)`
  width: 100%;
  .MuiOutlinedInput-root {
    border-radius: 5px;
    font-size: 16px;
  }
  .MuiOutlinedInput-multiline {
    padding: 13px 14px;
  }
  .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }
`;

const AddImgWrap = styled.div``;

const AddImgBtn = styled.div`
  width: 100%;
  height: 60px;
  background-color: #f1f2ea;
  margin-top: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 2px solid #dddddd;
  font-size: 20px;
  font-weight: 500;
  color: #999999;
  cursor: pointer;
`;

const AddImg = styled.img`
  margin-right: 5.5px;
`;

const ImagesWrap = styled.div`
  border-bottom: 1px solid #dddddd;
  display:flex;
  ${(props) =>
    props.active &&
    css`
      padding: 20px 0 24px 0;
    `}
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 60px 20px;
`;
const BtnWrap = styled.div`
  width: 180px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.type === "cancel" ? "#ffffff" : "#7ea1b2"};
  border: ${(props) =>
    props.type === "cancel" ? "solid 1px #dddddd" : "none"};
  border-radius: 5px;
  transition: all 0.3s;

  ${(props) =>
    props.type === "cancel" &&
    css`
      &:hover {
        background-color: ${darken(0.1, "#ffffff")};
      }
      &:active {
        background-color: ${darken(0.2, "#ffffff")};
      }
    `}

  ${(props) =>
    props.type === "confirm" &&
    css`
      &:hover {
        background-color: ${darken(0.1, "#7ea1b2")};
      }
      &:active {
        background-color: ${darken(0.2, "#7ea1b2")};
      }
    `} 

  & + & {
    margin-left: 10px;
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

const MainImg = styled.div`
  width: 152px;
  height: 224px;
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}") no-repeat center;
          background-size: contain;
          background-color: #e7e7e7;
        `
      : css`
          background-color: #dddddd;
        `}
`;

const AddImg_ = styled.div`
  position: relative;
  width: 152px;
  height: 224px;
  border: solid 1px #dddddd;
  margin-right:10px;
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}") no-repeat center;
          background-size: contain;
          background-color: #e7e7e7;
        `
      : css`
          background-color: #dddddd;
        `}
`;

const DelAddImg = styled.div`
  float: right;
  cursor: pointer;
`;

const SelectWrap = styled.div`
  display: flex;
  max-width: 600px;
  min-width: 400px;
  justify-content: space-between;
`;

const PdfUploadDiv = styled.div`
  width: 100%;
  height: 45px;
  border-radius: 5px;
  font-size: 16px;
  border: 1px solid #dddddd;
  color: #999999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  cursor: pointer;
`;

const PdfUploadBtn = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 5px;
  background-color: #7ea1b2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    max-width: 16px;
  }
`;

const AddInputs = styled.input`
  display: none;
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
