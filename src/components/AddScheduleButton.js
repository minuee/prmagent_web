import {
  Badge,
  Box,
  Button,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Popper,
  Typography,
} from "@material-ui/core";
import React, { useRef, useState } from "react";
import { ReactComponent as AddIcon } from "assets/scheduler/addIcon.svg";
import { ReactComponent as CloseBtnIcon } from "assets/scheduler/closeBtnIcon.svg";
import LOGO1 from "assets/scheduler/logo1.png";
import LOGO2 from "assets/scheduler/logo2.png";
import LOGO3 from "assets/scheduler/logo3.png";
import ConfirmDialog from "./ConfirmDialog";

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: 400,
    minWidth: 400,
    overflow: "auto",
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: theme.spacing(2.5),
    paddingTop: theme.spacing(1.5),
  },
  popper: {
    zIndex: 1,
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "0 1em 1em 1em",
        borderColor: `transparent transparent ${theme.palette.common.black} transparent`,
      },
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "1em 1em 0 1em",
        borderColor: `${theme.palette.common.black} transparent transparent transparent`,
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: "-0.9em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 1em 1em 0",
        borderColor: `transparent ${theme.palette.common.black} transparent transparent`,
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: "-0.9em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 0 1em 1em",
        borderColor: `transparent transparent transparent ${theme.palette.common.black}`,
      },
    },
  },
  arrow: {
    position: "absolute",
    fontSize: 7,
    width: "3em",
    height: "3em",
    "&::before": {
      content: '""',
      margin: "auto",
      display: "block",
      width: 0,
      height: 0,
      borderStyle: "solid",
    },
  },
  popperHeader: {
    fontWeight: "medium",
    marginBottom: theme.spacing(1.5),
  },
  closeBtn: {
    color: theme.palette.common.white,
    textTransform: "initial",
    fontWeight: "medium",
  },
  logoContainer: {
    "& img": {
      width: "100%",
    },
  },
  userName: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 1.5,
  },
  userCompany: {
    fontSize: 12,
    lineHeight: 1.5,
    color: "#999",
  },
  gridContainerRoot: {
    maxHeight: "300px",
    overflowY: "scroll",
  },
}));

const optionData = [
  {
    id: 1,
    logoImg: LOGO1,
    name: "이진선 ed",
    company: "Bazaar",
  },
  {
    id: 2,
    logoImg: LOGO2,
    name: "이경은st",
    company: "Elle · 아이즈원",
  },
  {
    id: 3,
    logoImg: LOGO3,
    name: "김지은 ed",
    company: "Esquire",
  },
];

const ScheduleOption = ({
  logoImg,
  name,
  company,
  handleAddOptionClick = () => {},
}) => {
  const classes = useStyles();

  return (
    <Box
      p={1.75}
      pb={2.5}
      bgcolor="white"
      color="black"
      borderRadius={20}
      position="relative"
    >
      <Box maxWidth={72} className={classes.logoContainer} mb={1.5}>
        <img src={logoImg} alt="" />
      </Box>
      <Box>
        <Typography className={classes.userName}>{name}</Typography>
      </Box>
      <Box>
        <Typography className={classes.userCompany}>{company}</Typography>
      </Box>
      <Box position="absolute" top={-18} right={-18}>
        <IconButton
          aria-label="add-schedule-option"
          onClick={handleAddOptionClick}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default function AddScheduleButton({ id, data = [], ...props }) {
  const classes = useStyles();

  const [arrowRef, setArrowRef] = useState(null);
  const addBtnRef = useRef(null);

  const [open, setOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState({});

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleAddOptionClick = (option) => {
    setSelectedOption({ ...option });
    setConfirmDialogOpen(true);
  };

  const handleDialogConfirmBtnCLick = () => {
    setConfirmDialogOpen(false);
    setOpen(false);
  };

  return (
    <>
      <IconButton
        aria-label="add-schedule"
        onClick={() => {
          setOpen(!open);
        }}
        ref={addBtnRef}
      >
        <Badge color="secondary" badgeContent={data.length} overlap="circle">
          <AddIcon width={56} height={56} />
        </Badge>
      </IconButton>
      <Popper
        id={id}
        open={open}
        anchorEl={addBtnRef.current}
        transition
        placement="right"
        disablePortal={false}
        className={classes.popper}
        modifiers={{
          flip: {
            enabled: true,
          },
          arrow: {
            enabled: true,
            element: arrowRef,
          },
          preventOverflow: {
            enabled: true,
            boundariesElement: "scrollParent",
          },
        }}
      >
        <span className={classes.arrow} ref={setArrowRef} />
        <Paper className={classes.paper}>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.popperHeader}
          >
            <Grid item>Requests</Grid>
            <Grid item>
              <Button
                className={classes.closeBtn}
                endIcon={<CloseBtnIcon />}
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            wrap="wrap"
            spacing={2}
            className={classes.gridContainerRoot}
          >
            {data.map((o) => (
              <Grid item xs={6} key={`${o.req_no}`}>
                <ScheduleOption
                  itemId={o.req_no}
                  logoImg={o.mgzn_logo_adres}
                  name={o.req_user_nm}
                  company={o.company_name}
                  handleAddOptionClick={() => handleAddOptionClick(o)}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Popper>
      <ConfirmDialog
        selectedOption={selectedOption}
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        onConfirm={handleDialogConfirmBtnCLick}
      ></ConfirmDialog>
    </>
  );
}
