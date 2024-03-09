import React, { createContext, useState, useRef, useMemo } from "react";

export const ThreeContext = createContext();

export const ThreeContextProvider = ({ children }) => {
  // ThreeJS scene objects (custom)
  const topLayerSceneRef = useRef();
  const lineMeshRef = useRef();

  // Data needed to make everything run properly
  const [parsedLineData, setParsedLineData] = useState({});

  const states = {
    lineMeshRef,
    topLayerSceneRef,
    parsedLineData,
    setParsedLineData,
  };

  return (
    <ThreeContext.Provider value={states}>{children}</ThreeContext.Provider>
  );
};
