"use client";

import * as THREE from "three";
import CityMap from "./(components)/Map";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { CitySearch } from "./(components)/Search/Search";
import { NavBar } from "./(components)/Navbar/Navbar";

import Image from "next/image";

import backgroundImg from "@/public/background.jpg";
import { AlgorithmContextProvider } from "@/lib/context/algorithm.context";
import { ThreeContextProvider } from "@/lib/context/three.context";
import { AlgorithmController } from "./(components)/AlgorithmController";
import { ColorContextProvider } from "@/lib/context/color.context";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [mapIsReady, setMapIsReady] = useState(false);
  const [city, setCity] = useState("");

  return (
    <ThreeContextProvider>
      <AlgorithmContextProvider>
        <ColorContextProvider>
          {!mapIsReady && (
            <>
              <Image
                src={backgroundImg}
                alt="Background"
                quality={95}
                className="absolute h-screen w-screen -z-10 opacity-50"
              />
              <div className="h-screen w-screen items-center flex flex-col justify-center">
                <CitySearch setMapIsReady={setMapIsReady} setCity={setCity} />
              </div>
            </>
          )}
          {mapIsReady && (
            <div className="h-screen w-screen relative">
              <Canvas
                camera={{
                  position: [0, 0, 10],
                  near: 0.001,
                  far: 1000,
                  aspect: window.innerWidth / window.innerHeight,
                }}
                onCreated={({ gl }) => {
                  gl.setClearColor("#2B2F33"); // Scene background color
                  //gl.setClearColor("#b7cced"); // Scene background color
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
          )}
        </ColorContextProvider>
      </AlgorithmContextProvider>
    </ThreeContextProvider>
  );
}
