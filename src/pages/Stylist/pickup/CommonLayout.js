import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonBase,
  ClickAwayListener,
  Dialog,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  makeStyles,
  MenuItem,
  MenuList,
  OutlinedInput,
  Select,
  Typography,
} from "@material-ui/core";
import PageTitle from "components/PageTitle";
import { ReactComponent as DownChevronIcon } from "assets/sheet/chevronDown.svg";
import { ReactComponent as SettingsIcon } from "assets/sheet/settingsIcon.svg";
import { ReactComponent as SettingsWhiteIcon } from "assets/sheet/settingsIcon-white.svg";
import { ReactComponent as CloseBtn } from "assets/sheet/closeBtnIcon.svg";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import { WeekSelectorInput } from "components/WeekSelector";
import dayjs from "dayjs";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  categorySelectBtn: {
    position: "absolute",
    top: 0,
    right: -45,
    width: "calc(100% + 45px)",
    height: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  settingBtn: {
    position: "absolute",
    top: 0,
    right: -110,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    left: 0,
    zIndex: 1,
    border: "1px solid #ddd",
    paddingTop: theme.spacing(3.5),
    paddingBottom: theme.spacing(3.5),
    backgroundColor: theme.palette.common.white,
    fontWeight: "medium",
    width: "calc(100% + 36px)",
    marginTop: 10,
  },

  filterBtn: {
    height: "100%",
    maxHeight: "50px",
    fontWeight: "medium",
  },
  headerSelect: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    fontWeight: "medium",
    minWidth: "80px",
  },
  categoryMenuItemRoot: {
    fontSize: 20,
    paddingLeft: theme.spacing(5),
    fontWeight: "medium",
  },
  menuItemRoot: {
    fontWeight: "medium",
  },
  categorySelect: {
    "& fieldset": {
      border: 0,
    },
    fontWeight: "medium",
    fontSize: "20px",
  },

  dialogPaperRoot: {
    borderRadius: 20,
  },
  settingsDialogCloseBtn: {
    padding: theme.spacing(2.5),
  },
  listItemRoot: {
    fontWeight: "medium",
    fontSize: 16,
    paddingTop: theme.spacing(3.5),
    paddingLeft: theme.spacing(2.5),
    paddingBottom: theme.spacing(3),
  },
  listItemSelected: {},
  dialogTitle: {
    fontSize: 28,
    fontWeight: "bold",
    paddingBottom: theme.spacing(2),
    borderBottom: "2px solid #ddd",
  },
  dialogSubtitle: {
    fontWeight: "medium",
    fontSize: 20,
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(1.5),
  },
  dialogActionBtn: {
    minWidth: 160,
    fontWeight: "bold",
    textTransform: "initial",
    fontSize: 16,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderRadius: 5,
    marginLeft: 10,
  },
  dialogActionOutlinedBtn: {
    color: "#999",
    borderColor: "#ddd",
  },
  dialogContentTextarea: {
    borderColor: "#ddd",
  },
}));

export default function CommonLayout({ pageState, setPageState, children }) {
  const classes = useStyles();

  const [category, setCategory] = useState("send");
  const [date, setDate] = useState("default");
  const [magazine, setMagazine] = useState("default");

  const handleSelectChange = (event) => {
    const name = event.target.name;
    if (name === "date") {
      setDate(event.target.value);
    } else if (name === "category") {
      setCategory(event.target.value);
    } else if (name === "magazine") {
      setMagazine(event.target.value);
    }
  };

  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  const handleClick = (e) => {
    if (e.target.getAttribute("name") === "pickups") {
      setPageState("pickup");
    } else {
      setPageState("sendout");
    }
    setCategoryMenuOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setCategoryMenuOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setCategoryMenuOpen(false);
    }
  };
  const weekRef = useRef(null);
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
  const handleWeekChange = (selected) => {
    setStartDate(dayjs(selected.split("-")[0]).unix());
    // setEndDate(dayjs(selected.split("-")[1]).add(1, "day").unix());
    setEndDate(dayjs(selected.split("-")[1]).unix());
  };

  return (
    <>
      <PageTitle
        titleText={() => (
          <ClickAwayListener onClickAway={handleClickAway}>
            <div className={classes.root}>
              {pageState === "pickup" ? "Pickups" : "Send outs"}
              <ButtonBase
                className={classes.categorySelectBtn}
                onClick={() => setCategoryMenuOpen(true)}
              >
                <DownChevronIcon />
              </ButtonBase>
              {categoryMenuOpen ? (
                <div className={classes.dropdown}>
                  <MenuList
                    id="category-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem
                      name="pickups"
                      onClick={handleClick}
                      disableGutters
                      selected={pageState == "pickup"}
                      classes={{ root: classes.categoryMenuItemRoot }}
                    >
                      Pickups
                    </MenuItem>
                    <MenuItem
                      name="send"
                      onClick={handleClick}
                      selected={pageState == "sendout"}
                      disableGutters
                      classes={{ root: classes.categoryMenuItemRoot }}
                    >
                      Send Out
                    </MenuItem>
                  </MenuList>
                </div>
              ) : null}
            </div>
          </ClickAwayListener>
        )}
      >
        <Box display="flex" alignItems="stretch">
          <Box mr={1.5} display="flex" alignItems="stretch">
            <Grid container>
              <WeekSelectorInput
                handleChange={handleWeekChange}
                inputRef={weekRef}
                hasNavigationButton={false}
              ></WeekSelectorInput>
            </Grid>
          </Box>
          <Box mr={7.5}>
            <FormControl variant="outlined">
              <Select
                labelId="sendOuts-magazine-selection-label"
                id="sendOuts-magazine-selection"
                value={magazine}
                onChange={handleSelectChange}
                name="magazine"
                classes={{ root: classes.headerSelect }}
              >
                <MenuItem
                  classes={{ root: classes.menuItemRoot }}
                  value="default"
                >
                  Magazine
                </MenuItem>
                <MenuItem classes={{ root: classes.menuItemRoot }} value={10}>
                  Ten
                </MenuItem>
                <MenuItem classes={{ root: classes.menuItemRoot }} value={20}>
                  Twenty
                </MenuItem>
                <MenuItem classes={{ root: classes.menuItemRoot }} value={30}>
                  Thirty
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </PageTitle>

      <Box pb={8}></Box>
      {children}
    </>
  );
}
