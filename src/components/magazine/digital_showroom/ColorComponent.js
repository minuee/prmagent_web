import React from "react";
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

export default function ColorComponent({
  data,
  select,
  handleSelect,
  handleSelectAll,
}) {
  return (
    <>
      <Container>
        <MenuWrap>
          <Title onClick={() => handleSelectAll(data)}>Color</Title>
          <SubMenu>
            {data.map((d) => (
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
      </Container>
    </>
  );
}
