import React from "react";
import * as THREE from "three";

export const Dot = ({ position, color }) => {
  return (
    <mesh position={position}>
      <sphereBufferGeometry args={[0.05, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
