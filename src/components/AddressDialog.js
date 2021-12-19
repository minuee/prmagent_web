import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import styled from "styled-components";
import DaumPostcode from "react-daum-postcode";

const StyleDialog = styled(Dialog)`
  .MuiDialogTitle-root {
    padding: 0;
  }
  .MuiPaper-rounded {
    border-radius: 0;
  }
  .MuiDialogContent-root:first-child {
    padding: 0;
  }
`;

const StyleDialogContent = styled(DialogContent)`
  width: 600px;
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
      dlvy_adres_no : 0,
      address: fullAddress,
      post_no: data.zonecode,
    });
    handleClose();
  };

  return (
    <>
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
    </>
  );
}
