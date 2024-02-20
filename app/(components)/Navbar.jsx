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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

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
        {isOpen && (
          <div
            className="md:w-[15rem] lg:w-[23rem] bg-neutral-800 rounded-xl text-left p-4 space-y-4
            absolute md:left-6 pt-[3rem] text-neutral-100 text-xl transition-all origin-top-left"
            style={{ animation: "openFromTopLeft 0.2s ease-in-out" }}
          >
            <div>
              <p>Display</p>
              <div className="text-base flex flex-row items-center flex-wrap">
                <p className="text-neutral-300">Colors</p>
                <div className="flex flex-row space-x-3 ml-auto">
                  {[
                    { color: "slate-800", label: "Background" },
                    { color: "slate-500", label: "Map" },
                    { color: "cyan-500", label: "Search" },
                    { color: "rose-500", label: "Path" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center flex-col relative"
                      onClick={() => handleColorClick(item.color)}
                      onBlur={() => setSelectedColor(null)}
                      tabIndex={0}
                    >
                      <div
                        className={`w-[2rem] h-[2rem] bg-${item.color} rounded-lg border border-neutral-600 hover:cursor-pointer`}
                      />
                      <p className="text-xs">{item.label}</p>
                      {selectedColor === item.color && (
                        <div className="absolute top-10 left-6 z-50">
                          <SketchPicker />
                        </div>
                      )}
                    </div>
                  ))}
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
                {[
                  { key: "B", desc: "Toggle Bloom" },
                  { key: "C", desc: "Reset Map" },
                  { key: "WASD", desc: "Move Camera" },
                  { key: "Space", desc: "Start Search" },
                ].map((keybind, index) => (
                  <div
                    className="flex flex-col items-center justify-center"
                    key={index}
                  >
                    <p>{keybind.key}</p>
                    <p className="text-xs">{keybind.desc}</p>
                  </div>
                ))}
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
