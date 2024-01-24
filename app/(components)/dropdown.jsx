import React, { useState } from "react";

import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";

const listAlgorithms = [
  "Breadth-First Search",
  "Depth-First Search",
  "Dijkstra's",
  "A* Search",
  "Bidirectional Search",
];

export const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Breadth-First Search");

  return (
    <div>
      <button
        onClick={() => {
          isOpen ? setIsOpen(false) : setIsOpen(true);
        }}
        className="relative bg-neutral-800 p-2 w-[10rem] h-9 hover:shadow-lg
      hover:shadow-neutral-800 transition-all rounded-md font-medium select-none flex flex-col items-center"
      >
        <span className="text-[8px] text-neutral-400 absolute top-[3px] left-[0.5rem]">
          Algorithm
        </span>
        <div className="flex flex-row justify-between w-full mt-1.5 overflow-hidden text-xs text-neutral-100">
          {selectedOption}
          {!isOpen ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
        </div>
      </button>

      {isOpen ? (
        <div className="flex flex-col bg-neutral-800 rounded-md mt-1 py-2 select-none">
          {listAlgorithms.map((algorithm, index) => (
            <button
              onClick={() => {
                setSelectedOption(algorithm);
                setIsOpen(false);
              }}
              key={index}
              className="text-neutral-100 text-xs p-1 font-light hover:bg-neutral-700 w-full text-left pl-2"
            >
              {algorithm}
            </button>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
