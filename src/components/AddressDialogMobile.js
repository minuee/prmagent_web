import React from "react";
import { Box,Dialog, DialogContent } from "@material-ui/core";
import styled from "styled-components";
import DaumPostcode from "react-daum-postcode";
const { innerWidth: width, innerHeight: height } = window;
const StyleDialog = styled(Dialog)`  
  max-width: 100%;
  .MuiDialogTitle-root {
    padding: 0;
  }
  .MuiPaper-rounded {
    border-radius: 10;
  }
  .MuiDialogContent-root:first-child {
    padding: 0;
  }
`;

const StyleDialogContent = styled(DialogContent)`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function AddressDialog({ open, setOpen, inputs, setInputs }) {
  const handleClose = () => {
    setOpen(false);
  };

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setInputs({
      ...inputs,
      address: fullAddress,
      post_no: data.zonecode,
    });
    handleClose();
  };

  return (
    <Box display="flex">
      <StyleDialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
        maxWidth={"md"}
      >
        <StyleDialogContent>
          <DaumPostcode animation={true} onComplete={handleComplete} />
        </StyleDialogContent>
      </StyleDialog>
    </Box>
  );
}
