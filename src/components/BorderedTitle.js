import { Box } from "@material-ui/core";
import React from "react";
import { Fragment } from "react";

export default function BorderedTitle({ title }) {
  return (
    <Fragment>
      <Box pb={2} borderBottom="2px solid #ddd" fontSize={28} fontWeight="bold">
        {title}
      </Box>
    </Fragment>
  );
}
