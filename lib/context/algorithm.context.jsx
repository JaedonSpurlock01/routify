import React, { createContext, useMemo, useState } from "react";
import { Graph } from "../models/Graph";

export const AlgorithmContext = createContext();

export const AlgorithmContextProvider = ({ children }) => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState("");
  const [isAlgorithmReady, setIsAlgorithmReady] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [clearAll, setClearAll] = useState(false);
  const [speed, setSpeed] = useState(200);

  const cityGraph = useMemo(() => new Graph(), []);

  const states = {
    currentAlgorithm,
    setCurrentAlgorithm,
    isAlgorithmReady,
    setIsAlgorithmReady,
    startNode,
    setStartNode,
    endNode,
    setEndNode,
    cityGraph,
    clearAll,
    setClearAll,
    setIsStopped,
    isStopped,
    speed,
    setSpeed
  };

  return (
    <AlgorithmContext.Provider value={states}>
      {children}
    </AlgorithmContext.Provider>
  );
};
