import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";

const Container = styled.div`
  display: flex;
`;

const MenuWrap = styled.div`
  width: 190px;
  & + & {
    margin-left: 60px;
  }
`;

const Title = styled.div`
  font-size: 16px;
  height: 16px;
  font-weight: bold;
  margin-bottom: 24px;
  cursor: pointer;
`;

const SubMenu = styled.div`
  display: flex;
  flex-direction: column;
`;

const Sub = styled.div`
  font-size: 16px;
  color: #777777;
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
    color: #000000;
  }

  ${(props) =>
    props.active &&
    css`
      color: #000000;
      font-weight: 500;
    `}
`;

export default function SizeComponent({
  data,
  select,
  isRtw = false,
  isShoes = false,
  handleSelect,
  handleSelectAll,
}) {
  const RTW_SIZE_OPT = [
    { cd_id: "XS", cd_nm: "XS" },
    { cd_id: "S", cd_nm: "S" },
    { cd_id: "M", cd_nm: "M" },
    { cd_id: "L", cd_nm: "L" },
    { cd_id: "XL", cd_nm: "XL" },
  ];

  const [womenSizeOpt, setWomenSizeOpt] = useState([]);
  const [menSizeOpt, setMenSizeOpt] = useState([]);

  useEffect(() => {
    setWomenSizeOpt(
      data[0].size_list.map((d) => ({
        cd_id: d.size_cd_id,
        cd_nm: d.size_nm,
      }))
    );
    setMenSizeOpt(
      data[1].size_list.map((d) => ({
        cd_id: d.size_cd_id,
        cd_nm: d.size_nm,
      }))
    );
  }, [data]);

  return (
    <>
      <Container>
        {!isRtw && !isShoes && (
          <div>
            Category에서 RTW나 Shoes 항목을 선택할 경우에만 선택 가능합니다.
          </div>
        )}
        {isRtw && (
          <MenuWrap>
            <Title onClick={() => handleSelectAll(RTW_SIZE_OPT, "rtw")}>
              RTW Size
            </Title>
            <SubMenu>
              {RTW_SIZE_OPT.map((d) => (
                <Sub
                  key={d.cd_id}
                  onClick={() => handleSelect(d.cd_id)}
                  active={select.includes(d.cd_id)}
                >
                  {d.cd_nm}
                </Sub>
              ))}
            </SubMenu>
          </MenuWrap>
        )}
        {isShoes && (
          <MenuWrap>
            <Title onClick={() => handleSelectAll(womenSizeOpt, "womenShoes")}>
              Women Shoes Size
            </Title>
            <SubMenu>
              {womenSizeOpt.map((d) => (
                <Sub
                  key={d.cd_id}
                  onClick={() => handleSelect(d.cd_id)}
                  active={select.includes(d.cd_id)}
                >
                  {d.cd_nm}
                </Sub>
              ))}
            </SubMenu>
          </MenuWrap>
        )}
        {isShoes && (
          <MenuWrap>
            <Title onClick={() => handleSelectAll(menSizeOpt, "menShoes")}>
              Men Shoes Size
            </Title>
            <SubMenu>
              {menSizeOpt.map((d) => (
                <Sub
                  key={d.cd_id}
                  onClick={() => handleSelect(d.cd_id)}
                  active={select.includes(d.cd_id)}
                >
                  {d.cd_nm}
                </Sub>
              ))}
            </SubMenu>
          </MenuWrap>
        )}
      </Container>
    </>
  );
}
