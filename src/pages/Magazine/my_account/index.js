import React, { useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";

import { apiObject as apiCommon } from "api/api_common";
import MyAccountComponent from "components/magazine/my_account/myAccountComponent";
import Progress from "components/common/progress";

export default function MyAccount() {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(["magazine-myinfo"]);

  // 브랜드 회사 검색
  const mgznCompanySearch = useQuery(
    ["mgzn-company"],
    async () => await apiCommon.getMagazineSearchCompany(() => {})
  );
  const MGZN_COMPANY = useMemo(() =>
    mgznCompanySearch.isLoading
      ? []
      : mgznCompanySearch.data.list.map((item) => ({
          label: item.compy_nm,
          value: item.mgzn_id,
        }))
  );

  // 포지션 검색
  const mgznPosition = useQuery(
    ["mgzn-position"],
    async () => await apiCommon.getMagazinePosition(() => {})
  );
  const MGZN_POSITION_DATA = useMemo(() =>
    mgznPosition.isLoading
      ? []
      : mgznPosition.data.list.map((item) => ({
          label: item.cd_nm,
          value: item.cd_id,
        }))
  );

  if (mgznCompanySearch.isLoading) {
    return <Progress type="load" />;
  }
  if (mgznPosition.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <MyAccountComponent
        data={data}
        company={MGZN_COMPANY}
        position={MGZN_POSITION_DATA}
      />
    </>
  );
}
