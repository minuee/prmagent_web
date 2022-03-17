import React, { useState, useRef } from "react";
import { DialogContent, Dialog, Divider } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { useQuery, useMutation } from "react-query";

import FavIcon from "assets/fav_icon.svg";
import FavIconOff from "assets/fav_icon_off.svg";
import SearchIcon from "assets/search.png";
import { apiObject } from "api/api_magazine";
import Progress from "components/common/progress";
import utils from "utils";

const StyleDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0);
  }
  .MuiPaper-rounded {
    border-radius: 0;
  }
  .MuiDialogTitle-root {
    padding: 0;
  }
  .MuiPaper-elevation24 {
    box-shadow: none;
  }
`;

const StyleDialogContent = styled(DialogContent)`
  width: 842px;
  border: 1px solid #dddddd;
  padding: 0px !important;
`;

const CloseIconBox = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
`;
const LeftWrap = styled.div`
  width: 190px;
  height: 495px;
  border-right: 1px solid #dddddd;
  padding: 60px 30px;
  font-size: 16px;
  font-weight: 500;
`;
const RightWrap = styled.div`
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  display: flex;
  width: 840px;
  justify-content: space-between;
  padding: 60px 30px 30px 30px;
  border-bottom: 1px solid #dddddd;
`;
const Main = styled.div`
  width: 840px;
  height: 346px;
  padding: 30px;
  overflow-y: auto;
  background-color: #f3f3f3;
`;

const FavList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

const Fav = styled.div`
  height: 16px;
  font-size: 14px;
  font-weight: 300;
  display: flex;
  align-items: center;

  & + & {
    margin-top: 15px;
  }
`;

const FavImg = styled.img`
  margin-right: 5px;
`;

const AlphaWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const AlphaLine = styled.div`
  display: flex;
  & + & {
    margin-top: 4px;
  }
`;

const Alpha = styled.div`
  width: ${(props) => (props.double ? "58px" : "28px")};
  height: 28px;
  border: 1px solid #dddddd;
  font-size: ${(props) => (props.double ? "14px" : "16px")};
  color: #555555;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  & + & {
    margin-left: 2px;
  }

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
  &:active {
    background-color: ${darken(0.2, "#ffffff")};
  }
`;

const SearchBox = styled.div`
  display: flex;
  float: right;
  border: solid 1px #dddddd;
  width: 182px;
  height: 28px;

  ${(props) =>
    props.focus
      ? css`
          background-color: ${darken(0.04, "#ffffff")};
        `
      : css``}
`;

const SearchInput = styled.input`
  width: 100%;
  border: none;
  background-color: #ffffff;
  border-radius: 10px;
  font-size: 12px;
  padding-left: 14px;

  :focus {
    outline: none;
    background-color: ${darken(0.04, "#ffffff")};
  }
`;

const SearchImgWrap = styled.div`
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  > img {
    max-width: 14px;
  }
`;

const BrandList = styled.div`
  width: 840px;
  display: flex;
  flex-wrap: wrap;
  margin-left: -60px;
`;

const Brand = styled.div`
  min-width: 102px;
  font-size: 13px;
  font-weight: 300;
  margin-left: 65px;
  margin-bottom: 30px;
`;

const BrandDiv = styled.div`
  display: flex;
`;

const BrandText = styled.div`
  min-width: 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    color: #000000;
    font-weight: normal;
  }
`;

export default function BrandsDialog({
  open,
  setOpen,
  data,
  currentData,
  handleBrandClick,
}) {
  const history = useHistory();
  const [newData, setNewData] = useState(data);
  const [onFocus, setOnFocus] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleClose = () => {
    setOpen(false, "brand");
  };

  const ALPHA_OPTIONS_01 = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
  ];

  const ALPHA_OPTIONS_02 = [
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
  ];

  const handleSearchKeyword = (e) => {
    setSearchKeyword(e.target.value);
    e.target.value === ""
      ? setNewData(data)
      : setNewData(
          data.filter(
            (v) =>
              v.brand_nm.indexOf(e.target.value.toUpperCase()) > -1 ||
              v.brand_nm.indexOf(e.target.value.toLowerCase()) > -1
          )
        );
  };

  const handleBtnClick = (d) => {
    setSearchKeyword(d);
    setNewData(
      data.filter(
        (v) =>
          v.brand_nm.indexOf(d.toUpperCase()) > -1 ||
          v.brand_nm.indexOf(d.toLowerCase()) > -1
      )
    );
  };

  const handleFavClick = (id, dib) => {
    setFav.mutate({
      brand_id: id,
      dibs_yn: dib,
    });
  };

  const getFavQuery = useQuery(
    ["fav-brand-list"],
    async () => await apiObject.getFavBrand()
  );

  const fav_list = getFavQuery.isLoading ? [] : !utils.isEmpty(getFavQuery?.data) ? getFavQuery.data.list : [];

  const setFav = useMutation(
    ["fav-brand-set"],
    (value) =>
      apiObject.setFavBrand({
        brand_id: value.brand_id,
        dibs_yn: value.dibs_yn,
      }),
    {
      onSuccess: () => {
        getFavQuery.refetch({});
      },
      onError: () => {
        alert("즐겨찾기 등록 중 오류가 발생했습니다.");
      },
    }
  );

  if (getFavQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <StyleDialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        maxWidth={"lg"}
      >
        <StyleDialogContent>
          <CloseIconBox>
            <CloseIcon onClick={handleClose} />
          </CloseIconBox>
          <Container>
            {/* <LeftWrap>
              Favorite Brand
              <FavList>
                {FAVORITE_LIST.map((d) => (
                  <Fav key={d}>
                    <FavImg src={FavIcon} alt="favorite" />
                    {d}
                  </Fav>
                ))}
              </FavList>
            </LeftWrap> */}
            <RightWrap>
              <Header>
                <AlphaWrap>
                  <AlphaLine>
                    {ALPHA_OPTIONS_01.map((d) => (
                      <Alpha
                        key={d}
                        onClick={() => handleBtnClick(d)}
                        active={
                          d.toLowerCase() === searchKeyword ||
                          d.toUpperCase() === searchKeyword
                            ? true
                            : false
                        }
                      >
                        {d}
                      </Alpha>
                    ))}
                  </AlphaLine>
                  <AlphaLine>
                    {ALPHA_OPTIONS_02.map((d) => (
                      <Alpha
                        key={d}
                        onClick={() => handleBtnClick(d)}
                        active={
                          d.toLowerCase() === searchKeyword ||
                          d.toUpperCase() === searchKeyword
                            ? true
                            : false
                        }
                      >
                        {d}
                      </Alpha>
                    ))}
                    <Alpha double={true}>기타</Alpha>
                  </AlphaLine>
                </AlphaWrap>
                <SearchBox focus={onFocus}>
                  <SearchInput
                    onFocus={() => setOnFocus(true)}
                    onBlur={() => setOnFocus(false)}
                    value={searchKeyword}
                    onChange={handleSearchKeyword}
                    placeholder="브랜드명을 입력하세요."
                  />
                  <SearchImgWrap>
                    <img src={SearchIcon} alt="search" />
                  </SearchImgWrap>
                </SearchBox>
              </Header>
              <Main>
                <BrandList>
                  {newData.length === 0 ? (
                    <Brand>데이터가 없습니다.</Brand>
                  ) : (
                    newData.map((d, i) => (
                      <>
                        <Brand key={`${d.brand_id}_${i}`}>
                          <BrandDiv>
                            <FavImg
                              src={
                                fav_list.find((v) => v.brand_id === d.brand_id)
                                  ? FavIcon
                                  : FavIconOff
                              }
                              onClick={() =>
                                handleFavClick(
                                  d.brand_id,
                                  fav_list.find(
                                    (v) => v.brand_id === d.brand_id
                                  )
                                    ? false
                                    : true
                                )
                              }
                            />
                            <BrandText
                              onClick={() =>
                                handleBrandClick(d.brand_id, d.brand_nm)
                              }
                            >
                              {d.brand_nm}
                            </BrandText>
                          </BrandDiv>
                          <div>{d.brand_kor === null ? "" : d.brand_kor}</div>
                        </Brand>
                      </>
                    ))
                  )}
                </BrandList>
              </Main>
            </RightWrap>
          </Container>
        </StyleDialogContent>
      </StyleDialog>
    </>
  );
}
