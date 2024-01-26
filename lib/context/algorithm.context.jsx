import React, { createContext } from "react";

const AlgorithmContext = createContext();

export const AlgorithmContextProvider = ({ children }) => {
  [currentAlgorithm, setCurrentAlgorithm] = useState("");
  [isPaused, setIsPaused] = useState(false);
  [isStopped, setIsStopped] = useState(true);

  return <AlgorithmContext.Provider>{children}</AlgorithmContext.Provider>;
};
