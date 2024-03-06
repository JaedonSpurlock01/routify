import { AlgorithmContext } from "@/lib/context/algorithm.context";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";

import { IoMdPlay } from "react-icons/io";
import { IoStop } from "react-icons/io5";

export const StartButton = () => {
  const { startNode, endNode, isStopped, setIsStopped, setIsAlgorithmReady } =
    useContext(AlgorithmContext);

  const [isClickProcessing, setIsClickProcessing] = useState(false);

  const handleButtonToggle = () => {
    if (isClickProcessing) return;

    setIsClickProcessing(true);

    if (!startNode) {
      toast("Double click on the map to select your starting point", {
        style: {
          background: "#262626",
          color: "#fff",
        },
        duration: 5000,
        icon: "🛈",
      });
    } else if (!endNode) {
      toast("Double click on the map to select your ending point", {
        style: {
          background: "#262626",
          color: "#fff",
        },
        duration: 5000,
        icon: "🛈",
      });
    } else if (!isStopped) {
      setIsStopped(true);
      setIsAlgorithmReady(false);
    } else {
      toast("Finding a path", {
        style: {
          background: "#262626",
          color: "#fff",
        },
        duration: 5000,
        icon: "🛈",
      });
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
