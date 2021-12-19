import React, { useState } from "react";
import styled from "styled-components";
import { darken } from "polished";
import { useQuery, useMutation } from "react-query";
import { useHistory } from "react-router-dom";

import DownloadIcon from "assets/press_download_icon.png";
import ShareIcon from "assets/press_share_icon.png";
import { apiObject } from "api/api_brand";
import { MONTH_FULL_CHANGE } from "mock/Mock";
import utils from "utils";
import Progress from "components/common/progress";
import ShareDialog from "components/brand/press_release/ShareDialog";
import Constants from 'utils/constants';
import KakaoShareButton from 'components/common/KakaoShareButton';
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
export default function PressReleaseDetail({ match }) {
  const history = useHistory();
  const press_no = match.params.press_no;
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  // const domain = "http://fpr-prod-web.s3-website.ap-northeast-2.amazonaws.com/";
  const domain = window.location.href.split("brand/press_release/")[0];

  const pressDetail = useQuery(
    ["brand-press-detail", press_no],
    async () =>
      await apiObject.getPressDetail({
        brand_press_no: press_no,
      })
  );

  const detailData = pressDetail.isLoading ? [] : pressDetail.data;

  const handleFileDownload = () => {
    console.log('detailData.word_file_adres',detailData)
    if ( !utils.isEmpty(detailData.word_file_full_adres)) {
      let chk = detailData.word_file_full_adres.split(".").pop().toLowerCase();
      if (chk === "pdf") {
        utils.downloadURI(detailData.word_file_full_adres, "application/pdf");
      } else if (chk === "doc" || chk === "docx") {
        utils.downloadURI(detailData.word_file_full_adres, "application/msword");
      } else {
        utils.customAlert("등록된 파일이 pdf/doc 파일이 아닙니다.");
      }
    }else{
      utils.customAlert("등록된 파일이 없습니다.");
    }
  };

  const handleEdit = () => {
    history.push("/brand/press_release/edit/" + press_no);
  };

  const handleLinkShare = () => {
    getShareUrl.mutate();
  };

  const getShareUrl = useMutation(
    ["press-share-url", press_no],
    () =>
      apiObject.getPressShareUrl({
        brand_press_no: press_no,
      }),
    {
      onSuccess: (data) => {
        setShareUrl(domain + "share-press/" + data.share_uuid);
        setShareDialogOpen(true);
      },
      onError: () => {
        utils.customAlert("Share Url Error");
      },
    }
  );

  if (pressDetail.isLoading) {
    return <Progress type="load" />;
  } 
  console.log("detailData : ", detailData);
  return (
    <MainContainer active={isdrawer}>  
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
          <Btn onClick={handleLinkShare}>
            <BtnIcon src={ShareIcon} alt="share" />
            Link share
          </Btn>
          { !utils.isEmpty(detailData.share_uuid) &&
          <Btn2>
            <KakaoShareButton 
              shareUrl={domain + "share-press/" + detailData.share_uuid}
              title={detailData.title} 
              imgUrl={!utils.isEmpty(detailData.main_img_full_adres)? detailData.main_img_full_adres : null}
            />
          </Btn2>
          }
          <Btn onClick={handleEdit}>Edit</Btn>
        </BtnWrap>
      </SubTitleWrap>
      <InquiryWrap>          
          <ContactTxt>
            문의 : {!utils.isEmpty(detailData.inquiry_charge) && (" "+detailData.inquiry_charge)}
            { !utils.isEmpty(detailData.inquiry_tel) && (" "+utils.phoneFormat(detailData.inquiry_tel))}
            {!utils.isEmpty(detailData.inquiry_email) && (" "+detailData.inquiry_email)}
          </ContactTxt>
      </InquiryWrap>
      <ContentsWrap active={isdrawer}>
        <ImgWrap active={isdrawer}>
          <img src={detailData.main_img_full_adres} alt="image" />
          { 
            !utils.isEmpty(detailData.add_full_img_list) &&
            detailData.add_full_img_list.length > 0 &&
            detailData.add_full_img_list.map((imgd,index) => (
              <img src={imgd} alt="image" key={index} />
            ))
          }
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

      <ShareDialog
        open={shareDialogOpen}
        setOpen={setShareDialogOpen}
        shareUrl={shareUrl}
      />
    </MainContainer>
  );
}
const MainContainer = styled.div`
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1920px" : "1560px")};
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "960px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "100%" : "100%")};  
  } 
`;


const Title = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
`;

const SubTitleWrap = styled.div`
  margin-top: 24px;
  margin-right: 24px;
  @media (min-width: 1920px) {
    display: flex;
    justify-content: space-between;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    display: flex;
    justify-content: space-between;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    display: ${(props) => (props.active ? "flex" : "relative")};
    justify-content : ${(props) => (props.active ? "space-between" : "center")};
   
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
    margin-top : ${(props) => (props.active ? "0px" : "20px")};
  } 
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
const Btn2 = styled.div`
  width: 60px;
  height: 50px;
  margin-left:20px;  
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;

`;
const BtnIcon = styled.img`
  margin-right: 5px;
`;

const ContentsWrap = styled.div`
  margin: 64px 20px 80px 0;
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

const TextWrap = styled.div`
  width:calc( 100% - 350px);
  display: flex;
  flex-direction: column;
  font-size: 15px;
  line-height: 30px;
  color: #555555;
`;
