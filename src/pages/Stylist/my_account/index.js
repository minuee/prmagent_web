import React, { useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";

import { apiObject as apiCommon } from "api/api_common";
import MyAccountComponent from "components/stylist/my_account/myAccountComponent";
import Progress from "components/common/progress";

export default function MyAccount() {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(["stylist-myinfo"]);
  // 포지션 검색
  const stylistPosition = useQuery(
    ["stylist-position"],
    async () => await apiCommon.getStylistPosition(() => {})
  );
  const STYLIST_POSITION_DATA = useMemo(() =>
    stylistPosition.isLoading
      ? []
      : stylistPosition.data.list.map((item) => ({
          label: item.cd_nm,
          value: item.cd_id,
        }))
  );

  if (stylistPosition.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <>
      <MyAccountComponent data={data} position={STYLIST_POSITION_DATA} />
    </>
  );
}
