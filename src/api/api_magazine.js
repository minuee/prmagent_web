import { Api } from "@psyrenpark/api";
import { Storage } from "@psyrenpark/storage";
import { v4 as uuidv4 } from "uuid";

var projectName = "fpr"; // 각 프로젝트 단축명
var projectEnv = "prod"; // 각 프로젝트 환경 // dev, test, prod

// var v1Noneauth = `${projectName}-${projectEnv}-noneauth-v1`;
var v1Api = `${projectName}-${projectEnv}-api-v1`;
var v1Cdn = `${projectName}-${projectEnv}-cdn-v1`;

export const apiObject = {
  // home
  getMagazineHome: ({ date }) => {
    var apiName = v1Api;
    var path = "/magazine/home";
    var init = {
      queryStringParameters: {
        date,
      },
    };
    return Api.get(apiName, path, init);
  },
  getMyInfo: () => {
    var apiName = v1Api;
    var path = "/magazine/my-info";
    var init = {};

    return Api.get(apiName, path, init);
  },

  // question
  getQnaList: ({ page, limit, search_text }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = "/magazine/qna-list";
    var init = {
      queryStringParameters: {
        page,
        limit,
        search_text,
      },
    };

    return Api.get(apiName, path, init, loadingFunction);
  },

  getQnaDetail: ({ sys_inqry_no }) => {
    var apiName = v1Api;
    var path = `/magazine/qna/${sys_inqry_no}`;
    var init = {};

    return Api.get(apiName, path, init);
  },

  setQna: ({ subject, content }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = "/magazine/qna";
    var init = {
      body: {
        subject,
        content,
      },
    };

    return Api.post(apiName, path, init, loadingFunction);
  },
  delQna: ({ del_list }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = "/magazine/qna-delete";
    var init = {
      body: {
        del_list,
      },
    };

    return Api.put(apiName, path, init, loadingFunction);
  },

  // alarm
  getAlarm: ({ page }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = "/magazine/alarm";
    var init = {
      queryStringParameters: {
        page,
        limit: 10,
      },
    };

    return Api.get(apiName, path, init, loadingFunction);
  },
  delAlarm: ({ alarm_id, notice_type }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = "/magazine/alarm-delete";
    var init = {
      queryStringParameters: {
        notice_id : alarm_id,
        notifi_type : notice_type,
      },
    };

    return Api.del(apiName, path, init, loadingFunction);
  },

  // digital showroom
  getShowroomList: ({
    page,
    limit,
    brand_id,
    season_year,
    season_cd_id,
    gender_list,
    category_list,
    color_list,
    size_list,
    material_list,
    wrhousng_yn,
    still_life_img_yn,
  }) => {
    var apiName = v1Api;
    var path = "/magazine/showroom-list";
    var init = {
      body: {
        brand_id,
        page,
        limit,
        season_year,
        season_cd_id,
        gender_list,
        category_list,
        color_list,
        size_list,
        material_list,
        wrhousng_yn,
        still_life_img_yn,
      },
    };

    return Api.post(apiName, path, init);
  },

  getShowroomDetail: ({ showroom_no }) => {
    var apiName = v1Api;
    var path = `/magazine/showroom/${showroom_no}`;
    var init = {};

    return Api.get(apiName, path, init);
  },

  getFavBrand: () => {
    var apiName = v1Api;
    var path = "/magazine/fav-brand";
    var init = {};

    return Api.get(apiName, path, init);
  },

  setFavBrand: ({ brand_id, dibs_yn }) => {
    var apiName = v1Api;
    var path = "/magazine/fav-brand";
    var init = {
      body: {
        brand_id,
        dibs_yn,
      },
    };

    return Api.put(apiName, path, init);
  },

  setFavShowroom: ({ showroom_no }) => {
    var apiName = v1Api;
    var path = `/magazine/fav-show/${showroom_no}`;
    var init = {};

    return Api.post(apiName, path, init);
  },

  delFavShowroom: ({ showroom_no }) => {
    var apiName = v1Api;
    var path = `/magazine/fav-show/${showroom_no}`;
    var init = {};

    return Api.put(apiName, path, init);
  },

  getSampleInfo: () => {
    var apiName = v1Cdn;
    var path = "/cdn/sample/info";
    var init = {};

    return Api.get(apiName, path, init);
  },

  // sample request
  addSampleRequest: ({ showroom_list, brand_id }) => {
    var apiName = v1Api;
    var path = "/magazine/showroom-request";
    var init = {
      body: {
        showroom_list,
        brand_id,
      },
    };

    return Api.post(apiName, path, init);
  },

  setSampleRequest: ({
    brand_id,
    duty_recpt_dt,
    photogrf_dt,
    photogrf_end_dt,
    begin_dt,
    end_dt,
    return_prearnge_dt,
    photogrf_concept,
    model_list,
    celeb_list,
    own_paid_pictorial_content,
    other_paid_pictorial_content,
    page_cnt,
    etc_brand,
    today_connect,
    add_req_cntent,
    dlvy_adres_no,
    dlvy_adres_nm,
    adres_detail,
    dlvy_atent_matter,
    showroom_list,
    contact_user_id,
    req_user_id,
    loc_yn,
    loc_value,
  }) => {
    var apiName = v1Api;
    var path = "/magazine/showroom-request-send";
    var init = {
      body: {
        brand_id,
        duty_recpt_dt,
        photogrf_dt,
        photogrf_end_dt,
        begin_dt,
        end_dt,
        return_prearnge_dt,
        photogrf_concept,
        model_list,
        celeb_list,
        own_paid_pictorial_content,
        other_paid_pictorial_content,
        page_cnt,
        etc_brand,
        today_connect,
        add_req_cntent,
        dlvy_adres_nm,
        dlvy_adres_no,
        adres_detail,
        dlvy_atent_matter,
        showroom_list,
        contact_user_id,
        req_user_id,
        loc_yn,
        loc_value,
      },
    };
  
    return Api.post(apiName, path, init);
  },

  getSampleRequest: ({
    page,
    limit,
    brand_id,
    order_photogrf_dt,
    order_req_dt,
    desc,
    request_status,
  }) => {
    var apiName = v1Api;
    var path = "/magazine/showroom-request-list";
    var init = {
      queryStringParameters: {
        page,
        limit,
        brand_id,
        request_status,
      },
      body: {
        order_photogrf_dt,
        order_req_dt,
        desc,
      },
    };

    return Api.post(apiName, path, init);
  },

  delSampleRequest: ({ req_list,del_list }) => {
    var apiName = v1Api;
    var path = "/magazine/showroom-request-delete/";
    var init = {
      body: {
        req_list,
        del_list
      },
    }; 
    return Api.del(apiName, path, init);
  },

  cancelSampleRequest: ({ req_list ,cancel_list}) => {
    var apiName = v1Api;
    var path = "/magazine/showroom-request-cancel/";
    var init = {
      body: {
        req_list,
        cancel_list
      },
    };
    console.log('cancelSampleRequest',req_list,cancel_list)
    return Api.put(apiName, path, init);
  },

  detailSampleRequest: ({ req_no }) => {
    var apiName = v1Api;
    var path = `/magazine/showroom-request/${req_no}`;
    var init = {};

    return Api.get(apiName, path, init);
  },

  editSampleRequest: ({
    req_no,
    duty_recpt_dt,
    photogrf_dt,
    photogrf_end_dt,
    begin_dt,
    end_dt,
    return_prearnge_dt,
    photogrf_concept,
    showroom_list,
    model_list,
    celeb_list,
    own_paid_pictorial_content,
    other_paid_pictorial_content,
    page_cnt,
    etc_brand,
    today_connect,
    add_req_cntent,
    dlvy_adres_no,
    dlvy_adres_nm,
    adres_detail,
    dlvy_atent_matter,
    contact_user_id,
    req_user_id,
    loc_value,
  }) => {
    var apiName = v1Api;
    var path = "/magazine/showroom-request-update";
    var init = {
      body: {
        req_no,
        duty_recpt_dt,
        photogrf_dt,
        photogrf_end_dt,
        begin_dt,
        end_dt,
        return_prearnge_dt,
        photogrf_concept,
        showroom_list,
        model_list,
        celeb_list,
        own_paid_pictorial_content,
        other_paid_pictorial_content,
        page_cnt,
        etc_brand,
        today_connect,
        add_req_cntent,
        dlvy_adres_no,
        dlvy_adres_nm,
        adres_detail,
        dlvy_atent_matter,
        contact_user_id,
        req_user_id,
        loc_value,
      },
    };
 
    return Api.post(apiName, path, init);
  },

  getBrandHoliday: ({ year, brand_id }) => {
    var apiName = v1Api;
    var path = "/magazine/brand-holiday";
    var init = {
      queryStringParameters: {
        year,
        brand_id,
      },
    };

    return Api.get(apiName, path, init);
  },
  setEachPickup: ({ req_no, sample_no }) => {
    var apiName = v1Api;
    var path = `/magazine/pickup-success-individual`;
    const init = {
      body: {req_no, sample_no},
    }
    return Api.post(apiName, path, init);
  },
  setEachReturn: ({ req_no, sample_no }) => {
    var apiName = v1Api;
    var path = `/magazine/sendout-push-individual`;
    const init = {
      body: {req_no, sample_no},
    }
    return Api.post(apiName, path, init);
  },
  // scheduler
  getScheduleByTime: ({ min_date, max_date }) => {
    var apiName = v1Api;
    var path = "/magazine/my-schedule-date";
    var init = {
      queryStringParameters: {
        min_date,
        max_date,
      },
    };

    return Api.get(apiName, path, init);
  },
  getScheduleByBrand: ({ min_date, max_date }) => {
    var apiName = v1Api;
    var path = "/magazine/my-schedule-brand";
    var init = {
      queryStringParameters: {
        min_date,
        max_date,
      },
    };
    return Api.get(apiName, path, init);
  },

  // pickup
  getPickupSchedule: ({ start_date, fin_date, brand_id,is_not_finished }) => {
    var apiName = v1Api;
    var path = "/magazine/pickup-schedule";
    var init = {
      queryStringParameters: {
        start_date,
        fin_date,
        brand_id,
        not_finished : is_not_finished
      },
    };

    return Api.get(apiName, path, init);
  },

  getSendoutSchedule: ({ start_date, fin_date, brand_id,is_not_finished }) => {
    var apiName = v1Api;
    var path = "/magazine/sendout-schedule";
    var init = {
      queryStringParameters: {
        start_date,
        fin_date,
        brand_id,
        not_finished : is_not_finished
      },
    };
    return Api.get(apiName, path, init);
  },

  getPickupDetailReq: ({ req_no ,showroom_no}) => {
    var apiName = v1Api;
    var path = `/magazine/pickup-detailed/req/${req_no}`;
    var init = {
      queryStringParameters: {
        req_no,
        showroom_no
      },
    };

    return Api.get(apiName, path, init);
  },
  getPickupDetail: ({ date , showroomList = [],reqnoList = [],is_list = 'null' }) => {
    var apiName = v1Api;
    var path = `/magazine/pickup-detailed/${date}`;
    var init = {
      queryStringParameters: {
        date,
        showroomList : JSON.stringify(showroomList),
        reqnoList : JSON.stringify(reqnoList),
        is_list
      },
    };

    return Api.get(apiName, path, init);
  },
  getSendoutDetailReq: ({ req_no,showroom_no }) => {
    var apiName = v1Api;
    var path = `/magazine/sendout-detailed/req/${req_no}`;
    var init = {
      queryStringParameters: {
        req_no,
        showroom_no
      },
    };
    return Api.get(apiName, path, init);
  },
  getSendoutDetail: ({ date,showroomList = [],reqnoList = [] ,is_list = 'null'}) => {
    var apiName = v1Api;
    var path = `/magazine/sendout-detailed/${date}`;
    var init = {
      queryStringParameters: {
        date,
        showroomList : JSON.stringify(showroomList),
        reqnoList : JSON.stringify(reqnoList),
        is_list
      },
    };
    console.log('getSendoutDetail',init);
    return Api.get(apiName, path, init);
  },

  // press release
  getPressList: ({ page, limit, brand_id, req_month, req_year }) => {
    var apiName = v1Api;
    var path = "/magazine/press";
    var init = {
      queryStringParameters: {
        page,
        limit,
        brand_id,
        req_month,
        req_year,
      },
    };

    return Api.get(apiName, path, init);
  },

  getPressDetail: ({ id }) => {
    var apiName = v1Api;
    var path = `/magazine/article/${id}`;
    var init = {};

    return Api.get(apiName, path, init);
  },

  onFavPress: ({ brand_press_no }) => {
    var apiName = v1Api;
    var path = `/magazine/fav-press/${brand_press_no}`;
    var init = {};

    return Api.post(apiName, path, init);
  },

  offFavPress: ({ brand_press_no }) => {
    var apiName = v1Api;
    var path = `/magazine/fav-press/${brand_press_no}`;
    var init = {};

    return Api.put(apiName, path, init);
  },

  // notice list
  getNoticeList: ({ page, limit = 10 }) => {
    var apiName = v1Api;
    var path = "/magazine/notice-list";
    var init = {
      queryStringParameters: {
        page,
        limit,
      },
    };

    return Api.get(apiName, path, init);
  },

  getNoticeDetail: async ({ notice_no }) => {
    var apiName = v1Api;
    var path = `/magazine/notice/${notice_no}`;
    var init = {
      queryStringParameters: {
        notice_no,
      },
    };

    return await Api.get(apiName, path, init);
  },

  // my profile
  setMyProfile: async ({
    user_nm,
    mgzn_pos_cd,
    phone_no,
    team_user_id,
    file = null,
    img_url,
  }) => {
    var apiName = v1Api;
    var path = "/magazine/my-profile";
    var init = {
      body: {
        user_nm,
        mgzn_pos_cd,
        phone_no,
        team_user_id,
      },
    };
    if (file) {
      const file_name = uuidv4();
      const file_extension = file.name
        .substring(file.name.lastIndexOf("."), file.name.length)
        .toLowerCase();
      const key = `my_account/${file_name}${file_extension}`;
      try {
        var data = await Storage.put({
          key,
          object: file,
          config: {
            contentType: "image/png",
            level: "public",
          },
        });
        init.body.img_url_adres = `public/${data.key}`;
      } catch (error) {
        console.error(error);
        return error;
      }
    } else {
      init.body.img_url_adres = img_url;
    }

    return Api.put(apiName, path, init);
  },
  // user search
  getShowroomSearch: async ({ page, search_text }) => {
    var apiName = v1Api;
    var path = `/magazine/search/showroom`;
    var init = {
      queryStringParameters: {
        page,
        search_text,
        limit: 10,
      },
    };
    return await Api.get(apiName, path, init);
  },
  getReqSearch: async ({ page, search_text }) => {
    var apiName = v1Api;
    var path = `/magazine/search/req`;
    var init = {
      queryStringParameters: {
        page,
        search_text,
        limit: 10,
      },
    };
    return await Api.get(apiName, path, init);
  },
  getScheduleSearch: async ({ page, search_text }) => {
    var apiName = v1Api;
    var path = `/magazine/search/schedule`;
    var init = {
      queryStringParameters: {
        page,
        search_text,
        limit: 10,
      },
    };
    return await Api.get(apiName, path, init);
  },
  getPickupSearch: async ({ page, search_text }) => {
    var apiName = v1Api;
    var path = `/magazine/search/pickup`;
    var init = {
      queryStringParameters: {
        page,
        search_text,
        limit: 10,
      },
    };
    return await Api.get(apiName, path, init);
  },
  getSendoutSearch: async ({ page, search_text }) => {
    var apiName = v1Api;
    var path = `/magazine/search/returns`;
    var init = {
      queryStringParameters: {
        page,
        search_text,
        limit: 10,
      },
    };
    return await Api.get(apiName, path, init);
  },
  getPressSearch: async ({ page, search_text }) => {
    var apiName = v1Api;
    var path = `/magazine/search/press`;
    var init = {
      queryStringParameters: {
        page,
        search_text,
        limit: 10,
      },
    };
    return await Api.get(apiName, path, init);
  },
  // favorites
  getFavorites: async ({
    page,
    limit,
    brand_id,
    gender_list,
    category_list,
    color_list,
    size_list,
    wrhousng_yn,
    still_life_img_yn,
    material_list,
  }) => {
    var apiName = v1Api;
    var path = "/magazine/fav-show";
    var init = {
      body: {
        page,
        limit,
        brand_id,
        gender_list,
        category_list,
        color_list,
        size_list,
        wrhousng_yn,
        still_life_img_yn,
        material_list,
      },
    };

    return await Api.post(apiName, path, init);
  },

  getPressFavorites: async ({ page, limit, brand_id }) => {
    var apiName = v1Api;
    var path = "/magazine/fav-press";
    var init = {
      queryStringParameters: {
        page,
        limit,
        brand_id,
      },
    };

    return await Api.get(apiName, path, init);
  },

  removeFavorites: async ({ category, id }) => {
    var apiName = v1Api;
    var path =
      category === "showroom"
        ? `/magazine/fav-show/${id}`
        : `/magazine/fav-press/${id}`;
    var init = {
      queryStringParameters: {},
    };

    return await Api.put(apiName, path, init);
  },

  addFavorites: async ({ category, id }) => {

    var apiName = v1Api;
    var path =
      category === "showroom"
        ? `/magazine/fav-show/${id}`
        : `/magazine/fav-press/${id}`;
    var init = {
      queryStringParameters: {},
    };

    return await Api.post(apiName, path, init);
  },
};
