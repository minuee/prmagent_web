import React from "react";
import { useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
import { useQuery } from "react-query";
import { darken } from "polished";
import PrevArrow from "assets/prev_arrow.png";
import NextArrow from "assets/next_arrow.png";
import { apiObject } from "api/api_brand";
import DetailList from "components/brand/digital_showroom/DetailList";
import Progress from "components/common/progress";
import { useMutation } from "react-query";
import Constants from 'utils/constants';
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";
import 'react-alert-confirm/dist/index.css';
import alertConfirm from 'react-alert-confirm';
import { useScrollTo,useScrollBy } from "react-use-window-scroll";


export default function DigitalShowroomDetail({ match }) {
  const scrollTo = useScrollTo();
  const scrollBy = useScrollBy();
  const history = useHistory();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const { isLoading, data } = useQuery(
    ["brand-showroom-detail", match.params.item_no],
    async () =>
      await apiObject.getShowroomDetail({ showroom_no: match.params.item_no })
  );  
  const handleClick = async(no) => {
    //scrollBy({ top: 0, left: 0, behavior: "smooth" })
    history.push("/brand/digital_showroom/detail/" + no);
    //scrollBy({ top: 0, left: 0, behavior: "smooth" })
  };
  const handleEdit = (idx) => {    
    history.push("/brand/digital_showroom/edit/" + idx);    
  };
  const handleSendPush = () => {    
    alertConfirm({
      title: Constants.appName,
      content: '쇼룸등록소식을 알림발송하시겠습니까?',
      onOk: () => {sendpushShowroom.mutate()},
      onCancel: () => {console.log('cancel')}
    });  
  };


  const sendpushShowroom = useMutation(
    (idx) =>
      apiObject.sendPushShowroom({
        showroom_no: match.params.item_no,
      }),
    {
      onSuccess: () => {
        utils.customAlert("정상적으로 발송되었습니다.");       
        return; 
      },
      onError: () => {
        utils.customAlert("전송중 오류가 발생했습니다.");
        return;
      },
    }
  );

  if (isLoading) {
    return <Progress type="load" />;
  }

  console.log('data.sample_list',data.sample_list.length)
  //history.push("/brand/digital_showroom/edit/" + idx);
  return (
    <>
      <Container>
        <TitleWrap active={isdrawer}>
          <Title>
            <Text1>Digital</Text1>
            <Text2>Showroom</Text2>
          </Title>
          <BtnWrap active={isdrawer}>
            <SwitchOuterWrap>
              <SwitchWrap>
                <SwitchTxt>공개여부</SwitchTxt>
                <SwitchDiv>
                  <input type="checkbox" style={{ display:"none"}} checked={data.show_yn === 'Y' ? true : false} readOnly/>
                  <Marble active={data.show_yn === 'Y' ? "on" : "off"} />
                  <SwitchBtn active={data.show_yn === 'Y' ? "on" : "off"}>On</SwitchBtn>
                  <SwitchBtn active={!data.show_yn === 'Y' ? "on" : "off"}>Off</SwitchBtn>
                </SwitchDiv>
              </SwitchWrap>
              <SwitchWrap>
                <SwitchTxt>주력상품</SwitchTxt>
                <SwitchDiv>
                  <input type="checkbox" style={{ display:"none"}} checked={data.mfrc_sample_yn} readOnly/>
                  <Marble active={data.mfrc_sample_yn ? "on" : "off"} />
                  <SwitchBtn active={data.mfrc_sample_yn ? "on" : "off"}>On</SwitchBtn>
                  <SwitchBtn active={!data.mfrc_sample_yn ? "on" : "off"}>Off</SwitchBtn>
                </SwitchDiv>
              </SwitchWrap>
            </SwitchOuterWrap>
            { data.show_yn === 'Y' &&
            <PushBtn onClick={()=> handleSendPush(match.params.item_no)}>푸시알림전송</PushBtn>
            }
            <Btn onClick={()=> handleEdit(match.params.item_no)}>Edit</Btn>
          </BtnWrap>
        </TitleWrap>
        { !utils.isEmpty(data.replacement_showroom_no) &&
          <ContentsReplaceWrap active={isdrawer}>
            대체제안 : [{data.replacement_season_year} {data.replacement_season_se_id}]{data.replacement_showroom_nm}
          </ContentsReplaceWrap>
        }
        <ContentsWrap active={isdrawer} dataLength={utils.isEmpty(data.sample_list)?0:data.sample_list.length}>
          <BtnLeftWrap active={isdrawer}>
            {data.prev_showroom_no !== null && (
              <PrevBtn onClick={() => handleClick(data.prev_showroom_no)}>
                <img src={PrevArrow} alt="prev" style={{width:25}} />
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
                <img src={NextArrow} alt="next" style={{width:25}} />
              </NextBtn>
            )}
          </BtnRightWrap>
        </ContentsWrap>
        {/* <BtnWrap>
          {data.prev_showroom_no === null ? (
            <PrevBtn />
          ) : (
            <PrevBtn onClick={() => handleClick(data.prev_showroom_no)}>
              <img src={PrevArrow} alt="prev" />
            </PrevBtn>
          )}
          {data.next_showroom_no !== null && (
            <NextBtn onClick={() => handleClick(data.next_showroom_no)}>
              <img src={NextArrow} alt="next" />
            </NextBtn>
          )}
        </BtnWrap> */}
      </Container>
    </>
  );
}

const SwitchOuterWrap = styled.div`
  display: flex;
  align-items: center;
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
    css`
      color: #ffffff;
    `}
`;

const Marble = styled.div`
  width: 52px;
  height: 28px;
  border-radius: 500px;
  background-color: #000000;
  position: absolute;
  transition: all 0.3s;

  ${(props) =>
    props.active === "on"
      ? css`
          left: 1px;
        `
      : css`
          left: 49px;
        `}
`;

const Container = styled.div`
  position: relative;
  width:calc(100%-25px);
  margin-left:25px;
`;

const TitleWrap = styled.div`
  width:96%;
  @media (min-width: 1920px) {
    display: flex;
    align-items:center;
    justify-content: space-between;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    display: flex;
    align-items:center;
    justify-content: space-between;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width : ${(props) => (props.active ? "100%" : "100%")};
    display: ${(props) => (props.active ? "flex" : "")};
    align-items:center;
    justify-content: space-between;
  } 
`;

const Title = styled.div`  
  display:flex;
`;
const BtnWrap = styled.div`  
  display:flex;
  @media (min-width: 1920px) {
   
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
   
  }
  @media (min-width: 10px) and (max-width: 1439px) {    
    margin-top: ${(props) => (props.active ? "0px" : "20px")};    
  } 
`;

const Btn = styled.div`
  width: 90px;
  height: 32px;
  margin-left:15px;
  border-radius: 5px;
  border: solid 1px #dddddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
  &:active {
    background-color: ${darken(0.2, "#ffffff")};
  }
`;
const PushBtn = styled.div`
  width: 100px;
  height: 32px;
  margin-left:15px;
  border-radius: 5px;
  border: solid 1px #dddddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
  &:active {
    background-color: ${darken(0.2, "#ffffff")};
  }
`;

const Text1 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: 100;
  line-height: ${Constants.titleFontSize};  
`;

const Text2 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-left:20px;
`;

const ContentsWrap = styled.div`
  display: ${(props) => (props.dataLength === 0 ? "flex" : "relative")};
  justify-content: ${(props) => (props.dataLength === 0 ? "center" : "flex-start")};  
  width:100%;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1920px" : "1560px")};
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "960px")}; 
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width : ${(props) => (props.active ? "100%" : "100%")};
  } 
`;

const ContentsReplaceWrap = styled.div`
  margin-top:10px;
  width:100%;  
  font-size:20px;
`;

const BtnLeftWrap = styled.div`
  position: fixed;
  top: 200px;  
  z-index:9999;
  justify-content: center;
  width:40px;  
`;
const BtnRightWrap = styled.div`
  position: fixed;
  top: 200px;
  right : 100px;
  z-index:9999;
  justify-content: center;
  width:40px;  
`;
const PrevBtn = styled.div`
  display:flex;
  width: 35px;
  height: 35px;
  background-color:#7ea1b2;
  opacity:0.5;
  cursor: pointer;
  justify-content: center;
  align-items:center;
`;

const NextBtn = styled.div`
  display:flex;
  width: 35px;
  height: 35px;
  background-color:#7ea1b2;
  opacity:0.5;
  cursor: pointer;
  justify-content: center;
  align-items:center;
`;