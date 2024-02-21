import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

export const LeaveCityButton = () => {
  return (
    <div className="flex flex-row items-center">
      <IoIosArrowRoundBack className="text-2xl" />
      <a
        className="text-sm text-neutral-100 font-semibold hover:underline"
        href="."
      >
        Try Another City
      </a>
    </div>
  );
};
