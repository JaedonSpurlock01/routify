"use client";

import { Graph } from "@/lib/graph";
import { useLayoutEffect, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

// Bloom effect imports
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { BlurPass, Resizer, KernelSize, Resolution } from "postprocessing";

// Temp object for color setting and position settings
const tempColor = new THREE.Color();
const tempObject = new THREE.Object3D();

// Define line width
const lineWidth = 0.0001;

// Pathfinding color
const selectedColor = tempColor.setHex(0xffec3d).clone();

// City Line Color
const lineColor = 0x83888c;

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
  const glowingLineMeshRef = useRef();

  const totalLines = parsedLineData.length;
  const totalGlowingLines = 0;

  // Will run only one time since dependency is empty, this prevents unwanted problems with useEffect
  const cityGraph = useMemo(() => new Graph(), []); 
  const cityEdgeToIndex = useMemo(() => new Map(), []); // (x1, y1, z1), (x2, y2, z2): index

  // Calculate the center of the map
  const center = useMemo(() => {
    let sumX = 0,
      sumY = 0;
    parsedLineData.forEach(({ start, end }) => {
      sumX += (start[0] + end[0]) / 2;
      sumY += (start[1] + end[1]) / 2;
    });
    return {
      x: sumX / parsedLineData.length,
      y: sumY / parsedLineData.length,
    };
  }, [parsedLineData]);

  // Generate segment properties
  const segmentsProps = useMemo(
    () =>
      parsedLineData.map(({ start, end }) => ({
        coords: [
          [start[0] - center.x, start[1] - center.y],
          [end[0] - center.x, end[1] - center.y],
        ],
        color: tempColor.setHex(lineColor).clone(),
        computedData: {
          length: undefined,
          dx: undefined,
          dy: undefined,
          angle: undefined,
        },
      })),
    [parsedLineData, center.x, center.y]
  );

  // Convert city data into graph data structure
  useEffect(() => {
    cityGraph.clearGraph();
    parsedLineData.forEach(({ start, end }) => {
      const vertex1Coords = [start[0] - center.x, start[1] - center.y, 0];
      const vertex2Coords = [end[0] - center.x, end[1] - center.y, 0];

      if (!cityGraph.findIfCoordsAlreadyExist(...vertex1Coords)) {
        cityGraph.addVertex(...vertex1Coords);
      }
      if (!cityGraph.findIfCoordsAlreadyExist(...vertex2Coords)) {
        cityGraph.addVertex(...vertex2Coords);
      }
      cityGraph.addEdgeWithCoords(
        vertex1Coords,
        vertex2Coords,
        cityGraph.calculateDistance(...vertex1Coords, ...vertex2Coords),
        false
      );
    });
    // cityGraph.printAll(); // <- very laggy with bigger cities, can sometimes crash website
  }, [parsedLineData, cityGraph, center.x, center.y]);

  function addLineToMesh(
    lineMesh,
    tempObject,
    color,
    coords,
    computedData,
    index
  ) {
    const x1 = coords[0][0];
    const y1 = coords[0][1];
    const x2 = coords[1][0];
    const y2 = coords[1][1];

    if (
      computedData.dx === undefined ||
      computedData.y === undefined ||
      computedData.angle === undefined
    ) {
      const startVector = new THREE.Vector3(x1, y1, 0);
      const endVector = new THREE.Vector3(x2, y2, 0);
      const length = endVector.distanceTo(startVector);
      const dx = x2 - x1;
      const dy = y2 - y1;

      computedData.dx = dx;
      computedData.dy = dy;
      computedData.length = length;

      const angle = Math.atan2(dy, dx);

      computedData.angle = angle;
    }

    // set line position
    tempObject.position.set(x1, y1, 0);
    tempObject.rotation.set(0, 0, computedData.angle ?? 0);
    tempObject.scale.set(
      computedData.length ? computedData.length : 1,
      lineWidth,
      1
    );
    tempObject.updateMatrix();

    lineMesh.setMatrixAt(index, tempObject.matrix);
    lineMesh.setColorAt(index, color);
  }

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

      addLineToMesh(lineMesh, tempObject, color, coords, computedData, i);

      // Add to list of edges to be able to change line color directly
      cityEdgeToIndex.set(
        `(${coords[0][0]}, ${coords[0][1]}, 0), (${coords[1][0]}, ${coords[1][1]}, 0)`,
        i
      );
    }

    for (let i = 0; i < totalLines / 10; i++) {
      lineMesh.setColorAt(i, selectedColor);
    }

    // Launch updates
    lineMesh.instanceMatrix.needsUpdate = true;
    lineMesh.instanceColor.needsUpdate = true;
    lineMesh.material.needsUpdate = true;
  }, [segmentsProps, totalLines, cityEdgeToIndex]);

  return (
    <>
      <EffectComposer>
        <Bloom
          intensity={1.0} // The bloom intensity.
          blurPass={undefined} // A blur pass.
          kernelSize={KernelSize.LARGE} // blur kernel size
          luminanceThreshold={0.1} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
          mipmapBlur={false} // Enables or disables mipmap blur.
          resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
          resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
        />
      </EffectComposer>

      <instancedMesh ref={lineMeshRef} args={[null, null, totalLines]}>
        <shapeGeometry args={[lineBaseSeg]} />
        <meshBasicMaterial
          attach="material"
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </instancedMesh>

      <instancedMesh>
        <shapeGeometry args={[lineBaseSeg]} />
        <meshBasicMaterial
          attach="material"
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  );
};

export default CityMap;
