import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  IconButton,
  makeStyles,
  Paper,
} from "@material-ui/core";
import React, { useState } from "react";

import { ReactComponent as ConfirmedIcon } from "assets/scheduler/confirmedIcon.svg";
import { ReactComponent as CloseBtnIcon } from "assets/scheduler/closeBtnIcon-black.svg";
import { useMutation, useQueryClient } from "react-query";
import { apiObject } from "api/api_brand";
import utils from "utils";


const useStyles = makeStyles((theme) => ({
  confirmDialogRoot: {
    minWidth: 420,
  },
  confirmDialogTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    padding: 0,
    paddingTop: (props) =>
      props.confirmSuccess ? theme.spacing(2.5) : theme.spacing(5),
  },

  confirmDialogContentContainer: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(4),
  },
  confirmDialogContent: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    margin: 0,
  },
  confirmDialogActionRoot: {
    justifyContent: "center",
    padding: 0,
    paddingBottom: (props) => (props.confirmSuccess ? theme.spacing(5) : 0),
  },
  confirmDialogActionBtnRoot: {
    borderRadius: (props) => (props.confirmSuccess ? "5px" : 0),
    fontWeight: "medium",
    textTransform: "initial",
    minHeight: (props) => (props.confirmSuccess ? 42 : 60),
  },
  confirmDialogSubmitBtn: {
    color: "#7ea1b2",
    borderLeft: 0,
    "&:hover": {
      borderLeft: 0,
    },
  },
}));

export default function ConfirmDialog({
  selectedOption,
  open,
  setOpen,
  onConfirm,
}) {
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const classes = useStyles({ confirmSuccess });

  const handleClose = () => {
    setOpen(false);
  };

  const queryClient = useQueryClient();

  const acceptRequestQuery = useMutation(
    ["accept", "schedule", "request", selectedOption.req_no],
    (req_no) => apiObject.acceptRequest({ req_no }),
    {
      onSuccess: () => {
        setConfirmSuccess(true);
      },
      onError: () => {
        utils.customAlert("error");
      },
      onSettled: () => {
        queryClient.invalidateQueries(["brand", "scheduler"]);
      },
    }
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onExit={() => {
        setConfirmSuccess(false);
      }}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth="xs"
      keepMounted={false}
      classes={{ paper: classes.confirmDialogRoot }}
      transitionDuration={{ exit: 0 }}
    >
      {!confirmSuccess && (
        <Paper elevation={4} className={classes.paper}>
          <DialogTitle
            id="confirm-dialog-title"
            className={classes.confirmDialogTitle}
          >
            당일 연결
          </DialogTitle>
          <DialogContent className={classes.confirmDialogContentContainer}>
            <DialogContentText
              id="confirm-dialog-description"
              className={classes.confirmDialogContent}
            >
              '{selectedOption.company_name} {selectedOption.req_user_nm}'을
              당일연결 하시겠습니까?
            </DialogContentText>
          </DialogContent>
          <DialogActions
            classes={{ root: classes.confirmDialogActionRoot }}
            disableSpacing
          >
            <Button
              onClick={handleClose}
              color="primary"
              fullWidth
              classes={{ root: classes.confirmDialogActionBtnRoot }}
              variant="outlined"
              size="large"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                acceptRequestQuery.mutate(selectedOption.req_no);
              }}
              color="primary"
              autoFocus
              fullWidth
              classes={{ root: classes.confirmDialogActionBtnRoot }}
              className={classes.confirmDialogSubmitBtn}
              variant="outlined"
              size="large"
            >
              Confirm
            </Button>
          </DialogActions>
        </Paper>
      )}
      <Fade in={confirmSuccess} unmountOnExit timeout={{ enter: 500, exit: 0 }}>
        <Paper elevation={4} className={classes.paper}>
          <Box position="absolute" top={0} right={0}>
            <IconButton aria-label="close-confirm-dialog" onClick={onConfirm}>
              <CloseBtnIcon />
            </IconButton>
          </Box>
          <Box display="flex" justifyContent="center" mt={7}>
            <ConfirmedIcon width={72} height={72} />
          </Box>
          <DialogTitle
            id="confirm-dialog-title"
            className={classes.confirmDialogTitle}
          >
            당일 연결 완료
          </DialogTitle>
          <DialogContent className={classes.confirmDialogContentContainer}>
            <DialogContentText
              id="confirm-dialog-description"
              className={classes.confirmDialogContent}
            >
              '{selectedOption.company_name} {selectedOption.req_user_nm}'을
              당일연결을 완료 했습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            classes={{ root: classes.confirmDialogActionRoot }}
            disableSpacing
          >
            <Button
              onClick={onConfirm}
              color="secondary"
              autoFocus
              classes={{ root: classes.confirmDialogActionBtnRoot }}
              variant="contained"
              size="large"
            >
              Confirm
            </Button>
          </DialogActions>
        </Paper>
      </Fade>
    </Dialog>
  );
}
