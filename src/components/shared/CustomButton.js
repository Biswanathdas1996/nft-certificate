import React from "react";
import { Button } from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
// import AutorenewIcon from '@mui/icons-material/Autorenew';
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import TransformOutlinedIcon from "@mui/icons-material/TransformOutlined";
import SaveAsIcon from "@mui/icons-material/SaveAs";

const CustomButton = ({ type }) => {
  // console.log(type);
  let buttonName = "";
  let buttonColor = "";
  let buttonIcon = undefined;

  if (type === "Transfer") {
    buttonName = "Transfer";
    buttonColor = "#CBFCFF";
    buttonIcon = <TransformOutlinedIcon />;
  } else if (type === "Bid") {
    buttonName = "Bid";
    buttonColor = "#F9DAFE";
    buttonIcon = <GavelOutlinedIcon />;
  } else if (type === "Mint") {
    buttonName = "Mint";
    buttonColor = "#F9DAFE";
    buttonIcon = <SaveAsIcon />;
  } else if (type === "Offered") {
    buttonName = "Offered";
    buttonColor = "#FAE9E0";
    buttonIcon = <PercentIcon />;
  } else if (type === "Sold") {
    buttonName = "Sold";
    buttonColor = "#F2E7C5";
    buttonIcon = <VerifiedOutlinedIcon />;
  } else {
    buttonName = "Transfer";
    buttonColor = "#CBFCFF";
    buttonIcon = <TransformOutlinedIcon />;
  }
  return (
    <>
      <Button
        variant="outlined"
        size="small"
        component="span"
        fullWidth
        sx={{
          background: buttonColor,
          color: "#000000",
          textAlign: "center",
          textTransform: "none",
          fontWeight: "bold",
        }}
        startIcon={buttonIcon}
      >
        {buttonName}
      </Button>
    </>
  );
};

export default CustomButton;
