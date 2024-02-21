import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { Dropdown } from "./dropdown";
import { StartButton } from "./StartButton";
import { SpeedSlider } from "./Slider";
import { GithubButton } from "./GithubButton";
import { Settings } from "../Settings/Settings";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="top-3 absolute w-screen flex justify-between">
      <div className="z-30">
        <button
          className={`rounded-full text-neutral-100 bg-neutral-800 text-2xl p-2 ml-6 -mr-6 w-10 h-10 ${
            isOpen ? "" : "hover:shadow-lg hover:shadow-neutral-800"
          } transition-all absolute z-10`}
        >
          <IoMdSettings onClick={() => setIsOpen(!isOpen)} />
        </button>
        {isOpen && <Settings />}
      </div>

      <div className="flex space-x-8">
        <Dropdown />
        <StartButton />
        <SpeedSlider />
      </div>

      <GithubButton />
    </div>
  );
};
