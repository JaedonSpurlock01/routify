import React, { useState } from "react";

import { IoMdPlay, IoIosPause } from "react-icons/io";

export const StartButton = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleButtonToggle = () => {
    console.log("SENDING EVENT EMIT");
  };

  return (
    <>
      {!isToggled ? (
        <button
          onClick={() => {
            setIsToggled(true);
            handleButtonToggle();
          }}
          className="rounded-full bg-[#46b780] p-4 text-2xl text-neutral-100 w-14 h-14 hover:shadow-lg hover:shadow-neutral-800 transition-all"
        >
          <IoMdPlay className="ml-[0.2rem]" />
        </button>
      ) : (
        <button
          onClick={() => {
            setIsToggled(false);
            handleButtonToggle();
          }}
          className="rounded-full bg-[#525252] p-4 text-2xl text-neutral-100 w-14 h-14 hover:shadow-lg hover:shadow-neutral-800 transition-all"
        >
          <IoIosPause />
        </button>
      )}
    </>
  );
};
