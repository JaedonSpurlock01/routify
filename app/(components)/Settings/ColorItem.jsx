import React, { useRef, useState, useEffect } from "react";
import { SketchPicker } from "react-color";

export const ColorItem = ({ desc, setFocus, initialColor }) => {
  const [display, setDisplay] = useState(false);
  const colorPickerRef = useRef(null);
  const [currentColor, setCurrentColor] = useState(initialColor);

  const changeColor = (color, event) => {
    setCurrentColor(color.hex);
    setFocus({ desc, color: color.hex });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setDisplay(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // For some reason, the state gets lost when changing colors, so we are directly changing it
    // instead of relying on the div to automatically change
    document.getElementById(desc).style.backgroundColor = currentColor;
  }, [currentColor, desc]);

  return (
    <div className="flex items-center justify-center flex-col relative">
      <div
        id={desc} // add an id to the div
        className={`w-[2rem] h-[2rem] rounded-sm border border-neutral-600 hover:cursor-pointer`}
        style={{ backgroundColor: `#${currentColor}` }}
        onClick={() => setDisplay(!display)}
      />
      <p className="text-xs">{desc}</p>
      {display ? (
        <div className="absolute top-10 left-6 z-50" ref={colorPickerRef}>
          <SketchPicker onChange={changeColor} color={currentColor} />
        </div>
      ) : null}
    </div>
  );
};
