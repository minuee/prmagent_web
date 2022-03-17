import {Box,Checkbox,FormControlLabel,makeStyles,Typography,} from "@material-ui/core";
import React, { useState } from "react";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import { MockSheetData } from "./MockData";
import Constants from 'utils/constants';
import styled from "styled-components";
import CommonLayout from "./CommonLayout";
import ScheduleCard from "components/SechudleCard";
import { useHistory, useRouteMatch } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  dateRow: {},
  dateCount: {
    fontWeight: "bold",
    fontSize: 80,
    color: "#7ea1b2",
  },
  dateLabelText: {
    fontWeight: "medium",
    fontSize: 18,
  },
  dateLabelRoot: {
    marginLeft: 0,
  },
  dateCheckboxRoot: { padding: 0, marginLeft: 10 },
}));
const TitleTxt = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-right: 40px;
  margin-bottom: 60px;
`;

export default function Pickup() {
  const classes = useStyles();

  const history = useHistory();
  let { url } = useRouteMatch();

  const handleClick = (item) => {
    history.push(`${url}/${item.id}`);
  };
  const [pageState, setPageState] = useState("pickup");

  return (
    <>
      {/* <TitleTxt>Pick up</TitleTxt> */}
      <CommonLayout pageState={pageState} setPageState={setPageState}>
        <Box bgcolor="#f6f6f6" borderRadius="10px" mr={7.5}>
          {MockSheetData.map((d, i) => (
            <Box
              key={d.key}
              p={3.75}
              display="flex"
              borderBottom={
                MockSheetData.length - 1 === i ? "none" : "2px solid #ddd"
              }
              className={classes.dateRow}
            >
              <Box width={160} display="flex" flexDirection="column">
                <Box display="flex">
                  <FormControlLabel
                    classes={{
                      labelPlacementStart: classes.dateLabelRoot,
                      label: classes.dateLabelText,
                    }}
                    control={
                      <Checkbox
                        color="default"
                        inputProps={{ "aria-label": "checkbox for dates" }}
                        icon={<CheckBoxOutlinedIcon />}
                        classes={{ root: classes.dateCheckboxRoot }}
                      />
                    }
                    label={
                      <span>
                        <b>{d.date}</b>({d.day})
                      </span>
                    }
                    labelPlacement={"start"}
                  ></FormControlLabel>
                </Box>
                <Typography variant="h2" classes={{ h2: classes.dateCount }}>
                  {d.count}
                </Typography>
              </Box>
              <Box display="flex" flexWrap="wrap" flex={1}>
                {d.items.map((item) => (
                  <ScheduleCard
                    key={item.id}
                    item={item}
                    scheduleType="magazine"
                    onClick={() => handleClick(item)}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </CommonLayout>
    </>
  );
}
