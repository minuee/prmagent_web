import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import utils from "utils";
import alertConfirm from 'react-alert-confirm';
import Constants from 'utils/constants';

import SampleRequestsTable from "components/stylist/sample_requests/SampleRequestsTable";
import BrandsDialog from "components/stylist/sample_requests/BrandsDialog";
import { apiObject } from "api/api_stylist";
import { apiObject as apiCommon } from "api/api_common";
import Progress from "components/common/progress";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentPage,currentPageName } from "redux/state";

const TitleTxt = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-right: 40px;
  margin-bottom: 60px;
`;

export default function SampleRequest(props) {
  const history = useHistory();
  const scroll = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [scroll]);
  const [allCheck, setAllCheck] = useState(false);
  const [checked, setChecked] = useState([]);
  const [onFilter, setOnFilter] = useState({
    brand: false,
    shooting_dt: false,
    req_dt: false,
    req_status: false,
  });
  const [filter, setFilter] = useState({
    brand: false,
    shooting_dt: false,
    req_dt: false,
    req_status: false,
  });
  const [reqStatus, setReqStatus] = useState("All");
  const [currentBrand, setCurrentBrand] = useState({
    brand_id: "",
    brand_nm: "",
  });

  const [page, setPage] = useRecoilState(currentPage);
  const [pageName, setPageName] = useRecoilState(currentPageName);
  if( props.location.pathname !== pageName ) {
    setPage(1);
    setPageName(props.location.pathname)
  }

  const handleChecked = (idx) => {
    setChecked(
      checked.includes(idx)
        ? checked.filter((c) => c !== idx)
        : [...checked, idx]
    );
  };

  const handleAllChecked = () => {
    if (allCheck) {
      setChecked([]);
      setAllCheck(false);
    } else {
      let allValue = [];
      data.forEach((d) => {
        allValue.push(d.req_no);
      });
      setChecked(allValue);
      setAllCheck(true);
    }
  };

  const handleDetail = (no) => {
    history.push("/stylist/sample_requests/detail/" + no);
  };

  const handleFilter = (active, type) => {
    if (active) {
      if (type === "brand") {
        setOnFilter({
          brand: !onFilter.brand,
          shooting_dt: false,
          req_dt: false,
          req_status: false,
        });
      } else if (type === "shooting_dt") {
        setOnFilter({
          brand: false,
          shooting_dt: !onFilter.shooting_dt,
          req_dt: false,
          req_status: false,
        });
      } else if (type === "req_dt") {
        setOnFilter({
          brand: false,
          shooting_dt: false,
          req_dt: !onFilter.req_dt,
          req_status: false,
        });
      } else if (type === "req_status") {
        setOnFilter({
          brand: false,
          shooting_dt: false,
          req_dt: false,
          req_status: !onFilter.req_status,
        });
      } else {
        console.log("wrong type!");
      }
    } else {
      if (type === "brand") {
        setFilter({
          brand: !filter.brand,
          shooting_dt: false,
          req_dt: false,
          req_status: false,
        });
        setOnFilter({
          brand: true,
          shooting_dt: false,
          req_dt: false,
          req_status: false,
        });
      } else if (type === "shooting_dt") {
        setFilter({
          brand: false,
          shooting_dt: !filter.shooting_dt,
          req_dt: false,
          req_status: false,
        });
        setOnFilter({
          brand: false,
          shooting_dt: true,
          req_dt: false,
          req_status: false,
        });
      } else if (type === "req_dt") {
        setFilter({
          brand: false,
          shooting_dt: false,
          req_dt: !filter.req_dt,
          req_status: false,
        });
      } else if (type === "req_status") {
        setFilter({
          brand: false,
          shooting_dt: false,
          req_dt: false,
          req_status: !filter.req_status,
        });
      } else {
        console.log("wrong type!");
      }
    }
  };

  const handleCheckedInit = () => {
    setAllCheck(false);
    setChecked([]);
  };

  const handleSubmit = (e) => {
    setPage(1);
    setAllCheck(false);
    sampleRequestList.refetch({});
  };

  const handleDelete = () => {
    if ( checked.length > 0 ) {
      /* if (confirm("문의내역을 삭제하시겠습니까?")) {
        delSampleRequest.mutate();
      } */
      alertConfirm({
        title: Constants.appName,
        content: '정보를 삭제하시겠습니까?',
        onOk: () => {
          delSampleRequest.mutate()
        },
        onCancel: () => {console.log('cancel')}
      });
    }else{
      utils.customAlert('삭제할 데이터를 선택해주세요.')
    }
  };

  const handleBrandClick = (id, nm) => {
    setCurrentBrand({
      brand_id: id,
      brand_nm: nm,
    });
    setFilter("brand");
  };

  // List call
  const sampleRequestList = useQuery(
    [
      "sample-request-list",
      page,
      currentBrand.brand_id,
      onFilter.shooting_dt,
      onFilter.req_dt,
      filter.shooting_dt,
      filter.req_dt,
      reqStatus,
    ],
    async () =>
      await apiObject.getSampleRequest({
        page,
        limit: 10,
        brand_id: currentBrand.brand_id,
        order_photogrf_dt: onFilter.shooting_dt,
        order_req_dt: onFilter.req_dt,
        desc: onFilter.shooting_dt
          ? !filter.shooting_dt
          : onFilter.req_dt
          ? !filter.req_dt
          : false,
        request_status:
          reqStatus === "pending"
            ? "PENDING"
            : reqStatus === "confirmed"
            ? "CONFIRMED"
            : reqStatus === "canceled"
            ? "CANCELED"
            : "",
      }),
    { keepPreviousData: true }
  );

  const data = sampleRequestList.isLoading ? [] : sampleRequestList.data.list;

  // brand list
  const brandListQuery = useQuery(
    ["brand-list"],
    async () => await apiCommon.getBrandSearchCompany({ search_text: "" })
  );

  const brand_list = brandListQuery.isLoading ? [] : brandListQuery.data.list;

  // delete
  const delSampleRequest = useMutation(
    ["delete-sample-request"],
    () => apiObject.delSampleRequest({ req_list: checked }),
    {
      onSuccess: () => {
        alert("정상적으로 삭제처리 되었습니다.");
        handleCheckedInit();
        sampleRequestList.refetch({});
      },
      onError: () => {
        alert("삭제 중 오류가 발생했습니다.");
      },
    }
  );

  if (sampleRequestList.isLoading) {
    return <Progress type="load" />;
  }

  if (delSampleRequest.isLoading) {
    return <Progress type="upload" />;
  }

  if (brandListQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <TitleTxt>My Requests</TitleTxt>
      <SampleRequestsTable
        data={data}
        allCheck={allCheck}
        setAllCheck={handleAllChecked}
        checked={checked}
        handleChecked={handleChecked}
        handleDetail={handleDetail}
        page={page}
        setPage={setPage}
        totalCount={
          sampleRequestList.isLoading ? 1 : sampleRequestList.data.total_count
        }
        onFilter={onFilter}
        setOnFilter={setOnFilter}
        filter={filter}
        setFilter={setFilter}
        handleFilter={handleFilter}
        reqStatus={reqStatus}
        setReqStatus={setReqStatus}
        handleSubmit={handleSubmit}
        setCheckedInit={handleCheckedInit}
        handleDelete={handleDelete}
      />

      <BrandsDialog
        open={filter.brand}
        setOpen={handleFilter}
        data={brand_list}
        currentData={currentBrand}
        handleBrandClick={handleBrandClick}
      />
    </>
  );
}
