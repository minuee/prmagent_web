import React from "react";
import styled, { css } from "styled-components";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import Constants from '../../../utils/constants';

export default function SendoutDetailItems({
  data,
  sdata,
  sdate,
  idx = null,
  handleClick = false,
  view,
  viewMode=null
}) {  
  const data2 = viewMode === 'new' ? data.showroom_list[0] : data;

  return (
    <Container
      link={idx !== null ? true : false}
      //onClick={() => handleClick(data2)}
      onClick={() => handleClick(data2,idx,sdata,sdate)}
    >
     
      <Head bg={ data2.sendout_yn ? data2.brand_color || "#ddd" : Constants.nonCheckColor}>
        { data2.target_id_type === 'RUS001' ?
          <img src={data2.mgzn_logo_adres} alt="mgzn_logo" />
          :
          <img src={data2.brand_logo_adres} alt="brand_logo" />
        }
      </Head>      
        <Contents>
        <div className="title">
          <div>
          {data2.req_user_nm}{data2.req_user_position}
          </div>
          <ArrowRightAltIcon />
        </div>
        <div className="sub">          
          {data2.target_user_nm}{data2.target_user_position}
        </div>
      </Contents>
    </Container>
  );
}

const Container = styled.div`
  width: 158px;
  height: 120px;
  border-radius: 10px;
  border: solid 2px #f3f3f3;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 20px;
  cursor: pointer;
  
  ${(props) =>
    props.link &&
    css`
      cursor: pointer;
    `}
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  background-color: ${(props) => props.bg || "#ffffff"};

  > img {
    max-width: 140px;
    max-height: 25px;
  }
`;

const Contents = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;

  .title {
    display: flex;
    height: 20px;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
    width: 128px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    > svg {
      margin-bottom: 3px;
    }
  }
  .sub {
    font-size: 14px;
    font-weight: 500;
    width: 128px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
