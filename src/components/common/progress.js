import React from "react";
import styled from "styled-components";
import { CircularProgress, Backdrop } from "@material-ui/core";

function Progress({ type }) {
  return (
    <>
      {type === "load" && (
        <ProgressWrap>
          <CircularProgress />
        </ProgressWrap>
      )}
      {type === "upload" && (
        <StyleBackdrop open={open}>
          <CircularProgress />
        </StyleBackdrop>
      )}
    </>
  );
}

const StyleBackdrop = styled(Backdrop)`
  z-index: 9999;
  color: #ffffff;
`;

const ProgressWrap = styled.div`
  width: 100%;
  height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default React.memo(Progress);
