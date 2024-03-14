import React, { createContext, useMemo, useState } from "react";
import { Graph } from "../models/graph";

export const AlgorithmContext = createContext();

export const listAlgorithms = [
  "Breadth-First Search",
  "A* Search",
  "Greedy-Best-First Search",
  "Depth-First Search",
  "Dijkstra's Search",
  "Bidirectional Search",
];

export const AlgorithmContextProvider = ({ children }) => {
  const [isAlgorithmReady, setIsAlgorithmReady] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [boundingBox, setBoundingBox] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("A* Search");

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
    selectedAlgorithm,
    setSelectedAlgorithm,
  };

  return (
    <AlgorithmContext.Provider value={states}>
      {children}
    </AlgorithmContext.Provider>
  );
};
