import React, { useEffect, useState } from "react";
import 'moment/locale/ko';
import moment from "moment";
import DayPicker from "react-day-picker";
import {
  Box,
  Button,
  ClickAwayListener,
  FormControl,
  Grid,
  InputAdornment,
  makeStyles,
  OutlinedInput,
} from "@material-ui/core";
import MomentLocaleUtils from "react-day-picker/moment";
import { ReactComponent as DownArrowIcon } from "assets/scheduler/weekSelectDownArrow.svg";

import { Fragment } from "react";
import { ReactComponent as LeftArrowIcon } from "assets/scheduler/leftArrow.svg";
import { ReactComponent as RightArrowIcon } from "assets/scheduler/rightArrow.svg";
import dayjs from "dayjs";

const useStyles = makeStyles((theme) => ({
  customWeekPicker: {
    flex: 1,
    "& .DayPicker-Month": {
      borderCollapse: "separate",
      margin: 0,
      width: "100%",
      minHeight: "325px",
    },
    "& .DayPicker-wrapper": {
      padding: 0,
    },
    "& .DayPicker-WeekNumber": {
      outline: "none",
    },
    "& .DayPicker-Day": {
      outline: "none",
      border: "1px solid transparent",
      fontWeight: "medium",
      position: "relative",
    },
    "& .DayPicker-Day--hoverRange": {
      backgroundColor: "#ccc !important",
      borderRadius: 0,
    },

    "& .DayPicker-Day--selectedRange": {
      backgroundColor: "#b4dbee !important",
      borderTopColor: "#b4dbee",
      borderBottomColor: "#b4dbee",
      borderLeftColor: "#b4dbee",
      borderRightColor: "#b4dbee",
    },

    "& .DayPicker-Day--hoverRange.DayPicker-Day--selected": {
      borderRadius: "0 !important",
      color: "black !important",
    },
    "& .DayPicker-Day--selectedRange.DayPicker-Day--selected": {
      borderRadius: "0 !important",
      color: "black !important",
    },
    "& .DayPicker-Day--hoverRange:hover": {
      //   borderRadius: "0 !important",
    },
    "& .DayPicker-Day--selectedRange.DayPicker-Day--selectedRangeStart": {
      backgroundColor: "#7ea1b2 !important",
      // borderLeft: "1px solid #7ea1b2",
      border: 0,
      borderTopLeftRadius: "100% !important",
      borderBottomLeftRadius: "100% !important",
      borderRadius: "100% !important",
      "& .selectedRangeBg": {
        backgroundColor: "#b4dbee",
        borderTopLeftRadius: "100%",
        borderBottomLeftRadius: "100%",
      },
    },
    "& .DayPicker-Day--selectedRange.DayPicker-Day--selectedRangeEnd": {
      backgroundColor: "#7ea1b2 !important",
      // borderRight: "1px solid #7ea1b2",
      border: 0,
      borderTopRightRadius: "100% !important",
      borderBottomRightRadius: "100% !important",
      borderRadius: "100% !important",
      "& .selectedRangeBg": {
        backgroundColor: "#b4dbee",
        borderTopRightRadius: "100%",
        borderBottomRightRadius: "100%",
      },
    },
  },
  root: {
    position: "relative",
    height: "100%",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    left: 0,
    zIndex: 2,
    border: "1px solid",
    borderTop: "none",
    padding: theme.spacing(1),

    backgroundColor: theme.palette.background.paper,
    display: "flex",
  },
  inputContainer: {
    minWidth: "260px",
    height: "100%",
    backgroundColor: "#fff",
  },
  outlinedRoot: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    height: "100%",
  },
  inputRoot: {
    fontWeight: 500,
    paddingTop: "11px",
    paddingBottom: "10px",
  },
  calenderNavigationBtn: {
    backgroundColor: "#fff",
    height: "100%",
    minWidth: "40px",
  },
}));

function getWeekDays(weekStart) {
  const days = [weekStart];
  for (let i = 1; i < 7; i += 1) {
    days.push(moment(weekStart).add(i, "days").toDate());
  }
  return days;
}

function getWeekRange(date) {
  return {
    from: moment(date).startOf("week").toDate(),
    to: moment(date).endOf("week").toDate(),
  };
}
export const WeekSelectorInput = ({
  inputRef,
  handleChange,
  hasNavigationButton = true,
  // ...props
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [selectedDays, setSelectedDays] = useState(
    getWeekDays(getWeekRange(new Date()).from)
  );

  useEffect(() => {
    setOpen(false);
    handleChange(inputRef.current.value);
    return () => {};
  }, [selectedDays]);
  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleWeekSelect = (days) => {

  };

  const toPrevWeek = () => {
    setSelectedDays(
      selectedDays.map((item) => dayjs(item).subtract(7, "day").toDate())
    );
  };
  const toNextWeek = () => {
    setSelectedDays(
      selectedDays.map((item) => dayjs(item).add(7, "day").toDate())
    );
  };

  return (
    <Fragment>
      <Grid item style={{ height: "100%" }}>
        <Box height="100%">
          <ClickAwayListener onClickAway={handleClickAway}>
            <div className={classes.root}>
              <FormControl
                variant="outlined"
                className={classes.inputContainer}
              >
                <OutlinedInput
                  id="week-selector"
                  onFocus={handleClick}
                  inputRef={inputRef}
                  value={`${moment(selectedDays[0]).format(
                    "YYYY/MM/DD"
                  )}-${moment(selectedDays[6]).format("YYYY/MM/DD")}`}
                  endAdornment={
                    <InputAdornment position="end">
                      <DownArrowIcon />
                    </InputAdornment>
                  }
                  classes={{
                    root: classes.outlinedRoot,
                    input: classes.inputRoot,
                  }}
                />
                {open ? (
                  <WeekSelector
                    handleWeekSelect={handleWeekSelect}
                    selectedDays={selectedDays}
                    setSelectedDays={setSelectedDays}
                  ></WeekSelector>
                ) : null}
              </FormControl>
            </div>
          </ClickAwayListener>
        </Box>
      </Grid>
      {hasNavigationButton && (
        <Grid item>
          <Box height="100%" ml={2.5}>
            <Button
              onClick={toPrevWeek}
              variant="outlined"
              className={classes.calenderNavigationBtn}
            >
              <LeftArrowIcon />
            </Button>
            <Button
              onClick={toNextWeek}
              variant="outlined"
              className={classes.calenderNavigationBtn}
            >
              <RightArrowIcon />
            </Button>
          </Box>
        </Grid>
      )}
    </Fragment>
  );
};

export default function WeekSelector({
  // handleWeekSelect,
  selectedDays,
  setSelectedDays,
  // ...props
}) {
  const classes = useStyles();

  const [hoverRange, setHoverRange] = useState("");

  const handleDayChange = (date) => {
    setSelectedDays(getWeekDays(getWeekRange(date).from));
  };

  const handleDayEnter = (date) => {
    setHoverRange(getWeekRange(date));
  };

  const handleDayLeave = () => {
    setHoverRange(null);
  };

  const handleWeekClick = (weekNumber, days) => {
    setSelectedDays(days);
  };

  const daysAreSelected = selectedDays.length > 0;

  const modifiers = {
    hoverRange,
    selectedRange: daysAreSelected && {
      from: selectedDays[0],
      to: selectedDays[6],
    },
    hoverRangeStart: hoverRange && hoverRange.from,
    hoverRangeEnd: hoverRange && hoverRange.to,
    selectedRangeStart: daysAreSelected && selectedDays[0],
    selectedRangeEnd: daysAreSelected && selectedDays[6],
  };

  return (
    <div className={classes.dropdown}>
      <DayPicker
        selectedDays={selectedDays}
        showOutsideDays
        fixedWeeks
        modifiers={modifiers}
        onDayClick={handleDayChange}
        onDayMouseEnter={handleDayEnter}
        onDayMouseLeave={handleDayLeave}
        onWeekClick={handleWeekClick}
        className={classes.customWeekPicker}
        locale="ko"
        localeUtils={MomentLocaleUtils}
        month={selectedDays[0]}
        renderDay={(day) => (
          <>
            <div
              className="selectedRangeBg"
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: -1,
              }}
            ></div>
            {day.getDate()}
          </>
        )}
      />
      {selectedDays.length === 7 && <div></div>}
    </div>
  );
}
