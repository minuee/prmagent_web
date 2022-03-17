import { Box, Checkbox } from "@material-ui/core";
import React from "react";
import { ReactComponent as LikeOn } from "assets/heart_icon_on.svg";
import { ReactComponent as LikeOff } from "assets/heart_icon_off.svg";

import { useMutation, useQueryClient } from "react-query";
import { apiObject } from "api/api_magazine";

export default function FavoritesCard({ type, data }) {
  const queryClient = useQueryClient();
  const removeFavorite = useMutation(
    ["remove", "favorite"],
    ({ type, id }) => apiObject.removeFavorites({ category: type, id }),
    {
      onSettled: () => {
        queryClient.invalidateQueries(["favorites"]);
      },
    }
  );

  const addFavorite = useMutation(
    ["add", "favorite"],
    ({ type, id }) => apiObject.addFavorites({ category: type, id }),
    {
      onSettled: () => console.log("added"),
    }
  );
  const handleCheckboxChange = (e, checked) => {
    const id = type === "showroom" ? data.showroom_no : data.brand_press_no;
    if (checked === false) {
      removeFavorite.mutate({ type, id });
    } else {
      addFavorite.mutate({ type, id });
    }
  };
  return (
    <Box
      p={2.5}
      pb={0}
      borderRadius={10}
      bgcolor={"#eef4f8"}
      alignItems="center"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box
        width={240}
        height={360}
        border="solid 1px #dddddd"
        style={{
          backgroundImage: `url(${data.img_url_adres || data.main_img_adres})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "#e7e7e7",
        }}
      ></Box>
      {/* <img
        style={{ width: "100%", maxHeight: 360 }}
        src={data.img_url_adres || data.main_img_adres}
        alt=""
        srcSet=""
      /> */}
      <Box
        display="flex"
        justifyContent="space-between"
        pt={1}
        pb={1}
        width="100%"
      >
        <Box visibility="hidden">
          <Checkbox
            icon={<LikeOff />}
            checkedIcon={<LikeOn />}
            name="checked"
          />
        </Box>
        <Box display="flex" alignItems="center" fontSize={16} fontWeight="bold">
          {type === "showroom" ? data.showroom_nm : data.press_subj}
        </Box>
        <Box style={{ transform: "translateX(8px)" }}>
          <Checkbox
            icon={<LikeOff />}
            checkedIcon={<LikeOn />}
            name="checked"
            defaultChecked={true}
            onChange={handleCheckboxChange}
          />
        </Box>
      </Box>
    </Box>
  );
}
