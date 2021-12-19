import React, { useCallback } from "react";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import Gallery from "react-photo-gallery";

import utils from "utils";

const Container = styled.div`
  width: 570px;
  height: auto;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 5px 5px 25px 0 rgba(0, 0, 0, 0.16);
  position: absolute;
  z-index: 10;
  bottom: 0;
  left: 168px;
  bottom: 170px;
  padding: 32px 30px 28px 30px;
`;

const CloseIconBox = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const StyledCloseIcon = styled(CloseIcon)`
  font-size: 24px;
  color: #000000;
`;

const ContentsWrap = styled.div``;

const LogoImg = styled.img`
  max-height: 38px;
  min-height: 38px;
`;

const DetailWrap = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
`;

const ReqUser = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const Company = styled.div`
  font-size: 14px;
  color: #999999;
`;

const Concept = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const AddressWrap = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
`;

const Address = styled.div`
  margin-right: 34px;
  width: 160px;
  display: flex;
  flex-direction: column;
`;

const ImgWrap = styled.div`
  margin-top: 24px;
  max-height: 425px;
  overflow: auto;
`;

function SampleRequestPreviewDialog({ open, setOpen, data }) {
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [open]);

  const imgList = data.showroom_img_array.map((d) => ({
    src: d,
    width: utils.getImageSize("w", d),
    height: utils.getImageSize("h", d),
  }));

  return (
    <>
      {open && (
        <Container>
          <CloseIconBox>
            <StyledCloseIcon onClick={handleClose} />
          </CloseIconBox>
          <ContentsWrap>
            <LogoImg src={data.compy_logo_adres} alt="" />
            <DetailWrap>
              <div>
                <ReqUser>
                  {data.req_user_nm} {data.req_user_posi}
                </ReqUser>
                <Company>{data.compy_nm}</Company>
              </div>
              <div>
                {data.photogrf_concept !== null && (
                  <Concept>{data.photogrf_concept}</Concept>
                )}
                <AddressWrap>
                  <Address>
                    <div>{data.adres_detail}</div>
                    <div>{data.dlvy_adres_nm}</div>
                  </Address>
                  <div>
                    <div>
                      {data.assi_user_nm} {data.assi_user_posi}
                    </div>
                    <div>{utils.phoneFormat(data.assi_phone_no)}</div>
                  </div>
                </AddressWrap>
              </div>
            </DetailWrap>
            <ImgWrap>
              {imgList.length > 1 ? (
                <Gallery photos={imgList} />
              ) : (
                <div>
                  <img
                    src={imgList[0].src}
                    alt=""
                    style={{ maxWidth: "166px" }}
                  />
                </div>
              )}
            </ImgWrap>
          </ContentsWrap>
        </Container>
      )}
    </>
  );
}

export default React.memo(SampleRequestPreviewDialog);
