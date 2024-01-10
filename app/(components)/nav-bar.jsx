import React from "react";
import { IoMdSettings } from "react-icons/io";
import { IoMdPlay } from "react-icons/io";
import { IoIosInformation } from "react-icons/io";

export const NavBar = () => {
  return (
    <div className="top-3 absolute w-screen flex justify-between items-center">
      <button className="rounded-full text-neutral-100 bg-neutral-800 text-2xl p-2 ml-6 -mr-6 w-10 h-10 hover:shadow-lg hover:shadow-neutral-800 transition-all">
        <IoMdSettings />
      </button>

      <div className="flex space-x-3 items-center">
        <div className="w-[8rem] h-9" /> {/* Empty div to center start button */}

        <button className="rounded-full bg-[#46b780] p-4 text-2xl text-neutral-100 w-16 h-16 hover:shadow-lg hover:shadow-neutral-800 transition-all">
          <IoMdPlay className="ml-[0.4rem]" />
        </button>

        <button className="bg-[#565e70] p-2 text-xs text-neutral-100 w-[8rem] h-9 hover:shadow-lg hover:shadow-neutral-800 transition-all rounded-md font-medium">
          CLEAR PATH
        </button>
      </div>

      <button className="rounded-full text-neutral-100 bg-neutral-800 pl-[0.1rem] text-4xl mr-6 -ml-6 w-10 h-10 hover:shadow-lg hover:shadow-neutral-800 transition-all">
        <IoIosInformation />
      </button>
    </div>
  );
};
