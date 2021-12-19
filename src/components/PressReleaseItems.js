import React, { useState, useRef, useCallback } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import PressIcon02 from "assets/press_icon_02.png";
import PressIcon03 from "assets/press_icon_03.png";
import PressIcon04 from "assets/press_icon_04.png";
import HideIcon from "assets/icon_hide.png";
import useOutsideClick from "./UseOutsideClick";
import utils from "utils";
import { apiObject } from "api/api_brand";
import ShareDialog from "components/brand/press_release/ShareDialog";

const Container = styled.div`
  position: relative;
`;

const ItemCardWrap = styled.div`
  width: 250px;
  height: 400px;
  background-color: #f1f2ea;
  border-radius: 10px;
  padding: 20px;
  margin-left: 17px;
  margin-bottom: 34px;
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: ${darken(0.1, "#f1f2ea")};
  }
`;

const ImgWrap = styled.div`
  display: flex;
  width: 210px;
  height: 315px;
  justify-content: center;
  overflow: hidden;
  align-items: center;
`;

const Img = styled.div`
  width: 210px;
  height: 315px;
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
        `}
`;
const ItemName = styled.div`
  width: 210px;  
  font-weight: 500;
  font-size: 14px;
  margin-top: 19px;
  overflow:hidden;
`;

const PressIconWrap = styled.div``;

const PressDetailWrap = styled.div`
  display: flex;
  align-itesm: center;
  cursor: pointer;
`;

const PressIcon = styled.div`
  width: ${(props) => (props.active ? "32px" : "127px")};
  height: 32px;
  border-radius: 100px;
  background-color: #000000;
  position: absolute;
  top: 30px;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.active ? "center" : "space-between")};
  padding: ${(props) => (props.active ? "0" : "0 20px")};
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  .MuiSvgIcon-root {
    font-size: 28px;
  }

  &:hover {
    background-color: #908cc1;
  }
`;


const HideOuterWrap = styled.div`
  & :nth-child(1){
    margin-top:5px;
    margin-left:15px;    
  }
`;

const IconWrap = styled.div`
  position: absolute;
  top: 25px;
  left: 5px;
  z-index: 3;
`;

function PressReleaseItems({ data ,isBrand=false}) {
  const history = useHistory();
  const ref = useRef();
  const [open, setOpen] = useState(false);

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const domain = window.location.href.split("brand/press_release")[0];

  useOutsideClick(ref, () => {
    setOpen(false);
  });

  const handleDetail = useCallback((press_no) => {
    history.push("/brand/press_release/detail/" + press_no);
  });

  const handleFileDownload = () => { 

    if ( !utils.isEmpty(data.word_file_full_adres)) {
      let chk = data.word_file_full_adres.split(".").pop().toLowerCase();
      if (chk === "pdf") {
        utils.downloadURI(data.word_file_full_adres, "application/pdf");
      } else if (chk === "doc" || chk === "docx") {
        utils.downloadURI(data.word_file_full_adres, "application/msword");
      } else {
        utils.customAlert("등록된 파일이 pdf/doc 파일이 아닙니다.");
      }
    }else{
      utils.customAlert("등록된 파일이 없습니다.");
    }
  };

  const handleLinkShare = useCallback((press_no) => {
    shareUuid.mutate({ press_no: press_no });
  });

  const shareUuid = useMutation(
    ["press-share-url"],
    (value) =>
      apiObject.getPressShareUrl({
        brand_press_no: value.press_no,
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

  return (
    <>
      <Container>
        <ItemCardWrap onClick={() => handleDetail(data.brand_press_no)}>
          <ImgWrap>
            <Img imgUrl={data.main_img_full_adres} />
          </ImgWrap>
          <ItemName>{data.title}</ItemName>
          {
            isBrand && data.show_yn == 'N' &&
            <HideOuterWrap>
              <IconWrap>
                <img src={HideIcon} alt="best" style={{width:'25px'}} />
              </IconWrap>
            </HideOuterWrap>
          }
        </ItemCardWrap>
        {/* <PressIconWrap>
          <PressIcon
            active={!open}
            onMouseOver={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {!open ? (
              <MoreVertIcon />
            ) : (
              <>
                <PressDetailWrap onClick={handleFileDownload}>
                  <img src={PressIcon03} alt="download" />
                </PressDetailWrap>
                <PressDetailWrap
                  onClick={() => handleLinkShare(data.brand_press_no)}
                >
                  <img src={PressIcon02} alt="link" />
                </PressDetailWrap>
                <PressDetailWrap
                  onClick={() => handleDetail(data.brand_press_no)}
                >
                  <img src={PressIcon04} alt="detail" />
                </PressDetailWrap>
              </>
            )}
          </PressIcon>
        </PressIconWrap> */}
      </Container>

      <ShareDialog
        open={shareDialogOpen}
        setOpen={setShareDialogOpen}
        shareUrl={shareUrl}
      />
    </>
  );
}

export default React.memo(PressReleaseItems);
