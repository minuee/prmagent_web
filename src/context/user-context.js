import React, { useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "loginUser":
      return {
        ...state,
        isAuthenticated: action.payload.authenticated,
        user: action.payload.user,
      };
    case "logoutUser":
      return {
        ...state,
        isAuthenticated: action.payload.authenticated,
        user: {
          user_no: null,
          user_nm: null,
          user_profile: null,
          user_company: null,
        },
      };
    default:
      return state;
  }
};

export const UserContext = React.createContext();

export const UserContextProvider = ({ children, auth }) => {
  const initialState = {
    user: auth.getProfile(),
    isAuthenticated: auth.isAuthenticated(),
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const history = useHistory();

  Axios.interceptors.request.use(
    function (config) {
      const token = auth.getToken();
      if (token) {
        config.headers["authorization"] = `${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  Axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response) {
        if (
          error.response.status === 401 &&
          (error.response.data.code === "JWT_EXPIRED" ||
            error.response.data.code === "UNAUTHORIZATION")
        ) {
          handleLogOut();
          history.push("/login");
        }
      }
      return Promise.reject(error);
    }
  );

  // Token의 유효기간 만료시 로그아웃 처리
  useEffect(() => {
    if (auth.getToken()) {
      dispatch({
        type: "loginUser",
        payload: {
          authenticated: true,
          user: auth.getProfile(),
        },
      });
    }
    return () => {};
  }, [auth]);

  const handleUpdateContext = () => {
    dispatch({
      type: "loginUser",
      payload: {
        authenticated: true,
        user: auth.getProfile(),
      },
    });
  };

  const handleLogOut = () => {
    auth.signOut();
    dispatch({
      type: "logoutUser",
      payload: {
        authenticated: false,
      },
    });
  };

  return (
    <UserContext.Provider
      value={{
        ...state,
        signIn: auth.signIn,
        updateContext: handleUpdateContext,
        signOut: handleLogOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
