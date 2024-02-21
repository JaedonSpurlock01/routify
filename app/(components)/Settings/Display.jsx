import React from "react";
import { ColorItem } from "./ColorItem";
import { Switch } from "@mui/material";

export const Display = () => {
  return (
    <div>
      <p>Display</p>
      <div className="text-base flex flex-row items-center flex-wrap">
        <p className="text-neutral-300">Colors</p>
        <div className="flex flex-row space-x-3 ml-auto">
          {[
            { color: "slate-800", desc: "Background" },
            { color: "slate-500", desc: "Map" },
            { color: "cyan-500", desc: "Search" },
            { color: "rose-500", desc: "Path" },
          ].map((item) => (
            <ColorItem color={item.color} desc={item.desc} />
          ))}
        </div>
      </div>
      <div className="text-base flex flex-row mt-3 -mb-2">
        <p className="text-neutral-300">Bloom</p>
        <span className="ml-auto">
          <Switch />
        </span>
      </div>
    </div>
  );
};
