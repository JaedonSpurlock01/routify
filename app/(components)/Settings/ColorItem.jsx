import React, { useRef, useState, useEffect } from "react";
import { SketchPicker } from "react-color";

export const ColorItem = ({ color, desc, setFocus, initialColor }) => {
  const [display, setDisplay] = useState(false);
  const colorPickerRef = useRef(null);

  const changeColor = (color, event) => {
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

  return (
    <div className="flex items-center justify-center flex-col relative">
      <div
        className={`w-[2rem] h-[2rem] bg-[${color}] rounded-sm border border-neutral-600 hover:cursor-pointer`}
        onClick={() => setDisplay(!display)}
      />
      <p className="text-xs">{desc}</p>
      {display ? (
        <div className="absolute top-10 left-6 z-50" ref={colorPickerRef}>
          <SketchPicker onChange={changeColor} color={initialColor} />
        </div>
      ) : null}
    </div>
  );
};
