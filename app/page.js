"use client";

import * as THREE from "three";
import CityMap from "./(components)/city-map";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { CitySearch } from "./(components)/city-search";
import { NavBar } from "./(components)/nav-bar";

export default function Home() {
  const [mapIsReady, setMapIsReady] = useState(false);
  const [parsedLineData, setParsedLineData] = useState([]);

  return (
    <>
      {!mapIsReady && (
        <div className="h-screen w-screen items-center flex flex-col justify-center">
          <CitySearch
            setMapIsReady={setMapIsReady}
            setParsedLineData={setParsedLineData}
          />
        </div>
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
              gl.setClearColor("#2B2F33");
            }}
          >
            <CityMap parsedLineData={parsedLineData} />
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
        </div>
      )}
    </>
  );
}
