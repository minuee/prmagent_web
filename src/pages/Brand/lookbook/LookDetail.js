import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { useQuery, useMutation } from "react-query";
import DetailList from "components/brand/digital_showroom/DetailList";

import { apiObject } from "api/api_brand";
import PrevArrow from "assets/prev_arrow.png";
import NextArrow from "assets/next_arrow.png";
import { useReactToPrint } from "react-to-print";
import Progress from "components/common/progress";
import ShareDialog from "components/ShareDialog";
import utils from "utils";

import Constants from 'utils/constants';
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import KakaoShareButton from 'components/common/KakaoShareButton';

export default function LookDetail({ match }) {
  const history = useHistory();
  const [isShow, setIsShow] = useState(true);
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const domain = window.location.href.split("brand/lookbook/")[0];
  //console.log("domain : ", domain);

  const lookbookNo = match.params.lookbook_no;
  const showroomNo = match.params.showroom_no;

  const { isLoading, data } = useQuery(
    ["brand-lookbook-showroom", lookbookNo, showroomNo],
    async () =>
      await apiObject.getLookbookShowroom({
        lookbook_no: lookbookNo,
        showroom_no: showroomNo,
      })
  );

  const printContentsRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printContentsRef.current,
    onBeforeGetContent: (d) => {
      return d;
    },
  });

  const handlePrintPre = async() => {
    await setIsShow(false);
    handlePrint();
    setTimeout(() => {setIsShow(true);}, 2000);
  };


  const handleClick = (no) => {
    history.push("/brand/lookbook/look_detail/" + lookbookNo + "/" + no);
  };

  const handleEdit = () => {
    history.push("/brand/lookbook/edit/" + lookbookNo);
  };

  const handleLinkShare = () => {
    getShareUrl.mutate();
  };

  const getShareUrl = useMutation(
    ["lookbook-share-url", lookbookNo],
    () =>
      apiObject.getShareLookbook({
        lookbook_no: lookbookNo,
      }),
    {
      onSuccess: (data) => {
        setShareUrl(domain + "share-lookbook/" + data.share_uuid);
        setShareDialogOpen(true);
      },
      onError: () => {
        utils.customAlert("Share Url Error");
      },
    }
  );

  console.log('dddd',data)
  if (isLoading) {
    return <Progress type="load" />;
  }

  return (
    <div ref={printContentsRef}>
      <Container active={isdrawer}>
        <TitleTxt>LookBook</TitleTxt>
        <HeadWrap active={isdrawer}>
          <LeftWrap>
            <Text numberOfLines={1}>{data.lookbook_nm}</Text>
          </LeftWrap>
          <RightWrap isShow={isShow}>
            <Btn onClick={handleEdit}>Edit</Btn>
            <Btn onClick={handlePrintPre}>Print</Btn>
            <Btn onClick={handleLinkShare}>Share</Btn>
            { !utils.isEmpty(data.lookbookData.share_uuid) &&
            <Btn2>
              <KakaoShareButton 
                shareUrl={domain + "share-lookbook/" + data.lookbookData.share_uuid}
                title={data.lookbook_nm} 
                imgUrl={null}
              />
            </Btn2>
            }
          </RightWrap>
        </HeadWrap>
        <ContentsWrap active={isdrawer} dataLength={utils.isEmpty(data.sample_list)?0:data.sample_list.length}>
          <BtnLeftWrap active={isdrawer}>
            {data.prev_showroom_no !== null && (
              <PrevBtn onClick={() => handleClick(data.prev_showroom_no)}>
                <img src={PrevArrow} alt="prev" />
              </PrevBtn>
            )}
          </BtnLeftWrap>
          {data.sample_list.map((v, idx) => (
            <DetailList
              key={idx}
              showroomNm={idx === 0 && data.showroom_nm}
              data={v}
              mainImg={v.sample_image_list.find((d) => d.main_yn).full_url}
              season_year={data.season_year}
              season_text={data.season_text}
            />
                   
          ))}
           <BtnRightWrap active={isdrawer}>
            {data.next_showroom_no !== null && (
              <NextBtn onClick={() => handleClick(data.next_showroom_no)}>
                <img src={NextArrow} alt="next" />
              </NextBtn>
            )}
          </BtnRightWrap>  
        </ContentsWrap>
      </Container>

      <ShareDialog
        open={shareDialogOpen}
        setOpen={setShareDialogOpen}
        shareUrl={shareUrl}
      />
    </div>
  );
}

const Container = styled.div`
  position: relative;
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1920px" : "1500px")};
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    min-width: ${(props) => (props.active ? "1250px" : "960px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
  
  }  
`;

const TitleTxt = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-right: 40px;
  margin-bottom: 30px;
`;

const HeadWrap = styled.div`
  display: flex;
  height: 50px;
  justify-content: space-between;
  margin-bottom: 40px;  
  width: 95%;
`;

const LeftWrap = styled.div`
  display: flex;
  align-items: center;
`;

const RightWrap = styled.div`
  display: ${(props) => (props.isShow ? "flex" : "none")};
`;

const Text = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const ContentsWrap = styled.div`
  display: ${(props) => (props.dataLength === 0 ? "flex" : "relative")};
  justify-content: ${(props) => (props.dataLength === 0 ? "center" : "flex-start")};  
  @media (min-width: 1920px) {
    width: ${(props) => (props.active ? "1920px" : "1560px")};     
    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: ${(props) => (props.active ? "1250px" : "960px")};  
    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width : ${(props) => (props.active ? "100%" : "100%")};
    
  } 
`;

const Btn = styled.div`
  width: 82px;
  height: 50px;
  border-radius: 5px;
  border: solid 1px #dddddd;
  background-color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  cursor: pointer;

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
  margin-right:20px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;

`;
const BtnWrap = styled.div`
  display: flex;
  min-width: 100px;
  max-width: 100px;
  margin-top: 425px;
  justify-content: center;
`;

// const BtnWrap = styled.div`
//   position: absolute;
//   top: 425px;
//   display: flex;
//   width: 100%;
//   justify-content: space-between;
// `;



const BtnLeftWrap = styled.div`
  position: absolute;
  top: 175px;
  z-index:9999;
  justify-content: center;
  @media (min-width: 1920px) {
    width: 100px;  
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: 100px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "100px" : "60px")};
  } 
`;
const BtnRightWrap = styled.div`
  position: absolute;
  top: 175px;
  right : 0px;
  z-index:9999;
  justify-content: center;
  @media (min-width: 1920px) {
    width: 100px;  
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    width: 100px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "100px" : "60px")};
  } 
`;

const PrevBtn = styled.div`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const NextBtn = styled.div`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;
