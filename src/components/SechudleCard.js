import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { Fragment } from "react";
import NoimgLogo from "assets/noimage/noimg_logo_b.svg";

const useStyles = makeStyles(() => ({
  itemName: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  itemCompany: { color: "#999" },
  pickupContent: { fontSize: 18 },
}));
export default function ScheduleCard({
  mr = 2.5,
  mb = 2.5,
  item = {},
  scheduleType = "brand",
  perspective = "brand",
  children,
  onClick = () => {},
  current = false,
}) {
  const classes = useStyles();

  return (
    <Box
      flexGrow={0}
      flexShrink={0}
      flexBasis={"158px"}
      borderRadius="10px"
      // border={`2px solid ${current ? "#7ea1b2" : "#f3f3f3"}`}
      border={`2px solid ${"#f3f3f3"}`}
      bgcolor="#fff"
      mr={mr}
      mb={mb}
      onClick={onClick}
    >
      <Box
        height={40}
        p={1.25}
        pl={1.75}
        borderRadius={"10px 10px 0 0 "}
        bgcolor={item.headerColor}
      >
        { 
          data.mgzn_logo_url_adres.includes('public') ?
          <img src={item.logo} alt="" style={{ height: "100%" }} />
          :
          <img src={NoimgLogo} alt="logo" style={{ height: "100%" }} />
        }
      </Box>
      <Box p={1.75} pt={2}>
        {scheduleType === "brand" ? (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography classes={{ root: classes.itemName }}>
                {perspective === "brand"
                  ? item.req_user_nm
                  : item.brand_user_nm}
              </Typography>
              {children}
            </Box>

            <Typography
              variant="caption"
              classes={{ root: classes.itemCompany }}
            >
              {perspective === "brand" ? item.mgzn_nm : item.brand_nm}
            </Typography>
          </>
        ) : (
          <Fragment>
            <Box display="flex">
              <Typography classes={{ root: classes.pickupContent }}>
                {item.from}
              </Typography>
              <ArrowRightAltIcon />
            </Box>
            <Typography classes={{ root: classes.pickupContent }}>
              {item.to}
            </Typography>
          </Fragment>
        )}
      </Box>
    </Box>
  );
}
