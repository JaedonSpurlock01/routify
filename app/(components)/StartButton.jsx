import {
  AlgorithmContext,
  stopAlgorithm,
} from "@/lib/context/algorithm.context";
import React, { useContext } from "react";

import { IoMdPlay, IoIosPause } from "react-icons/io";

export const StartButton = () => {
  const {
    startNode,
    endNode,
    setIsPaused,
    isPaused,
    isStopped,
    setIsStopped,
    isStarting,
    setIsStarting,
    isAlgorithmReady,
    setIsAlgorithmReady,
  } = useContext(AlgorithmContext);

  const handleButtonToggle = () => {
    // Guard clause for missing start or end points
    if (!startNode || !endNode) {
      console.log("Please put a start and end point to start the algorithm");
      return;
    }

    // Algorithm is ready to start
    if (!isStarting && !isPaused && !isAlgorithmReady && isStopped) {
      setIsAlgorithmReady(true);
      setIsPaused(false);
      setIsStarting(true);
      setIsStopped(false);
      stopAlgorithm(false);
      return;
    }

    // Toggle between paused and starting
    if (isStarting !== isPaused) {
      setIsPaused(!isPaused);
      setIsStarting(!isStarting);
      stopAlgorithm(true);
      return;
    }

    // If none of the above conditions are met, log an error
    console.log("Something went wrong here...?");
  };

  return (
    <>
      {!isStarting ? (
        <button
          onClick={handleButtonToggle}
          className="rounded-full bg-[#46b780] p-4 text-2xl text-neutral-100 w-14 h-14 hover:shadow-lg hover:shadow-neutral-800 transition-all"
        >
          <IoMdPlay className="ml-[0.2rem]" />
        </button>
      ) : (
        <button
          onClick={handleButtonToggle}
          className="rounded-full bg-[#525252] p-4 text-2xl text-neutral-100 w-14 h-14 hover:shadow-lg hover:shadow-neutral-800 transition-all"
        >
          <IoIosPause />
        </button>
      )}
    </>
  );
};
