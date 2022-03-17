import React from "react";
import {HashRouter,Switch,Route,Redirect,useLocation,} from "react-router-dom";
import { RecoilRoot } from "recoil";
import Layout from "../layout/Brand/Layout";
import Main from "../pages/Brand/Main";
import DigitalShowroom from "../pages/Brand/digital_showroom";
import DigitalShowroomDetail from "../pages/Brand/digital_showroom/Detail";
import DigitalShowroomEdit from "../pages/Brand/digital_showroom/Edit";
import DigitalShowroomAdd from "../pages/Brand/digital_showroom/Add";
import DigitalShowroomSelect from "../pages/Brand/digital_showroom/Select";
import LookBook from "../pages/Brand/lookbook";
import LookBookDetail from "../pages/Brand/lookbook/Detail";
import LookDetail from "../pages/Brand/lookbook/LookDetail";
import LookBookEdit from "../pages/Brand/lookbook/Edit";
import SampleRequests from "../pages/Brand/sample_requests";
 import Scheduler from "../pages/Brand/scheduler";
//import Scheduler from "../pages/Brand/scheduler/New";
// import SendOuts from "../pages/Brand/send_outs";
// import SendOutDetailPage from "pages/Brand/send_outs/DetailPage";
import SendOuts from "../pages/Brand/new_send_outs";
import SendOutDetailPage from "../pages/Brand/new_send_outs/Detail";
import SendOutDetailRequestPage from "../pages/Brand/new_send_outs/reqDetail";
import PressRelease from "../pages/Brand/press_release";
import PressReleaseDetail from "../pages/Brand/press_release/Detail";
import PressReleaseAdd from "../pages/Brand/press_release/Add";
import PressReleaseEdit from "pages/Brand/press_release/Edit";
//import QuestionDetail from "pages/Brand/question/Detail";
import Question from "pages/Brand/question";
import Alarm from "pages/Brand/alarm";
import MyAccount from "pages/Brand/my_account";
import { NoticeListPage, NoticeDetailPage } from "pages/Brand/Notice";
import SearchResultPage from "pages/Brand/search";
import SampleRequestDetail from "pages/Brand/sample_requests/Detail";

export default function Routes() {
  const { pathname } = useLocation();
  return (
    <RecoilRoot>
      <HashRouter>
      <Switch>
        <Layout hasRightMargin={!pathname.includes("scheduler")}>
          <Route path="/" exact>
            <Redirect to="/brand/home" />
          </Route>
          <Route path="/magazine/home" exact>
            <Redirect to="/brand/home" />
          </Route>          
          <Route exact path="/brand/home" component={Main} />
          <Route
            exact
            path="/brand/digital_showroom"
            component={DigitalShowroom}
          />
          <Route
            exact
            path="/brand/digital_showroom/detail/:item_no"
            component={DigitalShowroomDetail}
          />
          <Route
            exact
            path="/brand/digital_showroom/edit/:item_no"
            component={DigitalShowroomEdit}
          />
          <Route
            exact
            path="/brand/digital_showroom/add"
            component={DigitalShowroomAdd}
          />
          <Route
            exact
            path="/brand/lookbook/select"
            component={DigitalShowroomSelect}
          />

          <Route exact path="/brand/lookbook" component={LookBook} />
          <Route
            exact
            path="/brand/lookbook/detail/:lookbook_no"
            component={LookBookDetail}
          />
          <Route
            exact
            path="/brand/lookbook/look_detail/:lookbook_no/:showroom_no"
            component={LookDetail}
          />
          <Route
            exact
            path="/brand/lookbook/edit/:lookbook_no"
            component={LookBookEdit}
          />
          <Route
            exact
            path="/brand/sample_requests"
            component={SampleRequests}
          />
          <Route
            exact
            path="/brand/sample_requests/:type"
            component={SampleRequests}
          />
          <Route exact path="/brand/scheduler" component={Scheduler} />
          <Route exact path="/brand/scheduler/:dt" component={Scheduler} />
          <Route exact path="/brand/send_outs" component={SendOuts} />
          <Route exact path="/brand/send_outs/:dt" component={SendOuts} />
          <Route
            exact
            path="/brand/send_outs/req/:req_no/:view/:showroom_no"
            component={SendOutDetailRequestPage}
          />
          <Route
            exact
            path="/brand/send_outs/:timestamp/:view"
            component={SendOutDetailPage}
          />
          <Route
            exact
            path="/brand/send_outs/req/:req_no/:view"
            component={SendOutDetailRequestPage}
          />
          <Route exact path="/brand/press_release" component={PressRelease} />
          <Route
            exact
            path="/brand/press_release/detail/:press_no"
            component={PressReleaseDetail}
          />
          <Route
            exact
            path="/brand/press_release/add"
            component={PressReleaseAdd}
          />
          <Route
            exact
            path="/brand/press_release/edit/:press_no"
            component={PressReleaseEdit}
          />
          <Route
            exact
            path="/brand/sample_requests/detail/:request_no"
            component={SampleRequestDetail}
          />
          <Route exact path="/brand/question" component={Question} />
          <Route exact path="/brand/question/:qna_no" component={Question} />
          <Route exact path="/brand/alarm" component={Alarm} />
          <Route exact path="/brand/my_account" component={MyAccount} />
          <Route exact path="/brand/notice" component={NoticeListPage} />
          <Route
            exact
            path="/brand/notice/:notice_no"
            component={NoticeDetailPage}
          />
          <Route exact path="/brand/search/" component={SearchResultPage} />
          <Route
            exact
            path="/brand/search/:keyword"
            component={SearchResultPage}
          />
        </Layout>
      </Switch>
      </HashRouter>
    </RecoilRoot>
  );
}
