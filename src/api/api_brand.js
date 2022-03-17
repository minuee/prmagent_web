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
  getMyInfo: () => {
    var apiName = v1Api;
    var path = "/brand/my-info";
    var init = {};

    return Api.get(apiName, path, init);
  },
  getBrandHome: ({ date }) => {
    var apiName = v1Api;
    var path = "/brand/home";
    var init = {
      queryStringParameters: {
        date,
      },
    };

    return Api.get(apiName, path, init);
  },

  // question
  getQnaList: ({ page, limit, search_text }) => {
    var apiName = v1Api;
    var path = "/brand/qna-list";
    var init = {
      queryStringParameters: {
        page,
        limit,
        search_text,
      },
    };

    return Api.get(apiName, path, init);
  },

  getQnaDetail: ({ sys_inqry_no }) => {
    var apiName = v1Api;
    var path = `/brand/qna/${sys_inqry_no}`;
    var init = {};

    return Api.get(apiName, path, init);
  },

  setQna: ({ subject, content }) => {
    var apiName = v1Api;
    var path = "/brand/qna";
    var init = {
      body: {
        subject,
        content,
      },
    };

    return Api.post(apiName, path, init);
  },

  delQna: ({ del_list }) => {
    var apiName = v1Api;
    var path = "/brand/qna-delete";
    var init = {
      body: {
        del_list,
      },
    };

    return Api.put(apiName, path, init);
  },

  getBrandSearch: ({ search_text, showroom_no }) => {
    var apiName = v1Api;
    var path = "/brand/search-brand-showroom";
    var init = {
      queryStringParameters: {
        search_text,
        showroom_no
      },
    };
    return Api.get(apiName, path, init);
  },

  // alarm
  getAlarm: ({ page }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = "/brand/alarm";
    var init = {
      queryStringParameters: {
        page,
        limit: 10,
      },
    };

    return Api.get(apiName, path, init, loadingFunction);
  },
  delAlarm: ({ notice_id }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = "/brand/alarm-delete";
    var init = {
      queryStringParameters: {
        notice_id,
      },
    };

    return Api.del(apiName, path, init, loadingFunction);
  },

  // digital showroom
  getShowroomList: ({
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
  }) => {
    var apiName = v1Api;
    var path = "/brand/showroom-list";
    var init = {
      body: {
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

  getShowroomDetail: ({ showroom_no }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = `/brand/showroom/${showroom_no}`;
    var init = {
      queryStringParameters: {
        showroom_no,
      },
    };

    return Api.get(apiName, path, init, loadingFunction);
  },

  uploadShowroomImg: async ({ file, type }, loadingFunction = () => {}) => {
    const file_name = uuidv4();
    const file_extension = file.name
      .substring(file.name.lastIndexOf("."), file.name.length)
      .toLowerCase();
    const key = `showroomImage/${file_name}${file_extension}`;
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
      );
      return { url: "public/" + data.key, type: type };
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  createShowroom: (
    {
      showroom_nm,
      season_year,
      season_cd_id,
      season_direct_input,
      mfrc_sample_yn,
      show_yn,
      sample_list,
    },
    loadingFunction = () => {}
  ) => {
    var apiName = v1Api;
    var path = "/brand/showroom";
    var init = {
      body: {
        showroom_nm,
        season_year,
        season_cd_id,
        season_direct_input,
        mfrc_sample_yn,
        show_yn,
        sample_list,
      },
    };
    return Api.post(apiName, path, init, loadingFunction);
  },

  editShowroom: ({ showroom_no }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = `/brand/showroom/${showroom_no}`;
    var init = {
      queryStringParameters: {
        showroom_no,
      },
    };

    return Api.get(apiName, path, init, loadingFunction);
  },

  setShowroomAllUpdate: ({ gubun, season_year ,season_cd_id }, loadingFunction = () => {}) => {
    var apiName = v1Api;
    var path = `/brand/showroom-allupdate/${gubun}`;
    var init = {     
      body: {
        gubun,
        season_year,
        season_cd_id
      },
    };

    return Api.put(apiName, path, init, loadingFunction);
  },

  updateShowroom: (
    {
      showroom_no,
      showroom_nm,
      season_year,
      season_cd_id,
      mfrc_sample_yn,
      show_yn,
      replacement_showroom,
      sample_list,
      delete_sample_no_list,
    },
    loadingFunction = () => {}
  ) => {
    var apiName = v1Api;
    var path = `/brand/showroom/${showroom_no}`;
    var init = {
      body: {
        showroom_no,
        showroom_nm,
        season_year,
        season_cd_id,
        mfrc_sample_yn,
        show_yn,
        replacement_showroom,
        sample_list,
        delete_sample_no_list,
      },
    };
    return Api.put(apiName, path, init, loadingFunction);
  },

  deleteShowroom: ({ showroom_no }) => {
    var apiName = v1Api;
    var path = `/brand/showroom/${showroom_no}`;
    var init = {};

    return Api.del(apiName, path, init);
  },

  sendPushShowroom: ({ showroom_no }) => {
    var apiName = v1Api;
    var path = `/brand/sendpush/showroom/${showroom_no}`;
    var init = {};

    return Api.get(apiName, path, init);
  },

  getSampleInfo: () => {
    var apiName = v1Api;
    var path = "/brand/sample/info";
    var init = {};

    return Api.get(apiName, path, init);
  },

  getShowroomNotice: () => {
    var apiName = v1Api;
    var path = "/brand/notice";
    var init = {};

    return Api.get(apiName, path, init);
  },

  setShowroomNotice: ({ notice_contents }) => {
    var apiName = v1Api;
    var path = "/brand/notice";
    var init = {
      body: {
        notice_contents,
      },
    };

    return Api.post(apiName, path, init);
  },

  setShowroomNoticeSendPush: ({ notice_contents }) => {
    var apiName = v1Api;
    var path = "/brand/notice/sendpush";
    var init = {
      body: {
        notice_contents,
      },
    };

    return Api.post(apiName, path, init);
  },

  getInquiryNumber: () => {
    var apiName = v1Api;
    var path = "/brand/inquiry-number";
    var init = {};

    return Api.get(apiName, path, init);
  },

  setInquiryNumber: ({ inquiry_number }) => {
    var apiName = v1Api;
    var path = "/brand/inquiry-number";
    var init = {
      body: {
        inquiry_number,
      },
    };

    return Api.post(apiName, path, init);
  },

  setlimitNumber: ({ limit_days }) => {
    var apiName = v1Api;
    var path = "/brand/limit-days";
    var init = {
      body: {
        limit_days,
      },
    };

    return Api.post(apiName, path, init);
  },

  getShowroomInquiry: () => {
    var apiName = v1Api;
    var path = "/brand/showroom-inquiry";
    var init = {};

    return Api.get(apiName, path, init);
  },

  setShowroomInquiry: ({
    showroom_inquiry_contact,
    showroom_inquiry_contact2,
    showroom_inquiry_contact3,
    inquiry_charge,
    inquiry_charge2,
    inquiry_charge3,
    showroom_inquiry_email,
    showroom_inquiry_email2,
    showroom_inquiry_email3
  }) => {
    var apiName = v1Api;
    var path = "/brand/showroom-inquiry";
    var init = {
      body: {
        showroom_inquiry_contact,
        showroom_inquiry_contact2,
        showroom_inquiry_contact3,
        showroom_inquiry_email,
        showroom_inquiry_email2,
        showroom_inquiry_email3,
        inquiry_charge,
        inquiry_charge2,
        inquiry_charge3
      },
    };
    console.log('dddd',init)
    return Api.post(apiName, path, init);
  },

  getHoliday: ({ year }) => {
    var apiName = v1Api;
    var path = "/brand/brand-holiday";
    var init = {
      queryStringParameters: {
        year,
      },
    };

    return Api.get(apiName, path, init);
  },

  setHoliday: ({ holiday_list }) => {
    var apiName = v1Api;
    var path = "/brand/brand-holiday";
    var init = {
      body: {
        holiday_list,
      },
    };

    return Api.post(apiName, path, init);
  },

  delHoliday: ({ holiday_list }) => {
    var apiName = v1Api;
    var path = "/brand/brand-holiday-delete";
    var init = {
      body: {
        holiday_list,
      },
    };

    return Api.put(apiName, path, init);
  },

  // lookbook
  setLookbook: ({
    lookbook_nm,
    showroom_list,
    season_cd_id,
    gender_cd_id,
    made_for,
  }) => {
    var apiName = v1Api;
    var path = "/brand/lookbook";
    var init = {
      body: {
        lookbook_nm,
        showroom_list,
        season_cd_id,
        gender_cd_id,
        made_for,
      },
    };

    return Api.post(apiName, path, init);
  },

  getLookbook: ({ page, limit, search_text }) => {
    var apiName = v1Api;
    var path = "/brand/lookbook-list";
    var init = {
      queryStringParameters: {
        page,
        limit,
        search_text,
      },
    };

    return Api.get(apiName, path, init);
  },

  getLookbookDetail: ({ lookbook_no, page, limit }) => {
    var apiName = v1Api;
    var path = `/brand/lookbook-showroom-list/${lookbook_no}`;
    var init = {
      queryStringParameters: {
        lookbook_no,
        page,
        limit,
      },
    };

    return Api.get(apiName, path, init);
  },

  editLookbook: ({
    lookbook_no,
    lookbook_nm,
    remove_showroom_list,
    season_cd_id,
    gender_cd_id,
    made_for,
  }) => {
    var apiName = v1Api;
    var path = `/brand/lookbook/${lookbook_no}`;
    var init = {
      body: {
        lookbook_no,
        lookbook_nm,
        remove_showroom_list,
        season_cd_id,
        gender_cd_id,
        made_for,
      },
    };

    return Api.put(apiName, path, init);
  },

  getLookbookShowroom: ({ lookbook_no, showroom_no }) => {
    var apiName = v1Api;
    var path = `/brand/lookbook-showroom/${lookbook_no}/${showroom_no}`;
    var init = {};
    return Api.get(apiName, path, init);
  },

  delLookbook: ({ lookbook_no_list }) => {
    var apiName = v1Api;
    var path = "/brand/lookbook-delete";
    var init = {
      body: {
        lookbook_no_list,
      },
    };

    return Api.put(apiName, path, init);
  },

  getShareShowroom: ({ showroom_no }) => {
    var apiName = v1Api;
    var path = `/brand/showroom/${showroom_no}/share-uuid`;
    var init = {};

    return Api.get(apiName, path, init);
  },

  getShareLookbook: ({ lookbook_no }) => {
    var apiName = v1Api;
    var path = `/brand/lookbook/${lookbook_no}/share-uuid`;
    var init = {};

    return Api.get(apiName, path, init);
  },

  // sample request
  getUrgency: ({ page, limit, date, model_type }) => {
    var apiName = v1Api;
    var path = `/brand/showroom-request-urgency/${date}`;
    var init = {
      queryStringParameters: {
        page,
        limit,
        model_type,
      },
    };
    return Api.get(apiName, path, init);
  },

  getRequests: ({ model_type,isConfirm, page, limit }) => {
    var apiName = v1Api;
    var path = "/brand/showroom-request-requests/";
    var init = {
      queryStringParameters: {
        model_type,
        isConfirm,
        page,
        limit,
      },
    };

    return Api.get(apiName, path, init);
  },

  getRequestsDetail: ({ req_no }) => {
    var apiName = v1Api;
    var path = `/brand/showroom-request-popup/${req_no}`;
    var init = {};

    return Api.get(apiName, path, init);
  },

  setRequestConfirm: ({ req_no, showroom_list, msg,isDuplicate }) => {
    var apiName = v1Api;
    var path = `/brand/request-accept/${req_no}`;
    var init = {
      body: {
        showroom_list,
        msg,
        isDuplicateInfo : isDuplicate
      },
    };
    console.log("setRequestConfirm",init)
    return Api.post(apiName, path, init);
  },

  detailSampleRequest: ({ req_no }) => {
    var apiName = v1Api;
    var path = `/brand/showroom-request/${req_no}`;
    var init = {};
    return Api.get(apiName, path, init);
  },


  setRequestRefuse: ({ req_no, showroom_list, msg }) => {
    var apiName = v1Api;
    var path = `/brand/request-refuse/${req_no}`;
    var init = {
      body: {
        showroom_list: showroom_list,
        msg,
      },
    };

    return Api.post(apiName, path, init);
  },


  getRequestsReservation: ({ req_no}) => {
    var apiName = v1Api;
    var path = `/brand/showroom-request-reservation/${req_no}`;
    var init = {
      queryStringParameters: {},
    };

    return Api.get(apiName, path, init);
  },

  // scheduler

  // send outs

  // press release
  getPressList: ({ page, limit, year, month }) => {
    var apiName = v1Api;
    var path = "/brand/press-list";
    var init = {
      queryStringParameters: {
        page,
        limit,
        year,
        month,
      },
    };
    return Api.get(apiName, path, init);
  },

  getPressDetail: ({ brand_press_no }) => {
    var apiName = v1Api;
    var path = `/brand/press/${brand_press_no}`;
    var init = {};

    return Api.get(apiName, path, init);
  },

  setPress: async ({
    title,
    contents,
    monthly_year,
    monthly_month,
    link,
    inquiry_charge,
    inquiry_email,
    inquiry_tel,
    show_yn,
    main_img_file,
    add_img_file,
    add_img_list,
    word_file,
  }) => {
    var apiName = v1Api;
    var path = "/brand/press";
    var init = {
      body: {
        title,
        contents,
        monthly_year,
        monthly_month,
        link,
        inquiry_charge,
        inquiry_email,
        inquiry_tel,
        show_yn,
        add_img_list
      },
    };

    if (main_img_file) {
      const file_name = uuidv4();
      const file_extension = main_img_file.name
        .substring(
          main_img_file.name.lastIndexOf("."),
          main_img_file.name.length
        )
        .toLowerCase();
      const key = `press/images/${file_name}${file_extension}`;
      try {
        var data = await Storage.put({
          key,
          object: main_img_file,
          config: {            
            contentType: ( file_extension == '.jpg' || file_extension == '.jpeg' ) ? "image/jpg" : "image/png",
            level: "public",
          },
        });
        init.body.main_img_adres = `public/${data.key}`;
      } catch (error) {
        console.error(error);
        return error;
      }
    }
    
    /* if (add_img_file.length > 0 ) {
      let newArr = [];
      await add_img_file.forEach(async(d) => {    
        if ( d.file) {
          let file_name = uuidv4();
          let file_extension = d.file.name.substring(d.file.name.lastIndexOf("."), d.file.name.length).toLowerCase();
          let key = `press/images/${file_name}${file_extension}`;
          try {
            let data = await Storage.put({
              key,
              object: d.file,
              config: {
                contentType: "image/png",
                level: "public",
              },
            });
            
            newArr.push(`public/${data.key}`);
            
          } catch (error) {
            console.error(error);
            return error;
          }
        }
      })
      init.body.add_img_list = newArr;
    } else {
      init.body.add_img_list = [];
    }
    */
    if (word_file) {
      const file_name = uuidv4();
      const file_extension = word_file.name
        .substring(word_file.name.lastIndexOf("."), word_file.name.length)
        .toLowerCase();
      const key = `press/doc/${file_name}${file_extension}`;
      try {
        const data = await Storage.put({
          key,
          object: word_file,
          config: {
            contentType: "application/pdf, application/msword",
            level: "public",
          },
        });
        init.body.word_file_adres = `public/${data.key}`;
      } catch (error) {
        console.error(error);
        return error;
      }
    }

    return Api.post(apiName, path, init);
  },

  editPress: async ({
    brand_press_no,
    title,
    contents,
    monthly_year,
    monthly_month,
    link,
    inquiry_charge,
    inquiry_email,
    inquiry_tel,
    show_yn,
    main_img_file,
    add_img_file,
    add_img_list,
    word_file,
    main_img_adres,
    add_img_adres,
    word_file_adres,
  }) => {
    var apiName = v1Api;
    var path = `/brand/press/${brand_press_no}`;
    var init = {
      body: {
        title,
        contents,
        monthly_year,
        monthly_month,
        link,
        inquiry_charge,
        inquiry_email,
        inquiry_tel,
        show_yn,
        add_img_list
      },
    };

    if (main_img_file) {
      const file_name = uuidv4();
      const file_extension = main_img_file.name
        .substring(
          main_img_file.name.lastIndexOf("."),
          main_img_file.name.length
        )
        .toLowerCase();
      const key = `press/images/${file_name}${file_extension}`;
      try {
        var data = await Storage.put({
          key,
          object: main_img_file,
          config: {
            contentType: ( file_extension == '.jpg' || file_extension == '.jpeg' ) ? "image/jpg" : "image/png",
            level: "public",
          },
        });
        init.body.main_img_adres = `public/${data.key}`;
      } catch (error) {
        console.error(error);
        return error;
      }
    } else {
      init.body.main_img_adres = main_img_adres;
    }
   /* let newArr = [];
    if (add_img_file.img_adres.length > 0 ) {      
      await add_img_file.img_adres.forEach(async(d) => {
        if (typeof d == 'object') {
          let file_name = uuidv4();
          let file_extension = d.name.substring(d.name.lastIndexOf("."), d.name.length).toLowerCase();
          let key = `press/images/${file_name}${file_extension}`;
          try {
            let data = await Storage.put({
              key,
              object: d,
              config: {
                contentType: "image/png",
                level: "public",
              },
            });
            newArr.push(`public/${data.key}`);
          } catch (error) {
            console.error(error);
            return error;
          }
        }else{
          newArr.push(d);      
        }
      });      
    }          
    init.body.add_img_list = newArr; */
    /* if (add_img_file) {
      const file_name = uuidv4();
      const file_extension = add_img_file.name
        .substring(add_img_file.name.lastIndexOf("."), add_img_file.name.length)
        .toLowerCase();
      const key = `press/images/${file_name}${file_extension}`;
      try {
        const data = await Storage.put({
          key,
          object: add_img_file,
          config: {
            contentType: "image/png",
            level: "public",
          },
        });
        let newArr = [];
        newArr.push(`public/${data.key}`);
        init.body.add_img_list = newArr;
      } catch (error) {
        console.error(error);
        return error;
      }
    } else {
      let newArr = [];
      add_img_adres !== "" && newArr.push(add_img_adres);
      init.body.add_img_list = newArr;
    } */

    if (word_file) {
      const file_name = uuidv4();
      const file_extension = word_file.name
        .substring(word_file.name.lastIndexOf("."), word_file.name.length)
        .toLowerCase();
      const key = `press/doc/${file_name}${file_extension}`;
      try {
        const data = await Storage.put({
          key,
          object: word_file,
          config: {
            contentType: "application/pdf, application/msword",
            level: "public",
          },
        });
        init.body.word_file_adres = `public/${data.key}`;
      } catch (error) {
        console.error(error);
        return error;
      }
    } else {
      init.body.word_file_adres = word_file_adres;
    }
    return Api.put(apiName, path, init);
  },

  delPress: ({ brand_press_no }) => {
    var apiName = v1Api;
    var path = `/brand/press/${brand_press_no}`;
    var init = {};

    return Api.del(apiName, path, init);
  },

  getPressShareUrl: ({ brand_press_no }) => {
    var apiName = v1Api;
    var path = `/brand/press/${brand_press_no}/share-uuid`;
    var init = {};

    return Api.get(apiName, path, init);
  },

  setEachSendOut: ({ req_no, showroom_len, sample_no }) => {
    var apiName = v1Api;
    var path = `/brand/sendout-push-individual`;
    const init = {
      body: {req_no, len: showroom_len, sample_no},
    }
 
    return Api.post(apiName, path, init);
  },
  setEachReturnCheck: ({ req_no, sample_no }) => {
    var apiName = v1Api;
    var path = `/brand/return-success-individual`;
    const init = {
      body: {req_no, sample_no},
    }
    return Api.post(apiName, path, init);
  },
  // notice list
  getNoticeList: ({ page, limit = 10 }) => {
    var apiName = v1Api;
    var path = "/brand/notice-list";
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
    var path = `/brand/notice/${notice_no}`;
    var init = {
      queryStringParameters: {
        notice_no,
      },
    };

    return await Api.get(apiName, path, init);
  },

  getNoticeReadCheck: async (notice_no) => {
    var apiName = v1Api;
    var path = `/brand/notice_read/${notice_no}`;
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
    post_no,
    adres,
    adres_detail,
    brand_pos_cd,
    phone_no,
    team_user_id,
    file = null,
    img_url,
  }) => {
    var apiName = v1Api;
    var path = "/brand/my-profile";
    var init = {
      body: {
        user_nm,
        post_no,
        adres,
        adres_detail,
        brand_pos_cd,
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
  // search
  getShowroomSearch: async ({ page, search_text }) => {
    var apiName = v1Api;
    var path = `/brand/search/showroom`;
    var init = {
      queryStringParameters: {
        page,
        search_text,
        limit: 10,
      },
    };
    return await Api.get(apiName, path, init);
  },
  getLookbookSearch: async ({ page, search_text }) => {
    var apiName = v1Api;
    var path = `/brand/search/lookbook`;
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
    var path = `/brand/search/req`;
    var init = {
      queryStringParameters: {
        page,
        search_text,
        limit: 10,
      },
    };
    console.log('getReqSearch',init)
    return await Api.get(apiName, path, init);
  },
  getScheduleSearch: async ({ page, search_text }) => {
    var apiName = v1Api;
    var path = `/brand/search/schedule`;
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
    var path = `/brand/search/sendout`;
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
    var path = `/brand/search/press`;
    var init = {
      queryStringParameters: {
        page,
        search_text,
        limit: 10,
      },
    };
    return await Api.get(apiName, path, init);
  },
  getShowroomMemo: ({showroom_no,date}) => {
    console.log('getShowroomMemo', showroom_no)
    var apiName = v1Api;
    var path = `/brand/showroom-memo`;
    var init = {
      queryStringParameters: {
        showroom_no: showroom_no,
        date
      },
    }
    return Api.get(apiName, path, init)
  },
  // scheduler
  getScheduler: ({ startDate, endDate, season_year, season_cd_id, gender }) => {
    var apiName = v1Api;
    var path = `/brand/my-schedule`;
    var init = {
      queryStringParameters: {
        min_date: startDate,
        max_date: endDate,
        season_year,
        season_cd_id,
        gender,
      },
    };

    return Api.get(apiName, path, init);
  },

  createMemo: async ({ showroom_no, date, color, content }) => {
    var apiName = v1Api;
    var path = `/brand/memo`;
    var init = {
      body: {
        showroom_no,
        date,
        color,
        content,
      },
    };

    return await Api.post(apiName, path, init);
  },

  deleteMemo: async ({ memo_no }) => {
    var apiName = v1Api;
    var path = `/brand/memo/${memo_no}`;
    var init = {
      body: {
        memo_no,
      },
    };

    return await Api.del(apiName, path, init);
  },
  updateMemo: async ({ memo_no, showroom_no, color, content }) => {
    var apiName = v1Api;
    var path = `/brand/memo/${memo_no}`;
    var init = {
      body: {
        memo_no,
        showroom_no,
        color,
        content,
      },
    };

    return await Api.put(apiName, path, init);
  },

  searchMemo: async ({ showroom_no, date }) => {
    var apiName = v1Api;
    var path = `/brand/memo`;
    var init = {
      queryStringParameters: {
        showroom_no,
        date,
      },
    };

    return await Api.get(apiName, path, init);
  },

  acceptRequest: async ({ req_no }) => {
    var apiName = v1Api;
    var path = `/brand/request-accept/${req_no}`;
    var init = {
      body: {
        req_no,
      },
    };

    return await Api.post(apiName, path, init);
  },

  // SENDOUTS
  getSendouts: async ({ start_date, fin_date, is_not_finished,pageState = "sendout" }) => {
    var apiName = v1Api;
    var path = pageState === "sendout" ? `/brand/sendout-schedule` : `/brand/return-schedule`;
    var init = {
      queryStringParameters: {
        start_date,
        fin_date,
        not_finished : is_not_finished
      },
    };
   
    return await Api.get(apiName, path, init);
  },
  getSendoutDetail: async ({ date,showroom_no,showroomList=[],reqnoList=[],is_list = 'null' }) => {
    var apiName = v1Api;
    var path = `/brand/sendout-detailed/${date}`;
    var init = {
      queryStringParameters: {
        date,
        showroom_no,
        is_list,
        showroomList : JSON.stringify(showroomList),
        reqnoList : JSON.stringify(reqnoList)
      },
    };

    return await Api.get(apiName, path, init);
  },
  getReturnDetail: async ({ date,showroom_no,showroomList=[],reqnoList=[],is_list = 'null' }) => {
    var apiName = v1Api;
    var path = `/brand/return-detailed/${date}`;
    var init = {
      queryStringParameters: {
        date,
        showroom_no,
        is_list,
        showroomList : JSON.stringify(showroomList),
        reqnoList : JSON.stringify(reqnoList)
      },
    };
    
    return await Api.get(apiName, path, init);
  },
  getSendoutDetailReq: async ({ req_no,showroom_no}) => {
    var apiName = v1Api;
    var path = `/brand/sendout-detailed/req/${req_no}`;
    var init = {
      queryStringParameters: {
        req_no,
        showroom_no
      },
    };

    return await Api.get(apiName, path, init);
  },
  getReturnDetailReq: async ({ req_no,showroom_no }) => {
    var apiName = v1Api;
    var path = `/brand/return-detailed/req/${req_no}`;
    var init = {
      queryStringParameters: {
        req_no,
        showroom_no
      },
    };

    return await Api.get(apiName, path, init);
  },

  /// SENDOUT NOTICE
  getSendoutNotice: async () => {
    var apiName = v1Api;
    var path = `/brand/send-out/notice`;
    var init = {
      queryStringParameters: {},
    };

    return await Api.get(apiName, path, init);
  },
  setSendoutNotice: async ({ content }) => {
    var apiName = v1Api;
    var path = `/brand/send-out/notice`;

    var init = {
      body: {
        content,
      },
    };
    if (!content) {
      init.body.content = " ";
    }

    return await Api.post(apiName, path, JSON.parse(JSON.stringify(init)));
  },

  postBillingsBefore: async ({ subscript_type = "MONTH" }) => {
    var apiName = v1Api;
    var path = `/brand/billings/before`;

    var init = {
      body: {
        subscript_type,
      },
    };

    return await Api.post(apiName, path, init);
  },
  postBillings: async ({ customer_uid = "" }) => {
    var apiName = v1Api;
    var path = `/brand/billings`;

    var init = {
      body: {
        customer_uid,
      },
    };

    return await Api.post(apiName, path, init);
  },
  postBillingsChange: async ({ subscript_type = "MONTH" }) => {
    var apiName = v1Api;
    var path = `/brand/billings/change`;

    var init = {
      body: {
        subscript_type,
      },
    };

    return await Api.post(apiName, path, init);
  },
  postBillingsCancel: async (subscr_no) => {
    var apiName = v1Api;
    var path = `/brand/billings/cancel`;

    var init = {
      body: {
        subscr_no
      },
    };
    console.log('init',init)
    return await Api.post(apiName, path, init);
  },
};
