import React, { useState } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";

import ImgCheckIcon from "assets/check_icon_large.svg";
import RejectIcon from "assets/sample_reject_icon.svg";
import MemoIconBlack from "assets/scheduler/memoIcon.svg";
import ShowroomMemo from "components/brand/scheduler/ShowroomMemo";
function SampleRequestTableDetailItems({data,
  acceptList,
  handleAcceptList,
  rejectList,
  handleRejectList,
  pickup_date = null
}) {
  console.log('ddddddd',pickup_date)
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [sno, setNowno] = useState(null);
  const [snm, setNowsnm] = useState(null);

  const openShowroomMemo = async(no,nm) => {
    await setNowno(no);
    await setNowsnm(nm)
    if ( sno != null) {
      setOpen(!open)
    }
  }

  return (
    <ItemWrap
      accept={ ( data.showroom_status_cd === "accepted" || data.showroom_status_cd === "rejected" || data.showroom_status === "accepted" || data.showroom_status === "rejected"  ) ? true
          : false
      }
      active={hover}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ImgDiv>
        <Img imgUrl={data.image_url} />
      </ImgDiv>
      <ItemTitle>
        {data.showroom_nm}
        <div className="memo" onClick={() => openShowroomMemo(data.showroom_no,data.showroom_nm)}>
          <img src={MemoIconBlack} alt="memo" />
        </div>
      </ItemTitle>
      { ( data.showroom_status_cd === "undecided" || data.showroom_status === "undecided" ) && (
        <>
          {acceptList.includes(data.showroom_no) || rejectList.includes(data.showroom_no) ? (
            <>
              {
                acceptList.includes(data.showroom_no) && (
                <SampleBtnWrap bg="rgb(126 161 178 / 80%)" onClick={() => handleAcceptList(data.showroom_no)}>
                  <img src={ImgCheckIcon} alt="" />
                </SampleBtnWrap>
              )}
              {rejectList.includes(data.showroom_no) && (
                <SampleBtnWrap onClick={() => handleRejectList(data.showroom_no)}>
                  <img src={RejectIcon} alt="" />
                </SampleBtnWrap>
              )}
            </>
          ) : (
            <>
              {hover && (
                <SampleBtnWrap>
                  <SampleBtn onClick={() => handleRejectList(data.showroom_no)}>
                    Reject
                  </SampleBtn>
                  <SampleBtn onClick={() => handleAcceptList(data.showroom_no)}>
                    Confirm
                  </SampleBtn>
                </SampleBtnWrap>
              )}
            </>
          )}
        </>
      )}

      {data.showroom_status_cd === "accepted" && (
        <SampleBtnWrap>
          <img src={ImgCheckIcon} alt="" />
        </SampleBtnWrap>
      )}

      {data.showroom_status_cd === "rejected" && (
        <SampleBtnWrap>
          <img src={RejectIcon} alt="" />
        </SampleBtnWrap>
      )}
      <ShowroomMemo
        open={open}
        setOpen={setOpen}
        sno={sno}
        snm={snm}
        dt={pickup_date}
      />
    </ItemWrap>
  );
}

const ItemWrap = styled.div`
  width: 280px;
  border-radius: 10px;
  padding: 20px 14px;
  margin-right: 20px;
  margin-bottom: 20px;
  position: relative;
  cursor: pointer;
  ${(props) =>
    props.accept
      ? css`
          background-color: #dddddd;
          ${(props) =>
            props.active &&
            css`
              background-color: ${darken(0.1, "#dddddd")};
            `}
        `
      : css`
          background-color: #eef4f8;
          ${(props) =>
            props.active &&
            css`
              background-color: ${darken(0.1, "#eef4f8")};
            `}
        `}
`;

const ImgDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const Img = styled.div`
  width: 240px;
  height: 345px;
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

const ItemTitle = styled.div`
  display: flex;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  margin-top: 19px;
  .memo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    border-radius: 50%;
    cursor: pointer;
 
    &:hover {
      background-color: ${darken(0.2, "#ffffff")};
    }
    &:active {
      background-color: ${darken(0.3, "#ffffff")};
    }
    > img {
    }
  }
`;

const SampleBtnWrap = styled.div`
  position: absolute;
  background-color: ${(props) => props.bg || "rgb(0 0 0 / 40%)"};
  width: 240px;
  height: 345px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 20px;
  left: 20px;
`;

const SampleBtn = styled.div`
  width: 160px;
  height: 42px;
  opacity: 0.9;
  border: solid 1px #dddddd;
  border-radius: 5px;
  background-color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  color: #555555;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  cursor: pointer;

  & + & {
    margin-top: 16px;
  }

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
  &:active {
    background-color: ${darken(0.2, "#ffffff")};
  }
`;

export default React.memo(SampleRequestTableDetailItems);
