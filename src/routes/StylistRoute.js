import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Layout from "layout/Stylist/Layout";
import Main from "pages/Stylist/Main";
import DigitalShowroom from "pages/Stylist/digital_showroom";
import DigitalShowroomDetail from "pages/Stylist/digital_showroom/Detail";
import SampleRequest from "pages/Stylist/sample_request";
import SampleRequestDetail from "pages/Stylist/sample_request/Detail";
import SampleRequestEdit from "pages/Stylist/sample_request/Edit";
import SampleRequestAdd from "pages/Stylist/sample_request/Add";
import SampleRequestTemporary from "pages/Stylist/sample_request/Temporary";
import Scheduler from "pages/Stylist/scheduler";
// import Pickup from "pages/Stylist/pickup";
// import PickupDetailPage from "pages/Stylist/pickup/DetailPage";
import Pickup from "pages/Stylist/new_pickup";
import PickupDetailPage from "pages/Stylist/new_pickup/DetailPage";
import PickupDetailReqPage from "pages/Stylist/new_pickup/reqDetail";
import PressRelease from "pages/Stylist/press_release";
import PressReleaseDetail from "pages/Stylist/press_release/Detail";
import MyAccount from "pages/Stylist/my_account";
import Question from "pages/Stylist/question";
import Alarm from "pages/Stylist/alarm";
import { NoticeListPage, NoticeDetailPage } from "pages/Stylist/Notice";
import SearchResultPage from "pages/Stylist/search";
import FavoritesPage from "pages/Stylist/Favorites";

export default function Routes() {
  return (
    <RecoilRoot>
      <Switch>
        <Layout>
          <Route path="/" exact>
            <Redirect to="/stylist/home" />
          </Route>
          <Route exact path="/stylist/home" component={Main} />
          <Route
            exact
            path="/stylist/digital_showroom"
            component={DigitalShowroom}
          />
          <Route
            exact
            path="/stylist/digital_showroom/:brand_id"
            component={DigitalShowroom}
          />
          <Route
            exact
            path="/stylist/digital_showroom/detail/:item_no"
            component={DigitalShowroomDetail}
          />
          <Route
            exact
            path="/stylist/sample_requests"
            component={SampleRequest}
          />
          <Route
            exact
            path="/stylist/sample_requests/detail/:request_no"
            component={SampleRequestDetail}
          />
          <Route
            exact
            path="/stylist/sample_requests/edit/:request_no"
            component={SampleRequestEdit}
          />
          <Route
            exact
            path="/stylist/sample_requests/add/:showroom_list"
            component={SampleRequestAdd}
          />
          <Route
            exact
            path="/stylist/sample_requests/temporary/:showroom_list"
            component={SampleRequestTemporary}
          />
          <Route exact path="/stylist/scheduler" component={Scheduler} />
          <Route exact path="/stylist/pickup" component={Pickup} />
         {/*  <Route
            exact
            path="/stylist/pickup/:id"
            component={PickupDetailPage}
          /> */}
          <Route
            exact
            path="/stylist/pickup/:timestamp/:view"
            component={PickupDetailPage}
          />
          <Route
            exact
            path="/stylist/pickup/req/:req_no/:view"
            component={PickupDetailReqPage}
          />
          <Route exact path="/stylist/press_release" component={PressRelease} />
          <Route
            exact
            path="/stylist/press_release/:brand_id"
            component={PressRelease}
          />
          <Route
            exact
            path="/stylist/press_release/detail/:press_no"
            component={PressReleaseDetail}
          />
          <Route exact path="/stylist/question" component={Question} />
          <Route exact path="/stylist/question/:qna_no" component={Question} />
          <Route exact path="/stylist/alarm" component={Alarm} />
          <Route exact path="/stylist/my_account" component={MyAccount} />
          <Route exact path="/stylist/notice" component={NoticeListPage} />
          <Route
            exact
            path="/stylist/notice/:notice_no"
            component={NoticeDetailPage}
          />
          <Route exact path="/stylist/search/" component={SearchResultPage} />
          <Route
            exact
            path="/stylist/search/:keyword"
            component={SearchResultPage}
          />
          <Route exact path="/stylist/favorites" component={FavoritesPage} />
          <Route
            exact
            path="/stylist/favorites/:loc"
            component={FavoritesPage}
          />
          <Route
            exact
            path="/stylist/favorites/:brand_id/:loc"
            component={FavoritesPage}
          />
        </Layout>
      </Switch>
    </RecoilRoot>
  );
}
