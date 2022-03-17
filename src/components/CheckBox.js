import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/styles";

import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";

const useStyles = makeStyles(() => ({
  checkOn: {
    color: "#7ea1b2",
    marginRight: "2px",
    fontSize: "24px",
  },
  checkOut: {
    color: "#b7b7b7",
    marginRight: "2px",
    fontSize: "24px",
  },
}));

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.div`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Required = styled.div`
  color: #7ea1b2;
`;

export default function CheckBox({
  checked,
  text1,
  text2 = null,
  handleChange,
  handleClick = null,
}) {
  const classes = useStyles();

  return (
    <>
      <Container>
        {checked ? (
          <CheckBoxOutlinedIcon
            className={classes.checkOn}
            onClick={handleChange}
          />
        ) : (
          <CheckBoxOutlineBlankOutlinedIcon
            className={classes.checkOut}
            onClick={handleChange}
          />
        )}
        <Text onClick={handleClick}>{text1}</Text>
        {text2 !== null && <Required>{text2}</Required>}
      </Container>
    </>
  );
}
