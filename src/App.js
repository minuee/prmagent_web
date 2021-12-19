import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Helmet } from 'react-helmet';
import {BrowserView,MobileView,isBrowser,isMobile} from "react-device-detect";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Auth, UserState } from "@psyrenpark/auth";
import { Api } from "@psyrenpark/api";
import { Storage } from "@psyrenpark/storage";
import awsmobile from "aws-exports";
import { RecoilRoot } from "recoil";
import RouteDivider from "routes/RouteDivider";
import Login from "pages/Login";
import Join from "pages/Join";
import JoinMobile from "pages/JoinMobile";
import FindId from "pages/FindId";
import FindIdMobile from "pages/FindIdMobile";
import FindPw from "pages/FindPw";
import FindPwMobile from "pages/FindPwMobile";
import { theme } from "theme";
import LookbookShare from "pages/Share/LookbookShare";
import LookbookShareDetail from "pages/Share/LookbookShareDetail";
import PressShare from "pages/Share/PressShare";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

const queryClient = new QueryClient();

Auth.setConfigure(awsmobile);
Api.setConfigure(awsmobile);
Storage.setConfigure(awsmobile);

function App() {
  const reducer = useSelector((state) => state.reducer);
  const dispatch = useDispatch();

  console.log('isMobile',isMobile)
  const checkAuth = async () => {
    try {
      var auth = await Auth.currentSession();
      console.log("checkAuth -> auth", auth);

      dispatch({
        type: "SET_USER_STATE",
        payload: UserState.SIGNED,
      });
    } catch (error) {
      console.log("checkToLogin -> error", error);

      dispatch({
        type: "SET_USER_STATE",
        payload: UserState.NOT_SIGN,
      });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Helmet>
          <title>PR Magnet</title>
        </Helmet>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {reducer.userState === UserState.NOT_SIGN ? (
            <RecoilRoot>
              <Router>
                <Switch>
                  <Route exact path="/">
                    <Login />
                  </Route>
                  <Route exact path="/join" component={isMobile ? JoinMobile : Join} />
                  <Route exact path="/find-id" component={isMobile ? FindIdMobile : FindId} />
                  <Route exact path="/find-pw" component={isMobile ? FindPwMobile : FindPw} />
                  <Route exact path="/share-lookbook" component={LookbookShare} />
                  <Route
                    exact
                    path="/share-lookbook/:uuid"
                    component={LookbookShare}
                  />
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
                  {/* <Route path="*">
                    <Redirect to="/" />
                  </Route> */}
                  <Redirect to="/" />
                </Switch>
              </Router>
            </RecoilRoot>
          ) : (
            <>
              <Router>
                <Switch>
                  {/* <Route
                    path="/"
                    component={
                      LOGIN_TYPE === "BRAND" ? BrandRoutes : MagazineRoutes
                    }
                  /> */}
                  <Route path="/" component={RouteDivider} />
                </Switch>
              </Router>
            </>
          )}
        </ThemeProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default App;
