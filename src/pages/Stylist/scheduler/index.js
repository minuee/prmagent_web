import {Box,Button,Grid,IconButton,makeStyles,Popper,Typography,} from "@material-ui/core";
import { WeekSelectorInput } from "components/WeekSelector";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Constants from 'utils/constants';
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { ReactComponent as PlaneSVG } from "assets/scheduler/plane.svg";
import { ReactComponent as CashSVG } from "assets/scheduler/cash.svg";
import CloseIcon from "@material-ui/icons/Close";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { apiObject } from "api/api_stylist";
import utils from "utils";
import Gallery from "react-photo-gallery";
import Progress from "components/common/progress";

const TitleTxt = styled.div`
  font-size: ${Constants.titleFontSize};
  font-weight: bold;
  line-height: ${Constants.titleFontSize};
  margin-right: 40px;
  margin-bottom: 60px;
`;
const SchedulerConainer = styled.div`
  @media (min-width: 1920px) {
    width: 1480px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 950px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 600px
  }  
`;

const useStyles = makeStyles((theme) => ({
  toogleBtnRoot: {
    minWidth: 104,
    backgroundColor: "#000",
    color: "white",
    opacity: 0.2,
    fontSize: 16,
    maxHeight: 42,
    "&.Mui-selected": {
      opacity: 1,
      backgroundColor: "#000",
      color: "white",
      "&:hover": {
        backgroundColor: "#000",
        color: "white",
      },
    },
    "&:hover": {
      backgroundColor: "#555",
      color: "white",
    },
  },
  selectedToggleBtn: {},
  brandName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  firstText: {
    fontSize: 18,
  },
  rowCount: {
    fontSize: 80,
    color: "#7ea1b2",
    fontWeight: "bold",
  },
  borderTopRadius: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  borderBottomRadius: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cardCommonRoot: {
    cursor: "pointer",
    "&:hover": {
      opacity: 0.8,
    },
  },
  popperRoot: {
    borderRadius: 20,
    boxShadow: "5px 5px 25px 0 rgba(0, 0, 0, 0.16)",
    backgroundColor: "#ffffff",
    marginLeft: 10,
    width: 570,
  },
  closeBtn: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detailName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detailDate: {
    fontSize: 14,
    color: "#999",
    paddingTop: 4,
  },
  detailSmallText: {
    fontSize: 12,
  },
}));
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.addEventListener("load", (e) => resolve(img));
    img.addEventListener("error", () => {
      reject(new Error(`Failed to load image's URL: ${url}`));
    });
    img.src = url;
  });
};
function SchedulerRow({ sortView, rowData, ...props }) {
  const { date, brand_nm } = rowData;
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event, selectedCard) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setCardInfo({ ...selectedCard });
    Promise.all(
      selectedCard.img_url_adres_array.map(async (d) => {
        // var img = new Image();
        // img.src = d.img;
        const [w, h] = await loadImage(d).then((img) => [
          img.width,
          img.height,
        ]);

        return {
          // img: d,
          // title: "",
          // imgSrc: img,
          src: d,
          width: w,
          height: h,
        };
      })
    ).then((values) => {
      setRenderedImageList(values);
    });
  };
  const [open, setOpen] = useState(false);

  const individual_schedules = useMemo(
    () => rowData.individual_schedules,
    [rowData]
  );
  const [cardInfo, setCardInfo] = useState(individual_schedules[0]);
  useEffect(() => {
    setOpen(!!anchorEl);
    return () => {};
  }, [anchorEl]);
  const [imageList, setImageList] = useState([]);
  useEffect(() => {
    return () => {};
  }, []);
 
  const [renderedImageList, setRenderedImageList] = useState([]);

  return (
    <Box 
      padding={3.75} borderBottom="2px solid #ddd" display="flex"
      //height="700px" // fixed the height
      style={{        
        overflow: "hidden",
        overflowX: "scroll" // added scroll
      }}
    >
      <Box minWidth={129}>
        <Typography className={classes.firstText}>
          {sortView === "date" ? (
            <>
              <b>{dayjs.unix(date).format("MM/DD")}</b>(
              {dayjs.unix(date).format("ddd")})
            </>
          ) : (
            <b>{brand_nm}</b>
          )}
        </Typography>
        <Typography className={classes.rowCount}>
          {individual_schedules.length}
        </Typography>
      </Box>
      <Box display="flex" flex={1} pl={2.5}>
        <Popper
          style={{ zIndex: 120 }}
          id={`popper`}
          open={open}
          anchorEl={anchorEl}
          placement="right"
          disablePortal={false}
          modifiers={{
            flip: {
              enabled: true,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: "scrollParent",
            },
          }}
        >
          {cardInfo ? (
            <Box
              position="relative"
              className={classes.popperRoot}
              paddingY={4}
              paddingX={3.75}
            >
              <Box position="absolute" top={20} right={20}>
                <Button
                  endIcon={<CloseIcon />}
                  onClick={() => setAnchorEl(null)}
                  className={classes.closeBtn}
                >
                  닫기
                </Button>
              </Box>
              <img
                src={cardInfo.brand_logo_url_adres}
                style={{ maxWidth: "110px" }}
                alt=""
              />
              <Box pt={2}></Box>
              <Grid container>
                <Grid item xs={6}>
                  <Typography className={classes.detailName}>
                    {cardInfo.req_user_nm}
                  </Typography>
                  <Typography className={classes.detailDate}>
                    {dayjs
                      .unix(cardInfo.expected_return_date)
                      .format("YYYY-MM-DD")}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.detailTitle}>
                    {cardInfo.photogrf_cntent}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" pt={1}>
                    <Box flex="1" pr={4}>
                      {/* <Typography className={classes.detailSmallText}>
                        {cardInfo.studioName}
                      </Typography> */}
                      <Typography className={classes.detailSmallText}>
                        {cardInfo.dlvy_adres_nm}
                      </Typography>
                      <Typography className={classes.detailSmallText}>
                        {cardInfo.adres_detail}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography className={classes.detailSmallText}>
                        {cardInfo.contact_user_nm}
                      </Typography>
                      <Typography className={classes.detailSmallText}>
                        {cardInfo.contact_phone_no}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              {/* image part */}
              <Box
                width="100%"
                flexWrap="wrap"
                pt={3}
                maxHeight={425}
                overflow="auto"
              >                s
                {renderedImageList.length > 1 ? (
                  <Gallery photos={renderedImageList} />
                ) : (
                  <div>
                    <img
                      src={renderedImageList?.[0]?.src}
                      alt=""
                      style={{ maxWidth: "166px" }}
                    />
                  </div>
                )}
              </Box>            
            </Box>
          ) : (
            "not selected"
          )}
        </Popper>
        {individual_schedules.map((card, idx) => (
          <Box
            flexBasis="160px"
            flexGrow={0}
            flexShrink={0}
            border="1px solid #f3f3f3"
            mr={2.5}
            display="flex"
            flexDirection="column"
            key={card.req_no}
            className={classes.cardCommonRoot}
            onClick={(e) => handleClick(e, card)}
          >
            <Box
              bgcolor="#fff"
              height={82}
              display="flex"
              justifyContent="center"
              alignItems="center"
              className={classes.borderTopRadius}
              paddingX={4}
            >
              <Typography className={classes.brandName} align="center">
                {card.brand_nm}
              </Typography>
            </Box>
            <Box
              bgcolor="#dddddd"
              padding={2.5}
              className={classes.borderBottomRadius}
              flex={1}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              position="relative"
            >
              <Box
                position="absolute"
                top={12}
                left={"0"}
                css={{
                  transform: "translateX(-50%)",
                }}
                display="flex"
                flexDirection="column"
              >
                {card.loc_yn && (
                  <IconButton>
                    <PlaneSVG />
                  </IconButton>
                )}
                {(card.own_paid_pictorial_yn ||
                  card.other_paid_pictorial_yn) && (
                  <IconButton>
                    <CashSVG />
                  </IconButton>
                )}
              </Box>
              {card.img_url_adres_array.slice(0, 2).map((img, idx) => (
                <img
                  key={`${card.req_no}-${idx}`}
                  style={{ width: "100%" }}
                  src={img}
                  alt=""
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function Scheduler() {
  const classes = useStyles();
  const weekRef = useRef(null);

  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);

  const byTimeQuery = useQuery(
    ["scheduler", "by-time", startDate, endDate],
    async () =>
      await apiObject.getScheduleByTime({
        min_date: startDate,
        max_date: endDate,
      }),
    {
      enabled: !!startDate && !!endDate,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );
  const byBrandQuery = useQuery(
    ["scheduler", "by-brand", startDate, endDate],
    async () =>
      await apiObject.getScheduleByBrand({
        min_date: startDate,
        max_date: endDate,
      }),
    {
      enabled: !!startDate && !!endDate,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  const [sortView, setSortView] = useState("date");

  const handleSortView = (event, newSortView) => {
    if (newSortView !== null) {
      setSortView(newSortView);
    }
  };
  const handleWeekChange = (selected) => {
    setStartDate(dayjs(selected.split("-")[0]).unix());
    // setEndDate(dayjs(selected.split("-")[1]).add(1, "day").unix());
    setEndDate(dayjs(selected.split("-")[1]).unix());
  };

  return (
    <SchedulerConainer>
      <TitleTxt>Scheduler</TitleTxt>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <ToggleButtonGroup
            value={sortView}
            exclusive
            onChange={handleSortView}
            aria-label="text alignment"
          >
            <ToggleButton
              value="date"
              aria-label="sort by dates"
              classes={{
                root: classes.toogleBtnRoot,
                selected: classes.selectedToggleBtn,
              }}
            >
              날짜 별
            </ToggleButton>
            <ToggleButton
              value="brand"
              aria-label="sort by brands"
              classes={{
                root: classes.toogleBtnRoot,
                selected: classes.selectedToggleBtn,
              }}
            >
              브랜드 별
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Grid container justify="flex-end">
          <WeekSelectorInput
            handleChange={handleWeekChange}
            inputRef={weekRef}
          ></WeekSelectorInput>
        </Grid>
      </Box>
      {byTimeQuery.isLoading || byBrandQuery.isLoading ? (
        <Progress type="load" />
      ) : (
        <Box bgcolor={"#f6f6f6"} width="100%">
          {sortView === "date" ? (
            byTimeQuery.data?.list?.length > 0 ? (
              byTimeQuery.data?.list.map((row) => (
                <SchedulerRow
                  sortView={sortView}
                  rowData={row}
                  key={row.date}
                />
              ))
            ) : (
              <Box
                minHeight={"40vh"}
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize={20}
              >
                해당 기간에 포함된 데이터가 존재하지 않습니다.
              </Box>
            )
          ) : byBrandQuery.data?.list?.length > 0 ? (
            byBrandQuery.data?.list.map((row) => (
              <SchedulerRow
                sortView={sortView}
                rowData={row}
                key={row.brand_id}
              />
            ))
          ) : (
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
        </Box>
      )}
    </SchedulerConainer>
  );
}
// const mockImageList = [
//   {
//     img: "https://images.unsplash.com/photo-1549388604-817d15aa0110",
//     title: "Bed",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1525097487452-6278ff080c31",
//     title: "Books",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
//     title: "Sink",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3",
//     title: "Kitchen",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1588436706487-9d55d73a39e3",
//     title: "Blinds",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1574180045827-681f8a1a9622",
//     title: "Chairs",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1530731141654-5993c3016c77",
//     title: "Laptop",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1481277542470-605612bd2d61",
//     title: "Doors",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7",
//     title: "Coffee",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee",
//     title: "Storage",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62",
//     title: "Candle",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
//     title: "Coffee table",
//   },
// ].map((d) => {
//   var img = new Image();
//   img.src = d.img;

//   return {
//     ...d,
//     imgSrc: img,
//   };
// });
