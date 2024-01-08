import React from "react";
import { IoMdSettings } from "react-icons/io";
import { IoMdPlay } from "react-icons/io";

export const NavBar = () => {
  return (
    <div className="top-3 absolute w-screen flex justify-between items-center">
      <button className="rounded-full text-neutral-100 bg-neutral-800 text-2xl p-2 ml-6 -mr-6">
        <IoMdSettings />
      </button>

      <button className="rounded-full bg-[#46b780] p-4 text-2xl text-neutral-100 w-16 h-16">
        <IoMdPlay className="ml-[0.4rem]" />
      </button>

      <div></div>
    </div>
  );
};
