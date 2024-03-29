import React from "react";
import { KeybindLabel } from "./KeybindLabel";

export const Keybinds = () => {
  return (
    <div>
      Keybinds
      <div className="text-lg flex flex-row flex-wrap items-center justify-center space-x-4 text-neutral-300">
        {[
          { key: "B", desc: "Toggle Bloom" },
          { key: "C", desc: "Reset Map" },
          { key: "D", desc: "Clear Points" },
          { key: "Space", desc: "Start Search" },
        ].map((keybind, index) => (
          <KeybindLabel key={index} keybind={keybind.key} desc={keybind.desc} />
        ))}
      </div>
    </div>
  );
};
