import React from "react";
import { IoMdSettings, IoIosInformation } from "react-icons/io";
import { Dropdown } from "./dropdown";
import { StartButton } from "./start-button";

export const NavBar = () => {
  return (
    <div className="top-3 absolute w-screen flex justify-between">
      <button className="rounded-full text-neutral-100 bg-neutral-800 text-2xl p-2 ml-6 -mr-6 w-10 h-10 hover:shadow-lg hover:shadow-neutral-800 transition-all">
        <IoMdSettings />
      </button>

      <div className="flex space-x-8">
        <Dropdown />
        <StartButton />
        <button className="bg-neutral-800 p-2 text-[11px] text-neutral-100 w-[10rem] h-9 hover:shadow-lg hover:shadow-neutral-800 transition-all rounded-md font-medium select-none">
          CLEAR PATH
        </button>
      </div>

      <button className="rounded-full text-neutral-100 bg-neutral-800 pl-[0.1rem] text-4xl mr-6 -ml-6 w-10 h-10 hover:shadow-lg hover:shadow-neutral-800 transition-all">
        <IoIosInformation />
      </button>
    </div>
  );
};
