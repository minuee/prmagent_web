import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { useQuery } from "react-query";
import DetailList from "components/brand/digital_showroom/DetailList";
import { useReactToPrint } from "react-to-print";

import { apiObject } from "api/api_common";
import PrevArrow from "assets/prev_arrow.png";
import NextArrow from "assets/next_arrow.png";
import Progress from "components/common/progress";
import ShareDialog from "components/ShareDialog";
import Constants from 'utils/constants';

const Container = styled.div`
  position: relative;
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
  padding: 80px;
`;



const TitleTxt = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};  
`;

const HeadWrap = styled.div`
  display: flex;
  height: 50px;
  justify-content: space-between;
  margin-bottom: 60px;
`;

const LeftWrap = styled.div`
  display: flex;
  align-items: flex-end;
  
`;

const RightWrap = styled.div`
  display: ${(props) => (props.isShow ? "flex" : "none")};
  
`;
const Text = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const Btn = styled.div`
  width: 92px;
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

const BtnWrap = styled.div`
  position: absolute;
  top: 550px;
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const PrevBtn = styled.div`
  margin-left: 100px;
  width: 40px;
  heigth: 40px;
  ${(props) =>
    props.active &&
    css`
      cursor: pointer;
    `}
`;

const NextBtn = styled.div`
  margin-right: 100px;
  width: 40px;
  height: 40px;
  ${(props) =>
    props.active &&
    css`
      cursor: pointer;
    `}
`;

export default function LookDetail({ match }) {
  const history = useHistory();
  const [shareOpen, setShareOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const domain = window.location.href.split("brand/lookbook/")[0];
  const [isShow, setIsShow] = useState(true);
  const uuid = match.params.uuid;
  const showroomNo = match.params.showroom_no;

  const lookbookShowroom = useQuery(
    ["share-lookbook-showroom", uuid, showroomNo],
    async () =>
      await apiObject.getLookbookShareDetail({
        share_uuid: uuid,
        showroom_no: showroomNo,
      })
  );

  const data = lookbookShowroom.isLoading ? [] : lookbookShowroom.data;

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
    history.push("/brand/lookbook/look_detail/" + uuid + "/" + no);
  };

  if (lookbookShowroom.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <div ref={printContentsRef}>
      <Container>
        <HeadWrap>
          <TitleTxt>LookBook</TitleTxt>
          <RightWrap isShow={isShow}>
            <Btn onClick={() => history.push("/share-lookbook/" + uuid)}>
              List
            </Btn>
            <Btn onClick={handlePrintPre}>Print</Btn>
          </RightWrap>
        </HeadWrap>
        <HeadWrap>
          <LeftWrap>
            <Text>{data.lookbook_nm}</Text>
          </LeftWrap>
        </HeadWrap>
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
        {/* <BtnWrap>
          {data.next_showroom_no !== null ? (
            <PrevBtn
              active={true}
              onClick={() => handleClick(data.next_showroom_no)}
            >
              <img src={PrevArrow} alt="prev" />
            </PrevBtn>
          ) : (
            <PrevBtn active={false} />
          )}
          {data.prev_showroom_no !== null ? (
            <NextBtn
              active={true}
              onClick={() => handleClick(data.prev_showroom_no)}
            >
              <img src={NextArrow} alt="next" />
            </NextBtn>
          ) : (
            <NextBtn active={false} />
          )}
        </BtnWrap> */}
      </Container>

      <ShareDialog
        open={shareDialogOpen}
        setOpen={setShareDialogOpen}
        shareUrl={shareUrl}
      />
    </div>
  );
}
