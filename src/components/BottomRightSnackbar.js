import { Box, Button, makeStyles, Slide, Snackbar } from "@material-ui/core";
import React from "react";
const useStyles = makeStyles(() => ({
  anchorOriginBottomRight: {
    bottom: 0,
    right: 60,
  },
}));
export default function BottomRightSnackbar({
  vertical = "bottom",
  horizontal = "right",
  handleClose = () => {},
  open,
  message = "Total Number of Send Out :",
  onClickButton = () => {},
}) {
  const classes = useStyles();

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        // message="I love snacks"
        key={vertical + horizontal}
        ClickAwayListenerProps={{
          onClickAway: () => {},
        }}
        classes={{ anchorOriginBottomRight: classes.anchorOriginBottomRight }}
        TransitionComponent={Slide}
      >
        <Box
          paddingX={5}
          paddingY={4.5}
          border={"1px solid #ddd"}
          boxShadow="5px 5px 10px 0 rgba(0, 0, 0, 0.16)"
          borderRadius={10}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          display="flex"
          alignItems="center"
          bgcolor="#fff"
        >
          <Box display="flex" alignItems="center" mr={6}>
            {message}
          </Box>
          <Button variant="contained" color="secondary" onClick={onClickButton}>
            Create Document
          </Button>
        </Box>
      </Snackbar>
    </div>
  );
}
