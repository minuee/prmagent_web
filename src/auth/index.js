import * as moment from "moment";
import { sha256 } from "js-sha256";
import api from "../api/axios.utils";

export default class Auth {
  constructor() {
    this.isAuthenticated = this._isAuthenticated.bind(this);
    this.getProfile = this._getProfile.bind(this);
    this.signIn = this._signIn.bind(this);
    this.signOut = this._clearLocalStorage.bind(this);
    this.getToken = this._getToken.bind(this);
    this.refreshSignIn = this._refreshSignIn.bind(this);
  }

  _getToken() {
    return localStorage.getItem("id_token");
  }

  async _signIn(email, password) {
    // let result = await api.post("/cms/CMS_API_GET_TOKEN", {
    //   admin_email: email,
    //   admin_pass: sha256(password),
    // });

    let result = [
      {
        status: 200,
        data: [
          {
            token: "",
            user_nm: "test",
            user_profile: null,
            user_company: "GUCCI PR",
          },
        ],
      },
    ];

    if (result.status === 200) {
      const {
        token,
        user_no,
        user_nm,
        user_profile,
        user_company,
      } = result.data;
      this._setLocalStorage(token, [30, "m"], {
        user_no,
        user_nm,
        user_profile,
        user_company,
      });
      return result.data;
    } else if (result.status === 403) {

      return { status: result.status, ...result.data };
    } else {

      return { status: result.status, ...result.data };
    }
  }

  async _refreshSignIn() {
    let result = await api.post("/cms/CMS_API_REFRESH_TOKEN");
    if (result.status === 200) {
      const {
        token,
        user_no,
        user_nm,
        user_profile,
        user_company,
      } = result.data;
      this._setLocalStorage(token, [30, "m"], {
        user_no,
        user_nm,
        user_profile,
        user_company,
      });
    }
  }

  _setLocalStorage(token, expiresIn, userObj) {
    const expiresAt = moment().add(...expiresIn);
    localStorage.setItem("id_token", token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem("user_obj", JSON.stringify(userObj));
  }

  async _clearLocalStorage() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("user_obj");
  }

  _getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  _getProfile() {
    return this.isAuthenticated()
      ? JSON.parse(localStorage.getItem("user_obj"))
      : {
          user_no: null,
          user_nm: null,
          user_profile: null,
          user_company: null,
        };
  }
  _isAuthenticated() {
    return moment().isBefore(this._getExpiration());
  }
}
