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

const BagWrap = styled.div`
  margin-bottom: 32px;
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
  font-size: 15px;
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

export default function CategoryComponent({
  data,
  select,
  handleSelect,
  handleSelectAll,
  selectGender
}) {
  if ( selectGender.includes('SSS003') && !selectGender.includes('SSS001') && !selectGender.includes('SSS002')) {
    return (
      <>
      <Container>
        
        <MenuWrap>          
          <div>
            <Title
              onClick={() =>
                handleSelectAll(
                  data.find((v) => v.sample_catgry_lrge_cl_nm === "Decor")
                    .each_list,
                  "deco"
                )
              }
            >
              Deco
            </Title>
            <SubMenu>
              {data
                .find((v) => v.sample_catgry_lrge_cl_nm === "Decor")
                .each_list.map((d) => (
                  <Sub
                    key={d.sample_catgry_middle_cl_cd}
                    onClick={() => handleSelect(d.sample_catgry_middle_cl_cd)}
                    active={select.includes(d.sample_catgry_middle_cl_cd)}
                  >
                    {d.sample_catgry_middle_cl_nm}
                  </Sub>
                ))}
            </SubMenu>
          </div>
        </MenuWrap>
        <MenuWrap>
          <BagWrap>
            <Title
              onClick={() =>
                handleSelectAll(
                  data.find((v) => v.sample_catgry_lrge_cl_nm === "Accessory")
                    .each_list,
                  "acc"
                )
              }
            >
              Accessory
            </Title>
            <SubMenu>
              {data
                .find((v) => v.sample_catgry_lrge_cl_nm === "Accessory")
                .each_list.map((d) => (
                  <Sub
                    key={d.sample_catgry_middle_cl_cd}
                    onClick={() => handleSelect(d.sample_catgry_middle_cl_cd)}
                    active={select.includes(d.sample_catgry_middle_cl_cd)}
                  >
                    {d.sample_catgry_middle_cl_nm}
                  </Sub>
                ))}
            </SubMenu>
          </BagWrap>
        </MenuWrap>
        <MenuWrap>
          <div>
            <Title
              onClick={() =>
                handleSelectAll(
                  data.find((v) => v.sample_catgry_lrge_cl_nm === "Jewelry")
                    .each_list,
                  "jewelry"
                )
              }
            >
              Jewelry
            </Title>
            <SubMenu>
              {data
                .find((v) => v.sample_catgry_lrge_cl_nm === "Jewelry")
                .each_list.map((d) => (
                  <Sub
                    key={d.sample_catgry_middle_cl_cd}
                    onClick={() => handleSelect(d.sample_catgry_middle_cl_cd)}
                    active={select.includes(d.sample_catgry_middle_cl_cd)}
                  >
                    {d.sample_catgry_middle_cl_nm}
                  </Sub>
                ))}
            </SubMenu>
          </div>
        </MenuWrap>
        
      </Container>
      </>
    )

  }else if ( (selectGender.includes('SSS001') || selectGender.includes('SSS002')) && !selectGender.includes('SSS003')) {
    return (
      <>
        <Container>
          <MenuWrap>
            <Title
              onClick={() =>
                handleSelectAll(
                  data.find((v) => v.sample_catgry_lrge_cl_nm === "RTW")
                    .each_list,
                  "rtw"
                )
              }
            >
              RTW
            </Title>
            <SubMenu>
              {data
                .find((v) => v.sample_catgry_lrge_cl_nm === "RTW")
                .each_list.map((d) => (
                  <Sub
                    key={d.sample_catgry_middle_cl_cd}
                    onClick={() => handleSelect(d.sample_catgry_middle_cl_cd)}
                    active={select.includes(d.sample_catgry_middle_cl_cd)}
                  >
                    {d.sample_catgry_middle_cl_nm}
                  </Sub>
                ))}
            </SubMenu>
          </MenuWrap>
          <MenuWrap>
            <BagWrap>
              <Title
                onClick={() =>
                  handleSelectAll(
                    data.find((v) => v.sample_catgry_lrge_cl_nm === "Bag")
                      .each_list,
                    "bag"
                  )
                }
              >
                Bag
              </Title>
              <SubMenu>
                {data
                  .find((v) => v.sample_catgry_lrge_cl_nm === "Bag")
                  .each_list.map((d) => (
                    <Sub
                      key={d.sample_catgry_middle_cl_cd}
                      onClick={() => handleSelect(d.sample_catgry_middle_cl_cd)}
                      active={select.includes(d.sample_catgry_middle_cl_cd)}
                    >
                      {d.sample_catgry_middle_cl_nm}
                    </Sub>
                  ))}
              </SubMenu>
            </BagWrap>
          </MenuWrap>
          <MenuWrap>
            <Title
              onClick={() =>
                handleSelectAll(
                  data.find((v) => v.sample_catgry_lrge_cl_nm === "Shoes")
                    .each_list,
                  "shoes"
                )
              }
            >
              Shoes
            </Title>
            <SubMenu>
              {data
                .find((v) => v.sample_catgry_lrge_cl_nm === "Shoes")
                .each_list.map((d) => (
                  <Sub
                    key={d.sample_catgry_middle_cl_cd}
                    onClick={() => handleSelect(d.sample_catgry_middle_cl_cd)}
                    active={select.includes(d.sample_catgry_middle_cl_cd)}
                  >
                    {d.sample_catgry_middle_cl_nm}
                  </Sub>
                ))}
            </SubMenu>
          </MenuWrap>
        </Container>
      </>
    );
  }else{
    return (
      <>
        <Container>
          <MenuWrap>
            <Title
              onClick={() =>
                handleSelectAll(
                  data.find((v) => v.sample_catgry_lrge_cl_nm === "RTW")
                    .each_list,
                  "rtw"
                )
              }
            >
              RTW
            </Title>
            <SubMenu>
              {data
                .find((v) => v.sample_catgry_lrge_cl_nm === "RTW")
                .each_list.map((d) => (
                  <Sub
                    key={d.sample_catgry_middle_cl_cd}
                    onClick={() => handleSelect(d.sample_catgry_middle_cl_cd)}
                    active={select.includes(d.sample_catgry_middle_cl_cd)}
                  >
                    {d.sample_catgry_middle_cl_nm}
                  </Sub>
                ))}
            </SubMenu>
          </MenuWrap>
          <MenuWrap>
            <BagWrap>
              <Title
                onClick={() =>
                  handleSelectAll(
                    data.find((v) => v.sample_catgry_lrge_cl_nm === "Bag")
                      .each_list,
                    "bag"
                  )
                }
              >
                Bag
              </Title>
              <SubMenu>
                {data
                  .find((v) => v.sample_catgry_lrge_cl_nm === "Bag")
                  .each_list.map((d) => (
                    <Sub
                      key={d.sample_catgry_middle_cl_cd}
                      onClick={() => handleSelect(d.sample_catgry_middle_cl_cd)}
                      active={select.includes(d.sample_catgry_middle_cl_cd)}
                    >
                      {d.sample_catgry_middle_cl_nm}
                    </Sub>
                  ))}
              </SubMenu>
            </BagWrap>
            <div>
              <Title
                onClick={() =>
                  handleSelectAll(
                    data.find((v) => v.sample_catgry_lrge_cl_nm === "Decor")
                      .each_list,
                    "deco"
                  )
                }
              >
                Deco
              </Title>
              <SubMenu>
                {data
                  .find((v) => v.sample_catgry_lrge_cl_nm === "Decor")
                  .each_list.map((d) => (
                    <Sub
                      key={d.sample_catgry_middle_cl_cd}
                      onClick={() => handleSelect(d.sample_catgry_middle_cl_cd)}
                      active={select.includes(d.sample_catgry_middle_cl_cd)}
                    >
                      {d.sample_catgry_middle_cl_nm}
                    </Sub>
                  ))}
              </SubMenu>
            </div>
          </MenuWrap>
          <MenuWrap>
            <BagWrap>
              <Title
                onClick={() =>
                  handleSelectAll(
                    data.find((v) => v.sample_catgry_lrge_cl_nm === "Accessory")
                      .each_list,
                    "acc"
                  )
                }
              >
                Accessory
              </Title>
              <SubMenu>
                {data
                  .find((v) => v.sample_catgry_lrge_cl_nm === "Accessory")
                  .each_list.map((d) => (
                    <Sub
                      key={d.sample_catgry_middle_cl_cd}
                      onClick={() => handleSelect(d.sample_catgry_middle_cl_cd)}
                      active={select.includes(d.sample_catgry_middle_cl_cd)}
                    >
                      {d.sample_catgry_middle_cl_nm}
                    </Sub>
                  ))}
              </SubMenu>
            </BagWrap>
            <div>
              <Title
                onClick={() =>
                  handleSelectAll(
                    data.find((v) => v.sample_catgry_lrge_cl_nm === "Jewelry")
                      .each_list,
                    "jewelry"
                  )
                }
              >
                Jewelry
              </Title>
              <SubMenu>
                {data
                  .find((v) => v.sample_catgry_lrge_cl_nm === "Jewelry")
                  .each_list.map((d) => (
                    <Sub
                      key={d.sample_catgry_middle_cl_cd}
                      onClick={() => handleSelect(d.sample_catgry_middle_cl_cd)}
                      active={select.includes(d.sample_catgry_middle_cl_cd)}
                    >
                      {d.sample_catgry_middle_cl_nm}
                    </Sub>
                  ))}
              </SubMenu>
            </div>
          </MenuWrap>
          <MenuWrap>
            <Title
              onClick={() =>
                handleSelectAll(
                  data.find((v) => v.sample_catgry_lrge_cl_nm === "Shoes")
                    .each_list,
                  "shoes"
                )
              }
            >
              Shoes
            </Title>
            <SubMenu>
              {data
                .find((v) => v.sample_catgry_lrge_cl_nm === "Shoes")
                .each_list.map((d) => (
                  <Sub
                    key={d.sample_catgry_middle_cl_cd}
                    onClick={() => handleSelect(d.sample_catgry_middle_cl_cd)}
                    active={select.includes(d.sample_catgry_middle_cl_cd)}
                  >
                    {d.sample_catgry_middle_cl_nm}
                  </Sub>
                ))}
            </SubMenu>
          </MenuWrap>
        </Container>
      </>
    );
  }
}
