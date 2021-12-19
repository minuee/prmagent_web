import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";

import ChevronDown from "assets/sheet/chevronDown.svg";
import useOutsideClick from "components/UseOutsideClick";
import WeekPicker from "components/WeekPicker";
import SelectBox from "components/brand/lookbook/Selectbox";
import Constants from 'utils/constants';
export default function Title({
  view,
  setView,
  startDt,
  setStartDt,
  endDt,
  setEndDt,
  brandId,
  brandList,
  handleBrandId,
  handleViewInit,
}) {
  const ref = useRef();
  const [viewOpen, setViewOpen] = useState(false);

  useOutsideClick(ref, () => {
    setViewOpen(false);
  });

  const handleViewClick = (view) => {
    setView(view);
    setViewOpen(false);
    handleViewInit();
  };

  return (
    <>
      <Container>
        <div style={{ display: "flex" }}>
          <Wrap ref={ref}>
            <TitleTxt onClick={() => setViewOpen(!viewOpen)}>
              {view}
              <img src={ChevronDown} alt="" style={{ marginLeft: "12px" }} />
            </TitleTxt>
            {viewOpen && (
              <Popup>
                <PopupMenus
                  active={view === "pickups"}
                  onClick={() => handleViewClick("pickups")}
                >
                  Pickups
                </PopupMenus>
                <PopupMenus
                  active={view === "sendout"}
                  onClick={() => handleViewClick("sendout")}
                >
                  Send Out
                </PopupMenus>
              </Popup>
            )}
          </Wrap>
        </div>
        <div style={{ display: "flex" }}>
          <WeekPicker
            startDt={startDt}
            setStartDt={setStartDt}
            endDt={endDt}
            setEndDt={setEndDt}
          />
          <div style={{ width: "128px", marginLeft: "10px" }}>
            <SelectBox
              value={brandId}
              defaultValue="Brand"
              options={brandList}
              height="50px"
              handleChange={handleBrandId}
            />
          </div>
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Wrap = styled.div`
  display: flex;
  width: 254px;
  position: relative;
`;

const TitleTxt = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-right: 20px;
  margin-bottom: 30px;
  cursor: pointer;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const SettingWrap = styled.div`
  display: flex;
  height: 48px;
  cursor: pointer;
`;

const Popup = styled.div`
  position: absolute;
  top: 58px;
  display: flex;
  flex-direction: column;
  width: 234px;
  height: 152px;
  border: solid 1px #dddddd;
  background-color: #ffffff;
  padding: 30px 0px;
`;

const PopupMenus = styled.div`
  font-size: 20px;
  font-weight: 500;
  padding: 10px 40px;
  cursor: pointer;

  ${(props) =>
    props.active
      ? css`
          background-color: #7ea1b2;
          color: #ffffff;
          &:hover {
            background-color: ${darken(0.2, "#7ea1b2")};
          }
        `
      : css`
          background-color: #ffffff;
          color: #000000;
          &:hover {
            background-color: #dddddd;
          }
        `}
`;
