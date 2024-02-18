import { IoIosSearch } from "react-icons/io";
import { RotatingLines } from "react-loader-spinner";
import React from "react";

export const SearchBox = ({
  onSubmit,
  enteredInput,
  setEnteredInput,
  loading,
}) => {
  return (
    <form onSubmit={onSubmit} className="relative">
      <input
        placeholder="Enter a city"
        value={enteredInput}
        onChange={(e) => setEnteredInput(e.target.value)}
        type="text"
        className="rounded-lg p-3 pl-5 pr-10 text-neutral-800 text-xs sm:text-sm focus:outline-none mb-4"
      />
      {!loading && (
        <a
          href="#"
          onClick={onSubmit}
          type="submit"
          className="absolute right-5 top-1/2 transform -translate-y-4 bg-white"
        >
          <IoIosSearch />
        </a>
      )}

      {loading && (
        <div className="absolute right-5 top-1/2 transform -translate-y-4 bg-white">
          <RotatingLines
            visible={true}
            height="18"
            width="18"
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
          />
        </div>
      )}
    </form>
  );
};
