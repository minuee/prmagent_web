import { Api } from "@psyrenpark/api";
import { Storage } from "@psyrenpark/storage";
import { v4 as uuidv4 } from "uuid";

var projectName = "fpr"; // 각 프로젝트 단축명
var projectEnv = "prod"; // 각 프로젝트 환경 // dev, test, prod

var v1Noneauth = `${projectName}-${projectEnv}-noneauth-v1`;
var v1Api = `${projectName}-${projectEnv}-api-v1`;
var v1Cdn = `${projectName}-${projectEnv}-cdn-v1`;

export const apiObject = {
  //------------------------------------------
  // 인증 없는 api
  /**
   * [] cdn 테스트
   * @param {string} langCode               - 예시 언어코드
   * @param {Function} LoadingCallback      - 로딩 콜백
   */
  getTestNoneauth: (
    {
      langCode, //
      // 필요에 맞게 파라미터를 넣는다.
      // ...
    },
    loadingFunction
  ) => {
    var apiName = v1Noneauth; // 인증 유, 인증 무 api 구분은 이부분이 다르다.
    var path = "/test_test_test"; // test_test_test는 무조건 테스트 api로써 반드시 작동한다.
    var myInit = {
      headers: {}, // OPTIONAL
      // body: {  // post나 put일경우 사용한다.
      //
      // },
      queryStringParameters: {
        langCode: langCode,
      },
      // response: true,  // axios 원형 response 필요할 경우 ture로 설정한다.
    };
    // get, post, put, del 상황에 맞게 사용한다
    return Api.get(apiName, path, myInit, loadingFunction);
  },

  // homehttps://mrrwobfo8j.execute-api.ap-northeast-2.amazonaws.com/prod/cdn/v1/imgdownload?img_url=https%3A%2F%2Ffpr-prod-file.s3-ap-northeast-2.amazonaws.com%2Fpublic%2FshowroomImage%2F3f324426-1fc0-4dea-a54b-82a352cf8d45.png
  fileDownload: (filename,directory) => {
    var apiName = v1Api;
    var path = "/api/imgdownload";
    var init = {
      headers: {}, // OPTIONAL
      queryStringParameters: {
        filename : filename,
        directory : directory
      },
    };
    return Api.get(apiName, path, init);
  },

  //------------------------------------------https://mrrwobfo8j.execute-api.ap-northeast-2.amazonaws.com/prod/v1/cdn/imgdownload?img_url=https%3A%2F%2Ffpr-prod-file.s3-ap-northeast-2.amazonaws.com%2Fpublic%2FshowroomImage%2F3f324426-1fc0-4dea-a54b-82a352cf8d45.png
  // 인증 있는 api
  getTestApi: (
    {
      langCode,
      // ...
      // 필요에 맞게 파라미터를 넣는다.
    },
    loadingFunction
  ) => {
    var apiName = v1Api; // 인증 유, 인증 무 api 구분은 이부분이 다르다.
    var path = "/test_test_test";
    var myInit = {
      headers: {}, // OPTIONAL
      // body: {  // post나 put일경우 사용한다.
      //
      // },
      queryStringParameters: {
        langCode: langCode,
      },
      // response: true,  // axios 원형 response 필요할 경우 ture로 설정한다.
    };
    // get, post, put, del 상황에 맞게 사용한다
    return Api.get(apiName, path, myInit, loadingFunction);
  },

  //------------------------------------------
  // 개발계에 테스트시 (디폴트 계정으로만 테스트 가능)
  getTestCdn: (
    {
      langCode,
      // ...
      // 필요에 맞게 파라미터를 넣는다.
    },
    loadingFunction
  ) => {
    var apiName = v1Cdn; // 인증 유, 인증 무 api 구분은 이부분이 다르다.
    var path = "/test_test_test";
    var myInit = {
      headers: {}, // OPTIONAL
      // body: {  // post나 put일경우 사용한다.
      //
      // },
      queryStringParameters: {
        langCode: langCode,
      },
      // response: true,  // axios 원형 response 필요할 경우 ture로 설정한다.
    };

    // 테스트 필요시
    // 테스트가 필요할경우 로딩콜백 뒤에 {url, port}를 추가한다. // 백엔드 개발자에게 테스트 요청
    // get, post, put, del 상황에 맞게 사용한다
    return Api.get(apiName, path, myInit, loadingFunction, {
      url: "http://18.177.73.12",
      port: 3006,
    });

    // return Api.get(apiName, path, myInit, loadingFunction);
  },
  getBrandPosition: () => {
    var apiName = v1Cdn;
    var path = "/cdn/brand/position";
    var init = {};

    return Api.get(apiName, path, init);
  },
  getBrandSearchCompany: ({ search_text }) => {
    var apiName = v1Cdn;
    var path = "/cdn/brand/search-company";
    var init = {
      queryStringParameters: {
        search_text,
      },
    };

    return Api.get(apiName, path, init);
  },
  uplaodBrandLogo: async ({ file }, loadingFunction = () => {}) => {
    const file_name = uuidv4();
    const file_extension = file.name
      .substring(file.name.lastIndexOf("."), file.name.length)
      .toLowerCase();
    const key = `brand_logo/${file_name}${file_extension}`;
    try {
      var data = await Storage.put(
        {
          key,
          object: file,
          config: {
            contentType: "image/png",
            // level: "public",
          },
        },
        loadingFunction
      );
      return { url: "public/" + data.key };
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  getSearchTeamMember: ({ search_type, brand_id = null, mgzn_id = null, compy_nm = null }) => {
    var apiName = v1Cdn;
    var path = "/cdn/search-team-member";
    var init = {
      queryStringParameters: {
        search_type,
        brand_id,
        mgzn_id,
        compy_nm,
      },
    };
    console.log('sssinit ',init)
    return Api.get(apiName, path, init);
  },
  getPrivacyPolicy: () => {
    var apiName = v1Cdn;
    var path = "/cdn/privacy-policy";
    var init = {};

    return Api.get(apiName, path, init);
  },
  getTos: () => {
    var apiName = v1Cdn;
    var path = "/cdn/tos";
    var init = {};

    return Api.get(apiName, path, init);
  },
  getMobileAuthSend: ({ mobile_no }) => {
    var apiName = v1Cdn;
    var path = "/cdn/mobile-auth-send";
    var init = {
      body: {
        mobile_no,
      },
    };
    return Api.post(apiName, path, init);
  },
  getMoblieAuthCheck: ({ mobile_no, auth_no }) => {
    console.log("mobile_no : ", mobile_no);
    console.log("auth_no : ", auth_no);
    var apiName = v1Cdn;
    var path = "/cdn/mobile-auth-check";
    var init = {
      queryStringParameters: {
        mobile_no,
        auth_no,
      },
    };
    return Api.get(apiName, path, init);
  },
  getMagazineSearchCompany: ({ search_text }) => {
    var apiName = v1Cdn;
    var path = "/cdn/magazine/search-company";
    var init = {
      queryStringParameters: {
        search_text,
      },
    };

    return Api.get(apiName, path, init);
  },
  getMagazinePosition: () => {
    var apiName = v1Cdn;
    var path = "/cdn/magazine/position";
    var init = {};

    return Api.get(apiName, path, init);
  },
  getStylistPosition: () => {
    var apiName = v1Cdn;
    var path = "/cdn/stylist/position";
    var init = {};

    return Api.get(apiName, path, init);
  },
  getUserType: () => {
    var apiName = v1Api;
    var path = "/api/user-type";
    var init = {};

    return Api.get(apiName, path, init);
  },

  getLoginImg: () => {
    var apiName = v1Cdn;
    var path = "/cdn/login-image";
    var init = {};

    return Api.get(apiName, path, init);
  },

  getLookbookShare: ({ share_uuid }) => {
    var apiName = v1Cdn;
    var path = `/cdn/lookbook-showroom-list/${share_uuid}`;
    var init = {};

    return Api.get(apiName, path, init);
  },

  getLookbookShareDetail: ({ share_uuid, showroom_no }) => {
    var apiName = v1Cdn;
    var path = `/cdn/lookbook-showroom/${share_uuid}/${showroom_no}`;
    var init = {};

    return Api.get(apiName, path, init);
  },

  getPressShare: ({ share_uuid }) => {
    var apiName = v1Cdn;
    var path = `/cdn/press/${share_uuid}`;
    var init = {};

    return Api.get(apiName, path, init);
  },

  findEmail: ({ name, mobile_no, auth_no }) => {
    var apiName = v1Cdn;
    var path = "/cdn/find-email";
    var init = {
      queryStringParameters: {
        name,
        mobile_no,
        auth_no,
      },
    };

    return Api.get(apiName, path, init);
  },
};
