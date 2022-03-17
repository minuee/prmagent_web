import { Box, Button, makeStyles } from "@material-ui/core";
import React, { useRef } from "react";
import CommonLayout from "./CommonLayout";
import { ReactComponent as PrintIcon } from "assets/sheet/printIcon.svg";
import { ReactComponent as ShareIcon } from "assets/sheet/shareIcon-white.svg";
import { useReactToPrint } from "react-to-print";

const useStyles = makeStyles((theme) => ({
  printBtn: {
    fontSize: 16,
    fontWeight: "bold",
    minHeight: 60,
    minWidth: 200,
  },
}));

class ComponentToPrint extends React.Component {
  render() {
    return (
      <Box position="absolute" top={0} left={0} bottom={0} right={0}>
        Content Goes HERE! wowowowowowowowowo
      </Box>
    );
  }
}

export default function PickupDetailPage() {
  const classes = useStyles();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <CommonLayout>
      <Box bgcolor="#f6f6f6" paddingX={"calc(100vw * 390 / 1920)"} paddingY={8}>
        <Box position="relative" pt="141.4%" bgcolor="#fff">
          <ComponentToPrint ref={componentRef} />
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            classes={{ root: classes.printBtn }}
            startIcon={<ShareIcon color="#fff" />}
          >
            Share
          </Button>
          <Box ml={1.5}></Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            classes={{ root: classes.printBtn }}
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print
          </Button>
        </Box>
      </Box>
    </CommonLayout>
  );
}
