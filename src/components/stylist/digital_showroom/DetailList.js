import React, { useState, useCallback } from "react";
import styled, { css } from "styled-components";
import { TextField, Divider } from "@material-ui/core";
import {
  CheckBoxOutlined,
  CheckBoxOutlineBlankOutlined,
} from "@material-ui/icons";
import DownloadIcon from "assets/digitalshowroom/download_btn.svg";
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";

import { apiObject } from "api/api_common";
import utils from "utils";

import awsmobile from "../../../aws-exports";
import AWS from 'aws-sdk';
AWS.config.update({
  accessKeyId: awsmobile.accessKeyId, 
  secretAccessKey: awsmobile.secretAccessKey,
  region: awsmobile.aws_user_files_s3_bucket_region,
});

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
  while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
      type: mime
  });
}

function downloadImg(imgSrc) {
  var image = new Image();
  image.crossOrigin = "anonymous";
  image.src = imgSrc;
  var fileName = image.src.split("/").pop();
  image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      canvas.getContext('2d').drawImage(this, 0, 0);
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(dataURLtoBlob(canvas.toDataURL()), fileName);
      } else {
          var link = document.createElement('a');
          link.href = canvas.toDataURL();
          link.download = fileName;
          link.click();
      }
  };
}

export default function DetailList({data,showroomNm = null,mainImg,season_year,season_text}) {
  // const [onImg, setOnImg] = useState(
  //   data.sample_image_list.find((v) => v.main_yn).full_url
  // );
  const [onImg, setOnImg] = useState("");
  const [focus, setFocus] = useState(false);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const handleSubImgClick2 = useCallback(
    (url) => {
      setOnImg(url);
    },
    [onImg]
  );

  const handleSubImgClick = (url) => {
    setOnImg(url);
  }

  const handleImgDownload = async() => {
    const s3 = new AWS.S3();
    let downloadImage = onImg === "" ? mainImg : onImg;
    const filename = downloadImage.substring(downloadImage.lastIndexOf("/") + 1).split("?")[0];
    const params = {
      Bucket: "fpr-prod-file",
      Key: `public/showroomImage/${filename}`,
    };
    const fileType = await utils.getExtensionOfFilename(downloadImage);
    let fileMimeType = "image/png";
    switch(fileType) {
      case 'jpeg' :
      case 'jpg' : fileMimeType = "image/jpg"; break;
      case 'gif' : fileMimeType = "image/gif"; break;
      case 'svg' : fileMimeType = "image/svg+xml"; break;
      default : fileMimeType = "image/png";
    }
    function downloadBlob(blob, name = `${filename}`) {
      // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
      const blobUrl = URL.createObjectURL(blob);
      // Create a link element
      const link = document.createElement('a');
      // Set link's href to point to the Blob URL
      link.href = blobUrl;
      link.download = name;
      // Append link to the body
      document.body.appendChild(link);
      // Dispatch click event on the link
      // This is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );

      // Remove link from body
      document.body.removeChild(link);
    }

    s3.getObject(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        let imageBlob = new Blob([data.Body], {
          type: fileMimeType
        });
        downloadBlob(imageBlob, `${filename}`);
      }
    });

  }
 
  return (
    <>
      <MainContainer active={isdrawer}>
        <>
          <ImgWrap active={isdrawer}>
            <ImgCover
              active={focus}
              onMouseOver={() => setFocus(true)}
              onMouseLeave={() => setFocus(false)}
              onClick={handleImgDownload}
            >
              <img src={DownloadIcon} alt="download" />
            </ImgCover>
            <Img
              imgUrl={onImg === "" ? mainImg : onImg}
              onMouseOver={() => setFocus(true)}
              onMouseLeave={() => setFocus(false)}
            />
            <SubImgWrap>
              {data.sample_image_list.map(
                (d, i) =>
                  data.sample_image_list.length > 1 && (
                    <SubImg
                      key={d.url}
                      imgUrl={d.full_url}
                      // alt={`sub_img_${i}`}
                      // active={d.full_url === onImg ? true : false}
                      active={
                        onImg === ""
                          ? d.full_url === mainImg
                            ? true
                            : false
                          : d.full_url === onImg
                          ? true
                          : false
                      }
                      onClick={() => handleSubImgClick(d.full_url)}
                    />
                  )
              )}
            </SubImgWrap>
          </ImgWrap>
          <DetailWrap active={isdrawer}>
            {showroomNm !== null && <ItemNm>{showroomNm}</ItemNm>}
            <StyleDivider />
            <div>
              <SubTitle>
                <TitleName>Sample name</TitleName>
                <TitleValue>{data.sample_nm}</TitleValue>
              </SubTitle>
              <StyleDividerSub />
              <SubTitle>
                <TitleName>Season</TitleName>
                <TitleValue>
                  {season_year} {season_text}
                </TitleValue>
              </SubTitle>
              <StyleDividerSub />
              <SubTitle>
                <TitleName>Gender</TitleName>
                <TitleValue>{data.gender_text}</TitleValue>
              </SubTitle>
              <StyleDividerSub />
              <SubTitle>
                <TitleName>Category</TitleName>
                <TitleValue>
                  {data.category_middle_text === null
                    ? data.sample_catgry_direct_input
                    : data.category_middle_text}
                </TitleValue>
              </SubTitle>
              <StyleDividerSub />
              <SubTitle>
                <TitleName>Color</TitleName>
                {/* <TitleValue>{data.color_text}</TitleValue> */}
                <TitleValue>
                  {data.color_text?.map((d, i) =>
                    i === data.color_text.length - 1 ? d : d + ", "
                  )}
                </TitleValue>
              </SubTitle>
              <StyleDividerSub />
              <SubTitle>
                <TitleName>Material</TitleName>
                <TitleValue>{data.material_text || "-"}</TitleValue>
              </SubTitle>
              <StyleDividerSub />
              <SubTitle>
                <TitleName>Stock</TitleName>
                <TitleValue>
                  {data.buying_text?.map((d, i) =>
                    i === data.buying_text.length - 1 ? d : d + ", "
                  )}
                </TitleValue>
              </SubTitle>
              <StyleDividerSub />
              <SubTitle>
                <TitleName>Size</TitleName>
                <TitleValue>
                  {data.size_text === null
                    ? data.size_direct_input
                    : data.size_text}
                </TitleValue>
              </SubTitle>
              <StyleDividerSub />
              <SubTitle>
                <TitleName>SKU (Style #)</TitleName>
                <TitleValue>{data.sku || "-"}</TitleValue>
              </SubTitle>
              <StyleDividerSub />
              <SubTitle>
                <TitleName>Price</TitleName>
                <TitleValue>
                  {data.price === null
                    ? "가격미정"
                    : utils.numberWithCommas(data.price)}
                </TitleValue>
              </SubTitle>
              <StyleDividerSub />
              <SubTitle>
                <TitleName>샘플 입고</TitleName>
                <TitleValue>
                  {data.in_yn ? (
                    <CheckBoxOutlined />
                  ) : (
                    <CheckBoxOutlineBlankOutlined />
                  )}
                </TitleValue>
              </SubTitle>
              <StyleDividerSub />
              <SubTitle2>
                <TextFieldTitle>Caption</TextFieldTitle>
                <StyledTextField
                  multiline
                  placeholder="-"
                  rows={4}
                  variant="outlined"
                  value={data.caption_korean}
                  disabled={true}
                />
                <StyledTextField
                  multiline
                  placeholder="-"
                  rows={4}
                  variant="outlined"
                  value={data.caption_english}
                  disabled={true}
                />
              </SubTitle2>
              <Etc>
                <EtcTxt>기타사항</EtcTxt>
                <TextField
                  multiline
                  placeholder="-"
                  rows={2}
                  variant="outlined"
                  value={data.etc}
                  disabled={true}
                />
              </Etc>
            </div>
          </DetailWrap>          
        </>        
      </MainContainer>
    </>
  );
}


const MainContainer = styled.div`
  @media (min-width: 1920px) {
    width: ${(props) => (props.active ? "1920px" : "1560px")};     
    display: flex;
    justify-content: center;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: ${(props) => (props.active ? "1340px" : "1030px")};  
    display: flex;
    justify-content: center;  
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "100%" : "100%")};
    display: ${(props) => (props.active ? "flex" : "relative")};
    justify-content: center;
  } 
`;

const ImgWrap = styled.div`
  position: relative;  
  max-width: 350px;
  margin-right:50px;
`;

const Img = styled.div`
  width: 350px;
  height: 506px;
  border: solid 1px #dddddd;
  ${(props) =>
    props.imgUrl !== null
      ? css`
          background: url("${(props) => props.imgUrl}") no-repeat center;
          background-size: contain;
          background-color: #e7e7e7;
        `
      : css`
          background-color: #dddddd;
        `}}
`;

const ImgCover = styled.div`
  width: 132px;
  height: 50px;
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  visibility: ${(props) => (props.active && "visible") || "hidden"};
`;

const DetailWrap = styled.div`
  display: flex;
  width: 444px;
  flex-direction: column;
  margin-bottom: 85px;
  
  @media (min-width: 10px) and (max-width: 1439px) {
    margin-top : ${(props) => (props.active && "0px") || "50px"};
    margin-left : ${(props) => (props.active && "50px") || "0px"};
  } 
`;

const ItemNm = styled.div`
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 20px;
`;

const StyleDivider = styled(Divider)`
  width: 100%;
  background-color: #000000;
  margin-bottom: 40px;
`;

const StyleDividerSub = styled(Divider)`
  width: 100%;
  background-color: #dddddd;
  margin: 11px 0 26px 0;
`;

const SubTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
`;

const SubTitle2 = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
`;

const TitleName = styled.div`
  font-weight: bold;
`;

const TitleValue = styled.div`
  color: #555555;
`;

const TextFieldTitle = styled.div`
  margin-bottom: 12px;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 12px;
`;

const Etc = styled.div`
  font-size: 20px;
  display: flex;
  flex-direction: column;
`;

const EtcTxt = styled.div`
  font-weight: bold;
  margin-bottom: 12px;
`;

const SubImgWrap = styled.div`
  margin-top: 20px;
  display: flex;
  max-width:400px;
  overflow: auto;  
`;

const SubImg = styled.div`
  min-width: 88px;
  min-height: 124px;
  cursor: pointer;
  opacity: 0.5;

  & + & {
    margin-left: 20px;
  }

  ${(props) =>
    props.active &&
    css`
      opacity: 1;
    `}

    ${(props) =>
      props.imgUrl !== null
        ? css`
            background: url("${(props) => props.imgUrl}") no-repeat center;
            background-size: contain;
            background-color: #e7e7e7;
          `
        : css`
            background-color: #dddddd;
          `}}
`;