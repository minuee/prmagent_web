import React, { useRef,useState } from "react";
import { useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { useQuery } from "react-query";
import { useReactToPrint } from "react-to-print";
import LookbookItems from "components/LookbookItemList";

import { apiObject } from "api/api_common";
import Progress from "components/common/progress";
import Constants from 'utils/constants';
import Meta from 'utils/Meta';
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
  margin-bottom: 30px;
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

const ItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: ${(props) => props.width || "auto"};
  position: relative;
  margin-left: -20px;
`;

export default function LookbookShare({ match }) {

  const history = useHistory();
  const uuid = match.params.uuid;
  const [isShow, setIsShow] = useState(true);
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

  const handleClick = (idx) => {
    history.push("/share-lookbook-detail/" + uuid + "/" + idx);
  };

  const lookbookQuery = useQuery(["share-lookbook", uuid], async () =>
    apiObject.getLookbookShare({
      share_uuid: uuid,
    })
  );

  const data = lookbookQuery.isLoading ? [] : lookbookQuery.data;

  if (lookbookQuery.isLoading) {
    return <Progress type="load" />;
  }

  const metaData = {
    title: data.lookbook_nm || 'PR Magnet LookBook'
  }
  return (
    <div ref={printContentsRef}>
      <Meta data={metaData} />
      <Container>        
        <HeadWrap>
          <TitleTxt>LookBook</TitleTxt>
          <RightWrap isShow={isShow}>
            <Btn onClick={() => handlePrintPre()}>Print</Btn>
          </RightWrap>
        </HeadWrap>
        <HeadWrap>
          <LeftWrap>
            <Text>{data.lookbook_nm}</Text>
          </LeftWrap>          
        </HeadWrap>
        <ItemContainer>
          {data.list.map((d) => (
            <LookbookItems
              key={d.showroom_no}
              data={d}
              handleClick={handleClick}
            />
          ))}
        </ItemContainer>
      </Container>
    </div>
  );
}
