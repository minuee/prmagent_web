import React from "react";
import { useQuery } from "react-query";
import { useLocation, Switch, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { apiObject } from "api/api_common";
import BrandRoutes from "./BrandRoute";
import MagazineRoutes from "./MagazineRoute";
import StylistRoutes from "./StylistRoute";
import Progress from "components/common/progress";
import LookbookShare from "pages/Share/LookbookShare";
import LookbookShareDetail from "pages/Share/LookbookShareDetail";
import PressShare from "pages/Share/PressShare";

export default function RouteDivder() {
  const location = useLocation();
  const shareYn = location.pathname.includes("/share-lookbook");
  const pressYn = location.pathname.includes("/share-press");

  const userTypeQuery = useQuery(
    ["user-type"],
    async () => await apiObject.getUserType()
  );

  const data = userTypeQuery.isLoading
    ? []
    : userTypeQuery.data.is_brand_user
    ? "BRAND"
    : userTypeQuery.data.is_mgzn_user
    ? "MAGAZINE"
    : "STYLIST";
  // const data = "MAGAZINE";

  if (userTypeQuery.isLoading) {
    return <Progress type="load" />;
  }
  
  return (
    <>
      {shareYn || pressYn ? (
        <RecoilRoot>
          <Switch>
            <Route exact path="/share-lookbook" component={LookbookShare} />
            <Route exact path="/share-lookbook/:uuid" component={LookbookShare} />
            <Route
              exact
              path="/share-lookbook-detail"
              component={LookbookShareDetail}
            />
            <Route
              exact
              path="/share-lookbook-detail/:uuid/:showroom_no"
              component={LookbookShareDetail}
            />
            <Route exact path="/share-press" component={PressShare} />
            <Route exact path="/share-press/:uuid" component={PressShare} />
          </Switch>
        </RecoilRoot>
      ) : (
        <>
          {data === "BRAND" && <BrandRoutes />}
          {data === "MAGAZINE" && <MagazineRoutes />}
          {data === "STYLIST" && <StylistRoutes />}
        </>
      )}
    </>
  );
}
