import React from "react";
import { Switch, Route, Redirect,useLocation } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Layout from "layout/Magazine/Layout";
import Main from "pages/Magazine/Main";
import DigitalShowroom from "pages/Magazine/digital_showroom";
import DigitalShowroomDetail from "pages/Magazine/digital_showroom/Detail";
import SampleRequest from "pages/Magazine/sample_request";
import SampleRequestDetail from "pages/Magazine/sample_request/Detail";
import SampleRequestEdit from "pages/Magazine/sample_request/Edit";
import SampleRequestAdd from "pages/Magazine/sample_request/Add";
import SampleRequestTemporary from "pages/Magazine/sample_request/Temporary";
import Scheduler from "pages/Magazine/scheduler";
// import Pickup from "pages/Magazine/pickup";
// import PickupDetailPage from "pages/Magazine/pickup/DetailPage";
import Pickup from "pages/Magazine/new_pickup";
import PickupDetailPage from "pages/Magazine/new_pickup/DetailPage";
import PickupDetailReqPage from "pages/Magazine/new_pickup/reqDetail";
import PressRelease from "pages/Magazine/press_release";
import PressReleaseDetail from "pages/Magazine/press_release/Detail";
import MyAccount from "pages/Magazine/my_account";

import Question from "pages/Magazine/question";
import Alarm from "pages/Magazine/alarm";
import { NoticeListPage, NoticeDetailPage } from "pages/Magazine/Notice";
import SearchResultPage from "pages/Magazine/search";
// import FavoritesPage from "pages/Magazine/Favorites";
import FavoritesPage from "pages/Magazine/new_favorites";

export default function Routes() {
  const { pathname } = useLocation();
  return (
    <RecoilRoot>
      <Switch>
        <Layout hasRightMargin={!pathname.includes("scheduler")}>
          <Route path="/" exact>
            <Redirect to="/magazine/home" />
          </Route>
          <Route path="/brand/home" exact>
            <Redirect to="/magazine/home" />
          </Route>
          <Route exact path="/magazine/home" component={Main} />
          <Route
            exact
            path="/magazine/digital_showroom"
            component={DigitalShowroom}
          />
          <Route
            exact
            path="/magazine/digital_showroom/:brand_id"
            component={DigitalShowroom}
          />
          <Route
            exact
            path="/magazine/digital_showroom/detail/:item_no"
            component={DigitalShowroomDetail}
          />
          <Route
            exact
            path="/magazine/sample_requests"
            component={SampleRequest}
          />
          <Route
            exact
            path="/magazine/sample_requests/detail/:request_no"
            component={SampleRequestDetail}
          />
          <Route
            exact
            path="/magazine/sample_requests/edit/:request_no"
            component={SampleRequestEdit}
          />
          <Route
            exact
            path="/magazine/sample_requests/add/:showroom_list"
            component={SampleRequestAdd}
          />
          <Route
            exact
            path="/magazine/sample_requests/temporary/:showroom_list"
            component={SampleRequestTemporary}
          />
          <Route exact path="/magazine/scheduler" component={Scheduler} />
          <Route exact path="/magazine/pickup" component={Pickup} />
          <Route
            exact
            path="/magazine/pickup/req/:req_no/:view/:showroom_no"
            component={PickupDetailReqPage}
          />
          <Route
            exact
            path="/magazine/pickup/:timestamp/:view"
            component={PickupDetailPage}
          />
          <Route
            exact
            path="/magazine/press_release"
            component={PressRelease}
          />
          <Route
            exact
            path="/magazine/press_release/:brand_id"
            component={PressRelease}
          />
          <Route
            exact
            path="/magazine/press_release/detail/:press_no"
            component={PressReleaseDetail}
          />
          <Route exact path="/magazine/question" component={Question} />
          <Route exact path="/magazine/question/:qna_no" component={Question} />
          <Route exact path="/magazine/alarm" component={Alarm} />
          <Route exact path="/magazine/my_account" component={MyAccount} />
          <Route exact path="/magazine/notice" component={NoticeListPage} />
          <Route
            exact
            path="/magazine/notice/:notice_no"
            component={NoticeDetailPage}
          />
          <Route exact path="/magazine/search/" component={SearchResultPage} />
          <Route
            exact
            path="/magazine/search/:keyword"
            component={SearchResultPage}
          />
          <Route exact path="/magazine/favorites" component={FavoritesPage} />
          <Route
            exact
            path="/magazine/favorites/:loc"
            component={FavoritesPage}
          />
          <Route
            exact
            path="/magazine/favorites/:brand_id/:loc"
            component={FavoritesPage}
          />
        </Layout>
      </Switch>
    </RecoilRoot>
  );
}
