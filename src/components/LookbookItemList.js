import React, { useState } from "react";
import styled, { css } from "styled-components";
import BestIcon from "../assets/best_icon.png";
import NewIcon from "../assets/new_icon.png";
import MainIcon from "assets/main_icon.png";
import utils from "utils";

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
`;

const IconOuterWrap = styled.div`
  & :nth-child(1){
    margin-left:10px
  }
  & :nth-child(2){
    margin-left:50px
  }
  & :nth-child(3){
    margin-left:90px
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
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  line-height:16px;
  margin-top: ${(props) => (props.nameLength > 20 ? "5px" : "20px")};
  overflow: hidden;
`;

const CategoryNameOuter = styled.div`
  width: 210px;
  text-align: center;  
  font-weight: 500;
  font-size: 12px;
  line-height:13px;
  margin-top: 5px;
`;
const CategoryName = styled.div`
  width: 100%;
  display:flex;
  text-align: center;
  justify-content: center;
  
`;
const Category2 = styled.div`
  font-weight: 300;
  font-size: 12px;  
`;
const Category3 = styled.div`
  font-weight: 300;
  font-size: 12px;  
  margin-left:5px;
`;
const EditDiv = styled.div`
  width: 210px;
  height: 315px;
  background-color: #7ea1b2;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  position: absolute;
  top: 20px;
  color: #ffffff;

  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
`;

const IconWrap = styled.div`
  position: absolute;
  top: 30px;
  left: 1px;
  z-index: 3;
`;

const HeadTxt = styled.div`
  width: 210px;
  height: 315px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  font-size: 18px;
  top: 20px;
  color: #ffffff;

  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
`;

const Head = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
`;

const SubHead = styled.div`
  font-weight: 500;
  margin-bottom: 15px;
`;

const Category = styled.div`
  font-weight: 300;
  & + & {
    margin-top: 10px;
  }
`;


const HoverWrap = styled.div`
  cursor: pointer;
`;

export default function LookbookItemList({ data, handleClick }) {
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <>
      <Container>
        <ItemCardWrap
          onMouseOver={() => setMouseOver(true)}
          onMouseLeave={() => setMouseOver(false)}
          onClick={() => handleClick(`${data.showroom_no}`)}
        >
          <ImgWrap>
            <Img imgUrl={data.image_url} />
          </ImgWrap>
          <ItemName nameLength={utils.isEmpty(data.showroom_nm) ? 0 : data.showroom_nm.length}>{data.showroom_nm}</ItemName>
          <CategoryNameOuter>
            <CategoryName>
            {/* {data.category_list !== null && data.category_list.map((d,idx) => <Category2 key={idx}>{idx>0 && " , "}{d}</Category2>)} */}
            {data.new_category_list !== null &&
                data.new_category_list.map((d,idx) => <Category2 key={d}>{idx>0 && ","} {d.category_nm}{!d.is_input && '(미입고)'}</Category2>)
              }
            {data.all_in_yn && <Category3>All IN</Category3>}
            </CategoryName>
          </CategoryNameOuter>
          <HoverWrap>
            <EditDiv visible={mouseOver} />
            <HeadTxt visible={mouseOver}>
              <Head>{data.showroom_nm}</Head>
              {data.all_in_yn && <SubHead>ALL IN</SubHead>}
             {/*  {data.category_list !== null &&
                data.category_list.map((d) => <Category key={d}>{d}</Category>)
              } */}
              {data.new_category_list !== null &&
                data.new_category_list.map((d) => <Category key={d}>{d.category_nm}{!d.is_input && '(미입고)'}</Category>)
              }
            </HeadTxt>
          </HoverWrap>
          <IconOuterWrap>
            {/* {data.is_hot && (
              <IconWrap>
                <img src={BestIcon} alt="best"  style={{width:'35px'}}/>
              </IconWrap>
            )} */}
            {data.is_new && (
              <IconWrap>
                <img src={NewIcon} alt="new" style={{width:'35px'}} />
              </IconWrap>
            )}
            {data.mfrc_sample_yn && (
              <IconWrap>
                <img src={MainIcon} alt="new" style={{width:'35px'}} />
              </IconWrap>
            )}
          </IconOuterWrap>
        </ItemCardWrap>
      </Container>
    </>
  );
}
