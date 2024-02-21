import React from "react";
import { FaSquareGithub } from "react-icons/fa6";

export const GithubButton = () => {
  return (
    <a href="https://github.com/JaedonSpurlock01/routify" target="_blank">
      <button className="rounded-full mr-6 -ml-6 w-10 h-10 hover:shadow-lg hover:shadow-neutral-800 transition-all pr-[0.03rem]">
        <div className="text-neutral-800 rounded-full w-[2.2rem] h-[2.15rem] bg-neutral-100 text-[4rem] flex items-center justify-center">
          <FaSquareGithub />
        </div>
      </button>
    </a>
  );
};
