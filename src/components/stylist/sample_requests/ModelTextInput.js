import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TextField } from "@material-ui/core";
import { label } from "@aws-amplify/ui";

const StyleTextField = styled(TextField)`
  .MuiOutlinedInput-input {
    padding: 13px 14px;
    font-weight: 500;
  }
  .MuiInputBase-root {
    @media (min-width: 1920px) {
      width: 507px
    }
    @media (min-width: 1440px) and (max-width: 1919px) {
      width: 507px
    }
    @media (min-width: 10px) and (max-width: 1439px) {
      width: 350px
    } 
    height: 42px;
  }

  .MuiInputBase-root.Mui-disabled {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
  }

  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: #dddddd;
  }

  .MuiInputBase-input.Mui-disabled {
    color: #999999;
  }
`;

export default function ModelTextInput({
  checked,
  placeHolder,
  idx,
  data,
  setData,
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setData([...data, value]);
  }, []);

  const handleChange = (e) => {
    data[`${idx}`] = e.target.value;
    setData([...data]);
    setValue(e.target.value);
  };

  return (
    <StyleTextField
      variant="outlined"
      value={data[`${idx}`] || value}
      placeholder={placeHolder}
      onChange={handleChange}
      disabled={!checked}
      readOnly={!checked}
    />
  );
}
