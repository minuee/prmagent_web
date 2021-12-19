import React, { useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";

import { apiObject as apiCommon } from "api/api_common";
import MyAccountComponent from "components/brand/my_account/myAccountComponent";
import Progress from "components/common/progress";

export default function MyAccount() {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(["brand-myinfo"]);
  // 포지션 검색
  const brandPosition = useQuery(
    ["brand-position"],
    async () => await apiCommon.getBrandPosition(() => {})
  );
  const BRAND_POSITION_DATA = useMemo(() =>
    brandPosition.isLoading
      ? []
      : brandPosition.data.list.map((item) => ({
          label: item.cd_nm,
          value: item.cd_id,
        }))
  );

  if (brandPosition.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <MyAccountComponent data={data} position={BRAND_POSITION_DATA} />
    </>
  );
}
