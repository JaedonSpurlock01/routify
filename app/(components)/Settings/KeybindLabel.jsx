import React from "react";

export const KeybindLabel = ({ keybind, desc }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p>{keybind}</p>
      <p className="text-xs">{desc}</p>
    </div>
  );
};
