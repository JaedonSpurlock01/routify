import React from "react";
import { Display } from "./Display";
import { Keybinds } from "./Keybinds";
import { About } from "./About";
import { LeaveCityButton } from "./LeaveCityButton";

export const Settings = () => {
  return (
    <div
      className="md:w-[15rem] lg:w-[23rem] bg-neutral-800 rounded-xl text-left p-4 space-y-4
            absolute md:left-6 pt-[3rem] text-neutral-100 text-xl transition-all origin-top-left"
      style={{ animation: "openFromTopLeft 0.2s ease-in-out" }}
    >
      <Display />
      <Keybinds />
      <About />
      <LeaveCityButton />
    </div>
  );
};
