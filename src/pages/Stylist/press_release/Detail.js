import React from "react";
import styled from "styled-components";
import { darken } from "polished";
import { useQuery } from "react-query";

import DownloadIcon from "assets/press_download_icon.png";
import { apiObject } from "api/api_stylist";
import { MONTH_FULL_CHANGE } from "mock/Mock";
import Progress from "components/common/progress";
import utils from "utils";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import Constants from 'utils/constants';

export default function PressReleaseDetail({ match }) {
  const press_no = match.params.press_no;
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);

  const handleFileDownload = () => {
    if ( !utils.isEmpty(detailData.word_file_full_adres)) {
      let chk = detailData.word_file_full_adres.split(".").pop().toLowerCase();
      if (chk === "pdf") {
        utils.downloadURI(detailData.word_file_full_adres, "application/pdf");
      } else if (chk === "doc") {
        utils.downloadURI(detailData.word_file_full_adres, "application/msword");
      } else {
        alert("등록된 파일이 pdf/doc 파일이 아닙니다.");
      }
    }else{
      alert("등록된 파일이 없습니다.");
    }
  };

  const pressDetail = useQuery(
    ["stylist-press-detail", press_no],
    async () => await apiObject.getPressDetail({ id: press_no })
  );

  const detailData = pressDetail.isLoading ? [] : pressDetail.data.test[0];

  if (pressDetail.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <Container>
      <Title>{detailData.title}</Title>
      <SubTitleWrap active={isdrawer}>
        <SubTitle>
          Monthly {detailData.monthly_year}{" "}
          {
            MONTH_FULL_CHANGE.find((v) => v.input === detailData.monthly_month)
              .output
          }
        </SubTitle>
        <BtnWrap active={isdrawer}>
          {(detailData.word_file_adres !== null ||
            detailData.word_file_adres !== "") && (
            <Btn onClick={handleFileDownload}>
              <BtnIcon src={DownloadIcon} alt="download" />
              Download
            </Btn>
          )}
        </BtnWrap>
      </SubTitleWrap>
      <ContentsWrap active={isdrawer}>
        <ImgWrap active={isdrawer}>
          <img src={detailData.img_url_adres} alt="image" />
        </ImgWrap>
        <TextWrap active={isdrawer}>
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
    </Container>
  );
}

const Container = styled.div`
  padding-bottom:100px;
  @media (min-width: 1920px) {
    width:1500px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width:970px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width:620px;
  } 
`;
const Title = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
`;

const SubTitleWrap = styled.div`
  margin-top: 24px;
  @media (min-width: 1920px) {
    display: flex;
    justify-content: space-between;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    display: flex;
    justify-content: space-between;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    display: relative;
    justify-content : center;
  } 
`;

const SubTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
`;

const BtnWrap = styled.div`
  @media (min-width: 1920px) {
    display: flex;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    display: flex;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    display: flex;
    justify-content: flex-end;
    margin-top : 0px;
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
  margin-top: 64px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const ImgWrap = styled.div`
  justify-content: center;
  @media (min-width: 1920px) {
    width: 406px;
    display: flex;
    margin-right: 40px;
    img {
      max-width: 406px;
    }
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 406px;
    display: flex;
    margin-right: 40px;
    img {
      max-width: 406px;
    }
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width :200px;
    margin-right: 20px;
    img {
      max-width: 200px;
    }
  } 
`;

const TextWrap = styled.div`
  max-width: 500px;
  @media (min-width: 1920px) {
    width: 500px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 500px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 400px;
  } 
  display: flex;
  flex-direction: column;
  font-size: 15px;
  line-height: 30px;
  color: #555555;
`;
