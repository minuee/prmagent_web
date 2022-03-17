import {
  Box,
  Button,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  MenuItem,
  Popper,
  Select,
  Typography,
} from "@material-ui/core";
import AddMemoButton from "components/AddMemoButton";
import AddScheduleButton from "components/AddScheduleButton";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Fragment } from "react";
import { ReactComponent as PlaneIcon } from "assets/scheduler/planeIcon.svg";
import { ReactComponent as CoinIcon } from "assets/scheduler/coinIcon.svg";
import { ReactComponent as StackIcon } from "assets/scheduler/stackIcon.svg";
import { ReactComponent as MoreIcon } from "assets/scheduler/moreBtnIcon.svg";
import { ReactComponent as CloseIcon } from "assets/scheduler/closeBtnIcon-black.svg";
import { ReactComponent as CheckIcon } from "assets/scheduler/CheckIcon.svg";
import { ReactComponent as ChevronDownIcon } from "assets/scheduler/chevronDown.svg";

import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiObject } from "api/api_brand";
import AddShowroomOrientedMemoButton from "components/AddShowroomOrientedMemoButton";
import useDraggable from "hooks";
import Progress from "components/common/progress";

const makeDataToRow = (inputArr = []) => {
  const outputArr = [];
  let filteredObject = inputArr.reduce((acc, curr) => {
    if (Array.isArray(acc[curr.from])) {
      acc[curr.from].push(curr);
    } else {
      acc[curr.from] = [curr];
    }
    return acc;
  }, {});

  let filteredArrays = [[], [], [], [], [], [], [], []];

  for (const [key, value] of Object.entries(filteredObject)) {
    filteredArrays[key] = [...value];
  }
  let sortedFilteredArrays = filteredArrays.map((dayArray) => {
    dayArray.sort((a, b) => {
      if (a.type === "daily-memo") {
        return -1;
      } else if (b.type === "daily-memo") {
        return 1;
      } else {
        return b.to - b.from - (a.to - a.from);
      }
    });
    return dayArray;
  });

  const dailyMemoFiltered = inputArr
    .filter((card) => card.type === "daily-memo")
    .sort((a, b) => a.from - b.from);

  while (!sortedFilteredArrays.every((a) => a.length === 0)) {
    for (let i = 1; i <= 7; i++) {
      if (sortedFilteredArrays[i].length) {
        if (dailyMemoFiltered.length) {
          if (
            sortedFilteredArrays[i][0].type !== "daily-memo" &&
            sortedFilteredArrays[i][0].to >= dailyMemoFiltered[0].from
          ) {
            outputArr.push({
              // id: utils.getUUID(),
              from: i,
              to: i,
              data: "",
              blank: true,
            });
          } else {
            let newSchedule = sortedFilteredArrays[i].shift();
            i = newSchedule.to;
            outputArr.push(newSchedule);
            if (newSchedule.type === "daily-memo") {
              dailyMemoFiltered.shift();
            }
          }
        } else {
          let newSchedule = sortedFilteredArrays[i].shift();
          i = newSchedule.to;
          outputArr.push(newSchedule);
        }
      } else {
        outputArr.push({
          // id: utils.getUUID(),
          from: i,
          to: i,
          data: "",
          blank: true,
        });
      }
    }
  }
  return outputArr;
};
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
  formControl: {
    position: "relative",
  },
  timeLineRoot: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: theme.spacing(2),
    width: 200,
    minWidth: 200,
    position: "relative",
    flexShrink: 0,
    fontWeight: "medium",
    boxSizing: "border-box",
    fontSize: 18,
    textAlign: "center",
    borderRight: "2px solid #ddd",
    "&:first-child": {
      borderTopLeftRadius: 10,
    },
    "&:last-child": {
      borderTopRightRadius: 10,
      borderRight: 0,
    },
  },
  rowCellContainer: {
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(2.5),
    maxWidth: 200,
    minWidth: 200,
    height: "100%",
    flexShrink: 0,
    boxSizing: "border-box",
    borderRight: "2px solid #ddd",
    "&:last-child": {
      borderRight: 0,
    },
  },
  scheduleStyle: {
    border: "1px solid #ddd",
    padding: theme.spacing(1),
    position: "relative",
  },
  popperRoot: {
    zIndex: 120,
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
export default function MainBoard({ queryData = [], startDate, endDate }) {
  const classes = useStyles();

  const weekData = new Array(7)
    .fill(null)
    .map((day, idx) => dayjs(startDate).add(idx, "day"))
    .map((obj) => ({
      ...obj,
      id: obj.format("YYYY-MM-DD"),
      date: obj.format("MM/DD"),
      day: obj.locale("en").format("ddd").toUpperCase(),
      timestamp: obj.unix(),
    }));

  // const getUUID = useCallback(() => {
  //   return utils.getUUID();
  // }, []);

  const showroomList = queryData.map((qd) => ({
    showroom_nm: qd.showroom_nm,
    showroom_no: qd.showroom_no,
  }));

  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const togglePopper = () => setOpen(!open);
  const [selectedDateIdx, setSelectedDateIdx] = useState(null);
  const [selectedShowroomIdx, setSelectedShowroomIdx] = useState(null);
  const [memoColor, setMemoColor] = useState(colorOptions[0]);
  const [selectedMemoNo, setSelectedMemoNo] = useState(null);

  useEffect(() => {}, [selectedShowroomIdx, selectedDateIdx]);

  const onClickMemoButton = (event, idx) => {
    setAnchorEl(event.currentTarget);
    setSelectedDateIdx(idx);
    setSelectedShowroomIdx(0);
    togglePopper();
  };
  const handleMemoColor = (event, newColor) => {
    if (newColor !== null) {
      setMemoColor(newColor);
    }
  };

  const queryClient = useQueryClient();
  const createMemoQuery = useMutation(
    ["scheduler", "create-memo"],
    (value) => apiObject.createMemo({ ...value }),
    {
      onSettled: () => {
        queryClient.invalidateQueries(["brand", "scheduler"]);
        queryClient.invalidateQueries([
          "scheduler",
          "default-memo",
          selectedShowroomIdx,
          selectedDateIdx,
        ]);
        setOpen(false);
      },
    }
  );

  const deleteMemoQuery = useMutation(
    ["scheduler", "delete-memo"],
    (memo_no) => apiObject.deleteMemo({ memo_no }),
    {
      onSettled: () => {
        queryClient.invalidateQueries(["brand", "scheduler"]);
        setOpen(false);
      },
    }
  );
  const handleConfirmBtnClick = () => {
    let bodyObj = {
      showroom_no: showroomList[selectedShowroomIdx].showroom_no,
      date: weekData[selectedDateIdx].timestamp,
      color: memoColor,
      content: inputRef.current.value,
    };
    createMemoQuery.mutate(bodyObj);
  };

  const modifyMemo = (event, memo) => {
    setAnchorEl(event.currentTarget);
    setSelectedDateIdx(memo.from - 1);
    setSelectedShowroomIdx(memo.showroomIdx);
    setMemoColor(memo.color);
    setSelectedMemoNo(memo.memo_no);
    togglePopper();
  };

  const deleteMemo = () => {
    deleteMemoQuery.mutate(selectedMemoNo);
  };

  const defaultMemoQuery = useQuery(
    ["scheduler", "default-memo", selectedShowroomIdx, selectedDateIdx],
    () =>
      apiObject.searchMemo({
        showroom_no: showroomList[selectedShowroomIdx]?.showroom_no,
        date: weekData[selectedDateIdx]?.timestamp,
      }),
    {
      enabled:
        !!showroomList[selectedShowroomIdx] && !!weekData[selectedDateIdx],
    }
  );

  const [defaultInputValue, setDefaultInputValue] = useState("");
  useEffect(() => {
    if (!defaultMemoQuery.isLoading) {
      if (!defaultMemoQuery.data?.not_exists) {
        setDefaultInputValue(defaultMemoQuery.data?.memo.content);
        setMemoColor(defaultMemoQuery.data?.memo.color);
      } else {
        setDefaultInputValue("");
        setMemoColor(colorOptions[0]);
      }
    }
    return () => {};
  }, [defaultMemoQuery]);

  const scrollerContainerRef = useDraggable();

  return (
    <>
      <Box ref={scrollerContainerRef} width="100%" overflow="scroll">
        {/* <ScrollContainer ignoreElements=".MuiInputBase-root"> */}
        <Box overflow="auto" minWidth={1680}>
          {/* header */}

          {/* row starts */}

          {queryData.length > 0 ? (
            queryData.map((d, showroomIdx) => {
              let nullEscapedMemo = Array.isArray(d.memo_list)
                ? d.memo_list?.map((memo) => ({
                    ...memo,
                    // from: 1,
                    // to: 1,
                    from: parseInt(dayjs.unix(memo.memo_dt).format("d")) + 1,
                    to: parseInt(dayjs.unix(memo.memo_dt).format("d")) + 1,
                    type: "daily-memo",
                    content: memo.content,
                    showroomIdx,
                  }))
                : [];

              let nullEscapedRequests = Array.isArray(d.req_list)
                ? d.req_list.map((rl) => ({
                    ...rl,
                    blank: false,
                    from: parseInt(dayjs.unix(rl.start_dt).format("d")) + 1,
                    to:
                      dayjs.unix(rl.end_dt).format("d") <=
                      dayjs.unix(rl.start_dt).format("d")
                        ? 7
                        : parseInt(dayjs.unix(rl.end_dt).format("d")) + 1,
                    data: () => (
                      <Fragment>
                        <Box
                          bgcolor={rl.mgzn_color}
                          height={48}
                          p={1.5}
                          style={{
                            borderTopLeftRadius: 14,
                            borderTopRightRadius: 14,
                          }}
                          display="flex"
                          justifyContent="space-between"
                        >
                          <img
                            src={rl.mgzn_logo_adres}
                            // src={
                            //   "https://image.jtbcplus.kr/data/common/metadata_logo_el.jpg"
                            // }
                            style={{ height: 24 }}
                            alt=""
                            srcSet=""
                          />
                          <Box display="flex">
                            {rl.loc_yn && (
                              <Box ml={1} display="flex" alignItems="center">
                                <PlaneIcon />
                              </Box>
                            )}
                            {rl.own_paid_pictorial_yn && (
                              <Box ml={1} display="flex" alignItems="center">
                                <CoinIcon />
                              </Box>
                            )}
                            {rl.other_paid_pictorial_yn && (
                              <Box ml={1} display="flex" alignItems="center">
                                <StackIcon />
                              </Box>
                            )}
                          </Box>
                        </Box>
                        <Box
                          pt={1.5}
                          pb={2.5}
                          paddingX={1.8}
                          bgcolor={"#f6f6f6"}
                          style={{
                            borderBottomLeftRadius: 14,
                            borderBottomRightRadius: 14,
                          }}
                        >
                          <Box
                            fontSize={18}
                            fontWeight={"bold"}
                            lineHeight={1.5}
                            display="flex"
                            justifyContent="space-between"
                          >
                            <Box>{rl.req_user_nm}</Box>
                          </Box>
                          <Box fontSize={12} color="#999" lineHeight={1.5}>
                            {rl.company_name}
                          </Box>
                          <Box fontSize={12} pt={1}>
                            <div>{rl.address}</div>
                            <div>{rl.contact_user_nm}</div>
                            <div>{rl.contact_user_phone}</div>
                          </Box>
                        </Box>
                      </Fragment>
                    ),
                  }))
                : [];
              const generatedRow = makeDataToRow([
                ...nullEscapedMemo,
                ...nullEscapedRequests,
              ]);
              const requestWaitListPerDay = (d.req_wait_list !== null
                ? d.req_wait_list
                : []
              )
                .map((rwl) => ({
                  ...rwl,
                  from: parseInt(dayjs.unix(rwl.start_dt).format("d")) + 1,
                  to:
                    dayjs.unix(rwl.end_dt).format("d") <=
                    dayjs.unix(rwl.start_dt).format("d")
                      ? 7
                      : parseInt(dayjs.unix(rwl.end_dt).format("d")) + 1,
                  data: () => "hello world",
                }))
                .reduce((acc, curr) => {
                  let newAcc = [...acc];
                  newAcc[curr.from - 1] = [...newAcc[curr.from - 1], curr];
                  return newAcc;
                }, new Array(7).fill([]));
              const requestCount = generatedRow.reduce((acc, curr) => {
                if (!curr.blank) {
                  let startIdx = parseInt(curr.from) - 1;
                  while (startIdx <= parseInt(curr.to) - 1) {
                    acc[startIdx]++;
                    startIdx++;
                  }
                }
                return acc;
              }, new Array(7).fill(0));
              requestCount.forEach((cnt, idx) => {
                generatedRow.push({
                  from: idx + 1,
                  to: idx + 1,
                  type: "add-schedule",
                  data:
                    requestWaitListPerDay[idx] &&
                    requestWaitListPerDay[idx].length > 0
                      ? () => {
                          return (
                            <AddScheduleButton
                              data={requestWaitListPerDay[idx]}
                              id="add-schedule-1"
                            ></AddScheduleButton>
                          );
                        }
                      : null,
                  blank: cnt === 0 ? true : false,
                });
              });
              return (
                <Fragment key={d.showroom_no}>
                  {showroomIdx === 0 && (
                    <Box display="flex" minWidth={1680}>
                      <Box flexBasis="280px" flexShrink={0}></Box>
                      <Popper
                        className={classes.popperRoot}
                        open={open}
                        anchorEl={anchorEl}
                        placement="right-start"
                        transition
                        // disablePortal
                        modifiers={{
                          flip: {
                            enabled: true,
                          },
                          preventOverflow: {
                            enabled: true,
                            boundariesElement:
                              queryData.length > 0 ? "viewport" : "viewport",
                          },
                        }}
                      >
                        {({ TransitionProps }) => (
                          <Fade {...TransitionProps} timeout={350}>
                            <div className={classes.paper}>
                              <Grid
                                container
                                justify="flex-end"
                                alignItems="center"
                              >
                                <Grid item>
                                  <IconButton
                                    aria-label="more-button"
                                    onClick={() => {}}
                                  >
                                    <MoreIcon />
                                  </IconButton>
                                </Grid>
                                <Grid item>
                                  <IconButton
                                    aria-label="close-button"
                                    onClick={togglePopper}
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
                                <Box mb={2.5}>
                                  <FormControl
                                    variant="outlined"
                                    className={classes.formControl}
                                    fullWidth
                                  >
                                    <Select
                                      native
                                      id="memo-showroom-select"
                                      value={selectedShowroomIdx}
                                      onChange={(v) => {
                                        setSelectedShowroomIdx(v.target.value);
                                      }}
                                      IconComponent={ChevronDownIcon}
                                    >
                                      {showroomList.map((sr, idx) => (
                                        <option
                                          key={sr.showroom_no}
                                          value={idx}
                                          showroom_no={sr.showroom_no}
                                        >
                                          {sr.showroom_nm}
                                        </option>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Box>
                                <Box mb={2.5}>
                                  <FormControl
                                    variant="outlined"
                                    className={classes.formControl}
                                    fullWidth
                                  >
                                    <Select
                                      id="memo-showroom-select"
                                      value={selectedDateIdx}
                                      onChange={(v) => {
                                        setSelectedDateIdx(v.target.value);
                                      }}
                                      IconComponent={ChevronDownIcon}
                                      native
                                    >
                                      {weekData.map((dateObj, idx) => (
                                        <option key={dateObj.id} value={idx}>
                                          {dateObj.date} ({dateObj.day})
                                        </option>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Box>
                                {defaultMemoQuery.isFetching ? (
                                  <Progress type="load" />
                                ) : defaultMemoQuery.data?.memo?.content ? (
                                  <InputBase
                                    inputRef={inputRef}
                                    fullWidth
                                    multiline
                                    rowsMax={20}
                                    rows={20}
                                    placeholder="메모를 입력해 주세요."
                                    classes={{
                                      multiline: classes.inputBaseRoot,
                                    }}
                                    defaultValue={
                                      defaultMemoQuery.data?.memo?.content
                                    }
                                  ></InputBase>
                                ) : (
                                  <InputBase
                                    inputRef={inputRef}
                                    fullWidth
                                    multiline
                                    rowsMax={20}
                                    rows={20}
                                    placeholder="메모를 입력해 주세요."
                                    classes={{
                                      multiline: classes.inputBaseRoot,
                                    }}
                                  ></InputBase>
                                )}
                                {defaultMemoQuery.isLoading ||
                                !defaultMemoQuery.data?.not_exists ? (
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
                                      onClick={handleConfirmBtnClick}
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
                              </Box>
                            </div>
                          </Fade>
                        )}
                      </Popper>
                      <table style={{ borderCollapse: "collapse" }}>
                        <tbody>
                          <tr>
                            {weekData.map((w, idx) => (
                              <td className={classes.timeLineRoot} key={w.date}>
                                <b>{w.date}</b>({w.day})
                                <Box
                                  position="absolute"
                                  top={0}
                                  right={0}
                                  height="100%"
                                  mr={1}
                                  display="flex"
                                >
                                  <AddMemoButton
                                    iconFill="#fff"
                                    onButtonClick={(e) =>
                                      onClickMemoButton(e, idx)
                                    }
                                  ></AddMemoButton>
                                </Box>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </Box>
                  )}
                  <Box
                    className={classes.rowContainer}
                    borderBottom="2px solid #ddd"
                    width={1680}
                    display="flex"
                    mr={7.5}
                    position="relative"
                  >
                    <Box
                      width="280px"
                      pt={3.5}
                      pl={2.5}
                      pr={2.5}
                      pb={4.5}
                      position="relative"
                    >
                      <img
                        src={d.image_list[0]}
                        alt=""
                        style={{ width: "100%" }}
                      />
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        pt={1}
                        pb={2.5}
                      >
                        <Typography>{d.showroom_nm}</Typography>
                        <AddShowroomOrientedMemoButton
                          id={d.showroom_no}
                          iconFill="#000"
                          data={d}
                        ></AddShowroomOrientedMemoButton>
                      </Box>
                      <Box
                        width={160}
                        borderRadius={10}
                        border={`2px solid ${
                          d.showroom_memo_list
                            ? d.showroom_memo_list[0].color
                            : "#ddd"
                        }`}
                        margin="0 auto"
                        p={1.75}
                        pb={2.5}
                      >
                        {d.showroom_memo_list &&
                          d.showroom_memo_list[0].content}
                      </Box>
                      {weekData.map((wd, i) => (
                        <Box
                          key={wd.id}
                          position="absolute"
                          top={0}
                          left={`calc(100% + ${i * 200}px)`}
                          bgcolor="#fff"
                          width={200}
                          height="100%"
                          borderRight="2px solid #ddd"
                        ></Box>
                      ))}
                    </Box>
                    <Box
                      position="relative"
                      display="flex"
                      width={1400}
                      overflow={"scroll"}
                      maxHeight={800}
                      flexWrap="wrap"
                      alignItems="flex-start"
                      alignContent="flex-start"
                    >
                      {requestCount.map((cnt, idx) => (
                        <Fragment key={idx}>
                          {cnt === 0 ? (
                            <Box
                              position="absolute"
                              top={0}
                              left={200 * idx}
                              width={200}
                              height="100%"
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              {requestWaitListPerDay[idx] &&
                                requestWaitListPerDay[idx].length > 0 && (
                                  <AddScheduleButton
                                    id="add-schedule-1"
                                    data={requestWaitListPerDay[idx]}
                                  ></AddScheduleButton>
                                )}
                            </Box>
                          ) : (
                            ""
                          )}
                        </Fragment>
                      ))}

                      {generatedRow.map((scheduleCard) => (
                        <Box
                          key={scheduleCard.req_no}
                          width={
                            (scheduleCard.to - scheduleCard.from + 1) * 200
                          }
                          display="flex"
                          justifyContent="center"
                          boxSizing="border-box"
                        >
                          {scheduleCard.blank || scheduleCard.data === null ? (
                            ""
                          ) : scheduleCard.type === "add-schedule" ? (
                            <Box>
                              {typeof scheduleCard.data === "function"
                                ? scheduleCard.data()
                                : scheduleCard.data}
                            </Box>
                          ) : scheduleCard.type === "daily-memo" ? (
                            <Box
                              width="100%"
                              m={2}
                              p={1.75}
                              pb={2.5}
                              border={`2px solid ${scheduleCard.color}`}
                              borderRadius={10}
                              style={{ cursor: "pointer" }}
                              onClick={(e) => modifyMemo(e, scheduleCard)}
                            >
                              <Box
                                style={{ textTransform: "uppercase" }}
                                fontSize={12}
                              >
                                {dayjs
                                  .unix(scheduleCard.memo_dt)
                                  .locale("en")
                                  .format("MM/DD (ddd)")}
                              </Box>
                              <Box fontSize={16} pt={1.5}>
                                {scheduleCard.content}
                              </Box>
                            </Box>
                          ) : (
                            <Box
                              border="1px solid #ddd"
                              bgcolor="#fff"
                              // p={2}
                              width="100%"
                              m={2}
                              borderRadius={14}
                            >
                              {typeof scheduleCard.data === "function"
                                ? scheduleCard.data()
                                : scheduleCard.data}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Fragment>
              );
            })
          ) : (
            <Box></Box>
          )}
        </Box>
        {/* </ScrollContainer> */}
      </Box>
      {queryData.length === 0 && (
        <Box
          minHeight={"40vh"}
          display="flex"
          justifyContent="center"
          alignItems="center"
          fontSize={20}
        >
          해당 기간에 포함된 데이터가 존재하지 않습니다.
        </Box>
      )}
    </>
  );
}
