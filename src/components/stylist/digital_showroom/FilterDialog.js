import React, { useState } from "react";
import {
  DialogTitle,
  DialogContent,
  Dialog,
  DialogActions,
  Divider,
} from "@material-ui/core";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { useQuery } from "react-query";

import { DIGITAL_SHOWROOM_FILTER_SUBMENU } from "mock/Mock";
import CategoryComponent from "./CategoryComponent";
import MaterialComponent from "./MaterialComponent";
import ColorComponent from "./ColorComponent";
import SizeComponent from "./SizeComponent";
import CheckboxComponent from "./CheckboxComponent";
import CancelIcon from "assets/close_icon.png";
import CheckIcon from "assets/check_icon.png";
import { apiObject } from "api/api_stylist";
import Progress from "components/common/progress";

const useStyles = makeStyles(() => ({
  dialog: {},
  dialogTitle: {
    marginTop: "58px",
    textAlign: "center",
  },
  dialogContent: {
    padding: "0 80px",
    minHeight: "640px",
  },
  closeIcon: {
    fontSize: "24px",
  },
  inputText: {
    height: "0px",
    fontSize: "14px",
  },
  inputBgText: {
    height: "0px",
    fontSize: "14px",
    backgroundColor: "#f6f6f6",
  },
  checkIcon: {
    paddingTop: "5px",
    paddingRight: "5px",
    fontSize: "24px",
    color: "#7ea1b2",
  },
  TextField: {
    width: "340px",
    height: 0,
  },
}));

const StyleDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0);
  }
  .MuiPaper-rounded {
    border-radius: 20px;
  }
  .MuiDialogTitle-root {
    padding: 0;
  }
`;

const TitleWrap = styled.div`
  width: 1140px;
  height: 40px;
  padding: 0 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleTxt = styled.div`
  font-size: 28px;
  font-weight: 900;
`;

const TitleBtnWrap = styled.div`
  display: flex;
  align-items: center;
`;

const TitleBtnTxt = styled.div`
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  color: #777777;
  width: ${(props) => props.width || "auto"};

  & + & {
    margin-left: 24px;
  }

  ${(props) =>
    props.active
      ? css`
          color: ${(props) =>
            props.type === "detail" ? "#7ea1b2" : "#000000"};
          &:hover {
            font-weight: bold;
          }
        `
      : css`
          &:hover {
            color: #000000;
          }
        `}}
`;

const CloseIconBox = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const DividerWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const StlyeDivider = styled(Divider)`
  width: 980px;
  height: 2px;
  background-color: #dddddd;
  margin: 16px 0 24px 0;
`;

const SubMenuWrap = styled.div`
  display: flex;
  padding: 0 80px;
  margin-bottom: 48px;
`;

const SubMenuText = styled.div`
  font-size: 16px;
  color: #777777;
  cursor: pointer;
  width: ${(props) => props.width || "auto"};

  & + & {
    margin-left: 30px;
  }

  &:hover {
    color: #000000;
  }

  ${(props) =>
    props.active &&
    css`
      font-weight: bold;
      color: #000000;
    `}
  ${(props) =>
    props.selected &&
    css`
      color: #7ea1b2;
      &:hover {
        color: ${darken(0.1, "#7ea1b2")};
      }
    `}
`;

const BottomWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 80px 30px 80px;
`;

const BtnWrap = styled.div`
  width: 160px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.type === "cancel" ? "#ffffff" : "#7ea1b2"};
  border: ${(props) =>
    props.type === "cancel" ? "solid 1px #dddddd" : "none"};
  border-radius: 5px;
  transition: all 0.3s;

  ${(props) =>
    props.type === "cancel" &&
    css`
      &:hover {
        background-color: ${darken(0.1, "#ffffff")};
      }
      &:active {
        background-color: ${darken(0.2, "#ffffff")};
      }
    `}

  ${(props) =>
    props.type === "confirm" &&
    css`
      &:hover {
        background-color: ${darken(0.1, "#7ea1b2")};
      }
      &:active {
        background-color: ${darken(0.2, "#7ea1b2")};
      }
    `} 

  & + & {
    margin-left: 10px;
  }
`;

const BtnImgWrap = styled.div`
  margin-right: 10px;
  display: flex;
`;

const CancelTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #999999;
`;

const ConfirtTxt = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #ffffff;
`;

export default function FilterDialog({
  open,
  setOpen,
  filterData,
  setFilterData,
}) {
  const classes = useStyles();
  const [filterSubmenu, setFilterSubmenu] = useState("Category");
  const [selectGender, setSelectGender] = useState([]);
  const [selectCategory, setSelectCategory] = useState([]);
  const [checkCategoryAll, setCheckCategoryAll] = useState({
    rtw: false,
    bag: false,
    deco: false,
    acc: false,
    jewelry: false,
    shoes: false,
  });
  const [selectMaterial, setSelectMaterial] = useState([]);
  const [checkMaterialAll, setCheckMaterialAll] = useState(false);
  const [selectColor, setSelectColor] = useState([]);
  const [checkColorAll, setCheckColorAll] = useState(false);
  const [selectSize, setSelectSize] = useState([]);
  const [checkSizeAll, setCheckSizeAll] = useState({
    rtw: false,
    womenShoes: false,
    menShoes: false,
  });
  const [sample, setSample] = useState("all");
  const [stillLifeImg, setStillLifeImg] = useState("all");

  const handleClose = () => {
    setOpen(!open);
  };

  const handleFilterSubmenu = (data) => {
    setFilterSubmenu(data);
  };

  const handleSelect = (data) => {
    selectCategory.includes(data)
      ? setSelectCategory(selectCategory.filter((v) => v !== data))
      : setSelectCategory([...selectCategory, data]);
  };

  const handleSelectCategoryAll = (data, name) => {
    if (!checkCategoryAll[name]) {
      let arr = [];
      selectCategory.forEach((d) => arr.push(d));
      data.forEach(
        (d) =>
          !arr.includes(d.sample_catgry_middle_cl_cd) &&
          arr.push(d.sample_catgry_middle_cl_cd)
      );
      setSelectCategory(arr);
      setCheckCategoryAll({ ...checkCategoryAll, [name]: true });
    } else {
      let dataArr = [];
      let resultArr = [];
      data.forEach((d) => dataArr.push(d.sample_catgry_middle_cl_cd));

      selectCategory.forEach((v) => !dataArr.includes(v) && resultArr.push(v));
      setSelectCategory(resultArr);
      setCheckCategoryAll({ ...checkCategoryAll, [name]: false });
    }
  };

  const handleMaterialSelect = (data) => {
    selectMaterial.includes(data)
      ? setSelectMaterial(selectMaterial.filter((v) => v !== data))
      : setSelectMaterial([...selectMaterial, data]);
  };

  const handleMaterialSelectAll = (data) => {
    if (!checkMaterialAll) {
      let arr = [];
      data.forEach((d) => arr.push(d.cd_id));
      setSelectMaterial(arr);
      setCheckMaterialAll(true);
    } else {
      setSelectMaterial([]);
      setCheckMaterialAll(false);
    }
  };

  const handleColorSelect = (data) => {
    selectColor.includes(data)
      ? setSelectColor(selectColor.filter((v) => v !== data))
      : setSelectColor([...selectColor, data]);
  };

  const handleColorSelectAll = (data) => {
    if (!checkColorAll) {
      let arr = [];
      data.forEach((d) => arr.push(d.cd_id));
      setSelectColor(arr);
      setCheckColorAll(true);
    } else {
      setSelectColor([]);
      setCheckColorAll(false);
    }
  };

  const handleSizeSelect = (data) => {
    selectSize.includes(data)
      ? setSelectSize(selectSize.filter((v) => v !== data))
      : setSelectSize([...selectSize, data]);
  };

  const handleSizeSelectAll = (data, name) => {
    if (!checkSizeAll[name]) {
      let arr = [];
      selectSize.forEach((d) => arr.push(d));
      data.forEach((d) => !arr.includes(d.cd_id) && arr.push(d.cd_id));
      setSelectSize(arr);
      setCheckSizeAll({ ...checkSizeAll, [name]: true });
    } else {
      let dataArr = [];
      let resultArr = [];
      data.forEach((d) => dataArr.push(d.cd_id));

      selectSize.forEach((v) => !dataArr.includes(v) && resultArr.push(v));
      setSelectSize(resultArr);
      setCheckSizeAll({ ...checkSizeAll, [name]: false });
    }
  };

  const handleGenderSelect = (data) => {
    if (data === "SSS001") {
      if (selectGender.length === 2 && !selectGender.includes(data)) {
        setSelectGender([]);
      } else {
        selectGender.includes(data)
          ? setSelectGender(selectGender.filter((v) => v !== data))
          : setSelectGender([...selectGender, data]);
      }
    } else if (data === "SSS002") {
      if (selectGender.length === 2 && !selectGender.includes(data)) {
        setSelectGender([]);
      } else {
        selectGender.includes(data)
          ? setSelectGender(selectGender.filter((v) => v !== data))
          : setSelectGender([...selectGender, data]);
      }
    } else {
      if (selectGender.length === 2 && !selectGender.includes(data)) {
        setSelectGender([]);
      } else {
        selectGender.includes(data)
          ? setSelectGender(selectGender.filter((v) => v !== data))
          : setSelectGender([...selectGender, data]);
      }
    }
  };

  const handleReset = () => {
    // Gender 초기화
    setSelectGender([]);

    // Category 초기화
    setSelectCategory([]);
    setCheckCategoryAll({
      rtw: false,
      bag: false,
      deco: false,
      acc: false,
      jewelry: false,
      shoes: false,
    });

    // Color 초기화
    setSelectColor([]);
    setCheckColorAll(false);

    // Size 초기화
    setSelectSize([]);
    setCheckSizeAll({
      rtw: false,
      womenShoes: false,
      menShoes: false,
    });

    // Material 초기화
    setSelectMaterial([]);
    setCheckMaterialAll(false);

    // Sample 초기화
    setSample("all");

    // Still Life Img 초기화
    setStillLifeImg("all");
  };

  const handleConfirm = () => {
    setFilterData({
      ...filterData,
      gender_list: selectGender,
      category_list: selectCategory,
      color_list: selectColor,
      size_list: selectSize,
      material_list: selectMaterial,
      in_yn: sample === "all" ? null : sample === "posession" ? true : false,
      still_life_img_yn:
        stillLifeImg === "all"
          ? null
          : stillLifeImg === "posession"
          ? true
          : false,
    });
    setOpen(false);
  };

  const sampleInfo = useQuery(
    ["sample-cd-info"],
    async () => await apiObject.getSampleInfo()
  );

  const sampleData = sampleInfo.isLoading ? [] : sampleInfo.data;

  if (sampleInfo.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <StyleDialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        maxWidth={"lg"}
        className={classes.dialog}
      >
        <DialogTitle id="simple-dialog-title" className={classes.dialogTitle}>
          <TitleWrap>
            <TitleTxt>Filter</TitleTxt>
            <TitleBtnWrap>
              <TitleBtnTxt
                active={selectGender.length === 0}
                width="45px"
                onClick={() => setSelectGender([])}
              >
                All
              </TitleBtnTxt>
              {sampleData.gender.map((d) => (
                <TitleBtnTxt
                  key={d.cd_id}
                  active={selectGender.find((v) => v === d.cd_id)}
                  type="detail"
                  width="80px"
                  onClick={() => handleGenderSelect(d.cd_id)}
                >
                  {d.cd_id === "SSS001"
                    ? "Women"
                    : d.cd_id === "SSS002"
                    ? "Men"
                    : "Genderless"}
                </TitleBtnTxt>
              ))}
            </TitleBtnWrap>
          </TitleWrap>
          <CloseIconBox>
            <CloseIcon className={classes.closeIcon} onClick={handleClose} />
          </CloseIconBox>
          <DividerWrap>
            <StlyeDivider />
          </DividerWrap>
          <SubMenuWrap>
            {DIGITAL_SHOWROOM_FILTER_SUBMENU.map((d) => (
              <SubMenuText
                key={d}
                active={filterSubmenu === d ? true : false}
                selected={
                  d === "Category"
                    ? selectCategory.length > 0
                    : d === "Color"
                    ? selectColor.length > 0
                    : d === "Material"
                    ? selectMaterial.length > 0
                    : d === "Sample"
                    ? sample !== "all"
                    : d === "Still Life Image"
                    ? stillLifeImg !== "all"
                    : d === "Size"
                    ? selectSize.length > 0
                    : false
                }
                onClick={() => handleFilterSubmenu(d)}
              >
                {d}
              </SubMenuText>
            ))}
          </SubMenuWrap>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {filterSubmenu === "Category" && (
            <CategoryComponent
              data={sampleData.category}
              select={selectCategory}
              handleSelect={handleSelect}
              handleSelectAll={handleSelectCategoryAll}
            />
          )}
          {filterSubmenu === "Color" && (
            <ColorComponent
              data={sampleData.color}
              select={selectColor}
              handleSelect={handleColorSelect}
              handleSelectAll={handleColorSelectAll}
            />
          )}
          {filterSubmenu === "Size" && (
            <SizeComponent
              data={
                sampleData.category.find(
                  (v) => v.sample_catgry_lrge_cl_cd === "SCLC05"
                ).gender_size_list
              }
              isRtw={
                selectCategory.includes("SCMC01") ||
                selectCategory.includes("SCMC02") ||
                selectCategory.includes("SCMC03") ||
                selectCategory.includes("SCMC04") ||
                selectCategory.includes("SCMC05") ||
                selectCategory.includes("SCMC06") ||
                selectCategory.includes("SCMC07") ||
                selectCategory.includes("SCMC08") ||
                selectCategory.includes("SCMC09") ||
                selectCategory.includes("SCMC10")
              }
              isShoes={
                selectCategory.includes("SCMC35") ||
                selectCategory.includes("SCMC36") ||
                selectCategory.includes("SCMC37") ||
                selectCategory.includes("SCMC38") ||
                selectCategory.includes("SCMC39") ||
                selectCategory.includes("SCMC40") ||
                selectCategory.includes("SCMC41") ||
                selectCategory.includes("SCMC42") ||
                selectCategory.includes("SCMC43") ||
                selectCategory.includes("SCMC44")
              }
              select={selectSize}
              handleSelect={handleSizeSelect}
              handleSelectAll={handleSizeSelectAll}
            />
          )}
          {filterSubmenu === "Material" && (
            <MaterialComponent
              data={sampleData.material}
              select={selectMaterial}
              handleSelect={handleMaterialSelect}
              handleSelectAll={handleMaterialSelectAll}
            />
          )}
          {filterSubmenu === "Sample" && (
            <CheckboxComponent check={sample} setCheck={setSample} />
          )}
          {filterSubmenu === "Still Life Image" && (
            <CheckboxComponent
              check={stillLifeImg}
              setCheck={setStillLifeImg}
            />
          )}
        </DialogContent>
        <DividerWrap>
          <StlyeDivider />
        </DividerWrap>
        <DialogActions>
          <BottomWrap>
            <BtnWrap type="cancel" onClick={handleReset}>
              <CancelTxt>Reset</CancelTxt>
            </BtnWrap>
            <BtnWrap type="cancel" onClick={handleClose}>
              <BtnImgWrap>
                <img src={CancelIcon} alt="close"></img>
              </BtnImgWrap>
              <CancelTxt>Cancel</CancelTxt>
            </BtnWrap>
            <BtnWrap type="confirm" onClick={handleConfirm}>
              <BtnImgWrap>
                <img src={CheckIcon} alt="check"></img>
              </BtnImgWrap>
              <ConfirtTxt>Confirm</ConfirtTxt>
            </BtnWrap>
          </BottomWrap>
        </DialogActions>
      </StyleDialog>
    </>
  );
}
