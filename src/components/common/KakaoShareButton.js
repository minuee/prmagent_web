import React, { useEffect } from 'react'
//import KakaoIcon from "assets/kakao_icon.png";
const KakaoIcon = "//developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" 
import Constants from 'utils/constants';
const KakaoShareButton = (props) => {
	const shareUrl = props.shareUrl || window.location.href;
	const desc = props.title || Constants.appName;
	const thumbImg = props.imgUrl || 'http://fpr-prod-web.s3-website.ap-northeast-2.amazonaws.com/logo_meta2.png';
	useEffect(() => {
		createKakaoButton()
	}, [])

  const createKakaoButton = () => {
    // kakao sdk script이 정상적으로 불러와졌으면 window.Kakao로 접근이 가능합니다
    if (window.Kakao) {
      const kakao = window.Kakao

      // 중복 initialization 방지
      if (!kakao.isInitialized()) {
        // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
        kakao.init(process.env.REACT_APP_KAKAO_KEY)
      }

      kakao.Link.createDefaultButton({
        // Render 부분 id=kakao-link-btn 을 찾아 그부분에 렌더링을 합니다
        container: '#kakao-link-btn',
        objectType: 'feed',
        content: {
          title: Constants.appName,
          description: desc,
          imageUrl: thumbImg,
          link: {
            mobileWebUrl: shareUrl,//window.location.href,
            webUrl: shareUrl//window.location.href,
          },
        },
        social: {
          /* likeCount: 77,
          commentCount: 55,
          sharedCount: 333, */
        },
        buttons: [
          {
            title: '웹으로 보기',
            link: {
              mobileWebUrl:shareUrl,
              webUrl: shareUrl
            },
          },
        ],
      })
    }
  }

  return (
    <div className="kakao-share-button">
      {/* Kakao share button */}
      <div id="kakao-link-btn">
        <img src={KakaoIcon} alt="kakao-share-icon" style={{height: '50px'}} />
      </div>
    </div>
  )
}

export default KakaoShareButton