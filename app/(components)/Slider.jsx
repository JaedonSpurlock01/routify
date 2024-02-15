import React, { useContext } from "react";
import { Slider } from "@mui/material";
import { AlgorithmContext } from "@/lib/context/algorithm.context";
import { alpha } from "@mui/material/styles";

export const SpeedSlider = () => {
  const { setSpeed } = useContext(AlgorithmContext);

  return (
    <div className="p-2 w-[10rem] h-9">
      <h2 className="text-xs text-neutral-100 ">Animation Speed</h2>
      <Slider
        defaultValue={100}
        min={10}
        max={1000}
        step={10}
        valueLabelDisplay="off"
        aria-label="Algorithm Speed"
        sx={{
          color: "#ffffff",
          "& .MuiSlider-thumb": {
            "&:hover, &.Mui-focusVisible": {
              boxShadow: `0px 0px 0px 4px ${alpha("#9c9c9c", 0.16)}`,
            },
            "&.Mui-active": {
              boxShadow: `0px 0px 0px 7px ${alpha("#9c9c9c", 0.16)}`,
            },
          },
          "& .MuiSlider-rail": {
            color: "#A8AFB3",
            opacity: 1,
          },
        }}
      ></Slider>
    </div>
  );
};
