"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// Temp object for color setting and position settings
const tempColor = new THREE.Color();
const tempObject = new THREE.Object3D();

// Define segment and arrow props
const lineWidth = 1;

// Define line geometry
const lineBaseSeg = new THREE.Shape();
lineBaseSeg.moveTo(0, 0.5);
lineBaseSeg.lineTo(1, 0.5);
lineBaseSeg.lineTo(1, -0.5);
lineBaseSeg.lineTo(0, -0.5);
lineBaseSeg.lineTo(0, 0.5);

const CityMap = ({ parsedLineData }) => {
  // Define ref to update the triangles and the lines
  const lineMeshRef = useRef();
  const totalLines = parsedLineData.lineArray.length;

  // Generate segment properties
  const segmentsProps = useMemo(
    () =>
      parsedLineData.lineArray.map(({ start, end }) => ({
        coords: [start, end],
        color: tempColor.setHex(0xffffff).clone(),
        computedData: {
          length: undefined,
          dx: undefined,
          dy: undefined,
          angle: undefined,
        },
      })),
    [parsedLineData]
  );

  useLayoutEffect(() => {
    // Return if the ref is not ready
    if (lineMeshRef === null) return;
    if (lineMeshRef.current === null) return;

    // Simplify syntax for the ref
    const lineMesh = lineMeshRef.current;

    // Modify every segment in list of lines
    for (let i = 0; i < totalLines; i++) {
      const segment = segmentsProps[i];
      const color = segment.color;
      const coords = segment.coords;
      const computedData = segment.computedData;

      if (
        computedData.dx === undefined ||
        computedData.y === undefined ||
        computedData.angle === undefined
      ) {
        const startVector = new THREE.Vector3(coords[0][0], coords[0][1], 0);
        const endVector = new THREE.Vector3(coords[1][0], coords[1][1], 0);
        const length = endVector.distanceTo(startVector);
        const dx = coords[1][0] - coords[0][0];
        const dy = coords[1][1] - coords[0][1];

        computedData.dx = dx;
        computedData.dy = dy;
        computedData.length = length;

        const angle = Math.atan2(dy, dx);

        computedData.angle = angle;
      }

      // set line position
      tempObject.position.set(coords[0][0], coords[0][1], 0);
      tempObject.rotation.set(0, 0, computedData.angle ?? 0);
      tempObject.scale.set(
        computedData.length ? computedData.length : 1,
        lineWidth,
        1
      );

      tempObject.updateMatrix();
      lineMesh.setMatrixAt(i, tempObject.matrix);
      lineMesh.setColorAt(i, color);
    }

    // Launch updates
    lineMesh.instanceMatrix.needsUpdate = true;
    lineMesh.instanceColor.needsUpdate = true;
    lineMesh.material.needsUpdate = true;
  }, [segmentsProps, totalLines]);

  return (
    <instancedMesh ref={lineMeshRef} args={[null, null, totalLines]}>
      <shapeGeometry args={[lineBaseSeg]} />
      <meshBasicMaterial attach="material" side={THREE.DoubleSide} />
    </instancedMesh>
  );
};

export default CityMap;
