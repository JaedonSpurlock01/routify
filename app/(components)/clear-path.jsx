import { AlgorithmContext, stopAlgorithm } from "@/lib/context/algorithm.context";
import React, { useContext } from "react";

export const ClearPathButton = () => {
  const { setClearAll } = useContext(AlgorithmContext);

  return (
    <button
      onClick={() => {
        setClearAll(true);
        stopAlgorithm(true);
      }}
      className="bg-neutral-800 p-2 text-[11px] text-neutral-100 w-[10rem] h-9 hover:shadow-lg hover:shadow-neutral-800 transition-all rounded-md font-medium select-none"
    >
      CLEAR PATH
    </button>
  );
};
