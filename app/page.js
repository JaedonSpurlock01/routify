"use client";

import * as THREE from "three";
import CityMap from "./(components)/city-map";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import parseLineData from "@/lib/parsing";

export default function Home() {
  const parsedLineData = useMemo(() => parseLineData(), []);

  return (
    <div className="h-screen w-screen ">
      <Canvas
        camera={{
          position: [parsedLineData.centerX, parseLineData.centerY, 180],
        }}
        onCreated={({ gl }) => gl.setClearColor("#242424")}
      >
        <CityMap parsedLineData={parsedLineData} />
        <OrbitControls
          enableDamping={false}
          enableRotate={true}
          enablePan={true}
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE,
          }}
        />
      </Canvas>
    </div>
  );
}
