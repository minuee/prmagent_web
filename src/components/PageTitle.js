import { Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  titleText: {
    position: "relative",
    fontWeight: "bold",
  },
  titleContainer: {
    marginBottom: theme.spacing(10),
  },
}));

export default function PageTitle({ titleText, children }) {
  const classes = useStyles();
  return (
    <Grid
      container
      justify="space-between"
      alignItems="center"
      className={classes.titleContainer}
    >
      <Grid item>
        <Typography variant="h3" classes={{ root: classes.titleText }}>
          {typeof titleText == "function" ? titleText() : titleText}
        </Typography>
      </Grid>
      <Grid item>{children}</Grid>
    </Grid>
  );
}
