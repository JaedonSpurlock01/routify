import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { FaSquareGithub } from "react-icons/fa6";
import { Dropdown } from "./Dropdown";
import { StartButton } from "./StartButton";
import { SpeedSlider } from "./Slider";
import { SketchPicker } from "react-color";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Switch } from "@mui/material";

export const NavBar = () => {
  const [settingsOn, setSettingsOn] = useState(false);

  return (
    <div className="top-3 absolute w-screen flex justify-between">
      <div>
        <button
          className={`rounded-full text-neutral-100 bg-neutral-800 text-2xl p-2 ml-6 -mr-6 w-10 h-10 ${
            settingsOn ? "" : "hover:shadow-lg hover:shadow-neutral-800"
          } transition-all absolute z-10`}
        >
          <IoMdSettings onClick={() => setSettingsOn(!settingsOn)} />
        </button>
        {settingsOn && (
          <div className="md:h-[25rem] md:w-[15rem] lg:w-[25rem] lg:h-[30rem] bg-neutral-800 rounded-xl text-left p-4 space-y-4 absolute left-5 pt-[3rem] text-neutral-100 text-xl">
            <div>
              <p>Display</p>
              <div className="text-base flex flex-row items-center">
                <p className="text-neutral-300">Colors</p>
                <div className="flex flex-row space-x-3 ml-auto">
                  <div className="flex items-center justify-center flex-col">
                    <div className="w-[2rem] h-[2rem] bg-slate-800 rounded-lg border border-neutral-600" />
                    <p className="text-xs">Background</p>
                  </div>
                  <div className="flex items-center justify-center flex-col">
                    <div className="w-[2rem] h-[2rem] bg-slate-500 rounded-lg border border-neutral-600" />
                    <p className="text-xs">Map</p>
                  </div>
                  <div className="flex items-center justify-center flex-col">
                    <div className="w-[2rem] h-[2rem] bg-cyan-500 rounded-lg border border-neutral-600" />
                    <p className="text-xs">Search</p>
                  </div>
                  <div className="flex items-center justify-center flex-col">
                    <div className="w-[2rem] h-[2rem] bg-rose-500 rounded-lg border border-neutral-600" />
                    <p className="text-xs">Path</p>
                  </div>
                </div>
              </div>
              <div className="text-base flex flex-row mt-3 -mb-2">
                <p className="text-neutral-300">Bloom</p>
                <span className="ml-auto">
                  <Switch />
                </span>
              </div>
            </div>
            <div>
              Keybinds
              <div className="text-lg flex flex-row flex-wrap items-center justify-center space-x-4 text-neutral-300">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-lg">B</p>
                  <p className="text-sm">Toggle Bloom</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-lg">C</p>
                  <p className="text-sm">Reset Map</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-lg">WASD</p>
                  <p className="text-sm">Move Camera</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-lg">Space</p>
                  <p className="text-sm">Start Search</p>
                </div>
              </div>
            </div>
            <div>
              About{" "}
              <div className="text-xs text-neutral-300">
                Routify is a website developed by{" "}
                <a
                  href="https://github.com/JaedonSpurlock01"
                  target="_blank"
                  className="text-rose-500 hover:underline"
                >
                  @JaedonSpurlock01
                </a>
                . It downloads roads from{" "}
                <a
                  href="https://www.openstreetmap.org/about/"
                  target="_blank"
                  className="text-rose-500 hover:underline"
                >
                  OpenStreetMap
                </a>{" "}
                and renders them with ThreeJS.
                <br />
                <br />
                To start pathfinding, double click on the map to place start and
                end points. Afterwards, press the green button to start finding
                a path.
                <br />
                <br />
                If you like this project, feel free to check out the{" "}
                <a
                  href="https://github.com/JaedonSpurlock01/routify"
                  target="_blank"
                  className="text-rose-500 hover:underline"
                >
                  source code
                </a>
                !
              </div>
            </div>
            <div className="flex flex-row items-center">
              <IoIosArrowRoundBack className="text-2xl" />
              <a
                className="text-sm text-neutral-100 font-semibold hover:underline"
                href="."
              >
                Try Another City
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-8">
        <Dropdown />
        <StartButton />
        <SpeedSlider />
      </div>

      <a href="https://github.com/JaedonSpurlock01/routify" target="_blank">
        <button className="rounded-full mr-6 -ml-6 w-10 h-10 hover:shadow-lg hover:shadow-neutral-800 transition-all pr-[0.03rem]">
          <div className="text-neutral-800 rounded-full w-[2.2rem] h-[2.15rem] bg-neutral-100 text-[4rem] flex items-center justify-center">
            <FaSquareGithub />
          </div>
        </button>
      </a>
    </div>
  );
};
