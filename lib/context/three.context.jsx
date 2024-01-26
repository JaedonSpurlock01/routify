import React, { createContext, useState, useRef, useMemo } from "react";

export const ThreeContext = createContext();

export const ThreeContextProvider = ({ children }) => {
  // ThreeJS scene objects (custom)
  const baseLayerSceneRef = useRef();
  const topLayerSceneRef = useRef();
  const lineMeshRef = useRef();
  const glowingLineMeshRef = useRef();

  // Data needed to make everything run properly
  const [parsedLineData, setParsedLineData] = useState([]);

  const states = {
    lineMeshRef,
    glowingLineMeshRef,
    baseLayerSceneRef,
    topLayerSceneRef,
    parsedLineData,
    setParsedLineData,
  };

  return (
    <ThreeContext.Provider value={states}>{children}</ThreeContext.Provider>
  );
};
