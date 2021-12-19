import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { darken } from "polished";
import { CircularProgress } from "@material-ui/core";
import { useMutation, useInfiniteQuery } from "react-query";
import KakaoShareButton from 'components/common/KakaoShareButton';

import useIntersectionObserver from "components/useIntersectionObserver";
import LookbookItems from "components/LookbookItemList";
import ShareDialog from "components/ShareDialog";
import { apiObject } from "api/api_brand";
import { useReactToPrint,PrintContextConsumer } from "react-to-print";
import Progress from "components/common/progress";
import Constants from 'utils/constants';
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";
const TitleTxt = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-right: 40px;
  margin-bottom: 30px;
`;

const HeadWrap = styled.div`
  display: flex;
  height: 50px;
  justify-content: space-between;
  margin-bottom: 32px;
  width:96%;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1070px" : "1070px")};
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    min-width: ${(props) => (props.active ? "1070px" : "970px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {   
    min-width: ${(props) => (props.active ? "974px" : "600px")};
  } 

`;

const LeftWrap = styled.div`
  display: flex;
  align-items: flex-end;
`;

const RightWrap = styled.div`
  display: ${(props) => (props.isShow ? "flex" : "none")};
  
`;

const Text = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const Btn = styled.div`
  width: 92px;
  height: 50px;
  border-radius: 5px;
  border: solid 1px #dddddd;
  background-color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background-color: ${darken(0.1, "#ffffff")};
  }
  &:active {
    background-color: ${darken(0.2, "#ffffff")};
  }

  & + & {
    margin-left: 12px;
  }
`;

const Btn2 = styled.div`
  width: 60px;
  height: 50px;
  margin-left:20px;
  margin-right:20px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;

`;

const ItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin-left: -20px;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  font-size: 20px;
  cursor: pointer;
`;

export default function LookbookDetail({ match }) {
  const history = useHistory();
  // const [data, setData] = useState();
  const [isShow, setIsShow] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const domain = window.location.href.split("brand/lookbook/")[0];
  const printContentsRef = useRef();
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  const handleClick = (idx) => {
    history.push(
      "/brand/lookbook/look_detail/" + match.params.lookbook_no + "/" + idx
    );
  };

  const handleEdit = () => {
    history.push("/brand/lookbook/edit/" + match.params.lookbook_no);
  };

  const handleLinkShare = () => {
    getShareUrl.mutate();
  };

  const handlePrint = useReactToPrint({    
    content: () => printContentsRef.current,
    onBeforeGetContent: (d) => {
      return d;
    },
  });

  const handlePrintPre = async() => {
    await setIsShow(false);
    handlePrint();
    setTimeout(() => {setIsShow(true);}, 2000);
  };


  // lookbook-detail call
  const getLookbookDetail = ({ pageParam = 1 }) =>
    apiObject.getLookbookDetail({
      lookbook_no: match.params.lookbook_no,
      page: pageParam,
      limit: 10,
    });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery(
      ["lookbook-detail", match.params.lookbook_no],
      getLookbookDetail,
      {
        getNextPageParam: (lastPage) => lastPage.next_page ?? false,
      }
    );

  const loadMoreButtonRef = useRef();

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });


  const getShareUrl = useMutation(
    ["lookbook-share-url", match.params.lookbook_no],
    () =>
      apiObject.getShareLookbook({
        lookbook_no: match.params.lookbook_no,
      }),
    {
      onSuccess: (d) => {
        setShareUrl(domain + "share-lookbook/" + d.share_uuid);
        setShareDialogOpen(true);
      },
      onError: () => {
        utils.customAlert("Share Url Error");
      },
    }
  );

  if (status === "loading") {
    return <Progress type="load" />;
  }

  return (
    <div ref={printContentsRef}>
      <TitleTxt>LookBook</TitleTxt>
      {data.pages === undefined ? (
        <Progress type="load" />
      ) : (
        <>
          <HeadWrap active={isdrawer}>
            <LeftWrap active={isdrawer}>
              <Text>{data.pages[0].lookbook_nm}</Text>
            </LeftWrap>
            <RightWrap active={isdrawer} isShow={isShow}>
              <Btn onClick={handleEdit}>Edit</Btn>
              <Btn onClick={handlePrintPre}>Print</Btn>
              <Btn onClick={handleLinkShare}>Share</Btn>
              { !utils.isEmpty(data.pages[0].share_uuid) &&
              <Btn2>
                <KakaoShareButton 
                  shareUrl={domain + "share-lookbook/" + data.pages[0].share_uuid}
                  title={data.pages[0].lookbook_nm} 
                  imgUrl={null}
                />
              </Btn2>
              }
            </RightWrap>
          </HeadWrap>
          <ItemContainer active={isdrawer}>
            {data.pages.map((group, idx) => (
              <React.Fragment key={idx}>
                {group.list.map((d) => (
                  <LookbookItems
                    key={d.showroom_no}
                    data={d}
                    handleClick={handleClick}
                  />
                ))}
              </React.Fragment>
            ))}
          </ItemContainer>
          <ButtonDiv>
            <div ref={loadMoreButtonRef} onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? (
                <CircularProgress />
              ) : hasNextPage ? (
                "더보기"
              ) : (
                ""
              )}
            </div>
          </ButtonDiv>
        </>
      )}

      <ShareDialog
        open={shareDialogOpen}
        setOpen={setShareDialogOpen}
        shareUrl={shareUrl}
      />
    </div>
  );
}
