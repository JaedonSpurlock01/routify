import React, { createContext, useMemo, useState } from "react";
import { Graph } from "../graph";

export const AlgorithmContext = createContext();

export const AlgorithmContextProvider = ({ children }) => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState("");
  const [isAlgorithmReady, setIsAlgorithmReady] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);

  const cityGraph = useMemo(() => new Graph(), []);

  const states = {
    currentAlgorithm,
    setCurrentAlgorithm,
    isAlgorithmReady,
    setIsAlgorithmReady,
    isPaused,
    setIsPaused,
    isStopped,
    setIsStopped,
    startNode,
    setStartNode,
    endNode,
    setEndNode,
    isStarting,
    setIsStarting,
    cityGraph,
  };

  return (
    <AlgorithmContext.Provider value={states}>
      {children}
    </AlgorithmContext.Provider>
  );
};
