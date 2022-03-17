import React, { useState } from "react";
import styled from "styled-components";
import {Box} from "@material-ui/core";
import { darken } from "polished";
import moment from "moment";
import { useQuery } from "react-query";
import { Divider } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import Title from "components/stylist/send_outs/Title";
import SendoutContent from "components/stylist/send_outs/SendoutContent";
import { apiObject } from "api/api_stylist";
import Progress from "components/common/progress";
import utils from "utils";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer,currentPickupStartDt,currentPickupEndDt,currentSendOutSelect,currentPickupMenu,currentPickupSelect } from "redux/state";

export default function SendOuts() {
  const history = useHistory();  
  const [checked, setChecked] = useState([]);
  const [total, setTotal] = useState(0);
  const [view, setView] = useRecoilState(currentPickupMenu);
  const [brandId, setBrandId] = useRecoilState(currentPickupSelect);
  const [startDt, setStartDt] = useRecoilState(currentPickupStartDt);
  const [endDt, setEndDt] = useRecoilState(currentPickupEndDt);

  const handleChecked = (day, cnt) => {
    setChecked(
      checked.includes(day)
        ? checked.filter((d) => d !== day)
        : [...checked, day]
    );
    checked.includes(day) ? setTotal(total - cnt) : setTotal(total + cnt);
  };

  const handleDetail = () => {
    let newArr = "";
    let checkedData = checked.sort();
    checkedData.forEach((v, i) =>
      i !== checkedData.length - 1 ? (newArr += v + "+") : (newArr += v)
    );
    let viewType = view === "Pickups" ? "pickups" : "sendout";
    history.push("/stylist/pickup/" + newArr + "/" + viewType);
  };

  const handleEachDetail = (req_no) => {
    let viewType = view === "Pickups" ? "pickups" : "sendout";
    history.push("/stylist/pickup/req/" + req_no + "/" + viewType);
  };

  const handleBrandId = (e) => {
    setBrandId(e.target.value);
  };

  const handleViewInit = () => {
    setChecked([]);
    setTotal(0);
  };

  const queryData = useQuery(
    [
      "pickup-scheduler",
      moment(startDt).unix(),
      moment(endDt).unix(),
      view,
      brandId,
    ],
    async () =>
      view === "Pickups"
        ? await apiObject.getPickupSchedule({
            start_date: moment(startDt).unix(),
            fin_date: moment(endDt).unix(),
            brand_id: brandId,
          })
        : await apiObject.getSendoutSchedule({
            start_date: moment(startDt).unix(),
            fin_date: moment(endDt).unix(),
            brand_id: brandId,
          })
  );

  const data = queryData.isLoading 
    ? [] 
    : !utils.isEmpty(queryData?.data?.list) 
      ? queryData?.data?.list 
      : [];
  const brandList = queryData.isLoading
    ? []
    : 
    !utils.isEmpty(queryData?.data?.brand_list) ?
    queryData.data.brand_list.map((d) => ({
        cd_id: d.brand_id,
        cd_nm: d.brand_nm,
      }))
    :
    []
    ;

  if (queryData.isLoading) {
    return <Progress type="load" />;
  }

  console.log("TOTAL: ", total);
  console.log("DATA : ", data);

  return (
    <Container>
      <Title
        view={view}
        setView={setView}
        startDt={startDt}
        setStartDt={setStartDt}
        endDt={endDt}
        setEndDt={setEndDt}
        brandId={brandId}
        brandList={brandList}
        handleBrandId={handleBrandId}
        handleViewInit={handleViewInit}
      />
      <ContentsWrap>
        {
          data.length === 0 ?
          <Box
            minHeight={"30vh"}
            width={"100%"}
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize={20}
          >
            해당 기간에 포함된 데이터가 존재하지 않습니다.
          </Box>
          :
          data.map((d, i) => (
            <React.Fragment key={`${d.date}_${i}`}>
              <SendoutContent
                data={d}
                checked={checked}
                handleChecked={handleChecked}
                handleEachDetail={handleEachDetail}
              />
              {i !== data.length - 1 && <StyleDivider />}
            </React.Fragment>
          ))}
      </ContentsWrap>
      {total > 0 && (
        <CreactBox>
          <TextWrap>
            <div>Total Number Of</div>
            <div className="bold">{view} : </div>
            <div className="total">{total}</div>
          </TextWrap>
          <CreateBtn onClick={handleDetail}>Create Document</CreateBtn>
        </CreactBox>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  @media (min-width: 1920px) {
    width: 1480px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 950px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 600px
  }  
`;

const ContentsWrap = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f1f2ea;
  border-radius: 15px;
`;

const StyleDivider = styled(Divider)`
  height: 2px;
  background-color: #dddddd;
`;

const CreactBox = styled.div`
  display: flex;
  width: 647px;
  height: 120px;
  background-color: #ffffff;
  bottom: 0;
  right: 60px;
  padding: 0 40px;
  justify-content: space-between;
  align-items: center;
  border: solid 1px #dddddd;
  border-radius: 20px 20px 0 0;
  box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.16);
  position: fixed;
  z-index: 5;
`;

const TextWrap = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 300;
  color: #000000;

  .bold {
    font-weight: bold;
    margin-left: 5px;
  }
  .total {
    font-size: 72px;
    font-weight: bold;
    color: #7ea1b2;
    margin-left: 5px;
  }
`;

const CreateBtn = styled.div`
  width: 189px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.16);
  background-color: #7ea1b2;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
  }
  &:active {
    background-color: ${darken(0.2, "#7ea1b2")};
  }
`;
