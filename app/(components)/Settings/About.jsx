import React from "react";

export const About = () => {
  return (
    <div>
      About{" "}
      <div className="text-xs text-neutral-300">
        Routify is a website developed by{" "}
        <a
          href="https://github.com/JaedonSpurlock01"
          target="_blank"
          className="text-rose-500 hover:underline"
        >
          @JaedonSpurlock01
        </a>
        . It downloads roads from{" "}
        <a
          href="https://www.openstreetmap.org/about/"
          target="_blank"
          className="text-rose-500 hover:underline"
        >
          OpenStreetMap
        </a>{" "}
        and renders them with ThreeJS.
        <br />
        <br />
        To start pathfinding, double click on the map to place start and end
        points. Afterwards, press the green button to start finding a path.
        <br />
        <br />
        If you like this project, feel free to check out the{" "}
        <a
          href="https://github.com/JaedonSpurlock01/routify"
          target="_blank"
          className="text-rose-500 hover:underline"
        >
          source code
        </a>
        !
      </div>
    </div>
  );
};
