import React from "react";
import { Dialog, DialogContent, Divider } from "@material-ui/core";
import styled from "styled-components";
import { darken } from "polished";
import CloseIcon from "@material-ui/icons/Close";
import { CopyToClipboard } from "react-copy-to-clipboard";
/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";
import utils from "utils";

function ShareDialog({ open, setOpen, shareUrl }) {
  const handleClose = () => {
    setOpen(false);
  };
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);
  return (
    <>
      <StyleDialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        maxWidth={"md"}
      >
        <StyleDialogContent active={isdrawer}>
          <CloseIconBox>
            <CloseIcon onClick={handleClose} />
          </CloseIconBox>
          <Title>
            Share
            <StyleDivider />
          </Title>
          <LinkWrap >
            <LinkTxtBox active={isdrawer}>
              <LinkTxt>{shareUrl}</LinkTxt>
            </LinkTxtBox>
            <CopyToClipboard
              text={shareUrl}
              onCopy={() => utils.customAlert("클립보드에 복사되었습니다.")}
            >
              <LinkBtn>링크복사</LinkBtn>
            </CopyToClipboard>
          </LinkWrap>
        </StyleDialogContent>
      </StyleDialog>
    </>
  );
}

const StyleDialog = styled(Dialog)`
  .MuiDialogTitle-root {
    padding: 0;
  }
  .MuiPaper-rounded {
    border-radius: 20px;
  }
  .MuiDialogContent-root:first-child {
    padding: 25px 32px 25px 30px;
  }
`;

const StyleDialogContent = styled(DialogContent)`
  
  @media (min-width: 1920px) {
    width: 960px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 960px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "900px" : "700px")};
  } 
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseIconBox = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  width: 100%;
`;

const StyleDivider = styled(Divider)`
  margin: 15px 0 40px 0;
  height: 2px;
  background-color: #dddddd;
`;

const LinkWrap = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 25px;
`;

const LinkTxtBox = styled.div`
  
  @media (min-width: 1920px) {
    width: 688px;
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 688px;
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: ${(props) => (props.active ? "688px" : "600px")};    
  } 
  height: 48px;
  border-radius: 5px;
  background-color: #f6f6f6;
  margin-right: 12px;
  display: flex;
  align-items: center;
  padding: 15px 17px 14px 17px;
`;

const LinkTxt = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const LinkBtn = styled.div`
  width: 100px;
  height: 48px;
  border-radius: 5px;
  background-color: #7ea1b2;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${darken(0.1, "#7ea1b2")};
  }

  &:active {
    background-color: ${darken(0.2, "#7ea1b2")};
  }
`;

export default React.memo(ShareDialog);
