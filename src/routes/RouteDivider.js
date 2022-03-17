import React from "react";
import { useQuery } from "react-query";
import { BrowserRouter,useLocation, Switch, Route,HashRouter } from "react-router-dom";
import {BrowserView,MobileView,isBrowser,isMobile} from "react-device-detect";
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
  const shareYn2 = location.hash.includes("/share-lookbook");
  const pressYn2 = location.hash.includes("/share-press");
  const isHashUrl = location.hash.includes("#/");
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

  console.log('isHashUrl',location)
  console.log('isHashUrl',isHashUrl)
  if ( shareYn || pressYn || shareYn2 || pressYn2 ) {

    if ( isHashUrl ) {
      return (
        <RecoilRoot>
          <HashRouter>
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
          </HashRouter>
        </RecoilRoot>
      )
    }else{
      return (
        <>
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
        </>
      )
    }
  }else{
    return (
      <>
        {data === "BRAND" && <BrandRoutes />}
        {data === "MAGAZINE" && <MagazineRoutes />}
        {data === "STYLIST" && <StylistRoutes />}
      </>
    );
  }
}