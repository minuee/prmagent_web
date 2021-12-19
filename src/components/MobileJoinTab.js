import React,{ useState, useEffect }  from "react";
import styled, { css } from "styled-components";
import SelectBox from "../components/SelectBox";

const { innerWidth: width, innerHeight: height } = window;
console.log('innerWidth',width)
const Container = styled.div`
  width: 100%;  
  height: 50px;
  display: flex;
`;

const GridDiv = styled.div`
  max-width: 33.333333%;
  flex-basis: 33.333333%;
  font-weight: 500;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: -0.35px;
  cursor: pointer;

  ${(props) =>
    props.active &&
    css`
      border-top: 2px solid #7ea1b2;
      border-left: 2px solid #7ea1b2;
      border-right: 2px solid #7ea1b2;
      color: #7ea1b2;
      padding-bottom: 3px;
    `}

  ${(props) =>
    !props.active &&
    css`
      border-bottom: 2px solid #7ea1b2;
      color: #555555;
    `}

  &:hover {
    color: #7ea1b2;
  }
`;

const LOGIN_TYPE_DATA = [
  {index : 1, value : 0, label : "Brand"},
  {index : 2, value : 1, label : "Magagine/Stylist"},
  /* {index : 3, value : 2, label : "Stylist"} */
]

export default function MobileJoinTab({ nowTab, setNowTab }) {

  const [inputs, setInputs] = useState({
    type: 0,    
  });

  const handleChangeSelectBox = (name, data) => {
    console.log('handleChangeSelectBox',name,data)
    setInputs({ ...inputs, [name]: data });
    setNowTab(data)
  };
 
  return (
    <>
      <Container>
        <SelectBox
          width={"90vw"}
          height="37px"
          text="가입형태"
          value={inputs.type}
          name="type"
          handleChange={handleChangeSelectBox}
          options={LOGIN_TYPE_DATA}
        />
      </Container>
    </>
  );
}
