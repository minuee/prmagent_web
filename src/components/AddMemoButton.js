import { IconButton, makeStyles } from "@material-ui/core";
import React from "react";
import { ReactComponent as MemoIcon } from "assets/scheduler/memoIcon.svg";

export default function AddMemoButton({
  iconFill = "#000",
  onButtonClick = () => {},
}) {
  return (
    <>
      <IconButton aria-label="add-memo" onClick={onButtonClick}>
        <MemoIcon fill={iconFill} />
      </IconButton>
    </>
  );
}
