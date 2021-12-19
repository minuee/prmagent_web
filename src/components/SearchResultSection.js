import { Box, Grid, makeStyles } from "@material-ui/core";
import dayjs from "dayjs";
import React from "react";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  mainText: {
    fontSize: 20,
    fontWeight: 500,
  },
  subText: {
    fontSize: 14,
    color: "#999",
    paddingTop: theme.spacing(1),
  },
  itemContainer: {
    cursor: "pointer",
    borderRadius: 10,
    "&:hover": {
      background: "rgba(151, 179, 193, 0.3)",
    },
  },
}));

const searchResultMapper = (type, item, userType) => {
  let main_txt = "";
  let sub_txt = "";
  let key = "";
  let clickHref = "";

  switch (type) {
    case "showroom":
      main_txt = item.title;
      sub_txt = item.subtitle;
      key = main_txt + sub_txt + item.showroom_no;
      clickHref = userType.is_brand_user
        ? `/brand/digital_showroom/detail/${item.showroom_no}`
        : userType.is_mgzn_user
        ? `/magazine/digital_showroom/detail/${item.showroom_no}`
        : `/magazine/digital_showroom/detail/${item.showroom_no}`;
      break;
    case "press":
      main_txt = item.press_subj;
      sub_txt = dayjs(item.input_dt).format("YYYY-MM-DD");
      key = main_txt + sub_txt;
      clickHref = userType.is_brand_user
        ? `/brand/press_release/detail/${item.brand_press_no}`
        : userType.is_mgzn_user
        ? `/magazine/press_release/detail/${item.brand_press_no}`
        : `/magazine/press_release/detail/${item.brand_press_no}`;
      break;
    case "lookbook":
      main_txt = item.lookbook_nm;
      sub_txt = dayjs.unix(item.lookbook_reg_dt).format("YYYY-MM-DD");
      key = main_txt + sub_txt + item.lookbook_no;
      clickHref = `/brand/lookbook/detail/${item.lookbook_no}`;
      break;
    default:
      break;
  }
  return {
    ...item,
    main_txt,
    sub_txt,
    key,
    clickHref,
  };
};

export default function SearchResultSection({
  title = "",
  type = "showroom",
  data = [],
}) {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const userType = queryClient.getQueryData(["user-type"]);

  const history = useHistory();

  const mappedData = data.map((item) =>
    searchResultMapper(type, item, userType)
  );

  const handleResultItemClick = (item) => {
    history.push(item.clickHref);
  };

  return (
    <Box mb={7}>
      <Box fontSize={18} fontWeight="bold" mb={3}>
        {title} ({mappedData.length})
      </Box>
      <Grid container spacing={3}>
        {mappedData.map((d) => (
          <Grid
            key={d.key}
            container
            item
            xs={6}
            lg={4}
            xl={3}
            spacing={2}
            className={classes.itemContainer}
            onClick={() => handleResultItemClick(d)}
          >
            <Grid item xs={4} container alignItems="center">
              <img style={{ width: "100%" }} src={d.img_url_adres} alt="" />
            </Grid>
            <Grid container direction="column" justify="center" item xs={8}>
              <Grid item className={classes.mainText}>
                {d.main_txt}
              </Grid>
              <Grid item className={classes.subText}>
                {d.sub_txt}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
