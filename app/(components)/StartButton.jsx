import {
  AlgorithmContext,
  stopAlgorithm,
} from "@/lib/context/algorithm.context";
import React, { useContext, useState } from "react";

import { IoMdPlay } from "react-icons/io";
import { IoStop } from "react-icons/io5";

export const StartButton = () => {
  const {
    startNode,
    endNode,
    isStopped,
    setIsStopped,
    setIsAlgorithmReady,
  } = useContext(AlgorithmContext);

  const [isClickProcessing, setIsClickProcessing] = useState(false);

  const handleButtonToggle = () => {
    if (isClickProcessing) return;

    setIsClickProcessing(true);

    if (!startNode || !endNode) {
      console.log("Please put a start and end point to start the algorithm");
    } else if (!isStopped) {
      setIsStopped(true);
      setIsAlgorithmReady(false);
    } else {
      setIsStopped(false);
      setIsAlgorithmReady(true);
    }

    setIsClickProcessing(false);
  };

  return (
    <>
      {isStopped ? (
        <button
          onClick={handleButtonToggle}
          className="rounded-full bg-[#46b780] p-4 text-2xl text-neutral-100 w-14 h-14 hover:shadow-lg hover:shadow-neutral-800 transition-all"
        >
          <IoMdPlay className="ml-[0.2rem]" />
        </button>
      ) : (
        <button
          onClick={handleButtonToggle}
          className="rounded-full bg-[#ff4252] p-4 text-2xl text-neutral-100 w-14 h-14 hover:shadow-lg hover:shadow-neutral-800 transition-all"
        >
          <IoStop className="text-white" />
        </button>
      )}
    </>
  );
};
