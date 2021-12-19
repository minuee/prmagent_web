import { makeStyles, Select, withStyles } from "@material-ui/core";
import { ReactComponent as DownChevron } from "assets/scheduler/chevronDown.svg";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    fontWeight: "medium",
    minWidth: "80px",
  },
  icon: {
    top: "50%",
    transform: "translateY(-50%)",
  },
}));
const styles = {};
export default function StyledSelect(props) {
  const classes = useStyles();
  // const { classes } = props;
  return (
    <Select
      // className={classes.root}
      {...props}
      classes={{ root: classes.root, icon: classes.icon }}
      IconComponent={DownChevron}
    >
      {props.children}
    </Select>
  );
}
