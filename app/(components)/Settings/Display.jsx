import React, { useEffect, useState, useContext } from "react";
import { ColorItem } from "./ColorItem";
import { Switch } from "@mui/material";
import { ColorContext } from "@/lib/context/color.context";

const COLOR_OPTIONS = {
  BACKGROUND: "Background",
  MAP: "Map",
  SEARCH: "Search",
  PATH: "Path",
};

export const Display = () => {
  const [focusedColor, setFocusedColor] = useState(null);
  const { setMapColor, setBackgroundColor, setSearchColor, setPathColor } =
    useContext(ColorContext);
  const { backgroundColor, mapColor, searchColor, pathColor } =
    useContext(ColorContext);

  useEffect(() => {
    if (focusedColor === null) return;
    const hexColor = parseInt(focusedColor.color.replace("#", "0x"), 16);

    switch (focusedColor.desc) {
      case COLOR_OPTIONS.BACKGROUND:
        setBackgroundColor(focusedColor.color); // Must be in "" format
        break;

      case COLOR_OPTIONS.MAP:
        setMapColor(hexColor); // Must be in 0x format not ""
        break;

      case COLOR_OPTIONS.SEARCH:
        setSearchColor(hexColor); // Must be in 0x format not ""
        break;

      case COLOR_OPTIONS.PATH:
        setPathColor(hexColor); // Must be in 0x format not ""
        break;

      default:
        console.log("Something went really wrong here");
    }
    setFocusedColor(null);
  }, [focusedColor]);

  return (
    <div>
      <p>Display</p>
      <div className="text-base flex flex-row items-center flex-wrap">
        <p className="text-neutral-300">Colors</p>
        <div className="flex flex-row space-x-3 ml-auto">
          {[
            {
              color: backgroundColor.replace("#", ""),
              desc: COLOR_OPTIONS.BACKGROUND,
            },
            { color: mapColor.toString(16), desc: COLOR_OPTIONS.MAP },
            {
              color: searchColor.toString(16),
              desc: COLOR_OPTIONS.SEARCH,
            },
            { color: pathColor.toString(16), desc: COLOR_OPTIONS.PATH },
          ].map((item, index) => (
            <ColorItem
              key={index}
              color={item.color}
              desc={item.desc}
              setFocus={setFocusedColor}
              initialColor={
                typeof item.color === "string"
                  ? item.color
                  : `#${item.color.toString(16)}`
              }
            />
          ))}
        </div>
      </div>
      <div className="text-base flex flex-row mt-3 -mb-2">
        <p className="text-neutral-300">Bloom</p>
        <span className="ml-auto">
          <Switch />
        </span>
      </div>
    </div>
  );
};
