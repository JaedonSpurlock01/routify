import React from "react";
import * as THREE from "three";

export const Dot = ({ position, color }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.0006, 32, 32]} />
      <meshStandardMaterial color={0xa3a3a3} />
    </mesh>
  );
};
