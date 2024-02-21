import React, { useState } from "react";
import { SketchPicker } from "react-color";

export const ColorItem = ({ color, desc }) => {
  const [selectedColor, setSelectedColor] = useState(null);

  return (
    <div
      className="flex items-center justify-center flex-col relative"
      onClick={() => setSelectedColor(color)}
      onBlur={() => setSelectedColor(null)}
      tabIndex={0}
    >
      <div
        className={`w-[2rem] h-[2rem] bg-${color} rounded-lg border border-neutral-600 hover:cursor-pointer`}
      />
      <p className="text-xs">{desc}</p>
      {selectedColor === color && (
        <div className="absolute top-10 left-6 z-50">
          <SketchPicker />
        </div>
      )}
    </div>
  );
};
