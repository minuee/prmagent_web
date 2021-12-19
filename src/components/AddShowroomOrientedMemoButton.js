import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  OutlinedInput,
  Popper,
} from "@material-ui/core";
import React, { useRef, useState } from "react";
import { ReactComponent as MemoIcon } from "assets/scheduler/memoIcon.svg";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { ReactComponent as CheckIcon } from "assets/scheduler/CheckIcon.svg";
import { ReactComponent as MoreIcon } from "assets/scheduler/moreBtnIcon.svg";
import { ReactComponent as CloseIcon } from "assets/scheduler/closeBtnIcon-black.svg";
import { apiObject } from "api/api_brand";
import { useMutation, useQueryClient } from "react-query";

const colorOptions = [
  "#c18c8c",
  "#c1a68c",
  "#b8c18c",
  "#8cc1a7",
  "#8cc1c1",
  "#8cafc1",
  "#908cc1",
  "#af8cc1",
  "#e1c668",
  "#c1c3c3",
  "#b0a581",
  "#e1af7b",
  "#d78979",
  "#e6e667",
];

const useStyles = makeStyles((theme) => ({
  popperRoot: {
    zIndex: 11,
  },
  paper: {
    border: "1px solid #bebebe",
    backgroundColor: theme.palette.common.white,
    minWidth: 420,
    maxWidth: 422,
  },
  colorToggleGroup: {
    display: "flex",
    flexWrap: "wrap",
  },
  colorBtn: {
    flex: 1,
    flexBasis: "calc(100% / 7)",
    height: 60,
    borderRadius: 0,
    border: 0,
    margin: "0 !important",
  },
  inputBaseRoot: {
    padding: theme.spacing(1.5),
    border: "1px solid #ddd",
    borderRadius: 5,
  },
  ConfirmButton: {
    fontSize: 16,
    height: 42,
    fontWeight: "bold",
    flex: 1,
  },
}));
export default function AddShowroomOrientedMemoButton({
  iconFill = "#000",
  data = {},
}) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [memoColor, setMemoColor] = useState(
    data?.showroom_memo_list?.[0]?.color || colorOptions[0]
  );
  const handleMemoColor = (event, newColor) => {
    if (newColor !== null) {
      setMemoColor(newColor);
    }
  };

  const inputRef = useRef(null);
  const anchorEl = useRef(null);
  const queryClient = useQueryClient();
  const createMemoMutation = useMutation(
    ["brand", "scheduler", "create-memo"],
    (value) => apiObject.createMemo({ ...value }),
    {
      onSettled: () => {
        setOpen(false);
        queryClient.invalidateQueries(["brand", "scheduler"]);
      },
    }
  );

  const deleteMemoMutation = useMutation(
    ["brand", "scheduler", "delete-memo"],
    (value) => apiObject.deleteMemo({ memo_no: value }),
    {
      onSettled: () => {
        setOpen(false);
        queryClient.invalidateQueries(["brand", "scheduler"]);
      },
    }
  );
  const updateMemoMutation = useMutation(
    ["brand", "scheduler", "update-memo"],
    (value) => apiObject.updateMemo({ ...value }),
    {
      onSettled: () => {
        setOpen(false);
        queryClient.invalidateQueries(["brand", "scheduler"]);
      },
    }
  );

  const deleteMemo = () => {
    deleteMemoMutation.mutate(data?.showroom_memo_list?.[0]?.memo_no);
  };

  const handleConfirmBtnClick = () => {
    const memoCreateObj = {
      color: memoColor,
      showroom_no: data.showroom_no,
      content: inputRef.current.value,
    };
    createMemoMutation.mutate(memoCreateObj);
  };
  const handleUpdateMemo = () => {
    const memoCreateObj = {
      color: memoColor,
      showroom_no: data.showroom_no,
      content: inputRef.current.value,
      memo_no: data?.showroom_memo_list?.[0]?.memo_no,
    };
    updateMemoMutation.mutate(memoCreateObj);
  };

  return (
    <>
      <IconButton
        ref={anchorEl}
        aria-label="add-memo"
        onClick={() => setOpen(!open)}
      >
        <MemoIcon fill={iconFill} />
      </IconButton>
      <Popper
        className={classes.popperRoot}
        open={open}
        anchorEl={anchorEl.current}
        placement="right"
        transition
        disablePortal
        modifiers={{
          flip: {
            enabled: true,
          },
          preventOverflow: {
            enabled: true,
            boundariesElement: "scrollParent",
          },
        }}
        keepMounted={false}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div className={classes.paper}>
              <Grid container justify="flex-end" alignItems="center">
                <Grid item>
                  <IconButton aria-label="more-button" onClick={() => {}}>
                    <MoreIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    aria-label="close-button"
                    onClick={() => setOpen(!open)}
                  >
                    <CloseIcon width={16} height={16} />
                  </IconButton>
                </Grid>
              </Grid>
              <ToggleButtonGroup
                classes={{ root: classes.colorToggleGroup }}
                exclusive
                aria-label="memo color picker"
                onChange={handleMemoColor}
                value={memoColor}
              >
                {colorOptions.map((c) => (
                  <ToggleButton
                    key={c}
                    className={classes.colorBtn}
                    style={{ backgroundColor: c }}
                    value={c}
                  >
                    {memoColor === c ? (
                      <CheckIcon width={24} height={24} />
                    ) : (
                      " "
                    )}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <Box p={2.5} pb={7}>
                {data.showroom_memo_list?.[0]?.content ? (
                  <OutlinedInput
                    inputRef={inputRef}
                    fullWidth
                    multiline
                    rowsMax={20}
                    rows={20}
                    placeholder="메모를 입력해 주세요."
                    classes={{ multiline: classes.inputBaseRoot }}
                    defaultValue={data.showroom_memo_list?.[0]?.content}
                  />
                ) : (
                  <OutlinedInput
                    inputRef={inputRef}
                    fullWidth
                    multiline
                    rowsMax={20}
                    rows={20}
                    placeholder="메모를 입력해 주세요."
                    classes={{ multiline: classes.inputBaseRoot }}
                  />
                )}

                {data.showroom_memo_list ? (
                  <Box display="flex" mt={4}>
                    <Button
                      variant="outlined"
                      fullWidth
                      className={classes.ConfirmButton}
                      onClick={deleteMemo}
                    >
                      Delete
                    </Button>
                    <Box flexBasis={10}></Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      className={classes.ConfirmButton}
                      onClick={handleUpdateMemo}
                    >
                      Save
                    </Button>
                  </Box>
                ) : (
                  <Box mt={4}>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<CheckIcon />}
                      fullWidth
                      className={classes.ConfirmButton}
                      onClick={handleConfirmBtnClick}
                    >
                      Confirm
                    </Button>
                  </Box>
                )}
                {/* {defaultMemoQuery.isLoading ||
                !defaultMemoQuery.data?.not_exists ? (
                ) : (
                  <Box mt={4}>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<CheckIcon />}
                      fullWidth
                      className={classes.ConfirmButton}
                      onClick={handleConfirmBtnClick}
                    >
                      Confirm
                    </Button>
                  </Box>
                )} */}
              </Box>
            </div>
          </Fade>
        )}
      </Popper>
    </>
  );
}
