import React, { createContext, useMemo, useState } from "react";
import { Graph } from "../models/Graph";

export const AlgorithmContext = createContext();

export const AlgorithmContextProvider = ({ children }) => {
  const [isAlgorithmReady, setIsAlgorithmReady] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [boundingBox, setBoundingBox] = useState([]);

  const cityGraph = useMemo(() => new Graph(), []);

  const states = {
    isAlgorithmReady,
    setIsAlgorithmReady,
    startNode,
    setStartNode,
    endNode,
    setEndNode,
    cityGraph,
    setIsStopped,
    isStopped,
    boundingBox,
    setBoundingBox,
  };

  return (
    <AlgorithmContext.Provider value={states}>
      {children}
    </AlgorithmContext.Provider>
  );
};
