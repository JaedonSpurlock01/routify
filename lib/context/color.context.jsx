import React, { createContext, useState } from "react";

export const ColorContext = createContext();

const DEFAULT_MAP_COLOR = 0x83888c;
const DEFAULT_BACKGROUND_COLOR = "#2B2F33"; // Must be in string
const DEFAULT_SEARCH_COLOR = 0xe1faf2;
const DEFAULT_PATH_COLOR = 0xff5454;
const DEFAULT_START_DOT_COLOR = 0x42f587;
const DEFAULT_END_DOT_COLOR = 0xfc2d49;

export const ColorContextProvider = ({ children }) => {
  const [backgroundColor, setBackgroundColor] = useState(
    DEFAULT_BACKGROUND_COLOR
  );
  const [mapColor, setMapColor] = useState(DEFAULT_MAP_COLOR);
  const [searchColor, setSearchColor] = useState(DEFAULT_SEARCH_COLOR);
  const [pathColor, setPathColor] = useState(DEFAULT_PATH_COLOR);
  const [startDotColor, setStartDotColor] = useState(DEFAULT_START_DOT_COLOR);
  const [endDotColor, setEndDotColor] = useState(DEFAULT_END_DOT_COLOR);

  const states = {
    backgroundColor,
    setBackgroundColor,
    mapColor,
    setMapColor,
    searchColor,
    setSearchColor,
    pathColor,
    setPathColor,
    startDotColor,
    setStartDotColor,
    endDotColor,
    setEndDotColor,
  };

  return (
    <ColorContext.Provider value={states}>{children}</ColorContext.Provider>
  );
};
