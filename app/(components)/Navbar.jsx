import React from "react";
import { IoMdSettings } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { Dropdown } from "./Dropdown";
import { StartButton } from "./StartButton";
import { SpeedSlider } from "./Slider";

export const NavBar = () => {
  return (
    <div className="top-3 absolute w-screen flex justify-between">
      <button className="rounded-full text-neutral-100 bg-neutral-800 text-2xl p-2 ml-6 -mr-6 w-10 h-10 hover:shadow-lg hover:shadow-neutral-800 transition-all">
        <IoMdSettings />
      </button>

      <div className="flex space-x-8">
        <Dropdown />
        <StartButton />
        <SpeedSlider />
      </div>

      <a href="https://github.com/JaedonSpurlock01/routify" target="_blank">
        <button className="rounded-full mr-6 -ml-6 w-10 h-10 hover:shadow-lg hover:shadow-neutral-800 transition-all pr-[0.03rem]">
          <div className="text-neutral-800 rounded-full w-[2.3rem] h-[2.3rem] bg-neutral-100 text-[4rem] flex items-center justify-center">
            <FaGithub />
          </div>
        </button>
      </a>
    </div>
  );
};
