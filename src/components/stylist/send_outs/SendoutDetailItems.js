import React from "react";
import styled, { css } from "styled-components";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";

export default function SendoutDetailItems({
  data,
  idx = null,
  handleClick = false,
}) {
  return (
    <Container
      link={idx !== null ? true : false}
      onClick={() => handleClick(idx)}
    >
      <Head bg={data.brand_color || "#ddd"}>
        <img src={data.brand_logo_adres} alt="brand_logo" />
      </Head>
      <Contents>
        <div className="title">
          <div>
            {data.brand_user_nm} {data.brand_user_position}
          </div>
          <ArrowRightAltIcon />
        </div>
        <div className="sub">
          {data.mgzn_nm} {data.req_user_nm}
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
  & + & {
    margin-left: 20px;
  }

  ${(props) =>
    props.link &&
    css`
      cursor: pointer;
    `}
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 10px;
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
    font-size: 16px;
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
    font-size: 16px;
    font-weight: 500;
    width: 128px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
