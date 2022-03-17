import React, { useState } from "react";
import styled from "styled-components";
import { darken } from "polished";
import { useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";

import DownloadIcon from "assets/press_download_icon.png";
import { apiObject } from "api/api_common";
import { MONTH_FULL_CHANGE } from "mock/Mock";
import utils from "utils";
import Progress from "components/common/progress";
import Constants from 'utils/constants';

const Container = styled.div`
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: 1500px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: 1200px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: 900px;
  } 
  display: flex;
  flex-direction: column;
  padding: 80px;
`;

const Title = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
`;

const SubTitleWrap = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
`;

const SubTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
`;

const BtnWrap = styled.div`
  display: flex;
`;

const InquiryWrap = styled.div`
  margin-top: 24px;  
  margin-bottom: 14px;  
`;
const ContactTxt = styled.div`
  font-size: 18px;

  & + & {
    margin-left: 10px;
  }
`;

const Btn = styled.div`
  width: 132px;
  height: 50px;
  border-radius: 5px;
  border: solid 1px #dddddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
  &:active {
    background-color: ${darken(0.2, "#ffffff")};
  }

  & + & {
    margin-left: 12px;
  }
`;

const BtnIcon = styled.img`
  margin-right: 5px;
`;

const ContentsWrap = styled.div`
  margin: 64px 0 80px 0;
  width:90%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;
const ImgWrap = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 350px; 
  margin-right: 40px;  
  img {
      max-width: 350px;
      & {
        margin-top :20px;
      }
  }
`;


const Img = styled.img`
  max-width: 350px;
 
`;

const TextWrap = styled.div`
  max-width: calc( 100% - 400px);
  display: flex;
  flex-direction: column;
  font-size: 15px;
  line-height: 30px;
  color: #555555;
`;

export default function PressReleaseDetail({ match }) {
  const history = useHistory();
  const location = useLocation();
  const share_uuid = match.params.uuid;

  const pressDetail = useQuery(
    ["share-press-detail", share_uuid],
    async () => await apiObject.getPressShare({ share_uuid: share_uuid })
  );

  const detailData = pressDetail.isLoading ? [] : pressDetail.data;

  const handleFileDownload = (file) => {
 
    if ( !utils.isEmpty(file)) {
      let chk = file.split(".").pop().toLowerCase();
      if (chk === "pdf") {
        utils.downloadURI(file, "application/pdf");
      } else if (chk === "doc" || chk === "docx") {
        utils.downloadURI(file, "application/msword");
      } else {
        utils.customAlert("등록된 파일이 pdf/doc 파일이 아닙니다.");
      }
    }else{
      utils.customAlert("등록된 파일이 없습니다.");
    }
  };

  if (pressDetail.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <Container>
        {detailData !== undefined ? (
          <>
            <Title>{detailData.title}</Title>
            <SubTitleWrap>
              <SubTitle>
                Monthly {detailData.monthly_year}{" "}
                {
                  MONTH_FULL_CHANGE.find(
                    (v) => v.input === detailData.monthly_month
                  ).output
                }
              </SubTitle>
              <BtnWrap>
                {(detailData.word_file_full_adres !== null ||
                  detailData.word_file_full_adres !== "") && (
                  <Btn
                    onClick={() =>
                      handleFileDownload(detailData.word_file_full_adres)
                    }
                  >
                    <BtnIcon src={DownloadIcon} alt="download" />
                    Download
                  </Btn>
                )}
              </BtnWrap>
            </SubTitleWrap>
            {!utils.isEmpty(detailData.inquiry_charge) || !utils.isEmpty(detailData.inquiry_tel) || !utils.isEmpty(detailData.inquiry_email) &&
            <InquiryWrap>          
                <ContactTxt>
                  문의 : {!utils.isEmpty(detailData.inquiry_charge) && (" "+detailData.inquiry_charge)}
                  { !utils.isEmpty(detailData.inquiry_tel) && (" "+utils.phoneFormat(detailData.inquiry_tel))}
                  {!utils.isEmpty(detailData.inquiry_email) && (" "+detailData.inquiry_email)}
                </ContactTxt>
            </InquiryWrap>
            }
            <ContentsWrap>
              <ImgWrap>
                <Img src={detailData.main_img_full_adres} alt="image" />               
                { 
                  !utils.isEmpty(detailData.add_full_img_list) &&
                  detailData.add_full_img_list.length > 0 &&
                  detailData.add_full_img_list.map((imgd,index) => (
                    <img src={imgd} alt="image" key={index} />
                  ))
                }
              </ImgWrap>
              <TextWrap>
                {detailData.contents.split("\n").map((line, i) => {
                  return (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  );
                })}
              </TextWrap>
            </ContentsWrap>
          </>
        ) : (
          <div>페이지가 존재하지 않습니다.</div>
        )}
      </Container>
    </>
  );
}
