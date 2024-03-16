import * as THREE from "three";

import { Canvas } from "@react-three/fiber";
import React, { useContext } from "react";
import CityMap from "./Map";
import { OrbitControls } from "@react-three/drei";
import { NavBar } from "../Navbar/Navbar";
import { AlgorithmController } from "./AlgorithmController";
import { Toaster } from "react-hot-toast";
import { ColorContext } from "@/lib/context/color.context";

export const Routify = ({ city }) => {
  const { backgroundColor } = useContext(ColorContext);

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <Canvas
        camera={{
          position: [0, 0, 10],
          near: 0.001,
          far: 1000,
        }}
      >
        <color attach="background" args={[backgroundColor]} />
        <CityMap />
        <OrbitControls
          enableDamping={true}
          enableRotate={false}
          enablePan={true}
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE,
          }}
        />
      </Canvas>
      <NavBar />
      <div className="absolute bottom-6 right-6 text-neutral-100 flex-col flex text-right">
        <h1 className="mb-1 text-2xl">{city}</h1>
        <a
          href="https://www.openstreetmap.org/about/"
          target="_blank"
          className="hover:underline"
        >
          <p className="text-xs font-light">data @ OpenStreetMap</p>
        </a>
      </div>
      <AlgorithmController />
      <Toaster position="bottom-left" />
    </div>
  );
};
