"use client";

import * as THREE from "three";
import CityMap from "./(components)/Map";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { CitySearch } from "./(components)/Search";
import { NavBar } from "./(components)/Navbar";

import Image from "next/image";

import backgroundImg from "@/public/background.jpg";
import { AlgorithmContextProvider } from "@/lib/context/algorithm.context";
import { ThreeContextProvider } from "@/lib/context/three.context";
import { AlgorithmController } from "./(components)/AlgorithmController";

export default function Home() {
  const [mapIsReady, setMapIsReady] = useState(false);

  return (
    <ThreeContextProvider>
      <AlgorithmContextProvider>
        {!mapIsReady && (
          <>
            <Image
              src={backgroundImg}
              alt="Background"
              quality={95}
              className="absolute h-screen w-screen -z-10 opacity-50"
            />
            <div className="h-screen w-screen items-center flex flex-col justify-center">
              <CitySearch setMapIsReady={setMapIsReady} />
            </div>
          </>
        )}
        {mapIsReady && (
          <div className="h-screen w-screen relative">
            <Canvas
              camera={{
                position: [0, 0, 0.1],
                near: 0.001,
                far: 1000,
                aspect: window.innerWidth / window.innerHeight,
              }}
              onCreated={({ gl }) => {
                gl.setClearColor("#2B2F33"); // Scene background color
              }}
            >
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
            <AlgorithmController />
          </div>
        )}
      </AlgorithmContextProvider>
    </ThreeContextProvider>
  );
}
