import React from "react";
import SelectBox from "./SelectBox";

const GENDER_OPTIONS = [
  {
    value: 0,
    label: "All Gender",
  },
  {
    value: "SSS001",
    label: "Women",
  },
  {
    value: "SSS002",
    label: "Men",
  },
  {
    value: "SSS003",
    label: "Genderless",
  },
];

export default function TitleComponent({
  data,
  season,
  setSeason,
  setSeasonQuery,
  gender,
  setGender,
  handleChange,
}) {
  return (
    <>
      <div style={{ marginRight: "20px" }}>
        {/* <SelectSeason
          value={season}
          options={data}
          handleChange={handleChange}
        /> */}
        <SelectBox
          value={season}
          setValue={setSeason}
          setSeasonQuery={setSeasonQuery}
          opt={data}
          width={"260px"}
        />
      </div>
      <div>
        <SelectBox value={gender} setValue={setGender} opt={GENDER_OPTIONS} />
      </div>
    </>
  );
}
