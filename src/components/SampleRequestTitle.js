import React from "react";
import styled from "styled-components";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import CheckBlank from "../assets/sample_check_blank.png";
import Checked from "../assets/sample_check.png";

import Constants from '../utils/constants';


/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "../redux/state";


const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width:calc(100%-25px);
  margin-left:25px;  
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1500px" : "1500px")};    
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "960px")};        
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "900px" : "640px")};    
  }  
`;

const TitleTxt1 = styled.div`
  display:flex;
  font-size: ${Constants.titleFontSize};
  font-weight: 100;
  line-height: ${Constants.titleFontSize};
  
`;

const TitleTxt2 = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-left: 10px;
`;

const RightWrap = styled.div`
  position: relative;
  margin-right: 40px;  
`;

const Filter = styled.div`
  width: 128px;
  height: 50px;
  border-radius: 5px;
  border: solid 1px #dddddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 14px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

const SubMenu = styled.div`
  position: absolute;
  top: 60px;
  width: 128px;
  height: 113px;
  border: solid 1px #dddddd;
  padding: 15px 14px;
`;

const Sub = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #555555;
  height: 16px;
  cursor: pointer;

  &:hover {
    color: #000000;
  }

  & + & {
    margin-top: 16px;
  }
`;

const CheckImg = styled.img`
  margin-right: 5px;
`;

export default function SampleRequests({open,setOpen,filter,handleChange,}) {

  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer); 
  return (
    <>
      <Container active={isdrawer}>
        <TitleTxt1>Sample <TitleTxt2>Requests</TitleTxt2></TitleTxt1>
        <RightWrap>
          <Filter onClick={() => setOpen(!open)}>
            <div>
              {filter === "PMS004"
                ? "All"
                : filter === "PMS001"
                ? "Celeb"
                : "Model"}
            </div>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Filter>
          {open && (
            <SubMenu>
              <Sub onClick={() => handleChange("PMS004")}>
                <CheckImg
                  src={filter === "PMS004" ? Checked : CheckBlank}
                  alt="check"
                />
                All
              </Sub>
              <Sub onClick={() => handleChange("PMS001")}>
                <CheckImg
                  src={filter === "PMS001" ? Checked : CheckBlank}
                  alt="check"
                />
                Celeb
              </Sub>
              <Sub onClick={() => handleChange("PMS002")}>
                <CheckImg
                  src={filter === "PMS002" ? Checked : CheckBlank}
                  alt="check"
                />
                Model
              </Sub>
            </SubMenu>
          )}
        </RightWrap>
      </Container>
    </>
  );
}
